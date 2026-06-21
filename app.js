const express = require('express');
const app = express();

// 解决 Cannot GET / 首页报错
app.get('/', (req, res) => {
  res.send('<h3>煤矿问答服务器运行正常</h3>');
});

// 你原来所有的接口代码保持不动
// app.get('/xxx', ...)

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`服务启动成功，端口：${port}`);
});App({
  globalData: {
    userInfo: null,
    token: null,
    apiBase: 'http://localhost:3000/api',  // 上线前改成你的 HTTPS 域名
    workTypes: [
      { id: 1, name: '采煤工', icon: '⛏️' },
      { id: 2, name: '掘进工', icon: '🔨' },
      { id: 3, name: '机电工', icon: '⚡' },
      { id: 4, name: '运输工', icon: '🚂' },
      { id: 5, name: '安全员', icon: '🛡️' },
      { id: 6, name: '瓦斯检查工', icon: '🔍' },
      { id: 7, name: '通风工', icon: '💨' },
      { id: 8, name: '爆破工', icon: '💥' }
    ]
  },

  onLaunch() {
    console.log('煤矿答题小程序启动')
    this.checkLogin()
  },

  checkLogin() {
    const token = wx.getStorageSync('token')
    if (token) {
      this.globalData.token = token
    }
  },

  // 封装请求
  request(options) {
    return new Promise((resolve, reject) => {
      wx.request({
        url: this.globalData.apiBase + options.url,
        method: options.method || 'GET',
        data: options.data || {},
        header: {
          'Authorization': 'Bearer ' + (this.globalData.token || ''),
          'Content-Type': 'application/json'
        },
        success: (res) => {
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve(res.data)
          } else {
            reject(res.data)
          }
        },
        fail: reject
      })
    })
  },

  // 微信登录
  async login(code) {
    try {
      const data = await this.request({
        url: '/login',
        method: 'POST',
        data: { code }
      })
      this.globalData.token = data.token
      this.globalData.userInfo = data.user
      wx.setStorageSync('token', data.token)
      return data
    } catch (err) {
      console.error('登录失败:', err)
      throw err
    }
  }
})
