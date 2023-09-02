// pages/home/home.js
let i = 0;
let status = ''
const app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  /*找回密码 */
  recover()
  {
    wx.navigateTo({
      url: '../home_recover/home_recover',
    })
  },
  data: {
    name:'', //可以设置页面的初始化数据
    sex:'',
    grade:'',
    major:'',
    prompt:'在下方选择登录身份，无账号请先注册！',
    items: [
      { name: 'public_user', value: '用户'},
      { name: 'sys_admin', value: '系统管理员',checked:true},
      { name: 'club_admin', value: '社团管理员' }
    ],
    formData: {
      username: "",
      password: "",
      checked: false,
      items:[
      { name: 'public_user', value: '用户'},
      { name: 'sys_admin', value: '系统管理员',checked:true},
      { name: 'club_admin', value: '社团管理员' }
    ]
    }
  },
  radioChange(e) {
    status = e.detail.value //别往下看了，这部分函数就这一行代码有用！！！--TONYCHENG
    console.log('radio发生change事件，携带value值为：', e.detail.value)

    const items = this.data.items
    for (let i = 0, len = items.length; i < len; ++i) {
      if(items[i].name == status){
        items[i].checked = true
      }else{
        items[i].checked = false
      }
    }
    console.log(items)
    this.setData({
      'items':items,
      'formData.items': items
    })
  },

  register()
      {
        wx.navigateTo({
          url: '../register_home/register_home', //在~这~里~哦~ TONYCHENG
        })
      },
  login()
  {
    if(this.data.name=='')
    {
        this.setData({
          prompt:'用户名不能为空'
        })
    }
    else if(this.data.number=='')
    {
      this.setData({
        prompt:'请输入密码!'
      })
    }
    else{
      if(status=='public_user')
      {
        const db = wx.cloud.database()
        const _ = db.command
        db.collection("user_info").where(
          {
            ID:this.data.name
          }
        )
        .get()
        .then(
          res =>{
            if(res.data.length==0)
            {
              this.setData({
                prompt:'用户名或密码错误！'
              })
            }
            else{
            for(i = 0;i<res.data.length;i++)
            {
              if(this.data.name==res.data[i].ID)
              {
                if(this.data.number==res.data[i].password)
                {
                  app.globalData.name=res.data[i].name
                  app.globalData.ID=res.data[i].ID
                  app.globalData.sex=res.data[i].sex
                  app.globalData.major=res.data[i].college
                  app.globalData.grade=res.data[i].grade
                  wx.showModal({
                    title: '提示',
                    content: '登录成功，即将跳转至用户页面',
                    showCancel:false,
                    complete: (res) => {
                      if (res.cancel) {

                      }

                  
                      if (res.confirm) {
                        //缓存机制，暂时存储登录用户名
                        wx.setStorage({
                          data: this.data,
                          key: 'userID',
                        }),
                         // 如果勾选"记住密码"选框则存储登录信息，反之则清空存储的信息
                        this.data.formData.checked == true ? wx.setStorageSync("formData", this.data.formData) : wx.setStorageSync("formData", ""),
                        
  

                        wx.redirectTo({
                          url: '../user_index/user_index',
                        })
                      }
                    }
                  })
                }
                else{
                  this.setData({
                    prompt:'用户名或密码错误！'
                  })
                }
              }
            }
          }
          }
        )
      }
      else if(status=='sys_admin')
      {
        const db = wx.cloud.database()
        const _ = db.command
        db.collection("sys_admin").where(
          {
            ID:this.data.name
          }
        )
        .get()
        .then(
          res =>{
            if(res.data.length==0)
            {
              this.setData({
                prompt:'用户名或密码错误！'
              })
            }
            else{
            for(i = 0;i<res.data.length;i++)
            {
              if(this.data.name==res.data[i].ID)
              {
                if(this.data.number==res.data[i].password)
                {
                  wx.showModal({
                    title: '提示',
                    content: '登陆成功，即将跳转至总管理页面',
                    showCancel:false,
                    complete: (res) => {
                      if (res.cancel) {
                        
                      }
                  
                      if (res.confirm) {
                        wx.setStorage({
                          data: this.data,
                          key: 'userID',
                        }),
                         // 如果勾选"记住密码"选框则存储登录信息，反之则清空存储的信息
                        this.data.formData.checked == true ? wx.setStorageSync("formData", this.data.formData) : wx.setStorageSync("formData", ""),
                    
                        wx.redirectTo({
                          url: '../manager_index/manager_index',
                        })
                      }
                    }
                  })
                }
                else{
                  this.setData({
                    prompt:'用户名或密码错误！'
                  })
                }
              }
            }
          }
          }
        )
      }
      else if(status=='club_admin')
      {
        const db = wx.cloud.database()
        const _ = db.command
        db.collection("club_admin").where(
          {
            ID:this.data.name
          }
        )
        .get()
        .then(
          res =>{
            if(res.data.length==0)
            {
              this.setData({
                prompt:'用户名或密码错误！'
              })
            }
            else{
            for(i = 0;i<res.data.length;i++)
            {
              if(this.data.name==res.data[i].ID)
              {
                if(this.data.number==res.data[i].password)
                {
                  wx.setStorage({//同上，采用暂存机制
                    key:'zifu',
                    data:this.data.name
                  }),
                  this.data.formData.checked == true ? wx.setStorageSync("formData", this.data.formData) : wx.setStorageSync("formData", ""),
                  wx.showModal({
                    title: '提示',
                    content: '登录成功，即将跳转至社团管理页面！',
                    showCancel:false,
                    complete: (res) => {
                      if (res.cancel) {
                        
                      }
                  
                      if (res.confirm) {
                        wx.redirectTo({
                          url: '../club_index/club_index',
                        })
                      }
                    }
                  })
                }
                else{
                  this.setData({
                    prompt:'用户名或密码错误！'
                  })
                }
              }
            }
          }
          }
        )
      }
    }
       /* wx.redirectTo({
          url: '../login_home/login_home', //在~这~里~哦~ TONYCHENG
        })*/
  },
    
  /**
   * 生命周期函数--监听页面加载
   */
  ohShow:function(){
    /*if(getApp().globalData.userInfo != null)
      {
         this.setData(
           {
             one:getApp().globalData.userInfo,
             two:getApp().globalData.userpassword
           }
         )
      }*/
  },
  onLoad:function(options){
    // 赋值操作
    if(wx.getStorageSync("formData").items != null){
      this.setData({
        'formData.username': wx.getStorageSync("formData").username,
        'formData.password': wx.getStorageSync("formData").password,
        'formData.checked': wx.getStorageSync('formData').checked,
        'formData.items': wx.getStorageSync('formData').items,
        'name':wx.getStorageSync("formData").username,
        'number':wx.getStorageSync("formData").password,
        'items':wx.getStorageSync("formData").items
      })
      for (let i = 0, len = this.data.items.length; i < len; ++i) {
        if(this.data.items[i].checked == true){
          status = this.data.items[i].name
        }
      }
    }
    

},
// 记住密码框事件方法
onChange(e) {
  this.setData({
    'formData.checked': e.detail.value.includes('1')
  })
},//获取用户名
userInput(e) {
  this.setData({
    'formData.username': e.detail.value
  })
},
//获取密码
psdInput(e) {
  this.setData({
    'formData.password': e.detail.value
  })
},

})