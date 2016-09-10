var https = require('https')
// file system
var fs = require('fs')

var options = {
  // 同步读取证书私钥文件
  key : fs.readFileSync('ssh_key.pem')
  cert : fs.readFileSync('ssh_cert.pem')
}


https.createServer(options, function(req, res) {
  res.writeHead(200)
  res.end('Hello Https')
})
.listen(8090)
