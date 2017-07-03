//index.js
Page({
  data: {
    list: []
  },
  get: function () {
    var that = this
    //调用应用实例的方法获取全局数据
    wx.showNavigationBarLoading()
    console.log('首页数据加载中...')
    wx.request({
      url: 'https://api.jihui88.net/jihuiapi/products/all/Enterp_0000000000000000000049341',
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
  onLoad: function () {
    var key = wx.getStorageSync('proCate')
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
