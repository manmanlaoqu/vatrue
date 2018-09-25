// pages/myconcerned_content/myconcerned_content.js
var app = getApp();
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
    contentInfo:[],
    more: true,
    //没有关注产品时
    moPsg: false,
    isNot:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '加载中',
    })
    var _this = this;
    _this.setData({
      isNot: options.isNot
    })
    wx.getStorage({
      key: 'userInfo',
      success: function(res) {
        wx.request({
          url: baseUrl + 'im/select_account_favorite',
          data: {
            id: res.data.msg[0].id,
            uid: res.data.msg[0].uid,
            // limit: 20,
            limit: 5,
            offset:0,
            // id: "10082",
            // uid: "9aa32f382d4857f4a3c4212647766fb8"
          },
          method: 'post',
          success: function (res) {
            console.log(res.data.msg)
            wx.hideLoading();
            // beforeData = res.data.msg;
            if (res.data.msg) {
              for (var i = 0; i < res.data.msg.length; i++) {
                if (res.data.msg[i].content) {
                  var length = res.data.msg[i].content.split('').length;
                  if (length > 34) {
                    res.data.msg[i].content = res.data.msg[i].content.substr(0, 34) + '...'
                  }
                }
              }
            }
           
             beforeData = res.data.msg;
             afterData = afterData.concat(beforeData)
             _this.setData({
               contentInfo: res.data.msg
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
              return;
            }
          }
        })
      },
    })
  },
  jumpLong:function(e){
    console.log(e.currentTarget.dataset.id)
    wx.navigateTo({
      url: '../../pages/state/longPag/longPag?id=' + e.currentTarget.dataset.id,
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  more:function(){
    var _this = this;
    offsetA += 5;
    wx.getStorage({
      key: 'userInfo',
      success: function(res) {
        wx.request({
          url: baseUrl + 'im/select_account_favorite',
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
            // 内容太长截取
            if (res.data.msg) {
              for (var i = 0; i < res.data.msg.length; i++) {
                if (res.data.msg[i].content) {
                  var length = res.data.msg[i].content.split('').length;
                  if (length > 34) {
                    res.data.msg[i].content = res.data.msg[i].content.substr(0, 34) + '...'
                  }
                }
              }
            }
            for (var i = 0; i < res.data.msg.length; i++) {
              if (res.data.msg[i].content) {
                var length = res.data.msg[i].content.split('').length;
                if (length > 34) {
                  res.data.msg[i].content = res.data.msg[i].content.substr(0, 34) + '...'

                }
              }
            }
            beforeData = res.data.msg;
            console.log(beforeData)
            afterData = afterData.concat(beforeData)
            _this.setData({
              contentInfo: afterData
            })
              console.log(afterData)
              _this.setData({
                contentInfo: afterData
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