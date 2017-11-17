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
    company: {}
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
        that.can()
        wx.hideNavigationBarLoading()
      }
    })
  },

  can: function () {
    var can = wx.createCanvasContext('proCanvas')
    can.setFillStyle('#ffffff')
    can.fillRect(0,0,280,470)
    can.drawImage(this.data.pic, 0, 0, 280, 280)
    // 字体
    can.setFontSize(16)
    can.setFillStyle('#000000')
    can.fillText(this.data.name, 10, 310)
    can.setFontSize(14)
    can.setFillStyle('red')
    can.fillText('￥'+this.data.price, 10, 340)
    // 线
    can.setStrokeStyle('#dddddd')
    can.setLineWidth(1)
    can.moveTo(0, 360)
    can.lineTo(280, 360)
    // qr
    can.setFontSize(16)
    can.setFillStyle('#000000')
    can.fillText(this.data.company.name || '', 10, 410)
    can.setFontSize(14)
    can.setFillStyle('#999999')
    can.fillText('长按识别二维码', 10, 435)
    can.drawImage('https://raw.githubusercontent.com/weswu/jhw-wxapp/master/images/static/jinlida.png', 180, 370, 90, 90)
    can.stroke()

    can.draw()
  },

  saveImg: function () {
    wx.canvasToTempFilePath({
      x: 100,
      y: 200,
      width: 50,
      height: 50,
      destWidth: 100,
      destHeight: 100,
      canvasId: 'proCanvas',
      success: function(res) {
        console.log(res.tempFilePath)
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      name: options.name,
      price: options.price,
      pic: options.pic
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

    var company = wx.getStorageSync('company')
    if (!company) {
      this.get()
    } else {
      this.setData({
        company: company
      })
      this.can()
    }
  }
})
