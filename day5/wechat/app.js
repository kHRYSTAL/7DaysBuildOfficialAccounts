'use strict'
// 设置为严格模式

//npm install koa sha1

//node --harmony app.js
var path = require('path')
var util = require('./libs/util')
// 加密模块
var sha1 = require('sha1')
var wechat = require('./wechat/g')
var wechat_file = path.join(__dirname,'./config/wechat.txt')
var config = require('./config')
var reply = require('./wx/reply')

var Koa = require('koa')


var app = new Koa()

// function * mean generator
// 内部包含 yield 在koa中会最终使用co & promise
// 用同步代码实现异步操作
app.use(wechat(config.wechat, reply.reply))

app.listen(1234)
console.log('Listening :1234')
