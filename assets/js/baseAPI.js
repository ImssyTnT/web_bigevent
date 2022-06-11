// 注意：每次调用 $.get() 或 $.post() 或 $.ajax() 的时候，
// 会先调用 ajaxPrefilter 这个函数
// 在这个函数中，可以拿到我们给Ajax提供的配置对象
$.ajaxPrefilter((options) => {
  // 在发起真正的 Ajax 请求之前，统一拼接请求的根路径
  options.url = 'http://www.liulongbin.top:3007' + options.url;
  //  判断接口是否是需要token身份认证信息
  if (options.url.includes('/my/')) {
    // 在请求头中注入token身份认证
    options.headers = {
      Authorization: localStorage.getItem('token'),
    };
  }
  // 登录校验
  options.complete = (res) => {
    // 解构对象
    const { responseJSON } = res;
    const { status, message } = responseJSON;
    // 判断服务器响应的数据
    if (status === 1 && message === '身份认证失败！') {
      // 如果未登录或 token 过期
      // 1.清空token
      localStorage.removeItem('token');
      // 2.强制跳转回登录页面
      location.href = '/login.html';
    }
  };
});
