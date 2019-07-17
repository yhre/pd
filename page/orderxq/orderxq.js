// page/orderxq/orderxq.js
var common = require('../../js/common.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    headerDesc: '',
    show:true
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
    console.log(options);
    var order_id = options.order_id;
    this.setData({
      order_id: order_id
    })
  },
  onShow:function(){
    var that = this;
    wx.request({
      url: 'https://sp.bjesc.com/index/order/detail',
      header: common.getRequestHeader(),
      data: {
        order_id:this.data.order_id,
      },
      success: function (res) {
        var arr = res.data;
        if (arr.code == 0) {
          console.log(arr)
          let len = arr.data.info.length;
          console.log(arr.data);
          that.setData({
            infolist: arr.data.info,
            headerDesc: arr.data.headerDesc,
            show: arr.data.hasCommented
          })
        }
      }
    })
  },
  scoreBtn:function(){
    wx.navigateTo({
      url: '../score/score?order_id=' + this.data.order_id,
    })
  }
  
})