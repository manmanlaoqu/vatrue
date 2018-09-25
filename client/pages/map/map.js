// pages/map/map.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    latitude: 23.099994,
    longitude: 113.324520,
    latitude:'',
    longitude:'',
    address:'',
    markers: [{
     
      // id: 1,
      latitude: '',
      longitude: '',
      name: '',
      iconPath: '../img/location.png',
    }],
    cover:[{
      latitude: '',
      longitude: '',
      iconPath: '../img/location.png',
    }]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      var _this = this;
      console.log(options)
     
        _this.setData({
          latitude:options.lat,
          longitude:options.lon,
          iconPath:'../img/location.png',
          address:options.address,
          markers:[{
            latitude: options.lat,
            longitude:options.lon,
            iconPath: '../img/location.png',
          }],
          cover: [{
            latitude: options.lat,
            longitude: options.lon,
            iconPath: '../img/location.png',
          }]
          
        })
  },

})