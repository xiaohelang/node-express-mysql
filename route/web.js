const express = require('express')

const mysql = require('mysql')

module.exports = function () {
    var router = express.Router()
//
    router.get('/', function (req, res) {
        res.send('我是web页面').end();
    })

    return router
}