var settime = require("../../js/sendcod.js");
var pubRSA = require("../../js/public_rsa.js");
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    last_time: '',
    is_show: true,
    phone: '',
    code:'',
    pwd:'',
    repwd: '',
    items: [
      { name: '同意', value: '0', checked: false },
     ]     
  },
  checkboxChange: function (e) {
    var items = this.data.items;
    var checkArr = e.detail.value;
    for (var i = 0; i < items.length; i++) {
      if (checkArr.indexOf(i + "") != -1) {
        items[i].checked = false;
      } else {
        items[i].checked = true;
      }
    }
    this.setData({
      items: items
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },
  // 手机号
  bindphoneInput:function (e) {
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
        console.log(res);
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
  checkLogin:function(e){
    var that = this;
    if(!app.validate(this.data)) return;
    // var arrcheck = [this.data.phone, this.data.code, this.data.pwd];
    var encStr = pubRSA.pubRSA(this.data.pwd);
    this.setData({
      codepd: encStr,
    })
    
    wx.request({
      url: 'https://sp.bjesc.com/index/user/register',
      data: {
        phone: this.data.phone,
        code: this.data.code,
        codeParam: 'dG9rZW49ZTQ5ZWY4ZTFlNzc1ZWQ4Y2ZhMDE2NjkzNTJiYTEzOGYwMWEzNWVlZWFjY2QxYTVjNDgzZjUyNTRhM2RhNDIzNyZleHA9MTUyMjM3ODU4NA==',
        pwd: this.data.codepd,
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'X-Authentication': this.data.codepd
      },
      method: 'POST',
      success: function (res) {
        var that = this
        var arr = res.data;
        console.log(res);
        if (arr.code == 0) {
          app.appKey = arr.data.appKey + '::' + arr.data.profile.phone + '::';
          wx.setStorageSync('appKey', arr.data.appKey + '::' + arr.data.profile.phone + '::')
          app.appData.userinfo = {
            phone: arr.data.profile.phone
          }
            wx.showToast({
              title: '登录成功',
              icon: 'none',
              success: function () {
                wx.switchTab({
                  url: '../index/index'
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
  },
  agree:function(){
    wx.navigateTo({
      url: '../agree/agree',
    })
  }
})

