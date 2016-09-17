// generator, this file is a middleware
'use strict'

// 加密模块
var sha1 = require('sha1')
var Wechat = require('./wechat')
var getRawBody = require('raw-body')
var util = require('./util')


module.exports = function(opts) {
  var wechat = new Wechat(opts)

  return function *(next) {
    var that = this
    // console.log(this.query)
    var token = opts.token
    var signature = this.query.signature
    var nonce = this.query.nonce
    var timestamp = this.query.timestamp
    var echostr = this.query.echostr

    var str = [token, timestamp, nonce].sort().join('')
    var sha = sha1(str)

    if (this.method === 'GET') {
      if (sha === signature) {
        this.body = echostr + ''
      } else {
        this.body = 'wrong'
      }
    }
    // POST 为关注 语音 文字聊天等操作 当用户对公众号进行上述操作
    // 微信服务器会向本地服务器发送post请求
    // 微信文档说明了微信服务器向本地服务器传送的req为xml数据包
    // 因此需要对请求进行xml封装和解析
    else if (this.method === 'POST') {
      // 需要进行判断 防止非微信服务器向本地服务器请求（暂时）
      if (sha !== signature) {
        this.body = 'wrong'
        return false
      }
// 需要yield关键字 因为raw-body模块是一个生成器 不能直接获取数据
// yield 方便于协程、同步调用防止耗时等操作
// 如果有消息，就把消息取出。在执行耗时操作较长时 把主线程交给其他函数调用
      var data = yield getRawBody(this.req, {
        length: this.length,
        limit: '1mb',
        encoding: this.charset
      })

      // console.log(data.toString());

      var content = yield util.parseXMLAsync(data)
      // 转换为xml格式打印
      // console.log(content);

      // value类型xml里为数组 需要修改
      //将xml格式转换为实际对象（格式化）打印
      // watch 76
      console.log(content)
      var message = util.formatMessage(content.xml)
      console.log(message)

      //

      if (message.MsgType === 'event') {
        if (message.Event === 'subscribe') {
          var now = new Date().getTime()
          that.status = 200
          that.type = 'application/xml'
          that.body = '<xml>' +
                      '<ToUserName><![CDATA[' + message.FromUserName + ']]></ToUserName>' +
                      '<FromUserName><![CDATA[' + message.ToUserName + ']]></FromUserName>' +
                      '<CreateTime>'+ now +'</CreateTime>' +
                      '<MsgType><![CDATA[text]]></MsgType>' +
                      '<Content><![CDATA[receive your subscribe request, this is response from nodejs server]]></Content>' +
                      '</xml>'
          return true
        }
      }

    }


/**
通过raw－body模块 可以把this上的request对象 其实也就是http
模块中的request对象 拼装成buffer类型的xml数据
*/

/**
{ xml:
   { ToUserName: [ 'gh_2e31c709a288' ],
     FromUserName: [ 'onlqLxKYRrMQ4bgaKOmZ1EZEEtZs' ],
     CreateTime: [ '1474109037' ],
     MsgType: [ 'text' ],
     Content: [ '55555' ],
     MsgId: [ '6331250105073405436' ] } }
{ ToUserName: 'gh_2e31c709a288',
  FromUserName: 'onlqLxKYRrMQ4bgaKOmZ1EZEEtZs',
  CreateTime: '1474109037',
  MsgType: 'text',
  Content: '55555',
  MsgId: '6331250105073405436' }
*/

  }
}
