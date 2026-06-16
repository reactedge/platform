FROM python:3.11-slim

WORKDIR /app

COPY docker/requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt
RUN pip install pytest

# Only copy python service
COPY . /app
COPY .env /app/.env
COPY .env /.env

EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]