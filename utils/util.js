var config = require('../config.js');

var system_type = config.system_type;

//解析JSON字符串
function parse_json(e) {
  try {
    return JSON.parse(e)
  } catch (t) {
    return undefined
  }
}

/**
 * 时间戳格式化时间
 * 使用示例：
 * const dateNum = 1232654521122
 * const date = new Date(dateNum)
 * console.log(formatDate(date, ‘yyyy/MM/dd hh:mm:sss’))
 */
function formatDate(date, fmt) {
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
  }
  let o = {
    'M+': date.getMonth() + 1,
    'd+': date.getDate(),
    'h+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds()
  };
  for (let k in o) {
    if (new RegExp(`(${k})`).test(fmt)) {
      let str = o[k] + '';
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : padLeftZero(str));
    }
  }
  return fmt;
};
function padLeftZero (str) {
  return ('00' + str).substr(str.length);
};





module.exports = {
  parse_json: parse_json,
  formatDate: formatDate
};