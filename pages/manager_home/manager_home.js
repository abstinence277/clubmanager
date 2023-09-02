const db=wx.cloud.database()
let mn=0;
let fmn=0;
let othersn=0;
var wxCharts=require("../../utils/wxcharts")
Component({
  data: {
    male:10,
    female:10,
    dataobj:"",
    canvasInfo:{},
    result:[],
    dataList:[{
      title:"男",
      value:10,
      background:"#b8f2e6"
  },{
      title:"女",
      value:10,
      background:"#ffa69e"
  }
],
    pieInfo:{}
  },lifetimes:{
    attached:function(options){
      this.init();
      console.log("onload2")
      this.drawZhuChart();
      console.log("onload3")
      this.messureCanvas();
    },
    ready:function(options){
      this.drawZhuChart();
      this.messureCanvas();
    }
  }
  ,
  /**
   * 生命周期函数--监听页面加载
   */
  
  methods:{ 
    onLoad: function (options) {
      this.init();
      console.log("onload")
    },
  test(){
    this.messureCanvas()
    this.drawZhuChart()
 },
async init(){
  const c=db.collection("user_info")
  let that=this
  const total=await (await c.count()).total
  const batchTimes=Math.ceil(total/20)
  console.log("获取次数为：",batchTimes)
  let arraypro=[]
  let arraypro2=[]
  let x=0
  let y=0
  var female="dataList["+1+"].value" 
  var male="dataList["+0+"].value"
  let resultr=[];
  let i=0;
  let mn=0;
  let fmn=0;
  for(let i=0;i<batchTimes;i++){
    db.collection("user_info").skip(i*20).get().then(res=>{
      x+=1
      for(let j=0;j<res.data.length;j++)
      {
        arraypro.push(res.data[j].college)
        if(res.data[j].sex=='男')
        {
          fmn=fmn+1
        }
        if(res.data[j].sex=='女')
        {
          mn+=1
        }
      }
      if(x==batchTimes){
        //console.log(arraypro)
        that.setData({
          result:arraypro,
          [male]:mn,
          [female]:fmn
        })
        //console.log(this.data.result)
      }
    })
  }
  /*
  db.collection('studinfo_temp').get().then(
    res=>{
      for(i=0;i<res.data.length;i++){
        resultr.push(res.data[i].college)  
      }
      console.log(resultr)   
      this.setData({
        result:this.data.result.concat(resultr)
      })   
      console.log(this.data.result)
    }
  )
  
 x=0
 
 for(let i=0;i<batchTimes;i++){
  db.collection('studinfo_temp').skip(i*20).where(
    {
      sex:"1"
    }
  )
      .get()
      .then(res=>{
        x=x+1
        mn=mn+res.data.length
        if(x==batchTimes){
          console.log('请求成功',res.data.length)
          that.setData({
          [male]:mn
          })
        }
          console.log(this.data.dataList[0])
      })
      .catch(err=>{
          console.log('请求失败',err)
      })
      db.collection('studinfo_temp').skip(i*20).where(
        {
          sex:"0"
        }
      )
          .get()
          .then(res=>{
            x=x+1
            fmn=fmn+res.data.length
            if(x==batchTimes){
              console.log('请求成功',res.data.length)
              that.setData({
              [female]:fmn
              })
            }
              console.log(this.data.dataList[1])
          })
          .catch(err=>{
              console.log('请求失败',err)
          })
 }
  */
  console.log('initial completed')
}, 
drawZhuChart(that){
  let resulttemp=[];
  resulttemp=this.data.result
  let col=[];
  let num=[];
  let sum=0;
  let numtemp=0;
  let i=0;
  let j=0;
  let flag=0;
  sum=resulttemp.length
  for(i=0;i<resulttemp.length;i++)
  {
    for(j=0;j<i+1;j++)
    {
      if(col[j]==resulttemp[i]){
        flag=1;
      }
    }
    if(flag==0){
      col.push(resulttemp[i])
    }
    flag=0;
  }
  //console.log(col)
  for(i=0;i<col.length;i++){
    for(j=0;j<resulttemp.length;j++){
      if(resulttemp[j]==col[i]){
        numtemp++
      }
    }
    num.push(numtemp)
    numtemp=0;
  }
  //console.log(num)
  let width = 300;	//手机宽度
  let height = 750; //手机高度
  let rectWidth = width * 0.65;	//定义长方快最长长度
  let rectHeight = 20;	//定义长方块高度
  let spaceHeight = 5;	//定义每个长方块的间距
  let max=Math.max.apply(null,num);
  var dataons=[
    {
      name:"临时",
      pre:20,
      cont:20,
    }
  ];
  var data = [ //绘图数据
    ];
    //console.log(data)
  for(i=0;i<col.length;i++){      
    data.push({
      name:col[i],
      pre:num[i]/max*100,
      cont:num[i]
    })
    //console.log(data[i])
  }
  //console.log(data)
  let ctx = wx.createCanvasContext('zchart',this);
  
  ctx.setTextAlign("left");
  ctx.setTextBaseline('middle');
  ctx.setFontSize(12);

  let curDataLocation = [];

  for(var x in data){
    ctx.setFillStyle("#50D2C2");
    
    let startPoint = {	//计算每个数据的起点
      x:0,
      y:x * (rectHeight + spaceHeight),
    }   
    //填充画布
    ctx.fillRect(startPoint.x,startPoint.y,rectWidth * data[x].pre / 100 ,rectHeight); 

    ctx.setFillStyle("#000000");
	
	//计算文字坐标
    let textSize = {
      x:startPoint.x + rectWidth * data[x].pre / 100 + spaceHeight,
      y:startPoint.y + rectHeight / 2
    } 
    ctx.fillText(data[x].name + " " + data[x].cont , textSize.x,textSize.y);
	
	//捕捉每组 数据，便于计算点击时是点击的哪个模块
    curDataLocation.push({
      start:startPoint,
      end:{
        x:startPoint.x + rectWidth,
        y:startPoint.y + rectHeight
      },
      data:data[x]
    }); 

  } 

  ctx.draw();

},
  
  messureCanvas(){
      let query =wx.createSelectorQuery().in(this);
      query.select('#pieCanvas').boundingClientRect();
      var that=this
      query.exec((res)=>{
          //console.log(res)
          var canvasInfo={}
          canvasInfo.width=res[0].width
          canvasInfo.height=res[0].height
          that.setData({
              canvasInfo:canvasInfo
          })
          //console.log(canvasInfo)
          that.drawPie(-1)
      })
      
  },
  drawPie(index){
    
    const ctxPie = wx.createCanvasContext("pieCanvas",this)
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
    //console.log(this.data.pieInfo)
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
   * 生命周期函数--监听页面初次渲染完成
   */

});
