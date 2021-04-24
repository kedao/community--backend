# 点石 - 后台管理

## 运行

### `npm install`

安装项目依赖

### `npm start`

开发调试模式

### `npm test`

测试

### `npm run build`

在根目录下编译与生成生产环境版本，路径为build。
将build目录部署在生产环境中的/usr/share/www/stonelit/frontend/backend即可。

### `npm run eject`

弹出react-scripts配置文件。

## 目录结构

### `public`

公共模版文件，以及模版对应的CSS、字体、图片等

### `src`

* `_assets` 公用CSS以及图片等资源
* `_components` 公用React组件
* `_config` 公用配置文件
* `_helpers` helper函数
* `_services` 网络接口
* `_teleporters` 模版注入
* `app` 公共route以及页面基本结构
* `article` 投稿管理操作，以及投稿审核、推荐、审核记录等
* `articleChannel` 频道管理
* `community` 社区管理
* `communityCategory` 社区类目
* `content` 内容管理，以及内容审核等
* `home` 看板管理
* `product` 产品管理
* `productBrand` 产品品牌管理
* `productCategory` 产品分类管理
* `productParamSetting` 产品参数库管理
* `productShop` 产品商城管理
* `reportHistory` 举报历史
* `statisticPage` 固定页管理
* `sysDict` 数据字典管理
* `user` 用户管理，以及社区、权限管理、登录记录等
* `userFeedback` 用户反馈
