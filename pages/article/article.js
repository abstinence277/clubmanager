var util = require('../../utils/util.js')
// pages/article/article.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    club_name:"",
    club_found:"",
    club_intro:"",
    like:"☆收藏",
    status:1,
    time:"",
    id:"",
  },
  LikeOrNot(e){
    const db = wx.cloud.database()
    const _ = db.command //连接数据库
    var app = getApp()
    if(this.data.status==1){
      this.setData({
        like:"★取消",
        status:0
      });
      //需要给“我的收藏”页面传参
      db.collection("myfavour").where(
        {
          club_name:this.data.club_name,
          studID:app.globalData.ID
        }
      ).get()
      .then(res=>{
        //console.log(res.data.length==0)
        if(res.data.length==0){
          //console.log(app.globalData.ID)
          //console.log("here:",this.data.time)
          db.collection("myfavour").add({
            data:{
              club_name:this.data.club_name,
              content:this.data.club_intro,
              studID:app.globalData.ID,
              time:this.data.time,
           },success:(res)=>{console.log("success_add")}
          })
        }
      })
    }
    else{
      this.setData({
        like:"☆收藏",
        status:1
      })
      db.collection("myfavour").where(
        {
          club_name:this.data.club_name,
          studID:app.globalData.ID
        }
      ).remove()
      .then(res=>{console.log("success_delete")})
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    var TIME = util.formatDate(new Date()); 
    this.setData({time:TIME}); 
    console.log("time:",TIME);
    var app = getApp()
    console.log(options)
    var temp_name = options.info
    
    //var temp_name = "轮滑社"
    this.setData({
      club_name:temp_name,
    });
    //console.log(this.data.club_name)
    const db = wx.cloud.database()
    const _ = db.command //连接数据库
    //let aaa = db.collection("myfavour")
    db.collection("club_admin").where(
      {
        club_name:this.data.club_name
      }
    ).get()
    .then(res=>{
      this.setData({
        club_intro:res.data[0].introduction,
        club_found:res.data[0].club_found,
        id:res.data[0].ID,
      })
    });
    db.collection("myfavour").where({
      club_name:this.data.club_name,
      studID:app.globalData.ID
    }).get()
    .then(res=>{
      if(res.data.length!=0){
        this.setData({
          status:0
        })
      }
      if(this.data.status==0){
        this.setData({
          like:"★取消"
        })
      }
    })
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})