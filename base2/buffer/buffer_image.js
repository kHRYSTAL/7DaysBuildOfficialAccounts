var fs = require('fs')

//读出一个文件 并放入创建的origin_buffer中
// 如果指定了编码 则origin_buffer为字符串
fs.readFile('logo.png', function(err, origin_buffer) {
  console.log(Buffer.isBuffer(origin_buffer));

  fs.writeFile('logo_buffer.png', origin_buffer, function(err) {
    if (err) {
      console.log(err);
    }
  })
// 以编码读取
  // var base64Image = new Buffer(origin_buffer).toString('base64')
  var base64Image = origin_buffer.toString('base64')

  console.log(base64Image);

  var decodedImage = new Buffer(base64Image, 'base64')
// that method isn't available until 0.12
  // console.log(Buffer.compare(origin_buffer, decodedImage));

  fs.writeFile('logo_decoded.png', decodedImage, function(err) {
    if (err) {
      console.log(err);
    }
  })
})
