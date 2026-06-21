// 煤矿答题小程序后端配置
module.exports = {
  port: process.env.PORT || 3000,
  jwtSecret: process.env.JWT_SECRET || 'coal-mine-quiz-secret-key-change-this',
  dbPath: './data/db.json'
}
