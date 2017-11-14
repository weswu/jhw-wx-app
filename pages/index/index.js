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
    // 轮播
    swiperTrue: true,
    swiperHeight: 0,
    // 搜索关键字
    keyword: '',
    // news
    news: {},
    // cate 数据来自分类接口
    category: []
  },
  page: function (e) {
    wx.navigateTo({
      url: e.currentTarget.dataset.url
    })
  },
  get: function (id) {
    var that = this
    //调用应用实例的方法获取全局数据
    wx.showNavigationBarLoading()
    console.log('首页数据加载中...' + id)
    wx.request({
      url: 'https://api.jihui88.net/jihuiapi/products/category_child/' + app.globalData.enterpriseId + '?category_id=' + id + '&page=1&per_page=4',
      success: function (res) {
        var data = res.data.list
        if (data.length > 0) {
          for (var i = 0; i < data.length; i++) {
            data[i].model = data[i].model || ''
            data[i].price = parseFloat(data[i].price).toFixed(2)
            data[i].pic_path = util.picUrl(data[i].pic_path, 4)
            that.data.list.push(data[i])
          }
        }
        // 缓存
        if (id === '248285') {
          that.setData({
            list1: data
          })
        }
        if (id === '248286') {
          that.setData({
            list2: data
          })
        }
        if (id === '344162') {
          that.setData({
            list3: data
          })
        }
        wx.setStorage({
          key: 'goods' + id,
          data: res.data.list
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
  searchKey: function () {
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
    this.setData({
      swiperHeight: 'height:' + viewHeight +'px'
    })
  },

  /*  资讯 */
  getNews: function() {
    var that = this
    wx.request({
      url: 'https://api.jihui88.net/jihuiapi/news/all/' + app.globalData.enterpriseId + '?per_page=1',
      success: function (res) {
        var data = res.data.list
        if (data.length > 0) {
          that.setData({
            news: data[0]
          })
          wx.setStorage({
            key: 'news',
            data: data[0]
          })
        }
      }
    })
  },

  /*  分类 */
  getCate: function () {
    var that = this
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
      }
    })
  },

  onReady: function () {
    var banner = wx.getStorageSync('banner')
    if (!banner) {
      this.getBanner()
    } else {
      this.setData({
        images: banner
      })
    }
    var news = wx.getStorageSync('news')
    if (!news) {
      this.getNews()
    } else {
      this.setData({
        news: news
      })
    }

    // 产品缓存
    var key248285 = wx.getStorageSync('goods248285')
    if (!key248285) {
      this.get('248285')
    } else {
      this.setData({
        list1: key248285
      })
    }

    var key248286 = wx.getStorageSync('goods248286')
    if (!key248286) {
      this.get('248286')
    } else {
      this.setData({
        list2: key248286
      })
    }
    var key344162 = wx.getStorageSync('goods344162')
    if (!key344162) {
      this.get('344162')
    } else {
      this.setData({
        list3: key344162
      })
    }
      
    this.setData({
      primaryColor: app.globalData.primaryColor
    })
  },

  onPullDownRefresh: function () {
    this.get('248285')
    this.get('248286')
    this.get('344162')
    this.getBanner()
    this.getNews()
    wx.stopPullDownRefresh()
  },
  onShareAppMessage: function () {}
})
