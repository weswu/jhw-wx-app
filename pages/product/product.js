/*
 * @author: wes
 * @date: 2017-10-26
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
    cate_id: '',
    title: '商品',
    emptyTip: '暂无数据',
    search: {
      page: 1,
      per_page: 6
    },
    isloading: false,
    // 回到顶部
    scrollTop: {
      scroll_top: 0,
      goTop_show: false
    }
  },

  page: function (e) {
    wx.navigateTo({
      url: e.currentTarget.dataset.url
    })
  },
  // 回分页
  pageCategory: function (e) {
    wx.switchTab({
      url: '../category/category'
    })
  },

  // 商品详情接口
  get: function () {
    var that = this
    //调用应用实例的方法获取全局数据
    wx.showNavigationBarLoading()
    that.setData({
      isloading: true
    })
    var url = 'all/' + app.globalData.enterpriseId
    if (!!this.data.cate_id) {
      url = 'category_child/' + app.globalData.enterpriseId
      this.data.search.category_id = this.data.cate_id
    }
    wx.request({
      url: 'https://api.jihui88.net/jihuiapi/products/' + url,
      data: this.data.search,
      success: function (res) {
        that.setData({
          isloading: false
        })
        wx.hideNavigationBarLoading()
        if (res.data.error === '查询为空') {
          if (that.data.search.page === 1) {
            that.setData({
              emptyTip: '暂无数据'
            })
          } else {
            that.setData({
              emptyTip: ''
            })
          }
          return false
        }
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
        if (that.data.search.page === 1) {
          wx.setStorage({
            key: 'proCate' + that.data.cate_id,
            data: that.data.list
          })
        }
      }
    })
  },

  // 回到顶部
  scrollTopFun: function (e) {
    if (e.detail.scrollTop > 500) { // 触发gotop的显示条件
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
    var _top = this.data.scrollTop.scroll_top; // 发现设置scroll-top值不能和上一次的值一样，否则无效，所以这里加了个判断
    if (_top == 1) {
      _top = 0;
    } else {
      _top = 1;
    }
    this.setData({
      'scrollTop.scroll_top': _top
    });
  },

  scrolltoupper: function () {
    this.onPullDownRefresh()
  },
  bindDownLoad: function () {
    this.onReachBottom()
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.category_id) {
      this.setData({
        cate_id: parseInt(options.category_id.split('Category_')[1]),
        title: options.title
      })
    }
    var key = wx.getStorageSync('proCate' + this.data.cate_id)
    if (!key) {
      this.get()
    } else {
      this.setData({
        list: key
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    wx.setNavigationBarTitle({
      title: this.data.title || '商品'
    })
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    if (!this.data.isloading) {
      this.data.search.page = 1
      this.setData({
        list: [],
        search: this.data.search
      })
      this.get()
    }
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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: this.data.title || '商品展示'
    }
  }
})
