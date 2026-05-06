// pages/ratings/reviews.js
const app = getApp()
const fetch = app.fetch
Page({
  data: {
    foodId: null,
    avgRating: 0,
    reviewCount: 0,
    list: [],
    loading: true
  },
  onLoad: function(options) {
    if (options.foodId) {
      this.setData({ foodId: options.foodId })
      this.loadReviews()
    }
  },
  loadReviews: function() {
    this.setData({ loading: true })
    wx.showLoading({ title: '加载中...' })
    
    fetch('/food/reviews', { foodId: this.data.foodId }).then(data => {
      wx.hideLoading()
      if (data.code === 1) {
        this.setData({
          avgRating: data.avgRating || 0,
          reviewCount: data.reviewCount || 0,
          list: data.list || [],
          loading: false
        })
      } else {
        this.setData({ list: [], loading: false })
      }
    }).catch(() => {
      wx.hideLoading()
      this.setData({ list: [], loading: false })
    })
  }
})
