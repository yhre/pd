// page/addaddress/addaddress.js
var QQMapWX = require("../../js/qqmap-wx-jssdk.min.js");
var qqmapsdk;
var common = require('../../js/common.js');
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    mrprovice: '请选择',
    showWin: false,
    showProvice: true,
    showCity: false,
    showMarket: false,
    address: '',
    default: '1',
    itemList: [
      { name: "请选择", active: 'active', or: 'show', id: '' },
      { name: "请选择", active: '', or: 'hide', id: '' },
      { name: "请选择", active: '', or: 'hide', id: '' }
    ],
    cityselect: true,
    marketselect: true,
    check: true
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    console.log(options.url)
    this.setData({
      url: options.url,
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
    console.log(this.data.cityList)
  },
  // 城市点击
  bindcity: function (e) {
    var that = this;
    var index = e.currentTarget.dataset.index;
    var id = e.currentTarget.dataset.id;
    // 判断没有code的市
    if (!id){
      id='11111111';
   }
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
    var itemList = this.data.itemList

    this.setData({
      showWin: true,
      itemList: itemList,

    })
  },
  // 关闭城市弹窗
  bindclose: function () {
    this.setData({
      showWin: false
    })
  },
  // 保存添加的地址
  saveadd: function () {
    var that = this;
    var cityid = this.data.itemList[1].id;
    var market_id = this.data.itemList[2].id;
    wx.request({
      url: 'https://sp.bjesc.com/index/Address/add',
      header: common.getRequestHeader(),
      data: {
        name: this.data.name,
        phone: this.data.phone,
        dealer_name: this.data.carname,
        cityid: cityid,
        market_id: market_id,
        address: this.data.address,
        default: this.data.default,
      },
      method: 'POST',
      success: function (res) {
        var arr = res.data;
        if (arr.code == 0) {
          if (that.data.url == 'selectadd') {
            var url = '../selectaddress/selectaddress'
          } else if (that.data.url == 'manage') {
            var url = '../manageaddress/manageaddress'
          } else if (that.data.url == 'loaning') {
            var address_id = arr.data.id;
            var pages = getCurrentPages();
            var currPage = pages[pages.length - 1];   //当前页面
            var prevPage = pages[pages.length - 2];  //上一个页面
            console.log(prevPage);
            // 把添加的输入框的值传递给上一个页面
            prevPage.setData({
              adName: that.data.name,
              adNnmber: that.data.phone,
              fullAddress: that.data.address,
              address_id: address_id
            })
            var url = '../loaning/loaning'
          }
          console.log(url)
          wx.showToast({
            title: '添加成功',
            icon: 'none',
            success: function () {
              wx.redirectTo({
                url: url
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
  // 页面一开始自动定位到当前城市所在的车市
  onShow: function () {
    var that = this;
    var itemList = this.data.itemList;
    itemList[2]['name'] = '请选择'
    itemList[0]['or'] = 'show'
    itemList[1]['or'] = 'show'
    itemList[2]['or'] = 'show'
    itemList[0]['active'] = ''
    itemList[1]['active'] = ''
    itemList[2]['active'] = 'active'
    this.setData({
      showProvice: false,
      showCity: false,
      showMarket: true,
      itemList: itemList
    })
    var pages = getCurrentPages();
    var prevPage = pages[pages.length - 2];  //上一个页面
    console.log(prevPage.data.addressList);
    var defaultlist = prevPage.data.addressList
    for (var i = 0; i < defaultlist.length; i++) {
      if (defaultlist[i].defaultAddress == true) {
        console.log(defaultlist[i]);
        itemList[0]['name'] = defaultlist[i].province.name
        itemList[1]['name'] = defaultlist[i].city.name
        var province_id = defaultlist[i].province.code
        var cityid = defaultlist[i].cityid
        this.setData({
          name: defaultlist[i].name,
          phone: defaultlist[i].phone,
          fullAddress: defaultlist[i].fullAddress,
          itemList: itemList
          // mrprovice: defaultlist[i].province.name,
          // mrcity: defaultlist[i].city.name,
          // mrmarket: defaultlist[i].market.name,
        })
      } else {
        if (app.appData.userinfo != '') {
          this.setData({
            name: app.appData.userinfo.name,
            phone: app.appData.userinfo.phone
          })
        }
      }
    }
    qqmapsdk = new QQMapWX({
      key: 'NO2BZ-4YL65-VXBIH-Q32N3-SCGUV-ARBD3'
    });
    wx.getLocation({
      type: 'wgs84',
      success: function (res) {
        //2、根据坐标获取当前位置名称，显示在顶部:腾讯地图逆地址解析
        qqmapsdk.reverseGeocoder({
          location: {
            latitude: res.latitude,
            longitude: res.longitude
          },
          success: function (addressRes) {
            var province = addressRes.result.address_component.province;
            var city = addressRes.result.address_component.city;
            city = city.substring(0, city.length - 1);
            province = province.substring(0, province.length - 1);
            var cityid = addressRes.result.ad_info.city_code.substring(3);
            console.log(cityid);
            var province_id = cityid.substring(0, 2) + '0000'
            var itemList = that.data.itemList;
            itemList[0]['name'] = province
            itemList[1]['name'] = city
            
            that.setData({
              provincename: province,
              cityname: city,
              showProvice: false,
              showCity: false,
              showMarket: true,
              itemList: itemList
            });

          }
        })
      },
      fail: function (res) {

      }
    })
    // 获取车市
    wx.request({
      url: 'https://sp.bjesc.com/index/market/lists',
      header: common.getRequestHeader(),
      data: {
        cityid: cityid
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
    // 获取城市列表
    wx.request({
      url: 'https://sp.bjesc.com/index/Market/citys',
      header: common.getRequestHeader(),
      data: {
        province_id: province_id
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
  }
})