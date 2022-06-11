$(function () {
  // 初始化图片插件
  // 1.1 获取裁剪区域的 DOM 元素
  var $image = $('#image');
  // 1.2 配置选项
  const options = {
    // 纵横比
    aspectRatio: 1,
    // 指定预览区域
    preview: '.img-preview',
  };
  // 模拟点击文件上传按钮
  $('#btnChooseImage').click(() => {
    $('#file').click();
  });
  // 监听文件上传change事件
  $('#file').change((e) => {
    //   获取文件上传中的长度
    const filesLen = e.target.files.length;
    // 判断文件上传按钮按下之后是否选择了文件
    //   如果并未上传提示用户
    if (filesLen === 0) return '请上传文件';
    //   如果上传了声明一个变量接收该文件
    const file = e.target.files[0];
    //   将该文件转换成url地址
    const imgUrl = URL.createObjectURL(file);
    //   将该url地址渲染到页面上
    $image
      .cropper('destroy') // 销毁旧的裁剪区域
      .attr('src', imgUrl) // 重新设置图片路径
      .cropper(options); // 重新初始化裁剪区域
  });
  // 上传头像按钮
  $('#btnUpload').click(() => {
    // 1、拿到用户裁切之后的头像
    // 直接复制代码即可
    const dataURL = $image
      .cropper('getCroppedCanvas', {
        // 创建一个 Canvas 画布
        width: 100,
        height: 100,
      })
      .toDataURL('image/png');
    //   发送请求
    $.ajax({
      method: 'POST',
      url: '/my/update/avatar',
      data: {
        avatar: dataURL,
      },
      success: (res) => {
        //   解构对象
        const { status, message } = res;
        // 判断服务器响应是否成功
        // 如果失败 提示用户
        if (status !== 0) return layer.msg(message);
        // 如果成功 通知父页面更新头像
        // layer.msg(message);
        window.parent.getUserInfo();
      },
    });
  });
  // 1.3 创建裁剪区域
  $image.cropper(options);
});
