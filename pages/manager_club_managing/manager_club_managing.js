// pages/manager_club_managing/manager_club_managing.js
var util = require('../../utils/util')
const db=wx.cloud.database()
let arr = [];
Page({

  /**
   * 页面的初始数据
   */
  data: {
    clubname:'',
    info:'状态：正常',
    select_all: false,//是否全选
    list: [],
    choseNames: '', //选中的名字列表
  },
  newclub(){
    let i=0;
    let same=0;
    let maxID=0;
    let tempnumID=0;
    let tempnewID=''
    db.collection("club_admin").get().then(res=>{
      for(i=0;i<res.data.length;i++){
        tempnumID=parseInt(res.data[i].ID)
        if(tempnumID>maxID)
        {
          maxID=tempnumID
        }
        if(res.data[i].club_name==this.data.clubname){
          same=1;
          this.setData({
            info:"状态：社团名称重复"
          })
        }
        if(this.data.clubname==''){
          same=1;
          this.setData({
            info:"状态：请输入社团名称"
          })
        }
      }
      if(maxID==0)
      {
        tempnewID="0001"
      }
      else{
        tempnewID=(maxID+1).toString()
        if(tempnewID.length<4)
        {
          if(tempnewID.length==1)
          {
            tempnewID="000"+tempnewID
          }
          if(tempnewID.length==2)
          {
            tempnewID="00"+tempnewID
          }
          if(tempnewID.length==3)
          {
            tempnewID="0"+tempnewID
          }
        }
        else{
          this.setData({
            info:"超出上限，请联系系统开发人员"
          })
        }
      }
      if(same==0)
      {
        /*
        db.collection('club_admin').add({
          data:{
            ID:tempnewID,
            club_name:this.data.club_name
          },
          success:function(res){
            console.log(res)
          }
        })
        */
        wx.showModal({
          title: '成功',
          content: '成功创建！\r\n社团ID为：'+tempnewID+'\r\n初始密码为：654321',
          showCancel:false,
          complete: (res) => {
            if (res.cancel) {
            }
            if (res.confirm) {
            }
          }
        })
        db.collection('club_admin').add({
          data:{
          ID:tempnewID,
          password:654321,
          club_name:this.data.clubname,
          introduction:'',
          club_total_number:1,
          club_found:util.formatDate(new Date())
          }
        })
        this.setData({
          info:'状态：已添加'
        })
        this.init()
      }
    })
  },
   //全选与反全选
   selectall: function (e) {
    //存放选中id的数组
   for (let i = 0; i < this.data.list.length; i++) {
     this.data.list[i].checked = (!this.data.select_all)
     if (this.data.list[i].checked == true) {
       // 全选获取选中的值
       arr = arr.concat(this.data.list[i].ID.split(','));
     }
   }
   this.setData({
     list: this.data.list,
     select_all: (!this.data.select_all),
     choseNames: arr
   })
  },
  // 单选
  checkboxChange: function (e) {
    console.log(e.detail.value)
    arr=[]
    arr[0]=e.detail.value[0]
    this.setData({
      choseNames: e.detail.value, //单个选中的值
    })
    if (this.data.choseNames.length == this.data.list.length) {
      this.setData({
        select_all: true
      })
    } else {
      this.setData({
        select_all: false
      })
    }
  },
  delclub(){
    console.log(arr)
    let i=0;
    for(i=0;i<arr.length;i++)
    {
      db.collection('club_admin').where({
        ID:arr[i]
      }).remove()
    }
    this.setData({
      info:'状态：已删除'
    })
    this.init()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onLoad: function (option) {
    wx.hideHomeButton()
    this.init()
  },
  init(){
    //查询数据库全部记录
    const db = wx.cloud.database()
    const _ = db.command
    db.collection('club_admin').get().then(res=>{
      console.log(res.data)  
      this.setData({
          list:res.data
        })
      })
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