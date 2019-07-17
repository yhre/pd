var common = require('../../js/common.js');
var app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    codepd:'',
    array:'',
    objectArray:'' ,
    index: 0,
    cardealer:'',
    carmarket:''
  },
  bindPickerChange: function (e) {
    this.setData({
      index: e.detail.value,
      carmarket: this.data.array[e.detail.value]
    })
  },
 
  bindcarname: function (e) {
    var that = this;
    this.setData({
      cardealer: e.detail.value
    })
   
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    this.setData({
      array: app.appData.userinfo.market,
      carDealer: app.appData.userinfo.dealer
    })
    var listname = []
  wx.request({
    url: 'https://sp.bjesc.com/index/market/lists',
    header: common.getRequestHeader(),
    data:{
      "cityid": '510100'
    },
    method:'GET',
    success:function(res){
      var arr = res.data;
      console.log(arr)
      if(arr.code==0){
        
        for (var i = 0; i < arr.data.list.length;i++){
          listname[i] = arr.data.list[i].name
        }
          that.setData({
            objectArray: arr.data.list,
            array: listname
          })
         
      }
      else {
       
      }
    },
    fail: function (res) {
      console.log('is failed');
    }
  })
  },
  // 点击返回键页面关闭，并把值传递给个人中心页面
  onUnload: function () {
    var that = this;
    
    let pages = getCurrentPages();
    let currPage = pages[pages.length - 1];
    let prevPage = pages[pages.length - 2];
    console.log(prevPage);
    console.log(currPage);
    that.setData({//将携带的参数赋值
      carmarket: currPage.data.carmarket,
      carDealer: currPage.data.cardealer
    })
    prevPage.setData({//将携带的参数赋值
      carmarket: this.data.carmarket,
      cardealer: this.data.carDealer
    }),
      wx.request({
        url: 'https://sp.bjesc.com/index/profile/edit',
        data: {
          market_id: this.data.index,
          car_dealer: this.data.cardealer
        },
        header: common.getRequestHeader(),
        method: 'POST',
        success: function (res) {
          var arr = res.data
          console.log(arr);
          if (arr.code == 0) {
            console.log(arr)
          }
        },
      })
  }
})