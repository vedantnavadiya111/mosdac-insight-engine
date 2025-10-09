import os
import threading
import shutil
from datetime import datetime
from sqlalchemy.orm import Session
from app.services.mosdac_client import MosdacClient
from app.db.session import get_db
from app.models.download import DownloadJob
from sqlalchemy.exc import SQLAlchemyError


class DownloadManager:
    def __init__(self, db: Session):
        self.db = db

    def start_download(
        self, user_id: int, dataset_id: str, username: str, password: str
    ):
        """Create job entry and run async download."""
        job = DownloadJob(
            user_id=user_id,
            dataset_id=dataset_id,
            status="pending",
            created_at=datetime.utcnow(),
        )
        self.db.add(job)
        self.db.commit()
        self.db.refresh(job)

        thread = threading.Thread(
            target=self._run_download, args=(job.id, username, password, dataset_id)
        )
        thread.start()
        return job

    def _run_download(self, job_id: int, username: str, password: str, dataset_id: str):
        """Threaded background job execution with isolated DB session."""
        db = next(get_db())
        try:
            job = db.get(DownloadJob, job_id)
            if not job:
                return

            job.status = "running"
            db.commit()

            client = MosdacClient(username, password)
            client.login()

            data = client.search(dataset_id)
            entries = data.get("entries", [])

            base_dir = os.path.join("downloads", f"user_{job.user_id}", dataset_id)
            os.makedirs(base_dir, exist_ok=True)

            successful_downloads = 0

            for entry in entries:
                record_id = entry.get("id")
                identifier = entry.get("identifier")
                if not (record_id and identifier):
                    continue

                file_path = os.path.join(base_dir, identifier)

                try:
                    client.download_file(record_id, identifier, file_path)
                    successful_downloads += 1

                except Exception as e:
                    if "401" in str(e) or "UNAUTHORIZED" in str(e).upper():
                        try:
                            print(
                                f"🔄 Session expired, retrying login for {identifier}..."
                            )
                            client.login()
                            client.download_file(record_id, identifier, file_path)
                            successful_downloads += 1
                        except Exception as retry_err:
                            print(
                                f"❌ Still failed to download {identifier}: {retry_err}"
                            )
                            continue
                    else:
                        print(f"❌ Failed to download {identifier}: {e}")
                        continue

            job = db.get(DownloadJob, job_id)
            if successful_downloads > 0:
                # ✅ Zip the downloaded folder
                zip_path = shutil.make_archive(base_dir, "zip", base_dir)
                job.status = "completed"
                job.file_path = zip_path
                job.error_message = None
            else:
                job.status = "failed"
                job.error_message = "No files were downloaded successfully."

        except SQLAlchemyError as db_err:
            print(f"⚠️ Database error during download job {job_id}: {db_err}")
            db.rollback()
            job = db.get(DownloadJob, job_id)
            if job:
                job.status = "failed"
                job.error_message = "Database connection issue during download."
                db.commit()

        except Exception as e:
            print(f"⚠️ Unexpected error in job {job_id}: {e}")
            job = db.get(DownloadJob, job_id)
            if job:
                job.status = "failed"
                job.error_message = str(e)
                db.commit()

        finally:
            db.close()
