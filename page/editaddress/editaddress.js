// page/addaddress/addaddress.js
var common = require('../../js/common.js');
Page({
  /**
   * 页面的初始数据
   */
  data: {
    showWin: false,
    showProvice: true,
    showCity: false,
    showMarket: false,
    dealerName:'',
    mrmarket:'',
    detaladd:'',
    address:'',
    default: '1',
    itemList: [
      { name: "请选择", active: 'active', or: 'show', id: '' },
      { name: "请选择", active: '', or: 'hide', id: '' },
      { name: "请选择", active: '', or: 'hide', id: '' }
    ],
    cityselect: true,
    marketselect: true,
    check: true,
    
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    
    // 将字符串转换为对象
    var list = JSON.parse(options.list);
    console.log(JSON.parse(options.list).province);
    
    this.setData({
      name: list.name,
      phone: list.phone,
      mrprovice:list.province.name,
      mrcity: list.city.name,
      carname: list.dealerName,
      detaladd: list.address,
      mrmarket: list.market.name,
      address_id:list.id,
      cityid: list.market.cityid,
      market_id: list.market.id
    })
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          height: res.windowHeight,
        })
      }
    })

    // 获取身份列表
    wx.request({
      url: 'https://sp.bjesc.com/index/Market/provinces',
      header: common.getRequestHeader(),
      method: 'GET',
      success: function (res) {
        var arr = res.data;
        that.setData({
          proviceList: arr.data.list,
        });
      }
    })
  },
  checkboxChange: function () {
    if (this.data.check) {
      this.setData({
        check: false,
        default: 0
      })
    } else {
      this.setData({
        check: true,
        default: 1
      })
    }
  },
  bindnameInput: function (e) {
    var that = this;
    this.setData({
      name: e.detail.value
    })
  },
  bindphoneInput: function (e) {
    var that = this;
    this.setData({
      phone: e.detail.value
    })
  },
  bindcnInput: function (e) {
    var that = this;
    this.setData({
      carname: e.detail.value
    })
  },
  detaladd: function (e) {
    var that = this;
    console.log(e)
    console.log(e.target.offsetTop)
    this.setData({
      detaladd: e.detail.value
    })
  },
  // 地址导航栏点击效果
  binditem: function (e) {
    var itemList = this.data.itemList
    var id = e.currentTarget.dataset.id;
    if (id == '0') {
      itemList[0].active = 'active';
      itemList[1].active = '';
      itemList[2].active = '';
      this.setData({
        itemList: itemList,
        showProvice: true,
        showCity: false,
        showMarket: false
      })
    }
    if (id == '1') {
      //  console.log(id);
      itemList[0].active = '';
      itemList[1].active = 'active';

      itemList[2].active = '';
      this.setData({
        itemList: itemList,
        showProvice: false,
        showCity: true,
        showMarket: false
      })
    }
    if (id == '2') {
      itemList[0].active = '';
      itemList[1].active = '';
      itemList[2].active = 'active';
      this.setData({
        itemList: itemList,
        showProvice: false,
        showCity: false,
        showMarket: true
      })
    }
  },
  // 省份点击
  bindprovice: function (e) {
    var that = this;
    var id = e.currentTarget.dataset.id;
    var index = e.currentTarget.dataset.index;
    var name = e.currentTarget.dataset.text;
    var itemList = this.data.itemList;
    itemList[0].id = id;
    itemList[0].name = name;
    itemList[0].active = '';
    itemList[1].active = 'active';
    itemList[1].name = '请选择';
    itemList[1].or = 'show';
    itemList[2].or = 'hide';

    this.setData({
      showProvice: false,
      showCity: true,
      itemList: itemList,
      currentTabsIndex: index,
      cityselect: false,
    })
    // 获取城市列表
    wx.request({
      url: 'https://sp.bjesc.com/index/Market/citys',
      header: common.getRequestHeader(),
      data: {
        province_id: id
      },
      method: 'GET',
      success: function (res) {
        var arr = res.data;
        console.log(arr)
        that.setData({
          cityList: arr.data.list,
        });
      }
    })
  },
  // 城市点击
  bindcity: function (e) {
    var that = this;
    var index = e.currentTarget.dataset.index;
    var id = e.currentTarget.dataset.id;
    var text = e.currentTarget.dataset.text
    var itemList = this.data.itemList;
    var cityid = e.currentTarget.dataset.index;
    itemList[1].id = id;
    itemList[0].active = '';
    itemList[1].active = '';
    itemList[1].name = text;
    itemList[2].name = '请选择';
    itemList[2].active = 'active';
    itemList[2].or = 'show';
    this.setData({
      showProvice: false,
      showCity: false,
      showMarket: true,
      TabsIndexcity: index,
      itemList: itemList,
      cityselect: true,
      marketselect: false,

    })
    // 获取车市
    wx.request({
      url: 'https://sp.bjesc.com/index/market/lists',
      header: common.getRequestHeader(),
      data: {
        cityid: id
      },
      method: 'GET',
      success: function (res) {
        var arr = res.data;
        console.log(arr.data.list);
        that.setData({
          marketList: arr.data.list,
        });
      }
    })
  },
  // 获取车市列表
  bindmarket: function (e) {
    // 获取城市列表
    var that = this;
    var index = e.currentTarget.dataset.index;
    var id = e.currentTarget.dataset.id;
    var text = e.currentTarget.dataset.text;
    var cityid = this.data.itemList[1].id;
    var market_id = e.currentTarget.dataset.id;
    var itemList = this.data.itemList;
    itemList[2].id = market_id;
    itemList[2].name = text;
    this.setData({
      showProvice: false,
      showCity: false,
      showMarket: true,
      TabsIndexmarket: index,
      itemList: itemList,
      marketselect: true,
      showWin: false,
      market_id: market_id,
      mrprovice: itemList[0].name,
      mrcity: itemList[1].name,
      mrmarket: itemList[2].name,
      address: ''
    })
  },
  selectChe: function () {
    this.setData({
      showWin: true
    })
  },
  // 关闭城市弹窗
  bindclose: function () {
    this.setData({
      showWin: false
    })
  },
//  修改
  saveadd:function(){
    var that=this;
    console.log(this.data.default);
    
    wx.request({
      url: 'https://sp.bjesc.com/index/Address/edit',
      header: common.getRequestHeader(),
      data: {
        address_id: this.data.address_id,
        name: this.data.name,
        phone: this.data.phone,
        dealer_name: this.data.carname,
        market_id: this.data.market_id,
        address: this.data.detaladd,
        default: this.data.default,
        cityid: this.data.cityid,
        
      },
      
      method: 'POST',
      success: function (res) {
        var arr = res.data;
        if (arr.code==0){
          wx.redirectTo({
            url: '../manageaddress/manageaddress',
          })
          console.log(arr.msg)
        }else{
          console.log(arr.msg)
        }
      
      }
    })
  }
  
})