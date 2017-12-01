/*
 * @author: wes
 * @date: 2017-11-30
 * @desc: 优惠券
*/
var app = getApp()
var util = require('../../utils/util.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    search: {
      page: 1,
      per_page: 6
    },
    isloading: false,
    cnav: '00'
  },

  /* 页面切换 */
  nav: function (e) {
    var ctx = this;
    var nav = e.currentTarget.dataset.nav;
    this.setData({
      cnav: nav,
      list: [],
      'search.page': 1
    })
    if (nav === '00') {
      this.get('coupon/list_ent')
    } else{
      this.get('gain/list')
    }
  },

  get: function (type) {
    var that = this
    wx.showNavigationBarLoading()
    var data = {
      skey: app.globalData.member.skey
    }
    if (type === 'coupon/list_ent') {
      data.enterpriseId = app.globalData.enterpriseId
    } else {
      data.listType = '02'
    }
    wx.request({
      url: 'https://wx.jihui88.net/rest/api/comm/' + type,
      data: data,
      success: function (res) {
        that.setData({
          isloading: false
        })
        var data = res.data.attributes.data
        for (var i = 0; i < data.length; i++) {
          if (data[i].coupon) {
            data[i].coupon.beginTime = util.formatTime(data[i].coupon.beginTime)
            data[i].coupon.endTime = util.formatTime(data[i].coupon.endTime)
            that.data.list.push(data[i].coupon)
          } else {
            data[i].beginTime = util.formatTime(data[i].beginTime)
            data[i].endTime = util.formatTime(data[i].endTime)
            that.data.list.push(data[i])
          }
        }
        that.setData({
          list: that.data.list
        })
        wx.hideNavigationBarLoading()
      }
    })
  },

  my: function () {
    var that = this
    wx.showNavigationBarLoading()
    wx.request({
      url: 'https://wx.jihui88.net/rest/api/comm/gain/list',
      data: {
        listType: '2',
        skey: app.globalData.member.skey
      },
      success: function (res) {
        that.setData({
          list: res.data.attributes.data,
          isloading: false
        })
        wx.hideNavigationBarLoading()
      }
    })
  },

  getCoupon: function (e) {
    var that = this
    wx.request({
      url: 'https://wx.jihui88.net/rest/api/coupon/gain/' + e.currentTarget.dataset.id,
      method: 'post',
      data: {
        skey: app.globalData.member.skey
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        if (res.data.success) {
          wx.showModal({
            title: '提示',
            content: '领取成功'
          })
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.get('coupon/list_ent')
    this.setData({
      primaryColor: app.globalData.primaryColor
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
        search: this.data.search,
        isloading: true
      })
      if (this.data.nav === '00') {
        this.get('coupon/list_ent')
      } else{
        this.get('gain/list')
      }
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
      if (this.data.nav === '00') {
        this.get('coupon/list_ent')
      } else{
        this.get('gain/list')
      }
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
