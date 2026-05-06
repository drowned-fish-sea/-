const app = getApp()
const fetch = app.fetch
const config = require('../../../utils/config.js')
console.log('config:', config)
Page({
  data: {},
  comment: '',
  onLoad: function (options) {
    wx.showLoading({
      title: '努力加载中'
    })
    fetch('/food/order', {
      id: options.order_id
    }).then(data => {
      console.log('order data:', data)
      // 处理图片路径，添加完整 URL
      if (data.order_food) {
        data.order_food = data.order_food.map(item => {
          console.log('item.image_url:', item.image_url)
          if (item.image_url && !item.image_url.startsWith('http')) {
            item.image_url = config.imageUrl + item.image_url
            console.log('new image_url:', item.image_url)
          }
          return item
        })
      }
      this.setData(data)
      wx.hideLoading()
    }, () => {
      this.onLoad(options)
    })
  },
  inputComment: function (e) {
    console.log(e)
    this.comment = e.detail.value
  },
  pay: function () {
    var id = this.data.id
    wx.showLoading({
      title: '正在支付'
    })
    fetch('/food/order', {
      id: id,
      comment: this.comment
    }, 'POST').then(() => {
      return fetch('/food/pay', { id }, 'POST')
    }).then(() => {
      wx.hideLoading()
      wx.showToast({
        title: '支付成功',
        icon: 'success',
        duration: 2000,
        success: () => {
          wx.navigateTo({
            url: '/pages/order/detail/detail?order_id=' + id
          })
        }
      })
    }).catch(() => {
      this.pay()
    })
  }
  
})