// index.js
// const app = getApp()
let i = 0;
Page({
  data:{
    name:'',
    number:'',
    password:'',
    question:'',
    answer:'',
    prompt: '为了账号安全，建议设置密码保护问题',
    avatarUrl: './user-unlogin.png',
    userInfo: {},
    hasUserInfo: false,
    logged: false,
    takeSession: false,
    requestResult: '',
    canIUseGetUserProfile: false,
    canIUseOpenData: wx.canIUse('open-data.type.userAvatarUrl') // 如需尝试获取用户信息可改
  },
  

// 注册
  addData(){
    this.setData({
      prompt: ''
     })
    if (this.data.name == '') {
    this.setData({
      prompt: '用户名不能为空或不合法'
    })
  }
    else if (this.data.number == '') {
    this.setData({
      prompt: '密码不能为空'
    })
  }
   else if(this.data.password != this.data.number){
   this.setData(
     {
      prompt: '两次输入的密码不一致'
     }
   )
  }
  else if(this.data.question!='' && this.data.answer==''){

      this.setData(
        {
         prompt: '如果设置密保问题请设置答案'
        }
      )
  

  }
   else {
    const db = wx.cloud.database()
    const _ = db.command     //获取数据库查询及更新指令
    db.collection("user_info").where({
     //_openid: app.globalData.openid 
     ID:this.data.name
    })
    .get()    
    .then(res => {  
      for( i = 0;i < res.data.length;++i)
      {
         //console.log(res.data[i])
         //console.log(res.data[i])
          if (res.data[i].ID==this.data.name)
          {
            break
          }
      }
      console.log(i)
       if(i!=res.data.length){
         this.setData({
          prompt:'用户名已被注册！'
         })
       }
       else{
         this.setData({
           prompt:''
         })
         db.collection("user_info").add({
          data:{
            ID:this.data.name,
            password:this.data.number,
            question:this.data.question,
            password:this.data.password,
            answer:this.data.answer,
            activity_history:[],
            age:"",
            article_history:[],
            class:"",
            club:"",
            college:"",
            grade:"",
            major:"",
            name:"",
            phone:"",
         }, success: (res) => {
             /*wx.showLoading({
               title:"注册成功，即将跳转至登录界面！",
             })*/
             //第一种：弹出提示框，可以选择确定或者取消。
//代码：        
                let name1 = this.data.name
                let number1 = this.data.number
                wx.showModal({
                 title: '提示',
                  content: '注册成功，即将跳转至登录界面！',
                  showCancel:false,
                  success: function (res) {
                  if (res.confirm) {//这里是点击了确定以后
                  //console.log('用户点击确定')
                  wx.navigateTo({
                    url: '../home/home?id='+name1+'&pwd='+number1
                  }) 
             } else {//这里是点击了取消以后
                 // console.log('用户点击取消')
                  wx.redirectTo({
                    url: '../home/home?id='+name1+'&pwd='+number1
                  }) 
              }
               }
            })

             setTimeout(res=>{
               wx.hideLoading()
             },3000)//睡眠函数
             

            },fail: (res) => {
             this.setData({
               prompt: '注册失败！'
              })
           }
        })         
       }           
  }).catch(err => {
      this.setData({
        prompt:'注册失败，姓名或学号已被注册'
      })
    })
    }
   },
   reset()
   {
     this.setData({
       prompt:''
     })
   }


});
