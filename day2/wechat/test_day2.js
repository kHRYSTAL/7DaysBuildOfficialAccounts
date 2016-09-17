'use strict'

var path = require('path')
var fs = require('fs')
var Koa = require('koa')
var count_file = path.join(__dirname,'./test/count.txt')
var app = new Koa()

app.use(function *(next) {
  if (fs.existsSync(count_file)){
    var count = parseInt(fs.readFileSync(count_file)) + 1
    console.log(count);
    this.body = 'Count times:' + count
    fs.writeFileSync(count_file, count)
  }
  else {
    fs.writeFileSync(count_file,1)
    this.body = 'Count times:' + 1
  }
})
app.listen(3000)
