const $pasteEle = document.getElementById('paste');

$pasteEle.addEventListener('paste', function(e){
    for (var i = 0; i < e.clipboardData.items.length; i++) {
        // 检测是否为图片类型
        if (e.clipboardData.items[i].kind == "file" && /image\//.test(e.clipboardData.items[i].type)) {
            var file = e.clipboardData.items[i].getAsFile();
            window.uploader.addFile(file);
            // var fileReader = new FileReader();
            // fileReader.onloadend = function(e) {
            //     //图片的base64编码
            //     console.log(e.target.result);

            //     //这里设置获取token的数据
            //     var thetoken = '';
            //     var head = {
            //         "cmd": 0x4000C,
            //         "uid": parseInt(EXTUID),
            //         "ver": 1,
            //         "sid": SID,
            //         "apptype":1,
            //         "entry_type": 2
            //         }
            //     var rdata = {
            //         "head":head
            //         }
            //     rdata = JSON.stringify(rdata);
            //     //获取后台的给的token
            //     $.post(request_url_server,rdata,function(data,status){
            //         if (status == "success") {
            //             if (data['ret'] == 0){
            //                 var thetoken = data['token'];
            //                 pubt64(e.target.result.replace('data:image/png;base64,',''), imageFile, thetoken);
            //             }
            //         }
            //     });
            // };
            //  //将文件读取为DataUrl
            // fileReader.readAsDataURL(imageFile);
            // e.preventDefault();
            break;
        }
    }
});
