# qiniu-uploader
A simple uploader for qiniu-cloud

## 缘由
为了套个https的小绿板, 使用了`Cloudflare`来进行`DNS`解析， 然后通过`cloudflare-nginx`来进行反向代理， 转发https流量。 最后是有了这玩意儿， 只不过访问速度却不大稳定。 然而对于我这种没有多少人来瞎逛， 甚至于我自己也不想折腾的博客， 这也并不是什么问题， 毕竟我想要的只是那个小绿板而已。

![小绿](https://assets.noteawesome.com/testUpload/2017-3-24/18549/image.png)

最开始是准备使用七牛云存储来作为图床啊啥的的， 然后想利用它的`CDN`， 结果在我付了费之后， 提示我要使用`CDN`需要先备案， 而备案这件事， 我又嫌麻烦， 不想折腾。 前段时间为了使用`https`准备买台主机， 自己搭建服务器的， 不过后来买了台6元包年的不知道啥玩意儿。 反正是可以备案了。 说到备案这件事... 似乎扯远了。 还是直接开始正题吧。

因为平时想要上传图片进行使用是非常不方便的事情， `GitHub`的issue里面是可以粘贴图片上传的， 但是里面上传图片经常都会失败， 而七牛云存储的网页里面， 也只能够选择文件上传或者拖拽上传， 并不能粘贴上传，使用多次感到不适之后， 终于难以忍受， 然后就写了这玩意儿， 其实缘由很简单， 我只是想上传图片方便点而已， 粘贴截图， 上传， 然后就能够拿到上传地址， 使用。

### 使用
本项目基于[七牛js-sdk](https://github.com/qiniu/js-sdk), [node-sdk](https://github.com/qiniu/nodejs-sdk.v6), 而`js-sdk`又是基于`moxie`和`plupload`， 然后后面两个都不提供`npm`包， 似乎是没有？我在他们官网上好像没看到。 为了方便我就直接拷贝过来了， 对于`js-sdk`的源码有小幅度改动。

#### 修改配置文件
* 在根目录下从qiniu.default.conf.js新建`qiniu.conf.js`
```bash
cp qiniu.default.conf.js qiniu.conf.js
```

* 将`qiniu.conf.js`里面的`ACCESS_KEY`、`SECRET_KEY`、`DOMAIN_NAME`和`BUCKET_NAME` 替换成自己的。

* 安装依赖
```bash
yarn
# or
npm install
```
* 然后运行`npm start`， 访问`http://localhost:4999`就可以上传文件了o(╯□╰)o

虽然似乎， 为了上传文件专门搞一个这个有点麻烦， 但是我实在找不到更好的图床了。

### 一些坑
以下是七牛[node-sdk](https://developer.qiniu.com/kodo/sdk/nodejs)里面的介绍
![七牛](https://assets.noteawesome.com/testUpload/2017-3-24/86187/image.png)

以后再写吧。
