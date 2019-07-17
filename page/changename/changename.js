// page/changename/changename.js
var common = require('../../js/common.js');
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    username:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    username: app.appData.userinfo.username
  },

  bindnameInput: function (e) {
    var that = this;
    this.setData({
      username: e.detail.value
    })
  },
  changename:function(){
    wx.request({
      url: 'https://sp.bjesc.com/index/profile/edit',
      data: {
        name: this.data.username
      },
      header: common.getRequestHeader(),
      method: 'POST',
      success: function (res) {
        var arr = res.data
        console.log(arr);
        if (arr.code == 0) {
          wx.showToast({
            icon: 'none',
            title: arr.msg,
            success: function () {
              wx.redirectTo({
                url: '../personinfo/personinfo',
              })
            }
          })
        }else{
          wx.showToast({
            title: arr.msg,
            icon: 'none',
          })
        }
      },
    })
  }
  
})