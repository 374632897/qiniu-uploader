const $pasteEle = document.getElementById('paste');

$pasteEle.addEventListener('paste', (e) => {
  const items = e.clipboardData.items;
  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    // 检测是否为图片类型
    if (
      item.kind == "file"
      && /image\//.test(item.type)
    ) {
      var file = e.clipboardData.items[i].getAsFile();
      window.uploader.addFile(file);
      break;
    }
  }
});
