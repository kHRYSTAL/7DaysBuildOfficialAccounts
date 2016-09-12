var stream = require('stream')
var util = require('util')

// 执行父类.call 实际上等于子类获取了父类的上下文 包含构造函数中的属性和方法
// 非构造函数(原型的方法)
function ReadStream() {
  stream.Readable.call(this)
}

// 原型继承
//使封装的可读流 继承 stream中可读流的原型
util.inherits(ReadStream, stream.Readable)

// 当为单一调用的对象时 可以直接使用
// ReadStream.prototype = new stream.Readable()
// 网上说 当你创建 多个 Extend 对象的时候 实际上只创建了一个Base 对象 不知何解?

// 对原型方法的重写
ReadStream.prototype._read = function() {
  this.push('I')
  this.push('LOVE')
  this.push('U\n')
  this.push(null)
}

//

function WriteStream() {
  stream.Writable.call(this)
  this._cached = new Buffer('')
}

util.inherits(WriteStream, stream.Writable)
WriteStream.prototype._write = function(chunk, encode, cb) {
  console.log(chunk.toString());
  cb()
}

//

function TransformStream() {
  stream.Transform.call(this)
}

util.inherits(TransformStream, stream.Transform)

TransformStream.prototype._transform = function(chunk, encode, cb) {
  this.push(chunk)
  cb()
}

TransformStream.prototype._flush = function(cb) {
  this.push('Oh Melody')
  cb()
}

var rs = new ReadStream()
var ws = new WriteStream()
var ts = new TransformStream()

// pipe 至转换流 在pipe给 可写流
rs.pipe(ts).pipe(ws)
