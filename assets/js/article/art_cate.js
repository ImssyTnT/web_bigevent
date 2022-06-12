$(function () {
  const form = layui.form;
  // 封装 Get 请求事件
  const initArtCateList = () => {
    $.ajax({
      method: 'GET',
      url: '/my/article/cates',
      success: (res) => {
        const { status, message } = res;
        if (status !== 0) return layer.msg(message);
        const htmlStr = template('tpl-table', res);
        $('tbody').empty().html(htmlStr);
      },
    });
  };
  // 给添加按钮绑定事件
  let indexAdd = null;
  $('#btnAddCate').click(() => {
    indexAdd = layer.open({
      type: 1,
      area: ['500px', '250px'],
      title: '添加文章分类',
      content: $('#dialog-add').html(),
    });
  });
  // 添加文章分类 通过事件委托
  $('body').on('submit', '#form-add', function (e) {
    // 阻止默认提交事件
    e.preventDefault();
    // 发起 POST 请求
    $.ajax({
      method: 'POST',
      url: '/my/article/addcates',
      data: $(this).serialize(),
      success: (res) => {
        //   解构对象
        const { status, message } = res;
        // 判断提交事件是否成功
        // 如果失败提示用户
        if (status !== 0) return layer.msg(message);
        // 如果成功 重新渲染页面
        initArtCateList();
        //   点击提交按钮后 关闭弹窗
        layer.close(indexAdd);
      },
    });
  });
  let indexEdit = null;
  // 添加编辑功能  通过事件委托
  $('tbody').on('click', '.btn-edit', function () {
    //   获取id 根据id编辑文章
    const id = $(this).attr('data-Id');
    //   渲染弹窗
    indexEdit = layer.open({
      type: 1,
      area: ['500px', '250px'],
      title: '修改文章分类',
      content: $('#dialog-edit').html(),
    });
    //   发送获取数据请求
    $.ajax({
      method: 'GET',
      url: '/my/article/cates/' + id,
      success: (res) => {
        //   解构对象
        const { status, data, message } = res;
        //   判断数据是否获取成功
        //   如果获取失败 提示用户
        if (status !== 0) return layer.msg(message);
        //   如果获取成功 渲染页面
        form.val('form-edit', data);
      },
    });
  });
  // 修改文章分类 通过事件委托
  $('body').on('submit', '#form-edit', function (e) {
    //   阻止默认提交事件
    e.preventDefault();
    //   发起更新数据请求
    $.ajax({
      method: 'POST',
      url: '/my/article/updatecate',
      data: $(this).serialize(),
      success: (res) => {
        //   解构对象
        const { status, message } = res;
        // 判断数据更新是否成功
        // 如果失败 提示用户
        if (status !== 0) return layer.msg(message);
        // 如果成功 重新渲染页面
        initArtCateList();
        //   点击修改按钮后 关闭弹窗
        layer.close(indexEdit);
      },
    });
  });
  //   删除文章分类 通过事件委托
  $('body').on('click', '.btn-delete', function (e) {
    //   获取id 根据id删除分类
    const id = $(this).attr('data-id');
    //   点击删除按钮后弹出询问框 询问是否删除
    layer.confirm('确定删除文章吗?', { icon: 3, title: '提示' }, (index) => {
      // 确定删除后发起 GET 请求 删除该文章分类
      $.ajax({
        method: 'GET',
        url: '/my/article/deletecate/' + id,
        success: (res) => {
          // 解构对象
          const { status, message } = res;
          // 判断请求是否成功
          // 如果失败提示用户
          if (status !== 0) return layer.msg(message);
          // 如果成功 重新渲染页面
          initArtCateList();
          // 点击确定按钮后 关闭弹窗
          layer.close(index);
        },
      });
    });
  });
  // 调用函数
  initArtCateList();
});
