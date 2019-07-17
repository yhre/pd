// page/selectaddress/selectaddress.js
var common = require('../../js/common.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },
  onShow:function(){
    var that = this;
    // 获取联系人地址
    wx.request({
      url: 'https://sp.bjesc.com/index/profile/read',
      header: common.getRequestHeader(),
      method: 'GET',
      success: function (res) {
        var arr = res.data;
        var addressList = arr.data.address;
        console.log(addressList)
        if (arr.code == 0) {
          that.setData({
            addressList: addressList,
          })
        } else {
          console.log(arr.msg);
        }
      },
      fail: function (res) {
        console.log('is failed');
      }
    });
  },
  urlLoaning: function (e) {
    var index = e.currentTarget.dataset.index;
   
    
    var list = this.data.addressList[index]
    console.log(list)
    var pages = getCurrentPages();
    var currPage = pages[pages.length - 1];   //当前页面
    var prevPage = pages[pages.length - 2];  //上一个页面
    console.log(prevPage);
    // 把添加的输入框的值传递给上一个页面
    prevPage.setData({
      addressList: list,
      adName: list.name,
      adNnmber: list.phone,
      fullAddress: list.fullAddress,
      address_id: list.id,
    })
    wx.navigateBack({
      delta: 1
    })
    // wx.navigateTo({
    //   url: '../loaning/loaning?list=' + JSON.stringify(list)
    // })
  },
  
 
// 添加地址页面
  adressBtn:function(){
    wx.navigateTo({
      url: '../addaddress/addaddress?url=selectadd'
    })
  },
  // 管理地址页面
  mangeBtn: function () {
    wx.navigateTo({
      url: '../manageaddress/manageaddress?url=select'
    })
  },
  onUnload: function () {
    // wx.navigateBack({
    //   delta: 1
    // })
  },

})
