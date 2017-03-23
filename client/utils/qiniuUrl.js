const qiniuUrl = [
  'http://upload.qiniu.com',// 东
  'http://upload-z1.qiniu.com', // 北
  'http://upload-z2.qiniu.com', // 南
  'http://upload-na0.qiniu.com' // 北美
];
const areaSuffix = [
  '',
  '-z1',
  '-z2',
  '-na0'
];

const getFullUrl = (area) => {
  return {
    ioHttp: `http://iovip${area}.qbox.me`,
    ioHttps: `https://iovip${area}.qbox.me`,
    upHttp: `http://up${area}.qiniu.com`,
    uploadHttp: `http://upload${area}.qiniu.com`,
    upHttps: `https://upload${area}.qbox.me`,
    uploadHttps: `https://upload${area}.qbox.me`,
  }
};

const FullUrl = areaSuffix.map(getFullUrl);

export default FullUrl;
