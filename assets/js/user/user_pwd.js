$(
  (function () {
    const form = layui.form;
    // 自定义验证规则
    form.verify({
      // 密码验证
      pwd: [/^[\S]{6,12}$/, '密码必须6到12位,且不能出现空格'],
      // 校验新密码和原密码是否相同
      samePwd: (value) => {
        if (value === $('[name=oldPwd]').val()) return '新密码不能和原密码相同';
      },
      //   校验确认密码和新密码是否相同
      rePwd: (value) => {
        if (value !== $('[name=newPwd]').val()) return '新密码和确认密码不相同';
      },
    });
    // 向服务器提交新密码
    $('.layui-form').submit(function (e) {
      // 阻止默认提交事件
      e.preventDefault();
      $.ajax({
        method: 'POST',
        url: '/my/updatepwd',
        data: $(this).serialize(),
        success: (res) => {
          // 解构对象
          const { status, message } = res;
          //   判断请求是否成功
          //   如果不成功则提示用户
          if (status !== 0) return layer.msg(message);
          //   如果成功 清空本地缓存中的 token
          localStorage.removeItem('token');
          //   跳转到登录页面
          window.parent.location.href = '/login.html';
        },
      });
    });
  })
);
