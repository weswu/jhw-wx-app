/*
 * @author: wes
 * @date: 2017-7-25
 * @desc: 产品
*/
var app = getApp()
var util = require('../../utils/util.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    cate_id: '',
    title: '商品',
    empty: false,
    emptyTip: '暂无数据',
    search: {
      page: 1,
      per_page: 6
    },
    primaryColor: ''
  },

  page: function (e) {
    wx.navigateTo({
      url: e.currentTarget.dataset.url
    })
  },
  get: function () {
    var that = this
    //调用应用实例的方法获取全局数据
    wx.showNavigationBarLoading()
    wx.showLoading({
      title: '加载中',
    })
    var url = 'all/' + app.globalData.enterpriseId
    if(!!this.data.cate_id){
      url = 'category_child/' + app.globalData.enterpriseId
      this.data.search.category_id = this.data.cate_id
    }
    wx.request({
      url: 'https://api.jihui88.net/jihuiapi/products/' + url,
      data: this.data.search,
      success: function (res) {
        wx.hideNavigationBarLoading()
        wx.hideLoading()
        if(res.data.error === '查询为空'){
          that.setData({
            empty: true
          })
          if(that.data.search.page === 1){
            that.setData({
              emptyTip: '暂无数据'
            })
          }else{
            that.setData({
              emptyTip: '已全部加载'
            })
          }
          return false
        }else{
          that.setData({
            empty: false
          })
        }
        var data = res.data.list
        if(data.length > 0){
          for(var i=0; i<data.length; i++){
            data[i].price = parseFloat(data[i].price).toFixed(2)
            data[i].pic_path = util.picUrl(data[i].pic_path, 4)
            that.data.list.push(data[i])
          }
        }
        that.setData({
          list: that.data.list
        })
        if(that.data.search.page === 1){
          wx.setStorage({
            key: 'proCate' + that.data.cate_id,
            data: that.data.list
          })
        }
      }
    })
  },


  /* 搜索 */
  wxSearchInput: function (e) {
    this.setData({
      keyword: e.detail.value
    })
  },
  searchKey: function (){
    wx.navigateTo({
      url: '../search/search?keyword=' + this.data.keyword
    })
    this.setData({
      keyword: ''
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(options.category_id){
      this.setData({
        cate_id: parseInt(options.category_id.split('Category_')[1]),
        title: options.title
      })
    }
    var key = wx.getStorageSync('proCate' + this.data.cate_id)
    if (!key) {
      this.get()
    } else {
      this.setData({
        list: key
      })
    }
    this.setData({
      primaryColor: app.globalData.primaryColor
    })  
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    wx.setNavigationBarTitle({
      title: this.data.title || '商品'
    })
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.data.search.page = 1
    this.setData({
      list: [],
      search: this.data.search
    })
    this.get()
    wx.stopPullDownRefresh()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if(this.data.empty){return false}
    this.data.search.page += 1
    this.setData({
      search: this.data.search
    })
    this.get()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: this.data.title || '商品展示'
    }
  }
})
