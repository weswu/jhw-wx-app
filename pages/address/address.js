// address.js
var app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    address: {}
  },

  page: function (e) {
    var that = this
    var url = e.currentTarget.dataset.url
    // 修改默认收货地址
    if(url === '../cart/cart'){
      var id = e.currentTarget.dataset.id
      for(var i=0; i<this.data.list.length; i++){
        if(this.data.list[i].receiverId === id){
          if(this.data.list[i].isDefault == '1'){
            var address = this.data.list[i]
            address.skey = app.globalData.member.skey
            address.model = JSON.stringify(address)
            address._method = 'put'
            wx.request({
              url: 'https://wx.jihui88.net/rest/api/shop/receiver/detail/'+ id,
              method: 'post',
              data: address,
              header: {
                'content-type': 'application/x-www-form-urlencoded'
              },
              success: function (res) {
                wx.navigateTo({
                  url: url
                })
              }
            })
          }else{
            wx.navigateTo({
              url: url
            })
          }

        }
      }

    }else{
      wx.navigateTo({
        url: url
      })
    }
  },
  get: function () {
    var that = this
    wx.showNavigationBarLoading()
    wx.request({
      url: 'https://wx.jihui88.net/rest/api/shop/receiver/list',
      data: {
        skey: app.globalData.member.skey
      },
      success: function (res) {
        that.setData({
          list: res.data.attributes.data
        })
      }
    })
    wx.hideNavigationBarLoading()
  },
  wxAddress: function(){
    var that = this
    wx.chooseAddress({
      success: function (res) {
        var address = {
          name: res.userName,
          zipCode: res.postalCode,
          areaPath: res.userName,
          address: res.detailInfo,
          mobile: res.telNumber
        }
        that.setData({
          address: address,
          provinceName: res.provinceName,
          cityName: res.cityName,
          countryName: res.countryName
        })

        var province = wx.getStorageSync('province')
        if (!province) {
          wx.request({
            url: 'https://wx.jihui88.net/rest/api/shop/area/childrenArea',
            data: {
              skey: app.globalData.member.skey
            },
            success: function (res) {
              province = JSON.parse(res.data.attributes.data);
              wx.setStorage({
                key: 'province',
                data: province
              })
              that.getArea1(province)
            }
          })
        }else{
          that.getArea1(province)
        }

      }
    })
  },
  getArea1: function (province) {
    var that = this
    var areaPath = ''
    for (var i = 0; i < province.length; i++) {
      if(province[i].title === that.data.provinceName){
        areaPath = province[i].value

        var city = wx.getStorageSync('area'+areaPath)
        if (!city) {
          wx.request({
            url: 'https://wx.jihui88.net/rest/api/shop/area/childrenArea',
            data: {
              path: areaPath,
              skey: app.globalData.member.skey
            },
            success: function (res) {
              city = JSON.parse(res.data.attributes.data);
              wx.setStorage({
                key: 'area'+areaPath,
                data: city
              })
              that.getArea2(city)
            }
          })
        }else{
          that.getArea2(city)
        }
      }
    }
  },
  getArea2: function (city) {
    var that = this
    var areaPath = ''
    for (var i = 0; i < city.length; i++) {
      if(city[i].title === that.data.cityName){
        areaPath=city[i].value;

        that.data.address.areaPath = areaPath;
        that.setData({
          address: that.data.address
        })
        var county = wx.getStorageSync('area'+areaPath)
        if (!county) {
          wx.request({
            url: 'https://wx.jihui88.net/rest/api/shop/area/childrenArea',
            data: {
              path: areaPath,
              skey: app.globalData.member.skey
            },
            success: function (res) {
              county = JSON.parse(res.data.attributes.data);
              wx.setStorage({
                key: 'area'+areaPath,
                data: county
              })
              that.getArea3(county)
            }
          })
        }else{
          that.getArea3(county)
        }

      }
    }
  },
  getArea3: function (county) {
    var that = this
    if (county.length != 0 && that.data.countryName != null) {
      for (var i = 0; i < county.length; i++) {
        if(county[i].title === that.data.countryName){
          that.data.address.areaPath = county[i].value;
          that.setData({
            address: that.data.address
          })
          that.addAddress()
        }
      }
    }else{
      that.addAddress()
    }
  },
  // 添加地址
  addAddress: function () {
    var that = this
    wx.request({
      url: 'https://wx.jihui88.net/rest/api/shop/receiver/detail',
      method: 'post',
      data: {
        isDefault: '1',
        name: this.data.address.name,
        mobile: this.data.address.mobile,
        areaPath: this.data.address.areaPath,
        address: this.data.address.address,
        zipCode: this.data.address.zipCode,
        isNoneDelivery:'',
        phone: '',
        skey: app.globalData.member.skey
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        that.data.list.push(res.data.attributes.data)
        that.setData({
          list: that.data.list
        })
      }
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
      title: '选择收货地址'
    })
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.get()
    wx.stopPullDownRefresh()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
