// pages/club_info/club_info.js
//let search=[];
Page({
  data: {
    inputShowed: false,  //初始文本框不显示内容
    userSearch:"",
    //articleList:[{name:"轮滑社",intro:"lunhua",found:"2023-2-24"},{name:"峰云社",intro:"fengyun",found:"2023-2-24"},{name:"三",intro:"three",found:"2023-2-24"},{name:"四",intro:"four",found:"2023-2-24"},{name:"五",intro:"five",found:"2023-2-24"},{name:"六",intro:"six",found:"2023-2-24"}], //初始文章列表，显示全部文章
    searchList:[], //用户搜索时匹配的文章列表
    articleList:[],
    img:[],
  },
  showArticle(e){
    //console.log(e.currentTarget.dataset.name)
    //let detail_club_name = e.currentTarget.dataset.name
    //console.log("21212121:",this.data.searchList)
    let name = e.currentTarget.dataset.name
    console.log("111:",name)
    wx.navigateTo({
      url: '/pages/sign_up_activity_detail/sign_up_activity_detail?an_id='+name,
    })
  },
  showInput: function () {
    this.setData({
      inputShowed: true,   //设置文本框可以输入内容
    });
  },
  // 取消搜索
  hideInput: function () {
    var temp = []
    this.setData({
      inputShowed: false,
      userSearch:"",
      searchList:this.data.articleList
    });
    //console.log("cancel:",this.data.searchList.length)
    //this.onLoad()
  },
  goSearch: function(e){
    var text = e.detail.value;
    this.setData({
      userSearch: text
    });
    //console.log(text)
    //这里进行数据库的查询，如果有这个社团则加入文章list
    if(text!=""){
      this.getSearchList(this.data.userSearch);
    }
  },
  getClubIntroList: function(){
    //console.log("getting information")
    wx.cloud.callFunction({
      name:'cloudFunction'  //云函数的名字
    })
    .then(res=>{  //云函数返回100条数据
        console.log('请求成功activity:',res.result.list)
        var list = []
        for(let i =0;i<res.result.list.length;i++){
          var temp = res.result.list[i]
          var an_title = temp.an_title
          var content = temp.content
          var clubname = temp.result[0].club_name
          var img = temp.Imgpath
          list.push({"an_title":an_title,"content":content,"clubname":clubname,"Imgpath":img})
        }
        //console.log(list)
        this.setData({
          articleList:list,
        })
        this.setData({
          searchList:this.data.articleList
        })
        console.log('请求成功',this.data.searchList)
    }) 
  },
  getSearchList(text){
    //console.log(text)
    const db = wx.cloud.database()
    const _ = db.command //连接数据库
    db.collection("activity_temp").where(
      {
        an_title : db.RegExp({
          regexp:text
        })
      }
    ).get()
    .then(res=>{
      if(res.data.length!=0)
        { 
          this.setData({
            searchList:[],
            img:[],
          })
          for (let i=0;i<res.data.length;i++){
            const log = res.data[i];
            console.log("log:",log)
            const activity_content = log.content;
            const actiivity_title = log.an_title;
            const imgpath = log.Imgpath;

        //console.log("1-activity_content",activity_content,"actiivity_title",actiivity_title)
        wx.cloud.database().collection("club_admin").where({
          ID:log.club_ID
        }).get().then(res2=>{
          console.log("res2222:",res2)
          this.setData({
            club_name : res2.data[0].club_name
          })
          var clubName = this.data.club_name;
          console.log("clubName:",this.data.club_name)
          console.log("img:",imgpath)
          this.setData({
            searchList:this.data.searchList.concat({"clubname":clubName,"content":activity_content,"an_title":actiivity_title,"Imgpath":imgpath})
        });    
      }
    //console.log("111:",this.data.searchList)
        )}}
  })
    //this.onLoad();
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    //console.log("onLoad")
    if(this.data.searchList.length==0){
      //console.log("length0");
      this.getClubIntroList();
    }
  }
})