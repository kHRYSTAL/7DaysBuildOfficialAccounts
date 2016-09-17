access_token 7200ms

access_token每两小时自动失效 需要重新获取

只要更新了access_token 之前的就不能使用了

因此服务器需要每两小时启动刷新一次票据
这样无论何时我们内部调用接口 票据始终是最新的

为了方便频繁调用 我们需要把票据存储在一个固定且唯一的位置

access_token是公众号的全局唯一票据，公众号调用各接口时都需使用access_token。
开发者需要进行妥善保存。access_token的存储至少要保留512个字符空间。
access_token的有效期目前为2个小时，需定时刷新，重复获取将导致上次获取的access_token失效。

xml 中![CDATA[]]作用:
  xml区块 避免区块中内容被xml解析器解析 如'<','!'等如果不加该区块
  会导致解析时发生错误
  如<Content><![CDATA[Hello]]></Content>
