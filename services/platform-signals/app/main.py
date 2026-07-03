from fastapi import FastAPI
from app.core.cors import setup_cors
from app.config import settings
from app.config import output_config
from app.routes.status import router as status_router

app = FastAPI()
setup_cors(app)

@app.on_event("startup")
async def startup_event():
    output_config()

app.include_router(status_router)