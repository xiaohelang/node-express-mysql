const express=require('express');
const common=require('../../libs/common');
const mysql=require('mysql');

var db = mysql.createPool(({ host:'localhost', user: 'root', password: '123456', database: 'dashudata'}))

const pathLib = require('path');
const fs = require('fs');

module.exports = function () {
    var router = express.Router()

    router.get('/', function (req, res) {
        switch (req.query.act) {
            case 'del':
                db.query(`SELECT * FROM custom_evaluation_table WHERE ID=${req.query.id}`, function (err, data) {
                    if (err) {
                        console.error(err)
                        res.status(500).send('baseData error').end()
                    } else {
                        if(data.length === 0){
                            res.status(404).send('no this custom evaluation').end();
                        }else{
                            fs.unlink('static/upload/'+data[0].src, function (err) {
                                if(err){
                                    console.error(err);
                                    res.status(500).send('file opration error').end();
                                }else{
                                    db.query(`DELETE FROM custom_evaluation_table WHERE id=${req.query.id}`, function (err, data){
                                        if(err){
                                            console.error(err);
                                            res.status(500).send('database error').end();
                                        }else{
                                            res.redirect('/admin/custom');
                                        }
                                    });
                                }
                            })
                        }
                    }
                })
                break;
            case 'mod':
                db.query(`SELECT * FROM custom_evaluation_table WHERE id=${req.query.id}`, function(err, data){
                    if(err){
                        console.error(err);
                        res.status(500).send('database error').end();
                    }else if(data.length==0){
                        res.status(404).send('no this evaluation').end();
                    }else{
                        db.query(`SELECT * FROM custom_evaluation_table`, (err, valueData)=>{
                            if(err){
                                console.error(err);
                                req.status(500).send('database error').end();
                            }else{
                                res.render('admin/custom.ejs', {valueData, mod_data: data[0]});
                            }
                        });
                    }
                });
                break;
            default:
                db.query('SELECT * FROM custom_evaluation_table', function (err, valueData) {
                    if (err) {
                        console.error(err)
                        req.status(500).send('database error').end();
                    }  else {
                        console.log(valueData)
                        res.render('admin/custom.ejs', {valueData: valueData});
                    }
                })
                break;
        }


    })

    router.post('/', function (req, res) {
        var title=req.body.title;
        var description=req.body.description;

        if (req.files[0]) {
            var ext=pathLib.parse(req.files[0].originalname).ext;

            var oldPath=req.files[0].path;
            var newPath=req.files[0].path+ext;

            var newFileName=req.files[0].filename+ext;
        } else {
            var newFileName=null;
        }

        if (newFileName) {
            fs.rename(oldPath, newPath, function (err) {
                if (err) {
                    console.error(err)
                    res.status(500).send('file opration error').end();
                } else {
                    if (req.body.mod_id) {  // 修改
                        db.query(`SELECT * FROM custom_evaluation_table WHERE id=${req.body.mod_id}`, function (err, data) {
                            if (err) {
                                console.error(err)
                                res.status(500).send('database error').end();
                            } else if (data.length == 0) {
                                res.status(404).send('old file not found').end();
                            }else {
                                fs.unlink('static/upload/'+data[0].src, function (err) {
                                    if (err) {
                                        console.error(err)
                                        res.status(500).send('file opration error').end();
                                    } else {
                                        db.query(`UPDATE custom_evaluation_table SET title='${title}', description='${description}', src='${newFileName}' WHERE id=${req.body.mod_id} `, function (err) {
                                            if(err){
                                                console.error(err);
                                                res.status(500).send('database error').end();
                                            }else{
                                                res.redirect('/admin/custom');
                                            }
                                        })
                                    }

                                })
                                // res.redirect('/admin/custom')
                            }
                        })
                    } else{  // 添加
                        db.query(`INSERT INTO custom_evaluation_table \
                    (title, description, src)\
                    VALUES('${title}', '${description}', '${newFileName}')`, function (err, data) {
                            if (err) {
                                res.status(500). send(' baseData err').end()
                            } else {
                                res.redirect('/admin/custom')
                            }
                        })
                    }

                    console.log('成功了')
                }
            })
        } else {
            if (req.body.mod_id) { //修改
                //直接改
                db.query(`UPDATE custom_evaluation_table SET \
          title='${title}', description='${description}' \
          WHERE id=${req.body.mod_id}`, function(err){
                    if(err){
                        console.error(err);
                        res.status(500).send('database error').end();
                    }else{
                        res.redirect('/admin/custom');
                    }
                });
            } else {//添加
                db.query(`INSERT INTO custom_evaluation_table \
                    (title, description, src)\
                    VALUES('${title}', '${description}', '${newFileName}')`, function (err, data) {
                    if (err) {
                        res.status(500). send(' baseData err').end()
                    } else {
                        res.redirect('/admin/custom')
                    }
                })
            }
        }
    })

    return router
}
