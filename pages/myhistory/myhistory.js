

Component({
  
  data: {
    articles: [],  //历史文章
    articles_id:[], //浏览过的历史文章id
    
  },lifetimes:{
    attached:function(options){
      // 在组件实例进入页面节点树时执行
      var userID = wx.getStorageSync('userID'); // 读取缓存 用户名
      wx.cloud.database().collection('user_info').where({
        ID:userID.name
      })
          .get()
          .then(res=>{
              this.setData({
                articles_id:res.data[0].article_history,
              })
              // 输出看有没有读取到浏览文章的id号
              console.log('090',this.data.articles_id)

              // 将历史浏览文章信息保存到articles数组
              for (let i = 0, len = this.data.articles_id.length; i < len; ++i){
                wx.cloud.database().collection('announcement_temp').where({
                  an_id:this.data.articles_id[i]
                })
                    .get()
                    .then(res=>{
                        this.setData({
                            articles:this.data.articles.concat(res.data[0]),  // 拼接 将历史浏览记录文章的相关信息 存入articles数组里面
                        })
                    })
                    .catch(err=>{
                        console.log('请求失败',err)
                    })
              }
          })
          .catch(err=>{
              console.log('请求失败',err)
          })
    }
    ,
      
  },methods:{
    getShow(e){
      let an_id=e.currentTarget.dataset.id
      wx.navigateTo({
        url: '../user_club_info_detail/user_club_info_detail?an_id='+an_id//跳转的页面和参数
      })
    }
  }
})