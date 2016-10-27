var express = require('express')
var path = require('path')
var bodyParser = require('body-parser');
var port = process.env.PORT || 3000
var app = express()

app.set('views', './views/pages')
app.set('view engine', 'jade')
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())
app.use(express.static(path.join(__dirname,'bower_components')))
app.listen(port)

console.log('service started on port ' + port)

//index page
app.get('/', function (req, res)  {
  res.render('index', {
    title:'首页',
    movies: [{
      title:'奇妙世纪 08 梦的还原器',
      _id: 1,
      poster:'http://r3.ykimg.com/05410408548589706A0A4160AF2742DF'
    },{
      title:'奇妙世纪 08 梦的还原器',
      _id: 2,
      poster:'http://r3.ykimg.com/05410408548589706A0A4160AF2742DF'
    },{
      title:'奇妙世纪 08 梦的还原器',
      _id: 3,
      poster:'http://r3.ykimg.com/05410408548589706A0A4160AF2742DF'
    },{
      title:'奇妙世纪 08 梦的还原器',
      _id: 4,
      poster:'http://r3.ykimg.com/05410408548589706A0A4160AF2742DF'
    },{
      title:'奇妙世纪 08 梦的还原器',
      _id: 5,
      poster:'http://r3.ykimg.com/05410408548589706A0A4160AF2742DF'
    },{
      title:'奇妙世纪 08 梦的还原器',
      _id: 6,
      poster:'http://r3.ykimg.com/05410408548589706A0A4160AF2742DF'
    }]
  })
})

app.get('/movie/:id', function (req, res)  {
  res.render('detail', {
    title: '影片详情页',
    movie: {
      title: '奇妙世纪 08 梦的还原器',
      doctor: '程亮/林博',
      country: '大陆',
      year: 2014,
      language: '汉语',
      poster: 'http://r3.ykimg.com/05410408548589706A0A4160AF2742DF',
      flash: 'http://player.youku.com/player.php/sid/XODQ0NDk4MTA0/v.swf',
      summary: '《奇妙世纪》是由啼声影视与优酷出品共同打造的中国首部原创都市奇幻单元剧。'
    }
  })
})

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}



module.exports = app;