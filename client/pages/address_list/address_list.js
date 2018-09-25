// pages/address_list/address_list.js
var app = getApp();
var baseUrl = app.globalData.baseUrl;
Page({

  /**
   * 页面的初始数据
   */
  data: {
     addressInfo:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this = this;
   _this.request();
  },
  request:function(){
    var _this = this;
    wx.getStorage({
      key: 'userInfo',
      success: function(res) {
        wx.request({
          url: baseUrl + 'im/account_adderss_list',
          data: {
            userid: res.data.msg[0].id,
            uid: res.data.msg[0].uid,
          },
          method: "post",
          success: function (res) {
            console.log(res.data)
            _this.setData({
              addressInfo: res.data.msg
            })
          }
        })
      },
    })
  },
  // 订单
  order:function(){
    wx.requestPayment({
      timeStamp: '',
      nonceStr: '',
      package: '',
      signType: '',
      paySign: '',
    })
  },
  add_address: function () {
    wx.navigateTo({
      url: '../modelTest/modelTest',
    })
   },
  
  // 删除
  delate:function(e){
    var _this = this;
    wx.getStorage({
      key: 'userInfo',
      success: function(res) {
        wx.request({
          url: baseUrl + '/im/del',
          data: {
            userid: res.data.msg[0].id,
            uid: res.data.msg[0].uid,
            address_id: e.currentTarget.dataset.id
          },
          method: "post",
          success: function (res) {
            _this.request();
          }
        })
      },
    })
  },
  // 编辑
  edit:function(e){
    console.log(e)
   wx.navigateTo({
     url: '../edit_address/edit_address?id='+ e.currentTarget.dataset.id,
   })
  },
  // 默认地址
  xuanzhong:function(e){
    var _this = this;
   console.log(e.currentTarget.dataset.id)
   wx.getStorage({
     key: 'userInfo',
     success: function (res) {
       wx.request({
         url: baseUrl + 'im/change_account_address',
         data: {
           userid: res.data.msg[0].id,
           uid: res.data.msg[0].uid,
           address_id: e.currentTarget.dataset.id
         },
         method: "post",
         success: function (res) {
           _this.request();
         }
       })
     },
   })
  },
  jumpAddress:function(e){
    console.log(e)
    wx.redirectTo({
      url: '../shop/shop?id=' + e.currentTarget.dataset.id,
    })
  },
})