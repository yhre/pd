// page/allzpxq/allzpxq.js
var common = require('../../js/common.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    fristprice:'',
    price:'',
    mothprice:'',
    rebate:'',
    array: ['12期', '24期', '36期'],
    objectArray: [
      {
        id: 0,
        name: '12期'
      },
      {
        id: 1,
        name: '24期'
      },
      {
        id: 2,
        name: '36期'
      },
    ],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    var that=this;
    var pages=getCurrentPages();
    var currPage=pages[pages.length-2];
    var id = options.id;
    for (var i in currPage.data.zplist) {
      if (id== i) {
        var list = currPage.data.zplist[i];
        console.log(list)
        that.setData({
          name: list.name,
          logo:list.logo,
          fundDemand: list.fundDemand,
          desc:list.desc,
          monPer:list.monPer/100,
          firstPer: list.firstPer,
          rebateget: list.rebate,
        })
      }
    }
    this.setData({
      index: 2,
    })
  },
  bindpriceInput:function(e){
    this.setData({
      price: e.detail.value
    })
  },
  bindPickerChange: function (e) {
    console.log(e)
    var that = this;
    var price = this.data.price.replace(/\s+/g, '')
    var first_per = this.data.firstPer;
    var monPer = this.data.monPer*100;
    var rebateget = this.data.rebateget;
    // 首付计算
    var fristprice = price * first_per/100
    var state = parseInt(e.detail.value)+1;
    // 计算月供：总价*月息 + 总价/分期
    var mothprice = ((price * 10000) / (state * 12) + (price * monPer)).toFixed()
    // 返利
    var rebate = ((price * monPer * state * 12 * rebateget) / 100).toFixed(2);
    // console.log((price * monPer))
    if (price == ''){
    wx.showToast({
      title: '请输入车辆成交价',
      icon:'none'
    })
    }else{
      this.setData({
        index: e.detail.value,
        fristprice: fristprice,
        mothprice: mothprice,
        rebate:rebate
      })
    }
  },
})
