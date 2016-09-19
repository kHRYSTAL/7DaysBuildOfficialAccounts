'use strict'

/** 模版文件*/
var ejs = require('ejs')
var heredoc = require('heredoc')

var tpl = heredoc(function() {/*
  <xml>
  <ToUserName><![CDATA[<% toUserName %>]]></ToUserName>
  <FromUserName><![CDATA[<% fromUserName %>]]></FromUserName>
  <CreateTime><% createTime %></CreateTime>
  <MsgType><![CDATA[<% msgType %>]]></MsgType>
  <% if (msgType === 'text') { %>
      <Content><![CDATA[<% content %>]]></Content>
  <% } else if (msgType === 'image') { %>
      <PicUrl><![CDATA[content.picUrl]]></PicUrl>
      <MediaId><![CDATA[<% content.media_id %>]]></MediaId>
  <% } else if (msgType === 'voice') {%>
      <Format><![CDATA[<% content.format %>]]></Format>
      <MediaId><![CDATA[<% content.media_id %>]]></MediaId>
      <Recognition><![CDATA[<% content.recognition %>]]></Recognition>
  <% } else if (msgType === video) { %>
      <MediaId><![CDATA[content.media_id]]></MediaId>
      <ThumbMediaId><![CDATA[content.thumb_media_id]]></ThumbMediaId>
  <% } else if (msgType === shortvideo) { %>
      <MediaId><![CDATA[content.media_id]]></MediaId>
      <ThumbMediaId><![CDATA[content.thumb_media_id]]></ThumbMediaId>
  <% } else if (msgType === location) { %>
      <Location_X><% content.location_x %></Location_X>
      <Location_Y><% content.location_y %></Location_Y>
      <Scale><% content.location_scale %></Scale>
      <Label><![CDATA[<% content.location %>]]></Label>
  <% } else if (msgType === link) { %>
      <Title><![CDATA[<% content.title %>]]></Title>
      <Description><![CDATA[<% content.description %>]]></Description>
      <Url><![CDATA[<% content.url %>]]></Url>
  <% } %>
  <MsgId><% msgId %></MsgId>
  </xml>
*/})

var compiled = ejs.compile(tpl)

exports = module.exports = {
  compiled: compiled
}
