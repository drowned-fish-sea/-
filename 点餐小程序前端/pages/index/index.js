// index.js
const app = getApp()
const fetch = app.fetch
const config = require('../../utils/config.js')

Page({
  data: {
    swiper: [],
    ad: '',
    category: []
  },
  onLoad: function () {
    var callback = () => {
      wx.showLoading({
        title: '努力加载中',
        mask: true
      })
      fetch('/food/index').then(data => {
        wx.hideLoading()
        // 拼接图片完整路径
        var baseUrl = config.baseUrl.replace('/api', '')
        this.setData({
          swiper: data.img_swiper.map(item => baseUrl + item),
          ad: baseUrl + data.img_ad,
          category: data.img_category.map(item => ({
            ...item,
            icon: baseUrl + item.icon
          }))
        })
      }, () => {
        callback()
      })
    }
    if (app.userLoginReady) {
      callback()
    } else {
      app.userLoginReadyCallback = callback
    }  
  },
  start: function () {
    wx.navigateTo({
      url: '/pages/list/list',
    })
  }
  
})
