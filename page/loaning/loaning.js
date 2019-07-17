// page/loaning/loaning.js
var common = require('../../js/common.js');
let tabIndex = '0';
// let sortList = [];
Page({
  /**
   * 页面的初始数据
   */
  data: {
    tabIndex: '',
    Fqvalue: '',
    currentTabsIndex: '2',
    stateFq: false,
    stateSy: false,
    stateAtr: false,
    statetop: false,
    sortList: [],
    atr: '0',
    desc: '',
    arrqs: [
      { name: '12' },
      { name: '24' },
      { name: '36' }
    ],
    checkItem: [{
      check: true
    }],
    itemList: [
      { name: '首付', atr: 0, stateSy: false, sc: '', nameper: 'first_per' },
      { name: '利率', atr: 0, stateSy: false, sc: '', nameper: 'mon_per' },
      { name: '可增融', atr: 0, stateSy: false, sc: '', nameper: 'rebate' }
    ],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    this.setData({
      // order_id: options.order_id,
      order_id: 34,
      Fqvalue: this.data.arrqs[2].name,
    })
    console.log(this.data.order_id)
    // 获取联系人地址
    wx.request({
      url: 'https://sp.bjesc.com/index/profile/read',
      header: common.getRequestHeader(),
      method: 'GET',
      success: function (res) {
        var arr = res.data;
        var addressList = arr.data.address;
        if (arr.code == 0) {
          var last = addressList.length - 1;
          if (addressList != '') {
            that.setData({
              addressList: addressList,
              adName: addressList[last].name,
              adNnmber: addressList[last].phone,
              fullAddress: addressList[last].fullAddress,
              address_id: addressList[last].id
            })
            for (var i in addressList) {
              if (addressList[i].defaultAddress) {
                that.setData({
                  adName: addressList[i].name,
                  addressList: addressList,
                  adNnmber: addressList[i].phone,
                  fullAddress: addressList[i].fullAddress,
                  address_id: addressList[i].id
                })
              }
            }
          }

        } else {
          console.log(arr.msg);
        }
      },
      fail: function (res) {
        console.log('is failed');
      }
    });

    // 头部头部信用信息
    wx.request({
      url: 'https://sp.bjesc.com/index//order/touCredit',
      header: common.getRequestHeader(),
      data: {
        order_id: this.data.order_id,
        months: 36
      },
      method: 'GET',
      success: function (res) {
        var arr = res.data;
        if (arr.code == 0) {
          var list = arr.data;
          that.setData({
            headlist: list.header
          })
        }
      }
    })

    // 分期方案列表
    wx.request({
      url: 'https://sp.bjesc.com/index/fund/loanCandidate',
      header: common.getRequestHeader(),
      data: {
        order_id: this.data.order_id
      },
      method: 'GET',
      success: function (res) {
        var arr = res.data;
        if (arr.code == 0) {
          var datalist = arr.data.list.data;
          var list = [];
          for (var i = 0; i < datalist.length; i++) {
            // if (typeof (datalist['list']) == 'undefined') datalist['list'] = [];
            // datalist['list'][i] = checkitems[i]
            datalist[i]['checked'] = false;
            datalist[i]['sort'] = '';
          }
          that.setData({
            zplist: datalist
          })
          // console.log(datalist);
        } else {
          console.log(arr.msg);
        }
      },
      fail: function (res) {
        console.log('is failed');
      }
    });


  },

  urlcpxq: function () {
    var order_id = this.data.order_id
    wx.navigateTo({
      url: '../cpxq/cpxq?order_id=' + order_id,
    })
  },
  // 期数选择
  changeFq: function (e) {
    console.log(e)
    var that = this;
    var text = e.currentTarget.dataset.text
    var index = e.currentTarget.dataset.index
    this.setData({
      stateFq: (!this.data.stateFq),
      months: text,
      sortList: []
    })

    if (typeof (index) !== 'undefined') {
      this.setData({
        currentTabsIndex: e.currentTarget.dataset.index,
        Fqvalue: text,
        statetop: true
      })
      // 分期方案列表
      wx.request({
        url: 'https://sp.bjesc.com/index/fund/loanCandidate',
        header: common.getRequestHeader(),
        data: {
          order_id: this.data.order_id,
          months: text
        },
        method: 'GET',
        success: function (res) {
          var arr = res.data;
          if (arr.code == 0) {
            var datalist = arr.data.list.data;
            var list = [];
            for (var i = 0; i < datalist.length; i++) {
              // if (typeof (datalist['list']) == 'undefined') datalist['list'] = [];
              // datalist['list'][i] = checkitems[i]
              datalist[i]['checked'] = false;
              datalist[i]['sort'] = '';
            }
            that.setData({
              zplist: datalist
            })
            // console.log(datalist);
          } else {
            console.log(arr.msg);
          }
        },
        fail: function (res) {
          console.log('is failed');
        }
      });
    }

  },
  // 首付、利率、返点选择
  changeSf: function (e) {
    var that = this;
    var indexItem = e.currentTarget.dataset.index
    var desc = e.currentTarget.dataset.desc;
    this.setData({
      indexItem: indexItem,
      sortList: []
    })
    var itemList = this.data.itemList;
    for (var i in itemList) {
      var atr = e.currentTarget.dataset.atr;
      // console.log(desc);
      if (i == indexItem) {
        if (atr == 0) {
          itemList[i].sc = 'asc';
          itemList[i].atr = 1;
          itemList[i].stateSy = true
          this.setData({
            stateSy: true,
            stateAtr: false,
            itemList: itemList
          })

        } else {
          itemList[i].atr = 0;
          itemList[i].sc = 'desc';
          this.setData({
            stateAtr: true,
            itemList: itemList
          })
        }
        var sc = itemList[indexItem].sc
        var nameper = itemList[indexItem].nameper
        console.log(itemList[indexItem].nameper)
        wx.request({
          url: 'https://sp.bjesc.com/index/fund/loanCandidate?' + '&' + nameper + '=' + sc,
          header: common.getRequestHeader(),
          data: {
            order_id: this.data.order_id,
            months: this.data.Fqvalue
          },
          method: 'GET',
          success: function (res) {
            var arr = res.data;
            if (arr.code == 0) {
              var datalist = arr.data.list.data;
              var list = [];
              for (var i = 0; i < datalist.length; i++) {
                // if (typeof (datalist['list']) == 'undefined') datalist['list'] = [];
                // datalist['list'][i] = checkitems[i]
                datalist[i]['checked'] = false;
                datalist[i]['sort'] = '';
              }
              that.setData({
                zplist: datalist
              })
              // console.log(datalist);
            } else {
              console.log(arr.msg);
            }
          },
          fail: function (res) {
            console.log('is failed');
          }
        });

      }
    }

  },
  // 点击排序编号
  checkboxChange: function (e) {
    var datalist = this.data.zplist;
    var sortList = this.data.sortList
    function change(index) {
      var flag = false;
      for (var i in sortList) {
        if (index == sortList[i]) {
          sortList.splice(i, 1);
          // delete sortList[i];
          flag = true;
          break;
        }
      }
      if (!flag) {
        sortList.push(index);
      }
    }
    var that = this;
    var index = e.currentTarget.dataset.index;
    change(index)
    var list = this.data.zplist;
    // var num = 0;
    for (var i in list) {
      if (index == i) {
        list[i]['checked'] = !list[i]['checked'];
      }
    }
    var num = 1;
    for (var ii in sortList) {
      for (var i in list) {
        var index = sortList[ii];
        var i = parseInt(i);
        // if (!!index || index == 0) {
        // console.log(i)
        if (i == index) { // !!sortList[ii] &&
          // console.log(index + '==' + num);
          list[index]['sort'] = num
          num++;
        }
        // }
      }
    }

    this.setData({
      zplist: list
    })

  },
  // 点击进去详情页
  urlLoaning: function (e) {
    var index = e.currentTarget.dataset.index;
    var listinfo = this.data.zplist;
    if (listinfo[index].checked == false) {
      this.checkboxChange(e);
    }
    console.log(listinfo);
    // 调用单选框点击事件

    wx.navigateTo({
      url: '../loaningxq/loaningxq?listinfo=' + JSON.stringify(listinfo) + '&index=' + index,
    })
  },
  // 当前页提交
  urlLoaningxq: function () {
    var that = this;
    // 其它描述：
    var funds = [];
    var list = {};
    var listAll = this.data.zplist;
    console.log(this.data.sortList)
    var sortList = this.data.sortList;
    console.log(this.data);
      for (var i = 0; i < sortList.length; i++) {
        var ii = this.data.sortList[i]
        if (typeof (listAll[ii].jrValue) == "undefined") {
          listAll[ii].jrValue = '';
        }
        if (typeof (listAll[ii].gpsValue) == "undefined") {
          listAll[ii].gpsValue = '';
        }
        if (typeof (listAll[ii].content) == "undefined") {
          listAll[ii].otherValue = ''
        }
        if (typeof (listAll[ii].desc) == "undefined") {
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

    wx.request({
      url: 'https://sp.bjesc.com/index/order/submit',
      header: common.getRequestHeader(),
      data: {
        order_id: this.data.order_id,
        address_id: this.data.address_id,
        funds: JSON.stringify(funds)
      },
      method: 'POST',
      success: function (res) {
        var arr = res.data;
        console.log(arr)
        if (arr == 0) {
          wx.showToast({
            title: arr.msg,
            icon: 'none',
           success:function(){
           wx.redirectTo({
             url: '../fsperson/fsperson?order_id=' + that.data.order_id,
             })
           }
          })
        } else {
          wx.showToast({
            title: arr.msg,
            icon: 'none'
          })
        }

      }
    })

  },
  onShow:function(){
    console.log(this.data)
  }
})
