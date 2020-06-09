// pages/index/wellcome.js
var app = getApp(), api = require('../../api.js'), util = require('../../utils/util.js');
Page({
  /**
   * 页面的初始数据
   */
  data: {

  },
  go_record:function(){
    wx.navigateTo({
      url: '/pages/record/list',
    })
  },
  go_phone_list: function () {
    wx.navigateTo({
      url: '/pages/leader/index',
    })
  },
 
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var rd_session = wx.getStorageSync('rd_session');
    var member_info = wx.getStorageSync('member_info');
    if (!rd_session) {
      // 微信没有登录，跳转微信登录
      wx.reLaunch({
        url: '/pages/index/index',
      })
    }else {
      // 微信登录了，小程序没有登录，跳转登录小程序
      if (!member_info) {
        wx.reLaunch({
          url: '/pages/login/login',
        })
      }else{
        app.ajax(api.get_company_info, {
          rd_session: wx.getStorageSync('rd_session')
        }, (res, err) => {
          if (res.result == "success") {
            this.setData({
              info: res.data.lists
            })
          }
        })  
      }
       }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})