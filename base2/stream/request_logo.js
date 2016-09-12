var http = require('http')
var fs = require('fs')
var request = require('request')

http.createServer(function(req, res) {
  // fs.readFile('../buffer/logo.png', function(err, data) {
  //   if (err) {
  //     res.end('file not exist!')
  //   }
  //   else {
  //     res.writeHeader(200, {'Context-Type': 'text/html'})
  //     res.end(data)
  //   }
  // })
  // fs.createReadStream('../buffer/logo.png').pipe(res)

  request('https://ss1.baidu.com/6ONXsjip0QIZ8tyhnq/it/u=2641876261,1565531197&fm=58')
  .pipe(res)
})
  .listen(8090)
