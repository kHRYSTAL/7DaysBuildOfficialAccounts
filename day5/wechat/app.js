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

var ejs = require('ejs')
var heredoc = require('heredoc')

var fs = require('fs')

var tpl = heredoc(function() {/*
  <!DOCTYPE html>
  <html>
    <head>
      <title>猜电影</title>
      <meta name="viewport" content="initial-scale=1, maximum-scale=1,minimum-scale=1">
    </head>
    <body>
      <h1>点击标题,开始录音翻译</h1>
      <p id="title"></p>
      <div id="poster"></div>
      <script src="http://zeptojs.com/zepto-docs.min.js"></script>
      <script src="http://res.wx.qq.com/open/js/jweixin-1.0.0.js"></script>
    </body>
  </html>
*/})

app.use(function *(next) {
  if (this.url.indexOf('/movie') > -1) {
    this.body = ejs.render(tpl, {})
    return next
  }
  else if (this.url.indexOf('/getImage') > -1) {
    var source = fs.readFileSync('6.mp4')
    this.body = source
    return next
  }
  yield next
})


// function * mean generator
// 内部包含 yield 在koa中会最终使用co & promise
// 用同步代码实现异步操作
app.use(wechat(config.wechat, reply.reply))

app.listen(1234)
console.log('Listening :1234')
