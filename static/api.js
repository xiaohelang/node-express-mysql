
var ERR_Ok = 0

// var baseUrl = 'https://bshop-t.wxsapp.com'

var baseUrl = ''

/*1. 用户个人信息*/
var bannersStr = '/get_banners'
var valueStr = '/get_custom_evaluations'


/* 封装axios请求 */
function getAxios(reqStr, params,success, error) {
    axios.post(reqStr, params, {
        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
    }).then(function (res) {
        // console.log(res);
        if (res.data !== undefined) {
            // var res = JSON.parse(res.data)
            success && success(res.data)
        } else {
            success && success(res)
        }
    })
        .catch(function (err) {
            console.log('api-err')
            console.log(err);
            error && error(error)
        });
}
/* 封装Ajax请求 */
function getAjax (urlStr, params, successFn, errorFn) {
    $.ajax({
        url: urlStr,
        type: "GET",
        data: params,
        success: function (res) {
            var resultJson = JSON.parse(res)
            successFn && successFn(resultJson)
        },
        error: function (err) {
            // var err = JSON.parse(err)
            console.log('err错误')
            console.log(err)
            errorFn && errorFn(err)
//                                errorFn && errorFn()
        }
    })
}

/* 封装Ajax请求同步请求 */
function getAjaxAsync (urlStr, params, successFn, errorFn) {
    $.ajax({
        async: false,
        url: urlStr,
        type: "POST",
        data: params,
        success: function (res) {
            var resultJson = JSON.parse(res)
            successFn && successFn(resultJson)
        },
        error: function (err) {
            // var err = JSON.parse(err)
            console.log('err错误')
            console.log(err)
            errorFn && errorFn(err)
//                                errorFn && errorFn()
        }
    })
}


/*1. 用户个人信息*/
function getBannersStr(params, successFn, errorFn) {
    getAjax(bannersStr, params, function (res) {
        successFn &&successFn(res)
    }, function (err) {
        errorFn && errorFn(err)
    })
}
