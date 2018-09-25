// pages/1/1.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  },
  testSubmit: function (e) {
    var self = this;
    let _access_token = '5_E1pZJQzTC-lC0r-JJz9wVAZv5Zv22CNtmV_7C1T0sqC9TV7mGE4FTmDX2B0PVM4LaGtaTfXwzfJLnD7fDKTg8DOICJNkKBQgn_Ot2zYmBJyY1g1VXoBNdtwUE0QaP8_9tWlbR-Zq7L1OyrrPKCIjAEAOGM';
    let url = 'https://api.weixin.qq.com/cgi-bin/message/wxopen/template/send?access_token=' + _access_token

      ; let _jsonData = {
        access_token: _access_token,
        touser: 'o00j60ARPZhtqAeaigdzA4dIJtt4',
        template_id: '_CfGS7SqVyNPg9Op8OXzMp6aOl7X9rCkrRfiMcccms8',
        form_id: e.detail.formId,
        page: "pages/index/index",
        data: {
          "keyword1": { "value": "测试数据一", "color": "#173177" },
          "keyword2": { "value": "测试数据二", "color": "#173177" },
          "keyword3": { "value": "测试数据三", "color": "#173177" },
          "keyword4": { "value": "测试数据四", "color": "#173177" },
        }
      }
    wx.request({
      url: url,
      data:_jsonData.data,
      method: 'post',
      success: function (res) {
        console.log(res)
      },
      fail: function (err) {
        console.log('request fail ', err);
      },
      complete: function (res) {
        console.log("request completed!");
      }

    }) 
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})