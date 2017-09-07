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
    hotlist: [],
    swiperHeight: 0,
    autoplay: true,
    indicatorDots: true,
    category: [],
    active: 0,
    // 搜索关键字
    keyword: ''
  },
  switchTab: function (e) {
    this.setData({
      active: e.target.dataset.tab
    })
    this.getPro()
  },
  getCategory: function () {
    let that = this
    wx.request({
      url: 'https://api.jihui88.net/jihuiapi/other/product_category/' + app.globalData.enterpriseId,
      success: function (res) {
        that.setData({
          category: res.data
        })
        wx.setStorage({
          key: 'category',
          data: res.data
        })
        that.getPro()
      }
    })
  },
  // 热销
  getHot: function () {
    var that = this
    wx.showNavigationBarLoading()
    if(app.globalData.member === null){app.getUserInfo()}
    wx.request({
      url: 'https://api.jihui88.net/jihuiapi/products/the_hot/' + app.globalData.enterpriseId + '?page=1&per_page=2',
      success: function (res) {
        var data = res.data.list
        if(data && data.length > 0){
          for(var i=0; i<data.length; i++){
            data[i].price = parseFloat(data[i].price).toFixed(2)
            data[i].pic_path = util.picUrl(data[i].pic_path, 4)
            that.data.list.push(data[i])
          }
        }
        that.setData({
          hotlist: data
        })
        wx.setStorage({
          key: 'hotgoods',
          data: res.data.list
        })
        wx.hideNavigationBarLoading()
      }
    })
  },
  // 分类产品
  getPro: function () {
    var that = this
    //调用应用实例的方法获取全局数据
    wx.showNavigationBarLoading()
    if(app.globalData.member === null){app.getUserInfo()}
    console.log('首页数据加载中...')
    const cate_id = parseInt(this.data.category[this.data.active].category_id.split('Category_')[1])
    wx.request({
      url: 'https://api.jihui88.net/jihuiapi/products/category/' + cate_id + '?page=1&per_page=2',
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
          list: data || []
        })
        wx.hideNavigationBarLoading()
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
  /*  轮播 */
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
    var cagtegory = wx.getStorageSync('cagtegory')
    if (!cagtegory) {
      this.getCategory()
    } else {
      this.setData({
        cagtegory: cagtegory
      })
      this.getPro()
    }
    var hot = wx.getStorageSync('hotgoods')
    if (!hot) {
      this.getHot()
    } else {
      this.setData({
        hotlist: hot
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
  },
  onPullDownRefresh: function () {
    this.getCategory()
    this.getHot()
    this.getBanner()
    wx.stopPullDownRefresh()
  },
  onShareAppMessage: function () {
    return {
      title: '七星布草'
    }
  }
})
