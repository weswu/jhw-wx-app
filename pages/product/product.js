// product.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    cate_id: '',
    title: '产品',
    page: 1
  },

  get: function () {
    var that = this
    //调用应用实例的方法获取全局数据
    wx.showNavigationBarLoading()
    console.log('产品分类'+ this.data.cate_id +'加载中...')
    var url = 'all/Enterp_0000000000000000000049341'
    if(!!this.data.cate_id){
      url = 'category_child/Enterp_0000000000000000000049341?category_id=' + this.data.cate_id +'&page=' + this.data.page
    }
    wx.request({
      url: 'https://api.jihui88.net/jihuiapi/products/' + url,
      success: function (res) {
        // !res.data.list && that.data.page === 1
        that.setData({
          list: res.data.list
        })
        wx.setStorage({
          key: 'proCate' + that.data.cate_id,
          data: res.data.list
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
      this.setData({
        cate_id: parseInt(options.category_id.split('Category_')[1]),
        title: options.title
      })
    }
    var key = wx.getStorageSync('proCate' + this.data.cate_id)
    if (!key) {
      this.get()
    } else {
      this.setData({
        list: key
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    wx.setNavigationBarTitle({
      title: this.data.title || '产品'
    })
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.setData({
      page: 1
    })
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
