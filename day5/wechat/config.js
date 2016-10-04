'use strict'
var path = require('path')

var util = require('./libs/util')
// 加密模块
var sha1 = require('sha1')
var wechat = require('./wechat/g')
var wechat_file = path.join(__dirname, './config/wechat.txt')
var wechat_ticket_file = path.join(__dirname, './config/wechat_ticket.txt')

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
    },

    getTicket: function() {
      return util.readFileAsync(wechat_ticket_file)
    },
    saveTicket: function(data) {
      data = JSON.stringify(data)
      return util.writeFileAsync(wechat_ticket_file, data)
    }
  }
}

module.exports = config
