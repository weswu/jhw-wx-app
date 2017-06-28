// login.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    username: '',
    password: '',
    openid: '',
    focus1: false,
    focus2: false
  },

  submit: function(){
    var that = this
    wx.request({
      url: 'http://www.jihui88.com/rest/api/shop/member/register',
      data: {
        callback: 'jsonpCallback',
        oauthType: 'wxapp',
        oauthOpenId: that.data.openid, // 必须的
        username: that.data.username,
        password: that.data.password,
        randCode: '',
        enterpriseId:'Enterp_0000000000000000000000923',
        userDomain: '',
        model: JSON.stringify({name: ''}),
        cookie: ''
      },
      success: function (res) {
        console.log(res.data)
      }
    })
  },
  model: function(e){
    if (!e.detail.value) return
    var model = e.currentTarget.dataset.model
    if(model === 'username'){
      this.setData({
        username: e.detail.value
      })
    }else{
      this.setData({
        password: e.detail.value
      })
    }
  },
  active: function (e) {
    var model = e.currentTarget.dataset.model
    if (model === 'username') {
      this.setData({
        focus1: true
      })
    } else {
      this.setData({
        focus2: true
      })
    }
  },
  end: function (e) {
    var model = e.currentTarget.dataset.model
    if (model === 'username') {
      this.setData({
        focus1: false
      })
    } else {
      this.setData({
        focus2: false
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      openid: options.openid
    })

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

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
