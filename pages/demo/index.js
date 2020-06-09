var app = getApp(), api = require('../../api.js'), util = require('../../utils/util.js');
Page({
  data: {
  },
  //数据请求demo
  onLoad: function (e) {
    // app.ajax(api.index, { catid: 'ss' }, (data, err) => {
    //   this.setData({ data: data })
    // })

    
    //检测登录demo
  //  app.check_logined({ success() { }, fail: function () { } })

  },
  //登录demo
  login: function () {
    wx.navigateTo({
      url: '/pages/login/login'
    })
  },
  //登录demo
  login_direct: function () {
    wx.navigateTo({
      url: '/pages/login/login_direct'
    })
  },
  //一键获取手机号demo
  getPhoneNumber: function (e) {
    app.decode_phone({
      iv: e.detail.iv,
      encryptedData: e.detail.encryptedData,
      success: function (data) { }, fail: function (data) { }
    })
  },
  //支付demo
  pay: function () {
    app.pay({
      url: api.pay_order,
      order_no: '423432535',
      openid: 'test',
      success: function (res) { },
      fail: function (res) { }
    })
  }
});