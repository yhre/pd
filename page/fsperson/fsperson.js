// page/fsperson/fsperson.js
var common = require('../../js/common.js');
var num = 0;
var fund = [];
Page({
  /**
   * 页面的初始数据
   */
  data: {
    modeone: 3,
    modetwo: 2,
    fund: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 从其它页面传过来
    var that=this;
    this.setData({
      order_id: options.order_id
      // order_id: '34'
    })
    // 头部头部信用信息
    wx.request({
      url: 'https://sp.bjesc.com/index/order/changeSaleman',
      header: common.getRequestHeader(),
      data:{
        order_id: this.data.order_id
      },
      method: 'GET',
      success: function (res) {
        
        var arr = res.data;
        if (arr.code == 0) {
          var personList = arr.data;
          that.setData({
            personList: personList
          })
          // console.log(personList)
        }else{
          console.log(arr.msg)
        }
      }
    })
  },

  checkboxChange:function(e){
    var that=this;
    var list = {};
    var personList = this.data.personList;
    var index = e.currentTarget.dataset.index;
    var parentsindex = e.currentTarget.dataset.parentsindex;
    console.log(personList[parentsindex].fundId)
    for (var i in personList[parentsindex].saleman) {
      if (index == i) {
        personList[parentsindex].saleman[index]['checked'] = !personList[parentsindex].saleman[index]['checked']
    }else{
     personList[parentsindex].saleman[i]['checked'] = false
    }
    
    }
    if (personList[parentsindex].saleman[index]['checked'] === true){
      fund[parentsindex] = {
        'fund_id': personList[parentsindex].fundId,
        'saleman_id': personList[parentsindex]['saleman'][index]['id'],
      };
    }else{
      fund[parentsindex] = {};
    }
   for(var i=0;i<fund.length;i++){
     if (JSON.stringify(fund[i]) === '{}' || typeof (fund[i]) =='undefined'){
       fund.splice(i,1);
     }
   }
    this.setData({
      personList: personList,
      fund: fund
    })
    console.log(this.data.fund);
  },
  // 点击取消按钮
 cancal:function(){
   var fund = this.data.fund;
   fund=[]
   var personList = this.data.personList;
   for (var i = 0; i < personList.length;i++){
     for (var j = 0; j < personList[i].saleman.length; j++){
       personList[i].saleman[j]['checked'] = false
      }
  }
   this.setData({
     personList: personList,
     fund: fund
   })
   console.log(this.data.fund);
 },
// 确定按钮
  confirm:function(){
    var that=this;
    var fund = {fund:this.data.fund};
    var order_id = {'order_id':this.data.order_id}
    var data = Object.assign(fund,order_id);
    console.log(data);
    wx.request({
      url: 'https://sp.bjesc.com/index/order/submitSaleman',
      header: common.getRequestHeader(),
      data: {
        data: JSON.stringify(data)
      },
      method: 'POST',
      success: function (res) {
        var arr = res.data;
        console.log(arr)
        if (arr.code == 0) {
          wx.showModal({
            title: arr.msg,
            content: '请保持电话畅通，服务专员稍后会联系你',
            showCancel:false,
            confirmColor:'#000000',
            success: function (res) {
              if (res.confirm) {
                wx.redirectTo({
                  url: '../order/order?order_id=' + that.data.order_id,
                })
              }
            }
          })
        }else{
          wx.showToast({
            title: arr.msg,
            icon:'none'
          })
        } 

      }
  })
  }
})