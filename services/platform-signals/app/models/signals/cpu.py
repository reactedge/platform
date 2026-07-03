import os
import psutil
from app.schemas import LoadAverage

def get_cpu_status():
    load1, load5, load15 = os.getloadavg()

    return {
        "usagePercent": psutil.cpu_percent(None),
        "logicalCores": psutil.cpu_count(),
        "loadAverage": LoadAverage(
           m1=round(load1, 2),
           m5=round(load5, 2),
           m15=round(load15, 2),
        ),
    }