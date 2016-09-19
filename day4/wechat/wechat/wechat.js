'use strict '
var prefix = 'https://api.weixin.qq.com/cgi-bin/'
var api = {
  access_token: prefix +
    'token?grant_type=client_credential'

}
var Promise = require('bluebird')
// promise化request 支持异步方法同步操作
var request = Promise.promisify(require('request'))
var util = require('./util')

// new做了三件事：
//
// var instance = {};
// instance.__proto__ = ShowUsers.prototype;
// ShowUsers.call(obj);

function Wechat(opts) {
  var that = this
  this.appID = opts.appID
  this.appSecret = opts.appSecret
  this.getAccessToken = opts.getAccessToken
  this.saveAccessToken = opts.saveAccessToken

  this.getAccessToken()
    .then(function(data) {
      try {
        data = JSON.parse(data)
      }
      catch(e) { // 如果不合法 需要更新data
        return that.updateAccessToken()
      }
// 如果合法有效 需要向下传递data 进行静态存储或序列化存储
      if (that.isValidAccessToken(data)) {
        return Promise.resolve(data)
      }
      else { // 如果不合法 需要更新data
        return that.updateAccessToken()
      }
    }).then(function(data) {
      that.access_token = data.access_token
      // 有效期 过期时间
      that.expires_in = data.expires_in

      // 存储
      that.saveAccessToken(data)
    })
}

Wechat.prototype.isValidAccessToken = function(data) {
  if (!data || !data.access_token || !data.expires_in) {
    return false
  }

  var access_token = data.access_token
  var expires_in = data.expires_in
  var now = (new Date().getTime())

  if (now < expires_in) {
    return true
  }
  else {
    return false
  }
}

Wechat.prototype.updateAccessToken = function() {
  var appID = this.appID
  var appSecret = this.appSecret
  var url = api.access_token + '&appid=' + appID + '&secret='
    + appSecret

  return new Promise(function(resolve, reject) {
    request({url: url, json: true}).then(function (response) {

      var data = response.body
      console.log(data);
      var now = (new Date().getTime())
      var expires_in = now + (data.expires_in - 20) * 1000

      data.expires_in = expires_in
      resolve(data)

    })
  })
}

Wechat.prototype.reply = function() {
  //由于koa上下文调用call 这里的this 实际为koa上下文对象
  //实际上这个代码块表示koa上下文去执行
  var content = this.body
  var message = this.weixin
  var xml = util.tpl(content, message)
  this.status = 200;
  this.type = 'application/xml'
  this.body = xml
}

module.exports = Wechat
