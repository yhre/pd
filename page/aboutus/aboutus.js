// page/aboutus/aboutus.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },
  call:function(){
    wx.makePhoneCall({
      phoneNumber: '400800978' //仅为示例，并非真实的电话号码
    })
  }
 
})