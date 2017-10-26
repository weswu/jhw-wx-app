/*
 * @author: wes
 * @date: 2017-10-26
 * @desc: 首页
*/
var app = getApp()
var util = require('../../utils/util.js')

Page({
  data: {
    images: [],
    list: [],
    categoryList: [],
    search: {
      page: 1,
      per_page: 6
    },
    isloading: false,
    // 轮播
    swiperHeight: 0,
    autoplay: true,
    indicatorDots: false,
    swiperCurrent: 0,
    // 搜索关键字
    keyword: '',
    // 切换
    nav: '1'
  },
  // 跳转页面
  page: function (e) {
    wx.navigateTo({
      url: e.currentTarget.dataset.url
    })
  },
  /* 页面切换 */
  nav: function (e) {
    var ctx = this;
    var nav = e.currentTarget.dataset.nav;
    this.setData({
      nav: nav
    })
    if (nav === '2') {
      if (this.data.categoryList.length === 0) {
        this.getCate()
      }
    }
  },
  get: function () {
    var that = this
    //调用应用实例的方法获取全局数据
    wx.showNavigationBarLoading()
    if (app.globalData.member === null) { app.getUserInfo() }
    console.log('首页数据加载中...')
    that.setData({
      isloading: true
    })
    wx.request({
      url: 'https://api.jihui88.net/jihuiapi/products/all/' + app.globalData.enterpriseId,
      data: this.data.search,
      success: function (res) {
        that.setData({
          isloading: false
        })
        var data = res.data.list
        if (data.length > 0) {
          for (var i = 0; i < data.length; i++) {
            data[i].price = parseFloat(parseFloat(data[i].price).toFixed(2))
            data[i].pic_path = util.picUrl(data[i].pic_path, 4)
            that.data.list.push(data[i])
          }
        }
        that.setData({
          list: that.data.list
        })
        wx.setStorage({
          key: 'goods',
          data: res.data.list
        })
        wx.hideNavigationBarLoading()
      }
    })
  },
  // 产品分类接口
  getCate: function () {
    var that = this
    console.log('分类加载中...')
    wx.request({
      url: 'https://api.jihui88.net/jihuiapi/other/product_category/' + app.globalData.enterpriseId,
      success: function (res) {
        that.setData({
          categoryList: res.data
        })
        wx.setStorage({
          key: 'categoryList',
          data: res.data
        })
      }
    })
  },
  /*  轮播 */
  getBanner: function () {
    var that = this
    wx.request({
      url: 'https://wx.jihui88.net/rest/api/comm/album/wxappbanner?enterpriseId=' + app.globalData.enterpriseId,
      success: function (res) {
        var data = res.data.attributes.data
        that.setData({
          images: data
        })
        wx.setStorage({
          key: 'banner',
          data: data
        })
      }
    })
  },
  imageLoad: function (e) {
    var $width = e.detail.width,    //获取图片真实宽度
      $height = e.detail.height,
      ratio = $width / $height;    //图片的真实宽高比例

    var viewWidth = wx.getSystemInfoSync().windowWidth;    //窗口宽度
    var viewHeight = viewWidth / ratio;    //计算的高度值
    if (viewHeight > this.data.swiperHeight) {
      this.data.swiperHeight = viewHeight
    }
    this.setData({
      swiperHeight: this.data.swiperHeight
    })
  },
  swiperChange: function(e){
    this.setData({
      swiperCurrent: e.detail.current
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
    var banner = wx.getStorageSync('banner')
    if (!banner) {
      this.getBanner()
    } else {
      this.setData({
        images: banner
      })
    }
    var category = wx.getStorageSync('category')
    if (!!category) {
      this.setData({
        categoryList: category
      })
    }
  },
  onPullDownRefresh: function () {
    this.data.search.page = 1
    this.setData({
      search: this.data.search
    })
    this.get()
    this.getBanner()
    this.getCate()
    wx.stopPullDownRefresh()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (!this.data.isloading) {
      this.data.search.page += 1
      this.setData({
        search: this.data.search
      })
      this.get()
    }
  },

  onShareAppMessage: function () {
    return {
      title: '商城'
    }
  }
})
