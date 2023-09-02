// pages/user_club_info_detail/user_club_info_detail.js
let app=getApp()
var util = require('../../utils/util')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    article_detail:[],
    like:"☆报名",
    an_title:"",
  },
  onLoad: function (options) {
    var an_title=options.an_id//接收上一个页面传来的an_i
    console.log("detail.an_id:",an_title)
    /*查找文章详细信息 */
    wx.cloud.database().collection('activity_temp').where({
      an_title:an_title
    }).get()
      .then(res=>{  //云函数返回100条数据
        console.log('result:',res)
        this.setData({
          an_title:an_title,
          article_detail:res.data[0]
        })
        console.log('请求成功',this.data.article_detail)
      })

    /*状态是否在报名 */
    var ID=app.globalData.ID
    console.log(ID)
    console.log("an_id:",this.data.an_title)
    wx.cloud.database().collection('myregister').where(
      {
        studID:ID,
        an_title:an_title
      }).get()
        .then(res=>{
          console.log("state",res.data)
          if(res.data.length==0){
            this.setData({
              like:"☆报名",
              //status:0
            })
          }
          else{
            this.setData({
              like:"★取消报名",
              //status:0
            })
          }
        })
        .catch(err=>{
            console.log('请求失败',err)
        })
  },
  

  LikeOrNot(e){
    console.log("1212：",this.data.like)
    if(this.data.like=="☆报名"){//报名
      this.setData({
        like:"★取消报名",
      });
      console.log("1212：",this.data.like)
      //报名活动数据存入数据库
      var an_title = this.data.article_detail.an_title
      console.log("an_title:",an_title)
      wx.cloud.database().collection('myregister').add({
        data:{
          an_title:an_title,
          state:0,//未审核
          status:0,//活动
          studID:app.globalData.ID,
          time:util.formatDate(new Date())
        }
      })
    }
   
    else{//取消报名
      var an_title = this.data.article_detail.an_title
      wx.cloud.database().collection('myregister').where(
        {
          studID:app.globalData.ID,
          an_title:an_title
        }).get()
          .then(res=>{
            console.log("delete",res.data)
            if(res.data[0].state==0){//只有未审批才能取消
              console.log("yes")
              this.setData({
                like:"☆报名",
              })
              var deleteid=res.data[0]._id
              wx.cloud.database().collection('myregister').doc(deleteid).remove()
            }
          })
        }
    }
})