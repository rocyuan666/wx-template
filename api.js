//api文件
var config = require('./config.js');
module.exports = {
  /*******************************核心接口区域请勿删除***************************************/
  //登录
  wxlogin: "rocyuan",
  //支付未支付订单
  pay_order: "",
  //检测登录状态
  check_login: "",
  //检测短信验证码
  check_verify: "",
  //发送短信
  send_sms: "",
  //一键获取用户手机号码
  decode_phone: "",
  /***************************************自定义接口区***************************************/

}






// app.json不能注释，需要tabbar
/* 

"tabBar": {
    "backgroundColor": "#79d397",
    "borderStyle": "white",
    "color": "#fff",
    "selectedColor": "#ffea49",
    "list": [
      {
        "pagePath": "pages/home/home",
        "text": "首页",
        "iconPath": "assets/img/home.png",
        "selectedIconPath": "assets/img/home-active.png"
      },
      {
        "pagePath": "pages/search/search",
        "text": "搜索",
        "iconPath": "assets/img/search.png",
        "selectedIconPath": "assets/img/search-active.png"
      }
    ]
  },

*/