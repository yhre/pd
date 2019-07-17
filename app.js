
var appKey='';
// var dataKey='';
// var phone='';
// var appKey = dataKey + '::' + phone + '::' + timestamp;
App({
  appData:{
    userinfo:'',
  },

  /**
   * 当小程序初始化完成时，会触发 onLaunch（全局只触发一次）
   */
  onLaunch: function () {
    
  },

  /**
   * 当小程序启动，或从后台进入前台显示，会触发 onShow
   */
  onShow: function (options) {
    
  },

  /**
   * 当小程序从前台进入后台，会触发 onHide
   */
  onHide: function () {
    
  },

  /**
   * 当小程序发生脚本错误，或者 api 调用失败时，会触发 onError 并带上错误信息
   */
  onError: function (msg) {
    
  },

  validate: function (data) {
    var phone = '';
    var code = '';
    var pwd='';
    var repwd = '';
    var title;
    var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;
    var pwdreg = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,16}$/;
    if (data.phone.length == 0) {
      title='请输入手机号！'
    }
    else if (!myreg.test(data.phone)) {
      title = '手机号码格式不正确！'
    }
    else if (data.code.length == 0) {
      title = '验证码不能为空！'
    }else if(data.pwd.length == 0) {
      title = '请输入密码！'
    }
    else if (!pwdreg.test(data.pwd)){
      title = '密码格式不正确！'
    }
    else if (data.repwd.length == 0) {
      title = '请再一次输入密码！'
    }
    else if (data.pwd!=data.repwd) {
      title = '两次密码不一致！'
    }
    if (!!title){
      wx.showToast({
        title: title,
        icon: 'none',
      })
      return false;
    }
    return true;
  },

 })
