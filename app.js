/*
 * @author: wes
 * @date: 2017-7-25
 * @desc: app.js
*/
App({
  get: function(){
    var that = this
    //调用登录接口
    wx.login({
      success: function (res) {
        // 登录
        wx.request({
          method: 'post',
          url: 'https://wx.jihui88.net/rest/api/shop/member/wxapplogin',
          data: {
            code: res.code,
            enterpriseId: that.globalData.enterpriseId,
            skey: wx.getStorageSync('skey') || ''
          },
          header: {
            'content-type': 'application/x-www-form-urlencoded'
          },
          success: function (res) {
            if(res.data.attributes.data == null){
              alert('none')
            }
            res.data.attributes.data.skey = res.data.attributes.data.skey || ''
            that.globalData.member = res.data.attributes.data
            wx.setStorage({
              key: 'skey',
              data: res.data.attributes.data.skey
            })
          }
        })
        // 用户信息
        wx.getUserInfo({
          success: function (res) {
            that.globalData.userInfo = res.userInfo
          }
        })
      }
    });
  },
  getUserInfo: function () {
    if (!this.globalData.userInfo || !this.globalData.member) {
      this.get()
    }
  },
  onLaunch: function () {
    //调用API从本地缓存中获取数据
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    this.getUserInfo()

  },

  onShow: function () {
    console.log('App Show')
  },
  onHide: function () {
    console.log('App Hide')
  },
  // Enterp_0000000000000000000049341    Enterp_0000000000000000000049090  Enterp_0000000000000000000054083
  globalData: {
    appid: 'wx860be22a8b03bbd9',
    userInfo: null,
    member: null,
    enterpriseId: 'Enterp_0000000000000000000049090',
    userId: 'User_000000000000000000000050555'
  }
})
