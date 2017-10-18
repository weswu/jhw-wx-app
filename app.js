/*
 * @author: wes
 * @date: 2017-7-25
 * @desc: app.js
*/
App({
  get: function () {
    var that = this
    //调用登录接口
    wx.login({
      success: function (res) {
        var re = res
        // 用户信息
        wx.getUserInfo({
          success: function (res) {
            that.globalData.userInfo = res.userInfo
          }
        })
      }
    });
  },
  onLaunch: function () {
     // 登录用户信息
     this.get()
   },

  onShow: function () {
    console.log('App Show')
  },
  onHide: function () {
    console.log('App Hide')
  },
  // 全局变量
  globalData: {
    userInfo: null, 
    enterpriseId: 'Enterp_0000000000000000000006013',
    userId: 'User_000000000000000000000006231'
  }
})
