// page/score/score.js
var common = require('../../js/common.js');
var pageData = {}
for (var i = 1; i < 5; ++i) {
  (function (index) {
    pageData[`st${index}select`] = function (e) {
      // console.log(`st${index}发生select事件，携带值为`, e.currentTarget.id);
      var parentindex = e.currentTarget.dataset.parentindex;
      var in_xin = e.currentTarget.dataset.in;
      var scorelist = this.data.scorelist;
      switch(index){
        case 1:
          if (in_xin === 'use_sc2') {
            scorelist[parentindex].st1starone = Number(e.currentTarget.id);
          } else {
            scorelist[parentindex].st1starone = Number(e.currentTarget.id) + scorelist[parentindex].st1starone;
          }
          scorelist[parentindex].st1startwo = 5 - scorelist[parentindex].st1starone
          this.textshow(1, parentindex, scorelist[parentindex].st1starone);
         
          scorelist[parentindex].show = true;
         
          this.setData({
            scorelist: scorelist
          })
        break;
        case 2:
          if (in_xin === 'use_sc2') {
            scorelist[parentindex].st2starone = Number(e.currentTarget.id);
          } else {
            scorelist[parentindex].st2starone = Number(e.currentTarget.id) + scorelist[parentindex].st2starone;
          }
          scorelist[parentindex].st2startwo = 5 - scorelist[parentindex].st2starone
          this.textshow(2, parentindex, scorelist[parentindex].st2starone);
          this.setData({
            scorelist: scorelist
          })
          break;
          case 3:
          if (in_xin === 'use_sc2') {
            scorelist[parentindex].st3starone = Number(e.currentTarget.id);
          } else {
            scorelist[parentindex].st3starone = Number(e.currentTarget.id) + scorelist[parentindex].st3starone;
          }
          scorelist[parentindex].st3startwo = 5 - scorelist[parentindex].st3starone
          this.textshow(3, parentindex, scorelist[parentindex].st3starone);
          this.setData({
            scorelist: scorelist
          })
          break;
          case 4:
          if (in_xin === 'use_sc2') {
            scorelist[parentindex].st4starone = Number(e.currentTarget.id);
          } else {
            scorelist[parentindex].st4starone = Number(e.currentTarget.id) + scorelist[parentindex].st4starone;
          }
          scorelist[parentindex].st4startwo = 5 - scorelist[parentindex].st4starone
          this.textshow(4, parentindex, scorelist[parentindex].st4starone);     
          this.setData({
            scorelist: scorelist
          })
          break;
      }
     
    }
  })(i);
}

Page(Object.assign({}, pageData, {
  /**
   * 页面的初始数据
   */
  data: {
    // list:[
    //   { 'st1starone': 0, 'st2starone': 0, 'st2starone': 0, 'st3starone': 0, 'st4starone': 0, 'st1startwo': 5, 'st2startwo': 5, 'st3startwo': 5, 'st4startwo': 5, 'st1startext': '', 'st2startext': '', 'st3startext': '', 'st4startext': '', 'show': false,},
    //   { 'st1starone': 0, 'st2starone': 0, 'st2starone': 0, 'st3starone': 0, 'st4starone': 0, 'st1startwo': 5, 'st2startwo': 5, 'st3startwo': 5, 'st4startwo': 5, 'st1startext': '', 'st2startext': '', 'st3startext': '', 'st4startext': '', 'show': false,}
    // ]
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
    this.setData({
      order_id: options.order_id,
      // order_id: 32
    })
    wx.request({
      url: 'https://sp.bjesc.com/index/saleman/salemanScore',
      header: common.getRequestHeader(),
      data: {
        // order_id: options.order_id,
        order_id: this.data.order_id
      },
      method: 'GET',
      success: function (res) {
        var arr = res.data;
        if (arr.code == 0){
          var scorelist = arr.data;
          for (var i = 0; i < scorelist.length;i++){
            scorelist[i].st1starone=0;
            scorelist[i].st2starone = 0;
            scorelist[i].st3starone = 0;
            scorelist[i].st4starone = 0;
            scorelist[i].st1startwo = 5;
            scorelist[i].st2startwo = 5;
            scorelist[i].st3startwo = 5;
            scorelist[i].st4startwo = 5;
            scorelist[i].st1startext = '';
            scorelist[i].st2startext = '';
            scorelist[i].st3startext = '';
            scorelist[i].st4startext = '';
            scorelist[i].show = false;
            scorelist[i].desc='';
          }
          console.log(scorelist)
          that.setData({
            scorelist: scorelist
          })
         }
      }
  })
  },
  //情况二:用户给评分  
  textshow: function (index,parentindex,one) {
    console.log(parentindex);
    console.log(this.data);
    var scorelist = this.data.scorelist;
    var text = "st" + index + "startext";
    var key=text;
    switch (one) {
      case 1:
        scorelist[parentindex][key] ='不满意';
      
        break;
      case 2:
        scorelist[parentindex][key] = '一般'
        break;
      case 3:
        scorelist[parentindex][key] = '不错'
        break;
      case 4:
        scorelist[parentindex][key] = '满意'
        break;
      case 5:
        scorelist[parentindex][key] = '非常满意'
        break;
    }
    this.setData({
      scorelist: scorelist
    })
  },
  scorderTextarea:function(e){
    console.log(e)
    var scorelist = this.data.scorelist;
    var index = e.currentTarget.dataset.index;
    scorelist[index].desc = e.detail.value
    this.setData({
      scorelist: scorelist
    })
  },
  // 提交按钮：
  
  scoreBtn:function(){
    var fund = []
    var scorelist = this.data.scorelist;
   
    for (var i = 0; i < scorelist.length;i++){
      var i = parseInt(i);
      var list = {
        "saleman_id": scorelist[i].salemanId,
        "fund_id": scorelist[i].fundId,
        "saleman_star": scorelist[i].st1starone,
        "attitude_star": scorelist[i].st3starone,
        "efficiency_star": scorelist[i].st2starone,
        "ability_star": scorelist[i].st4starone,
        "desc": scorelist[i].desc,
      };
      fund.push(list)
     
    }
    
    console.log(fund)
    wx.request({
      url: 'https://sp.bjesc.com/index/saleman/submitScore',
      header: common.getRequestHeader(),
      data: {
        // order_id: options.order_id,
        order_id: this.data.order_id,
        fund: JSON.stringify(fund)
      },
      method: 'GET',
      success: function (res) {
        var arr = res.data;
        if (arr.code == 0) {
          wx.navigateBack({
            delta: 1
          })
        }else{
          // console.log(arr.msg)
        }
      },
    
    })
  },
}))


