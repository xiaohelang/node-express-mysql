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
    router.post('/', function(req, res){
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