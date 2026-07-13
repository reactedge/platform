from dataclasses import dataclass
import uuid

@dataclass(frozen=True)
class RequestContext:
    request_trace_id: str
    correlation_id: str

    @staticmethod
    def create():
        return RequestContext(
            request_trace_id=str(uuid.uuid4()),
            correlation_id=str(uuid.uuid4())
        )