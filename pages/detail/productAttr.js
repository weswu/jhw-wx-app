// productAttr.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    array: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
    index: 0,
    detail: {
      name: '',
      price: '',
      pic_path: '',
      id: '',
      store: ''
    },
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
    ],
    productAttr: ''

  },

  pickChange:function (e) {
    this.setData({
      index: e.detail.value
    });
  },
  back: function(){
    wx.navigateBack({
      delta: 1
    })
  },

  submit: function (e) {
    var that= this;
    if(this.data.productAttr === ''){
      console.log('属性不能为空')
    }
    /**
    var argsList= this.data.attrList[0].argsList
    for(var i=0; i<argsList.length; i++){
      if(argsList[i].sku_code  === this.data.productAttr ){
        skuCode=argsList[i].sku_code
      }
    }
    */

    wx.request({
      url: 'http://www.jihui88.com/rest/api/shop/cartItem/add',
      data: {
        payType: '01',
        id: this.data.detail.id, // 产品ID
        quantity: this.data.index, // 购买数量
        mobileShop: true, // 是否是手机端
        entName: '机汇网', // 公司名称
        productAttr: this.data.productAttr, // 产品属性
        appendIds: this.data.skuCode,
        formulaResult: '1', // 计算表达式结果
        skuCode: this.data.skuCode, // skuCode
        formulaStr: '1*1', // 计算表达式
        callback: 'jsonp'
      },
      success: function (res) {
        wx.navigateTo({
          url: e.currentTarget.dataset.url
        })
      }
    })
  },
  getAttrList: function(){
    var that= this
    wx.request({
      url: 'http://sj.jihui88.com/rest/api/comm/product/args_list',
      data: {
        productId: 'Product_000000000000000000581520',
        memberRankId: 'ff8081814ee3209b014ef23fcb060050',
        attrState: '01',
        callback: 'jsonp2'
      },
      success: function (res) {
        console.log(res)
        that.setData({
          proList: res.data.list
        })
        wx.hideNavigationBarLoading()
      }
    })
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
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      detail: {
        name: options.name,
        price: options.price,
        pic_path: options.pic_path,
        id: options.id,
        store: options.store
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.getAttrList()

    // 属性处理
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

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
