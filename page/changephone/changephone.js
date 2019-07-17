// page/changephone/changephone.js
var settime = require("../../js/sendcod.js");
var pubRSA = require("../../js/public_rsa.js");
var common = require('../../js/common.js');
var app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    oldphone:'',
    last_time: '',
    is_show: true,
    phone: '',
    code: ''
  },
  onLoad:function(){
    this.setData({
      oldphone: app.appData.userinfo.phone
    })
  },
  // 手机号
  bindphoneInput: function (e) {
    var that = this;
    this.setData({
      phone: e.detail.value
    })

  },
  // 验证码
  bindcodeInput: function (e) {
    var that = this;
    this.setData({
      code: e.detail.value
    })
  },
  clickVerify: function () {
    var that = this;
    var encStr = pubRSA.pubRSA(this.data.phone);
    this.setData({
      codepd: encStr,
    })
    wx.request({

      url: 'https://sp.bjesc.com/index/user/sendCode',
      data: {
        phone: this.data.phone,
        sign: this.data.codepd
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded',
      },
      method: 'POST',
      success: function (res) {
        var arr = res.data;
        that.setData({
          codeParam: res.data.data.codeParam,
        });
        if (arr.code == 0) {
          // 将获取验证码按钮隐藏60s，60s后再次显示
          that.setData({
            is_show: (!that.data.is_show)   //false
          })
          settime.settime(that);
        } else {
          wx.showToast({
            title: arr.msg,
            icon: 'none',
            duration: 2000
          })
        }
      }
    })
  },
  changephone: function () {
   
    wx.request({
      url: 'https://sp.bjesc.com/index/profile/edit',
      data: {
        phone: this.data.phone,
        code: this.data.code,
        codeParam: this.data.codeParam,
      },
      header: common.getRequestHeader(),
      method: 'POST',
      success: function (res) {
        var arr = res.data
        console.log(arr);
        if (arr.code == 0) {
          wx.showToast({
            title: '修改成功',
            icon: 'none',
            duration: 2000,
            success: function () {
              wx.redirectTo({
                url: '../login/login'
              })
            }
          })
        } else {
          wx.showToast({
            icon: 'none',
            title: arr.msg
          })
        }
      },
    })
  }
  
})