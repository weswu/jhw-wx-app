/*
 * @author: wes
 * @date: 2017-10-26
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
  website () {
    wx.showModal({
      title: '欢迎访问我们的网站',
      content: this.data.company.url || '',
      showCancel: false
    })
  },

  tel: function (e) {
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

  onLoad: function () {
    var that = this
    //调用应用实例的方法获取全局数据
    this.setData({
      userInfo: app.globalData.userInfo,
      member: app.globalData.member
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
