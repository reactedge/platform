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
            "GET", "HEAD", "OPTIONS"
        ],
        allow_headers=[
            "Origin",
            "Content-Type",
            "Accept"
        ],
    )