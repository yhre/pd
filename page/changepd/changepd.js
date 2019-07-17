var settime = require("../../js/sendcod.js");
var pubRSA = require("../../js/public_rsa.js");
var common = require('../../js/common.js');
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    last_time: '',
    is_show: true,
    phone: '',
    code: '',
    codepd: '',
    pwd: '',
    repwd: '',
    codeParam: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      phone: app.appData.userinfo.phone
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
  // 新密码
  bindpdInput: function (e) {
    var that = this;
    this.setData({
      pwd: e.detail.value
    })
  },
  // 确认密码
  bindrepwdInput: function (e) {
    var that = this;
    this.setData({
      repwd: e.detail.value
    })
  },

  /*
 发送验证码
 */
  /*
   发送验证码
   */
  clickVerify: function (e) {
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

  checkLogin: function (e) {
    var that = this;
    if (!app.validate(this.data)) return;
   
    if (this.data.pwd.length != 0) {
      var encStr = pubRSA.pubRSA(this.data.pwd);
      this.setData({
        codepd: encStr,
      })
    }
    
    wx.request({
      url: 'https://sp.bjesc.com/index/user/resetPwd',
      data: {
        phone: this.data.phone,
        code: this.data.code,
        codeParam: this.data.codeParam,
        pwd: this.data.codepd,
      },
      header: common.getRequestHeader(),
      method: 'POST',
      success: function (res) {
        var that = this
        var arr = res.data;
        console.log(res);
        if (arr.code == 0) {
          wx.showToast({
            title: '修改成功',
            icon: 'none',
            success: function () {
              wx.redirectTo({
                url: '../login/login'
              })
            }
          })
        } else {
          wx.showToast({
            title: arr.msg,
            icon: 'none',
          })
        }
      },
      fail: function (res) {
        console.log('is failed');
      }
    });
  }

})

