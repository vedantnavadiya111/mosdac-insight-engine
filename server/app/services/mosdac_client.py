import requests
from typing import Any, Dict


class MosdacClient:
    BASE_URL = "https://mosdac.gov.in"

    def __init__(self, username: str, password: str):
        self.username = username
        self.password = password
        self.access_token = None
        self.refresh_token = None

    def login(self) -> Dict[str, Any]:
        """Authenticate and store tokens."""
        url = f"{self.BASE_URL}/download_api/gettoken"
        payload = {"username": self.username, "password": self.password}
        res = requests.post(url, json=payload)
        res.raise_for_status()

        data = res.json()
        self.access_token = data["access_token"]
        self.refresh_token = data["refresh_token"]
        return data

    def search(self, dataset_id: str, **filters) -> Dict[str, Any]:
        """Search dataset entries."""
        url = f"{self.BASE_URL}/apios/datasets.json"
        params = {"datasetId": dataset_id, **{k: v for k, v in filters.items() if v}}
        res = requests.get(url, params=params)
        res.raise_for_status()
        return res.json()

    def download_file(self, record_id: str, identifier: str, dest_path: str) -> str:
        """Download a single file from MOSDAC API."""
        if not self.access_token:
            raise ValueError("You must call login() before downloading.")

        headers = {"Authorization": f"Bearer {self.access_token}"}
        params = {"id": record_id}

        with requests.get(
            f"{self.BASE_URL}/download_api/download",
            headers=headers,
            params=params,
            stream=True,
        ) as r:
            r.raise_for_status()
            with open(dest_path, "wb") as f:
                for chunk in r.iter_content(chunk_size=8192):
                    if chunk:
                        f.write(chunk)

        return dest_path
