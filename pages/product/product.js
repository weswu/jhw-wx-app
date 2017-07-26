/*
 * @author: wes
 * @date: 2017-7-25
 * @desc: 产品
*/
var app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    cate_id: '',
    title: '商品',
    empty: false,
    emptyTip: '暂无数据',
    search: {
      page: 1,
      per_page: 6
    },
    keyword: '',
    history: false,
    hislist: []
  },

  get: function () {
    var that = this
    //调用应用实例的方法获取全局数据
    wx.showNavigationBarLoading()
    wx.showLoading({
      title: '加载中',
    })
    var url = 'all/' + app.globalData.enterpriseId
    if(!!this.data.cate_id){
      url = 'category_child/' + app.globalData.enterpriseId
      this.data.search.category_id = this.data.cate_id
    }
    wx.request({
      url: 'https://api.jihui88.net/jihuiapi/products/' + url,
      data: this.data.search,
      success: function (res) {
        wx.hideNavigationBarLoading()
        wx.hideLoading()
        if(res.data.error === '查询为空'){
          that.setData({
            empty: true
          })
          if(that.data.search.page === 1){
            that.setData({
              emptyTip: '暂无数据'
            })
          }else{
            that.setData({
              emptyTip: '已全部加载'
            })
          }
          return false
        }else{
          that.setData({
            empty: false
          })
        }
        var data = res.data.list
        if(data.length > 0){
          for(var i=0; i<data.length; i++){
            data[i].price = parseFloat(parseFloat(data[i].price).toFixed(2))
            that.data.list.push(data[i])
          }
        }
        that.setData({
          list: that.data.list
        })
        if(that.data.search.page === 1){
          wx.setStorage({
            key: 'proCate' + that.data.cate_id,
            data: that.data.list
          })
        }
      }
    })
  },
  // 搜索
  getKey: function () {
    var that = this
    wx.request({
      url: 'https://api.jihui88.net/jihuiapi/products/search/' + app.globalData.enterpriseId,
      data: {
        keyword: this.data.keyword,
        page: this.data.search.page,
        per_page: this.data.search.per_page
      },
      success: function (res) {
        wx.hideLoading()
        if(res.data.error === '查询为空'){
          that.setData({
            empty: true
          })
          if(that.data.search.page === 1){
            that.setData({
              emptyTip: '暂无数据'
            })
          }else{
            that.setData({
              emptyTip: '已全部加载'
            })
          }
          return false
        }else{
          that.setData({
            empty: false
          })
        }
        var data = res.data.list
        if(data.length > 0){
          for(var i=0; i<data.length; i++){
            data[i].price = parseFloat(parseFloat(data[i].price).toFixed(2))
            that.data.list.push(data[i])
          }
        }
        that.setData({
          list: that.data.list
        })
      }
    })
  },
  wxSearchInput: function (e) {
    this.setData({
      keyword: e.detail.value
    })
  },
  clearKey: function () {
    this.data.search.page = 1
    this.setData({
      keyword: '',
      history: false,
      search: this.data.search,
      empty: false
    })
    var key = wx.getStorageSync('proCate' + this.data.cate_id)
    if (!key) {
      this.setData({
        list: []
      })
      this.get()
    } else {
      this.setData({
        list: key
      })
    }
  },
  searchKey: function () {
    wx.showLoading({
      title: '加载中'
    })
    this.data.search.page = 1
    this.setData({
      list: [],
      history: false,
      search: this.data.search
    })
    if(this.data.hislist.indexOf(this.data.keyword) === -1 && this.data.keyword !== ''){
      this.data.hislist.push(this.data.keyword)
      this.setData({
        hislist: this.data.hislist
      })
      wx.setStorage({
        key: 'hislist',
        data: this.data.hislist
      })
    }
    this.getKey()
  },

  // 历史记录
  wxSerchFocus: function () {
    this.setData({
      history: true
    })

  },
  wxSearchBlur: function () {
    this.setData({
      history: false
    })
  },
  wxSearchKeyTap: function (e) {
    this.setData({
      keyword: e.currentTarget.dataset.key
    })
    this.searchKey()
  },
  wxSearchDeleteAll: function () {
    wx.removeStorageSync('hislist')
    this.setData({
      hislist: []
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
    var hislist = wx.getStorageSync('hislist')
    if (!!hislist) {
      this.setData({
        hislist: hislist
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    wx.setNavigationBarTitle({
      title: this.data.title || '商品'
    })
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.data.search.page = 1
    this.setData({
      list: [],
      search: this.data.search
    })

    if (this.data.keyword === '') {
      this.get()
    }else{
      this.getKey()
    }
    wx.stopPullDownRefresh()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if(this.data.empty){return false}
    this.data.search.page += 1
    this.setData({
      search: this.data.search
    })
    if (this.data.keyword === '') {
      this.get()
    }else{
      this.getKey()
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: this.data.title || '商品展示'
    }
  }
})
