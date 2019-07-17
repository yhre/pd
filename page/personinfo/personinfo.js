var common = require('../../js/common.js');
var app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    username:'',
    phone:'',
    carmarket:'',
    cardealer:'',
    province:'',
    city:'',
    fullAddress:''
  },
  onLoad: function (options) {
    
  },
  urlselect:function(){
   wx.navigateTo({
     url: '../manageaddress/manageaddress?url=personinfo',
   })
  },
  onShow:function(){
    var that = this;
    wx.request({
      url: 'https://sp.bjesc.com/index/profile/read',
      header: common.getRequestHeader(),
      method: 'GET',
      success: function (res) {
        var arr = res.data;
        if (arr.code == 0) {
          var addressList = arr.data.address;
          console.log(arr.data)
          console.log(addressList)
          if (arr.data.address != '') {
            var last = addressList.length - 1;
            that.setData({
              name: arr.data.name,
              phone: arr.data.phone,
              fullAddress: addressList[last].fullAddress,
            })
            for (var i in addressList) {
              if (addressList[i].defaultAddress) {
                that.setData({
                  name: arr.data.name,
                  phone: arr.data.phone,
                  fullAddress: addressList[i].fullAddress,
                })
              }
            }
          }
          // 把个人信息放入app.js,方便其它页面调用
          app.appData.userinfo = {
            address: arr.data.address,
            phone: arr.data.phone,
            // market: arr.data.market.name,
            // dealer: arr.data.carDealer
          }
        } else {

        }
      },
      fail: function (res) {
        console.log('is failed');
      }
    });
  }
 
})
