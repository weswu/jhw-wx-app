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
    sellBol: false,
    showModalStatus: false,
    num: 1,
    attrList: [
      {
        memberPrice: 368,
        price: "[0,0,0,0,0,0]",
        product_id: "Product_000000000000000000581520",
        attributeoptionstore: "['绿色','红色','白色','蓝色','炫黑','黑色']",
        name: "颜色",
        attrState: "01",
        id: "8a9e457e5ccf0ccb015cd372dba30279",
        element: "[红色,蓝色,炫黑,黑色]",
        argsList: [
          {
            member_price_state: "01",
            stock_num: 1000000,
            bar_code: "",
            id: "8a9e457e5ccf0ccb015cd372dba8027b",
            pic: "upload/j/j2/jihui88/picture/2017/06/01/fb542ad3-7e35-4411-aad6-f8c2f7dda8c0.jpg",
            sku_code: "红色,2个/件",
            cost_price: 736
          },
          {
            member_price_state: "01",
            stock_num: 1000000,
            bar_code: "",
            id: "8a9e457e5ccf0ccb015cd372dba9027c",
            pic: "upload/j/j2/jihui88/picture/2017/06/01/512f3149-4813-4b1b-806e-3fa46c760b08.jpg",
            sku_code: "蓝色,2个/件",
            cost_price: 736
          },
          {
            member_price_state: "01",
            stock_num: 1000000,
            bar_code: "",
            id: "8a9e457e5ccf0ccb015cd372dba9027d",
            pic: "",
            sku_code: "炫黑,2个/件",
            cost_price: 736
          },
          {
            member_price_state: "01",
            stock_num: 1000000,
            bar_code: "",
            id: "8a9e457e5ccf0ccb015cd372dbaa027e",
            pic: "",
            sku_code: "黑色,2个/件",
            cost_price: 736
          }
        ]
      },
      {
        price: "[0]",
        product_id: "Product_000000000000000000581520",
        attributeoptionstore: "['2个/ 件']",
        name: "产品数量",
        attrState: "01",
        id: "8a9e457e5ccf0ccb015cd372dba3027a",
        element: "[2个/件]",
        argsList: [
          {
            $ref: "$.attributes.data[0].argsList[0]"
          },
          {
            $ref: "$.attributes.data[0].argsList[1]"
          },
          {
            $ref: "$.attributes.data[0].argsList[2]"
          },
          {
            $ref: "$.attributes.data[0].argsList[3]"
          }
        ]
      }
    ]
  },
  removeHTMLTag: function (str) {
    str = str.replace(/<\/?[^>]*>/g, ''); //去除HTML tag
    str = str.replace(/[ | ]*\n/g, '\n'); //去除行尾空白
    str = str.replace(/\n[\s| | ]*\r/g,'\n'); //去除多余空行
    str=str.replace(/&nbsp;/ig, '');//去掉&nbsp;
    return str;
  },
  setModalStatus: function (e) {
    console.log("设置显示状态，1显示0不显示", e.currentTarget.dataset.status);
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
    if (e.currentTarget.dataset.status == 1) {
      this.setData(
        {
          showModalStatus: true
        }
      );
    }
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        animationData: animation
      })
      if (e.currentTarget.dataset.status == 0) {
        this.setData(
          {
            showModalStatus: false
          }
        );
      }
    }.bind(this), 200)
  },
  attrClick: function(e){
    // 属性图片
    var pic =this.data.attrList[e.target.dataset.index].argsList[e.target.dataset.idx].pic
    if(pic && pic != ''){
      this.data.detail.pic_path= 'http://img.jihui88.com/' + pic
      this.setData({
        detail: this.data.detail
      })
    }
    // 选择边框
    this.data.attrList[e.target.dataset.index].dx = e.target.dataset.idx
    this.setData({
      attrList: this.data.attrList
    })
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
  onLoad: function (options) {
    this.getDetail(options.id)
    this.setData({
      id: options.id
    })// 属性处理
    var that= this
    for(var i=0; i<this.data.attrList.length; i++){
      var element= this.data.attrList[i].element;
      this.data.attrList[i].eleList = element.substring(1, element.length - 1).split(',')
      this.data.attrList[i].dx = 0
    }
    this.setData({
      attrList: this.data.attrList
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
