// page/setting/setting.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },
  loginOut:function(){
    wx.showModal({
      title: '',
      content: '确定退出',
      confirmColor:'#000000',
      success: function (res) {
        if (res.confirm) {
          wx.reLaunch({
            url: '../login/login',
          })
          wx.clearStorage();
        } else if (res.cancel) {
         
        }
      }
    })
  }
})