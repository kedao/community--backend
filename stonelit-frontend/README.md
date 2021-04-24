# 点石

## 运行

### `npm install`

安装项目依赖

### `npm start`

开发调试模式

### `npm test`

测试

### `npm run build`

在根目录下编译与生成生产环境版本，路径为build。
将build目录部署在生产环境中的/usr/share/www/stonelit/frontend即可。

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
* `account` 账号：登录、登出等
* `app` 公共route以及页面基本结构，app静态页面
* `article` 文章详情
* `home` 首页
* `my` 个人首页
* `page` 固定页
* `post` 文本投稿、视频投稿、发帖等
