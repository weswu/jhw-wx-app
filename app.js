//app.js
App({
  onLaunch: function () {
    //调用API从本地缓存中获取数据
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
  },
  getUserInfo: function (cb) {
    var that = this;
    if (this.globalData.userInfo) {
      typeof cb == "function" && cb(this.globalData.userInfo)
    } else {
      //调用登录接口
      wx.login({
        success: function (res) {
          that.res = res
          wx.getUserInfo({
            success: function (res1) {
              that.globalData.userInfo = res1.userInfo
              wx.request({
                url: 'https://api.weixin.qq.com/sns/jscode2session',
                data: {
                  appid: 'wx860be22a8b03bbd9',
                  secret: '0070570f1225a9f9efa25265405c2efe',
                  js_code: that.res.code,
                  grant_type: 'authorization_code'
                },
                success: function (res2) {
                  that.res2 = res2
                  that.globalData.userInfo.openid = res2.data.openid
                  typeof cb == "function" && cb(that.globalData.userInfo)
                  console.log('res2' + res2.data.openid)
                  wx.request({
                    url: 'http://www.jihui88.com/rest/api/comm/site_oauth/oauth_wxapp',
                    data: {
                      openId: res2.data.openid,
                      entId: 'Enterp_0000000000000000000000923',
                      oauthType: 'wxapp',
                      nickname: that.globalData.userInfo.nickName || '',
                      headimgurl: that.globalData.userInfo.avatarUrl || '',
                      sex: that.globalData.userInfo.gender || '',
                      city: that.globalData.userInfo.city || '',
                      province: that.globalData.userInfo.province || '',
                      country: that.globalData.userInfo.country || ''
                    },
                    success: function (re) {
                      if (re.data.msg === '未绑定账号'){
                        wx.navigateTo({
                          url: '../login/login?openid=' + that.res2.data.openid
                        })
                      }
                    }
                  })
                }
              })
            }
          })



        }
      });
    }
  },
  getAuthorize: function() {
    wx.getSetting({
      success(res) {
        debugger
        if (!res['scope.record']) {
          wx.authorize({
            scope: 'scope.record',
            success(res) {
              // 用户已经同意小程序使用录音功能，后续调用 wx.startRecord 接口不会弹窗询问
              console.log('录音功能' + JSON.stringify(res))
            }
          })
        }
      }
    })
  },
  onShow: function () {
    console.log('App Show')
  },
  onHide: function () {
    console.log('App Hide')
  },
  globalData: {
    userInfo: null,
    enterpriseId: 'Enterp_0000000000000000000049341'
  }
})
