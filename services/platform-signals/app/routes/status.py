from fastapi import APIRouter
from app.config import settings

from app.models.signals.cpu import get_cpu_status
from app.models.signals.memory import get_memory_status
from app.models.signals.disk import get_disk_status
from app.models.signals.redis import get_redis_status
from app.models.signals.varnish import get_varnish_status
from app.schemas import Summary, PlatformSummary, SignalSummary
from datetime import datetime

router = APIRouter(prefix=settings.status_prefix)

@router.get("")
def status():
	return Summary(
        timestamp=datetime.utcnow(),
        platform=PlatformSummary(
            hostname=settings.hostname,
            environment=settings.environment,
            service="platform-signals",
            version="0.1.0",
        ),
        signals=SignalSummary(
            cpu=get_cpu_status(),
            memory=get_memory_status(),
            disk=get_disk_status(),
            redis=get_redis_status(),
            varnish=get_varnish_status(),
        ),
    )