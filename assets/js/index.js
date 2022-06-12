// 获取用户基本信息函数
function getUserInfo() {
  // 发起ajax请求
  $.ajax({
    method: 'GET',
    url: '/my/userinfo',
    success: (res) => {
      // 结构对象
      const { data, status, message } = res;
      // 如果获取数据失败 提示用户
      if (status !== 0) return layer.msg(message);
      // 如果获取数据成功 提示用户 并且调用渲染用户信息函数
      layer.msg(message);
      renderAvatar(data);
    },
    // 调用回调函数判断用户是否登录或 token 是否过期
    // 如果并未登录或者 token 过期则不允许进入主页
    // complete: (res) => {
    //   // 解构对象
    //   const { responseJSON } = res;
    //   const { status, message } = responseJSON;
    //   // 判断服务器响应的数据
    //   if (status === 1 && message === '身份认证失败！') {
    //     // 如果未登录或 token 过期
    //     // 1.清空token
    //     localStorage.removeItem('token');
    //     // 2.强制跳转回登录页面
    //     location.href = '/login.html';
    //   }
    // },
  });
}
// 渲染用户信息函数
const renderAvatar = (user) => {
  // 获取用户昵称或者账号名称
  const userName = user.nickname || user.username;
  // 获取完成之后渲染用户昵称模块
  $('#welcome').html(`欢迎 ${userName}`);
  // 渲染用户头像模块
  if (user.user_pic === null) {
    $('.layui-nav-img').hide();
    const first = userName[0].toUpperCase();
    $('.text-avatar').html(first).show();
  } else {
    $('.text-avatar').hide();
    $('.layui-nav-img').attr('src', user.user_pic).show();
  }
};
// 退出登录
$('#btnLoginout').click(() => {
  layer.confirm('是否退出登录?', { icon: 5, title: '提示' }, function (index) {
    // 1.清空本地储存的token
    localStorage.removeItem('token');
    // 2.跳转到登录页面
    location.href = '/login.html';
  });
});
// 调用函数
getUserInfo();
function change() {
  $('#change').addClass('layui-this').next().removeClass('layui-this');
}
