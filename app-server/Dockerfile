FROM python:3.11-slim

WORKDIR /app

# 1. requirements.txt를 먼저 복사 (캐시 효율을 위해)
COPY requirements.txt .

# 필수 라이브러리 설치 (fastapi, uvicorn 등)
RUN pip install --no-cache-dir -r requirements.txt
# requirements.txt는 python 전용

# 3. main.py의 나머지 코드 복사
COPY . .

# Nginx(프록시)가 3000번 포트로 전달하기로 했으므로, 포트를 맞춥니다.
EXPOSE 3000

# uvicorn을 사용해 서버 실행
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "3000"]