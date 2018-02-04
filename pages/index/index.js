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
    hotList: [],
    categoryList: [],
    search: {
      page: 1,
      per_page: 4
    },
    isloading: false,
    index: 0,
    // 轮播
    swiperTrue: true,
    swiperHeight: 0,
    // other
    scrollTop: false,
    primaryColor: '',
    lighterPrimaryColor: ''
  },
  // 跳转页面
  page: function (e) {
    wx.navigateTo({
      url: e.currentTarget.dataset.url
    })
  },
  get: function (cate_id) {
    var that = this
    that.setData({
      isloading: true
    })
    this.data.search.category_id = cate_id
    return new Promise(function(resolve, reject){
      wx.request({
        url: 'https://api.jihui88.net/jihuiapi/products/category_child/' + app.globalData.enterpriseId,
        data: that.data.search,
        success: function (res) {
          that.setData({
            isloading: false
          })
          if (res.statusCode !== 404) {
            var data = res.data.list
            for (var i = 0; i < data.length; i++) {
              data[i].price = parseFloat(data[i].price).toFixed(2)
              data[i].pic_path = util.picUrl(data[i].pic_path, 4)
            }
            that.data.list.push(data)
            that.setData({
              list: that.data.list
            })
            if (that.data.list.length < 3) {
              wx.setStorage({
                key: 'goods',
                data: that.data.list
              })
            }
          } else {
            that.data.list.push([])
            that.setData({
              list: that.data.list
            })
          }
          resolve()
        }
      })
    })
  },
  // 热门
  getHot: function () {
    var that = this
    wx.showNavigationBarLoading()
    wx.request({
      url: 'https://api.jihui88.net/jihuiapi/products/the_best/' + app.globalData.enterpriseId,
      data: this.data.search,
      success: function (res) {
        wx.hideNavigationBarLoading()
        if (res.statusCode !== 404) {
          var data = res.data.list
          for (var i = 0; i < data.length; i++) {
            data[i].price = parseFloat(data[i].price).toFixed(2)
            data[i].pic_path = util.picUrl(data[i].pic_path, 4)
          }
          that.setData({
            hotList: data
          })
          wx.setStorage({
            key: 'hotList',
            data: data
          })
        }
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
        that.initPro()
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
        for (var i = 0; i < data.length; i++) {
          data[i].serverPath = util.picUrl(data[i].serverPath, 3)
        }
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
    this.setData({
      swiperHeight: 'height:' + viewHeight + 'px'
    })
  },

  // 回到顶部
  goTopFun: function (e) {
    wx.pageScrollTo({
      scrollTop: 0
    })
    this.setData({
      scrollTop: false
    })
  },
  scrollTopFn: function (e) {
    if (!this.data.scrollTop) {
      this.setData({
        scrollTop: true
      })
    }
  },
  // 转10进制
  hexToRgba: function(hex) {
    this.setData({
      lighterPrimaryColor: "rgba(" + parseInt("0x" + hex.slice(1, 3)) + "," + parseInt("0x" + hex.slice(3, 5)) + "," + parseInt("0x" + hex.slice(5, 7)) + ",0.85)"
    })
  },

  // 初始化产品分类数据
  initPro: function () {
    var goods = wx.getStorageSync('goods')
    if (!goods) {
      this.init()
    } else {
      this.setData({
        list: goods,
        index: goods.length
      })
    }
  },
  init: function () {
    var that = this
    var index = this.data.index
    var length = this.data.categoryList.length
    var a, b, c
    for (var i =0; i<3; i++) {
      if (index < length) {
        var cid = parseInt(this.data.categoryList[index].category_id.split('Category_')[1])
        if (i ===0) {a = cid}
        if (i ===1) {b = cid}
        if (i ===2) {c = cid}
        index+=1
        that.setData({
          index: index
        })
      }
    }
    this.get(a).then(()=>{
      that.get(b).then(()=>{
        that.get(c).then(()=>{
        })
      })
    })
  },

  onReady: function () {
    var hotList = wx.getStorageSync('hotList')
    if (!hotList) {
      this.getHot()
    } else {
      this.setData({
        hotList: hotList
      })
    }
    var category = wx.getStorageSync('category')
    if (!category) {
      this.getCate()
    } else {
      this.setData({
        categoryList: category
      })
      this.initPro()
    }
    var banner = wx.getStorageSync('banner')
    if (!banner) {
      this.getBanner()
    } else {
      this.setData({
        images: banner
      })
    }
    var that = this
    if (app.globalData.primaryColor) {
      this.setData({
        primaryColor: app.globalData.primaryColor
      })
      this.hexToRgba(app.globalData.primaryColor)
    } else {
      wx.getExtConfig({
        success: function (res) {
          that.setData({
            primaryColor: res.extConfig.primaryColor
          })
          that.hexToRgba(app.globalData.primaryColor)
        }
      })
    }
  },
  onPullDownRefresh: function () {
    this.getBanner()
    this.getCate()
    if (!this.data.isloading) {
      wx.removeStorageSync('goods')
      this.setData({
        hotList: [],
        list: [],
        index: 0
      })
      this.getHot()
    }
    wx.stopPullDownRefresh()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (!this.data.isloading) {
      this.init()
    }
  },

  onShareAppMessage: function () {}
})
