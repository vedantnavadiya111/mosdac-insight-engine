from fastapi import APIRouter, Depends, HTTPException, Query
from typing import List
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.schemas.download import DownloadStartRequest, DownloadStatusResponse
from app.services.download_manager import DownloadManager
from app.models.download import DownloadJob
from app.routes.chat import get_current_user

router = APIRouter()


@router.post("/start", response_model=DownloadStatusResponse)
def start_download(
    req: DownloadStartRequest,
    db: Session = Depends(get_db),
    user=Depends(get_current_user),
):
    manager = DownloadManager(db)
    job = manager.start_download(
        user.id, req.dataset_id, req.mosdac_username, req.mosdac_password
    )
    return job


@router.get("/status/{job_id}", response_model=DownloadStatusResponse)
def get_status(
    job_id: int, db: Session = Depends(get_db), user=Depends(get_current_user)
):
    job = db.get(DownloadJob, job_id)
    if not job or job.user_id != user.id:
        raise HTTPException(status_code=404, detail="Job not found")
    return job


@router.get("/history", response_model=List[DownloadStatusResponse])
def get_history(
    db: Session = Depends(get_db),
    user=Depends(get_current_user),
    status: str | None = Query(
        None, description="Filter by job status (pending, running, completed, failed)"
    ),
    limit: int = Query(20, description="Number of results to return"),
):
    query = db.query(DownloadJob).filter(DownloadJob.user_id == user.id)
    if status:
        query = query.filter(DownloadJob.status == status)
    jobs = query.order_by(DownloadJob.created_at.desc()).limit(limit).all()
    return jobs
