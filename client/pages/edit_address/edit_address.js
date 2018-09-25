// var model = require('../../model/model.js')
var app = new getApp();
var baseUrl = app.globalData.baseUrl;
var show = false;
var item = {};
var province = "";
var city = "";
var county = "";
var address = "";
var provinceId = '';
var cityId = "";
var countyId = "";
// 编辑信息修改
var addressInfo ="";
var xuanze = "";
Page({
  data: {
    show: false,
    provinces: [],
    citys: [],
    countys: [],
    choose: '请选择收获区域',
    choosePro: '请选择省',
    chooseCity: '请选择市',
    chooseArea: '请选择区',
    addressinfo:'',
    optionsId:''
    // item: {
    //   show: show
    // }
  },
  onLoad: function (options) {
    console.log(options.id)
    var _this = this;
    wx.request({
      url: baseUrl + 'im/province',
      method: 'post',
      success: function (res) {
        _this.setData({
          provinces: res.data,
          optionsId: options.id
        })
      }
    })

    //获取地址列表
    wx.getStorage({
      key: 'userInfo',
      success: function (res) {
        wx.request({
          url: baseUrl + 'im/account_adderss_list',
          data: {
            userid: res.data.msg[0].id,
            uid: res.data.msg[0].uid,
          },
          method: "post",
          success: function (res) {
            for(var i = 0; i < res.data.msg.length;i++){
              if( res.data.msg[i].id == options.id){
                addressInfo = res.data.msg[i]
                // 如果有区
                if (addressInfo.region_name){
                  xuanze = addressInfo.province_name + " " + addressInfo.city_name + " " + addressInfo.region_name
                }else{
                  xuanze = addressInfo.province_name + " " + addressInfo.city_name 
                }
              }
            }
            console.log(addressInfo)
            console.log(xuanze)
            _this.setData({
              // addressInfo: res.data.msg,
              addressinfo: addressInfo,
              choose:xuanze
            })
            console.log(res.data.msg)
          }
        })
      },
    })
  },
  
  // 点击省份接收市区数据
  sheng: function (e) {
    var _this = this;
    console.log(e.currentTarget.dataset.name)
    province = e.currentTarget.dataset.name
    provinceId = e.currentTarget.dataset.id
    console.log(e.currentTarget.dataset.id)
    _this.setData({
      choosePro: e.currentTarget.dataset.name
    })
    wx.request({
      url: baseUrl + 'im/city',
      data: {
        // province_id:9
        // province_id: e.currentTarget.dataset.id+2
        province_id: e.currentTarget.dataset.id
      },
      method: 'post',
      success: function (res) {
        console.log(res.data)

        _this.setData({
          citys: res.data,
          countys: '',
          chooseCity: '请选择市',
          chooseArea: '请选择区'
        })
      },
    
    })
  },
  shi: function (e) {
    var _this = this;
    city = e.currentTarget.dataset.name
    cityId = e.currentTarget.dataset.id
    address = province + ' ' + city + ' ';
    console.log(address)
    _this.setData({
      chooseCity: e.currentTarget.dataset.name
    })
    console.log(e.currentTarget.dataset.id)
    wx.request({
      url: baseUrl + 'im/area',
      data: {
        // city_id: 500
        city_id: e.currentTarget.dataset.id
      },
      method: 'post',
      success: function (res) {
        // _this.setData({
        //   countys: res.data,
        // })

      console.log(res.data)
      if(res.data == ""){
        countyId = ""
        console.log(countyId)
        return;
      }
      _this.setData({
        countys: res.data,
      })
     },
      
    })
  },
  area: function (e) {
    console.log(e)
    var _this = this;
    countyId = e.currentTarget.dataset.id
    county = e.currentTarget.dataset.name;
    address = address.concat(county)
    console.log(address)
    _this.setData({
      chooseArea: e.currentTarget.dataset.name
    })
  },
  finish: function () {
    var _this = this;
    if (!address) {
      wx.showToast({
        icon: 'loading',
        title: '省份不能为空'
      })
      return;
    }
    _this.setData({
      choose: address,
      show: false
    })
  },
  //生命周期函数--监听页面初次渲染完成
  onReady: function (e) {
    var that = this;
    //请求数据
    // model.updateAreaData(that, 0, e);
  },
  //点击选择城市按钮显示picker-view
  translate: function (e) {
    var that = this;
    console.log(e)
    that.setData({
      show: true
    })
    // model.animationEvents(this, 0, true,400);  
  },
  jump: function (e) {
    console.log(e)
  },

  //隐藏picker-view
  hiddenFloatView: function (e) {
    var that = this;

    that.setData({
      show: false
    })
    // model.animationEvents(this, 200, false,400);
  },
  // 提交收货人信息
  formSubmit: function (e) {
    var _this = this;
    console.log(e)
    // 判断手机号
    // e.detail.value.tel.reqplace()
    if (e.detail.value.tel.length == 0) {
      wx.showToast({
        title: '请输入手机号！',
        icon: 'loading',
      })
      return false;
    }
    if (e.detail.value.tel.length != 11) {
      wx.showToast({
        title: '手机号长度有误！',
        icon: 'loading',
      })
      return false;
    }
    var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;
    if (!myreg.test(e.detail.value.tel)) {
      wx.showToast({
        title: '手机号有误！',
        icon: 'loading',
      })
      return false;
    }
    provinceId = provinceId || addressInfo.province_id
    cityId = cityId || addressInfo.city_id
    // 判断是否有区，如果没有将countys
    if (_this.data.countys == ""){
      countyId = ""
      console.log("我是00")
    }else{
      countyId = countyId || addressInfo.region_id 
    }
    
    console.log(_this.data.optionsId,provinceId, cityId, countyId)
    wx.getStorage({
      key: 'userInfo',
      success: function (res) {
        wx.request({
          url: baseUrl + 'im/add_account_address',
          data: {
            userid: res.data.msg[0].id,
            uid: res.data.msg[0].uid,
            id: _this.data.optionsId,
            province_id: provinceId,
            city_id: cityId,
            region_id: countyId,
            address_info: e.detail.value.address_detail,
            consignee: e.detail.value.name,
            phone: e.detail.value.tel,
            flag: '0',
            is_default: '0',
          },
          method: 'post',
          success: function (res) {
            console.log(res.data)
            wx.redirectTo({
              url: '../address_list/address_list',
            })
            // wx.navigateTo({
            //   url: '../address_list/address_list',
            //   success: function (res) { },
            //   fail: function (res) { },
            //   complete: function (res) { },
            // })
          }
        })
      },
    })
  },
  //滑动事件
  bindChange: function (e) {
    var _this = this;
    console.log(e)
  },
  onReachBottom: function () {
  },
  nono: function () { }
})
