var EventEmitter = require('events').EventEmitter

var life = new EventEmitter()

// 对一个事件不要设置超过10个监听器 否则会弹出警告
// 过多会导致内存泄漏
// 通过此方法可以设置监听器最大值
life.setMaxListeners(11)

var listener = function(who) {
  console.log('the name is :' + who)
}

// 等同于 addEventListener 进行事件监听
// 相比eventbus onEventMainThread
life.on('Name', listener)


// 发射事件
// 相比eventbus post
var hasPost = life.emit('Name', 'Matt')

console.log(hasPost);

// query listeners
// param can set null mean all
console.log(life.listeners('Name').length)
console.log(EventEmitter.listenerCount(life, 'Name'))

// remove some type

life.removeAllListeners('Name')

//remove all
life.removeAllListeners()

// remove listener
life.removeListener('Name', listener)

var hasPost = life.emit('Name', 'Matt')

console.log(life.listeners('Name').length)
