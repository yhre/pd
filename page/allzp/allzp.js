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
    codepd: '',
    zplist:[],
    logo:'',
    zpname:'',
    desc:'',
    cityid:'',
    show:false,
   
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
    // 获取当前位置
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
            var province = addressRes.result.address_component.province.substring(0, 2);
            var city = addressRes.result.address_component.city.substring(0,2);
            var cityid=addressRes.result.ad_info.city_code.substring(3);
            // var cityid=
            that.setData({
              province: province,
              city: city,
              cityid:cityid
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
          that.setData({
            pro: arr.list
           
          })
        },
        fail: function (res) {
        }
      })
    
    
  },
  // 页面返回时再次调用接口
  onShow:function(){
    this.changeLoan();
  },
  //跳转到获取身份的城市页面
  urlProvice: function () {
    wx.navigateTo({
      url: '../zpprovince/zpprovince'
    })
  },
  // 获取资方列表
  changeLoan:function(){
    // 获取资方列表
    // 510100成都
    var that = this;
    var encStr = pubRSA.pubRSA();
    this.setData({
      codepd: encStr,
    })
    wx.request({
      url: 'https://sp.bjesc.com/index/fund/lists',
      header: {
        'content-type': 'application/json',
        'X-Authentication': this.data.codepd
      },
      data: {
        cityid: this.data.cityid,
      },
      method: 'GET',
      success: function (res) {
        console.log(res.data.data.list)
        if (res.data.data.list.length==0){
          that.setData({
            show:true
          })
        }
         
        that.setData({
          zplist: res.data.data.list,
        })
      },
      fail: function (res) {
      }
    })
  },
  // 跳转到资方详情页
  urlZpxq:function(e){
    var id = e.currentTarget.dataset.index;
      wx.navigateTo({
        url: '../allzpxq/allzpxq?id='+id,
      })
  }
})

