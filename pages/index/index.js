/*
 * @author: wes
 * @date: 2017-7-25
 * @desc: 首页
*/
var app = getApp()
var util = require('../../utils/util.js')

Page({
  data: {
    images: [],
    list: [],
    enterprise: {},
    swiperHeight: 0,
    autoplay: true,
    indicatorDots: true,
    category: [],
    active: 0
  },
  switchTab: function (e) {
    this.setData({
      active: e.target.dataset.tab
    })
  },
  getCategory: function () {
    let that = this
    wx.request({
      url: 'https://api.jihui88.net/jihuiapi/other/product_category/' + app.globalData.enterpriseId,
      success: function (res) {
        that.setData({
          category: res.data
        })        
      }
    })
  },
  getPro: function () {
    console.log(app.globalData.enterpriseId)
    var that = this
    //调用应用实例的方法获取全局数据
    wx.showNavigationBarLoading()
    if(app.globalData.member === null){app.getUserInfo()}
    console.log('首页数据加载中...')
    wx.request({
      url: 'https://api.jihui88.net/jihuiapi/products/all/' + app.globalData.enterpriseId + '?page=1&per_page=4',
      success: function (res) {
        var data = res.data.list
        if(data && data.length > 0){
          for(var i=0; i<data.length; i++){
            data[i].price = parseFloat(parseFloat(data[i].price).toFixed(2))
            data[i].pic_path = util.picUrl(data[i].pic_path, 4)
            that.data.list.push(data[i])
          }
        }
        that.setData({
          list: data
        })
        wx.setStorage({
          key: 'goods',
          data: res.data.list
        })
        wx.hideNavigationBarLoading()
      }
    })
  },
  getEnter: function () {
    var that = this
    wx.showNavigationBarLoading()
    wx.request({
      url: 'https://wx.jihui88.net/rest/api/comm/enterprise/info?enterpriseId='+ app.globalData.enterpriseId,
      data: {
        skey: app.globalData.member.skey
      },
      success: function (res) {
        var data = res.data.attributes.data
        data.logo = data.logo || 'upload/j/j2/jihui/picture/2015/12/01/d6cdd11d-c7fd-4d92-a2a6-ba489bc6b347_5.png'
        data.phone = data.phone || '400-7111-011'
        data.name = data.name || '机汇网商城'
        that.setData({
          enterprise: data
        })
        wx.setNavigationBarTitle({
          title: data.name
        })
        wx.setStorage({
          key: 'enterprise',
          data: data
        })
        wx.hideNavigationBarLoading()
      }
    })
  },
  // banner
  getBanner: function () {
    var that = this
    wx.request({
      url: 'https://wx.jihui88.net/rest/api/comm/album/wxappbanner?enterpriseId='+ app.globalData.enterpriseId,
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
    var $width=e.detail.width,    //获取图片真实宽度
        $height=e.detail.height,
        ratio=$width/$height;    //图片的真实宽高比例

    var viewWidth=wx.getSystemInfoSync().windowWidth;    //窗口宽度
    var viewHeight=viewWidth/ratio;    //计算的高度值
    if(viewHeight > this.data.swiperHeight){
      this.data.swiperHeight = viewHeight
    }
    this.setData({
      swiperHeight: this.data.swiperHeight
    })
  },
  onLoad: function () {
    var key = wx.getStorageSync('goods')
    if (!key) {
      this.getPro()
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
    this.getCategory()
  },
  onReady: function () {
    var key = wx.getStorageSync('enterprise')
    if (!key) {
      // this.getEnter()
    } else {
      this.setData({
        enterprise: key
      })
      wx.setNavigationBarTitle({
        title: this.data.enterprise.name
      })
    }
  },
  onPullDownRefresh: function () {
    this.getPro()
    // this.getBanner()
    this.getEnter()
    wx.stopPullDownRefresh()
  },
  onShareAppMessage: function () {
    return {
      title: this.data.enterprise.name
    }
  }
})
