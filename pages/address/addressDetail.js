// addressDetail.js
var app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 1
    province: [], //对像集合
    one:['请选择'], //字符集合
    oneIndex:0, // 实际显示参数
    // 2
    city: [],
    two: ['请选择'],
    twoIndex:0,
    // 3
    county: [],
    three: ['请选择'],
    threeIndex:0,
    address:{},
    isAdd: true
  },
  get: function () {
    var that = this
    wx.showNavigationBarLoading()
    wx.request({
      url: 'https://wx.jihui88.net/rest/api/shop/receiver/detail/'+ this.data.address.receiverId,
      data: {
        skey: app.globalData.member.skey
      },
      success: function (res) {
        var data= res.data.attributes.data;
        var oneIndex=0;
        for(var i=0; i<that.data.province.length;i++){
          if(that.data.province[i].value == data.areaPath.split(',')[0]){
            oneIndex=i
          }
        }
        that.setData({
          oneIndex: oneIndex,
          isAdd: false,
          address: data
        })
        that.childrenArea({ path: data.areaPath.split(',')[0], type: '1' ,init: true})
        that.childrenArea({ path: data.areaPath.split(',')[0]+','+data.areaPath.split(',')[1], type: '2' ,init: true})
        wx.hideNavigationBarLoading()
      }
    })
  },
  // 选择地址
  pickChange: function(e) {
    var type = e.currentTarget.dataset.type
    if(type === '1'){
      var val = this.data.province[e.detail.value].value
      this.data.address.areaPath =  val
      this.setData({
        oneIndex: e.detail.value,
        twoIndex: 0,
        threeIndex: 0,
        address: this.data.address
      });
      this.childrenArea({ path: val, type: type })
    } else if (type === '2') {
      var val = this.data.city[e.detail.value].value
      this.data.address.areaPath =  val
      this.setData({
        twoIndex: e.detail.value,
        threeIndex: 0,
        address: this.data.address
      });
      this.childrenArea({ path: val, type: type })
    } else if (type === '3') {
      this.data.address.areaPath =  this.data.county[e.detail.value].value
      this.setData({
        threeIndex: e.detail.value,
        address: this.data.address
      });
    }
  },
  // 加载地区
  childrenArea: function(e){
    var that = this;
    wx.request({
      url: 'https://wx.jihui88.net/rest/api/shop/area/childrenArea?path=' + e.path,
      success: function (res) {
        var data = JSON.parse(res.data.attributes.data);
        var one = []
        if (data.length > 0){
          for (var i = 0; i < data.length; i++) {
            one.push(data[i].title)
          }
          if (e.type == '1') {
            that.setData({
              city: data,
              two: one
            })
          }
          if (e.type == '2') {
            that.setData({
              county: data,
              three: one
            })
          }
          if(e.init){
            var index = 0
            var areaPath
            if (e.type == '1') {
              areaPath =that.data.address.areaPath.split(',')[0]+','+that.data.address.areaPath.split(',')[1]
            }else{
              areaPath =that.data.address.areaPath
            }
            for(var i=0; i<data.length;i++){
              if(data[i].value === areaPath){
                index=i
              }
            }
            if (e.type == '1') {
              that.setData({
                twoIndex: index
              })
            }else{
              that.setData({
                threeIndex: index
              })
            }
          }else{
            that.data.address.areaPath = data[0].value
            that.setData({
              address: that.data.address
            })
          }
        }
      }
    })
  },

  // 输入信息
  address: function(e){
    var address = e.currentTarget.dataset.address
    if (address === 'name') {
      this.data.address.name = e.detail.value
    } else if (address === 'mobile') {
      this.data.address.mobile = e.detail.value
    } else if (address === 'zipCode') {
      this.data.address.zipCode = e.detail.value
    } else if (address === 'address') {
      this.data.address.address = e.detail.value
    }
    this.setData({
      address: this.data.address
    })
  },
  // 提交
  submit: function(){
    var that = this
    if(!this.data.address.name){
      this.dialog('姓名不能为空！')
      return false
    }
    var tel = /^1[3|4|5|8][0-9]\d{4,8}$/;
    if(!tel.test(this.data.address.mobile)){
      this.dialog('手机号码错误！')
      return false
    }
    if(!this.data.address.mobile){
      this.dialog('电话不能为空！')
      return false
    }
    if(!this.data.address.address){
      this.dialog('收货地址不能为空！')
      return false
    }
    this.data.address.isDefault = '1'
    var url= 'https://wx.jihui88.net/rest/api/shop/receiver/detail';
    if(!this.data.isAdd){
      url= url + '/' + this.data.address.receiverId
      this.data.address.model = JSON.stringify(this.data.address)
      this.data.address._method = 'put'
    }
    this.data.address.skey = app.globalData.member.skey
    wx.request({
      url: url,
      method: 'post',
      data: this.data.address,
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var key = wx.getStorageSync('addressList')
        var data = res.data.attributes.data
        if(that.data.isAdd){
          if (key) {
            key.push(data)
          }else{
            key= data
          }
        }else{
          for(var i=0; i<key.length; i++){
            if(key[i].receiverId === data.receiverId){
              data.isDefault = '1'
              key[i] = data
            }else{
              key[i].isDefault = '0'
            }
          }
        }
        wx.setStorage({
          key: 'addressList',
          data: key
        })
        wx.navigateBack({
          delta: 1
        })
      }
    })
  },
  dialog: function (title) {
    wx.showModal({
      title: '提示',
      content: title
    })
  },
  // 删除
  del: function(){
    var that = this
    wx.request({
      url: 'https://wx.jihui88.net/rest/api/shop/receiver/detail/'+ this.data.address.receiverId,
      method: 'post',
      data: {
        _method: 'DELETE',
        skey: app.globalData.member.skey
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        if(res.data.success){
          var key = wx.getStorageSync('addressList')
          for(var i=0; i<key.length; i++){
            if(key[i].receiverId === that.data.address.receiverId){
              key.splice(i,1)
              wx.setStorage({
                key: 'addressList',
                data: key
              })
            }
          }
        }

        wx.navigateBack({
          delta: 1
        })
      }
    })
  },

  // 初始化
  getProvince: function () {
    var that = this
    var province = wx.getStorageSync('province')
    if (!province) {
      wx.request({
        url: 'https://wx.jihui88.net/rest/api/shop/area/childrenArea',
        data: {
          skey: app.globalData.member.skey
        },
        success: function (res) {
          var province = JSON.parse(res.data.attributes.data);
          wx.setStorage({
            key: 'province',
            data: province
          })
          that.one(province)
        }
      })
    }else{
      this.one(province)
    }
  },
  one: function (province) {
    var one =[]
    for(var i=0; i<province.length;i++){
      one.push(province[i].title)
    }
    this.setData({
      province: province,
      one: one
    })
    if(this.data.isAdd){
      this.childrenArea({ path: province[0].value, type: '1' })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getProvince()
    if(options.id){
      this.data.address.receiverId = options.id
      this.setData({
        address: this.data.address
      })
      this.get()
    }
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function (e) {
    var title= '收货地址详细'
    if (!this.data.isAdd) { title = '修改收货地址' } else { title = '新增收货地址'}
    wx.setNavigationBarTitle({
      title: title
    })
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.get()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
