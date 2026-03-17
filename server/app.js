const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const rideRoutes = require('./routes/ride');
const reportRoutes = require('./routes/report');
const pointRoutes = require('./routes/point');
const mapRoutes = require('./routes/map');
const quizRoutes = require('./routes/quiz');
const usageRoutes = require('./routes/usage');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('타슈와 함께하는 탄소 중립 앱 서버');
});

app.use('/auth', authRoutes);
app.use('/ride', rideRoutes);
app.use('/report', reportRoutes);
app.use('/point', pointRoutes);
app.use('/map', mapRoutes);
app.use('/quiz', quizRoutes);
app.use('/usage', usageRoutes);

app.listen(port, () => {
  console.log(`서버가 http://localhost:${port} 에서 실행 중입니다.`);
});
