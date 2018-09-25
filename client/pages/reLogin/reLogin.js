// pages/reLogin/reLogin.js
var app = getApp();
var baseUrl = app.globalData.baseUrl;
// var num = 1
var numChange = 1
Page({

  /**
   * 页面的初始数据
   */
  data: {
    num: 1,
    password:'',
    account:'',
    code:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  },
  submit: function (e) {
    console.log(e.detail.value)
    var _this = this;
    _this.setData({
      account: e.detail.value.account,
      password: e.detail.value.password,
      code: e.detail.value.code
    })
  },
  login:function(){
    console.log(334)
    var _this = this;
    wx.request({
      url: baseUrl + 'im/login',
      data:{
        captcha_code:_this.data.code,
        password:_this.data.password,
        username:_this.data.account
      },
      method:'post',
      success:function(res){
        console.log(res.data)
        if (!_this.data.account){
          wx.showToast({
            title: '请输入账号',
            icon:'none'
          })
        } else if (!_this.data.password){
          wx.showToast({
            title: '请输入密码',
            icon: 'none'
          })
        } else if (!_this.data.code) {
          wx.showToast({
            title: '请输入验证码',
            icon: 'none'
          })
        } else if (res.data.msg == '不存在该用户') {
          wx.showToast({
            title: '不存在该用户',
            icon: 'none'
          })
        } else if (res.data.msg == '密码错误') {
          wx.showToast({
            title: '密码错误',
            icon: 'none'
          })
        } else if (res.data.msg == "验证码错误") {
          wx.showToast({
            title: '验证码错误',
            icon: 'none'
          })
          numChange++
          _this.setData({
            num: numChange
          })
        }else if(res.data.code == 0){
          // wx.showToast({
          //   title: '登录成功',
          //   icon: 'none'
          // })
          console.log(res.data.msg[0])
          // wx.setStorageSync('userInfo', res.data.msg[0])
          wx.setStorage({
            key: 'userInfo',
            data: res.data.msg[0],
          })
          wx.getStorage({
            key: 'userInfo',
            success: function(res) {
              console.log(res.data)
            },
          })
          // wx.switchTab({
          //   url: '../person/person?id=2',
          // })
        }
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