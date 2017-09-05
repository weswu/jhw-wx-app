/*
 * @author: wes
 * @date: 2017-7-25
 * @desc: 公司简介
*/

Page({
  // 拨打电话
  tel: function(e){
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.dataset.tel
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
