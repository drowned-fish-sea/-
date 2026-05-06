// app.js
App({
  fetch: require('./utils/fetch.js'),
  onLaunch: function () {
    wx.showLoading({
      title: '登录中',
      mask: true
    })
    this.fetch('/user/checkLogin').then(data => {
      if (data.code === 1) {
        // 已登录
        this.onUserLoginReady()
        console.log('登录成功')
      } else {
        // 未登录
        this.login({
          success: () => {			// 登录成功
            this.onUserLoginReady()
          },
          fail: () => {				// 登录失败，重新登录
            this.onLaunch()
          }
        })        
      }
    }, () => {
      this.onLaunch()
    })
  },
  login: function (options) {
    wx.login({
      success: res => {
        this.fetch('/user/login', {
          js_code: res.code
        }).then(data => {
          if (data && data.code === 1) {
            // 保存 sessionId
            if (data.sessionId) {
              wx.setStorageSync('sessionId', data.sessionId)
            }
            options.success()
          } else {
            wx.hideLoading()
            wx.showModal({
              title: '登录失败',
              confirmText: '重试',
              success: res => {
                if (res.confirm) {
                  options.fail()
                }
              }
            })
          }
        }, () => {
          options.fail()
        })
      }
    })  
  },
  userLoginReady: false,
  userLoginReadyCallback: null,
  onUserLoginReady: function() {
    wx.hideLoading()
    if (this.userLoginReadyCallback) {
      this.userLoginReadyCallback()
    }
    this.userLoginReady = true
  }
})
