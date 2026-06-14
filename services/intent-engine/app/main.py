from fastapi import FastAPI
from app.core.cors import setup_cors
from app.access.mount import setup_static
from app.config import settings
from app.config import output_config
from app.routes.interpret import router as interpret_router
from app.routes.suggest import router as suggest_router

app = FastAPI()
setup_cors(app)
setup_static(app)

@app.on_event("startup")
async def startup_event():
    output_config()

app.include_router(interpret_router)
app.include_router(suggest_router)

@app.get("/health")
def health():
    return {"status": "ok"}