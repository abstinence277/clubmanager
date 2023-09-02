// pages/user_home/user_home.js
var app = getApp() 
let i=0
Page({ 
 data: { 
  navbar: ['全部报名', '已处理', '未处理'], 
  currentTab: 0,
  result:[],//全部记录
 }, 
  navbarTap: function(e){ 
  this.setData({ 
      currentTab: e.currentTarget.dataset.idx 
  }) 
  },
  swichNav: function (e) {
    let that = this;
    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.target.dataset.current
      })
    }
  },
  onLoad: function (option) {
    //查询数据库全部记录
    const db = wx.cloud.database()
    const _ = db.command
    wx.cloud.callFunction({
      name:'myregister',  //云函数的名字
      data:{
        studid:app.globalData.ID
      }
    }).then(res=>{  //云函数返回100条数据
        console.log('result:',res.result.list)
        this.setData({
          result:res.result.list
        })
        console.log("my_result:",this.data.result)
      })
  }


})