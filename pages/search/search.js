/*
 * @author: wes
 * @date: 2017-7-25
 * @desc: 产品搜索
*/
var app = getApp()
var util = require('../../utils/util.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    keyword: '',
    focus: true,
    isloading: false,
    search: {
      page: 1,
      per_page: 12
    }
  },
  page: function (e) {
    wx.navigateTo({
      url: e.currentTarget.dataset.url
    })
  },
  // 搜索商品接口
  get: function () {
    var that = this
    that.setData({
      isloading: true
    })
    wx.request({
      url: 'https://api.jihui88.net/jihuiapi/products/search/' + app.globalData.enterpriseId,
      data: {
        keyword: this.data.keyword,
        page: this.data.search.page,
        per_page: this.data.search.per_page
      },
      success: function (res) {
        that.setData({
          isloading: false
        })
        if (res.data.error === '查询为空') {
          if (that.data.search.page === 1) {
            that.setData({
              emptyTip: '暂无数据'
            })
          } else {
            that.setData({
              emptyTip: '已全部加载'
            })
          }
          return false
        } else {
          that.setData({
            emptyTip: ''
          })
        }
        var data = res.data.list
        if (data.length > 0) {
          for (var i = 0; i < data.length; i++) {
            data[i].price = parseFloat(parseFloat(data[i].price).toFixed(2))
            data[i].pic_path = util.picUrl(data[i].pic_path, 6)
            that.data.list.push(data[i])
          }
        }
        that.setData({
          list: that.data.list
        })
      }
    })
  },
  wxSearchInput: function (e) {
    this.setData({
      keyword: e.detail.value,
      focus: true
    })
  },
  // 搜索关键字
  searchKey: function () {
    this.data.search.page = 1
    this.setData({
      list: [],
      search: this.data.search,
      focus: false
    })
    this.get()
  },
  // 清空关键字
  clearKey: function () {
    this.data.search.page = 1
    this.setData({
      list: [],
      keyword: '',
      search: this.data.search,
      focus: true
    })
  },

  onReady: function () {
    this.setData({
      accentColor: app.globalData.accentColor
    })
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  bindDownLoad: function () {
    if (!this.data.isloading) {
     this.data.search.page += 1
     this.setData({
       search: this.data.search
     })
     this.get()
   }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: '搜索商品'
    }
  }
})
