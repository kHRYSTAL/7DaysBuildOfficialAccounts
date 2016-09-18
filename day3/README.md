微信交互过程
1. 微信服务器向开发者服务器发送验证请求 验证开发者身份
开发者服务器向微信服务器返回参数串
```
app.use(function *(next) {
  console.log(this.query)
  var token = config.wechat.token
  var signature = this.query.signature
  var nonce = this.query.nonce
  var timestamp = this.query.timestamp
  var echostr = this.query.echostr

  var str = [token, timestamp, nonce].sort().join('')
  var sha = sha1(str)
  console.log(sha)

  if (sha == signature) {
    this.body = echostr
  } else {
    this.body = 'wrong'
  }
})
```

2. 微信客户端向微信服务器发送事件或消息
微信服务器将接收到的事件或消息 通过XML形式 Post至开发者服务器

3. 开发者服务器回复XML数据至微信服务器(XML)

4. 微信服务器将结果推送到客户端

票据 用于微信接口 当使用支付或其他功能时 需要使用票据
票据的有效期为2小时， 需要在开发者服务器自己实现更新和存储机制
票据 access_token 实际是一个session 即访问令牌
