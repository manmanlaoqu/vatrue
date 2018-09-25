// pages/set/set.js
var user = ''
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this = this;
    wx.getStorage({
      key: 'userInfo',
      success: function(res) {
        user = res.data.msg[0]
        console.log(res.data)
        _this.setData({
          userInfo:res.data.msg[0]
        })
      },
    })
    // 如果退出登录，userInfo为空,重新登录
    if (user == ''){
      wx.redirectTo({
        url: '../reLogin/reLogin',
      })
    }
  },
  back:function(){
    wx.showModal({
      title: '',
      content: '确定退出登录',
      success:function(){
        wx.redirectTo({
             url: '../reLogin/reLogin',
         })
        //  wx.setStorage({
        //    key: 'userInfo',
        //    data: '',
        //  })
        wx.removeStorage({
          key: 'userInfo',
          success: function(res) {},
        })
      },
      fail:function(){
      }
    })
   
  // wx.switchTab({
  //   url: '../person/person',
  // })
  },
  restify:function(){
      wx.navigateTo({
        url: '../restifyWord/restifyWord',
        success: function(res) {},
        fail: function(res) {},
        complete: function(res) {},
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