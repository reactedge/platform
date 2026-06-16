from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings


def setup_cors(app: FastAPI) -> None:
    allowed_origins = settings.allowed_origins()

    app.add_middleware(
        CORSMiddleware,
        allow_origins=allowed_origins,
        allow_credentials=True,
        allow_methods=[
            "GET", "HEAD", "OPTIONS", "PUT", "PATCH", "POST", "DELETE"
        ],
        allow_headers=[
            "Origin",
            "X-Requested-With",
            "Content-Type",
            "Store",
            "Accept",
            "X-Access-Token",
            "X-Correlation-Id"
        ]
    )