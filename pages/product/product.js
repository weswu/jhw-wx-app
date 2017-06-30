// product.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    proList: []
  },

  get: function (ob) {
    var that = this
    //调用应用实例的方法获取全局数据
    wx.showNavigationBarLoading()
    var url = 'all/Enterp_0000000000000000000049341'
    if(ob.categoryId){
      url = 'category_child/Enterp_0000000000000000000049341?category_id=' + ob.categoryId +'&imagelist=1'
    }
    wx.request({
      url: 'http://api.jihui88.net/jihuiapi/products/' + url,
      success: function (res) {
        console.log(res)
        that.setData({
          proList: res.data.list
        })
        wx.hideNavigationBarLoading()
      }
    })
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(options.category_id){
      options.category_id = parseInt(options.category_id.split('Category_')[1])
    }
    this.get({ categoryId: options.category_id})
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    wx.setNavigationBarTitle({
      title: '产品'
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.get()
    wx.stopPullDownRefresh()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
