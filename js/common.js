// 获取数据请求的请求头设置
var pubRSA = require("../js/public_rsa.js");
var app=getApp();
function getRequestHeader() {
  var timestamp = Date.parse(new Date()) / 1000;
  // 微信app.js自带的缓存
  // var encStrhead = pubRSA.pubRSA(app.appKey+timestamp);
  // 页面写的缓存
  var key = wx.getStorageSync('appKey')
  var encStrhead = pubRSA.pubRSA(key + timestamp);
  // console.log(key + timestamp)
  // console.log(encStrhead)
  return {
    'content-type': 'application/x-www-form-urlencoded', // 默认值
    'X-Package': 'com.bjesc.clientApp',
    'X-Authentication': encStrhead
    // 'X-Authentication': encStrhead
  }
}
module.exports ={
  getRequestHeader: getRequestHeader
}
