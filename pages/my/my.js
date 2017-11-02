/*
 * @author: wes
 * @date: 2017-7-25
 * @desc: 个人中心
*/
var app = getApp()

Page({
  data: {
    userInfo: {}
  },
  // 跳转页面
  page: function (e) {
    wx.navigateTo({
      url: e.currentTarget.dataset.url
    })
  },
  
  tel: function () {
    wx.makePhoneCall({
      phoneNumber: '13905798556'
    })
  },

  // 清空缓存
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
    }, 5000)
  },

  onLoad: function () {
    var that = this
    //调用应用实例的方法获取全局数据
    this.setData({
      userInfo: app.globalData.userInfo
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: '个人中心'
    }
  }
})
