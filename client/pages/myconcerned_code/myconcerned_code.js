// pages/myconcerned_code/myconcerned_code.js
var app = getApp();
var baseUrl = app.globalData.baseUrl;
var beforeData = [];
var afterData = [];
var finalTime = ''
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isNot:'',
    scanData:'',
    nomore: false,
    more: true,
    appear:false
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
          url: baseUrl + 'im/my_scan_record',
          data: {
            userid: res.data.msg[0].id,
            uid: res.data.msg[0].uid,
            num: '60',
            add_time: ''
          },
          method: 'post',
          success: function (res) {
            beforeData = res.data.msg
            afterData = afterData.concat(beforeData)
            // 去最后一个时间
            //价格变化
            for (var i in afterData[0]){
              for(var j in afterData[0][i]){
                if (afterData[0][i][j].price){
                  afterData[0][i][j].price = afterData[0][i][j].price.split('.')
                }
              }
            }
            _this.setData({
              scanData: afterData[0]
            })
            for (var i in res.data.msg) {
              finalTime = i
            }
          }
        })
      },
    })
    
   
  },
  jumpTop:function(){
    wx.pageScrollTo({
      scrollTop: 0,
      duration: '7s',
    })
  },
  //滚动监听
  scroll: function (e) {
    this.setData({
      scrollTop: e.detail.scrollTop
    })
  },
  onPageScroll: function (e) {
    if (e.scrollTop >600){
     this.setData({
       appear:true
     })
    }else{
      this.setData({
        appear: false
      })
    }
  },
  
  more: function () {
    var _this = this;
    wx.getStorage({
      key: 'userInfo',
      success: function (res) {
        wx.request({
          url: baseUrl + 'im/my_scan_record',
          data: {
            id: res.data.msg[0].id,
            uid: res.data.msg[0].uid,
            // userid: '10157',
            // uid: "de89d4a47774578a4a1af38e94d68ae1",
            num: '22',
            add_time:finalTime
          },
          method: "post",
          success: function (res) {
            console.log(res.data.msg)
            beforeData = res.data.msg;
            // afterData = afterData.concat(beforeData)
            afterData = Object.assign(afterData,beforeData)
            console.log(afterData)
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
})