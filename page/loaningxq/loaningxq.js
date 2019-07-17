var common = require('../../js/common.js');
// page/loaningxq/loaningxq.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
  //  代收项目素组
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.log(options);
    var index = options.index
    // 所有选择的资方信息
    var listAll = JSON.parse(options.listinfo);
    // 当前页面对应的资方信息
    var listinfo = JSON.parse(options.listinfo)[index];
    console.log(JSON.parse(options.listinfo))
    // 含增融的贷款金额万元=无增融的贷款金额万元+增融
    var dkprice = (listinfo.carPrice - listinfo.firstPrice) + (listinfo.carPrice - listinfo.firstPrice) * listinfo.rebate / 100;
    // 月付利率： 含增融的贷款金额万元 * 基本月息 / 无增融的贷款金额万元
    var calcPer = ((dkprice * listinfo.monPer) / (listinfo.carPrice - listinfo.firstPrice)).toFixed(2);
    this.setData({
      index:index,
      listinfo: listinfo,
      listAll: JSON.parse(options.listinfo),
      carPrice: listinfo.carPrice,
      firstPrice: listinfo.firstPrice,
      monthPrice: listinfo.monthPrice,
      rebatePrice: listinfo.rebatePrice,
      months: listinfo.months,
      monPer: listinfo.monPer/100,
      rebateVal: listinfo.rebate,
      calcPer: calcPer,
      fundDemand: listinfo.fundDemand,
      processImg: listinfo.processImg
    })
    
  },
  bindchanging:function(e){
    var that = this;
    var index=this.data.index;
    var listAll = this.data.listAll;
    listAll[index].rebate = e.detail.value
    this.setData({
      Rrebate: e.detail.value,
      listAll: listAll
    })
    // 成交价
    var carPrice = this.data.carPrice
    // 首付
    var firstPrice = this.data.firstPrice
    // 可增容
    var rebatePrice = this.data.rebatePrice
    // 分期数
    var months = this.data.months
    var monPer = this.data.monPer
    var Rrebate = this.data.Rrebate
    var dkprice = (carPrice - firstPrice) + (carPrice - firstPrice) * Rrebate / 100;
    // 利率=含增融的贷款金额万元*基本月息/无增融的贷款金额万元
    var calcPer = ((dkprice * monPer) / (carPrice - firstPrice)).toFixed(2) ;
    console.log(monPer)
    // // 可增融=无增融的贷款金额万元*返点/100
    var rebatePrice = ((carPrice - firstPrice) * Rrebate*100).toFixed();
    // 月供
    var monthPrice = (dkprice * monPer * 100 + dkprice / months * 10000).toFixed();
    this.setData({
      monthPrice: monthPrice,
      rebatePrice: rebatePrice,
      calcPer: calcPer
    })
  },
  //金融手续费
  jrpruice:function(e){
    var listAll = this.data.listAll;
   var index=this.data.index;
   listAll[index]['jrValue']= e.detail.value
   this.setData({
     listAll: listAll
   })
  
  },
  // GPS费用
  gps:function(e){
    var listAll = this.data.listAll;
    var index = this.data.index;
    listAll[index]['gpsValue'] = e.detail.value
    this.setData({
      gpsValue: e.detail.value
    })
  },
  //其它
other:function(e){
  var listAll = this.data.listAll;
  var index = this.data.index;
  listAll[index]['otherValue'] = e.detail.value
  this.setData({
    otherValue: e.detail.value
  })
  console.log(this.data.listAll)
},
//备注
tipsInput: function (e) {
  var listAll = this.data.listAll;
  var index = this.data.index;
  listAll[index]['tipsValue'] = e.detail.value
  this.setData({
    descValue: e.detail.value
  })
  console.log(this.data.listAll)
},
  // 添加备选按钮
  urlxuan:function(){
    // console.log(this.data.listinfo)
    var listAll = this.data.listAll;
    var pages = getCurrentPages();
    var currPage = pages[pages.length - 1];   //当前页面
    var prevPage = pages[pages.length - 2];  //上一个页面
    console.log(prevPage);
    // 把添加的输入框的值传递给上一个页面
    prevPage.setData({
      zplist: listAll
    })
    wx.navigateBack({
      delta: 1
    })
   
  },
  // 提交按钮
    submitxuan:function(){
      var that=this;
      var listAll = this.data.listAll;
      var pages = getCurrentPages();
      var currPage = pages[pages.length - 1];   //当前页面
      var prevPage = pages[pages.length - 2];  //上一个页面
      console.log(prevPage.data);
      // 其它描述：
      var funds = [];
       var list={}
       for (var i = 0; i < prevPage.data.sortList.length;i++){
         var ii = prevPage.data.sortList[i]
         if (typeof(listAll[ii].jrValue) ==undefined){
           listAll[ii].jrValue='';
        }
         if (typeof(listAll[ii].gpsValue) == undefined){
           listAll[ii].gpsValue = '';
        }
         if (typeof(listAll[ii].content) == undefined){
           listAll[ii].otherValue=''
        }
         if (typeof(listAll[ii].desc) == undefined) {
           listAll[ii].descValue = ''
        }
         var ii = parseInt(ii);
        var list = {
          "id": listAll[ii].id,
          "months": listAll[ii].months,
          "rebate": listAll[ii].rebate,
          "poundage": listAll[ii].jrValue,
          'gps': listAll[ii].gpsValue,//gps费用   
          'content': listAll[ii].otherValue,//其他费用的描述
          'desc': listAll[ii].descValue,//备注
        };
        funds.push(list)
      }
      
      var pages = getCurrentPages();
      var prevPage = pages[pages.length - 2]; 
      console.log(prevPage.data)
     
      wx.request({
        url: 'https://sp.bjesc.com/index/order/submit',
        header: common.getRequestHeader(),
        data:{
          order_id: prevPage.data.order_id,
          address_id: prevPage.data.address_id,
          funds: JSON.stringify(funds)
        },
        method: 'POST',
        success:function(res){
          var arr = res.data;
          console.log(arr)
         if (arr==0){
           wx.showToast({
             title: arr.msg,
             icon: 'none',
             success:function(){
               wx.redirectTo({
                 url: '../fsperson/fsperson?order_id='+ prevPage.data.order_id,
               })
             }
           })
         }else{
           wx.showToast({
             title: arr.msg,
             icon: 'none',
           })
         }
         
        }
      })

      // 点击添加备选按钮

    }
})

