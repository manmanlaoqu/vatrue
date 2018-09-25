// pages/myshop_list/myshop_list.js
var app = getApp();
var baseUrl = app.globalData.baseUrl
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderData:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this = this;
    // wx.request({
    //   url: baseUrl + 'im/orderdetail',
    //   data:{
    //     id:'',
    //     uid:'', 
    //     orderid:'',
    //   }
    // })

    wx.request({
      url: baseUrl + 'im/order',
      data:{
        order_status:'all',
        uid: "9aa32f382d4857f4a3c4212647766fb8",
        id:10082,
        limit:5,
        offset:0
      },
      // method:'post',
      success:function(res){
        console.log(res.data.msg)
        _this.setData({
          orderData:res.data.msg
        })
      }
    })
  },
})