// pages/login/login.js
var app = getApp();
var api = require('../../api.js');
var util = require('../../utils/util.js');

var myreg = /^1(?:3\d|4[4-9]|5[0-35-9]|6[67]|7[013-8]|8\d|9\d)\d{8}$/;
Page({
 data: {
  company: [],
  index: 0
 },
//  忘记密码页面
 forget_password: function () {
  wx.navigateTo({
   url: '/pages/login/forget',
  })

 },
 company_change: function (e) {
  this.setData({
   index: e.detail.value
  })
 },
 formSubmit: function (e) {
  var info = e.detail.value;
  if (info.name.length <= 0) {
   wx.showToast({
    title: '请输入正确的账号',
    icon: 'none'
   })
  } else if (info.password.length <= 0) {
   wx.showToast({
    title: '请输入您的密码',
    icon: 'none'
   })
  } else {
   app.ajax(api.login, {
    company_id: this.data.list[this.data.index].id,
    name: info.name,
    password: info.password,
    rd_session: wx.getStorageSync('rd_session')
   }, (res) => {

    if (res.result == 'success') {
     wx.setStorageSync("rd_session", res.rd_session)
     wx.setStorageSync("member_info", res.list)
     wx.setStorageSync("is_edit_password", res.list.need_init_password)
     wx.setStorageSync("name", res.list.name)
     if (res.list.role_id == 7) {
      wx.setStorageSync('member_type', 'leader')
     } else {
      wx.setStorageSync('member_type', '')
     }
     if (res.list.need_init_password) {
      wx.reLaunch({
       url: '../login/password?',
      })
     } else {
      wx.reLaunch({
       url: '../index/wellcome',
       success: function (res) {

       },
       fail: function (res) { },
       complete: function (res) { },
      })

     }
    }
   });
  }
 },
 onLoad: function () {
  // var rd_session = wx.getStorageSync('rd_session');
  // // 获取信息
  // app.ajax(api.get_company_list, {}, (res, err) => {
  //  var list = res.data.list,
  //   company = [];
  //  for (var i = 0; i < list.length; i++) {
  //   company.push(list[i].company_name)
  //  }
  //  this.setData({
  //   list: list,
  //   company: company,
  //  })
  // })
 }
});