// pages/state/state.js
var app = getApp();
var baseUrl = app.globalData.baseUrl;
//第一次请求的数据
var stateDataBefore = '';
//拼接的数据
var resArr= [];
var offsetA = 5;
var longLength = '';
var imgArr = []
Page({

  /**
   * 页面的初始数据
   */
  data: {
    stateData:'',
    farmid:'',
    list:[],
    more:true,
    imgList:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '加载中',
    })
    var _this = this;
    this.navTitle();
    wx.getStorage({
      key: 'farmid',
      success: function(res) {
          _this.setData({
            farmid:res.data
          })
          wx.request({
            url: baseUrl + 'im/brand_trends',
            method: "post",
            data: {
              farmid: res.data,
              limit: "5",
            },
            success: function (res) {
              wx.hideLoading()
              console.log(res.data)

              _this.setData({
                stateData: res.data 
              })
              stateDataBefore = res.data
              resArr = resArr.concat(stateDataBefore)
              
              //对图片进行处理
              // for (var i = 0; i < res.data.length;i++){
              //   imgArr = imgArr[0].push(res.data[0])
              // }
              // console.log(imgArr)

              // 判断文字太长截取
              for (var i = 0; i < resArr.length; i++) {
                if (resArr[i].content.long[0]){
                  console.log(resArr[i].content.long[0])
                  if (resArr[i].content.long[0].title.length >30) {
                    resArr[i].content.long[0].title = resArr[i].content.long[0].title.substr(0,30)
                  }
                }
              }

              _this.setData({
                list:resArr
              })
            }
          })
      },
    })

  },
  //点击更多加载更多数据
  requestData:function(){
    wx.showLoading({
      title: '加载中',
    })
    console.log(offsetA)
    var _this = this;
    wx.request({
      url: baseUrl + 'im/brand_trends',
      method: "post",
      data: {
        farmid:_this.data.farmid,
        limit: "5",
        offset:offsetA
      },
      success: function (res) {
        wx.hideLoading()
        if(res.data.length < 5){
          offsetA += res.data.length;
           _this.setData({
             more:false
           })
          
        }else{
          offsetA += 5;
        }
        stateDataBefore = res.data
        resArr = resArr.concat(stateDataBefore)
      console.log(resArr)
      // 判断文字太长截取
      for (var i = 0; i < resArr.length; i++) {
        if (resArr[i].content.long[0]) {
          if (resArr[i].content.long[0].title.length > 34) {
            resArr[i].content.long[0].title = resArr[i].content.long[0].title.substr(0, 34) + "..."
          }
        }
      }

        _this.setData({
          list: resArr
        })
       
        
      }
    })
  },

  // 设置导航栏文字
  navTitle: function () {
    var _this = this;
    wx.getStorage({
      key: 'farm_info',
      success: function (res) {
        wx.setNavigationBarTitle({
          title: res.data.farm_info.name
        })
      },
    })
  },
  jumpLongPag:function(e){
    var _this = this;
    //判断数据是否是文章
    longLength = resArr[e.currentTarget.dataset.index].content.long.length
    console.log(e.currentTarget.dataset.id, longLength)
    if (longLength){
        wx.navigateTo({
          url: 'longPag/longPag?id=' + e.currentTarget.dataset.id,
        })
    }
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