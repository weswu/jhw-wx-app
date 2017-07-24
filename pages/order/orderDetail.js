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
        wx.hideNavigationBarLoading()
      }
    })
  },
  pay: function () {
    wx.request({
      url: 'https://wx.jihui88.net/rest/pay/jsapi/getWxAppPayment',
      data: {
        appId: app.globalData.appid,
        orderId: this.data.data.orderId,
        skey: app.globalData.member.skey
      },
      success: function (res) {
        debugger
        wx.requestPayment({
          'timeStamp': res.data.attributes.data.timeStamp,
          'nonceStr': res.data.attributes.data.nonceStr,
          'package': res.data.attributes.data.package,
          'signType': 'MD5',
          'paySign': res.data.attributes.data.sign,
          'success': function (res) {
            wx.showModal({
              title: '支付完成'
            })
            wx.navigateBack({
              delta: 1
            })
          },
          'fail': function (res) {
            wx.showModal({
              title: '支付失败'
            })
            wx.navigateBack({
              delta: 1
            })
          }
        })
      }
    })
  },

  comfirm: function (e) {
    var that = this
    var id = e.currentTarget.dataset.id
    wx.request({
      method: 'post',
      url: 'https://wx.jihui88.net/rest/api/shop/order/completed/' + id,
      data: {
        skey: app.globalData.member.skey
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        wx.showToast({
          title: '交易成功',
          icon: 'success',
          duration: 1500
        })
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
    wx.stopPullDownRefresh()
    wx.hideLoading()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
