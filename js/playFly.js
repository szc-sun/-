// 游戏引擎
function Engine(){
  //属性
  this.ele = document.getElementById("body_main");//获取引擎
  //获取li
  this.oUllis = this.ele.children[0].children;
  //记录this
  var that = this;
  //遍历li，添加事件
  for(var i = 0,len = this.oUllis.length;i < len;i ++){
    //记录下标
    this.oUllis[i].index = i;
    //添加点击事件
    this.oUllis[i].onclick = function(){
      //删除ul选项
      this.parentNode.remove();
      //调用加载页面的方法
      that.loadPage();
      that.frequency = this.index;
    }
  }    
}
//原型方法
Engine.prototype = {
  loadPage : function(){
    //创建logo
    var logo = $create('div','logo');
    //加到页面
    $addBody(logo);
    //创建loading
    var loading = $create('div','loading');
    //加到页面
    $addBody(loading);
    //设置loading动画
    var index = 1;
    var timer = setInterval(function(){
      loading.style.background = 'url(../images/loading' + (index ++ % 3 + 1) + '.png) no-repeat';
    },500);
    //设置背景动画
    var that = this;
    var positionY = 1;
    setInterval(function(){
      that.ele.style.backgroundPositionY = ++ positionY + 'px';
    },30)
    //3秒到达战场
    setTimeout(function(){
      //清场
      //删除logo
      logo.remove();
      //删除loading
      loading.remove();
      //停止loading动画
      clearInterval(timer);
      //开始游戏
      that.gameStart();
    },3000)
  },
  gameStart : function(){
    //我方飞机入场
    Plane.init();
    //我方飞机开火
    Plane.fire(this.frequency);
    //创建敌机
    this.createEnemy();
  },
  createEnemy : function(){
    //设置敌机的类型和产生的概率
    //敌小机
    setInterval(function(){
      Math.random() > 0.5 ? new Enemy(0) : "";
    },500)
    //敌中机
    setInterval(function(){
      Math.random() > 0.5 ? new Enemy(1) : "";
    },1000)
    //敌大机
    setInterval(function(){
      Math.random() > 0.2 ? new Enemy(2) : "";
    },8000)
  }
}
//我方飞机
var Plane = {
  //创建我方飞机
  ele : $create('div','my-warplain'),
  //初始化我方飞机
  init : function(){
    //放到页面
    $addBody(this.ele);
    //我方飞机定位
    this.ele.style.left = document.documentElement.clientWidth / 2 - this.ele.offsetWidth / 2 + 'px';
    this.ele.style.top = document.documentElement.clientHeight - this.ele.offsetHeight + 'px';
    //调用我方飞机运动
    this.fly();
  },
  fly : function(){
    var that = this;
    //获取引擎div
    var bodyMain = document.getElementById("body_main");
    //鼠标跟随
    document.onmousemove = function(evt){
      var e = evt || window.event;
      //设置边界
      var left = e.pageX - that.ele.offsetWidth / 2;
      var top = e.pageY - that.ele.offsetHeight / 2;
      if(left <= bodyMain.offsetLeft){
        left = bodyMain.offsetLeft;
      }
      if(left >= bodyMain.offsetLeft + bodyMain.offsetWidth - that.ele.offsetWidth){
        left = bodyMain.offsetLeft + bodyMain.offsetWidth - that.ele.offsetWidth;
      }
      that.ele.style.left = left + 'px';
      that.ele.style.top = top + 'px';
    }
  },
  fire : function(frequency){
    var frequencyMe = 200; //默认的开火频率
    switch(frequency){
      case 0 : frequencyMe = 500;break;
      case 1 : frequencyMe = 400;break;
      case 2 : frequencyMe = 200;break;
      case 3 : frequencyMe = 50;break;
    }
    
    //设置子弹ID
    var bulletId = 0;
    var that = this;
    setInterval(function(){
      that.bullet.push(new Bullet(bulletId));
      bulletId ++;
      console.log(that.bullet);
    },frequencyMe)
  },
  bullet : []
}

//子弹
function Bullet(id){
  this.id = id;
  //创建子弹
  this.ele = $create('div','bullet');
  //初始化
  this.init();
}
Bullet.prototype = {
  init : function(){
    //加到页面
    $addBody(this.ele);
    //给子弹添加id
    this.ele.id = this.id;
    //定位子弹
    this.ele.style.left = Plane.ele.offsetLeft + Plane.ele.offsetWidth / 2 - this.ele.offsetWidth / 2 + 'px';
    this.ele.style.top = Plane.ele.offsetTop - this.ele.offsetHeight + 'px';
    //让子弹飞
    this.fly();
  },
  fly : function(){
    var that = this;
    this.timer = setInterval(function(){
      that.ele.style.top = that.ele.offsetTop - 15 + 'px';
      if(that.ele.offsetTop <= 10){
        that.boom(); //子弹爆炸
      }
    },30)
  },
  boom : function(){
    this.ele.className = 'bullet_die';
    clearInterval(this.timer);
    var that = this;
    setTimeout(function(){
      that.ele.remove();
      for(var i = 0,len = Plane.bullet.length;i < len;i ++){
        if(that.ele.id == Plane.bullet[i].id){
          Plane.bullet.splice(i,1);
        }
      }
    },100)
  }
};

//敌机
function Enemy(type){
  this.type = type;
  this.init();
}
Enemy.prototype = {
  init : function(){
    switch(this.type){
      case 0 : this.ele = $create('div','enemy-small');this.hp = 1;this.speed = 10;break;
      case 1 : this.ele = $create('div','enemy-middle');this.hp = 5;this.speed = 8;break;
      case 2 : this.ele = $create('div','enemy-large');this.hp = 50;this.speed = 2;break;
    }
    //加到页面
    $addBody(this.ele);
    //定位敌机
    this.position();
  },
  position : function(){
    var bodyMain = document.getElementById("body_main");
    this.ele.style.left = $random(bodyMain.offsetLeft,bodyMain.offsetLeft + bodyMain.offsetWidth - this.ele.offsetWidth) + 'px';
    this.ele.style.top = - this.ele.offsetHeight + 'px';
    //敌机起飞
    this.fly();
  },
  fly : function(){
    var that = this;
    this.timer = setInterval(function(){
      that.ele.style.top = that.ele.offsetTop + that.speed + 'px';
      //碰撞检测
      that.collision();
      if(that.ele.offsetTop >= document.documentElement.clientHeight){
        that.ele.remove();
        clearInterval(that.timer);
      }
    },30)
  },
  collision : function(){
    for(var i = 0;i < Plane.bullet.length;i ++){
      if(!(this.ele.offsetTop + this.ele.offsetHeight < Plane.bullet[i].ele.offsetTop || Plane.bullet[i].ele.offsetTop + Plane.bullet[i].ele.offsetHeight < this.ele.offsetTop)){
        if(!(Plane.bullet[i].ele.offsetLeft + Plane.bullet[i].ele.offsetWidth < this.ele.offsetLeft || this.ele.offsetLeft + this.ele.offsetWidth < Plane.bullet[i].ele.offsetLeft)){
          Plane.bullet[i].boom();
          this.hp --;
          if(this.hp == 0){
            this.ele.remove();
            clearInterval(this.timer);
          }
        }
        
      }
    }
  }
}
//工具箱
//删除元素
Element.prototype.remove = function(){
  this.parentNode.removeChild(this);
}
//创建对象并添加类名
function $create(tagName,className){
  var ele = document.createElement(tagName);
  ele.className = className;
  return ele;
}
//将元素对象添加到页面中
function $addBody(obj){
  document.body.appendChild(obj);
}
//随机整数
function $random(min,max){
  return Math.floor(Math.random() * (max - min + 1) + min);
}