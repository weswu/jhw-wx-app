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
    
  },
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

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    wx.stopPullDownRefresh()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: '设置'
    }
  }
})
