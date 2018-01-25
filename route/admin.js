const express = require('express')
const common=require('../libs/common');
const mysql = require('mysql')

var db = mysql.createPool(({
    host:'localhost',
    user: 'root',
    password: '123456',
    database: 'dashudata'
}))

module.exports = function () {
    var router = express.Router()
    // 检查登录状态
    router.use( function (req, res, next) {
        if (!req.session['admin_id'] && req.url !== '/login') {
            res.redirect('/admin/login')
        } else {
            next()
        }
    });

    router.get('/login', function (req, res) {
        res.render('admin/login.ejs', {})
    })
    router.post('/login', function (req, res) {
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

    router.get('/', function(req, res){
        res.render('admin/index.ejs', {});
    });

    router.get('/banners', function(req, res){
        switch (req.query.act) {
            case 'mod':
                console.log("修改")
                db.query(`SELECT * FROM banner_table WHERE id=${req.query.id}`, function (err, data) {
                    if (err) {
                        res.status(500).send('baseData err').end()
                    } else if (data.length === 0){
                        res.status(404).send('data not found').end();
                    } else {
                        db.query('SELECT * FROM banner_table', function(err, banners){
                            if(err){
                                console.error(err);
                                res.status(500).send('database error').end();
                            }else{
                                res.render('admin/banners.ejs', {banners: banners, mod_data: data[0]});
                            }
                        });
                    }
                })
                break;
            case 'del':
                db.query(`DELETE FROM banner_table WHERE id='${req.query.id}'`, function (err, data) {
                    if (err) {
                        res.status(500).send('baseData err').end()
                    } else {
                        res.redirect('/admin/banners')
                    }
                })
                break;
            default:
                db.query('SELECT * FROM banner_table', function (err, banners) {
                    if (err) {
                        res.status(500).send('baseData err').end()
                    } else {
                        res.render('admin/banners.ejs', {banners: banners});
                    }
                })
                break;
        }
    });
    router.post('/banners', function(req, res){
        console.log(req.body)
        var description = req.body.description
        var title = req.body.title
        var href = req.body.href

        if (!description || !title ||!href) {
            res.status(400).send('arg error').end();
        }else {
            if (req.body.mod_id) {
                db.query(`UPDATE banner_table SET title='${req.body.title}', description='${req.body.description}',href='${req.body.href}' WHERE ID=${req.body.mod_id}`, function (err, data) {
                    if (err) {
                        res.status(500).send("data base err").end()
                    } else {
                        res.redirect('/admin/banners');
                    }
                })
            } else{
                db.query(`INSERT INTO banner_table (title, description, href) VALUES ('${title}','${description}','${href}' )`, function (err, data) {
                    if (err) {
                        res.status(400).send('baseData err').end()
                    } else {
                        // db.query('SELECT * FROM banner_table', function (err, banners) {
                        //     if (err) {
                        //         res.status(500).send('baseData err').end()
                        //     } else {
                        //         res.render('admin/banners.ejs', {banners: banners});
                        //     }
                        // })
                        res.redirect('/admin/banners')
                    }
                })
            }
        }
    });

    return router
}