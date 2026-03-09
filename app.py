from flask import Flask
from redis import Redis

app = Flask(__name__)
# 컨테이너 이름인 'db'를 주소로 사용합니다.
redis = Redis(host='db', port=6379) # docker-compose.yml에서 정의한 Redis 서비스의 이름이 'db'이므로, 이를 호스트로 사용합니다.

@app.route('/')
def home():
    count = redis.incr('hits')
    return f'<h1>환영합니다!</h1> {count}번 방문하셨습니다.'
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=3000)