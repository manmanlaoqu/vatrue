// pages/check/check.js
var app = getApp();
var baseUrl = app.globalData.baseUrl;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    farm_info:"",
    uniqid:'',
    checkData:'',
    // 是否认证
    cert:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options.cert)

    wx.showLoading({
      title: '加载中',
    })
    var _this = this;
    _this.setData({
      cert:options.cert
    })
      wx.getStorage({
        key: 'farm_info',
        success: function(res) {
          console.log(res.data)
          wx.hideLoading()
        _this.setData({
          farm_info:res.data
        })
        _this.requestData(res.data.uniqid)
        },
      })
  },
  requestData:function(res){
    var _this = this;
      wx.request({
        url: baseUrl + 'trace/fake_verification',
        data:{
          uniqid:res
        },
        method:"post",
        success:function(res){
          wx.hideLoading();
          console.log(res.data.msg[0])
          wx.setStorage({
            key: 'checkData',
            data: res.data.msg[0],
          })
          wx.getStorage({
            key: 'checkData',
            success: function(res) {
              _this.setData({
                checkData:res.data
              })
            },
          })
        }
      })
  },
})