// page/personinfo/personinfo.js
var pubRSA = require("../../js/public_rsa.js");
var common = require('../../js/common.js');
var app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    name:'',
    phone: '',
    appKey:''
  },
 
  onLoad: function (options) {
    
   
   
  },
  onShow:function(){
    var that = this;
    var encStrhead = pubRSA.pubRSA(app.appKey);
    if (app.appData.userinfo == '') {
      this.setData({
        name: '请登录'
      })
    } else {
      wx.request({
        url: 'https://sp.bjesc.com/index/profile/read',
        header: common.getRequestHeader(),
        method: 'GET',
        success: function (res) {
          var arr = res.data;
          console.log(res);
          if (arr.code == 0) {
            that.setData({
              name: arr.data.name,
              phone: arr.data.phone
            })
          } else {
            console.log(arr.msg);
          }
        },
        fail: function (res) {
          console.log('is failed');
        }
      });
      this.setData({
        name: app.appData.userinfo.name,
        phone: app.appData.userinfo.phone
      })
    }

  },
  urlPersoninfo: function () {
    var encStrhead = pubRSA.pubRSA(app.appKey);
    if(app.appData.userinfo==''){
      wx.navigateTo({
        url: "../login/login"
      })
      return false
    }else{
      wx.navigateTo({
        url: '../personinfo/personinfo',
      })
    }
  }
})
