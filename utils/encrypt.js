//加解密类库
var config = require('../config.js'), cj = require("./CryptoJS-AES.js"), keyval = config.ASEkey, ivval = config.ASEIv,
  key = cj.CryptoJS.enc.Utf8.parse(keyval), iv = cj.CryptoJS.enc.Utf8.parse(ivval);
function Encrypt(e) {
  var t = cj.CryptoJS.enc.Utf8.parse(e),
    n = cj.CryptoJS.AES.encrypt(t, key, { iv: iv, mode: cj.CryptoJS.mode.CBC, padding: cj.CryptoJS.pad.Pkcs7 }),
    r = cj.CryptoJS.enc.Base64.stringify(n.ciphertext);
  return r;
  //return stringToHex(r)
}

function Decrypt(e) {
  // var t = hexToString(e),
  var t = e,
    n = cj.CryptoJS.AES.decrypt(t, key, { iv: iv, mode: cj.CryptoJS.mode.CBC, padding: cj.CryptoJS.pad.Pkcs7 }),
    r = JSON.parse(n.toString(cj.CryptoJS.enc.Utf8));
  if (r.result == 'success') {
    return r;
  } else {
    return r;
    wx.showModal({
      title: '提示',
      content: r.message,
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定')
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  }

}
function stringToHex(e) {
  if (e === "") return "";
  var t = [];
  for (var n = 0; n < e.length; n++) t.push(e.charCodeAt(n).toString(16));
  return t.join("")
}
function hexToString(e) {
  var t = e.trim(), n = t, r = n.length;
  if (r % 2 !== 0) return wx.showToast({ title: "Illegal Format ASCII Code!" }), "";
  var i, s = [];
  for (var o = 0; o < r; o += 2) i = parseInt(n.substr(o, 2), 16), s.push(String.fromCharCode(i));
  return s.join("")
}
function merge() {
  if (arguments.length > 0) {
    var e = arguments[0];
    for (var t = 1; t < arguments.length; t++) {
      var n = arguments[t];
      for (var r in n) n[r] != undefined && (e[r] = n[r])
    }
    return e
  }
  return undefined
}
function isNull(e) {
  return e == undefined || e == "undefined" || e == null || e == ""
}
function parseJSON(e) {
  try {
    return JSON.parse(e)
  } catch (t) {
    return undefined
  }
}

module.exports = {
  Encrypt: Encrypt,
  Decrypt: Decrypt,
  stringToHex: stringToHex,
  hexToString: hexToString,
  merge: merge,
  isNull: isNull,
  parseJSON: parseJSON
};