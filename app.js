//app.js
var config = require('./config.js'),
  encrypt = require('./utils/encrypt.js'),
  secret = config.secret,
  api = require('./api.js');

App({
  //检测认证状态
  check_logined: function (para) {
    var rd_session = wx.getStorageSync('rd_session');
    if (!rd_session) {
      typeof para.fail === 'function' && para.fail();
    } else {
      wx.checkSession({
        success: () => {
          typeof para.success === 'function' && para.success();
        },
        fail: () => {
          typeof para.fail === 'function' && para.fail();
        }
      })
    }
  },
  // 小程序加载完后
  onLaunch: function (options) {
    var rd_session = wx.getStorageSync('rd_session');
    var member_info = wx.getStorageSync('member_info');
    // 微信没有登录，跳转微信登录
    if (!rd_session) {
      wx.reLaunch({
        url: '/pages/index/index',
      })
    } else {
      // 微信登录了，小程序没有登录，跳转登录小程序
      if (!member_info) {
        wx.reLaunch({
          url: '/pages/login/login',
        })
      } else {

      }
    }
    //分销使用标记上级id
    if (options.query.scene) {
      wx.setStorageSync("inviter_id", options.query.scene)
    }
    // 获取小程序更新机制兼容
    if (wx.canIUse('getUpdateManager')) {
      const updateManager = wx.getUpdateManager()
      updateManager.onCheckForUpdate(function (res) {
        // 请求完新版本信息的回调
        if (res.hasUpdate) {
          updateManager.onUpdateReady(function () {
            wx.showModal({
              title: '更新提示',
              content: '新版本已经准备好，是否重启应用？',
              success: function (res) {
                if (res.confirm) {
                  // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
                  updateManager.applyUpdate()
                }
              }
            })
          })
          updateManager.onUpdateFailed(function () {
            // 新的版本下载失败
            wx.showModal({
              title: '已经有新版本了哟~',
              content: '新版本已经上线啦~，请您删除当前小程序，重新搜索打开哟~',
            })
          })
        }
      })
    } else {
      // 如果希望用户在最新版本的客户端上体验您的小程序，可以这样子提示
      wx.showModal({
        title: '提示',
        content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
      })
    }
  },

  onShow: function (options) {
    // 显示
  },
  onHide: function () {
    // 隐藏
  },
  onError: function (msg) {
    console.log(msg)
  },

  //为空检测
  check_empty: function (v) {
    switch (typeof v) {
      case 'undefined':
        return true;
      case 'string':
        if (v.replace(/(^[ \t\n\r]*)|([ \t\n\r]*$)/g, '').length == 0) return true;
        break;
      case 'boolean':
        if (!v) return true;
        break;
      case 'number':
        if (0 === v || isNaN(v)) return true;
        break;
      case 'object':
        if (null === v || v.length === 0) return true;
        for (var i in v) {
          return false;
        }
      default:
        return true;
    }
    return false;
  },
  //自动登录
  init_login() {
    var rd_session = wx.getStorageSync('rd_session');
    if (!rd_session) {
      // 登录
      wx.login({
        success: (res) => {
          if (res.code) {
            this.ajax(api.auto_login, {
              code: res.code,
            }, (ress, err) => {
              console.log(ress)
              if (ress.result == 'success') {
                wx.setStorageSync("rd_session", ress.rd_session)
                wx.setStorageSync("authed", ress.authed)
                wx.setStorageSync('member_id', ress.member_id)
              }
            })
          } else {
            console.log('登录失败！' + res.errMsg)
          }
        }
      })
    } else {
      // 检查登录态是否过期
      wx.checkSession({
        success() {
          //session_key 未过期
        },
        fail() {
          // session_key 已经失效，需要重新登录
          wx.login({
            success: (res) => {
              if (res.code) {
                this.ajax(api.auto_login, {
                  code: res.code,
                }, (ress, err) => {
                  console.log(ress)
                  if (ress.result == 'success') {
                    wx.setStorageSync("rd_session", ress.rd_session)
                    wx.setStorageSync("authed", ress.authed)
                    wx.setStorageSync('member_id', ress.member_id)
                  }
                })
              } else {
                console.log('登录失败！' + res.errMsg)
              }
            }
          })
        }
      })
    }
  },
  //检测认证状态
  check_logined: function (para) {
    var self = this;
    var rd_session = wx.getStorageSync('rd_session');
    var authed = wx.getStorageSync('authed');
    if (!rd_session) {
      typeof para.fail === 'function' && para.fail();
    } else {
      this.check_rdsession({
        success: () => {
          if (authed == true) {
            typeof para.success === 'function' && para.success();
          } else {
            wx.navigateTo({
              url: '/pages/register/register',
            })
          }
        },
        fail: () => {
          typeof para.fail === 'function' && para.fail();
        }
      })

    }
  },
  //检测登录状态
  check_rdsession: function (para) {
    var rd_session = wx.getStorageSync('rd_session');
    this.ajax(api.check_login, {
      rd_session: rd_session
    }, (res) => {
      if (res.message == 'offline') {
        wx.clearStorageSync();
        wx.removeStorageSync("rd_session");
        typeof para.fail === 'function' && para.fail();
      } else {
        typeof para.success === 'function' && para.success();
      }
    })
  },

  //网络请求核心函数
  ajax: function () {
    var that = this;
    //加密执行
    if (secret) {
      var e = {},
        t = 1e4;
      switch (arguments.length) {
        //一个参数
        case 1:
          var n = arguments[0];
          n.url = config.system_status == 'online' ? config.ONLINE_URL + n.url : config.DEV_URL + n.url
          typeof n == "object" && wx.request({
            url: n.url,
            method: n.method,
            header: {
              "content-type": "application/json"
            },
            success: n.success,
            fail: n.error,
            complete: n.complete
          });
          break;
        //3个参数
        case 3:
          //接口地址
          var n = arguments[0];
          n = config.system_status == 'online' ? config.ONLINE_URL + n : config.DEV_URL + n
          //数据
          var d = arguments[1];
          //回调函数
          var r = arguments[2];
          //错误回调
          var callback_error = arguments[3];
          //数据为空的时候使用GET方式访问url, 数据不为空的时候使用POST方式访问url
          typeof n == "string" && typeof r == "function" && encrypt.isNull(d) ? wx.request({
            url: n,
            method: "POST",
            header: {
              "content-type": "application/json"
            },
            success: r,
            fail: n.error,
            complete: n.complete
          }) : typeof d == "object" && typeof r == "function" && (
            wx.showLoading({
              title: "加载中"
            }),
            //config.secret_debug ? console.log(d) : '',
            wx.request({
              url: n,
              method: "POST",
              data: encrypt.isNull(encrypt.Encrypt(d)) ? "" : encrypt.Encrypt(JSON.stringify(d)),
              header: {
                "content-type": "application/json"
              },
              success: function (e) {
                // config.secret_debug ? console.log(e) : '';
                wx.hideLoading();
                var ajax_r = encrypt.Decrypt(e.data);
                if (config.secret_debug) {
                  console.log(n + '返回数据为：')
                  console.log(ajax_r)
                }
                if (ajax_r.result == 'success') {
                  r(encrypt.Decrypt(e.data))
                } else {
                  wx.hideLoading();
                  switch (ajax_r.message) {
                    case 'login':
                      wx.navigateTo({
                        url: '/pages/login/login',
                      })
                      break;
                    default:
                      wx.showModal({
                        title: '提醒',
                        content: ajax_r.message,
                      })
                      typeof callback_error === 'function' && callback_error(encrypt.Decrypt(e.data));
                  }
                }
              },
              fail: function (e) {
                console.error("错误信息:", e)
              },
              complete: d.complete
            }));
      }
    } else {
      //不加密
      var url = arguments[0];
      url = config.system_status == 'online' ? config.ONLINE_URL + url : config.DEV_URL + url
      var datapost = arguments[1];
      var callback = arguments[2];
      var callback_error = arguments[3];
      var method = "POST";
      var header = {
        'content-type': 'application/json'
      };
      wx.showLoading({
        title: "加载中"
      }),
        //获取数据
        wx.request({
          url: url,
          method: method,
          data: datapost,
          header: header,
          success: function (res) {
            wx.hideLoading();
            if (res.data.result == 'success') {
              wx.hideLoading();
              callback(res.data);
            } else {
              switch (res.data.message) {
                case 'login':
                  wx.navigateTo({
                    url: '/pages/login/login',
                  })
                  break;
                default:
                  wx.showModal({
                    title: '提醒',
                    content: res.data.message,
                  })
                  typeof callback_error === 'function' && callback_error(res.data);
              }

            }
          }
        });
    }
  },
  globalData: {}
})