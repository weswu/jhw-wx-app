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
    hislist: [],
    empty: false,
    hisShow: true,
    search: {
      page: 1,
      per_page: 10
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
    wx.showLoading({
      title: '加载中'
    })
    wx.request({
      url: 'https://api.jihui88.net/jihuiapi/products/search/' + app.globalData.enterpriseId,
      data: {
        keyword: this.data.keyword,
        page: this.data.search.page,
        per_page: this.data.search.per_page
      },
      success: function (res) {
        wx.hideLoading()
        if (res.data.error === '查询为空') {
          that.setData({
            empty: true
          })
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
            empty: false
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
      keyword: e.detail.value
    })
  },
  // 清空关键字
  clearKey: function () {
    this.data.search.page = 1
    this.setData({
      list: [],
      keyword: '',
      search: this.data.search,
      empty: false,
      hisShow: true
    })
  },
  // 搜索关键字
  searchKey: function () {
    this.data.search.page = 1
    this.setData({
      list: [],
      search: this.data.search,
      hisShow: false
    })
    if (this.data.hislist.length > 0) {
      for (var i = 0; i < this.data.hislist.length; i++) {
        if (this.data.keyword === this.data.hislist[i]) {
          this.data.hislist.splice(i, 1)
        }
      }
    }
    this.data.hislist.unshift(this.data.keyword)
    this.setData({
      hislist: this.data.hislist
    })
    wx.setStorage({
      key: 'hislist',
      data: this.data.hislist
    })
    this.get()
  },
  // 搜索记录事件
  keyClick: function (e) {
    this.setData({
      keyword: e.currentTarget.dataset.key
    })
    this.searchKey()
  },
  // 删除单个记录
  keyDel: function (e) {
    this.data.hislist.splice(e.currentTarget.dataset.index, 1)
    this.setData({
      hislist: this.data.hislist
    })
    wx.setStorage({
      key: 'hislist',
      data: this.data.hislist
    })
  },
  // 删除历史记录
  wxSearchDeleteAll: function () {
    wx.removeStorageSync('hislist')
    this.setData({
      hislist: []
    })
    wx.setStorage({
      key: 'hislist',
      data: this.data.hislist
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 从首页搜索跳转
    if (options.keyword) {
      this.setData({
        keyword: options.keyword
      })
      this.searchKey()
    }
  },

  onReady: function () {
    var hislist = wx.getStorageSync('hislist')
    if (!!hislist) {
      this.setData({
        hislist: hislist
      })
    }
    this.setData({
      primaryColor: app.globalData.primaryColor,
      accentColor: app.globalData.accentColor
    })
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (this.data.empty) { return false }
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
      title: '搜索商品'
    }
  }
})
