// map.js
Page({
  data: {
    // 腾讯地图坐标拾取器: http://lbs.qq.com/tool/getpoint/
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

  onLoad: function () {
    // 获取你当前所在的地理位置
    /*
    wx.getLocation({
      type: 'wgs84',
      success: function(res) {
        var latitude = res.latitude
        var longitude = res.longitude
        var speed = res.speed
        var accuracy = res.accuracy
      }
    })
    */
  }
})
