var pubRSA = require("../../js/public_rsa.js");
var common = require('../../js/common.js');
// var orderlist = require('../../js/json.js');
var app = getApp();
Page({
  data: {
    hidden: false,
    page: 1,
    nodata: false,
    hasMore: true,
    hasRefesh: false,
    status:'',
    currentTab: 0, //预设当前项的值
    scrollLeft: 0, //tab标题的滚动条位置
  },
  // 滚动切换标签样式
  switchTab: function (e) {
    var that=this;
    var status = e.detail.current;
    var scrollLeft = this.data.scrollLeft;
    if (status==6){
      status=8;
    }
    this.setData({
      currentTab: e.detail.current,
      status: status,
      nodata: false,
      hasMore: true
    });
    if (status == '0'){
      this.setData({
        scrollLeft: 0
      })
    }
   if (scrollLeft == '60' && status == '1'){
      this.setData({
        scrollLeft: 0
      })
    } else {
      if (status == '1'){
      this.setData({
        scrollLeft: 60
      })
      }
    }
    if (scrollLeft == '120' && status == '2'){
      this.setData({
        scrollLeft: 60
      })
    }else{
      if (status == '3' || status == '4' || status == '6' || status == '5') {
        this.setData({
          scrollLeft: 120
        })
    }
    }
   
   
  
    // this.checkCor();
    wx.request({
      url: 'https://sp.bjesc.com/index/order/lists?status=' + this.data.status,
      header: common.getRequestHeader(),
      method: 'POST',
      success: function (res) {
        var arr = res.data;
        if (arr.code == 0) {
          // console.log(arr)
          // 根据
          if (arr.data.list.data.length < 1) {
            that.setData({
              nodata: true
            })
          }else{
            that.setData({
              nodata: false
            })
          }
          that.setData({
            hidden: true,
            orderlist: arr.data.list.data,
            hasMore: arr.data.list.hasMore
          })
        } else {
        }
      },
      fail: function () {

      }
    })
  },
  // 点击标题切换当前页时改变样式
  swichNav: function (e) {
    var cur = e.target.dataset.current;
    if (this.data.currentTaB == cur) { return false; }
    else {
      this.setData({
        currentTab: cur
      })
    }
  },
  //判断当前滚动超过一屏时，设置tab标题滚动条。
  // checkCor: function () {
  //   if (this.data.currentTab =1) {
  //     console.log(this.data.currentTab)
  //     this.setData({
  //       scrollLeft: 60
  //     })
  //   }
  //   else if (this.data.currentTab = 2){
  //     console.log(this.data.currentTab)
  //     this.setData({
  //       scrollLeft: 120
  //     })
  //   } 
  // },
  onShow:function(){
    
  },
  onLoad: function () {
    var that = this;
    // var encStrhead = pubRSA.pubRSA(app.appKey);
    // if (app.appData.userinfo == '') {
    //   wx.redirectTo({
    //     url: "../login/login",
    //   })
    //   return false
    // } else {
    //   this.setData({
    //     name: app.appData.userinfo.name,
    //     phone: app.appData.userinfo.phone
    //   })
      wx.request({
        url: 'https://sp.bjesc.com/index/order/lists',
        header: common.getRequestHeader(),
        method: 'POST',
        success: function (res) {
          var arr = res.data;
          if (arr.code == 0) {
            if (arr.data.list.currentPage < 1) {
              that.setData({
                nodata: true,
              })
            }
            // 根据
            that.setData({
              hidden: true,
              orderlist: arr.data.list.data,
              hasMore: arr.data.list.hasMore
            })
          } else {
            console.log(msg)
          }
        },
        fail: function () {
        }
      })
    // }
    
   
    },
   
  // //加载更多
  loadMore: function (e) {
    var that = this;
    if (!this.data.hasMore) return
    wx.request({
      url: 'https://sp.bjesc.com/index/order/lists?status=' + that.data.status+'&&page=' + (++that.data.page),
      header: common.getRequestHeader(),
      method: 'POST',
      success: function (res) {
        var arr = res.data;
        if (arr.code == 0) {
          that.setData({
            orderlist: that.data.orderlist.concat(arr.data.list.data),
            hasMore: arr.data.list.hasMore,
            hidden: true,
          })
        } else {
        }
      },
      fail: function () {

      }
    })
  },
  urlOrderxq:function(e){
    var order_id = e.currentTarget.dataset.order
    var order_status = e.currentTarget.dataset.status;
    if (order_status == 1 || order_status == 2 || order_status==0){
      wx.navigateTo({
        url: '../loaning/loaning?order_id=' + order_id,
      })
    }else{
      wx.navigateTo({
        url: '../orderxq/orderxq?order_id=' + order_id,
      })
    }
  }
})

