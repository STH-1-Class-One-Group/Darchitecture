# 사용할 언어의 버전이 깔린 가벼운 리눅스를 베이스로 사용함
FROM python:3.9-slim

# 작업할 디렉토리 설정
WORKDIR /app

# 현재 폴더의 모든 파일을 컨테이너 내부의 /app으로 복사
COPY . .

RUN pip install -r requirements.txt
EXPOSE 3000

# 4. 컨테이너가 실행될 때 파이썬 실행
CMD ["python", "app.py"]