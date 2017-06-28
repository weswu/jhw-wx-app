//index.js
Page({
  data: {
    proList: []
  },
  onLoad: function () {
    this.getList()
  },
  onPullDownRefresh: function () {
    this.getList()
    wx.stopPullDownRefresh()
  },
  getList: function () {
    var that = this
    //调用应用实例的方法获取全局数据
    wx.showNavigationBarLoading()
    wx.request({
      url: 'https://api.jihui88.net/jihuiapi/products/all/Enterp_0000000000000000000049341',
      success: function (res) {
        console.log(res)
        that.setData({
          proList: res.data.list
        })
        wx.hideNavigationBarLoading()
      }
    })
  },
  onShareAppMessage: function () {
    return {
      title: '机汇网产品大全'
    }
  }
})
