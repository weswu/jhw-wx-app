/*
 * @author: wes
 * @date: 2017-10-26
 * @desc: 订单详细
*/
var app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    data: {},
    paymentConfigList: [],
    devTip: '查看物流信息',
    primaryColor: '',
    defaultColor: ''
  },

  page: function (e) {
    wx.navigateTo({
      url: e.currentTarget.dataset.url
    })
  },
  // 订单详情接口
  get: function () {
    var that= this
    wx.showNavigationBarLoading()
    wx.showLoading({
      title: '加载中',
    })
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
        wx.hideLoading()
      }
    })
  },
  // 微信支付
  pay: function () {
    wx.request({
      url: 'https://wx.jihui88.net/rest/pay/jsapi/getWxAppPayment',
      data: {
        appId: app.globalData.appid,
        orderId: this.data.data.orderId,
        skey: app.globalData.member.skey
      },
      success: function (res) {
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
            wx.navigateBack({
              delta: 1
            })
          }
        })
      }
    })
  },
  // 确定完成
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
  // 查看物流
  delivery: function (e) {
    var that = this
    var com = ''
    var nu = ''
    if(this.data.data.shippingSet.length === 0){
      this.setData({
        devTip: '暂时无物流信息!'
      })
      return false
    }else{
      nu = this.data.data.shippingSet[0].deliverySn
      com = this.data.data.shippingSet[0].com
    }
    if(nu.indexOf('upload') > -1){
      this.setData({
        pic: "http://img.jihui88.com/" + nu
      })
      this.setData({
        devTip: ''
      })
    }else{
      wx.request({
        url: 'https://wx.jihui88.net/rest/api/comm/shop/ickd',
        data: {
          nuId: nu,
          com: com,
          skey: app.globalData.member.skey
        },
        success: function (res) {
          var data = res.data.attributes.data
          if(data.status === '0'){
            that.setData({
              devTip: '暂时无物流信息!'
            })
          }else{
            that.setData({
              ickd: data.data,
              devTip: ''
            })
          }

        }
      })
    }
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
  },

  onReady: function () {
    this.get()
    this.setData({
      primaryColor: app.globalData.primaryColor,
      defaultColor: app.globalData.defaultColor
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
    return {
      title: '订单详情'
    }
  }
})
