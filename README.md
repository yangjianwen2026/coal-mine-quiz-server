# 煤矿安全培训答题练习小程序

一个功能完整的煤矿安全培训答题练习微信小程序，支持多工种专业分类、积分系统、礼品兑换、排行榜等功能。

## 功能特点

### 🎯 核心功能
- **多工种专业分类**：采煤工、掘进工、机电工、运输工、安全员、瓦斯检查工、通风工、爆破工
- **题库系统**：按工种分类，支持单选题、多选题、判断题
- **答题练习**：随机出题、限时答题、立即显示正确答案和解析
- **积分系统**：答题正确获得积分，连续答对额外奖励

### 🎁 积分商城
- 积分可以兑换实物礼品（安全帽、手套、毛巾、水杯等）
- 兑换记录管理

### 🏆 排行榜
- 展示积分排行榜，激励用户学习
- 查看自己在全站的排名

### 👤 用户系统
- 注册、登录、个人信息管理
- 学习记录查询
- 正确率统计

## 技术栈

### 前端
- 微信小程序原生开发
- 界面简洁清晰，适合煤矿工人在手机上使用

### 后端
- Node.js + Express
- JSON 文件数据库（方便部署，无需安装数据库）
- JWT 用户认证

## 安装和运行

### 1. 安装后端依赖

```bash
cd coal-mine-quiz-server
npm install
```

### 2. 启动后端服务器

```bash
npm start
```

服务器将在 http://localhost:3000 启动

### 3. 导入微信小程序

1. 下载并安装[微信开发者工具](https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html)
2. 打开微信开发者工具，选择"导入项目"
3. 项目目录选择 `coal-mine-quiz/` 文件夹
4. 使用你的小程序 AppID（测试阶段可以使用测试号）

### 4. 配置 API 地址

在 `coal-mine-quiz/app.js` 中修改 `apiBase`：

```javascript
// 本地开发
apiBase: 'http://localhost:3000/api'

// 上线前改成你的 HTTPS 域名
// apiBase: 'https://your-domain.com/api'
```

## 微信小程序上线指南

### 1. 申请小程序账号
- 前往 [微信公众平台](https://mp.weixin.qq.com/) 注册小程序账号
- 个人账号无法使用支付功能，但不影响答题和积分功能

### 2. 域名和服务器
- 购买云服务器（阿里云、腾讯云等）
- 购买域名并备案
- 申请 SSL 证书（必须 HTTPS）

### 3. 部署后端
```bash
# 安装 PM2 进程管理工具
npm install -g pm2

# 使用 PM2 启动后端
cd coal-mine-quiz-server
pm2 start server.js --name coal-mine-quiz
pm2 save
pm2 startup
```

### 4. 配置小程序
在微信公众平台：
- 开发 → 开发管理 → 开发设置 → 服务器域名
- 添加你的 HTTPS 域名到 request 合法域名

### 5. 提交审核
- 在微信开发者工具中点击"上传"
- 在微信公众平台提交审核
- 审核通过后发布

## 题库扩展

在 `coal-mine-quiz-server/db.js` 中的 `defaultData.questions` 数组添加更多题目：

```javascript
{
  id: 'q011',
  workTypeId: 1,  // 工种ID
  type: 'single', // single/multiple/judge
  question: '题目内容',
  options: ['选项A', '选项B', '选项C', '选项D'],
  correctAnswer: 0, // 正确答案索引（多选题是数组）
  explanation: '答案解析'
}
```

## 注意事项

1. **个人小程序限制**：
   - 无法使用微信支付（但不影响积分兑换功能，可以线下发放礼品）
   - 部分高级功能可能受限

2. **数据安全**：
   - 上线前请修改 `config.js` 中的 `jwtSecret`
   - 建议改用 MySQL 或 MongoDB 数据库

3. **题库内容**：
   - 请根据实际煤矿安全培训内容完善题库
   - 建议请专业人士审核题目准确性

## 项目结构

```
coal-mine-quiz/              # 微信小程序前端
├── pages/
│   ├── index/              # 首页（选择工种）
│   ├── login/              # 登录页
│   ├── register/           # 注册页
│   ├── quiz/               # 答题页
│   ├── result/             # 结果页
│   ├── shop/               # 积分商城
│   ├── ranking/            # 排行榜
│   └── profile/            # 个人中心
├── app.js
├── app.json
└── app.wxss

coal-mine-quiz-server/       # Node.js 后端
├── server.js               # 主服务器
├── config.js               # 配置
├── db.js                   # 数据库操作
├── package.json
└── data/                   # 数据存储目录
    └── db.json
```

## 许可证

MIT License

## 支持

如有问题，请提交 Issue 或联系开发者。
