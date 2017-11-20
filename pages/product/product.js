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
    cate_id: '',
    title: '商品',
    emptyTip: '',
    search: {
      page: 1,
      per_page: 6
    },
    isloading: true,
    scrollTop: {
      scroll_top: 0,
      goTop_show: false
    }
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
        wx.hideNavigationBarLoading()
        that.setData({
          isloading: false
        })
        if (res.data.error === '查询为空') {
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
            emptyTip: ''
          })
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
      }
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
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.category_id) {
      this.setData({
        cate_id: parseInt(options.category_id.split('Category_')[1]),
        title: options.title
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.get()
    wx.setNavigationBarTitle({
      title: decodeURIComponent(this.data.title)
    })
    this.setData({
      primaryColor: app.globalData.primaryColor,
      accentColor: app.globalData.accentColor
    })
  },


  /**
   * 页面加载数据
   */
  bindDownLoad: function () {
    if (!this.data.isloading && this.data.emptyTip !== '') {
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
      title: decodeURIComponent(this.data.title)
    }
  }
})
