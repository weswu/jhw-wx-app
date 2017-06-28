// detail.js
// 引入HtmlParser
const HtmlParser = require('../../html-view/index')
var util = require('../../utils/util.js')

Page({
  data: {
    detail: {},
    id: '',
    nav: '1',
    sellList: [],
    sellBol: false
  },
  removeHTMLTag: function (str) {
    str = str.replace(/<\/?[^>]*>/g, ''); //去除HTML tag
    str = str.replace(/[ | ]*\n/g, '\n'); //去除行尾空白
    str = str.replace(/\n[\s| | ]*\r/g,'\n'); //去除多余空行
    str=str.replace(/&nbsp;/ig, '');//去掉&nbsp;
    return str;
  },
  onLoad: function (options) {
    this.getDetail(options.id)
    this.setData({
      id: options.id
    })
  },
  onPullDownRefresh: function () {
    this.getDetail(this.data.id)
    wx.stopPullDownRefresh()
  },
  getDetail: function (id) {
    var that = this
    //调用应用实例的方法获取全局数据
    wx.showNavigationBarLoading()
    wx.request({
      url: 'https://api.jihui88.net/jihuiapi/products/single/' + id,
      success: function (res) {
        console.log(res)
        // 解析HTML字符串
        if (res.data.proddesc == null) { res.data.proddesc = ''}
        const html = new HtmlParser(res.data.proddesc).nodes
        that.setData({
          detail: res.data,
          html
        })
        wx.hideNavigationBarLoading()
      }
    })
  },
  nav: function (e) {
    var ctx =this;
    this.setData({
      nav: e.currentTarget.dataset.nav
    })
    if (!this.data.sellBol){
      wx.request({
        url: 'http://www.jihui88.com/rest/api/shop/order/product/sellList',
        dataType: 'jsonp',
        data: {
          callback: "jsonpCallback",
          productId: this.data.detail.product_id
        },
        success: function (res) {
          var str = res.data.split('jsonpCallback(')[1]
          var sell = JSON.parse(str.substring(0, str.length - 1)).attributes.sellList
          var data = []
          for (var i = 0; i < sell.length; i++) {
            sell[i].updateTime = util.formatTime(sell[i].updateTime)
            data.push(sell[i])
          }
          ctx.setData({
            sellList: data,
            sellBol: true
          })
        }
      })
    }
    
  },
  page: function (e) {
    wx.navigateTo({
      url: e.currentTarget.dataset.url
    })
  },
  onShareAppMessage: function () {
    return {
      title: this.detail.name
    }
  }
})