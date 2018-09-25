// pages/myconcerned_product/myconcerned_product.js
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
    concernedInfo:[],
    appear:'',
    nomore:false,
    more:true,
    //没有关注产品时
    moPsg:false,
    // 是否有产品关注
    isNot:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options.isNot)
    var _this = this;
    _this.setData({
      isNot: options.isNot
    })
    wx.getStorage({
      key: 'userInfo',
      success: function(res) {
        console.log(res.data.msg[0])
        wx.request({
          url: baseUrl + 'im/attention_product',
          data: {
            id: res.data.msg[0].id,
            uid: res.data.msg[0].uid,
            // limit: 20,
            limit:5,
            offset: 0,
            //  id: "10082",
            //  uid: "9aa32f382d4857f4a3c4212647766fb8"
          },
          method: "post",
          success: function (res) {
            console.log(res.data.msg)
            beforeData = res.data.msg;
            for (var i = 0; i < beforeData.length;i++) {
              beforeData[i].price = beforeData[i].price.split('.')
            }

            afterData = afterData.concat(beforeData)
            _this.setData({
              concernedInfo: res.data.msg
            })
            for (var i = 0; i < res.data.msg.length; i++) {
              res.data.msg[i].price = parseFloat(res.data.msg[i].price).toFixed(2)
            }
        
            if(res.data.msg.length == 0 ){
              _this.setData({
                noPsg:true
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
  more:function(){
    var _this = this;
    offsetA += 5;
    wx.getStorage({
      key: 'userInfo',
      success: function (res) {
        wx.getStorage({
          key: 'userInfo',
          success: function(res) {
            wx.request({
              url: baseUrl + 'im/attention_product',
              data: {
                id: res.data.msg[0].id,
                uid: res.data.msg[0].uid,
                // limit: 20,
                limit: 3,
                offset: offsetA,

                // id: "10082",
                // uid: "9aa32f382d4857f4a3c4212647766fb8"
              },
              method: "post",
              success: function (res) {
                console.log(res.data.msg)
                // for (var i = 0; i < res.data.msg.length; i++) {
                //   res.data.msg[i].price = parseFloat(res.data.msg[i].price).toFixed(2)
                // }

                beforeData = res.data.msg;
                afterData = afterData.concat(beforeData)
                console.log(afterData)
                for (var i in afterData) {
                  console.log(afterData[i].price.split('.'))
                  afterData[i].price = afterData[i].price.split('.')
                }
                _this.setData({
                  concernedInfo: afterData
                })
                
                if (res.data.msg.length < offsetA) {
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
  },
  jumpProduct:function(e){
   console.log(e.currentTarget.dataset.id)
   wx.navigateTo({
     url: '../../pages/brand/productListDetail/productListDetail?id='+e.currentTarget.dataset.id,
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