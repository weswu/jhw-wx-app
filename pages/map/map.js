// map.js
Page({
  data: {
    // 腾讯地图坐标拾取器: http://lbs.qq.com/tool/getpoint/
    // 视线中心点,中心经度
    longitude: 120.221565,
    latitude: 30.208071,
    // 公司地址，红点
    markers: [{
      iconPath: "/images/marker.png",
      id: 0,
      latitude: 30.208071,
      longitude: 120.221565,
      width: 30,
      height: 30
    }],
    // 红线
    polyline: [{
      points: [{
        longitude: 120.216780,
        latitude: 30.208071
      }, {
        longitude: 120.221565,
        latitude: 30.208071
      }],
      color:"#FF0000DD",
      width: 2,
      dottedLine: true
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
