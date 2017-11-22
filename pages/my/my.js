/*
 * @author: wes
 * @date: 2017-7-25
 * @desc: 个人中心
*/
var app = getApp()

Page({
  data: {
    userInfo: {},
    company: {}
  },
  // 跳转页面
  page: function (e) {
    wx.navigateTo({
      url: e.currentTarget.dataset.url
    })
  },

  tel: function () {
    wx.makePhoneCall({
      phoneNumber: this.data.company.cellphone || this.data.company.phone
    })
  },
  // 公司简介接口
  get: function () {
    var that = this
    wx.showNavigationBarLoading()
    wx.request({
      url: 'https://api.jihui88.net/jihuiapi/other/company/' + app.globalData.enterpriseId,
      success: function (res) {
        if (res.data.edesc !== null) {
          res.data.edesc = res.data.edesc.replace(/<img /g, "<img style='display: block' width='100%;' ").replace(/\"/g, "'")
        }
        that.setData({
          company: res.data
        })
        wx.setStorage({
          key: 'company',
          data: res.data
        })
        wx.hideNavigationBarLoading()
      }
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


  onReady: function () {
    var that = this
    //调用应用实例的方法获取全局数据
    this.setData({
      userInfo: app.globalData.userInfo
    })
    var company = wx.getStorageSync('company')
    if (!company) {
      this.get()
    } else {
      this.setData({
        company: company
      })
    }
  },
  
  onPullDownRefresh: function () {
    this.get()
    wx.stopPullDownRefresh()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {}
})
