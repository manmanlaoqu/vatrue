// pages/brand/brand.js
var app = getApp();
var baseUrl = app.globalData.baseUrl;
var swiper_height = "";
var priceArr = [];
var pricePrice = '';
var id=''
//拼接的数据
var stateDataBefore = ""
var resArr = [];
var offsetA = 5;
// 分割价格数组
var splitPrice = []
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentData: 0,
    farm_info:'',
    product_info:'',
    //产品列表数据
    product_list:'',
    swiperHeight:'',
    brandInfo:'',
    concerned:true,
    price:'',
    brandName:'',
    brandTel:'',
    more:true,
    list: [],
    farmid:'',
    custormer_service:'',
    splitPrice:''
  },
  

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this = this;
    _this.navTitle();
    wx.showLoading({
      title: '加载中',
    })
    wx.getStorage({
      key: 'product_info',
      success: function(res) {
        _this.setData({
          product_info: res.data,
        })
      },
    })
    
    wx.getStorage({
      key: 'farmid',
      success: function(res) {
        //存储farmId
        _this.setData({
          farmId:res.data
        })
        //获取产品列表数据 
        wx.request({
          url: baseUrl + 'im/product',
          data: {
            // 需要farmid
            farmid:res.data,
            limit:'5'
          },
          method:"post",
          success:function(res){
            stateDataBefore = res.data.msg
            for (var i in stateDataBefore) {
              console.log(stateDataBefore[i].specData[0].price_interval.split('.'))
              stateDataBefore[i].specData[0].price_interval = stateDataBefore[i].specData[0].price_interval.split('.')
            }
            resArr = resArr.concat(stateDataBefore)
            _this.setData({
              product_list: resArr,
              splitprice: splitPrice
            })
           
          }
        })
        wx.getStorage({
          key: 'farmid',
          success: function(res) {
            _this.setData({
              farmid:res.data
            })
            _this.concernedOrNot(res.data)
          },
        })
        
        // 发送请求获取品牌介绍
        wx.request({
          url: baseUrl + 'im/brand',
          data: {
            // 需要farmid
            farmid: res.data
          },
          method: "post",
          success: function (res) {
            wx.hideLoading()
            console.log(res.data.msg)
            if (res.data.msg.custormer_service) {
              _this.setData({
                custormer_service: res.data.msg.custormer_service,
              })
            }
            _this.setData({
              brandInfo:res.data.msg,
              brandName:res.data.msg.name,
              // brandTel:res.data.msg.tel
            })
          }
        })
      },
      
    })
  },
   //查询是否关注
  concernedOrNot:function(data){
    var _this = this;
    wx.getStorage({
      key: 'userInfo',
      success: function (res) {
        wx.request({
          url: baseUrl + 'im/insert_attention_brand',
          data: {
            userid: res.data.msg[0].id,
            uid: res.data.msg[0].uid,
            farmid: data,
            flag: 0
          },
          method: 'post',
          success: function (res) {
            console.log(res)
            if (res.data.code == 1) {
              _this.data.concerned = !_this.data.concerned
              _this.setData({
                concerned: _this.data.concerned
              })
            }
          }
        })
      },
    })
  },
  requestData:function(){
    wx.showLoading({
      title: '加载中',
    })
    var _this = this;
    //获取产品列表数据 
    wx.request({
      url: baseUrl + 'im/product',
      data: {
        // 需要farmid
        farmid: _this.data.farmid,
        limit: '5',
        offset:offsetA
      },
      method: "post",
      success: function (res) {
        wx.hideLoading()
        if (res.data.msg.length < 5) {
          offsetA += res.data.msg.length;
          _this.setData({
            more: false
          })
        } else {
          offsetA += 5;
        }

        stateDataBefore = res.data.msg
        for (var i in stateDataBefore) {
          stateDataBefore[i].specData[0].price_interval = stateDataBefore[i].specData[0].price_interval.split('.')
        }
        resArr = resArr.concat(stateDataBefore)
        _this.setData({
          product_list: resArr,
          // price: priceArr
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
  jumpMap:function(){
    wx.getStorage({
      key: 'farmid',
      success: function(res) {
      console.log(res.data)
      wx.request({
        url: baseUrl + 'im/farm_address_lon_lat',
        data:{
          farmid:res.data
       },
       method:'post',
       success:function(res){
          wx.navigateTo({
            url: '../map/map?lat=' + res.data.msg.lat + '&lon=' + res.data.msg.lon + '&address=' + res.data.msg.address,
          })
       }
    })
      },
    })
  
   
  },

  // 切换选项卡
  //获取当前滑块的index
  bindchange: function (e) {
    const that = this;
    that.setData({
      currentData: e.detail.current
    })
  },
  //点击切换，滑块index赋值
  checkCurrent: function (e) {
    const that = this;

    if (that.data.currentData === e.target.dataset.current) {
      return false;
    } else {

      that.setData({
        currentData: e.target.dataset.current
      })
    }
  },
  connect_tel:function(){
    var _this = this;
    wx.showModal({
      title: _this.data.brandName,
      content: _this.data.custormer_service,
      cancelColor: "#000",
      confirmText: "拨打",
      // confirmColor:"black",
      cancelColor:"rgba(135,143,159,1)",
      success:function(res){
      if(res.confirm){
        wx.makePhoneCall({
          phoneNumber: _this.data.custormer_service, 
          success: function () {
            console.log("拨打电话成功！")
          },
          fail: function () {
            console.log("拨打电话失败！")
          }
        })
        //成功
      }else{
        //失败
      }
      },
    })
  },
  // 关注不关注方法
  concern: function () {
    var _this = this;
    console.log(1)
    wx.getStorage({
      key: 'userInfo',
      success: function (res) {
        wx.request({
          url: baseUrl + 'im/insert_attention_brand',
          data: {
            userid: res.data.msg[0].id,
            uid: res.data.msg[0].uid,
            farmid: _this.data.farm_info.farmid,
            flag: 1
          },
          method: 'post',
          success: function (res) {
            console.log(res)
          }
        })
        if (res.data.code == 1) {
          _this.data.concerned = !_this.data.concerned
          _this.setData({
            concerned: _this.data.concerned
          })
        }
      },
    })
  },

  //跳转到产品详情页
  jumpDetail:function(e){
    var _this = this;
   id = _this.data.product_list[e.currentTarget.dataset.index].id
   console.log(id)
    wx.navigateTo({
      //  + e.currentTarget.dataset.index
      url: 'productListDetail/productListDetail?id=' + id,
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  // 页面滚动
  onPageScroll: function (e) {
    if (e.scrollTop > 230) {
      this.setData({
        appear: true
      })
    } else {
      this.setData({
        appear: false
      })
    }
  },
})