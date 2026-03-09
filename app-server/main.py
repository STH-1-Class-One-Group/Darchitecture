from fastapi import FastAPI
from fastapi.responses import PlainTextResponse

app = FastAPI()

@app.get("/")
async def root():
    # 기존 CF 워커의 "Hello, abcd!" 로직
    return PlainTextResponse("Hello, abcd! (from FastAPI in Docker)")

# 필요한 경우 대전 공공 API 연동 예시
@app.get("/daejeon-data")
async def get_data():
    return {"message": "대전 관광/산업 데이터 준비 중"}