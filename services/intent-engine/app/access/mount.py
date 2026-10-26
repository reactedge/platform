from fastapi.staticfiles import StaticFiles
from app.config import settings

def setup_static(app):
    app.mount(
        f"/{settings.cdn_folder}",
        StaticFiles(directory=settings.cdn_directory),
        name="cdn"
    )