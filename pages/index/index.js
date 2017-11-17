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
      per_page: 3
    },
    // 轮播
    swiperTrue: true,
    swiperHeight: 0,
    swiperCurrent: 0,
    // 切换
    nav: '1',
    isloading: true,
    scrollTop: {
      scroll_top: 0,
      goTop_show: false
    }
  },
  // 跳转页面
  page: function (e) {
    wx.navigateTo({
      url: e.currentTarget.dataset.url
    })
  },
  /* 页面切换 */
  nav: function (e) {
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
    wx.showNavigationBarLoading()
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
        wx.hideNavigationBarLoading()
        if (res.statusCode !== 404) {
          var data = res.data.list
          for (var i = 0; i < data.length; i++) {
            data[i].price = parseFloat(data[i].price).toFixed(2)
            data[i].pic_path = util.picUrl(data[i].pic_path, 4)
            that.data.list.push(data[i])
          }
          that.setData({
            list: that.data.list
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
  /*  swiper高度  */
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
  swiperChange: function(e){
    this.setData({
      swiperCurrent: e.detail.current
    })
  },

  // 回到顶部,
  scrollTopFun: function (e) {
    if (e.detail.scrollTop > 200) {//触发gotop的显示条件
      this.setData({
        'scrollTop.goTop_show': true
      });
    } else {
      this.setData({
        'scrollTop.goTop_show': false
      });
    }
  },
  goTopFun: function (e) {
    var _top = this.data.scrollTop.scroll_top;//发现设置scroll-top值不能和上一次的值一样，否则无效，所以这里加了个判断
    if (_top == 1) {
      _top = 0;
    } else {
      _top = 1;
    }
    this.setData({
      'scrollTop.scroll_top': _top
    });
  },
  /**
   * 页面加载数据
   */
   refresh: function (event) {
    if (!this.data.isloading) {
      this.data.search.page = 1
      this.setData({
        list: [],
        search: this.data.search,
        scrollTop: 0
      })
      this.get()
    }
    this.getBanner()
    this.getCate()
   },
  bindDownLoad: function () {
    if (!this.data.isloading && this.data.nav === '1') {
     this.data.search.page += 1
     this.setData({
       search: this.data.search
     })
     this.get()
   }
  },


  onReady: function () {
    this.get()
    this.getBanner()
  },

  onShareAppMessage: function () {}
})
