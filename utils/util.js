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

module.exports = {
  parse_json: parse_json
};