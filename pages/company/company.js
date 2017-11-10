/*
 * @author: wes
 * @date: 2017-10-26
 * @desc: 公司简介
*/
var app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    company: {}
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

  // 拨打电话
  tel: function (e) {
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.dataset.tel
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onReady: function (options) {
    var company = wx.getStorageSync('company')
    if (!company) {
      this.get()
    } else {
      this.setData({
        company: company
      })
    }
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
