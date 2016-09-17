var Koa = require('koa')
var app = new Koa()


app.use(function *(next) {
  console.log(this.query)
  this.body = this.query.echo
})

app.listen(3000)
