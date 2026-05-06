const config = require('./config.js')

// 获取 sessionId（每次请求时获取最新值）
function getSessionId() {
  return wx.getStorageSync('sessionId') || ''
}

module.exports = function(path, data, method) {
  return new Promise((resolve, reject) => {
    var sessionId = getSessionId()
    
    wx.request({
      url: config.baseUrl + path,
      method: method || 'GET',
      data: data,
      header: {
        'Content-Type': 'application/json',
        'Cookie': sessionId ? 'sessionId=' + sessionId : ''
      },
      success: function(res) {
        // 保存新的 sessionId（如果有）
        var setCookie = res.header['Set-Cookie'] || res.header['set-cookie']
        if (setCookie) {
          var match = setCookie.match(/sessionId=([^;]+)/)
          if (match && match[1]) {
            wx.setStorageSync('sessionId', match[1])
          }
        }
        
        // 调试日志
        console.log('请求:', path, '状态:', res.statusCode)
        console.log('sessionId:', sessionId)
        
        // 返回数据
        if (res.statusCode === 200) {
          resolve(res.data)
        } else {
          reject(res.data)
        }
      },
      fail: function(err) {
        console.log('请求失败:', err)
        reject(err)
      }
    })
  })
}
