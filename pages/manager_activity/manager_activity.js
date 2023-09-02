// pages/manager_delclub/manager_delclub.js
const db=wx.cloud.database()
let arr = [];
Page({
  data: {
    select_all: false,//是否全选
    list: [
     
    ],
    choseNames: '', //选中的名字列表
  },
  onLoad(options){
    this.init()
  },
  onReady() {
    this.init()
  },
  init(){
    var templist=[];
    let i=0;
    let j=0;
    let status="未通过"
    db.collection("announcement_temp").get().then(res=>{
      for(i=0;i<res.data.length;i++){
        if(res.data[i].status=='1')
        {
          status="已通过"
        }
        else if(res.data[i].status=='0')
        {
          status="未通过"
        }
        else if(res.data[i].status=='2')
        {
          status="驳回"
        }else {status="未知"}
        templist.push({
          ID:res.data[i].an_id,
          name:res.data[i].an_title,
          status:status
        })
      }
      console.log(templist)
      this.setData({
        list:templist
      })
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
    } else  {
      this.setData({
        select_all: false
      })
    }
  },
  passact(){
    console.log(arr)
    let i=0;
    for(i=0;i<arr.length;i++)
    {
      db.collection('announcement_temp').where({
        an_id:arr[i]
      }).update({
        data:{
          status:'1'
        }
      })
    }
    this.init()
  },
  refuseact(){
    console.log(arr)
    let i=0;
    for(i=0;i<arr.length;i++)
    {
      db.collection('announcement_temp').where({
        an_id:arr[i]
      }).update({
        data:{
          status:'2'
        }
      })
    }
    this.init()
  }
})

  
 