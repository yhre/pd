// page/province/province.js
var common = require('../../js/common.js');
var app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    province_id: ''
  },
  onLoad: function (options) {
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
      header: common.getRequestHeader(),
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

    wx.request({
      url:'https://sp.bjesc.com/index/profile/edit',
      data: {
        cityid: cityid
      },
      header: common.getRequestHeader(),
      method: 'POST',
      success: function (res) {
        var arr=res.data
        console.log(arr);
        if(arr.code=0){
          console.log(arr)
        }
      },
    })

    var pages = getCurrentPages()
    var num = pages.length
    var prevPage = pages[pages.length - 3];
    prevPage.setData({
      city: city_name,
      province: provincename
    })
    this.setData({
      currentTabsIndex: index
    })
    wx.navigateBack({
      url: '../address/address',
      delta: 2
    })
  }
})

