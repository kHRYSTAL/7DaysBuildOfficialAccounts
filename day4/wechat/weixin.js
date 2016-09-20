'use strict'

// handler 生成器 处理回复消息对象
// generator 生成的对象存在一个 next 函数，
// 程序执行到yield停止
// 调用 next 会返回 yield运算的结果对象，然后继续执行 ［co］
// 执行到下一个yield处停止。
// 代表handler
// 因为是 生成器 为保证koa执行 需要用yield 压入栈中
exports.reply = function* (next) {
  var message = this.weixin
  // 事件推送
  if (message.MsgType === 'event') {
    // 订阅
    if (message.Event === 'subscribe') {
      if (message.EventKey) {
        console.log('扫描二维码进入：' + message.EventKey + ' '
          + message.ticket);
      }
      console.log('subscribe')
      this.body = '哈哈,你订阅了这个号\r\n' + '消息ID:' + message.MsgId
    }
    else if (message.Event === 'unsubscribe') {
      console.log('无情取关');
      this.body = ''
    }
    else if (message.Event === 'LOCATION') {
      this.body = '您上报的位置是:' + message.Latitute + '/' +
        message.Longitude + '-' + message.Precision
    }
    // 点击菜单
    else if (message.Event === 'CLICK') {
      this.body = '您点击了菜单：' + message.EventKey
    }

    else if (message.Event === 'SCAN') {
      console.log('关注后扫二维码' + message.EventKey + ' ' +
        message.Ticket)
      this.body = '看到你扫了一下哦'
    }
    // 点击了链接视图等 注意 菜单中的子菜单不会上报
    else if (message.Event === 'VIEW') {
      this.body = '您点击了菜单中的链接：' + message.EventKey
    }
  }
    else if (message.MsgType === 'text') {
      var content = message.Content
      var reply = '额，你说的' + message.Content + ' 太复杂了'

      if (content === '1') {
        reply = '天下第一吃大米'
      }
      else if (content === '2') {
        reply = '天下第二吃豆腐'
      }
      else if (content === '3') {
        reply = '天下第三吃仙丹'
      }
      else if (content === '4') {
        reply = [{
          title: '技术改变世界',
          description: '只是个描述而以',
          picUrl: 'http://ww2.sinaimg.cn/large/7853084cjw1f80kwjn8fjj21c60xb0ym.jpg',
          url:'https://github.com/'
        },{
          title: 'Nodejs开发微信',
          description: '这也是个描述',
          picUrl: 'http://ww2.sinaimg.cn/large/72f96cbajw1f7yv45wiksg20cz0l9wld.gif',
          url: 'https://nodejs.org'
        }]
      }

      this.body = reply
  }
  yield next
}