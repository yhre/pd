var QQMapWX = require("../../js/qqmap-wx-jssdk.min.js");
var qqmapsdk;
var pubRSA = require("../../js/public_rsa.js");
Page({
  /**
   * 页面的初始数据
   */
  data: {
    province: '正在定位……',
    city: '',
    codepd: ''
  },
  onLoad: function (options) {
    var that = this;
    var encStr = pubRSA.pubRSA();
    this.setData({
      codepd: encStr,
    })
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
            that.setData({
              province: province,
              city: city
            })
          }
        })
      }
    }),

      wx.request({
        url: 'https://sp.bjesc.com/index/market/provinces',
        header: {
          'content-type': 'application/json',
          'X-Authentication': this.data.codepd
        },
        method: 'GET',
        success: function (res) {
          var arr = res.data.data;
          console.log(arr.list)
          that.setData({
            pro: arr.list
          })
        },
        fail: function (res) {
        }
      })
  },

  choProvice: function (e) {
    var that = this;
    var index = e.currentTarget.dataset['index'];
    var provinceid = e.currentTarget.dataset.provinceid;
    var provincename = e.currentTarget.dataset.text;
    this.setData({
      currentTabsIndex: index
    })
    wx.navigateTo({
      url: '../city/city?provinceid=' + provinceid + '&provincename=' + provincename
    })

  }
})

