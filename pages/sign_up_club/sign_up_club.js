// pages/club_info/club_info.js
//let search=[];
var util = require('../../utils/util')
let name1 = ''
let exname = '';
let _id = '';
let club_id = '';
let expage = '';
let detail_club_name = '';
let flag = 0;
Page({
  data: {
    name:'',
    clubname:'',
    college:'',
    class:'',
    age:'',
    sex:'',
    grade:'',
    namename:'',
    inputShowed: false,  //初始文本框不显示内容
    userSearch:"",
    //articleList:[{name:"轮滑社",intro:"lunhua",found:"2023-2-24"},{name:"峰云社",intro:"fengyun",found:"2023-2-24"},{name:"三",intro:"three",found:"2023-2-24"},{name:"四",intro:"four",found:"2023-2-24"},{name:"五",intro:"five",found:"2023-2-24"},{name:"六",intro:"six",found:"2023-2-24"}], //初始文章列表，显示全部文章
    articleList:[],
    searchList:[], //用户搜索时匹配的文章列表
    club_name:"",
    ifName:false
  },
  showArticle(e){

      flag = 0
      detail_club_name = e.currentTarget.dataset.name
      console.log(detail_club_name)
     /* wx.navigateTo({
        url: '/pages/user_club_info_detail/user_club_info_detail?info='+e.currentTarget.dataset.name,
      })*/
      const db = wx.cloud.database()
      db.collection('club_admin').where(
        {
          club_name:detail_club_name
        }).get()
        .then(res=>
          {
            club_id = res.data[0].ID
            console.log(club_id)
            const db = wx.cloud.database()
            db.collection('myregister').where(
              {
                studID:name1
              }
            ).get()
            .then(res=>
              {
                if(res.data.length==0)
                {
                  this.setData(
                    {
                      ifName:true,
                      clubname:detail_club_name
                    }
                  )
                }
                else{
                  for(let i = 0;i<res.data.length;i++)
                  {
                    if(res.data[i].club_id==club_id)
                    {
                      flag = 1
                      break
                    }
                  }
                  if(flag == 0)
                  {
                    this.setData(
                      {
                        ifName:true,
                        clubname:detail_club_name
                      }
                    )
                  }
                  else{
                    wx.showModal({
                      title: '提示',
                      content: '你已报名过该社团！',
                      showCancel:false,
                      complete: (res) => {
                        if (res.cancel) {
                          
                        }
                    
                        if (res.confirm) {
                          
                        }
                      }
                    })
                  }
                }
              })
          })
      
      
    
    //console.log(e.currentTarget.dataset.name)
    
    this.onLoad()
  },
  cancel()
  {
    this.setData(
      {
        ifName:false
      }
    )
  },
  confirm()
  {
    if(this.data.college==''||this.data.class==''||this.data.age==''||this.data.sex==''||this.data.grade==''||this.data.namename=='')
    {
      wx.showModal({
        title: '提示',
        content: '报名信息不完整!',
        showCancel:false,
        complete: (res) => {
          if (res.cancel) {
            
          }
      
          if (res.confirm) {
            
          }
        }
      })
    }
    else{
      const db = wx.cloud.database()
      db.collection('user_info').doc(_id).update(
        {
          data:
          {
            college:this.data.college,
            class:this.data.class,
            age:this.data.age,
            sex:this.data.sex,
            grade:this.data.grade,
            name:this.data.namename
          }
        }
      )
      
      db.collection('myregister').add(
        {
          data:
          {
            club_id:club_id,
            state:0,
            status:1,
            studID:name1,
            time:util.formatDate(new Date()),
            an_title:detail_club_name
          },success:(res)=>
          {
            wx.showModal({
              title: '提示',
              content: '报名成功！',
              showCancel:false,
              complete: (res) => {
                if (res.cancel) {
                  
                }
            
                if (res.confirm) {
                  expage = detail_club_name
                  this.setData(
                    {
                      ifName:false
                    }
                  )
                }
              }
            })
          }
        }
      )
    }
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
    var res = db.collection("announcement_temp").get()
    .then(res=>{
      for (let i=0;i<res.data.length;i++){
        var log = res.data[i];
        const activity_content = log.content;
        const actiivity_title = log.an_title;
        const img=log.Imgpath
        //console.log("1-activity_content",activity_content,"actiivity_title",actiivity_title)
        wx.cloud.database().collection("club_admin").where({
          ID:log.club_ID
        }).get().then(res2=>{
          console.log("res2:",res2)
          if(res2.data.length!=0){
          this.setData({
            club_name : res2.data[0].club_name
          })
          const clubName = this.data.club_name;
        this.setData({
          articleList:this.data.articleList.concat({"name":clubName,"intro":activity_content,"found":actiivity_title,"Imgpath":img})
      });
      this.setData({
        searchList:this.data.articleList
      });
    }

        })
      console.log("test")
      //console.log(this.data.articleList)
      //search = this.data.searchList 
      }   
    })
  },
  getSearchList(text){
    //console.log(text)
    const db = wx.cloud.database()
    const _ = db.command //连接数据库
    db.collection("announcement_temp").where(
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
            searchList:[]
          })
          for (let i=0;i<res.data.length;i++){
            const log = res.data[i];
            const activity_content = log.content;
            const actiivity_title = log.an_title;
            const img = log.Imgpath
        //console.log("1-activity_content",activity_content,"actiivity_title",actiivity_title)
        wx.cloud.database().collection("club_admin").where({
          ID:log.club_ID
        }).get().then(res2=>{
          console.log("res2222:",res2)
          //console.log("2-activity_content",activity_content,"actiivity_title",actiivity_title)
          this.setData({
            club_name : res2.data[0].club_name
          })
          const clubName = this.data.club_name;
          console.log("clubName:",this.data.club_name)
          this.setData({
            searchList:this.data.searchList.concat({"name":clubName,"intro":activity_content,"found":actiivity_title,"Imgpath":img})
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
    name1 = wx.getStorageSync('userID').name;
    flag = 0
    //console.log("onLoad")
    if(this.data.searchList.length==0){
      //console.log("length0");
      this.getClubIntroList();
    }
    if(name1 != exname)
    {
      expage = ''
    }
    const db = wx.cloud.database()
    db.collection('user_info').where(
      {
        ID:name1
      }
    ).get()
    .then(
      res=>{
        _id = res.data[0]._id
        this.setData(
          {
            name:name1,
            college:res.data[0].college,
            class:res.data[0].class,
            age:res.data[0].age,
            sex:res.data[0].sex,
            grade:res.data[0].grade,
            namename:res.data[0].name
          }
        )
      }
    )
  
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