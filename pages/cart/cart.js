/*
 * @author: wes
 * @date: 2017-10-26
 * @desc: 购物车
*/
var app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    totalPrice: 0,
    cartItemSet: [],
    curReceiver: {},
    curDelivery: {},
    curPaymentConfig: {},
    isloading: false,
    defaultColor:''
  },
  page: function (e) {
    wx.navigateTo({
      url: e.currentTarget.dataset.url
    })
  },

  // 购物车接口
  get: function () {
    var that = this
    wx.showNavigationBarLoading()
    that.setData({
      isloading: true
    })
    if (app.globalData.member === null) { app.getUserInfo() }
    wx.request({
      url: 'https://wx.jihui88.net/rest/api/shop/order/info1',
      data: {
        entId: app.globalData.enterpriseId,
        cIds: '',
        skey: app.globalData.member.skey
      },
      success: function (res) {
        wx.hideNavigationBarLoading()
        that.setData({
          isloading: false
        })
        wx.setStorage({
          key: 'cartCount',
          data: (res.data.attributes && res.data.attributes.totalQuantity) || 0
        })
        if (!res.data.success) {
          that.setData({
            cartItemSet: []
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

        var curPaymentConfig = { paymentFee: 0 }
        if (data.paymentConfig.length > 0) {
          curPaymentConfig = data.paymentConfig[0]
          for (var i = 0; i < data.paymentConfig.length; i++) {
            if (data.paymentConfig[i].paymentConfigType === 'wxpay') {
              curPaymentConfig = data.paymentConfig[i]
              break;
            }
          }
        }

        // 配送方式
        var deliveryList = []
        if (data.deliveryType.length > 0) {
          for (var i = 0; i < data.deliveryType.length; i++) {
            deliveryList.push(data.deliveryType[i].name)
          }
        }

        // 收货地址
        var curReceiver = {}
        if (data.receiver.length > 0) {
          curReceiver = data.receiver[0]
          for (var i = 0; i < data.receiver.length; i++) {
            if (data.receiver[i].isDefault === '1') {
              curReceiver = data.receiver[i]
              break;
            }
          }
          wx.setStorage({
            key: 'curReceiver',
            data: curReceiver
          })
        }

        that.setData({
          curPaymentConfig: curPaymentConfig,
          curReceiver: curReceiver,
          curDelivery: data.deliveryType[0] || { deliveryFee: 0 },
          deliveryList: deliveryList,
          deliveryIndex: 0
        })
        that.getDeliveryFee()
        if (data.receiver.length === 0) {
         wx.navigateTo({
           url: '../address/address'
         })
       }
      }
    })
  },

  // 删除单个商品
  del: function (e) {
    var that = this
    var index = e.currentTarget.dataset.index
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: 'https://wx.jihui88.net/rest/api/shop/cartItem/delete',
      data: {
        id: e.currentTarget.dataset.id,
        skuCode: e.currentTarget.dataset.skucode,
        skey: app.globalData.member.skey
      },
      success: function (res) {
        wx.hideLoading()
        that.data.cartItemSet.splice(index, 1)
        that.setData({
          cartItemSet: that.data.cartItemSet,
          totalPoint: res.data.attributes.totalPoint,
          totalPrice: parseFloat(res.data.attributes.totalPrice.split('￥')[1]),
          totalQuantity: res.data.attributes.totalQuantity
        })
        wx.setStorage({
          key: 'cartCount',
          data: wx.getStorageSync('cartCount') - 1
        })
      }
    })
  },

  // 获取物流费用接口
  getDeliveryFee: function () {
    var that = this;
    if (!this.data.curDelivery.typeId || !this.data.curReceiver.receiverId) {
      console.log('error:获取物流数据不全');
    } else {
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
          that.data.curDelivery.deliveryFee = res.data.attributes.deliveryFee || 0;
          that.setData({
            curDelivery: that.data.curDelivery
          })
        }
      })
    }
  },

  // 选中物流方式
  pickChange: function (e) {
    this.setData({
      curDelivery: this.data.deliveryType[e.detail.value],
      deliveryIndex: e.detail.value
    })
    this.getDeliveryFee()
  },

  // 微信支付
  pay: function () {
    if (this.data.curReceiver && !this.data.curReceiver.receiverId) {
      wx.showModal({
        title: '收货地址不能为空'
      })
      return false
    }
    if (this.data.curDelivery && !this.data.curDelivery.typeId) {
      wx.showModal({
        title: '配送方式不能为空'
      })
      return false
    }
    if (this.data.curPaymentConfig && !this.data.curPaymentConfig.paymentId) {
      wx.showModal({
        title: '未添加支付方式'
      })
      return false
    }
    wx.showLoading({
      title: '加载中',
    })
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
        wx.hideLoading()
        var data = res.data.attributes
        wx.request({
          url: 'https://wx.jihui88.net/rest/pay/jsapi/getWxAppPayment',
          data: {
            appId: app.globalData.appid,
            orderId: data.orderId,
            skey: app.globalData.member.skey
          },
          success: function (res) {
            wx.setStorage({
              key: 'cartCount',
              data: 0
            })
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
                wx.switchTab({
                  url: '../order/order'
                })
              },
              'fail': function (res) {
                wx.showModal({
                  title: res.err_desc
                })
                wx.switchTab({
                  url: '../order/order'
                })
              }
            })
          }
        })
      }
    })
  },

  onShow: function () {
    this.get()
    if (app.globalData.member === null) {
      app.getUserInfo()
    }
    // 设置选中的收货地址
    var key = wx.getStorageSync('curReceiver')
    if (key) {
      this.setData({
        curReceiver: key
      })
    }
    this.setData({
      accentColor: app.globalData.accentColor
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
    return {
      title: '购物车'
    }
  }
})
