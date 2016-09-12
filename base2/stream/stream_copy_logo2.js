var fs = require('fs')

var readStream = fs.createReadStream('1.mp4')
var writeStream = fs.createWriteStream('1-stream.mp4')
/**
存在问题: 当读快写慢的时候 缓存会出现爆仓
*/
/**

*/
readStream.on('data', function(chunk) {
  if(writeStream.write(chunk)===false) {
    //说明数据还在缓冲区
    console.log('still cached')
    //防止缓存溢出 在缓冲没写完情况下先暂停
    readStream.pause()
  }
})

readStream.on('end', function() {
  writeStream.end()
})

writeStream.on('drain', function() {
  console.log('data drains');
  // 输入流可以取消暂停 继续读取内容
  readStream.resume()
})
