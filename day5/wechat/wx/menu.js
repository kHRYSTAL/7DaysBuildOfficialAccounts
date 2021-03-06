'use strict'

// 菜单配置
module.exports = {
  'button': [{
    'name': '点击事件',
    'type': 'click',
    // key的value为自定义 当用户点击 传递value至服务器
    // 可以知道用户点击的是哪个按钮
    'key': 'menu_click'
  },{
    'name': '点出菜单',
    // 子集按钮
    'sub_button': [{
      'name': '跳转URL',
      'type': 'view',
      'url': 'http://github.com/'
    },{
      // 扫码推送事件
      'name': '扫码推送事件事件事件事件事件',
      'type': 'scancode_push',
      'key': 'qr_scan'
    },{
      // 扫码推送
      'name': '扫码推送中',
      'type': 'scancode_waitmsg',
      'key': 'qr_scan_wait'
    },{
      'name': '弹出系统拍照',
      'type': 'pic_sysphoto',
      'key': 'pic_photo'
    },{
      'name': '弹出拍照或相册',
      'type': 'pic_photo_or_album',
      'key': 'pic_photo_album'
    }]
  },{
    'name': '点出菜单2',
    'sub_button': [{
      'name': '微信相册发图',
      'type': 'pic_weixin',
      'key': 'pic_weixin'
    },{
      'name': '地理位置选择',
      'type': 'location_select',
      'key': 'location_select'
    }]
    // ,{
    //   'name': '下发图片消息',
    //   'type': 'media_id',
    //   'media_id': 'xxx'
    // }
    // ,{
    //   'name': '跳转图文消息url',
    //   'type': 'view',
    //   'media_id': 'xxx'
    // }

  }
]}
