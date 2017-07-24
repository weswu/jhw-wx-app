// intro.js
var app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    company: {},
    isJihui: (app.globalData.enterpriseId === 'Enterp_0000000000000000000049341')
  },

  get: function () {
    var that = this
    wx.showNavigationBarLoading()
    wx.request({
      url: 'https://api.jihui88.net/jihuiapi/other/company/' + app.globalData.enterpriseId,
      success: function (res) {
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

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(!this.data.isJihui){
      var company = wx.getStorageSync('company')
      if (!company) {
        this.get()
      } else {
        this.setData({
          company: company
        })
      }
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
    if(!this.data.isJihui){
      this.get()
      wx.stopPullDownRefresh()
    }
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
