$(function () {
  // 点击注册 让登录页面隐藏
  $('#link_reg').click(function () {
    $(this).parents('.login-box').hide().siblings('.reg-box').show();
  });
  // 点击登录 让注册页面隐藏
  $('#link_login').click(function () {
    $(this).parents('.reg-box').hide().siblings('.login-box').show();
  });
  // 获取 form 来自 layui
  const form = layui.form;
  // 调用form.verify方法来验证密码是否合法
  form.verify({
    // 数组方式
    password: [/^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'],
    repwd: (value) => {
      const pwd = $('.reg-box [name=password]').val();
      if (pwd !== value) return '两次密码不一致';
    },
  });
  // 监听表单注册提交事件
  $('#form_reg').submit((e) => {
    // 阻止默认提交事件
    e.preventDefault();
    // 发起ajax请求
    $.ajax({
      type: 'POST',
      url: '/api/reguser',
      data: {
        username: $('#form_reg [name=username]').val(),
        password: $('#form_reg [name=password]').val(),
      },
      success: function (res) {
        // 结构对象
        const { status, message } = res;
        // 如果注册失败提示用户
        if (status !== 0) return layer.msg(message);
        // 如果注册成功 提示用户 并且跳转回登录页面
        layer.msg(
          message,
          {
            time: 1500,
          },
          function () {
            // 模拟点击事件 跳转到登录页面
            $('#link_login').click();
          }
        );
      },
    });
  });
  // 监听表单登录提交事件
  $('#form_login').submit(function (e) {
    e.preventDefault();
    $.ajax({
      type: 'POST',
      url: '/api/login',
      data: $(this).serialize(),
      success: (res) => {
        const { status, message, token } = res;
        if (status !== 0) return layer.msg('登录失败');
        layer.msg('登录成功');
        localStorage.setItem('token', token);
        location.href = '/index.html';
      },
    });
  });
});
