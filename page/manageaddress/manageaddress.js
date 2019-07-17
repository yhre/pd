// page/manageaddress/manageaddress.js
var common = require('../../js/common.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    check:false,
    default: 1,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    var that = this;
    this.setData({
      url: options.url
    })
    // 获取联系人地址
    wx.request({
      url: 'https://sp.bjesc.com/index/profile/read',
      header: common.getRequestHeader(),
      method: 'GET',
      success: function (res) {
        
        var arr = res.data;
        var addressList = arr.data.address;
        console.log(addressList)
        if (arr.code == 0) {
          that.setData({
            addressList: addressList,
          })
        } else {
          console.log(arr.msg);
        }
      },
      fail: function (res) {
        console.log('is failed');
      }
    });
    console.log(this.data)
  },
  //选择默认地址
  checkboxChange: function (e) {
    var addressList = this.data.addressList;
    var index = e.currentTarget.dataset.index;
    var id = e.currentTarget.dataset.addressid;
    var market_id = e.currentTarget.dataset.marketid;
    for (var i = 0; i < addressList.length;i++){
      addressList[i].defaultAddress=false;
    } 
    wx.request({
      url: 'https://sp.bjesc.com/index/Address/edit',
      header: common.getRequestHeader(),
      data: {
        address_id: id,
        default: 1,
        market_id: market_id
      },
      method: 'POST',
      success: function (res) {
        var arr = res.data;
        if (arr.code == 0) {
          wx.showToast({
            title: arr.msg,
            icon: 'none',
            duration: 2000
          })
        } else {
          wx.showToast({
            title: arr.msg,
            icon: 'none',
            duration: 2000
          })
        }

      }
    })
    addressList[index].defaultAddress = true;
    this.setData({
      addressList: addressList,
    })
  },
  //修改地址
  edit:function(e){
    var index=e.currentTarget.dataset.index;
    var listadd = this.data.addressList[index]
    wx.navigateTo({
      url: '../editaddress/editaddress?list=' + JSON.stringify(listadd),
    })
  },
  //删除地址
  delete:function(e){
    var that=this;
    var addressList = this.data.addressList;
    var address_id=e.currentTarget.dataset.id;
    var index = e.currentTarget.dataset.index;
    console.log(index);
    wx.showModal({
      title: '确定删除?',
      success: function (res) {
        if (res.confirm) {
          wx.request({
            url: 'https://sp.bjesc.com/index/Address/del',
            header: common.getRequestHeader(),
            data: {
              address_id: address_id
            },
            method: 'GET',
            success: function (res) {
              addressList.splice(index,1);
              that.setData({
                addressList: addressList
              })
            },

          });

        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  
  },
  adressBtn:function(){
    wx.navigateTo({
      url: '../addaddress/addaddress?url=manage',
    })
  },
  onUnload: function () {
    // var url = this.data.url
    // if (url =='select'){
    //   wx.navigateTo({
    //     url: '../selectaddress/selectaddress',
    //   })
    // }
    // if (url == 'personinfo'){
    //   wx.navigateTo({
    //     url: '../personinfo/personinfo',
    //   })
    // }
   
  },

})
