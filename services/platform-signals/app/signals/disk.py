import psutil


def get_disk_status():
    disk = psutil.disk_usage("/")

    return {
        "usagePercent": disk.percent,
        "totalBytes": disk.total,
        "usedBytes": disk.used,
        "freeBytes": disk.free,
    }