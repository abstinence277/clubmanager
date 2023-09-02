

Component({
  
  data: {
    articles: [],
    empty:1
    
  },lifetimes:{
    attached:function(options){
      // 在组件实例进入页面节点树时执行
      wx.cloud.database().collection('announcement_temp')
          .get()
          .then(res=>{
              console.log(res.data);
              for(let i=0;i<res.data.length;i++){
                if(res.data[i].status=="1"){
                  this.setData({
                    empty:0
                  })
                }
              }
              console.log(this.data.empty);
              this.setData({
                  articles:res.data,
              })
          })
          .catch(err=>{
              console.log('请求失败',err)
          })
    }
  },methods:{
    getShow(e){
      let an_id=e.currentTarget.dataset.id
      // 获取用户名
      var userID = wx.getStorageSync('userID');
      wx.cloud.database().collection('user_info').where(
        {
          ID:userID.name
        }
      ).get()
          .then(res=>{
              console.log('请求成功',res)
              const IDArray = res.data[0].article_history
              if(!IDArray.includes(an_id)){
                const updateArray = IDArray.concat(an_id)
                wx.cloud.database().collection('user_info').where({
                  ID:userID.name
                })
                .update({
                  data:{
                    article_history:updateArray
                  }
                })
              }
          })
          .catch(err=>{
              console.log('请求失败',err)
          })
      
          //页面跳转
      wx.navigateTo({
        url: '../user_club_info_detail/user_club_info_detail?an_id='+an_id//跳转的页面和参数
      })
    }
  }
})