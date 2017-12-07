/*
 * @author: wes
 * @date: 2017-11-24
 * @desc: 商品分类
*/
var app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    subCategoryList: [],
    sidebarHeight:'',
    active: '',
    primaryColor: '',
    more: true
  },
  // 跳转
  page: function (e) {
    wx.navigateTo({
      url: e.currentTarget.dataset.url
    })
  },
  // 获取
  get: function () {
    var that = this
    wx.showNavigationBarLoading()
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
        that.subCategory(res.data[0].category_id)
        wx.hideNavigationBarLoading()
      }
    })
  },
  subCategory: function(e){
    var id = e.currentTarget ? e.currentTarget.dataset.id : e;
    this.setData({
      active: id
    })
    wx.setStorage({
      key: 'active',
      data: id
    })

    var list = []
    for(var i =0; i< this.data.list.length; i++) {
      if (this.data.list[i].category_id === id) {
        list =this.data.list[i].child || []
      }
    }
    this.setData({
      subCategoryList: list
    });
  },

  onShow: function () {
    var key = wx.getStorageSync('active')
    if (key) {
      this.setData({
        active: key
      })
    }
  },
  // 左侧滚动
  lower:　function () {
    this.setData({
      more: false
    })
  },
  scroll: function (e) {
    if (e.detail.scrollTop + this.data.sidebarHeight > e.detail.scrollHeight - 80) {
      this.setData({
        more: false
      })
    } else {
      this.setData({
        more: true
      })
    }
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var key = wx.getStorageSync('category')
    if (!key) {
      this.get()
    } else {
      this.setData({
        list: key
      })
      this.subCategory(this.data.active)
    }
    this.setData({
      primaryColor: app.globalData.primaryColor,
      sidebarHeight: getApp().screenHeight
    })
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
