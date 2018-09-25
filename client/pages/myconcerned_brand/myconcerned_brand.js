// pages/myconcerned_brand/myconcerned_brand.js
var app = new getApp();
var baseUrl = app.globalData.baseUrl;
var offsetA = "";
var conInfoArr = '';
var beforeData = [];
//存储多次请求数据
var afterData = [];
Page({

  /**
   * 页面的初始数据
   */
  data: {
    conBrand:'',
    nomore: false,
    more: true,
    //没有关注产品时
    moPsg: false,
    isNot:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this = this;
    _this.setData({
      isNot: options.isNot
    })
    wx.getStorage({
      key: 'userInfo',
      success: function(res) {
        wx.request({
          url: baseUrl + 'im/attention_brand',
          data: {
            id: res.data.msg[0].id,
            uid: res.data.msg[0].uid,
            // limit: 20,
            limit: 5,
            offset: offsetA,
            // id: "10082",
            // uid: "9aa32f382d4857f4a3c4212647766fb8"
          },
          method: 'post',
          success: function (res) {
            console.log(res.data.msg)
            beforeData = res.data.msg;
            afterData = afterData.concat(beforeData)
            _this.setData({
              conBrand: res.data.msg
            })
            if (res.data.msg.length == 0) {
              _this.setData({
                noPsg: true
              })
            }
            if (res.data.msg.length < 5) {
              _this.setData({
                more: false
              })
              
            }
          }
        })
      },
    })
  },
  more: function () {
    var _this = this;
    console.log(offsetA)
    offsetA += 5;

    wx.getStorage({
      key: 'userInfo',
      success: function (res) {
        wx.request({
          url: baseUrl + 'im/attention_brand',
          data: {
            id: res.data.msg[0].id,
            uid: res.data.msg[0].uid,
            // limit: 20,
            limit: 5,
            offset: offsetA,
            // id: "10082",
            // uid: "9aa32f382d4857f4a3c4212647766fb8"
          },
          method: "post",
          success: function (res) {
            console.log(res.data.msg)
            beforeData = res.data.msg;
            afterData = afterData.concat(beforeData)
            _this.setData({
              conBrand: afterData
            })
            if (res.data.msg.length < 5) {
              _this.setData({
                more: false
              })
              afterData = []
              return;
            }
          }
        })
      },
    })
  },
})