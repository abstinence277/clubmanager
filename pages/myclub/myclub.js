// pages/myclub/myclub.js
var app = getApp() 
let i=0
Page({

  /**
   * 页面的初始数据
   */
  data: {
    result:[],    //存储社团的id
    date:[],   //存储加入社团的日期
    club_name:[], //存储社团名称
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (option) {
    //连接数据库
    const db = wx.cloud.database()
    const _ = db.command
    db.collection("user_info").where({
      ID:app.globalData.ID
    })
    .get()
    .then(
      res=>{

        //console.log(this.data.result[0])
        
        this.setData({
          result:res.data[0].club,
          date:res.data[0].join_date
        })
        // 将历史浏览文章信息保存到articles数组
        for (let i = 0, len = this.data.result.length; i < len; ++i){
          wx.cloud.database().collection('club_admin').where({
            ID:this.data.result[i]
          })
              .get()
              .then(res=>{
                  this.setData({
                      club_name:this.data.club_name.concat(res.data[0].club_name),  // 拼接 存入club_name数组里面
                  })
              })
              .catch(err=>{
                  console.log('请求失败',err)
              })
        }

      }
    )
  }
})