'use strict'


var config = require('./config')
var Wechat = require('./wechat/wechat')

var wechatApi = new Wechat(config.wechat)
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
      // 回复5发送图片
      else if (content === '5') {
        var data = yield wechatApi.uploadMaterial('image', __dirname +
          '/2.jpg')

        reply = {
          type: 'image',
          mediaId: data.media_id
        }
      }
      // 回复6发送视频
      else if (content === '6') {
        var data = yield wechatApi.uploadMaterial('video', __dirname +
          '/6.mp4')

        reply = {
          type: 'video',
          title: '回复视频内容',
          description: '回复视频描述',
          mediaId: data.media_id
        }
      }
      // 回复7发送音乐
      else if (content === '7') {
        var data = yield wechatApi.uploadMaterial('image', __dirname +
          '/2.jpg')

        reply = {
          type: 'music',
          title: '回复音乐内容',
          description: '回复音乐描述',
          musicUrl: 'http://sc1.111ttt.com/2016/4/09/22/202220006384.mp3',
          thumbMediaId: data.media_id
        }
      }

      // 回复8发送图片 ,上传永久素材
      else if (content === '8') {
        var data = yield wechatApi.uploadMaterial('image', __dirname +
          '/2.jpg', {type: 'image'})

        reply = {
          type: 'image',
          mediaId: data.media_id
        }
      }

      // 回复9发送视频 ,上传永久素材
      else if (content === '9') {
        var data = yield wechatApi.uploadMaterial('video', __dirname +
          '/6.mp4', {type: 'video',
          description: '{"title": "Really a nice place", "introduction" : "Never think it so easy"}'})

          reply = {
            type: 'video',
            title: '回复视频内容',
            description: '回复视频描述',
            mediaId: data.media_id
          }
      }

      // 回复10发送图片 ,上传永久素材 获取图片id 组成图文news
      else if (content === '10') {
        var picData = yield wechatApi.uploadMaterial('image', __dirname +
          '/2.jpg', {})

          var media = {
            articles: [{
                    title: 'cool1',
                    thumb_media_id: picData.media_id,
                    author: 'khrystal',
                    digest: '没有摘要',
                    show_cover_pic: 1,
                    content: '没有内容',
                    content_source_url: 'http://github.com'
                },{
                    title: 'cool3',
                    thumb_media_id: picData.media_id,
                    author: 'khrystal',
                    digest: '没有摘要',
                    show_cover_pic: 1,
                    content: '没有内容',
                    content_source_url: 'http://github.com'
                }]
          }

          data = yield wechatApi.uploadMaterial('news', media, {})
          console.log('upload success!');
          console.log(data);
// 测试根据图文id获取图文对象 并打印 data.media_id  测试数据 s7T8R4zwxWXoNWjsWxs-wc46FJSOt_ZaG7EWJXC1-Y0
          data = yield wechatApi.fetchMaterial(data.media_id, 'news', {})
          console.log(data)

          var items = data.news_item
          var news = []

          items.forEach(function(item) {
            news.push({
              title: item.title,
              description: item.digest,
              picUrl: picData.url
            })
          })

          reply = news
      }
      else if(content === '11') {
        var counts = yield wechatApi.countMaterial()

        console.log(JSON.stringify(counts));

        var results = yield[
          wechatApi.batchMaterial({
            type :'image',
            offset: 0,
            count: 10
          }),
          wechatApi.batchMaterial({
            type :'video',
            offset: 0,
            count: 10
          }),
          wechatApi.batchMaterial({
            type :'voice',
            offset: 0,
            count: 10
          }),
          wechatApi.batchMaterial({
            type :'news',
            offset: 0,
            count: 10
          })]

          console.log(JSON.stringify(results));
          reply = '1'
      }
      // 该接口已废弃
      else if (content === '12') {
        var group = yield wechatApi.createGroup('wechat')
        console.log('新分组：');
        console.log(group);
        var groups = yield wechatApi.fetchGroups()

        console.log('加了wechat后的分组列表');
        console.log(groups);

        // 查询发送消息用户的所在分组
        var group2 = yield wechatApi.checkGroup(message.FromUserName)
        console.log('查看用户分组');
        console.log(group2);

        // var result = yield wechatApi.moveGroup(message.FromUserName,
        //   118)
        //
        // console.log(result);
        // console.log('移动到118');
        // console.log('移动后的分组列表');
        // var group3 = yield wechatApi.fetchGroups()
        // console.log(groups);
        //
        // var result2 = yield wechatApi.moveGroup([message.FromUserName],
        //   116)
        // console.log(result2);
        // console.log('批量移动到116');
        // console.log('移动后的分组列表');
        // var group4 = yield wechatApi.fetchGroups()
        // console.log(groups);

        reply = 'group done'
      }
      else if (content === '13') {
        var user = yield wechatApi.fetchUsers(message.FromUserName, 'zh_CN')
        console.log(user);
// 模拟批量获取
        var openIds = [
          {
            openid: message.FromUserName,
            lang: 'zh_CN'
          }
        ]
        var users = yield wechatApi.fetchUsers(openIds)
        console.log(users);

        reply = JSON.stringify(user)
      }
      else if (content === '14') {
        var userlist = yield wechatApi.listUsers()
        console.log(userlist);

        reply = userlist.total
      }

      this.body = reply
  }
  yield next
}
