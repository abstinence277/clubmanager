// pages/club_info/club_info.js
//let search=[];
Page({
  data: {
    inputShowed: false,  //初始文本框不显示内容
    userSearch:"",
    //articleList:[{name:"轮滑社",intro:"lunhua",found:"2023-2-24"},{name:"峰云社",intro:"fengyun",found:"2023-2-24"},{name:"三",intro:"three",found:"2023-2-24"},{name:"四",intro:"four",found:"2023-2-24"},{name:"五",intro:"five",found:"2023-2-24"},{name:"六",intro:"six",found:"2023-2-24"}], //初始文章列表，显示全部文章
    articleList:[],
    searchList:[], //用户搜索时匹配的文章列表
  },
  showArticle(e){
    //console.log(e.currentTarget.dataset.name)
    //let detail_club_name = e.currentTarget.dataset.name
    wx.navigateTo({
      url: '/pages/article/article?info='+e.currentTarget.dataset.name,
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
    const db = wx.cloud.database()
    const _ = db.command //连接数据库
    var res = db.collection("club_admin").get()
    .then(res=>{
      //console.log("res.data:",res.data)
      var list=[];
      for (let i=0;i<res.data.length;i++){
        var log = res.data[i];
        var clubName = log.club_name;
        var clubIntro = log.introduction;
        var clubFound = log.club_found;
        var id=log.ID;
        //console.log(clubName)
        this.setData({
          articleList:this.data.articleList.concat({"name":clubName,"intro":clubIntro,"found":clubFound,"ID":id})
      });
      this.setData({
        searchList:this.data.articleList
      });
      //console.log(this.data.articleList)
      //search = this.data.searchList 
      }   
    })
  },
  getSearchList(text){
    //console.log(text)
    const db = wx.cloud.database()
    const _ = db.command //连接数据库
    db.collection("club_admin").where(
      {
          club_name : db.RegExp({
          regexp:text
        })
      }
    ).get()
    .then(res=>{
      if(res.data.length!=0)
        { 
          this.setData({
            searchList:[]
          })
          for(let i=0;i<res.data.length;i++){
            //console.log("res:",res.data[i])
            var log = res.data[i];
            var clubName = log.club_name;
            var clubIntro = log.introduction;
            var clubFound = log.club_found;
            var id=log.ID
            //var arr = [{"name":clubName,"intro":clubIntro,"found":clubFound}];
            this.setData({
              searchList:this.data.searchList.concat({"name":clubName,"intro":clubIntro,"found":clubFound,'ID':id})
            })
          }

        }
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