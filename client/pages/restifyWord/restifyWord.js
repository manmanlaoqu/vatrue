// pages/restifyWord/restifyWord.js
var app = getApp();
var baseUrl = app.globalData.baseUrl;
// var num = 1
var numChange = 1
Page({

  /**
   * 页面的初始数据
   */
  data: {
    codeImg:'',
    num:1,
    // 用户信息
    account:'',
    oldpassword:'',
    newpassword:'',
    restifypassword:'',
    code:''
  },
  changeCode:function(){
    numChange++
    this.setData({
      num:numChange
    })
  },
  submit:function(e){
   console.log(e.detail.value)
    var _this = this;
    _this.setData({
      account: e.detail.value.account,
      oldpassword: e.detail.value.oldpassword,
      newpassword: e.detail.value.newpassword,
      restifypassword: e.detail.value.restifypassword,
      code: e.detail.value.code
    })
  },
  confirmRestify:function(){
    var _this = this;
   
    wx.request({
      url: baseUrl + 'im/change_password',
      data:{
        captcha_code: _this.data.code,
          newPassWord:_this.data.newpassword,
          oldPassWord: _this.data.oldpassword,
          username: _this.data.account
      },
      method:'post',
      success:function(res){
        console.log(res.data)
        if (!_this.data.account){
          wx.showToast({
            title: '请输入账号',
            icon: 'none'
          })
        } else if (!_this.data.newpassword){
          wx.showToast({
            title: '请输入密码',
            icon: 'none'
          })
        } else if (!_this.data.oldpassword){
          wx.showToast({
            title: '请输入密码',
            icon: 'none'
          })
        } else if (!_this.data.code){
          wx.showToast({
            title: '请输入验证码',
            icon: 'none'
          })
        } else if (_this.data.newpassword != _this.data.restifypassword){
          wx.showToast({
            title: '两次输入密码不一致',
            icon: 'none'
          })
        } else if (res.data.msg == '不存在该用户'){
          wx.showToast({
            title: '不存在该用户',
            icon: 'none'
          })
        }else if (res.data.msg == "密码修改成功"){
          wx.showToast({
            title: '密码修改成功',
            icon: 'none'
          })
        } else if (res.data.msg == "旧密码错误"){
          wx.showToast({
            title: '旧密码错误',
            icon: 'none'
          })
        } else if (res.data.msg == "验证码错误"){
          wx.showToast({
            title: '验证码错误',
            icon: 'none'
          })
          numChange++
          _this.setData({
            num: numChange
          })
        }
       
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this = this;
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