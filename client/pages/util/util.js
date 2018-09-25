
function getSearchMusic(keyword, pageindex, callbackcount, callback) {
  wx.request({
    url: 'https://webapp.farmtruth.cn/test/index.php/small/trace/unity_origin_list',
    data: {
      num: callbackcount,  //返回数据的个数
      p: pageindex,
   
    },
    method: 'GET',
    header: { 'content-Type': 'application/json' },
    success: function (res) {
      if (res.statusCode == 200) {
        callback(res.data);
      }
    }
  })
}

module.exports = {
  getSearchMusic: getSearchMusic
}