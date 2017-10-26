/*
 * @author: wes
 * @date: 2017-10-26
 * @desc: 收货地址列表
*/
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
    wx.navigateTo({
      url: e.currentTarget.dataset.url
    })
  },
  // 修改默认收货地址，跳转到购物车页面
  selectCurAddress: function (e) {
    var that = this
    var item = e.currentTarget.dataset.item
    item.isDefault = '1'
    wx.setStorage({
      key: 'curReceiver',
      data: item
    })

    if (e.currentTarget.dataset.isdefault === '0') {
      var list = this.data.list
      for (var i = 0; i < list.length; i++) {
        if (list[i].receiverId === item.receiverId) {
          var address = list[i]
          address.isDefault = '1'
          address.skey = app.globalData.member.skey
          address.model = JSON.stringify(address)
          address._method = 'put'
          wx.request({
            url: 'https://wx.jihui88.net/rest/api/shop/receiver/detail/' + item.receiverId,
            method: 'post',
            data: address,
            header: {
              'content-type': 'application/x-www-form-urlencoded'
            },
            success: function (res) {
              wx.navigateBack({
                delta: 1
              })
            }
          })
        } else {
          list[i].isDefault = '0'
        }
      }
      wx.setStorage({
        key: 'addressList',
        data: list
      })
    } else {
      wx.navigateBack({
        delta: 1
      })
    }
  },

  // 收货地址接口
  get: function () {
    var that = this
    wx.showNavigationBarLoading()
    wx.request({
      url: 'https://wx.jihui88.net/rest/api/shop/receiver/list',
      data: {
        skey: app.globalData.member.skey
      },
      success: function (res) {
        wx.setStorage({
          key: 'addressList',
          data: res.data.attributes.data
        })
        that.setData({
          list: res.data.attributes.data
        })
        wx.hideNavigationBarLoading()
      }
    })
  },

  // 新增收货地址
  xinzhenAddress: function () {
    var that = this
    wx.getSetting({
      success(res) {
        if (!res.authSetting['scope.address']) {
          wx.authorize({
            scope: 'scope.address',
            success() {
              that.wxAddress()
            },
            fail() {
              wx.navigateTo({
                url: 'addressDetail'
              })
            }
          })
        } else {
          that.wxAddress()
        }
      }
    })
  },

  // 微信收货地址，并转换成后台数据
  wxAddress: function () {
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
          countyName: res.countyName
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
        } else {
          that.getArea1(province)
        }

      }
    })
  },
  // 省级
  getArea1: function (province) {
    var that = this
    var areaPath = ''
    for (var i = 0; i < province.length; i++) {
      if (province[i].title === that.data.provinceName) {
        areaPath = province[i].value

        var city = wx.getStorageSync('area' + areaPath)
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
                key: 'area' + areaPath,
                data: city
              })
              that.getArea2(city)
            }
          })
        } else {
          that.getArea2(city)
        }
      }
    }
  },
  // 市级
  getArea2: function (city) {
    var that = this
    var areaPath = ''
    for (var i = 0; i < city.length; i++) {
      if (city[i].title === that.data.cityName) {
        areaPath = city[i].value;
        that.data.address.areaPath = areaPath;
        that.setData({
          address: that.data.address
        })

        var county = wx.getStorageSync('area' + areaPath)
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
                key: 'area' + areaPath,
                data: county
              })
              that.getArea3(county)
            }
          })
        } else {
          that.getArea3(county)
        }

      }
    }
  },
  // 县级
  getArea3: function (county) {
    var that = this
    if (county.length != 0 && that.data.countyName != null) {
      for (var i = 0; i < county.length; i++) {
        if (county[i].title === that.data.countyName) {
          that.data.address.areaPath = county[i].value;
          that.setData({
            address: that.data.address
          })
          that.addAddress()
        }
      }
    } else {
      that.addAddress()
    }
  },

  // 转换成功后，添加收货地址
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
        isNoneDelivery: '',
        phone: '',
        skey: app.globalData.member.skey
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        for (var i = 0; i < that.data.list.length; i++) {
          that.data.list[i].isDefault = '0'
        }
        that.data.list.push(res.data.attributes.data)
        wx.setStorage({
          key: 'addressList',
          data: that.data.list
        })
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
    var key = wx.getStorageSync('addressList')
    if (key) {
      this.setData({
        list: key
      })
    } else {
      this.get()
    }
  },

  onShow: function () {
    var key = wx.getStorageSync('addressList')
    if (key) {
      this.setData({
        list: key
      })
    } else {
      this.get()
    }
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
    return {
      title: '收货地址'
    }
  }
})
