import qiniuUrl from './qiniuUrl';

const BASE_URL = qiniuUrl[2].uploadHttps;

const isImage = (mimeType) => /image/.test(mimeType);

const readFile = (file, cb = function () {}) => {
  const fileReader = new FileReader();
  fileReader.onloadend = (e) => {
    cb(e.target.result);
  };
  fileReader.readAsDataUrl(file);
};

const uploadBase64 = ({ pic, size, token, cb: function () {} }) => {
  // var pic = '';// base64字符串
      //imageFile.size为图片流的大小
  // var url = "http://upload.qiniu.com/putb64/" + imageFile.size; // 上传域名
  var url = `${BASE_URL}/putb64/${size}`; // 上传域名

  var xhr = new XMLHttpRequest();

  xhr.onreadystatechange = function() {
    if (xhr.readyState==4){
      cb(JSON.parse(xhr.responseText));
      // // 成功
      // console.log(xhr.responseText);
      // //转换成json对象，包含key值，hash值。
      // var dataImg = JSON.parse(xhr.responseText);
      // //发送给服务端消息
      // sendImg('paste', dataImg);
    }
  }
  xhr.open("POST", url, true);
  xhr.setRequestHeader("Content-Type", "application/octet-stream");
  xhr.setRequestHeader("Authorization", "UpToken " + token);
  xhr.send(pic);
};

export readFile;
export uploadBase64;
