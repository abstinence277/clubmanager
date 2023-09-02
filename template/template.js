
//初始化数据
function tabbarinit() {
  return [{
    "current":0,
    "pagePath": "pages/user_home/user_home",
    "text":"大厅",
    "iconPath":"/images/stu_tabs/home.png",
    "selectedIconPath": "/images/stu_tabs/home-active.png"
  },{
    "current":0,
    "pagePath": "pages/user_club_info/user_club_info",
    "text":"社团公告",
    "iconPath":"/images/stu_tabs/info.png",
    "selectedIconPath": "/images/stu_tabs/info-active.png"
  },{
    "current":0,
    "pagePath": "pages/user_space/user_space",
    "text":"我的",
    "iconPath":"/images/stu_tabs/avatar.png",
    "selectedIconPath": "/images/stu_tabs/avatar-active.png"
  }  
]
 }

 function tabbarinit1() {
  return [{
    "current":0,
    "pagePath": "pages/user_home/user_home",
    "text":"大厅",
    "iconPath":"/images/stu_tabs/home.png",
    "selectedIconPath": "/images/stu_tabs/home-active.png"
  },{
    "current":0,
    "pagePath": "pages/user_club_info/user_club_info",
    "text":"社团公告",
    "iconPath":"/images/stu_tabs/info.png",
    "selectedIconPath": "/images/stu_tabs/info-active.png"
  },{
    "current":0,
    "pagePath": "pages/user_space/user_space",
    "text":"我的",
    "iconPath":"/images/stu_tabs/avatar.png",
    "selectedIconPath": "/images/stu_tabs/avatar-active.png"
  },{
    "current":0,
    "pagePath": "pages/manager_home/manager_home",
    "text":"大厅",
    "iconPath":"/images/manager_tabs/dating.png",
    "selectedIconPath": "/images/manager_tabs/dating-active.png"
  },{
    "current":0,
    "pagePath": "pages/manager_club_news/manager_club_news",
    "text":"社团公告",
    "iconPath":"/images/manager_tabs/gonggao.png",
    "selectedIconPath": "/images/manager_tabs/gonggao-active.png"
  },{
    "current":0,
    "pagePath": "pages/manager_space/manager_space",
    "text":"我的",
    "iconPath":"/images/manager_tabs/my.png",
    "selectedIconPath": "/images/manager_tabs/my-active.png"
  }
  
]
 
 }

 //tabbar 主入口
 function tabbarmain(bindName = "tabdata", id, target) {
   var that = target;
   var bindData = {};
   var otabbar = tabbarinit();
   otabbar[id]['iconPath'] = otabbar[id]['selectedIconPath']//换当前的icon
   otabbar[id]['current'] = 1;
   bindData[bindName] = otabbar
   that.setData({ bindData });
 }
 
 module.exports = {
   tabbar: tabbarmain
 }