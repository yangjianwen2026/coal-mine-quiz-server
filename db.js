const fs = require('fs')
const path = require('path')
const config = require('./config')

const dbDir = path.dirname(config.dbPath)
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true })
}

// 默认数据（包含题库）
const defaultData = {
  users: {},
  questions: [
    // 采煤工题库
    { id: 'q001', workTypeId: 1, type: 'single', question: '采煤工作面必须保持几个安全出口？', options: ['1个', '2个', '3个', '4个'], correctAnswer: 1, explanation: '采煤工作面必须保持至少2个安全出口，确保紧急情况下人员可以安全撤离。' },
    { id: 'q002', workTypeId: 1, type: 'judge', question: '采煤工作面可以采用前进式开采。', options: ['正确', '错误'], correctAnswer: 1, explanation: '错误。采煤工作面应采用后退式开采，有利于安全管理。' },
    { id: 'q003', workTypeId: 1, type: 'single', question: '采煤工作面风流中瓦斯浓度达到多少时必须停止工作？', options: ['0.5%', '1.0%', '1.5%', '2.0%'], correctAnswer: 2, explanation: '采煤工作面风流中瓦斯浓度达到1.5%时必须停止工作，切断电源，撤出人员。' },
    { id: 'q004', workTypeId: 1, type: 'multiple', question: '采煤工作面顶板灾害防治措施有哪些？', options: ['加强支护', '及时放顶', '监测顶板移动', '增加采煤速度'], correctAnswer: [0, 1, 2], explanation: '顶板灾害防治应采取加强支护、及时放顶、监测顶板移动等综合措施。' },
    
    // 掘进工题库
    { id: 'q005', workTypeId: 2, type: 'single', question: '掘进工作面瓦斯浓度超过多少时严禁装药爆破？', options: ['0.5%', '1.0%', '1.5%', '2.0%'], correctAnswer: 1, explanation: '掘进工作面瓦斯浓度超过1.0%时严禁装药爆破，防止瓦斯爆炸。' },
    { id: 'q006', workTypeId: 2, type: 'judge', question: '掘进工作面可以不设瓦斯检查点。', options: ['正确', '错误'], correctAnswer: 1, explanation: '错误。掘进工作面必须设置瓦斯检查点，定期检测瓦斯浓度。' },
    
    // 机电工题库
    { id: 'q007', workTypeId: 3, type: 'single', question: '井下电气设备必须使用什么类型的设备？', options: ['普通型', '防爆型', '防水型', '防尘型'], correctAnswer: 1, explanation: '井下电气设备必须使用防爆型设备，防止电气火花引起瓦斯爆炸。' },
    { id: 'q008', workTypeId: 3, type: 'judge', question: '井下可以带电检修电气设备。', options: ['正确', '错误'], correctAnswer: 1, explanation: '错误。井下严禁带电检修电气设备，必须停电后进行操作。' },
    
    // 安全员题库
    { id: 'q009', workTypeId: 5, type: 'single', question: '发现瓦斯突出预兆时，应该怎么做？', options: ['继续工作', '立即报告并撤离', '自行处理', '等待指示'], correctAnswer: 1, explanation: '发现瓦斯突出预兆时，应立即报告并撤离到安全地点，确保人员安全。' },
    { id: 'q010', workTypeId: 5, type: 'multiple', question: '煤矿安全管理的基本原则有哪些？', options: ['安全第一', '预防为主', '综合治理', '效益优先'], correctAnswer: [0, 1, 2], explanation: '煤矿安全管理应遵循安全第一、预防为主、综合治理的原则。' }
  ],
  records: [],
  exchangeRecords: [],
  workTypes: [
    { id: 1, name: '采煤工' },
    { id: 2, name: '掘进工' },
    { id: 3, name: '机电工' },
    { id: 4, name: '运输工' },
    { id: 5, name: '安全员' },
    { id: 6, name: '瓦斯检查工' },
    { id: 7, name: '通风工' },
    { id: 8, name: '爆破工' }
  ]
}

function loadDB() {
  if (!fs.existsSync(config.dbPath)) {
    return JSON.parse(JSON.stringify(defaultData))
  }
  try {
    return JSON.parse(fs.readFileSync(config.dbPath, 'utf-8'))
  } catch (e) {
    console.error('读取数据库失败，使用默认数据', e)
    return JSON.parse(JSON.stringify(defaultData))
  }
}

function saveDB(db) {
  fs.writeFileSync(config.dbPath, JSON.stringify(db, null, 2))
}

let db = loadDB()

// 自动保存
setInterval(() => saveDB(db), 5000)

function getDB() {
  return db
}

function saveNow() {
  saveDB(db)
}

// 工具函数
function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 6)
}

function generateToken() {
  return Math.random().toString(36).substr(2) + Date.now().toString(36)
}

module.exports = {
  getDB,
  saveNow,
  generateId,
  generateToken
}
