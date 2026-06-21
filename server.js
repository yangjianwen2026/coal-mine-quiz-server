const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const path = require('path')
const fs = require('fs')

const config = require('./config')
const { getDB, saveNow, generateId } = require('./db')

const app = express()
app.use(cors())
app.use(bodyParser.json())

// 根路径
app.get('/', (req, res) => {
  res.json({
    message: '煤矿安全培训答题练习小程序后端 API',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      register: 'POST /api/auth/register',
      login: 'POST /api/auth/login',
      quiz: '/api/quiz',
      user: '/api/user'
    }
  })
})

// 日志中间件
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`)
  next()
})

// 认证中间件
function auth(req, res, next) {
  const token = req.headers.authorization?.replace('Bearer ', '')
  if (!token) {
    return res.status(401).json({ error: '缺少 token' })
  }
  try {
    const decoded = jwt.verify(token, config.jwtSecret)
    req.user = decoded
    next()
  } catch (e) {
    return res.status(401).json({ error: 'token 无效' })
  }
}

// ========== 用户注册 ==========
app.post('/api/auth/register', (req, res) => {
  const { username, password, workTypeId } = req.body
  
  if (!username || !password) {
    return res.status(400).json({ error: '用户名和密码不能为空' })
  }

  const db = getDB()
  
  // 检查用户名是否已存在
  const existingUser = Object.values(db.users).find(u => u.username === username)
  if (existingUser) {
    return res.status(400).json({ error: '用户名已存在' })
  }

  const userId = generateId()
  const hashedPassword = bcrypt.hashSync(password, 10)
  
  const workType = db.workTypes.find(w => w.id === workTypeId)
  
  db.users[userId] = {
    id: userId,
    username,
    password: hashedPassword,
    workTypeId,
    workTypeName: workType ? workType.name : '',
    nickname: username,
    points: 0,
    totalAnswered: 0,
    correctCount: 0,
    correctRate: 0,
    createdAt: new Date().toISOString()
  }
  
  saveNow()
  
  const token = jwt.sign({ userId }, config.jwtSecret, { expiresIn: '7d' })
  res.json({ token, user: db.users[userId] })
})

// ========== 用户登录 ==========
app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body
  
  if (!username || !password) {
    return res.status(400).json({ error: '用户名和密码不能为空' })
  }

  const db = getDB()
  const user = Object.values(db.users).find(u => u.username === username)
  
  if (!user || !bcrypt.compareSync(password, user.password)) {
    return res.status(401).json({ error: '用户名或密码错误' })
  }

  const token = jwt.sign({ userId: user.id }, config.jwtSecret, { expiresIn: '7d' })
  res.json({ token, user })
})

// ========== 获取当前用户信息 ==========
app.get('/api/users/me', auth, (req, res) => {
  const db = getDB()
  const user = db.users[req.user.userId]
  
  if (!user) {
    return res.status(404).json({ error: '用户不存在' })
  }
  
  res.json(user)
})

// ========== 获取题库 ==========
app.get('/api/questions', (req, res) => {
  const { workTypeId, limit } = req.query
  const db = getDB()
  
  let questions = db.questions
  
  if (workTypeId) {
    questions = questions.filter(q => q.workTypeId === parseInt(workTypeId))
  }
  
  // 随机打乱题目
  questions = questions.sort(() => Math.random() - 0.5)
  
  if (limit) {
    questions = questions.slice(0, parseInt(limit))
  }
  
  res.json(questions)
})

// ========== 提交答题记录 ==========
app.post('/api/records', auth, (req, res) => {
  const { questionId, workTypeId, isCorrect, earnedPoints } = req.body
  const db = getDB()
  const user = db.users[req.user.userId]
  
  if (!user) {
    return res.status(404).json({ error: '用户不存在' })
  }
  
  // 创建答题记录
  const record = {
    id: generateId(),
    userId: user.id,
    questionId,
    workTypeId,
    isCorrect,
    earnedPoints: earnedPoints || 0,
    createdAt: new Date().toISOString()
  }
  
  db.records.push(record)
  
  // 更新用户统计
  user.totalAnswered += 1
  if (isCorrect) {
    user.correctCount += 1
    user.points += (earnedPoints || 0)
  }
  user.correctRate = Math.round((user.correctCount / user.totalAnswered) * 100)
  
  saveNow()
  res.json({ success: true, record })
})

// ========== 获取答题记录 ==========
app.get('/api/records', auth, (req, res) => {
  const { limit } = req.query
  const db = getDB()
  const userId = req.user.userId
  
  let records = db.records
    .filter(r => r.userId === userId)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  
  // 添加题目文本
  records = records.map(r => {
    const question = db.questions.find(q => q.id === r.questionId)
    return {
      ...r,
      questionText: question ? question.question : '题目已删除'
    }
  })
  
  if (limit) {
    records = records.slice(0, parseInt(limit))
  }
  
  res.json(records)
})

// ========== 积分兑换 ==========
app.post('/api/exchange', auth, (req, res) => {
  const { goodsId, goodsName, points } = req.body
  const db = getDB()
  const user = db.users[req.user.userId]
  
  if (!user) {
    return res.status(404).json({ error: '用户不存在' })
  }
  
  if (user.points < points) {
    return res.status(400).json({ error: '积分不足' })
  }
  
  // 扣除积分
  user.points -= points
  
  // 创建兑换记录
  const exchangeRecord = {
    id: generateId(),
    userId: user.id,
    goodsId,
    goodsName,
    points,
    status: 'pending',  // pending, completed
    createdAt: new Date().toISOString()
  }
  
  db.exchangeRecords.push(exchangeRecord)
  saveNow()
  
  res.json({ success: true, exchangeRecord })
})

// ========== 获取排行榜 ==========
app.get('/api/rankings', (req, res) => {
  const { limit } = req.query
  const db = getDB()
  
  let users = Object.values(db.users)
    .sort((a, b) => b.points - a.points)
  
  if (limit) {
    users = users.slice(0, parseInt(limit))
  }
  
  res.json(users)
})

// ========== 健康检查 ==========
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() })
})

// 启动服务器
app.listen(config.port, () => {
  console.log(`煤矿答题后端已启动：http://localhost:${config.port}`)
})

module.exports = app
