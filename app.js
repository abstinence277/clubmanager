// app.js
App({
  globalData:{
    ID:'',
    name:'',
    sex:'',
    grade:'',
    major:'',
    userInfo: null
  },
  onLaunch() {
    // 展示本地存储能力
    const logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })

    // 云开发
    wx.cloud.init({
      env:'club-manager-3ghmftue4e9f0d99' //云开发环境id
    })
  },
  globalData: {
    userInfo: null,
  }
})
