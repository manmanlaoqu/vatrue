// pages/person/person.js
var app = getApp();
var baseUrl = app.globalData.baseUrl;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo:'',
    mycount:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this = this;
      wx.getStorage({
        key: 'userInfo',
        success: function(res) {
          console.log(res.data.msg[0])
          _this.setData({
            userInfo:res.data.msg[0]
          })

          //请求数据
          wx.request({
            url: baseUrl + 'im/my_count',
            data: {
              uid: res.data.msg[0].uid,
              userid: res.data.msg[0].id,
              // uid  :"9aa32f382d4857f4a3c4212647766fb8",
              // userid:"10082"
              
            },
            method:'post',
            success:function(res){
              console.log(res.data.msg)
              _this.setData({
                mycount: res.data.msg
              })
            }
          })
        },
      })

  },
  myconcerned_product:function(){
    var _this = this;
    wx.navigateTo({
      url: '../myconcerned_product/myconcerned_product?isNot=' + _this.data.mycount.products,
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  myconcerned_brand:function(){
      wx.navigateTo({
        url: '../myconcerned_brand/myconcerned_brand?isNot='+ this.data.mycount.farms,
      })
  },
  myconcerned_content:function(){
    wx.navigateTo({
      url: '../myconcerned_content/myconcerned_content?isNot=' + this.data.mycount.favorites,
    })
  },
  myconcerned_code:function(){
      wx.navigateTo({
        url: '../myconcerned_code/myconcerned_code?isNot=' + this.data.mycount.scans,
      })
  },
  shop_list:function(){
    wx.navigateTo({
      url: '../myshop_list/myshop_list',
    })
  },
  calling: function () {
    wx.makePhoneCall({
      phoneNumber: '15635293987', //此号码并非真实电话号码，仅用于测试
      success: function () {
        console.log("拨打电话成功！")
      },
      fail: function () {
        console.log("拨打电话失败！")
      }
    })
  },
  share:function(){
    wx.navigateTo({
      url: '../share/share',
    })
  },
 setPage:function(){
  wx.navigateTo({
    url: '../set/set',
    success: function(res) {},
    fail: function(res) {},
    complete: function(res) {},
  })
 },
})