import json
import redis

from app.config import settings


def get_redis_status():

    print(
        f"  + [REDIS] Redis configuration: {json.dumps(settings.model_dump(), indent=2)}",
        flush=True,
    )

    client = redis.Redis(
        host=settings.redis_host,
        port=settings.redis_port,
        db=0,
        decode_responses=True,
    )

    info = client.info()

    return {
        "connected": True,
        "version": info["redis_version"],
        "role": info["role"],
        "usedMemoryBytes": info["used_memory"],
        "connectedClients": info["connected_clients"],
        "keyCount": client.dbsize(),
    }