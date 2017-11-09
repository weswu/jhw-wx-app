/*
 * @author: wes
 * @date: 2017-10-26
 * @desc: 订单
*/
var app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    // 切换
    nav: '00',
    page: 1,
    isloading: false,
    // 留言
    showModal: false,
    valiCode: '',
    skey: '',
    time: '000',
    orderSn: '',
    mobile: '',
    primaryColor: ''
  },

  page: function (e) {
    wx.navigateTo({
      url: e.currentTarget.dataset.url
    })
  },

  /* 页面切换 */
  nav: function (e) {
    var ctx = this;
    var nav = e.currentTarget.dataset.nav;
    this.setData({
      nav: nav
    })
    this.get()
  },

  // 订单接口
  get: function () {
    var that = this
    wx.showNavigationBarLoading()
    that.setData({
      isloading: true
    })
    if (app.globalData.member === null) { app.getUserInfo() }
    wx.request({
      url: 'https://wx.jihui88.net/rest/api/shop/order/list',
      data: {
        page: this.data.page,
        ostate: this.data.nav,
        pageSize: 1000,
        skey: app.globalData.member.skey
      },
      success: function (res) {
        wx.hideNavigationBarLoading()
        that.setData({
          isloading: false
        })
        var data = res.data.attributes.data
        if (!res.data.success) {
          wx.showModal({
            title: res.data.msg
          })
          that.setData({
            list: []
          })
          return false
        }
        if (data.length === 0 && that.data.page === 1) {
          that.setData({
            list: []
          })
          return false
        }
        for (var i = 0; i < data.length; i++) {
          data[i].cancel = '取消订单'
          data[i].comfirm = '确定收货'
          // that.data.list.push(data[i])
        }
        that.setData({
          list: data
        })
      }
    })
  },
  // 删除诗意
  del: function (e) {
    var that = this
    var id = e.currentTarget.dataset.id
    wx.request({
      url: 'https://wx.jihui88.net/rest/api/shop/order/delete/' + id,
      data: {
        skey: app.globalData.member.skey
      },
      success: function (res) {
        var list = that.data.list
        if (list.length === 1) {
          that.setData({
            list: []
          })
        } else {
          for (var i = 0; i < list.length; i++) {
            if (list[i].orderId === id) {
              list.splice(i, 1)
              that.setData({
                list: list
              })
            }
          }
        }
      }
    })
  },
  // 取消订单
  cancel: function (e) {
    var that = this
    var id = e.currentTarget.dataset.id
    var cancel = e.currentTarget.dataset.cancel
    var index = e.currentTarget.dataset.index
    if (cancel !== '已作废') {
      wx.request({
        method: 'post',
        url: 'https://wx.jihui88.net/rest/api/shop/order/invalid/' + id,
        data: {
          skey: app.globalData.member.skey
        },
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        success: function (res) {
          that.data.list[index].cancel = '已作废'
          that.setData({
            list: that.data.list
          })
        }
      })
    }
  },
  // 确认收货
  comfirm: function (e) {
    var that = this
    var id = e.currentTarget.dataset.id
    var comfirm = e.currentTarget.dataset.comfirm
    var index = e.currentTarget.dataset.index
    if (comfirm !== '交易成功') {
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
          that.data.list[index].comfirm = '交易成功'
          that.setData({
            list: that.data.list
          })
        }
      })
    }
  },
  // 留言-收货提示
  send: function (e) {
    if (this.data.cancel !== '交易成功') {
      this.setData({
        showModal: true,
        orderSn: e.currentTarget.dataset.ordersn,
        mobile: e.currentTarget.dataset.mobile
      })
    }
  },
  model: function (e) {
    this.setData({
      valiCode: e.detail.value
    })
  },
  time: function () {
    this.setData({
      time: new Date().getTime()
    })
  },
  onCancel: function () {
    this.setData({
      showModal: false
    })
  },
  sendApi: function () {
    var that = this
    this.setData({
      showModal: false
    })
    wx.request({
      method: 'post',
      url: 'https://wx.jihui88.net/site_message/send',
      data: {
        title: "小程序-客户催单",
        content: "订单编号:" + that.data.orderSn,
        valiCode: that.data.valiCode,
        recvUser: app.globalData.userId,
        recvEnt: app.globalData.enterpriseId,
        fromName: app.globalData.userInfo.nickName,
        fromPhone: that.data.mobile,
        skey: app.globalData.member.skey
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        that.setData({
          time: new Date().getTime()
        })
        wx.showToast({
          title: '留言成功',
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
    this.get()
    if (app.globalData.member === null) {
      app.getUserInfo()
    }
    this.setData({
      skey: app.globalData.member.skey,
      primaryColor: app.globalData.primaryColor
    })
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.setData({
      page: 1,
      list: []
    })
    this.get()
    wx.stopPullDownRefresh()
  },

  /**
   * 页面上拉触底事件的处理函数
   * 全查无分页
   */
  onReachBottom: function () {
    //this.setData({
    //  page: this.data.page + 1
    //})
    //this.get()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: '订单'
    }
  }
})
