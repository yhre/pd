var common = require('../../js/common.js');
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    province:'',
    city:'',
    addressxs:''
  },
  onLoad:function(options){
    var that = this;
    // let pages = getCurrentPages();
    // let currPage = pages[pages.length - 2];
    //   that.setData({//将携带的参数赋值
    //     province:currPage.data.province,
    //     city: currPage.data.city
    //   })
      this.setData({
        addressxs: app.appData.userinfo.address
      })
},
  addressxsInput:function(e){
    var that = this;
    this.setData({
      addressxs: e.detail.value
    })
    
  },
// 点击返回键页面关闭，并把值传递给个人中心页面
  onUnload:function(){
    var that = this;
    let pages = getCurrentPages();
    let prevPage = pages[pages.length - 2];
    console.log(prevPage);
   
    prevPage.setData({//将携带的参数赋值
      province: this.data.province,
      city: this.data.city
    }),
      wx.request({
        url: 'https://sp.bjesc.com/index/profile/edit',
        data: {
          address: this.data.addressxs
        },
        header: common.getRequestHeader(),
        method: 'POST',
        success: function (res) {
          var arr = res.data
          console.log(arr);
          if (arr.code = 0) {
            console.log(arr)
          }
        },
      })
  }
})
