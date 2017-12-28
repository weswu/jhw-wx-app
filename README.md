# 小程序模板

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen.svg)](http://www.jihui88.com)

> 这是一个用小程序制作的商城网站。


## 项目模板(分支控制)
每一个分支对应一个模板，无需合并分支


| 分支名 | 二维码 | 描述 |
| --- | :---: | --- |
| `master` | - | 基础功能模板 |
| `app` | - | 机汇网用户后台 |
| `qixing` | - | 七星布草 zaingdev |
| `jihui` | - | 机汇网 |
| `jinlida` | <img width="106" src="https://raw.githubusercontent.com/weswu/jhw-wxapp/master/images/static/jinlida.png"/> | 金利达砂轮`http://demo.ykit.net/pmsj/jinlida/` |
| `sxl1` | <img width="150" src="https://raw.githubusercontent.com/weswu/jhw-wxapp/master/images/static/sxl1.jpg"/> | 安贝---参考上线了-Ash amaira |
| `sxl2` | <img width="150" src="https://nzr2ybsda.qnssl.com/images/121695/FnC_4HbF5imCh0CDL_7i_SvegqDy.png?imageMogr2/strip/thumbnail/720x1440%3E/quality/90!/format/png"/> | 参考上线了-Eone手表 |

#### 新建空白模板
```
git checkout --orphan sxl1
```

#### 查看模板
```
git branch -a
```

#### 切换模板
```
git checkout master
```

#### 提交模板
```
git pull
git add .
git commit -m desc
git push
```

### 微信配置
| request 合法域名 | 必填 | 描述 |
| --- | :---: | --- |
| `https://api.jihui88.net` | 是 | 机汇网接口 |
| `https://wx.jihui88.net` | - | 商城接口（绑定机汇网账号） |

## 代码样式

### 地图
腾讯地图坐标拾取器: <a href="http://lbs.qq.com/tool/getpoint/" target="_blank">http://lbs.qq.com/tool/getpoint</a>

### 客服会话，需后台添加客服人员
```html
.contact-button{opacity:0;position:absolute;top:0;left:0;}
<view class="detail-btn-contcat" style="position:relative;">
  <contact-button type="default-light" size="27" session-from="weapp" wx:for="{{[0, 1, 2, 3, 4, 5]}}" style="left:{{item*27}}px"></contact-button>
  客服会话
</view>
```

## 商城
### ext.json
```json
"ext": {
  "appid": "wxc133a0e73ee80bb6",
  "enterprise_id": "Enterp_0000000000000000000062420",
  "user_id": "User_000000000000000000000065262",
  "primaryColor":"#ff6214"
},
"extPages": {
  "pages/index/index": {
    "navigationBarTitleText": "首页标题"
  }
}
```
- appid 有extAppid就代替,用于登录,支付等一些商城功能
- enterprise_id 企业ID,用于获取产品数据
- user_id 用户id,用于留言
- primaryColor 主题颜色
- lighterPrimaryColor 次颜色(未使用)

### 相关文件
文件目录 address cart order，未使用可删除

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
│   ├── news           // 新闻
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
- 官方-[文档](https://mp.weixin.qq.com/debug/wxadoc/dev/)
- 第三方平台-[ext.json](https://mp.weixin.qq.com/debug/wxadoc/dev/devtools/ext.html)
- 阅读-[机汇网接口](http://jihui88.oschina.io/jhw-api/?file=002-%E5%BE%AE%E4%BF%A1%E5%B0%8F%E7%A8%8B%E5%BA%8F%E7%9B%B8%E5%85%B3%E6%8E%A5%E5%8F%A3/001-%E7%99%BB%E5%BD%95%E6%8E%A5%E5%8F%A3)
- 字体-[图标](http://iconfont.cn)
