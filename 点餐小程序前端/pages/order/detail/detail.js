// pages/order/detail/detail.js
const app = getApp()
const fetch = app.fetch
const config = require('../../../utils/config.js')
Page({
  data: {
    showRateModal: false,
    rateFoodId: null,
    rateFoodName: '',
    rating: 5,
    comment: '',
    ratedFoods: []
  },
  onLoad: function (options) {
    console.log('detail options:', options)
    console.log('detail order_id:', options.order_id)
    var id = options.order_id
    wx.showLoading({
      title: '努力加载中'
    })
    fetch('/food/order', {
      id: id
    }).then(data => {
      console.log('detail data:', JSON.stringify(data, null, 2))
      console.log('detail order_food:', data.order_food)
      // 处理图片路径，添加完整 URL
      if (data.order_food) {
        data.order_food = data.order_food.map(item => {
          console.log('before image_url:', item.image_url)
          if (item.image_url && !item.image_url.startsWith('http')) {
            item.image_url = config.imageUrl + item.image_url
            console.log('after image_url:', item.image_url)
          }
          // 检查是否已评价
          item.rated = this.data.ratedFoods.includes(item.food_id)
          return item
        })
      }
      this.setData(data)
      console.log('detail setData done, this.data.order_food:', this.data.order_food)
      wx.hideLoading()
    }, () => {
      this.onLoad(options)
    })
  },
  onUnload: function () {
    wx.reLaunch({
      url: '/pages/order/list/list'
    })
  },
  // 显示评价弹窗
  showRateModal: function(e) {
    const foodId = e.currentTarget.dataset.foodId
    const name = e.currentTarget.dataset.name
    this.setData({
      showRateModal: true,
      rateFoodId: foodId,
      rateFoodName: name,
      rating: 5,
      comment: ''
    })
  },
  // 隐藏评价弹窗
  hideRateModal: function() {
    this.setData({
      showRateModal: false
    })
  },
  // 阻止事件冒泡
  stopBubble: function() {},
  // 选择星级
  selectStar: function(e) {
    const star = parseInt(e.currentTarget.dataset.star)
    this.setData({
      rating: star
    })
  },
  // 输入评价文字
  onCommentInput: function(e) {
    this.setData({
      comment: e.detail.value
    })
  },
  // 提交评价
  submitRate: function() {
    const { rateFoodId, rating, comment } = this.data
    const orderId = this.data.id
    
    if (!rateFoodId) {
      wx.showToast({ title: '菜品信息错误', icon: 'none' })
      return
    }
    
    wx.showLoading({ title: '提交中...' })
    
    fetch('/food/review', {
      orderId: orderId,
      foodId: rateFoodId,
      rating: rating,
      comment: comment
    }, 'POST').then(data => {
      wx.hideLoading()
      if (data.code === 1) {
        wx.showToast({ title: '评价成功', icon: 'success' })
        // 隐藏弹窗
        this.setData({
          showRateModal: false,
          ratedFoods: [...this.data.ratedFoods, rateFoodId]
        })
        // 更新订单详情中的评价状态
        if (this.data.order_food) {
          const orderFood = this.data.order_food.map(item => {
            if (item.food_id === rateFoodId) {
              item.rated = true
            }
            return item
          })
          this.setData({ order_food: orderFood })
        }
      } else {
        wx.showToast({ title: data.msg || '评价失败', icon: 'none' })
      }
    }).catch(err => {
      wx.hideLoading()
      wx.showToast({ title: '评价失败', icon: 'none' })
    })
  },
  // 查看菜品评价
  viewReviews: function(e) {
    const foodId = e.currentTarget.dataset.foodId
    wx.navigateTo({
      url: '/pages/ratings/reviews?foodId=' + foodId
    })
  }
})
