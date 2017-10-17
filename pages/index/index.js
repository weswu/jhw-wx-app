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
    swiperHeight: 0,
    autoplay: true,
    indicatorDots: true,
    // 搜索关键字
    keyword: '',
    // news
    news: {},
    // cate
    category: [
      {
        category_id: "Category_00000000000000000344235",
        name: "不锈钢超薄切割片",
        image: "http://img.jihui88.com/upload/j/j2/jinlida/picture/2017/08/22/5792889a-2809-4c8b-a859-b236c21ccf36.png"
      },
      {
        category_id: "Category_00000000000000000346118",
        name: "超薄切割片",
        image: "http://img.jihui88.com/upload/j/j2/jinlida/picture/2017/08/22/2931eacc-18b7-42af-86ae-791ff9e75a37.png"
      },
      {
        category_id: "Category_00000000000000000344237",
        name: "砂轮切割片",
        image: "http://img.jihui88.com/upload/j/j2/jinlida/picture/2017/08/22/bd726f88-0ae0-4498-96c3-36f1a2cc6bb0.png"
      },
      {
        category_id: "Category_00000000000000000344238",
        name: "不锈钢碳钢切割片",
        image: "http://img.jihui88.com/upload/j/j2/jinlida/picture/2017/08/22/7647a65b-61f2-466f-a8e5-7c76fdc3223e.png"
      },
      {
        category_id: "Category_00000000000000000344239",
        name: "铜铝材切割片",
        image: "http://img.jihui88.com/upload/j/j2/jinlida/picture/2017/08/22/bd726f88-0ae0-4498-96c3-36f1a2cc6bb0.png"
      },
      {
        category_id: "Category_00000000000000000344236",
        name: "钢轨切割片",
        image: "http://img.jihui88.com/upload/j/j2/jinlida/picture/2017/08/22/7a58963f-869e-40a1-a7f9-95170d0d32b6.png"
      },
      {
        category_id: "Category_00000000000000000346119",
        name: "砂轮磨片",
        image: "http://img.jihui88.com/upload/j/j2/jinlida/picture/2017/08/22/db6435de-7203-46ea-a80f-bf7945a26376.png"
      },
      {
        category_id: "Category_00000000000000000344160",
        name: "不锈钢、石材、玻璃磨片",
        image: "http://img.jihui88.com/upload/j/j2/jinlida/picture/2017/08/22/b6374fbb-74bd-48c8-805b-ed59b6416624.png"
      },
      {
        category_id: "Category_00000000000000000344164",
        name: "不锈钢、碳钢磨片",
        image: "http://img.jihui88.com/upload/j/j2/jinlida/picture/2017/08/22/1ff53984-7dd9-4bb2-8a76-457efdc23ad3.png"
      },
      {
        category_id: "Category_00000000000000000344165",
        name: "船厂专用磨片",
        image: "http://img.jihui88.com/upload/j/j2/jinlida/picture/2017/08/22/f58718f7-3906-4070-9f93-48bb4331d409.png"
      },
      {
        category_id: "Category_00000000000000000344161",
        name: "铜铝材磨片",
        image: "http://img.jihui88.com/upload/j/j2/jinlida/picture/2017/08/22/1ff53984-7dd9-4bb2-8a76-457efdc23ad3.png"
      },
      {
        category_id: "Category_00000000000000000344162",
        name: "百叶轮",
        image: "http://img.jihui88.com/upload/j/j2/jinlida/picture/2017/08/22/409f4107-c505-4c38-97e7-0d7bfdf4a220.png"
      }
    ]
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
            data[i].price = parseFloat(data[i].price).toFixed(2)
            data[i].pic_path = util.picUrl(data[i].pic_path, 4)
            that.data.list.push(data[i])
          }
        }
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
    if (viewHeight > this.data.swiperHeight) {
      this.data.swiperHeight = viewHeight
    }
    this.setData({
      swiperHeight: this.data.swiperHeight
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
  onLoad: function () {
    if (app.globalData.member === null) { app.getUserInfo() }

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

  },
  onPullDownRefresh: function () {
    this.get()
    this.getBanner()
    this.getNews()
    wx.stopPullDownRefresh()
  },
  onShareAppMessage: function () {
    return {
      title: '商城'
    }
  }
})
