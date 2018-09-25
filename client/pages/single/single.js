var app = getApp();
var baseUrl = app.globalData.baseUrl;
var numData = 7;
var lstId;
var resBefore ="";
var resArr = [];
var lengthArr=""
Page({

  /**
   * 页面的初始数据
   */
  data: {
    height: '',
    list:[],//放置返回数据的数组
    isBlank:true, //用于判断list数组是不是空数组，默认为空数组
    lastId:'',//最后一个数据的id
    count:7,//返回数据个数,
    dataLength:'',
    more:'',
    unityid:'',
    farm_info: '',
    // 单品溯源列表的信息
    suList: "",
    lastId: '',
    moreData: "",
    loading: '',
    // 加载图标消失
    loadingIcon: true,
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options.unityid)
    var _this = this;
    wx.showLoading({
      title: '加载中',
    })
    wx.getStorage({
      key: 'unityid',
      success: function (res) {
        console.log(res.data)
          _this.setData({
            unityid:res.data
          })
          // _this.requestData();
      },
    })
    
    wx.getStorage({
      key: 'farm_info',
      success: function (res) {
        wx.hideLoading();
        _this.setData({
          farm_info: res.data
        })
      },
    })
  
    wx.request({
      url: baseUrl + "trace/unity_origin_list",
      data: {
        unityid: options.unityid,
        // unityid: 34904,
        num: 7,
        lastid: _this.data.lastId
      },
      method: "post",
      success: function (res) {
        wx.hideLoading();
        lengthArr = res.data.msg.length
        if (lengthArr < 7) {
          _this.setData({
            more: false
          })
        }

        resBefore = res.data.msg;
        _this.setData({
          lastId: res.data.msg[lengthArr - 1].id,
          list: resBefore,
          dataLength: res.data.msg.length,
          more: true
        })

      }
    })


    wx.getSystemInfo({
      success: (res) => {
        _this.setData({
          height: res.windowHeight
        })
      }
    })

  },
  // 跳转到地图
  jumpMap: function (event) {
    var lat = event.currentTarget.dataset.lat;
    var lon = event.currentTarget.dataset.lon;
    var address = event.currentTarget.dataset.address
    wx.navigateTo({
      // 将参数传给map页面
      url: '../map/map?lat=' + lat + '&lon=' + lon + '&address=' + address,
      success: function (res) {

      },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  //发请求获取数据
  requestData: function () {
    var _this = this;
    console.log(_this.data.unityid)
    wx.request({
      url: baseUrl + "trace/unity_origin_list",
      data: {
        unityid: _this.data.unityid,
        // unityid: 34904,
        num: 7,
        lastid: _this.data.lastId
      },
      method: "post",
      success: function (res) {
        wx.hideLoading();
        lengthArr = res.data.msg.length
        if (lengthArr < 7) {
          _this.setData({
            more: false
          })
        }

        resBefore = res.data.msg;
        resArr = resArr.concat(resBefore)
        _this.setData({
          lastId: res.data.msg[lengthArr - 1].id,
          list: resArr,
          dataLength: res.data.msg.length,
          more: true
        })

      }
    })
  },
  lower() {
    var _this = this;
    _this.requestData();
    if (_this.data.dataLength < 7) {
      _this.setData({
        more: false
      })
      console.log(_this.data.more)
      wx.showToast({ //如果全部加载完成了也弹一个框
        title: '没有更多',
        icon: 'success',
        duration: 300
      });
      setTimeout(() => {
        this.setData({
          // res: cont
        });
        wx.hideLoading();
      }, 1500)
      return false;
    } else {
      wx.showLoading({ //期间为了显示效果可以添加一个过度的弹出框提示“加载中”  
        title: '加载中',
        icon: 'loading',
      });
      setTimeout(() => {
        this.setData({
          // res: cont
        });
        wx.hideLoading();
      }, 1500)
    }
  }
})