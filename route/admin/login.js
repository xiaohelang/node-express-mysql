const express = require('express')
const common=require('../../libs/common');
const mysql = require('mysql')

var db = mysql.createPool(({
    host:'localhost',
    user: 'root',
    password: '123456',
    database: 'dashudata'
}))

module.exports = function () {
    var router = express.Router()

    router.get('/', function(req, res){
        res.render('admin/login.ejs', {});
    });

    router.post('/', function (req, res) {
        console.log(req.body)
        var username = req.body.username
        var password=common.md5(req.body.password+common.MD5_SUFFIX);
        db.query(`SELECT * FROM admin_table WHERE username='${username}'`, function (err, data) {
            if (err) {
                console.error(err)
                res.status(500).send('database error').end();
            } else {
                console.log("用户数据")
                console.log(data)
                if (data.length === 0) {
                    res.status(400).send('no this  admin').end()
                } else {
                    if (data[0].password === password) {
                        req.session['admin_id'] = data[0].id
                        res.redirect('/admin/')
                    } else {
                        res.status(400).send('this password is incorrect').end();
                    }
                }
            }
        })
    })


    return router
}
