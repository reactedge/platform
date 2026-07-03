from fastapi import APIRouter
from app.config import settings

from app.signals.cpu import get_cpu_status
from app.signals.memory import get_memory_status
from app.signals.disk import get_disk_status
from app.signals.redis import get_redis_status
from app.signals.varnish import get_varnish_status

router = APIRouter(prefix=settings.status_prefix)

@router.get("")
def status():
    return {
        "cpu": get_cpu_status(),
        "memory": get_memory_status(),
        "disk": get_disk_status(),
        "redis": get_redis_status(),
        "varnish": get_varnish_status(),
    }