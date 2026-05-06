// pages/record/record.js
const defaultAvatar = '/images/avatar.png'
const app = getApp()
const fetch = app.fetch
Page({
  data: {
    avatarUrl: defaultAvatar,
    orderCount: 0,
    totalAmount: 0,
    list: []
  },
  onLoad: function () {
    wx.showLoading({
      title: '努力加载中'
    })
    fetch('/food/record').then(data => {
      wx.hideLoading()
      this.setData({
        avatarUrl: data.avatarUrl || defaultAvatar,
        nickname: data.nickname || '游客',
        orderCount: data.orderCount || 0,
        totalAmount: data.totalAmount || 0,
        list: data.list || []
      })
    })
  },
  onChooseAvatar: function (e) {
    const { avatarUrl } = e.detail
    this.setData({ avatarUrl })
  },
  // 跳转到菜品评分榜
  goRatings: function() {
    wx.navigateTo({
      url: '/pages/ratings/ratings'
    })
  }
})
