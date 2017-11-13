/*
 * @author: wes
 * @date: 2017-7-25
 * @desc: 设置
*/
var app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    enterprise: {}
  },
  page: function (e) {
    wx.navigateTo({
      url: e.currentTarget.dataset.url
    })
  },
  get: function () {
    var that = this
    wx.showNavigationBarLoading()
    wx.request({
      url: 'https://wx.jihui88.net/rest/api/comm/enterprise/info?enterpriseId='+ app.globalData.enterpriseId,
      data: {
        skey: app.globalData.member.skey
      },
      success: function (res) {
        var data = res.data.attributes.data
        data.logo = data.logo || 'upload/j/j2/jihui/picture/2015/12/01/d6cdd11d-c7fd-4d92-a2a6-ba489bc6b347_5.png'
        data.phone = data.phone || '400-7111-011'
        data.name = data.name || '机汇网商城'
        that.setData({
          enterprise: data
        })
        wx.setStorage({
          key: 'enterprise',
          data: data
        })
        wx.hideNavigationBarLoading()
      }
    })
  },
  tel: function(){
    wx.makePhoneCall({
      phoneNumber: this.data.enterprise.phone
    })
  },
  clear: function () {
    var that = this
    wx.clearStorage()
    this.setData({
      tip: '完成'
    })
    setTimeout(function () {
      that.setData({
        tip: ''
      })
    },5000)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var key = wx.getStorageSync('enterprise')
    if (!key) {
      this.get()
    } else {
      this.setData({
        enterprise: key
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
   onReady: function () {
     wx.setNavigationBarTitle({
       title: '设置'
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
  onShareAppMessage: function () {}
})
