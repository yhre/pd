var app = getApp();
var pubRSA = require("../../js/public_rsa.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    items: [
      { name: '同意', value: '0', checked: false },
    ]     
  },
  /**
   * 同意按钮
   */
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
  bindphoneInput: function (e) {
    var that = this;
    this.setData({
      phone: e.detail.value
    })
  },
  bindpdInput: function (e) {
    var that = this;
    this.setData({
      pwd: e.detail.value
    })
  },
   /**
   * 登录验证
   */
checkLogin: function (e) {
    var that = this
    var encStr = pubRSA.pubRSA(this.data.pwd);
    this.setData({
      codepd: encStr,
    })
    var type = e.currentTarget.dataset.type;
    wx.request({
      url: 'https://sp.bjesc.com/index/user/logIn',
      data: {
        phone: this.data.phone,
        pwd: encStr
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'X-Authentication': this.data.codepd
      },
      method: 'POST',
      success: function (res) {
        console.log(res);
        var arr = res.data;
        if (arr.code == 0) {
          app.appKey = arr.data.appKey + '::' + arr.data.profile.phone + '::';
          wx.setStorageSync('appKey', arr.data.appKey + '::' + arr.data.profile.phone + '::')
          app.appData.userinfo = {
            phone: arr.data.profile.phone
          }
          wx.showToast({
            title: '登录成功',
            icon: 'none',
            duration: 2000,
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
            duration: 2000
          })
        }
      },
      fail: function (res) {
        console.log('is failed');
      }
    });
  },
agree: function () {
  wx.navigateTo({
    url: '../agree/agree',
  })
}
})