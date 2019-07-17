// page/province/province.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    province_id: ''
  },
  onLoad: function (options) {
    var pages = getCurrentPages()
    var num = pages.length
     console.log(num);
    var that = this;
    this.setData({
      province_id: options.provinceid,
      province_name: options.provincename
    })
    wx.request({
      url: 'https://sp.bjesc.com/index/market/citys',
      data: {
        province_id: this.data.province_id
      },
      header: {
        'content-type': 'application/JSON'
      },
      method: 'GET',
      success: function (res) {
        var arr = res.data.data;
        that.setData({
          city: arr.list
        })
      },
      fail: function (res) {
      }
    })
  },

  chocity: function (e) {
    var that = this;
    var index = e.currentTarget.dataset['index'];
    var city_name = e.currentTarget.dataset.text;
    var cityid = e.currentTarget.dataset.city;
    var provincename = this.data.province_name;
    console.log(cityid);
    this.setData({
      currentTabsIndex: index
    })
    wx.navigateBack({
      url: '../address/address?cityname=' + city_name + '&provincename=' + provincename,
      delta: 2
    })
  }
})


