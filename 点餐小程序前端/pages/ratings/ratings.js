// pages/ratings/ratings.js
const app = getApp()
const fetch = app.fetch
const config = require('../../utils/config.js')
Page({
  data: {
    list: [],
    loading: true
  },
  onLoad: function() {
    this.loadRatings()
  },
  onShow: function() {
    // 每次显示页面时刷新数据
    this.loadRatings()
  },
  loadRatings: function() {
    this.setData({ loading: true })
    wx.showLoading({ title: '加载中...' })
    
    fetch('/food/ratings').then(data => {
      wx.hideLoading()
      if (data.code === 1) {
        // 处理图片路径
        const list = (data.list || []).map(item => {
          if (item.image && !item.image.startsWith('http')) {
            item.image = config.imageUrl + item.image
          }
          return item
        })
        this.setData({ list, loading: false })
      } else {
        this.setData({ list: [], loading: false })
      }
    }).catch(() => {
      wx.hideLoading()
      this.setData({ list: [], loading: false })
    })
  },
  viewReviews: function(e) {
    const foodId = e.currentTarget.dataset.foodId
    wx.navigateTo({
      url: '/pages/ratings/reviews?foodId=' + foodId
    })
  }
})
