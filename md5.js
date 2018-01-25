const common=require('./libs/common');

var str='1';
var str=common.md5(str + common.MD5_SUFFIX);

console.log(str);