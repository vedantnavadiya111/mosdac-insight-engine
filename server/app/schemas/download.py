from pydantic import BaseModel
from datetime import datetime
from typing import Optional


class DownloadStartRequest(BaseModel):
    dataset_id: str
    mosdac_username: str
    mosdac_password: str


class DownloadStatusResponse(BaseModel):
    id: int
    status: str
    file_path: Optional[str] = None
    created_at: datetime
    error_message: Optional[str] = None

    class Config:
        from_attributes = True
