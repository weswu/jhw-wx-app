/*
 * @author: wes
 * @date: 2017-7-25
 * @desc: 产品详细
*/
var util = require('../../utils/util.js')
var app = getApp()

Page({
  data: {
    detail: {},
    id: '',
    nav: '1',
    empty: false,
    argsList: [],
    // 轮播
    swiperTrue: true,
    swiperHeight: 0
  },
  page: function (e) {
    wx.navigateTo({
      url: e.currentTarget.dataset.url
    })
  },
  // 拨打电话
  tel: function (e) {
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.dataset.tel
    })
  },
  get: function () {
    var that = this
    //调用应用实例的方法获取全局数据
    wx.showNavigationBarLoading()
    console.log('产品详细' + this.data.id + '加载中...')
    wx.request({
      url: 'https://api.jihui88.net/jihuiapi/products/single/' + this.data.id,
      success: function (res) {
        if (res.data.proddesc == null) {
          res.data.proddesc = ''
        } else {
          // .replace(/<style[^>]*?>[\s\S]*?<\/style>/g, "")
          res.data.proddesc = res.data.proddesc.replace(/<img /g, "<img width='100%;' ").replace(/\"/g, "'")
        }

        if (res.data.detail1 == null) {
          res.data.detail1 = ''
        } else {
          // 表格
          res.data.detail1 = res.data.detail1.replace(/<table>/g, "<table style='border-collapse:collapse;display:table;'>").replace(/<td>/g, "<td style='padding: 5px 10px;border: 1px solid #DDD;'>").replace(/<th>/g, "<th style='padding: 5px 10px;border: 1px solid #DDD;border-top:1px solid #BBB;background-color:#F7F7F7;'>").replace(/\"/g, "'")
        }

        res.data.price = parseFloat(parseFloat(res.data.price).toFixed(2))
        that.setData({
          detail: res.data
        })
        wx.setStorage({
          key: 'detail' + that.data.id,
          data: res.data
        })
        that.wxNavTitle()
        wx.hideNavigationBarLoading()
      }
    })
  },
  /* 预览图片 */
  showPic: function (e) {
    var urls = []
    for (var i = 0; i < this.data.detail.imagelist.length; i++) {
      urls.push(this.data.detail.imagelist[i].sourceProductImagePath)
    }
    wx.previewImage({
      current: e.currentTarget.dataset.src,
      urls: urls
    })
  },
  showDescPic: function (e) {
    var urls = []
    var descs = this.data.detail.proddesc.match(/<img[^>]+>/g)
    if (descs != null) {
      for (var i = 0; i < descs.length; i++) {
        urls.push(descs[i].replace(/(<img[^>]*?src=['""]([^'""]*?)['""][^>]*?>)/g, '$2'))
      }
      wx.previewImage({
        urls: urls
      })
    }
  },
  /* 页面切换 */
  nav: function (e) {
    var ctx = this;
    var nav = e.currentTarget.dataset.nav;
    this.setData({
      nav: nav
    })
  },

  imageLoad: function (e) {
    var $width = e.detail.width,    //获取图片真实宽度
      $height = e.detail.height,
      ratio = $width / $height;    //图片的真实宽高比例

    var viewWidth = wx.getSystemInfoSync().windowWidth;    //窗口宽度
    var viewHeight = viewWidth / ratio;    //计算的高度值
    this.setData({
      swiperHeight: 'height:' + viewHeight +'px'
    })
  },
  wxNavTitle: function () {
    wx.setNavigationBarTitle({
      title: decodeURIComponent(this.data.detail.name)
    })
  },
  onLoad: function (options) {
    this.setData({
      id: options.id
    })
  },
  onReady: function () {
    var detail = wx.getStorageSync('detail' + this.data.id)
    if (!detail) {
      this.get()
    } else {
      this.setData({
        detail: detail
      })
      this.wxNavTitle()
    }
    this.setData({
      primaryColor: app.globalData.primaryColor
    })
  },
  onPullDownRefresh: function () {
    this.get()
    wx.stopPullDownRefresh()
  },
  onShareAppMessage: function () {
    return {
      title: decodeURIComponent(this.data.detail.name)
    }
  }
})
