const qiniu = require('qiniu');
const chalk = require('chalk');
let conf;
try {
  conf = require('../config/secret.conf');
} catch (e) {
  console.log(chalk.red('没有找到') + chalk.green(' config/secret.conf.js ') + chalk.red('文件'))
  console.log(chalk.green('请根据 config/secret.default.conf.js 完成该文件的配置'));
  process.exit(1);
}

Object.assign(qiniu.conf, conf);

exports.uptoken = function uptoken (bucket, key) {
  const name = key ? bucket + ':' + key : bucket;
  const putPolicy = new qiniu.rs.PutPolicy(name);
  return putPolicy.token();
}
