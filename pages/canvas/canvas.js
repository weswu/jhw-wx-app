// pages/canvas.js
var app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    name: '',
    price:'',
    pic: '',
    qrcode: '',
    company: {}
  },

  getwxQr: function () {
    var that = this
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: 'https://api.jihui88.net/jihui_wxapp/api/app/wxacodeunlimit',
      method: 'post',
      data: {
        appid: app.globalData.appid,
        path_name: 'pages/detail/detail?id='+this.data.id+'&title='+this.data.name.trim(),
        scene: this.data.id
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        wx.hideLoading()
        that.setData({
          qrcode: res.data.code
        })
        that.can()
      }
    })
  },
  get: function () {
    var that = this
    wx.showNavigationBarLoading()
    wx.request({
      url: 'https://api.jihui88.net/jihuiapi/other/company/' + app.globalData.enterpriseId,
      success: function (res) {
        if (res.data.edesc !== null) {
          res.data.edesc = res.data.edesc.replace(/<img /g, "<img style='display: block' width='100%;' ").replace(/\"/g, "'")
        }
        that.setData({
          company: res.data
        })
        wx.setStorage({
          key: 'company',
          data: res.data
        })
        wx.hideNavigationBarLoading()
      }
    })
  },

  can: function () {
    var that = this
    var can = wx.createCanvasContext('proCanvas')
    can.setFillStyle('#ffffff')
    can.fillRect(0,0,280,470)
    // 字体
    can.setFontSize(16)
    can.setFillStyle('#000000')
    can.fillText((this.data.name.length > 15 ? this.data.name.substring(0,15) + '...' : this.data.name), 10, 310)
    can.setFontSize(14)
    can.setFillStyle('red')
    can.fillText('￥'+this.data.price, 10, 340)
    // 线
    can.setStrokeStyle('#dddddd')
    can.setLineWidth(1)
    can.moveTo(0, 360)
    can.lineTo(280, 360)
    can.stroke()
    // qr
    can.setFontSize(16)
    can.setFillStyle('#000000')
    can.fillText((this.data.company.name.length > 9 ? this.data.company.name.substring(0,9) + '...' : this.data.company.name || ''), 10, 410)
    can.setFontSize(14)
    can.setFillStyle('#999999')
    can.fillText('长按识别二维码', 10, 435)

    wx.getImageInfo({
      src: this.data.pic,
      success: function (res) {
        can.drawImage(res.path,  0, 0, 280, 280)
        can.draw(true)
      },
      fail: function(err){
        console.log('需要配置域名  需要https')
      }
    })
    can.drawImage(that.data.qrcode, 180, 370, 90, 90)
    wx.getImageInfo({
      src: that.data.qrcode,
      success: function (res) {
        can.drawImage(res.path, 180, 370, 90, 90)
        wx.showModal({
          title: 'qrcode',
          content: res.path,
        })
        can.draw(true)
      },
      fail: function(err){
        console.log(err)
      }
    })
    can.draw()
  },

  saveImg: function () {
    wx.showLoading({
      title: '加载中',
    })
    wx.canvasToTempFilePath({
      x: 0,
      y: 0,
      width: 280,
      height: 470,
      destWidth: 280,
      destHeight: 470,
      canvasId: 'proCanvas',
      success: function(res) {
        wx.hideLoading()
        var path = res.tempFilePath
        console.log('图片地址：'+path)
        wx.getSetting({
          success(res) {
            if (!res.authSetting['scope.writePhotosAlbum']) {
              wx.authorize({
                scope: 'scope.writePhotosAlbum',
                success() {
                  wx.saveImageToPhotosAlbum({
                    filePath: path,
                    success() {
                      wx.showToast({
                        title: '成功',
                        icon: 'success',
                        duration: 2000
                      })
                    }
                  })
                }
              })
            } else {
              wx.saveImageToPhotosAlbum({
                filePath: path,
                success(res) {
                  wx.showToast({
                    title: '成功',
                    icon: 'success',
                    duration: 2000
                  })
                }
              })

            }
          }
        })
      },
      fail: function(err){
        console.log('生成图片失败' + err)
      }
    }, this)
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      id: options.id,
      name: options.name,
      price: options.price,
      pic: options.pic
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.getwxQr()
    var company = wx.getStorageSync('company')
    if (!company) {
      this.get()
    } else {
      this.setData({
        company: company
      })
    }
  }
})
