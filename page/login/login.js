var settime = require("../../js/sendcod.js");
var pubRSA = require("../../js/public_rsa.js");
var app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    items: [
      { name: '同意', value: '0', checked: false },
    ],
    last_time: '',
    is_show: true ,
    phone:'',
    code:'',
    codeParam:'',
    phone:''
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var value = wx.getStorageSync('phone');
    this.setData({
      phone: value
    })
  },
  bindphoneInput:function(e){
    var that = this;
    this.setData({
      phone: e.detail.value
    })
    wx.setStorageSync('phone', this.data.phone)
    // wx.setStorage({
    //   phone: "phone",
    //   data: this.data.phone
    // })
  },
  bindcodeInput: function (e) {
    var that = this;
    this.setData({
      code: e.detail.value
    })
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
      data:{
        phone:this.data.phone,
        sign:this.data.codepd
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded',
      },
      method:'POST',
      success:function(res){
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

  /**
   * 登录验证
   */
checkLogin:function (e) {
    var that = this
    var encStr = pubRSA.pubRSA();
    this.setData({
      codepd: encStr,
    })
    var type = e.currentTarget.dataset.type;
        wx.request({
          url: 'https://sp.bjesc.com/index/user/logIn',
          data: {
            phone: this.data.phone,
            code: this.data.code,
            codeParam:this.data.codeParam,
          },
          header: {
            'content-type': 'application/x-www-form-urlencoded',
            'X-Authentication': this.data.codepd
          },
          method: 'POST',
          success: function (res) {
            var arr = res.data;
            if (arr.code == 0) {
              app.appKey = arr.data.appKey + '::' + arr.data.profile.phone + '::';
              wx.setStorageSync('appKey', arr.data.appKey + '::' + arr.data.profile.phone + '::')
              app.appData.userinfo = {
                phone: arr.data.profile.phone,
                name: arr.data.profile.name
                   }
              wx.showToast({
                title: '登录成功',
                icon: 'none',
                duration: 2000,
                success: function () {
                  wx.switchTab({
                    url: '../person/person'
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
agree:function(){
  wx.navigateTo({
    url: '../agree/agree',
  })
}
})

