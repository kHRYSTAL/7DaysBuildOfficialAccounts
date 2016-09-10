var http = require('http')
var Promise = require('bluebird')
var cheerio = require('cheerio')

var baseUrl = 'http://www.imooc.com/learn/'
var videoIds = [75]

function filterChapters(html) {
    var $ = cheerio.load(html)
    var title = $('.course-infos .path span').text()

    var number = parseInt($($('.meta-value strong')[3]).text().trim(), 0)
    var chapters = $('.chapter')

    // [{
    //   chapterTitle:'',
    //   videos:[
    //     title: '',
    //     id: ''
    //   ]
    // }]

    // courseData = {
    //   title: title,
    //   number: number,
    //   videos: [{
    //     chapterTitle:'',
    //     videos: [
    //       title:'',
    //       id:''
    //     ]
    //   }]
    // }

    var courseData = {
      title: title,
      number: number,
      videos: []
    }

    chapters.each(function(item) {
      var chapter = $(this)
      var chapterTitle = chapter.find('strong').text()
      var videos = chapter.find('.video').children('li')
      var chapterData = {
        chapterTitle : chapterTitle,
        videos : []
      }

      videos.each(function(item) {
          var video = $(this).find('.J-media-item')
          var videoTitle = video.text()
          var id = video.attr('href').split('video/')[1]

          chapterData.videos.push({
            title : videoTitle,
            id: id
          })
      })

    courseData.videos.push(chapterData)
    })

    return courseData
}

function printCourseInfo(coursesData) {
  coursesData.forEach(function(courseData) {
    console.log(courseData.number + '人学过' + courseData.title + '\n')
  })

  coursesData.forEach(function(courseData) {
    console.log('###' + courseData.title.trim() + '\n')
    courseData.videos.forEach(function(item) {
      var chapterTitle = item.chapterTitle
      console.log(chapterTitle + '\n')
      item.videos.forEach(function(video) {
        console.log('|' + video.id + '|' + video.title.trim() + '\n')
      })
    })
  })
}

/**
通过url获取整个页面html代码
*/
function getPageDataAsync(url) {
  return new Promise(function(resolve, reject) {
    console.log('正在爬取:' + url)

    http.get(url, function(res) {
      var html = ''

      res.on('data', function(data) {
        html += data
      })

      res.on('end', function() {
        resolve(html)
      })
    }).on('error', function(e) {
      reject(e)
      console.log('获取课程数据出错！')
    })
  })
}

var fetchCourseArray = []

videoIds.forEach(function(id) {
  fetchCourseArray.push(getPageDataAsync(baseUrl + id))
})

/**
Promise.all 可以接收一个元素为 Promise 对象的数组作为参数，
当这个数组里面所有的 Promise 对象都变为 resolve 时，该方法才会返回。
Promise.all 方法会按照数组里面的顺序将结果返回。
还有一个和 Promise.all 相类似的方法 Promise.race，它同样接收一个数组，
不同的是只要该数组中的 Promise 对象的状态发生变化（无论是 resolve 还是 reject）
该方法都会返回。
*/
Promise
  .all(fetchCourseArray)
  .then(function(pages) {
    var coursesData = []
    pages.forEach(function(html) {
      var course = filterChapters(html)

      coursesData.push(course)
    })

    // courseData.sort(function(a, b) {
    //   retrun a.number < b.number
    // })

    printCourseInfo(coursesData)
  })
