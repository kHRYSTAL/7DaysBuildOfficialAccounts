// 创建生成器函数

var gen = function* (n) {
  for(var i = 0; i < 3; i++) {
    n++

    yield n // when arrive here will pause
            // and wait genObj call .next()
  }
}

var genObj = gen(2)

console.log(genObj.next());// 3 done = false
console.log(genObj.next());// 4 done = false
console.log(genObj.next());// 5 done = false
console.log(genObj.next());// undefined done = true


/**
basic
request(url, function(err, res, result) {
  if(err) handleError(err)
  fs.writeFile('1.txt', result, function(err) {
    if(err) handleError
    request(url2, function(err, res, result) {
      if(err) handleError(err)
    )
  })
})
*/

/**
Promise

request(url)
  .then(function(result) {
    return writeFileAsync('1.txt', result)
  })
  .then(function(result) {
    return request(url2)
  })
  .catch(function(e) {
    handleError(e)
  })
*/

/**
generator

var result = yield request(url)
// 异步变同步
yield writeFileAsync('1.txt', result)

yield request(url2)
*/
