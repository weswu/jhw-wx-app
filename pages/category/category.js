/*
 * @author: wes
 * @date: 2017-7-25
 * @desc: 产品分类
*/
var app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    active: 'all'
  },
  // 跳转
  page: function (e) {
    var url = e.currentTarget.dataset.url
    var active = 'all'
    if(url.indexOf('../product/product?category_id')>-1){
      active = e.currentTarget.dataset.cate
    }
    this.setData({
      active: active
    })
    wx.setStorage({
      key: 'active',
      data: active
    })
    wx.navigateTo({
      url: url
    })
  },
  // 获取
  get: function () {
    var that = this
    //调用应用实例的方法获取全局数据
    wx.showNavigationBarLoading()
    console.log('分类加载中...')
    wx.request({
      url: 'https://api.jihui88.net/jihuiapi/other/product_category/' + app.globalData.enterpriseId,
      success: function (res) {
        that.setData({
          list: res.data
        })
        wx.setStorage({
          key: 'category',
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
    var key = wx.getStorageSync('category')
    if (!key) {
      this.get()
    } else {
      this.setData({
        list: key
      })
    }
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    wx.setNavigationBarTitle({
      title: '分类'
    })
  },

  onShow: function () {
    var key = wx.getStorageSync('active')
    if (key) {
      this.setData({
        active: key
      })
    }
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.get()
    wx.stopPullDownRefresh() //停止下拉刷新
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: '商品分类'
    }
  }
})
