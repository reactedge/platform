import psutil


def get_memory_status():
    memory = psutil.virtual_memory()
    swap = psutil.swap_memory()

    return {
        "usagePercent": memory.percent,
        "totalBytes": memory.total,
        "availableBytes": memory.available,
        "usedBytes": memory.used,
        "swap": {
            "usagePercent": swap.percent,
            "totalBytes": swap.total,
            "usedBytes": swap.used,
            "freeBytes": swap.free,
        },
    }