var http = require('http')
var querystring = require('querystring')

var postData = querystring.stringify({
  'content' : 'Power By Node.JS',
  'mid' : 8837
})

var options = {
  hostname : 'www.imooc.com',
  port : 80,
  path : '/course/docomment',
  method : 'POST',
  headers : {
    'Accept':'application/json, text/javascript, */*; q=0.01',
    'Accept-Encoding':'gzip, deflate',
    'Accept-Language':'zh-CN,zh;q=0.8',
    'Connection':'keep-alive',
    'Content-Length':postData.length,
    'Content-Type':'application/x-www-form-urlencoded; charset=UTF-8',
    'Cookie':'imooc_uuid=e712b492-7899-4452-8a6b-fd1fa535bc38; imooc_isnew_ct=1457720248; Hm_lvt_f0cfcccd7b1393990c78efdeebff3968=1463505632; loginstate=1; apsid=MwY2U4MTJjOTIxNTEzMGU1ZTAyMjdkOWMyYmU1NDEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMjU3MTI2MgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA3MjM1MjY2NzZAcXEuY29tAAAAAAAAAAAAAAAAAAAAAGUxMjQwMGY1MGUwMzk4NWY2YWY4NGU1ODU2NDMxODQ1TjKsV04yrFc%3DOD; last_login_username=723526676%40qq.com; PHPSESSID=d2mssh3fiikd3u489de7csdbn4; IMCDNS=0; __lfcc=1; imooc_isnew=2; cvde=57b4875444527-60',
    'Host':'www.imooc.com',
    'Origin':'http://www.imooc.com',
    'Referer':'http://www.imooc.com/video/8837',
    'User-Agent':'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/52.0.2743.116 Safari/537.36',
    'X-Requested-With':'XMLHttpRequest'
  }
}

var req = http.request(options, function(res) {
  console.log('Status:' + res.statusCode)
  console.log('headers:' + JSON.stringify(res.headers))

  res.on('data', function(chunk) {
    console.log(Buffer.isBuffer(chunk))
    console.log(typeof chunk)
  })

  res.on('end', function() {
    console.log('评论完毕')
  })

  req.on('error', function(e) {
    console.log('Error:' + e.message)
  })
})

req.write(postData)

req.end()
