// orderDetail.js
var app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    data: {},
    paymentConfigList: []
  },

  page: function (e) {
    wx.navigateTo({
      url: e.currentTarget.dataset.url
    })
  },
  get: function () {
    wx.showNavigationBarLoading()
    var that= this
    wx.request({
      url: 'https://wx.jihui88.net/rest/api/shop/order/detail/' + this.data.id,
      data: {
        entId: app.globalData.enterpriseId,
        skey: app.globalData.member.skey
      },
      success: function (res) {
        that.setData({
          data: res.data.attributes.data,
          paymentConfigList: res.data.attributes.paymentConfigList
        })
      }
    })
    wx.hideNavigationBarLoading()
  },
  pay: function () {
    wx.requestPayment({
      'timeStamp': '',
      'nonceStr': '',
      'package': '',
      'signType': 'MD5',
      'paySign': '',
      'success': function (res) {
      },
      'fail': function (res) {
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(options.id){
      this.setData({
        id: options.id
      })
    }
    this.get()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    wx.setNavigationBarTitle({
      title: '订单详情'
    })
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    wx.showLoading({
      title: '加载中',
    })
    this.get()
    wx.hideLoading()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
