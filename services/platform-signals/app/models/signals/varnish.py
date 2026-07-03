import json
import subprocess

def get_varnish_status():

    result = subprocess.run(
        [
            "docker",
            "exec",
            "mageos_varnish",
            "varnishstat",
            "-j",
        ],
        capture_output=True,
        text=True,
        check=True,
    )

    stats = json.loads(result.stdout)

    hits = stats["counters"]["MAIN.cache_hit"]["value"]
    misses = stats["counters"]["MAIN.cache_miss"]["value"]

    requests = hits + misses

    hit_rate = 0.0
    if requests > 0:
        hit_rate = round((hits / requests) * 100, 2)

    return {
        "connected": True,
        "version": stats["version"],
        "cacheHitRate": hit_rate,
        "cacheHits": hits,
        "cacheMisses": misses,
    }