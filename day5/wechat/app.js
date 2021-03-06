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
      <title>搜电影－测试号</title>
      <meta name="viewport" content="initial-scale=1, maximum-scale=1,minimum-scale=1">
    </head>
    <body>
      <h1>点击标题,开始搜索</h1>
      <p id="title"></p>
      <!-- 导演 -->
      <div id="director"></div>
      <!-- 年份 -->
      <div id="year"></div>
      <!-- 海报 -->
      <div id="poster"></div>
      <script src="http://zeptojs.com/zepto-docs.min.js"></script>
      <script src="http://res.wx.qq.com/open/js/jweixin-1.0.0.js"></script>
      <script>
// 配置 start
        wx.config({
          debug: false, //开启调试模式，调用的所有api的返回值会在客户端alert出来
                        //若要查看传入的参数，可以在pc端打开，参数信息会通过log打出
                        // 仅在pc端时才会打印
          appId: 'wx90888cad1a5958f0',   // 必填 公众号唯一标识
          timestamp: '<%= timestamp %>', // 必填 生成签名的时间戳
          nonceStr: '<%= noncestr %>', //必填 生成签名的随机串
          signature: '<%= signature %>', //必填， 签名 见附录1
          jsApiList: [
            'onMenuShareAppMessage',
            'onMenuShareTimeline',
            'onMenuShareQQ',
            'onMenuSharWeibo',
            'onMenuShareQZone',
            'previewImage',
            'startRecord',
            'stopRecord',
            'onVoiceRecordEnd',
            'translateVoice'
          ] //必填，需要使用的js接口列表，所有的js接口列表见附录2
        })
// 配置 end
// 配置成功后操作 start
        wx.ready(function() {
// 检查权限 start
          wx.checkJsApi({
            jsApiList: ['onVoiceRecordEnd'],
            //需要检测的js接口列表，所有js接口列表见附录2，
            success: function(res) {
              console.log(res)
              // 以键值对的形式返回，可用的api值true，不可用为false
              // 如：{'checkResult': {'chooseImage': true},'errMsg': 'checkJsApi:ok'}
            }
          })
          // config信息验证后会执行ready方法，所有接口调用都必须在config接口
          // 获得结果之后，config是一个客户端的异步操作，所以如果需要在页面加载时就调用
          // 相关接口，则需要吧相关接口放在ready函数中调用来确保正确执行。对于用户触发
          // 时才调用的接口，则可以直接调用，不需要放在ready函数中
// 检查权限 end
// 分享初始化 start : 注意 分享文案需要进行企业认证 未进行企业认证 只能分享默认文案, (title)
          // 初始化操作
          var shareContent = {
            title: '搜啊搜-测试号',
            desc: '我搜出来了啥',
            link: 'http://baladuu.com',
            imgUrl: 'http://baladuu.com/images/avatar.png',
            type: 'link',
            success: function() {
              // 用户确认分享后执行的回调函数
              window.alert('分享成功')
            },
            cancel: function() {
              // 用户取消分享后执行的回调函数
              window.alert('分享失败')
            }
          }
          wx.onMenuShareAppMessage(shareContent)


// 分享初始化 end
// 预览初始化 start
          var slides
          $('#poster').on('tap', function() {
              wx.previewImage(slides)
                // current: '', //当前显示图片的http链接
                // urls: [] // 需要预览的图片http链接列表
                slides

          })
// 预览初始化 end


// 语音搜索 start
          var isRecording = false

          $('h1').on('tap', function() {
            if(!isRecording) {
              isRecording = true
              wx.startRecord({
                cancel: function() {
                  window.alert('那就不能搜了哦')
                }
              })
              return
            }

            isRecording = false
            wx.stopRecord({
              success: function(res) {
                var localId = res.localId

                wx.translateVoice({
                  localId: localId, //需要识别音频的本地id，由录音相关接口获得
                  isShowProgressTips: 1, //默认为1，显示进度提示
                  success: function(res) {
                    // window.alert(res.translateResult) //语音识别的结果
                    var result = res.translateResult
                    $.ajax({
                      type: 'get',
                      url: 'https://api.douban.com/v2/movie/search?q=' + result,
                      dataType: 'jsonp',
                      jsonp: 'callback',
                      success: function(data) {
                        var subject = data.subjects[0]
                        $('#title').html(subject.title)
                        $('#year').html(subject.year)
                        $('#director').html(subject.directors[0].name)
                        $('#poster').html('<img src="' + subject.images.large + '" />')

                        shareContent = {
                          title: subject.title + '-测试号',
                          desc: '我搜出来了 ' + subject.title,
                          link: 'http://baladuu.com',
                          imgUrl: subject.images.large,
                          type: 'link',
                          dataUrl: '',
                          success: function() {
                            // 用户确认分享后执行的回调函数
                            window.alert('分享成功')
                          },
                          cancel: function() {
                            // 用户取消分享后执行的回调函数
                            window.alert('分享失败')
                          }
                        }

  //  预览大图更新操作 start
                        slides = {
                          current: subject.images.large,
                          urls: [subject.images.large]
                        }
                        data.subjects.forEach(function(item) {
                          slides.urls.push(item.images.large)
                        })
  // 预览大图更新操作 end
                        wx.onMenuShareAppMessage(shareContent)
                      }
                    })
                  }
                })
              }
            })
          })

      })
// 语音搜索 end
// 配置成功后操作 end


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
