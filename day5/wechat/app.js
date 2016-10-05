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
var Wechat = require('./wechat/wechat')

var Koa = require('koa')
var app = new Koa()
var ejs = require('ejs')
var crypto = require('crypto')
var heredoc = require('heredoc')

var fs = require('fs')

var tpl = heredoc(function() {/*
  <!DOCTYPE html>
  <html>
    <head>
      <title>搜电影</title>
      <meta name="viewport" content="initial-scale=1, maximum-scale=1,minimum-scale=1">
    </head>
    <body>
      <h1>点击标题,开始录音翻译</h1>
      <p id="title"></p>
      <!-- 导演 -->
      <div id="doctor"></div>
      <!-- 年份 -->
      <div id="year"></div>
      <!-- 发布者 -->
      <div id="poster"></div>
      <script src="http://zeptojs.com/zepto-docs.min.js"></script>
      <script src="http://res.wx.qq.com/open/js/jweixin-1.0.0.js"></script>
      <script>
        wx.config({
          debug: true, //开启调试模式，调用的所有api的返回值会在客户端alert出来
                        //若要查看传入的参数，可以在pc端打开，参数信息会通过log打出
                        // 仅在pc端时才会打印
          appId: 'wx90888cad1a5958f0',   // 必填 公众号唯一标识
          timestamp: '<%= timestamp %>', // 必填 生成签名的时间戳
          nonceStr: '<%= noncestr %>', //必填 生成签名的随机串
          signature: '<%= signature %>', //必填， 签名 见附录1
          jsApiList: [
            'startRecord',
            'stopRecord',
            'onVoiceRecordEnd',
            'translateVoice'
          ] //必填，需要使用的js接口列表，所有的js接口列表见附录2
        })
      </script>
    </body>
  </html>
*/})

//  生成随机数
var createNonce = function() {
  return Math.random().toString(36).substr(2, 15)
}

// 生成时间戳
var createTimestamp = function() {
  return parseInt(new Date().getTime() / 1000, 10) + ''
}

var _sign = function(noncestr, ticket, timestamp, url) {
  var params = [
    'noncestr=' + noncestr,
    'jsapi_ticket=' + ticket,
    'timestamp=' + timestamp,
    'url=' + url
  ]
  // 字典排序
  var str = params.sort().join('&')
  console.log(str);
  // sha1 hash
  var shasum = crypto.createHash('sha1')
  shasum.update(str)
  return shasum.digest('hex')
}

// 签名算法
function sign(ticket, url) {
  var noncestr = createNonce()
  var timestamp = createTimestamp()
  var signature = _sign(noncestr, ticket, timestamp, url)

  return {
    noncestr: noncestr,
    timestamp: timestamp,
    signature: signature
  }
}

app.use(function *(next) {
  if (this.url.indexOf('/movie') > -1) {
    var wechatApi = new Wechat(config.wechat)

    var data = yield wechatApi.fetchAccessToken()
    var access_token = data.access_token
    var ticketData = yield wechatApi.fetchTicket(access_token)
    var ticket = ticketData.ticket
    var url = this.href
    // var url = this.href.replace(':8000', '')
    console.log(url);
    var params = sign(ticket, url)

    console.log(params);

    this.body = ejs.render(tpl, params)
    return next
  }
  // else if (this.url.indexOf('/getImage') > -1) {
  //   var source = fs.readFileSync('6.mp4')
  //   this.body = source
  //   return next
  // }
  yield next
})


// function * mean generator
// 内部包含 yield 在koa中会最终使用co & promise
// 用同步代码实现异步操作
app.use(wechat(config.wechat, reply.reply))

app.listen(1234)
console.log('Listening :1234')
