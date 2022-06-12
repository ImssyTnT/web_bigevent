$(function () {
  // 初始化富文本编辑器
  initEditor();
  const form = layui.form;
  // 获取文章类别
  const initCate = () => {
    //   发起请求
    $.ajax({
      method: 'GET',
      url: '/my/article/cates',
      success: (res) => {
        // 解构对象
        const { status, message } = res;
        // 判断请求是否成功 如果失败提示用户
        if (status !== 0) return larye.msg(message);
        // 如果成功 渲染页面
        const htmlStr = template('tpl-cate', res);
        $('[name=cate_id]').html(htmlStr);
        form.render('select');
      },
    });
  };
  // 1. 初始化图片裁剪器
  var $image = $('#image');

  // 2. 裁剪选项
  var options = {
    aspectRatio: 400 / 280,
    preview: '.img-preview',
  };

  // 3. 初始化裁剪区域
  $image.cropper(options);
  // 模拟文件上传点击事件
  $('#btnChooseImage').click(() => {
    $('#coverfile').click();
  });
  //   监听文件上传 change 事件
  $('#coverfile').change((e) => {
    const files = e.target.files.length;
    if (files.length === 0) return;
    const file = e.target.files[0];
    const imgUrl = URL.createObjectURL(file);
    // 为裁剪区域重新设置图片
    $image
      .cropper('destroy') // 销毁旧的裁剪区域
      .attr('src', imgUrl) // 重新设置图片路径
      .cropper(options); // 重新初始化裁剪区域
  });
  // 定义一个状态变量
  let atr_state = '已发布';
  // 点击草稿按钮 将状态变量改变
  $('#btnSave2').click(() => {
    atr_state = '草稿';
  });
  // 发布文章前 整理数据
  // 监听form表单提交事件
  $('#form-pub').submit(function (e) {
    //   阻止默认提交事件
    e.preventDefault();
    const fd = new FormData($(this)[0]);
    fd.append('state', atr_state);
    // 将封面裁剪过后的图片，输出为一个文件对象
    $image
      .cropper('getCroppedCanvas', {
        // 创建一个 Canvas 画布
        width: 400,
        height: 280,
      })
      .toBlob(function (blob) {
        // 将 Canvas 画布上的内容，转化为文件对象
        // 得到文件对象后，进行后续的操作
        // 将文件对象，存储到 fd 中
        fd.append('cover_img', blob);
        // 发起 ajax 数据请求
        publishArticle(fd);
      });
  });
  // 提交发布文章 请求
  const publishArticle = (fd) => {
    $.ajax({
      method: 'POST',
      url: '/my/article/add',
      data: fd,
      contentType: false,
      processData: false,
      success: (res) => {
        // 解构对象
        const { status, message } = res;
        // 判断发布文章请求是否成功
        // 如果失败 提示用户
        if (status !== 0) return layer.msg(message);
        // 如果成功
        // 跳转到文章列表页面
        location.href = '/article/art_list.html';
        window.parent.change();
      },
    });
  };
  // 调用函数
  initCate();
});
