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

  onReady: function () {
    var map = wx.getStorageSync('company').mapaddress
    var longitude = parseInt(map.split(',')[0])
    var latitude = parseInt(map.split(',')[1])
    this.data.markers[0].longitude = longitude
    this.data.markers[0].latitude = latitude
    this.setData({
      longitude: longitude,
      latitude: latitude,
      markers: this.data.markers
    })

    var address = wx.getStorageSync('company').address
    wx.openLocation({
      latitude: latitude,
      longitude: longitude,
      scale: 18,
      name: '华乾大厦',
      address: address
    })
  },

  onShareAppMessage: function () {
    return {
      title: '位置信息'
    }
  }
})
