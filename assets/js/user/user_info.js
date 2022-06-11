$(
  (function () {
    // 获取form方法
    const form = layui.form;
    // 自定义检验规则
    form.verify({
      nickname: (value) => {
        if (value.length > 6) return '用户名长度不能超过6个字符';
      },
    });

    // 获取用户基本信息
    const initUserInfo = () => {
      // 发起获取用户信息请求
      $.ajax({
        method: 'GET',
        url: '/my/userinfo',
        success: (res) => {
          const { status, data, message } = res;
          if (status !== 0) return layer.msg('获取用户信息失败');
          //   layer.msg('获取用户信息成功');
          // 填充表单
          form.val('formUserInfo', data);
        },
      });
    };
    // 重置功能
    $('#btnReset').click((e) => {
      e.preventDefault();
      initUserInfo();
    });
    // 更新用户信息
    $('.layui-form').submit(function (e) {
      // 阻止默认提交事件
      e.preventDefault();
      // 发起更新用户信息请求
      $.ajax({
        method: 'POST',
        url: '/my/userinfo',
        data: $(this).serialize(),
        success: (res) => {
          const { status, message } = res;
          if (status !== 0) return layer.msg('更新用户信息失败!');
          //   layer.msg('更新用户信息成功');
          window.parent.getUserInfo();
        },
      });
    });
    // 调用函数
    initUserInfo();
  })
);
