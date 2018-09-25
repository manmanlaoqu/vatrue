// pages/code_history/code_history.js
var app = getApp();
var baseUrl = app.globalData.baseUrl;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    uniqid:"",
    code_msg:[],
    nickName:''
  },
  // 图片点击预览
  imgYu:function(event){
    var src = event.currentTarget.datasset.src; //获取data-src
    var imgList = event.currentTarget.dataset.list;  //获取data-list
    //图片预览
    wx.previewImage({
      current:src,  //当前显示图片的http链接
      urls: [],  //需要预览的图片的http链接列表
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      var _this = this;
      wx.showLoading({
        title: '加载中',
      })
      //将缓存中的uniqid取出
      wx.getStorage({
        key: 'uniqid',
        success: function(res) {
          console.log(res.data)
          _this.setData({
            uniqid:res.data
          })
          // 发送请求获取扫码记录信息
          wx.request({
            url: baseUrl + 'trace/uniqid_scan_record',
            method: "post",
            data: {
              uniqid: _this.data.uniqid
            },
            success: function (res) {
              wx.hideLoading()
              // 如果昵称太长截取一部分
              var data = res.data.msg;
              for (var i = 0; i < data.length; i++) {
                if (data[i].nickname.length > 5) {
                  data[i].nickname = data[i].nickname.substr(0,5) + '...';
                }                
              }
              for(var i = 0; i < data.length;i++){
                if(data[i].ip.length >7){
                  data[i].ip = data[i].ip.substr(0,10)+"...";
                }
              }
                wx.setStorage({
                  key: 'code_msg',
                  data:res.data.msg,
                })
               var code_history_content = [];
                wx.getStorage({
                  key: 'code_msg',
                  
                  success: function(res) {

                    code_history_content.push(res.data)
                    console.log(res.data)
                    _this.setData({
                      code_msg:res.data
                    })
                    
                  },
                })                
            }
          })
        },
      })
  },
})