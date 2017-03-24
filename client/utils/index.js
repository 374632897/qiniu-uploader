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
  var url = `${BASE_URL}/putb64/${size}`; // 上传域名

  var xhr = new XMLHttpRequest();

  xhr.onreadystatechange = function() {
    if (xhr.readyState==4){
      cb(JSON.parse(xhr.responseText));
    }
  }
  xhr.open("POST", url, true);
  xhr.setRequestHeader("Content-Type", "application/octet-stream");
  xhr.setRequestHeader("Authorization", "UpToken " + token);
  xhr.send(pic);
};

export readFile;
export uploadBase64;
