// intro.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  get: function () {
    var that = this
    //调用应用实例的方法获取全局数据
    wx.showNavigationBarLoading()
    console.log('首页数据加载中...')
    wx.request({
      url: 'https://api.jihui88.net/jihuiapi/products/all/' + app.globalData.enterpriseId,
      success: function (res) {
        that.setData({
          list: res.data.list
        })
        wx.setStorage({
          key: 'proCate',
          data: res.data.list
        })
        wx.hideNavigationBarLoading()
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.get()
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
