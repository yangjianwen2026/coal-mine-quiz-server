# 快速启动指南

## 第一步：启动后端服务器

```bash
cd coal-mine-quiz-server
npm start
```

看到以下输出表示启动成功：
```
煤矿答题后端已启动：http://localhost:3000
```

## 第二步：导入微信小程序

1. 打开**微信开发者工具**
2. 点击 **+** 导入项目
3. 项目目录选择：`C:\Users\newna\.qclaw\workspace\coal-mine-quiz`
4. AppID 选择"测试号"（或填写你的小程序 AppID）
5. 项目名称：`煤矿安全培训`

## 第三步：测试功能

### 1. 注册账号
- 点击"立即登录" → "立即注册"
- 填写用户名、密码
- 选择你的工种
- 点击"注册"

### 2. 登录
- 使用注册的账号登录

### 3. 开始答题
- 在首页选择你的工种
- 点击"开始答题"
- 答题完成后查看结果

### 4. 查看积分商城
- 点击底部"积分商城"标签
- 用积分兑换礼品

### 5. 查看排行榜
- 点击底部"排行榜"标签
- 查看全站排名

## 常见问题

### Q: 后端启动失败？
A: 检查端口 3000 是否被占用，或修改 `config.js` 中的端口号

### Q: 小程序无法连接后端？
A: 在微信开发者工具中：
- 详情 → 本地设置 → 勾选"不校验合法域名"
- 确保后端已启动

### Q: 如何添加更多题目？
A: 编辑 `coal-mine-quiz-server/db.js` 中的 `defaultData.questions` 数组

## 项目文件位置

- **前端小程序**：`C:\Users\newna\.qclaw\workspace\coal-mine-quiz\`
- **后端服务器**：`C:\Users\newna\.qclaw\workspace\coal-mine-quiz-server\`
- **数据库文件**：`C:\Users\newna\.qclaw\workspace\coal-mine-quiz-server\data\db.json`

## 下一步

1. **完善题库**：根据实际需求添加更多专业题目
2. **部署上线**：参考 `README.md` 中的上线指南
3. **定制功能**：根据需要修改界面和功能

---

如有问题，请随时联系！
