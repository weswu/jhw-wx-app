// map.js
Page({
  data: {
    // 视线中心点,中心经度
    longitude: 120.22141,
    latitude: 30.207962,
    // 公司地址，红点
    markers: [{
      iconPath: "/images/marker.png",
      id: 0,
      latitude: 30.207962,
      longitude: 120.22141,
      width: 30,
      height: 30
    }]
  },
  markertap: function () {
    console.log('点击红点')
  },

  onLoad: function () {
    var map = wx.getStorageSync('company').mapaddress
    var longitude = map.split(',')[0]
    var latitude = map.split(',')[1]
    this.data.markers[0].longitude = longitude
    this.data.markers[0].latitude = latitude
    this.setData({
      longitude: longitude,
      latitude: latitude,
      markers: this.data.markers
    })
  },

  onShareAppMessage: function () {}
})
