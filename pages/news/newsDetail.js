// pages/news/newsDetail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    detail: {}
  },

  get: function () {
    var that = this
    wx.showNavigationBarLoading()
    wx.request({
      url: 'https://api.jihui88.net/jihuiapi/news/single/' + this.data.detail.id,
      success: function (res) {
        if (res.data.content == null) {
          res.data.content = ''
        } else {
          // 表格
          res.data.content = res.data.content.replace(/<img>/g, "<img width='100%;'>").replace(/<table>/g, "<table style='border-collapse:collapse;display:table;'>").replace(/<td>/g, "<td style='padding: 5px 10px;border: 1px solid #DDD;'>").replace(/<th>/g, "<th style='padding: 5px 10px;border: 1px solid #DDD;border-top:1px solid #BBB;background-color:#F7F7F7;'>").replace(/\"/g, "'")
        }
        res.data.add_time = res.data.add_time.substring(0,16) || ''
        that.setData({
          detail: res.data
        })
        wx.hideNavigationBarLoading()
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
   onLoad: function (options) {
     if (options.id) {
       this.data.detail.id = options.id
       this.data.detail.title = options.title
       this.setData({
         detail: this.data.detail
       })
     }
     this.get()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    wx.setNavigationBarTitle({
      title: this.data.detail.title || '新闻中心'
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: this.data.detail.title || '新闻中心'
    }
  }
})
