var app = getApp() 
let i=0
Page({
  data: {
    result:[],
    slideButtons:[
      {
        text: '删除',
        type:'warn',
        extClass: 'test',
    }]
  },


  onLoad: function (option) {
    //连接数据库
    const db = wx.cloud.database()
    const _ = db.command
    db.collection("myfavour").where({
      studID:app.globalData.ID
    })
    .get()
    .then(
      res=>{
        for(i = 0;i<res.data.length;i++){
          console.log(res.data[i])
          this.data.result.push(res.data[i])
          this.setData({
            result:this.data.result
          })
        }
      }
    )
  },
  goArticle(event){
    var ind=event.currentTarget.dataset.index
    wx.navigateTo({
      url: '/pages/article/article?info='+this.data.result[ind].club_name,
    })
  },
  slideButtonTap(event){
    var ind=event.currentTarget.dataset.index
    //console.log(this.data.result[ind].club_name)
    const db = wx.cloud.database()
    const _ = db.command //连接数据库
    let userCollection = db.collection('myfavour') 
    userCollection.where({
      //club_name:this.data.result[ind].club_name,
      club_name:this.data.result[ind].club_name,
      studID:app.globalData.ID
    }).remove().then(res => {
	    console.log('删除成功',res)
	    this.setData({
		    //数据库删除了，那也得将data里的值也删了，不然数据容易出错
		    number: ''
	    })
    }).catch(err => {
	    console.log('删除失败',err)//失败提示错误信息
    })
    wx.redirectTo({
      url: '/pages/myfavour/myfavour',
    })
  }
 })