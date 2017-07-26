/*
 * @author: wes
 * @date: 2017-7-25
 * @desc: 产品详细
*/
var util = require('../../utils/util.js')
var app = getApp()

Page({
  data: {
    detail: {},
    id: '',
    nav: '1',
    isSell: false,
    sellList: [],
    empty: false,
    showModalStatus: false,
    attrList: [],
    argsList:[],
    num: 1,
    productAttr: '',
    skuCode: '',
    appendPrice: 0,
    appendIds: ''
  },
  page: function (e) {
    wx.navigateTo({
      url: e.currentTarget.dataset.url
    })
  },
  get: function () {
    var that = this
    //调用应用实例的方法获取全局数据
    wx.showNavigationBarLoading()
    console.log('产品详细'+ this.data.id +'加载中...')
    wx.request({
      url: 'https://api.jihui88.net/jihuiapi/products/single/' + this.data.id,
      success: function (res) {
        if (res.data.proddesc == null) {
          res.data.proddesc = ''
        } else {
          res.data.proddesc = res.data.proddesc.replace(/<img /g, "<img width='100%;' ").replace(/\"/g, "'").replace(/<style[^>]*?>[\s\S]*?<\/style>/g, "")
        }
        that.setData({
          detail: res.data
        })
        wx.setStorage({
          key: 'detail' + that.data.id,
          data: res.data
        })
        wx.hideNavigationBarLoading()
      }
    })
  },
  // 成交记录
  getSell: function () {
    wx.showLoading({
      title: '加载中',
    })
    var that = this
    wx.request({
      url: 'https://wx.jihui88.net/rest/api/shop/order/product/sellList',
      dataType: 'jsonp',
      data: {
        callback: "jsonpCallback",
        productId: this.data.detail.product_id,
        skey: app.globalData.member.skey
      },
      success: function (res) {
        wx.hideLoading()
        var str = res.data.split('jsonpCallback(')[1]
        var sell = JSON.parse(str.substring(0, str.length - 1)).attributes.sellList
        if(sell.length > 1){
          var data = []
          for (var i = 0; i < sell.length; i++) {
            sell[i].updateTime = util.formatTime(new Date(sell[i].updateTime))
            data.push(sell[i])
          }
          that.setData({
            sellList: data
          })
        }else{
          that.setData({
            empty: true
          })
        }
      }
    })
  },
  nav: function (e) {
    var ctx =this;
    var nav = e.currentTarget.dataset.nav;
    this.setData({
      nav: nav
    })
    if(nav === '2'){
      if (!this.data.isSell) {
        this.setData({
          isSell: true
        })
        this.getSell()
      }
    }
  },

  // 获取属性参数
  getAttr: function () {
    var that = this
    wx.request({
      url: 'https://wx.jihui88.net/rest/api/shop/order/args_list',
      data: {
        productId: this.data.detail.product_id,
        memberRankId: app.globalData.member.memberRankId,
        attrState: this.data.detail.attr_state,
        skey: app.globalData.member.skey
      },
      success: function (res) {
        var attrList = res.data.attributes.data

        for(var i=0; i<attrList.length; i++){
          var element= attrList[i].element;
          attrList[i].eleList = element.substring(1, element.length - 1).split(',')
        }
        that.setData({
          attrList: attrList,
          argsList: attrList[0] && attrList[0].argsList
        })
        wx.setStorage({
          key: 'attr' + that.data.id,
          data: attrList
        })
      }
    })
  },
  /* 下拉框切换 */
  setModalStatus: function (e) {
    var status = e.currentTarget.dataset.status
    if (status === "1" && this.data.attrList.length === 0){
      this.getAttr()
    }
    console.log("设置显示状态，1显示0不显示", status);
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    animation.translateY(300).step()
    this.setData({
      animationData: animation.export()
    })
    if (status == 1) {
      this.setData({
        showModalStatus: true
      });
    }
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        animationData: animation
      })
      if (status == 0) {
        this.setData({
          showModalStatus: false
        });
      }
    }.bind(this), 200)
  },
  /* 属性选择 */
  attrClick: function(e){
    // 选择边框
    this.data.attrList[e.target.dataset.index].dx = e.target.dataset.idx
    this.setData({
      attrList: this.data.attrList
    })
    // 属性图片

    var productAttr=''
    var skuCode = ''
    var appendIds=''
    var cost_price = 0
    var pic = ''
    for(var i=0; i<this.data.attrList.length; i++){
      var attr = this.data.attrList[i].eleList[this.data.attrList[i].dx] || ''
      if(appendIds === ''){
        appendIds = attr
        productAttr = this.data.attrList[i].name + ': ' + attr
      }else{
        appendIds = appendIds + ',' + attr
        productAttr = productAttr + ';  ' + this.data.attrList[i].name + ': ' + attr
      }
    }

    for(var i=0; i<this.data.argsList.length; i++){
      if(appendIds === this.data.argsList[i].sku_code){
        skuCode = this.data.argsList[i].id
        pic = this.data.argsList[i].pic
        cost_price = this.data.argsList[i].cost_price
      }
    }
    this.data.detail.price = cost_price
    this.setData({
      productAttr: productAttr,
      skuCode: skuCode,
      appendIds: appendIds,
      detail: this.data.detail
    })

    if(pic && pic != ''){
      this.data.detail.pic_path= 'http://img.jihui88.com/' + pic
      this.setData({
        detail: this.data.detail
      })
    }
  },
  /* 点击减号 */
  bindMinus: function() {
    var num = this.data.num;
    // 如果大于1时，才可以减
    if (num > 1) {
      num --;
    }
    // 只有大于一件的时候，才能normal状态，否则disable状态
    var minusStatus = num <= 1 ? 'disabled' : 'normal';
    // 将数值与状态写回
    this.setData({
      num: num,
      minusStatus: minusStatus
    });
  },
  /* 点击加号 */
  bindPlus: function() {
    var num = this.data.num;
    // 不作过多考虑自增1
    num ++;
    // 只有大于一件的时候，才能normal状态，否则disable状态
    var minusStatus = num < 1 ? 'disabled' : 'normal';
    // 将数值与状态写回
    this.setData({
      num: num,
      minusStatus: minusStatus
    });
  },
  /* 输入框事件 */
  bindManual: function(e) {
    var num = e.detail.value;
    // 将数值与状态写回
    this.setData({
      num: num
    });
  },
  /* 支付 */
  pay: function () {
    var that = this

    for(var i=0; i<this.data.attrList.length; i++){
      if(!this.data.attrList[i].dx && this.data.attrList[i].dx !== 0){
        wx.showModal({
          title: this.data.attrList[i].name+'未选择'
        })
        return false
      }
    }

    wx.request({
      url: 'https://wx.jihui88.net/rest/api/shop/cartItem/add',
      type: "get",
      dataType: "jsonp",
      data: {
        callback: "jsonpCallback",
        payType: '01',
        id: this.data.detail.product_id,
        quantity: this.data.num,
        mobileShop: true,
        entName: this.data.detail.name,
        productAttr: this.data.productAttr, // []
        skuCode: this.data.skuCode,
        appendPrice: this.data.appendPrice,
        appendIds: this.data.appendIds,
        formulaResult: '1',
        formulaStr: [],
        skey: app.globalData.member.skey
      },
      success: function (res) {
        var str = res.data.split('jsonpCallback(')[1]
        var data = JSON.parse(str.substring(0, str.length - 1))
        if (data.success){
          wx.navigateTo({
            url: '../cart/cart'
          })
        }else{
          wx.showModal({
            title: '提示',
            content: data.msg,
            success: function(res) {
              if (res.confirm) {
                console.log('用户点击确定')
              } else if (res.cancel) {
                console.log('用户点击取消')
              }
            }
          })
        }
      }
    })
  },
  onLoad: function (options) {
    this.setData({
      id: options.id,
      title: options.title || '产品详细'
    })
    var key = wx.getStorageSync('detail' + this.data.id)
    if (!key) {
      this.get()
    } else {
      this.setData({
        detail: key
      })
    }
    if(app.globalData.member === null){
      app.getUserInfo()
    }
  },
  onReady: function () {
    wx.setNavigationBarTitle({
      title: this.data.title
    })
  },
  onPullDownRefresh: function () {
    this.get()
    this.getSell()
    wx.stopPullDownRefresh()
  },
  onShareAppMessage: function () {
    return {
      title: this.data.detail.name
    }
  }
})
