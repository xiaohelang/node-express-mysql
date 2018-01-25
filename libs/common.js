const crypto = require('crypto')

module.exports = {
    MD5_SUFFIX: 'kjsdkjkdsjkshdiweiohriew大树啊哈哈kfjisdj',
    md5: function (str) {
       var obj = crypto.createHash('md5')
       obj.update(str)
       return obj.digest('hex')
    }
}