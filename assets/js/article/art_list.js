$(function () {
  const form = layui.form;
  const laypage = layui.laypage;
  // 定义一个查询的参数对象，将来请求数据的时候，
  // 需要将请求参数对象提交到服务器
  const q = {
    pagenum: 1, // 页码值，默认请求第一页的数据
    pagesize: 2, // 每页显示几条数据，默认每页显示2条
    cate_id: '', // 文章分类的 Id
    state: '', // 文章的发布状态
  };
  // 获取表格数据请求
  const initTable = () => {
    $.ajax({
      method: 'GET',
      url: '/my/article/list',
      data: q,
      success: (res) => {
        const { status, message, total } = res;
        if (status !== 0) return layer.msg(message);
        const htmlStr = template('tpl-table', res);
        $('tbody').html(htmlStr);
        renderPage(total);
      },
    });
  };
  // 获取文章列表请求
  const initCate = () => {
    $.ajax({
      method: 'GET',
      url: '/my/article/cates',
      success: (res) => {
        const { status, message } = res;
        if (status !== 0) return layer.msg(message);
        const htmlStr = template('tpl-cate', res);
        $('[name=cate_id]').html(htmlStr);
        form.render('select');
      },
    });
  };
  // 筛选功能
  $('#form-search').submit((e) => {
    e.preventDefault();
    q.cate_id = $('[name=cate_id]').val();
    q.state = $('[name=state]').val();
    initTable();
  });
  // 分页函数
  const renderPage = (total) => {
    laypage.render({
      elem: 'pageBox',
      count: total,
      limit: q.pagesize,
      curr: q.pagenum,
      layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
      limits: [2, 3, 5, 10], // 每页展示多少条
      jump: (obj, first) => {
        q.pagenum = obj.curr;
        q.pagesize = obj.limit;
        if (!first) {
          initTable();
        }
      },
    });
  };
  // 删除文章  通过事件委托
  $('tbody').on('click', '.btn-delete', function () {
    const id = $(this).attr('data-id');
    const btnNum = $('.btn-delete').length;
    layer.confirm('确认删除?', { icon: 3, title: '提示' }, function (index) {
      $.ajax({
        method: 'GET',
        url: '/my/article/delete/' + id,
        success: (res) => {
          const { status, message } = res;
          if (status !== 0) return layer.msg(message);
          if (btnNum === 1) {
            q.pagenum = q.pagenum === 1 ? 1 : --q.pagenum;
          }
          initTable();
          layer.close(index);
        },
      });
    });
  });
  // 调用函数
  initTable();
  initCate();
  // 定义美化时间的过滤器
  template.defaults.imports.dataFormat = function (date) {
    const dt = new Date(date);

    var y = dt.getFullYear();
    var m = padZero(dt.getMonth() + 1);
    var d = padZero(dt.getDate());

    var hh = padZero(dt.getHours());
    var mm = padZero(dt.getMinutes());
    var ss = padZero(dt.getSeconds());

    return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss;
  };

  // 定义补零的函数
  function padZero(n) {
    return n > 9 ? n : '0' + n;
  }
});
