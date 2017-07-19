// order.js
var app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    page: 1
  },

  page: function (e) {
    wx.navigateTo({
      url: e.currentTarget.dataset.url
    })
  },

  // 回首页
  pageIndex: function (e) {
    wx.switchTab({
      url: '../index/index'
    })
  },

  get: function(){
    wx.showNavigationBarLoading()
    var that= this
    wx.request({
      url: 'https://wx.jihui88.net/rest/api/shop/order/list',
      data: {
        page: this.data.page,
        skey: app.globalData.member.skey
      },
      success: function (res) {
        wx.hideNavigationBarLoading()
        if (!res.data.success) {
          wx.showModal({
            title: '提示',
            content: res.data.msg,
            success: function(res) {
              if (res.confirm) {
                console.log('确定')
              } else if (res.cancel) {
                console.log('取消')
              }
            }
          })
          return false
        }
        if(that.data.list === [] && that.data.page === 1){
          that.setData({
            empty: true
          })
        }
        var data = res.data.attributes.data
        for (var i=0; i<data.length; i++){
          that.data.list.push(data[i])
        }
        that.setData({
          list: that.data.list
        })
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
    wx.setNavigationBarTitle({
      title: '我的订单'
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
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    wx.showLoading({
      title: '加载中',
    })
    this.setData({
      page: this.data.page + 1
    })
    this.get()
    wx.hideLoading()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
