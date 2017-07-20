//index.js
var app = getApp()

Page({
  data: {
    images: [
      'http://img.easthardware.com/upload/j/j2/jihui/picture/2016/02/16/9e4246d9-7150-49f0-af69-237598418759.png'
    ],
    list: []
  },
  get: function () {
    var that = this
    //调用应用实例的方法获取全局数据
    wx.showNavigationBarLoading()
    console.log('首页数据加载中...')
    wx.request({
      url: 'https://api.jihui88.net/jihuiapi/products/all/' + app.globalData.enterpriseId + '?page=1&per_page=4',
      success: function (res) {
        that.setData({
          list: res.data.list
        })
        wx.setStorage({
          key: 'goods',
          data: res.data.list
        })
        wx.hideNavigationBarLoading()
      }
    })
  },
  onLoad: function () {
    var key = wx.getStorageSync('goods')
    if (!key) {
      this.get()
    } else {
      this.setData({
        list: key
      })
    }
  },
  onPullDownRefresh: function () {
    this.get()
    wx.stopPullDownRefresh()
  },
  onShareAppMessage: function () {
    return {
      title: '机汇网'
    }
  }
})
