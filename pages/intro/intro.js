// intro.js
var app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    company: {},
    contact: {},
    isJihui: (app.globalData.enterpriseId === 'Enterp_0000000000000000000049341')
  },

  get: function () {
    var that = this
    //调用应用实例的方法获取全局数据
    wx.showNavigationBarLoading()

    var company = wx.getStorageSync('company')
    if (!company) {
      wx.request({
        url: 'https://wx.jihui88.net/rest/api/comm/enterprise/info?enterpriseId=' + app.globalData.enterpriseId,
        success: function (res) {
          that.setData({
            company: res.data.attributes.data
          })
          wx.setStorage({
            key: 'company',
            data: res.data.attributes.data
          })
          wx.hideNavigationBarLoading()
        }
      })
    } else {
      this.setData({
        company: company
      })
    }

    var contact = wx.getStorageSync('company')
    if (!contact) {
      wx.request({
        url: 'https://api.jihui88.net/jihuiapi/other/company/' + app.globalData.enterpriseId,
        success: function (res) {
          that.setData({
            contact: res.data
          })
          wx.setStorage({
            key: 'contact',
            data: res.data
          })
          wx.hideNavigationBarLoading()
        }
      })
    } else {
      this.setData({
        company: contact
      })
    }

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(!this.data.isJihui){
      this.get()
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: '机汇网简介'
    }
  }
})
