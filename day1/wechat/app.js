'use strict'
// 设置为严格模式

//npm install koa sha1

//node --harmony app.js

var Koa = require('koa')
// 加密模块
var sha1 = require('sha1')

// input by yourself
var config = {
  wechat:{
    appID: "wx90888cad1a5958f0",
    appSecret: "b696325378a15d664b663632ddf365c0",
    token: "asasas"
  }
}

var app = new Koa()
// function * mean generator
app.use(function *(next) {
  console.log(this.query)
  var token = config.wechat.token
  var signature = this.query.signature
  var nonce = this.query.nonce
  var timestamp = this.query.timestamp
  var echostr = this.query.echostr

  var str = [token, timestamp, nonce].sort().join('')
  var sha = sha1(str)
  console.log(sha)

  if (sha == signature) {
    this.body = echostr
  } else {
    this.body = 'wrong'
  }
})

app.listen(1234)
console.log('Listening :1234')
