// pages/user_club_info_detail/user_club_info_detail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    article_detail:[]
  },
  onLoad: function (options) {
    var an_id=options.an_id//接收上一个页面传来的an_id 文章ID
    this.getOne(an_id)
    },
    getOne(an_id){//以传过来的id参数作为依据在新页面获取对应的数据
    wx.cloud.database().collection('announcement_temp').where({
      an_id:an_id
    })
          .get()
          .then(res=>{
              this.setData({
                  article_detail:res.data[0],
              })
          })
          .catch(err=>{
              console.log('请求失败',err)
          })
    }
  
})