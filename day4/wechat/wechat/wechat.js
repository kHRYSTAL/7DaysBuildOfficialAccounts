'use strict '

var fs = require('fs')
var prefix = 'https://api.weixin.qq.com/cgi-bin/'
var _ = require('lodash')
var Promise = require('bluebird')
// promise化request 将callback promise化
var request = Promise.promisify(require('request'))
var util = require('./util')

var api = {
  access_token: prefix +
    'token?grant_type=client_credential',
  // 上传临时素材
  temporary : {
    upload: prefix + 'media/upload?',
    fetch: prefix + 'media/get?' //获取远端临时素材
  },
  // 上传永久素材
  permanent : {
    upload: prefix + 'material/add_material?',
    uploadNews: prefix + 'material/add_news?',
    uploadNewsPic: prefix + 'media/uploadimg?',
    fetch: prefix + 'material/get_material?',
    del: prefix + 'material/del_material?', //删除永久素材
    update: prefix + 'material/update_news?', //更新
    count: prefix + 'material/get_materialcount?',//获取素材总数
    batch: prefix + 'material/batchget_material?'// 批量获取素材列表
  },
  // 分组
  group : {
    // 创建分组
    create: prefix + 'groups/create?',
    // 查询分组
    fetch: prefix + 'groups/get?',
    // 查询用户所在分组
    check: prefix + 'groups/getid?',
    // 修改分组名
    update: prefix + 'groups/update?',
    // 移动用户所在组
    move: prefix + 'groups/members/update?',
    // 批量移动用户所在组
    batchupdate: prefix + 'groups/members/batchupdate?',
    // 删除分组
    del: prefix + 'groups/delete?'
  },

  user: {
    // 设置备注名
    remark: prefix + 'user/info/updateremark?',
    fetch: prefix + 'user/info?',
    batchfetch: prefix + 'user/info/batchget?',
    // 获取用户列表
    list: prefix + 'user/get?'
  }

}


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
  this.fetchAccessToken()
}

Wechat.prototype.fetchAccessToken = function() {
  var that = this

  if (this.access_token && this.expires_in) {
    if (this.isValidAccessToken(this)) {
      return Promise.resolve(this)
    }
  }

  return this.getAccessToken()
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

      return Promise.resolve(data)
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

// 从微信服务器更新票据
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

// 上传素材 包括临时素材和永久素材 type 路径 配置项
Wechat.prototype.uploadMaterial = function(type, material, permanent) {
  var that = this

  var form = {}
  // 默认上传url为上传至临时素材url
  var uploadUrl = api.temporary.upload
// 如果存在配置项 则为永久素材上传
  if (permanent) {
    uploadUrl = api.permanent.upload
    // 表单form继承permanent对象 permanent可以传递表单内容
    _.extend(form, permanent)
  }
  if (type === 'pic') {
    uploadUrl = api.permanent.uploadNewsPic
  }
  if (type === 'news') {
    uploadUrl = api.permanent.uploadNews
    form = material
  }
  else {
    form.media = fs.createReadStream(material)
  }


  return new Promise(function(resolve, reject) {
    that
      .fetchAccessToken() // 获取全局票据
      .then(function(data) {
        var url = uploadUrl + 'access_token='
          + data.access_token
          // 如果不是永久类型
        if (!permanent) {
          url += '&type=' + type
        }
        else {
          form.access_token = data.access_token
        }
        var options = {
          method: 'POST',
          url: url,
          json: true
        }

        if (type === 'news') {
          options.body = form
        }
        else {
          options.formData = form
        }

        request(options)
        .then(function (response) {
            var _data = response.body
            if (_data) {
              resolve(_data)
            }
            else {
              throw new Error('Upload material fails')
            }
        })
        .catch(function(err) {
          reject(err)
        })
    })
  })
}


// 获取素材 包括获取临时素材和永久素材
// 根据素材id获取素材 type参数可以判断url
Wechat.prototype.fetchMaterial = function(mediaId, type, permanent) {
  var that = this
  // 默认url为获取永久url
  var fetchUrl = api.temporary.fetch
// 如果存在配置项 则为永久素材获取
  if (permanent) {
    fetchUrl = api.permanent.fetch
  }

  return new Promise(function(resolve, reject) {
    that
      .fetchAccessToken() // 获取全局票据
      .then(function(data) {
        var url = fetchUrl + 'access_token='
          + data.access_token
        var form = {}

        var options = {methd: 'POST', url: url, json: true}

        if (permanent) {

          form.media_id = mediaId,
          form.access_token = data.access_token,
          options.body = form
        }
        else {
          if (type === 'video') {
            url = url.replace('https://', 'http://')
          }
          url += '&media_id=' + mediaId
        }

        if (type === 'news' || type === 'video') {
          console.log(options);
          request(options)
          .then(function (response) {
              var _data = response.body
              if (_data) {
                resolve(_data)
              }
              else {
                throw new Error('Fetch material fails')
              }
          })
          .catch(function(err) {
            reject(err)
          })
        }
        else {
          // image
          resolve(url)
        }

    })
  })
}

// 删除永久素材
Wechat.prototype.deleteMaterial = function(mediaId) {
  var that = this

  var form = {
    media_id: media_id
  }

  return new Promise(function(resolve, reject) {
    that
      .fetchAccessToken() // 获取全局票据
      .then(function(data) {
        var url = api.permanent.del + 'access_token='
          + data.access_token + '&media_id=' + media_id

        request({method: 'POST', url: url, body: form, json: true})
        .then(function (response) {
            var _data = response.body
            if (_data) {
              resolve(_data)
            }
            else {
              throw new Error('Delete material fails')
            }
        })
        .catch(function(err) {
          reject(err)
        })
    })
  })
}

// 更新永久素材
Wechat.prototype.updateMaterial = function(mediaId, news) {
  var that = this

  var form = {
    media_id: media_id
  }

  _.extend(form, news)

  return new Promise(function(resolve, reject) {
    that
      .fetchAccessToken() // 获取全局票据
      .then(function(data) {
        var url = api.permanent.update + 'access_token='
          + data.access_token + '&media_id=' + media_id
// json - sets body to JSON representation of value and adds Content-type: application/json header. Additionally, parses the response body as JSON.
        request({method: 'POST', url: url, body: form, json: true})
        .then(function (response) {
            var _data = response.body
            if (_data) {
              resolve(_data)
            }
            else {
              throw new Error('Update material fails')
            }
        })
        .catch(function(err) {
          reject(err)
        })
    })
  })
}

// 获取永久素材数量
Wechat.prototype.countMaterial = function() {
  var that = this

  // var form = {
  //   media_id: media_id
  // }
  //
  // _.extend(form, news)

  return new Promise(function(resolve, reject) {
    that
      .fetchAccessToken() // 获取全局票据
      .then(function(data) {
        var url = api.permanent.count + 'access_token='
          + data.access_token

        request({method: 'GET', url: url, json: true})
        .then(function (response) {
            var _data = response.body
            if (_data) {
              resolve(_data)
            }
            else {
              throw new Error('Count material fails')
            }
        })
        .catch(function(err) {
          reject(err)
        })
    })
  })
}

// 批量获取永久素材列表
Wechat.prototype.batchMaterial = function(options) {
  var that = this

  // 按照类型获取 如果没有传递options.type 默认为image类型
  options.type = options.type || 'image'
  options.offset = options.offset || 0 //从全部素材的该偏移位置开始返回，0表示从第一个素材 返回
  options.count = options.type || 1 //返回素材的数量，取值在1到20之间


  // var form = {
  //   media_id: media_id
  // }
  //
  // _.extend(form, news)

  return new Promise(function(resolve, reject) {
    that
      .fetchAccessToken() // 获取全局票据
      .then(function(data) {
        var url = api.permanent.batch + 'access_token='
          + data.access_token

        request({method: 'POST', url: url, body: options, json: true})
        .then(function (response) {
            var _data = response.body
            if (_data) {
              resolve(_data)
            }
            else {
              throw new Error('Count material fails')
            }
        })
        .catch(function(err) {
          reject(err)
        })
    })
  })
}

// 创建分组
Wechat.prototype.createGroup = function(name) {
  var that = this

  return new Promise(function(resolve, reject) {
    that
      .fetchAccessToken() // 获取全局票据
      .then(function(data) {
        var url = api.group.create + 'access_token='
          + data.access_token

        var options = {
          group: {
            name: name
          }
        }

        request({method: 'POST', url: url, body: options, json: true})
        .then(function (response) {
            var _data = response.body
            if (_data) {
              resolve(_data)
            }
            else {
              throw new Error('create Group error!')
            }
        })
        .catch(function(err) {
          reject(err)
        })
    })
  })
}

// 获取分组
Wechat.prototype.fetchGroups = function() {
  var that = this

  return new Promise(function(resolve, reject) {
    that
      .fetchAccessToken() // 获取全局票据
      .then(function(data) {
        var url = api.group.fetch + 'access_token='
          + data.access_token
        request({url: url, json: true})
        .then(function (response) {
            var _data = response.body
            if (_data) {
              resolve(_data)
            }
            else {
              throw new Error('fetch Group error!')
            }
        })
        .catch(function(err) {
          reject(err)
        })
    })
  })
}

// 通过用户openid 查询所在分组
Wechat.prototype.checkGroup = function(openId) {
  var that = this

  return new Promise(function(resolve, reject) {
    that
      .fetchAccessToken() // 获取全局票据
      .then(function(data) {
        var url = api.group.check + 'access_token='
          + data.access_token

        var form = {
          openid: openId
        }
        request({method: 'POST', url: url, body: form, json: true})
        .then(function (response) {
            var _data = response.body
            if (_data) {
              resolve(_data)
            }
            else {
              throw new Error('check user from Group error!')
            }
        })
        .catch(function(err) {
          reject(err)
        })
    })
  })
}

// 更新分组名称
Wechat.prototype.updateGroup = function(groupId, name) {
  var that = this

  return new Promise(function(resolve, reject) {
    that
      .fetchAccessToken() // 获取全局票据
      .then(function(data) {
        var url = api.group.update + 'access_token='
          + data.access_token

        var form = {
          group: {
            id: groupId,
            name: name
          }
        }
        request({method: POST, url: url, body: form, json: true})
        .then(function (response) {
            var _data = response.body
            if (_data) {
              resolve(_data)
            }
            else {
              throw new Error('update Group error!')
            }
        })
        .catch(function(err) {
          reject(err)
        })
    })
  })
}


// 批量移动或单个移动
Wechat.prototype.batchGroup = function(openIds, toGroupId) {
  var that = this

  return new Promise(function(resolve, reject) {
    that
      .fetchAccessToken() // 获取全局票据
      .then(function(data) {
        var url
        var form = {
          to_groupid: toGroupId
        }

        if(_.isArray(openIds)) {
          url = api.group.batchupdate + 'access_token='
            + data.access_token
          form.openid_list = openIds
        }
        else {
          url = api.group.move + 'access_token='
            + data.access_token
          form.openid = openIds
        }
        request({method: POST, url: url, body: form, json: true})
        .then(function (response) {
            var _data = response.body
            if (_data) {
              resolve(_data)
            }
            else {
              throw new Error('move Group error!')
            }
        })
        .catch(function(err) {
          reject(err)
        })
    })
  })
}

// 删除分组
Wechat.prototype.deleteGroup = function(groupId) {
  var that = this

  return new Promise(function(resolve, reject) {
    that
      .fetchAccessToken() // 获取全局票据
      .then(function(data) {
        var url = api.group.del + 'access_token='
          + data.access_token

        var form = {
          group :{
            id: groupId
          }
        }

        request({method: POST, url: url, body: form, json: true})
        .then(function (response) {
            var _data = response.body
            if (_data) {
              resolve(_data)
            }
            else {
              throw new Error('delete Group error!')
            }
        })
        .catch(function(err) {
          reject(err)
        })
    })
  })
}

Wechat.prototype.remarkUser = function(openId, remark) {
  var that = this

  return new Promise(function(resolve, reject) {
    that
      .fetchAccessToken() // 获取全局票据
      .then(function(data) {
        var url = api.user.remark + 'access_token='
          + data.access_token

        var options = {
          openid: openId,
          remark: remark
        }

        request({method: 'POST', url: url, body: options, json: true})
        .then(function (response) {
            var _data = response.body
            if (_data) {
              resolve(_data)
            }
            else {
              throw new Error('remark user error!')
            }
        })
        .catch(function(err) {
          reject(err)
        })
    })
  })
}

//  单个或批量获取用户信息
Wechat.prototype.fetchUsers = function(openIds, lang) {
  var that = this
  lang = lang || 'zh_CN'

  return new Promise(function(resolve, reject) {
    that
      .fetchAccessToken() // 获取全局票据
      .then(function(data) {
        var url
        var form
        var options = {
          json: true
        }

        if (_.isArray(openIds)) {
          options.url = api.user.batchfetch + 'access_token='
            + data.access_token
          options.body  = {
             user_list: openIds,
          }
          options.method = 'POST'
        }
        else {
          options.url = api.user.fetch + 'access_token='
            + data.access_token + '&openid=' + openIds + '&lang=' + lang

          options.method = 'GET'
        }

        request(options)
        .then(function (response) {
            var _data = response.body
            if (_data) {
              resolve(_data)
            }
            else {
              throw new Error('create Group error!')
            }
        })
        .catch(function(err) {
          reject(err)
        })
    })
  })
}

Wechat.prototype.listUsers = function(openId) {
  var that = this

  return new Promise(function(resolve, reject) {
    that
      .fetchAccessToken() // 获取全局票据
      .then(function(data) {
        var url = api.user.list + 'access_token='
          + data.access_token

        if (openId) {
          url += '&next_openid' + openId
        }

        request({method: 'GET', url: url, json: true})
        .then(function (response) {
            var _data = response.body
            if (_data) {
              resolve(_data)
            }
            else {
              throw new Error('list users error!')
            }
        })
        .catch(function(err) {
          reject(err)
        })
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
