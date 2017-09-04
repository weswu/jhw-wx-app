/*
 * @author: wes
 * @date: 2017-7-25
 * @desc: 公司简介
*/
Page({
  data: {
    imgHeight: 0
  },
  // 拨打电话
  tel: function(e){
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.dataset.tel
    })
  },
  imageLoad: function (e) {
    var $width=e.detail.width,    //获取图片真实宽度
        $height=e.detail.height,
        ratio=$width/$height;    //图片的真实宽高比例

    var viewWidth=wx.getSystemInfoSync().windowWidth;    //窗口宽度
    var viewHeight=viewWidth/ratio;    //计算的高度值
    if(viewHeight > this.data.swiperHeight){
      this.data.swiperHeight = viewHeight
    }
    this.setData({
      swiperHeight: this.data.swiperHeight
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
   onReady: function () {
     wx.setNavigationBarTitle({
       title: '公司简介'
     })
   },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title:  '公司简介'
    }
  }
})
