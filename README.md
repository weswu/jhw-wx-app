# 小程序模板

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen.svg)](www.jihui88.com)

> 这是一个用小程序制作的商城网站。


## 项目模板(分支控制)
每一个分支对应一个模板，无需合并分支，develop开发和调试新功能

`master` 基础模板

`jihui` 机汇网

`qixingbucao` 七星布草 zaingdev

### 新建模板
```
git checkout -b qixingbucao master
```

### 查看模板
```
git branch -a
```

### 切换模板
```
git checkout qixingbucao
```

## 项目目录
<pre>
.
├── images             // 项目静态，图片资源
├── pages              // 源码目录
│   ├── address        // 收货地址，调用微信地址接口
│   ├── cart           // 购物车
│   ├── category       // 商品分类
│   ├── detail         // 商品详情页面，调用微信预览图片接口
│   ├── company        // 公司简介
│   ├── login          // 登录（未使用，已用微信账号自动登录）
│   ├── my             // 我的
│   ├── order          // 订单中心
│   ├── product        // 商品
│   ├── search         // 商品搜索
│   └── setting        // 设置
├── utils              // 插件功能
├── app.js             // 项目入口文件
├── app.json           // 项目配置文件
├── app.wxss           // 项目全局样式
├── ext.json           // 小程序配置文件
├── README.md          // 说明
</pre>


## 更多信息
- 官方[文档](https://mp.weixin.qq.com/debug/wxadoc/dev/)
- 第三方平台-[ext.json](https://mp.weixin.qq.com/debug/wxadoc/dev/devtools/ext.html)
- 阅读[机汇网接口](http://jihui88.oschina.io/jhw-api/?file=002-%E5%BE%AE%E4%BF%A1%E5%B0%8F%E7%A8%8B%E5%BA%8F%E7%9B%B8%E5%85%B3%E6%8E%A5%E5%8F%A3/001-%E7%99%BB%E5%BD%95%E6%8E%A5%E5%8F%A3)
