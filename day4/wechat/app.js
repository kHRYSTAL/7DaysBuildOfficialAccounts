'use strict'
// 设置为严格模式

//npm install koa sha1

//node --harmony app.js

var Koa = require('koa')
var path = require('path')

var util = require('./libs/util')
// 加密模块
var sha1 = require('sha1')
var wechat = require('./wechat/g')
var wechat_file = path.join(__dirname,'./config/wechat.txt')

// input by yourself
var config = {
  wechat : {
    appID: "wx90888cad1a5958f0",
    appSecret: "8f0b66b3607c97b6f2b5f5f4484ff441",
    token: "asasas",
    getAccessToken: function() {
      return util.readFileAsync(wechat_file)
    },
    saveAccessToken: function(data) {
      data = JSON.stringify(data)
      return util.writeFileAsync(wechat_file, data)
    }
  }
}

var app = new Koa()

// function * mean generator
// 内部包含 yield 在koa中会最终使用co & promise
// 用同步代码实现异步操作
app.use(wechat(config.wechat))

app.listen(1234)
console.log('Listening :1234')
