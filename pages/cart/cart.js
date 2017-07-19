// cart.js
var app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    totalPoint: 0,
    totalPrice: 0,
    cartItemSet: [],
    curReceiver: {},
    curDelivery: {},
    curPaymentConfig: {}
  },
  page: function (e) {
    wx.navigateTo({
      url: e.currentTarget.dataset.url
    })
  },
  pageIndex: function (e) {
    wx.switchTab({
      url: '../index/index'
    })
  },
  get: function () {
    var that = this
    wx.showNavigationBarLoading()
    wx.request({
      url: 'https://wx.jihui88.net/rest/api/shop/order/info1',
      data: {
        entId: app.globalData.enterpriseId,
        cIds: '',
        skey: app.globalData.member.skey
      },
      success: function (res) {
        wx.hideNavigationBarLoading()
        if(!res.data.success){
          that.setData({
            empty: true
          })
          return false
        }
        var data = res.data.attributes

        that.setData({
          cartItemSet: data.cartItemSet,
          deliveryType: data.deliveryType,
          integralProductList: data.integralProductList,
          issubtotal: data.issubtotal,
          memberPoint: data.memberPoint,
          paymentConfig: data.paymentConfig,
          receiver: data.receiver,
          totalPoint: data.totalPoint,
          totalPrice: data.totalPrice,
          totalQuantity: data.totalQuantity,
          totalWeightGram: data.totalWeightGram
        })

        var curReceiver = {}
        if(data.receiver.length > 0){
          curReceiver = data.receiver[0]
          for(var i=0; i<data.receiver.length; i++){
            if(data.receiver[i].isDefault === '1'){
              curReceiver = data.receiver[i]
              break;
            }
          }
          wx.setStorage({
            key: 'curReceiver',
            data: curReceiver
          })
        }

        var curPaymentConfig = {}
        if(data.paymentConfig.length > 0){
          curPaymentConfig = data.paymentConfig[0]
          for(var i=0; i<data.paymentConfig.length; i++){
            if(data.paymentConfig[i].paymentConfigType === 'wxpay'){
              curPaymentConfig = data.paymentConfig[i]
              break;
            }
          }
        }

        var curDelivery = data.deliveryType[0]
        curDelivery.deliveryFee = that.getDeliveryFee()

        that.setData({
          curDelivery: curDelivery,
          curPaymentConfig: curPaymentConfig,
          curReceiver: curReceiver
        })
      }
    })
  },
  getDeliveryFee: function () {
    var onDeliveryFee = 0;
    if (!this.data.curDelivery.typeId || !this.data.curReceiver.receiverId) {
        onDeliveryFee = 0;
        console.log('error:获取物流数据不全');
      }else{
        wx.request({
          type: 'get',
          url: 'https://wx.jihui88.net/rest/api/shop/order/deliveryFee1',
          data: {
            typeId: this.data.curDelivery.typeId,
            receiverId: this.data.curReceiver.receiverId,
            totalWeightGram: this.data.totalWeightGram,
            skey: app.globalData.member.skey
          },
          success: function (res) {
            onDeliveryFee = res.attributes.deliveryFee;
          }
        })
      }
    return onDeliveryFee
  },
  pay: function () {
    var data = {
      entId: app.globalData.enterpriseId,
      cIds: '',
      receiverId: this.data.curReceiver.receiverId,
      typeId: this.data.curDelivery.typeId,
      configId: this.data.curPaymentConfig.paymentId,
      gainIds: '',
    }
    data.model = JSON.stringify(data)
    data._method = 'post'
    data.skey = app.globalData.member.skey
    wx.request({
      method: 'post',
      url: 'https://wx.jihui88.net/rest/api/shop/order/save1',
      data: data,
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var data = res.data.attributes
        wx.request({
          url: 'https://wx.jihui88.net/rest/api/pay/jsapi/getWxAppPayment',
          data: {
            orderId: data.orderId
          },
          success: function (res) {
            wx.requestPayment({
              'timeStamp': res.data.attributes.data.timeStamp,
              'nonceStr': res.data.attributes.data.nonceStr,
              'package': res.data.attributes.data.package,
              'signType': 'MD5',
              'paySign': res.data.attributes.data.sign,
              'success': function (res) {
                wx.navigateTo({
                  url: '../order/order'
                })
              },
              'fail': function (res) {
                wx.navigateTo({
                  url: '../order/order'
                })
              }
            })
          }
        })
      }
    })
  },

  setStor: function () {
    var key = wx.getStorageSync('curReceiver')
    if (key) {
      this.setData({
        curReceiver: key
      })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.get()
  },

  onShow: function () {
    this.setStor()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    wx.setNavigationBarTitle({
      title: '购物车'
    })
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.get()
    wx.stopPullDownRefresh()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
