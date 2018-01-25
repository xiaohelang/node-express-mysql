const express = require('express')
const common=require('../../libs/common');
const mysql = require('mysql')

var db = mysql.createPool(({
    host:'localhost',
    user: 'root',
    password: '123456',
    database: 'dashudata'
}))

module.exports=function (){
    var router=express.Router();

    router.get('/get_banners', function(req, res){
        db.query('SELECT * FROM banner_table', function(err, data){
            if(err){
                console.error(err);
                res.status(500).send('database error').end();
            }else{
                res.send(data).end();
            }
        });
    });
    router.get('/get_custom_evaluations', function(req, res){
        db.query('SELECT * FROM custom_evaluation_table', function(err, data){
            if(err){
                console.error(err);
                res.status(500).send('database error').end();
            }else{
                res.send(data).end();
            }
        });
    });

    return router;
};