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

  onReady: function () {
    var company = wx.getStorageSync('company')
    var longitude = parseFloat(company.mapaddress.split(',')[0])
    var latitude = parseFloat(company.mapaddress.split(',')[1])
    this.data.markers[0].longitude = longitude
    this.data.markers[0].latitude = latitude
    this.setData({
      longitude: longitude,
      latitude: latitude,
      markers: this.data.markers
    })
    // 打开另一层导航地图
    wx.openLocation({
      latitude: latitude,
      longitude: longitude,
      scale: 28,
      name: company.name,
      address: company.address
    })
  },

  onShareAppMessage: function () {
    return {
      title: '位置信息'
    }
  }
})
