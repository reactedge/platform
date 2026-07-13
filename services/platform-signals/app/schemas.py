from datetime import datetime
from pydantic import BaseModel

class LoadAverage(BaseModel):
    m1: float
    m5: float
    m15: float


class CpuStatus(BaseModel):
    usagePercent: float
    logicalCores: int
    loadAverage: LoadAverage


class SwapStatus(BaseModel):
    usagePercent: float
    totalBytes: int
    usedBytes: int
    freeBytes: int


class MemoryStatus(BaseModel):
    usagePercent: float
    totalBytes: int
    availableBytes: int
    usedBytes: int
    swap: SwapStatus

class DiskStatus(BaseModel):
    usagePercent: float
    totalBytes: int
    usedBytes: int
    freeBytes: int


class RedisStatus(BaseModel):
    connected: bool
    version: str
    role: str
    usedMemoryBytes: int
    connectedClients: int
    keyCount: int


class VarnishStatus(BaseModel):
    connected: bool
    version: int
    cacheHitRate: float
    cacheHits: int
    cacheMisses: int

class PlatformSummary(BaseModel):
    hostname: str
    environment: str
    service: str
    version: str


class SignalSummary(BaseModel):
    cpu: CpuStatus
    memory: MemoryStatus
    disk: DiskStatus
    redis: RedisStatus
    varnish: VarnishStatus


class Summary(BaseModel):
    timestamp: datetime
    platform: PlatformSummary
    signals: SignalSummary
