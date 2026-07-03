import os
import psutil


def get_cpu_status():
    load1, load5, load15 = os.getloadavg()

    return {
        "usagePercent": psutil.cpu_percent(None),
        "logicalCores": psutil.cpu_count(),
        "loadAverage": {
            "1m": round(load1, 2),
            "5m": round(load5, 2),
            "15m": round(load15, 2),
        }
    }