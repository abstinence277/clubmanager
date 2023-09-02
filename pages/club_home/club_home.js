// pages/club_home/club_home.js
let name1 = '';
let _id = '';
let inc = '';
let boy = 0;
let girl = 0;
Component({


  /**
   * 页面的初始数据
   */
  data: {
    announce:'',
    name:'',
    time:'',
    people:'',
    canvasInfo:{},
    dataList:[{
      title:"男",
      value:3,
      background:"#b8f2e6"
  },{
      title:"女",
      value:8,
      background:"#ffa69e"
  }],
  pieInfo:{}

  },


  /**
   * 生命周期函数--监听页面加载
   */
  attached:function(options) {
    name1 =wx.getStorageSync('zifu')
    boy = 0
    girl = 0
    //const db = wx.cloud.database()
    const db = wx.cloud.database()
    db.collection('user_info').get()
    .then(res=>
      {
        for(let i = 0;i<res.data.length;i++)
        {
          for(let j = 0;j<res.data[i].club.length;j++)
          {
            if(res.data[i].club[j]==name1)
            {
              if(res.data[i].sex=='男')
              {
                boy = boy + 1
              }
              else{
                girl = girl + 1
              }
            }
          }
        }
        console.log(boy)
        this.setData(
          {
            dataList:[{
              title:"男",
              value:boy,
              background:"#b8f2e6"
          },{
              title:"女",
              value:girl,
              background:"#ffa69e"
          }],
          }
        )
        
      })
    name1 = wx.getStorageSync('zifu')
    
    db.collection("club_admin").where(
      {
        ID:name1
      }
    ).get()
    .then(
      res=>
      {
         this.setData(
           {
             name:res.data[0].club_name,
             time:res.data[0].club_found,
             people:res.data[0].club_total_number
           }
         )
      }
    )
    this.messureCanvas()

  },
  
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady:function(e){
   
    var context =wx.createContext();
    var array=[20,20,30,30];
    var colors=["#ff00f0","#fff000","#000fff","#00ff0f"];
    var total=0;
    var index=0;
    var i=0;
    
    for(index=0;index<array.length;index++){
        total+=array[index];
    }
    var point={x:100,y:100};
    var radius=60;
    var j=0;
    for(i=0;i<array.length;i++){
        context.beginPath();
        var start=0;
        if(i>0){
            for(j=0;j<i;j++){
                start+=array[j]/total*2*Math.PI;
            }
        }
        console.log("i:"+i);
        console.log("start:"+start);
        context.arc(point.x,point.y,radius,start,array[i]/total*2*Math.PI,false);
        context.lineTo(point.x,point.y);
        context.setFillStyle(colors[i]);
        context.fill();
        context.closePath();
    }
    wx.drawCanvas({
        canvasId:'canvas2',
        actions:context.getActions()
    });
  },
  methods:{
    
  reset()
  {
    name1 =wx.getStorageSync('zifu')
    boy = 0
    girl = 0
    //const db = wx.cloud.database()
    const db = wx.cloud.database()
    db.collection('user_info').get()
    .then(res=>
      {
        for(let i = 0;i<res.data.length;i++)
        {
          for(let j = 0;j<res.data[i].club.length;j++)
          {
            if(res.data[i].club[j]==name1)
            {
              if(res.data[i].sex=='男')
              {
                boy = boy + 1
              }
              else{
                girl = girl + 1
              }
            }
          }
        }
        console.log(boy)
        this.setData(
          {
            dataList:[{
              title:"男",
              value:boy,
              background:"#b8f2e6"
          },{
              title:"女",
              value:girl,
              background:"#ffa69e"
          }],
          }
        )
        
      })
    //const db = wx.cloud.database()
    db.collection("club_admin").where(
      {
        ID:name1
      }
    ).get()
    .then(
      res=>
      {
         this.setData(
           {
             name:res.data[0].club_name,
             time:res.data[0].club_found_date,
             people:res.data[0].club_total_number
           }
         )
      }
    )
    this.messureCanvas()
  },
  sub()//编辑社团介绍位置
  {
    if(this.data.announce=='')
    {
      wx.showModal({
        title: '提示',
        content: '当前编辑内容为空！',
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
    db.collection('club_admin').where({
      ID:name1
    }).get()
    .then(
      res=>{
        _id = res.data[0]._id
        inc = res.data[0].introduction
        //console.log(_id)
        //console.log(this.data.announce)
        wx.showModal({
          title: '提示',
          content: '您确定要提交新的编辑内容吗？',
          complete: (res) => {
            if (res.cancel) {
              
            }
        
            if (res.confirm) {
              db.collection('club_admin').doc(_id).update({
                data:
                {
                  introduction:this.data.announce
                }
              })
              wx.showModal({
                title: '提示',
                content: '修改成功',
                showCancel:false,
              })
            }
          }
        })
        
      }
    )
    }
  },
  messureCanvas(){
    boy = 0
    girl = 0
    let query =wx.createSelectorQuery().in(this);
    query.select('#pieCanvas').boundingClientRect();
    var that=this
    query.exec((res)=>{
        console.log(res)
        var canvasInfo={}
        canvasInfo.width=res[0].width
        canvasInfo.height=res[0].height
        that.setData({
            canvasInfo:canvasInfo
        })
        console.log(canvasInfo)
        that.drawPie(-1)
    })
},
drawPie(index){
  const ctxPie = wx.createCanvasContext("pieCanvas",this)
  //const ctxPie = this
  var canvasInfo = this.data.canvasInfo
  var dataList = this.data.dataList
  var pieInfo = this.data.pieInfo
  var pieRadius = (canvasInfo.width - 90) / 4
  pieInfo.pieRadius = pieRadius
  var pieX = 30 + pieRadius
  pieInfo.centerX = pieX
  var pieY = 30 + pieRadius
  pieInfo.centerY = pieY
  var totalValue = 0
  for (var i = 0; i < dataList.length; i++) {
    totalValue = totalValue + dataList[i].value
  }
  var area = []
  for (var i = 0; i < dataList.length; i++) {
    var areaItem = {}
    ctxPie.beginPath()
    var start = 0
    for (var j = 0; j < i; j++) {
      start = start + dataList[j].value
    }
    if (i < dataList.length - 1) {
      if(index==i){
        ctxPie.arc(pieX, pieY, pieRadius+5, start / totalValue * 2 * Math.PI, (start + dataList[i].value) / totalValue * 2 * Math.PI)
      }else{
        ctxPie.arc(pieX, pieY, pieRadius, start / totalValue * 2 * Math.PI, (start + dataList[i].value) / totalValue * 2 * Math.PI)
      }
      areaItem.start = start / totalValue * 2 * Math.PI
      areaItem.end = (start + dataList[i].value) / totalValue * 2 * Math.PI
    } else {
      if(index == i){
        ctxPie.arc(pieX, pieY, pieRadius+5, start / totalValue * 2 * Math.PI, 2 * Math.PI)
      }else{
        ctxPie.arc(pieX, pieY, pieRadius, start / totalValue * 2 * Math.PI, 2 * Math.PI)
      }
      areaItem.start = start / totalValue * 2 * Math.PI
      areaItem.end = 2 * Math.PI
    }
    area.push(areaItem)
    ctxPie.lineTo(pieX, pieY);
    ctxPie.setFillStyle(dataList[i].background);
    ctxPie.fill();
    ctxPie.closePath();


    //绘制标注
    var startX = 2 * pieRadius + 60
    var startY = (30 + pieRadius) - 30 * dataList.length / 2 + i * 30
    ctxPie.setFillStyle(dataList[i].background)
    ctxPie.fillRect(startX, startY, 20, 20)


    ctxPie.setFillStyle('#8a8a8a')
    ctxPie.setFontSize(12)
    ctxPie.fillText(dataList[i].title, startX + 30, startY + 15)
    ctxPie.fillText(dataList[i].value + "", startX + 70, startY + 15)
    ctxPie.fillText(parseInt(dataList[i].value * 100 / totalValue) + "%" + "", startX + 100, startY + 15)

  }
  pieInfo.area = area
  this.data.pieInfo = pieInfo
  console.log(this.data.pieInfo)
  ctxPie.draw()
},

touchStart(e) {
  var pieInfo = this.data.pieInfo
  var x = e.touches[0].x
  var y = e.touches[0].y
  if ((Math.pow(x - pieInfo.centerX, 2) + Math.pow(y - pieInfo.centerY, 2)) > Math.pow(pieInfo.pieRadius, 2)) {
    console.log("在圆外，不执行")
    return
  }
  var pointPos = 0
  console.log("在圆内，继续执行")
  var angle = Math.atan((y - pieInfo.centerY) / (x - pieInfo.centerX)) / (Math.PI / 180)
  //判断角度值
  if (x > pieInfo.centerX) {
    if (angle > 0) {
      pointPos = angle / 180 * Math.PI
    } else {
      pointPos = angle / 180 * Math.PI + 2 * Math.PI
    }
  } else {
    if (angle > 0) {
      pointPos = angle / 180 * Math.PI + Math.PI
    } else {
      pointPos = angle / 180 * Math.PI + Math.PI
    }
  }
  var index = 0
  for(var i = 0;i<pieInfo.area.length;i++){
    if(pointPos>pieInfo.area[i].start&&pointPos<pieInfo.area[i].end){
      index = i
    }
  }
  console.log("在第"+index+"个区域")
  this.drawPie(index)
},
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