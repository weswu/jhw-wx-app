// order.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: []
  },

  page: function (e) {
    wx.navigateTo({
      url: e.currentTarget.dataset.url
    })
  },

  get: function(){
    var that= this
    that.setData({
      list: [
        {
          paymentConfig: {
            paymentConfigType: "wxpay",
            addTime: 1444377341769,
            enterpriseId: "Enterp_0000000000000000000049341",
            updateTime: 1444377341770,
            paymentId: "ff808181504993a701504b992f4b0179",
            paymentFeeType: "fixed",
            configObject: {
              bargainorId: "1234772102",
              appid: "wx5d814394f898b87a",
              appsecret: "bb3fe22d634bcf0e24e4a69e6c1be1e5",
              key: "8934e7d15453e97507ef794cf7b0519d"
            },
            paymentFee: 0,
            sort: 0,
            name: "微信支付",
            description: null
          },
          paymentConfigName: "免配送",
          totalAmount: 2000.01,
          paidAmount: 0,
          orderItemSet: [
            {
              itemId: "8a9e457e5ce923fc015cec8704e800a9",
              addTime: 1498616932123,
              enterpriseId: "Enterp_0000000000000000000049341",
              paytype: null,
              productQuantity: 2,
              productAttr: "",
              product: {
                sell: 3,
                folder: null,
                addTime: 1445047431504,
                enterpriseId: "Enterp_0000000000000000000049341",
                price: 1000,
                publishTime: null,
                unpublishTime: null,
                memberPriceList: null,
                memberLimitList: null,
                adduserId: "User_000000000000000000000050555",
                attachList: null,
                productId: "Product_000000000000000000389071",
                attList: null,
                store: 998,
                productAttributeMapStore: [],
                customAttr: null,
                formula: null,
                attrState: "00",
                attrItems: null,
                weight: 0,
                integralRule: null,
                picPath: "upload/j/j2/jihui/picture/2015/12/04/460b2032-fbc8-4b60-90be-9e9742c0142c.jpg",
                productSn: "SN_D51B3B9418ED",
                activity: null,
                lanId: 1,
                auditTime: null,
                pModel: null,
                prodtype: "11",
                pkey: null,
                unit: "件",
                brand: null,
                entType: null,
                seoDescription: null,
                contactId: null,
                publish: "01",
                viewsum: "369",
                isdisplay: "0",
                loginView: "0",
                broadcast: null,
                detailTitle1: "产品描述",
                detailTitle2: "产品功能",
                detail3: "{}",
                seoTitle: null,
                adminBroadcast: null,
                ads: null,
                marketPrice: 1000,
                weightUnit: "kg",
                freezeStore: 0,
                isMarketable: "01",
                isBest: "00",
                isNew: "00",
                detailTitle3: "产品参数",
                detail1: null,
                detail2: null,
                customAttrMapStore: null,
                productCustomAttributeMapStore: null,
                productStaticAttributeMapStore: null,
                jsonDetail3: {},
                certificateList: null,
                tagMapStore: [],
                picUrl5: "http://img.jihui88.com/upload/j/j2/jihui/picture/2015/12/04/460b2032-fbc8-4b60-90be-9e9742c0142c_5.jpg",
                picUrl: "http://img.jihui88.com/upload/j/j2/jihui/picture/2015/12/04/460b2032-fbc8-4b60-90be-9e9742c0142c.jpg",
                picUrl8: "http://img.jihui88.com/upload/j/j2/jihui/picture/2015/12/04/460b2032-fbc8-4b60-90be-9e9742c0142c_8.jpg",
                picUrl6: "http://img.jihui88.com/upload/j/j2/jihui/picture/2015/12/04/460b2032-fbc8-4b60-90be-9e9742c0142c_6.jpg",
                picUrl7: "http://img.jihui88.com/upload/j/j2/jihui/picture/2015/12/04/460b2032-fbc8-4b60-90be-9e9742c0142c_7.jpg",
                picUrl3: "http://img.jihui88.com/upload/j/j2/jihui/picture/2015/12/04/460b2032-fbc8-4b60-90be-9e9742c0142c_3.jpg",
                picUrl4: "http://img.jihui88.com/upload/j/j2/jihui/picture/2015/12/04/460b2032-fbc8-4b60-90be-9e9742c0142c_4.jpg",
                albumList: null,
                c_url: null,
                mobiledesc: null,
                isAgent: null,
                attributeList: null,
                purchaseNum: 0,
                subTotalPrice: null,
                priceState: null,
                limitState: null,
                integralState: null,
                sort: 38,
                category: "Category_00000000000000000259943",
                name: "微传单完整版",
                state: "01",
                type: "NM",
                domain: null,
                endTime: null,
                username: null
              },
              skuCode: "",
              updateTime: 1498616890600,
              deliveryQuantity: 0,
              totalDeliveryQuantity: 0,
              productSn: "SN_D51B3B9418ED",
              buyname: "wxwjihui88",
              productName: "微传单完整版",
              productPrice: 1000,
              productHtmlFilePath: null
            },
            {
              itemId: "8a9e457e5ce923fc015cec8704f400aa",
              addTime: 1498616932125,
              enterpriseId: "Enterp_0000000000000000000049341",
              paytype: null,
              productQuantity: 1,
              productAttr: "",
              product: {
                sell: 49,
                folder: null,
                addTime: 1444375945140,
                enterpriseId: "Enterp_0000000000000000000049341",
                price: 0.01,
                publishTime: null,
                unpublishTime: null,
                memberPriceList: null,
                memberLimitList: null,
                adduserId: "User_000000000000000000000050555",
                attachList: null,
                productId: "Product_000000000000000000389072",
                attList: null,
                store: 885,
                productAttributeMapStore: [],
                customAttr: "[]",
                formula: null,
                attrState: "00",
                attrItems: null,
                weight: 0,
                integralRule: null,
                picPath: "upload/j/j2/jihui/picture/2015/12/04/0e9481cf-3599-4bc0-a42f-f710b101c91f.jpg",
                productSn: "SN_B40A06A36779",
                activity: null,
                lanId: 1,
                auditTime: null,
                pModel: null,
                prodtype: "11",
                pkey: null,
                unit: "件",
                brand: null,
                entType: null,
                seoDescription: null,
                contactId: null,
                publish: "01",
                viewsum: "990",
                isdisplay: "0",
                loginView: "0",
                broadcast: null,
                detailTitle1: "产品描述",
                detailTitle2: "产品功能",
                detail3: "{}",
                seoTitle: null,
                adminBroadcast: null,
                ads: null,
                marketPrice: 0.01,
                weightUnit: "kg",
                freezeStore: 0,
                isMarketable: "01",
                isBest: "00",
                isNew: "00",
                isHot: "00",
                mainPic: null,
                detailTitle3: "产品参数",
                detail1: null,
                detail2: null,
                customAttrMapStore: [],
                productCustomAttributeMapStore: null,
                productStaticAttributeMapStore: null,
                jsonDetail3: {},
                certificateList: null,
                tagMapStore: [],
                picUrl5: "http://img.jihui88.com/upload/j/j2/jihui/picture/2015/12/04/0e9481cf-3599-4bc0-a42f-f710b101c91f_5.jpg",
                picUrl: "http://img.jihui88.com/upload/j/j2/jihui/picture/2015/12/04/0e9481cf-3599-4bc0-a42f-f710b101c91f.jpg",
                picUrl8: "http://img.jihui88.com/upload/j/j2/jihui/picture/2015/12/04/0e9481cf-3599-4bc0-a42f-f710b101c91f_8.jpg",
                picUrl6: "http://img.jihui88.com/upload/j/j2/jihui/picture/2015/12/04/0e9481cf-3599-4bc0-a42f-f710b101c91f_6.jpg",
                picUrl7: "http://img.jihui88.com/upload/j/j2/jihui/picture/2015/12/04/0e9481cf-3599-4bc0-a42f-f710b101c91f_7.jpg",
                picUrl3: "http://img.jihui88.com/upload/j/j2/jihui/picture/2015/12/04/0e9481cf-3599-4bc0-a42f-f710b101c91f_3.jpg",
                picUrl4: "http://img.jihui88.com/upload/j/j2/jihui/picture/2015/12/04/0e9481cf-3599-4bc0-a42f-f710b101c91f_4.jpg",
                albumList: null,
                c_url: null,
                mobiledesc: null,
                isAgent: null,
                attributeList: null,
                purchaseNum: 0,
                subTotalPrice: null,
                priceState: null,
                limitState: null,
                integralState: null,
                sort: 39,
                category: "Category_00000000000000000259943",
                name: "微传单免费版",
                state: "01",
                type: "NM",
                domain: null,
                endTime: null,
                username: null
              },
              skuCode: "",
              updateTime: 1498616890611,
              deliveryQuantity: 0,
              totalDeliveryQuantity: 0,
              productSn: "SN_B40A06A36779",
              buyname: "wxwjihui88",
              productName: "微传单免费版",
              productPrice: 0.01,
              productHtmlFilePath: null
            }
          ],
          paySn: null,
          orderSn: "20170628094855",
          deliveryType: {
            deliveryMethod: "none",
            deliveryFee: null,
            addTime: 1444380110507,
            enterpriseId: "Enterp_0000000000000000000049341",
            belongId: null,
            updateTime: 1453780180524,
            typeId: "ff808181504993a701504bc36eac018d",
            firstWeight: 0,
            continueWeight: 0,
            firstWeightUnit: "g",
            continueWeightUnit: "g",
            firstWeightPrice: 0,
            continueWeightPrice: 0,
            defaultDeliveryCorp: null,
            totexts: null,
            toids: null,
            sort: 0,
            name: "无配送",
            description: null
          },
          deliveryFee: 0,
          addTime: "2017-06-28 10:28:10",
          orderStatus: "unprocessed",
          paymentStatus: "unpaid",
          shippingStatus: "unshipped",
          orderId: "8a9e457e5ce923fc015cec8704cc00a8",
          enterpriseId: "Enterp_0000000000000000000049341",
          paytype: "mobile",
          belongId: null,
          productTotalPrice: 2000.01,
          updateTime: "2017-06-28 10:28:10",
          paymentSet: [],
          deliveryTypeName: "无配送",
          shipName: "名称",
          shipArea: "内蒙古自治区呼伦贝尔市牙克石市",
          shipAreaPath: "402881882ba8753a012ba8cb1bbf005a,402881882ba8753a012ba8cc62870061,402881e44da29af5014da33bafbe0177",
          shipAddress: "详细地址",
          shipZipCode: "322000",
          shipPhone: "",
          shipMobile: "1513461568",
          memo: "",
          paymentFee: 0,
          productWeight: 0,
          productWeightUnit: "g",
          productTotalQuantity: 3,
          orderLogSet: [
            {
              orderSn: "20170628094855",
              addTime: "2017-06-28 10:28:10",
              enterpriseId: null,
              updateTime: "2017-06-28 10:28:10",
              operator: null,
              logId: "8a9e457e5ce923fc015cec87050c00ab",
              orderLogType: "create",
              info: null
            }
          ],
          refundSet: [],
          shippingSet: [],
          reshipSet: [],
          invoiceName: null,
          invoiceAmount: null,
          outTradeNo: null,
          memberObj: {
            deposit: 0,
            openid: null,
            addTime: null,
            enterpriseId: null,
            email: "wxwjihui88@qq.com",
            memberId: null,
            memberRank: {
              rankId: "ff808181504993a701505164765d0326",
              isDefault: "01",
              addTime: 1444474549852,
              enterpriseId: "Enterp_0000000000000000000049341",
              point: 0,
              updateTime: 1444474549853,
              rdesc: null,
              preferentialScale: 100,
              name: "普通会员"
            },
            belongId: null,
            isAccountEnabled: null,
            safeQuestion: null,
            point: null,
            updateTime: null,
            img: null,
            sex: null,
            city: null,
            isAccountLocked: null,
            safeAnswer: null,
            loginFailureCount: null,
            lockedDate: null,
            registerIp: null,
            loginIp: "127.0.0.1",
            loginDate: null,
            passwordRecoverKey: null,
            cartItemSet: null,
            receiverSet: null,
            memberAttributeMapStore: null,
            depositSet: null,
            mobile: null,
            province: null,
            vericode: null,
            name: null,
            country: null,
            username: "wxwjihui88"
          }
        }
      ]
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.get()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    wx.setNavigationBarTitle({
      title: '我的订单'
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
    this.get()
    wx.stopPullDownRefresh()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.get()

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
