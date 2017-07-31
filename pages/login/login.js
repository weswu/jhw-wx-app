/*
 * @author: wes
 * @date: 2017-7-25
 * @desc: 登录 --- 功能未使用
*/
Page({

  /**
   * 页面的初始数据
   */
  data: {
    username: '',
    password: '',
    randCode: '',
    veriImg: 'veriImg',
    focus: ''
  },

  page: function(e) {
    wx.navigateTo({
        url: e.currentTarget.dataset.url
    })
  },
  verifyPic: function () {
    this.setData({
      veriImg: 'veriImg?v=' + new Date().getTime()
    })
  },
  submit: function(){
    var that = this
    wx.request({
      method: 'post',
      url: 'https://wx.jihui88.net/rest/api/shop/member/login2',
      data: {
        model: JSON.stringify({
          username: this.data.username,
          password: this.data.password,
          randCode: this.data.randCode,
          enterpriseId: 'Enterp_0000000000000000000000923'
        }),
        _method: 'post',
        username: this.data.username,
        password: this.data.password,
        randCode: this.data.randCode,
        enterpriseId: 'Enterp_0000000000000000000000923'
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        console.log(res.data)
      }
    })
  },
  model: function(e){
    if (!e.detail.value) return
    var active = e.currentTarget.dataset.active
    if(active === '1'){
      this.setData({
        username: e.detail.value
      })
    }else if (active === '2'){
      this.setData({
        password: e.detail.value
      })
    }else{
      this.setData({
        randCode: e.detail.value
      })
    }
  },
  focus: function (e) {
    this.setData({
      focus: e.currentTarget.dataset.active
    })
  },
  blur: function (e) {
    this.setData({
      focus: ''
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('onLoad')
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    wx.setNavigationBarTitle({
      title: '会员登录'
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
