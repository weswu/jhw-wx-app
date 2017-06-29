// addressDetail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    one:[], //字符集合
    oneIndex:0, // 实际显示参数
    two: ['请选择'],
    twoIndex:0,
    three: ['请选择'],
    threeIndex:0,
    province: [], //对像集合
    city: [],
    country: [],
    model:{},
    isAdd: true
  },
  // 选择地址
  pickChange: function(e) {
    var type = e.currentTarget.dataset.type
    if(type === '1'){
      var val = this.data.province[e.detail.value].value
      this.setData({
        oneIndex: e.detail.value,
        twoIndex: 0,
        threeIndex: 0,
        model: {
          areaPath: val
        }
      });
      this.childrenArea({ path: val, type: type })
    } else if (type === '2') {
      var val = this.data.city[e.detail.value].value
      this.setData({
        twoIndex: e.detail.value,
        threeIndex: 0,
        model: {
          areaPath: val
        }
      });
      this.childrenArea({ path: val, type: type })
    } else if (type === '3') {
      this.setData({
        threeIndex: e.detail.value,
        model: {
          areaPath: this.data.country[e.detail.value].value
        }
      });
    }
  },
  // 改变model
  model: function(e){
    var model = e.currentTarget.dataset.model
    if (model === 'name') {
      this.setData({
        model: {
          name: e.detail.value
        }
      })
    } else if (model === 'mobile') {
      this.setData({
        model: {
          mobile: e.detail.value
        }
      })
    } else if (model === 'zipCode') {
      this.setData({
        model: {
          zipCode: e.detail.value
        }
      })
    } else if (model === 'address') {
      this.setData({
        model: {
          address: e.detail.value
        }
      })
    }
  },
  // 提交
  submit: function(){
    var url= 'http://www.jihui88.com/rest/api/shop/receiver/detail';
    if(!isAdd){
      url= url + '/' + this.data.model.receiverId
    }
    wx.request({
      url: url,
      data: model,
      success: function (res) {
        console.log(res)
        wx.navigateTo({
          url: 'address'
        })
      }
    })
  },
  // 加载地区
  childrenArea: function(e){
    var that = this;
    wx.request({
      url: 'http://www.jihui88.com/rest/api/shop/area/childrenArea?path=' + e.path,
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
              two: one,
              model: {
                areaPath: data[0].value
              }
            })
          }
          if (e.type == '2') {
            that.setData({
              country: data,
              three: one,
              model: {
                areaPath: data[0].value
              }
            })
          }
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
    wx.request({
      url: 'http://www.jihui88.com/rest/api/shop/area/childrenArea',
      success: function (res) {
        var data = JSON.parse(res.data.attributes.data);
        var one =[]
        for(var i=0; i<data.length;i++){
          one.push(data[i].title)
        }
        if(options.id){
          that.setData({
            province: data,
            one: one
          })
        }else{
          that.setData({
            model: {
              areaPath: data[0].value
            }
          })
        }
        that.childrenArea({ path: data[0].value, type: '1' })
      }
    })
    if(options.id){
      wx.request({
        url: 'http://www.jihui88.com/rest/api/shop/receiver/detail/'+ options.id,
        success: function (res) {
          //var data= res.data.attributes.data;
          var data= {
            isDefault: "0",
            addTime: 1498555820109,
            enterpriseId: "Enterp_0000000000000000000049341",
            updateTime: null,
            mobile: "1513461568",
            receiverId: "8a9e457e5ce8d95c015ce8e3284d0003",
            areaPath: "402881882ba8753a012ba8cb1bbf005a,402881882ba8753a012ba8cc62870061,402881e44da29af5014da33bafbe0177",
            phone: "",
            zipCode: "322000",
            address: "详细地址",
            name: "名称"
          }
          var oneIndex=0;
          for(var i=0; i<that.data.province.length;i++){
            if(that.data.province[i].value == data.areaPath.split(',')[0]){
              oneIndex=i
            }
          }
          that.setData({
            oneIndex: oneIndex,
            isAdd: false,
            model: data
          })
          that.childrenArea({ path: data.areaPath.split(',')[0] + ',' + data.areaPath.split(',')[1], type: '2' })
        }
      })

    }
  },

  del: function(){
    wx.request({
      url: 'http://www.jihui88.com/rest/api/shop/receiver/detail/'+ this.data.model.receiverId,
      method: 'DELETE',
      success: function (res) {
        console.log(res)
        wx.navigateTo({
          url: 'address'
        })
      }
    })
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
