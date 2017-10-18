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
    total: 0,
    title: '新闻动态',
    empty: false,
    emptyTip: '暂无数据',
    search: {
      page: 1,
      per_page: 16,
      category_id: ''
    },
    // cate
    array: ['全部分类'],
    objectArray: [],
    index: 0
  },

  // 商品详情接口
  get: function () {
    var that = this
    //调用应用实例的方法获取全局数据
    wx.showNavigationBarLoading()
    wx.showLoading({
      title: '加载中',
    })
    var url = 'all/' + app.globalData.enterpriseId
    if (!!this.data.search.category_id) {
      url = 'category_child/' + app.globalData.enterpriseId
    }
    wx.request({
      url: 'https://api.jihui88.net/jihuiapi/news/' + url,
      data: this.data.search,
      success: function (res) {
        wx.hideNavigationBarLoading()
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
        that.setData({
          list: res.data.list,
          total: res.data.total
        })
      }
    })
  },

  getCate: function () {
    var that = this
    //调用应用实例的方法获取全局数据
    console.log('分类加载中...')
    wx.request({
      url: 'https://api.jihui88.net/jihuiapi/other/news_category/' + app.globalData.enterpriseId,
      success: function (res) {
        var array = ['全部分类']
        for (var i = 0; i < res.data.length; i++) {
          array.push(res.data[i].name)
        }
        that.setData({
          array: array,
          objectArray: res.data
        })
        wx.setStorage({
          key: 'newsCateList',
          data: res.data
        })
      }
    })
  },
  // 分类选择
  bindPickerChange: function(e) {
    this.data.search.page = 1
    if (e.detail.value === '0') {
      this.data.search.category_id = ''
    } else {
      var category_id = this.data.objectArray[parseInt(e.detail.value) - 1].category_id
      this.data.search.category_id = parseInt(category_id.split('Category_')[1])
    }
    this.setData({
      index: e.detail.value,
      search: this.data.search
    })
    this.get()
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.category_id) {
      this.data.search.category_id = parseInt(options.category_id.split('Category_')[1])
      this.setData({
        search: search,
        title: options.title
      })
    }
    this.get()
    this.getCate()

    var key = wx.getStorageSync('newsCateList')
    if (!key) {
      this.getCate()
    } else {
      var array = ['全部分类']
      for (var i = 0; i < key.length; i++) {
        array.push(key[i].name)
      }
      this.setData({
        array: array,
        objectArray: key
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    wx.setNavigationBarTitle({
      title: this.data.title || '新闻动态'
    })
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.data.search.page = 1
    this.setData({
      list: [],
      search: this.data.search,
      index: 0
    })
    this.get()
    this.getCate()
    wx.stopPullDownRefresh()
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
      title: this.data.title || '新闻动态'
    }
  }
})
