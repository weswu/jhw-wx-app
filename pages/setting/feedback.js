/*
 * @author: wes
 * @date: 2017-7-27
 * @desc: 反馈
*/
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    fromName: '',
    fromPhone: '',
    fromEmail: '',
    content: '',
    valiCode: '',
    skey: '',
    time: '00000'
  },
  model: function (e) {
    var active = e.currentTarget.dataset.active
    if (active === '1') {
      this.setData({
        fromName: e.detail.value
      })
    } else if (active === '2') {
      this.setData({
        fromPhone: e.detail.value
      })
    } else if (active === '3') {
      this.setData({
        fromEmail: e.detail.value
      })
    } else if (active === '4') {
      this.setData({
        valiCode: e.detail.value
      })
    } else {
      this.setData({
        content: e.detail.value
      })
    }
  },
  time: function () {
    this.setData({
      time: new Date().getTime()
    })
  },
  // 提交
  submit: function () {
    var that = this
    if (!this.data.fromName) {
      wx.showModal({
        title: '姓名不能为空'
      })
      return false
    }
    if (!this.data.fromPhone && !this.data.fromEmail) {
      wx.showModal({
        title: '电话和邮箱不能都为空'
      })
      return false
    }
    var tel = /^1[3|4|5|8][0-9]\d{4,8}$/;
    if (this.data.fromPhone !== '' && !tel.test(this.data.fromPhone)) {
      wx.showModal({
        title: '手机号码错误！'
      })
      return false
    }
    if (this.data.fromEmail !== '' && this.data.fromEmail.indexOf('@') === -1) {
      wx.showModal({
        title: '邮箱错误！'
      })
      return false
    }
    if (!this.data.content) {
      wx.showModal({
        title: '建议不能为空'
      })
      return false
    }
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      method: 'post',
      url: 'https://wx.jihui88.net/site_message/send',
      data: {
        title: "小程序-用户反馈",
        content: this.data.content,
        valiCode: this.data.valiCode,
        recvUser: app.globalData.userId,
        recvEnt: app.globalData.enterpriseId,
        fromName: this.data.fromName,
        fromPhone: this.data.fromPhone,
        fromEmail: this.data.fromEmail,
        skey: app.globalData.member.skey
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        wx.hideLoading()
        that.setData({
          time: new Date().getTime()
        })
        if (res.data === "alert('发送成功!')") {
          wx.showModal({
            title: '留言成功',
            content: '返回上一页',
            success: function (res) {
              if (res.confirm) {
                wx.navigateBack({
                  delta: 1
                })
              } else if (res.cancel) {
                that.setData({
                  fromName: '',
                  fromPhone: '',
                  fromEmail: '',
                  content: ''
                })
              }
            }
          })
        } else {
          var error = '留言失败'
          if (res.data.indexOf('验证码错误')) {error = '验证码错误'}
          wx.showModal({
            title: error
          })
        }
      }
    })
  },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
      this.setData({
        skey: app.globalData.member.skey
      })
    },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: '意见反馈'
    }
  }
})
