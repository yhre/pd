var rsa = require("../js/wx_rsa.js");
// var rsakey;
var publicKey = '-----BEGIN PUBLIC KEY-----\
MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCXTiMv4qH + 56sfu+ diO3FzrIW4\
jY5dIGU4JKntE3C1LTuUioufpFkWxI2ySEvJEXTjTrakqHMkMLFisZjL3cmVQH64\
9KSYjkhiw6DOrw5al/ MzPSbciUFXugJebi2JAl2oBiRaQ / XF8Zir80g7DimvXBIq\
  / +S + uJD + X8RwEV3 + oQIDAQAB\
-----END PUBLIC KEY-----\
'
function pubRSA(text){
  var input_rsa = text;
  if(!text){
    // console.log(1);
    var input_rsa = '加密文本';
  }
  var encStr = ""
  var encrypt_rsa = rsa.RSAKey();
  encrypt_rsa = rsa.KEYUTIL.getKey(publicKey);
  encStr = encrypt_rsa.encrypt(input_rsa);
  encStr = rsa.hex2b64(encStr);
  return encStr;
  console.log(encStr);
  // console.log("加密结果：" + encStr)
 
}
module.exports = { pubRSA: pubRSA}