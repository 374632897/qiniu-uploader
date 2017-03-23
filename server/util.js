const qiniu = require('qiniu');
const conf  = require('../qiniu.conf.js');

Object.assign(qiniu.conf, conf);

exports.uptoken = function uptoken (bucket, key) {
  const putPolicy = new qiniu.rs.PutPolicy(bucket + ":" + key);
  return putPolicy.token();
}

// exports.uploadFile = async function uploadFile (uptoken, key, localFile) {
//   const extra = new qiniu.io.PutExtra();
//   return await new Promise((resolve, reject) => {
//     qiniu.io.putFile(uptoken, key, localFile, extra, function (err, ret) {
//       if (err) return reject(err);
//       resolve(ret);
//     });
//   })
// }

// console.info(exports.uptoken('blog2', 'test.jpg'));
