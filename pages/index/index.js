// pages/index/index.js
var app = getApp(),
  api = require('../../api.js'),
  util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  go_record: function() {
    wx.navigateTo({
      url: '/pages/record/list',
    })
  },
  go_phone_list: function() {
    wx.navigateTo({
      url: '/pages/leader/index',
    })
  },
  go_wx_login:function(){
    wx.login({
      success(res) {
        if (res.code) {
          //发起网络请求
          console.log(api.wxlogin)
          app.ajax(api.wxlogin, {
            code: res.code,
            
          }, (res, err) => {
            if (res.result == "success") {
              wx.setStorageSync("rd_session", res.rd_session) 
              wx.reLaunch({
                url: '/pages/login/login',
              })
            }
          })

        } else {
          console.log('登录失败！' + res.errMsg)
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var rd_session = wx.getStorageSync('rd_session');
    // 登录过 进入欢迎页面
    if (rd_session) {
      wx.reLaunch({
        url: '/pages/index/wellcome',
      })
    } else {
     
    }


  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})