var student = require('./student')
var teacher = require('./teacher')


function add(teacherName, students) {
  teacher.add(teacherName)

  students.forEach(function(item, index) {
    student.add(item)
  })
}

exports.add = add

// module.exports
// exports 是module.exports的一个引用可以理解成module.exports的属性
// 暴露给开发者的实际上是module.exports
// 本身是{} 如果使用module.exports创建了实例
// 那么exports则不能再被引用 常用exports
