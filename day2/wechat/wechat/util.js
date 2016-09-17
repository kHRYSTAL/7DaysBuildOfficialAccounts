'use strict'

var xml2js = require('xml2js')
var Promise = require('bluebird')

exports.parseXMLAsync = function(xml) {
  return new Promise(function(resolve, reject) {
    xml2js.parseString(xml, {trim: true}, function(err, content) {

      if (err) reject(err)
      else resolve(content)
    })
  })
}

function formatMessage(result) {
  var message = {}
  if (typeof result === 'object') {
    var keys = Object.keys(result)
    // 遍历xml类型key value
    for (var i=0; i<keys.length; i++) {
      var item = result[keys[i]]
      var key = keys[i]
      // 获取的均为数组 需要进行处理
      if (!(item instanceof Array) || item.length === 0) {
        continue
      }
      // 数组长度为1 可能是一个对象或一个字符串
      if (item.length === 1) {
        var val = item[0]
        // 如果为object类型 那么继续遍历
        if (typeof val === 'object') {
          message[key] = formatMessage(val)
        }
        else {
          // 处理字符串为空的情况
          message[key] = (val || '').trim()
        }
      }
      // 数组不为1 则为数组
      else {
        message[key] = []
        for (var j=0, k = item.length; j<k; j++) {
          message[key].push(formatMessage(item[j]))
        }
      }
    }
  }
  return message
}

exports.formatMessage = formatMessage
