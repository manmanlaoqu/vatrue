// modelTest.js
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

Page({
  data: {
    show:false,
    provinces:[],
    citys:[],
    countys:[],
    choose:'请选择收获区域',
    choosePro:'请选择省',
    chooseCity:'请选择市',
    chooseArea:'请选择区',
    // item: {
    //   show: show
    // }
  },
  onLoad:function(){
    var _this = this;
      wx.request({
        url: baseUrl + 'im/province',
        method:'post',
        success:function(res){
          console.log(res.data)
          _this.setData({
            provinces:res.data
          })
        }
      })
    
      wx.request({
        url: baseUrl + 'im/area',
        method: 'post',
        success: function (res) {
          _this.setData({
            countys: res.data
          })
        }
      })
  },
 
  // 点击省份接收市区数据
  sheng:function(e){
    var _this = this;
    // 存储省份
    province = e.currentTarget.dataset.name
    provinceId = e.currentTarget.dataset.id
    _this.setData({
      choosePro:e.currentTarget.dataset.name
    })
    wx.request({
      url: baseUrl + 'im/city',
      data:{
        province_id: e.currentTarget.dataset.id
      },
      method: 'post',
      success: function (res) {
        console.log(res.data)
        _this.setData({
          citys: res.data,
          countys:'',
          chooseCity:'请选择市',
          chooseArea:'请选择区'
        })
      }
    })
  },
  shi:function(e){
    var _this = this;
    city = e.currentTarget.dataset.name
    cityId = e.currentTarget.dataset.id
    address = province + ' ' + city + ' ';
    console.log(address)
    _this.setData({
      chooseCity: e.currentTarget.dataset.name
    })
    wx.request({
      url: baseUrl + 'im/area',
      data: {
        city_id: e.currentTarget.dataset.id 
      },
      method: 'post',
      success: function (res) {
        console.log(res.data)

        if (res.data == "") {
          countyId = ""
          console.log(countyId)
          return;
        }
        _this.setData({
          countys: res.data,
        })
       
      }
    })
  },
  area:function(e){
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
    if(!address){
     wx.showToast({
       icon:'loading',
       title:'省份不能为空'
     })
     return;
    }
    _this.setData({
      choose:address,
     show:false
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
      show:true
    })
    // model.animationEvents(this, 0, true,400);  
  },
  jump:function(e){
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
  formSubmit:function(e){
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

    wx.getStorage({
      key: 'userInfo',
      success: function(res) {
        wx.request({
          url: baseUrl + 'im/add_account_address',
          data: {
            userid: res.data.msg[0].id,
            uid: res.data.msg[0].uid,
            id: "",
            // province_id: provinceId + 2,
            province_id: provinceId,
            city_id: cityId,
            region_id: countyId,
            address_info: e.detail.value.address_detail,
            consignee: e.detail.value.name,
            phone: e.detail.value.tel,
            flag: '1',
            is_default: '0',
          },
          method: 'post',
          success: function (res) {
            console.log(res.data)
            wx.redirectTo({
              url: '../address_list/address_list',
            })
          }
        })
      },
    })
  
  },
  //滑动事件
  bindChange: function (e) {
    var _this =  this;
    console.log(e)
    this.setData({
      // province: item.provinces[item.value[0]].name,
      // city: item.citys[item.value[1]].name,
      // county: item.countys[item.value[2]].name
    });
  },
  onReachBottom: function (){
  },
  nono: function (){}
})
