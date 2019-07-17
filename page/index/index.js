// page/index/index.js
var settime = require("../../js/sendcod.js");
var pubRSA = require("../../js/public_rsa.js");
var common = require('../../js/common.js');
var app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    is_show: true,
    card:'',
    phone:''
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
    // 510100成都
    // 取缓存值
    wx.getStorage({
      key: 'nameClient',
      success: function (res) {
        that.setData({
          name: res.data
        })
      }
    })
    wx.getStorage({
      key: 'priceClient',
      success: function (res) {
        that.setData({
          price: res.data
        })
      }
    })
    wx.getStorage({
      key: 'cardClient',
      success: function (res) {
        that.setData({
          card: res.data
        })
      }
    })
    wx.getStorage({
      key: 'phoneClient',
      success: function (res) {
        that.setData({
          phone: res.data
        })
      }
    })
  },
  bindnameInput: function (e) {
    var that = this;
    this.setData({
      name: e.detail.value
    })
    wx.setStorage({
      key: "nameClient",
      data: this.data.name
    })
  },
  bindpriceInput: function (e) {
    var that = this;
    this.setData({
      price: e.detail.value
    })
    wx.setStorage({
      key: "priceClient",
      data: this.data.price
    })
  },
  bindcardInput: function (e) {
    var that = this;
    this.setData({
      card: e.detail.value
    })
    wx.setStorage({
      key: "cardClient",
      data: this.data.card
    })
  },
  bindphoneInput: function (e) {
    var that = this;
    this.setData({
      phone: e.detail.value
    })
    wx.setStorage({
      key: "phoneClient",
      data: this.data.phone
    })
  },
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
  checkLogin:function(){
   wx.request({
     url: 'https://sp.bjesc.com/index/order/add',
     header: common.getRequestHeader(),
     data:{
       name: this.data.name,
       price: this.data.price,
       id_card: this.data.card,
       phone: this.data.phone,
       code: this.data.code,
       codeParam: this.data.codeParam
     },
     method: 'POST',
     success: function (res) {
       var arr = res.data;
       if (arr.code == 0) {
         console.log(arr.data.orderId);
         var order_id = arr.data.orderId;
         console.log(order_id)
         console.log
         wx.showToast({
           title: arr.msg,
           icon: 'none',
            success:function(){
              wx.navigateTo({
                url: '../loaning/loaning?order_id=' + order_id,
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
     fail:function(){
       
     }
   })
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
  
})