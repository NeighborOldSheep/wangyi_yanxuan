/* 公用方法调用 */

/* 导航栏功能 */
yx.public.navFn();

/* 图片懒加载 */
yx.public.lazyImgFn();

/* 回到顶部功能 */
yx.public.backUpFn();

//banner轮播图
var bannerPic = new Carousel();
bannerPic.init({
    id: 'bannerPic',           //轮播图父级的id，必需传的参数
    autoplay: false,     //自动播放，true为自动，false为不自动，默认为true
    intervalTime: 3000,  //间隔时间，运动后停顿的时间，默认为1s
    loop: true,          //循环播放，true为循环，false为不循环，默认为ture
    totalNum: 5,         //图片总数量
    moveNum: 1,          //单词运动的图片数量(图片总量必须为运动数量的整倍数)
    circle: true,        //小圆点功能，true为显示，false为不显示，默认为显示
    moveWay: "opacity",  //运动方式，opacity为透明度过度，position为位置过度
});

//新品首发轮播图
var newProduct = new Carousel();
newProduct.init({
    id: 'newProduct',    //轮播图父级的id，必需传的参数
    autoplay: false,     //自动播放，true为自动，false为不自动，默认为true
    intervalTime: 3000,  //间隔时间，运动后停顿的时间，默认为1s
    loop: false,          //循环播放，true为循环，false为不循环，默认为ture
    totalNum: 8,         //图片总数量
    moveNum: 4,          //单词运动的图片数量(图片总量必须为运动数量的整倍数)
    circle: false,        //小圆点功能，true为显示，false为不显示，默认为显示
    moveWay: "position",  //运动方式，opacity为透明度过度，position为位置过度
});

newProduct.on("rightEnd",function(){
    this.nextBtn.style.background = "#e7e2d7"
});

newProduct.on("leftEnd",function(){
    this.prevBtn.style.background = "#e7e2d7";
});

newProduct.on("leftClick",function(){
    this.nextBtn.style.background = "#d0c4af"
});

newProduct.on("rightClick",function(){
    this.prevBtn.style.background = "#d0c4af"
});

//大家都在说轮播图
var say = new Carousel();
say.init({
    id: 'sayPic',    //轮播图父级的id，必需传的参数
    autoplay: true,     //自动播放，true为自动，false为不自动，默认为true
    intervalTime: 3000,  //间隔时间，运动后停顿的时间，默认为1s
    loop: true,          //循环播放，true为循环，false为不循环，默认为ture
    totalNum: 3,         //图片总数量
    moveNum: 1,          //单词运动的图片数量(图片总量必须为运动数量的整倍数)
    circle: false,        //小圆点功能，true为显示，false为不显示，默认为显示
    moveWay: "position",  //运动方式，opacity为透明度过度，position为位置过度

});


//人气推荐选项卡
(function(){
    var titles = yx.ga("#recommend header li");
    var contents = yx.ga("#recommend .content");

    for(var i=0; i<titles.length; i++){
        titles[i].index = i;
        titles[i].onclick = function(){
            for(var i=0; i<titles.length; i++){
                titles[i].className = "";
                contents[i].style.display = "none";
            }
            titles[this.index].className= "active";
            contents[this.index].style.display = "flex";
        };
    }
    
})();

//限时购
(function(){
    //获取倒计时的元素
    var timeBox = yx.g("#limit .time");
    var spans = yx.ga("#limit .time span");
    //使用定时器，每秒调用一次倒计时函数
    var timer = setInterval(showTime,1000);

    //倒计时功能函数
    showTime();
    function showTime(){
        var endTime = new Date(2021,6,19,16);
        //如果当前时间没有超过结束事件，才去做倒计时
        if(new Date() < endTime){
            var overTime = yx.cutTime(endTime);
            spans[0].innerHTML = yx.format(overTime.h);
            spans[1].innerHTML = yx.format(overTime.m);
            spans[2].innerHTML = yx.format(overTime.s);
        }
        else{
            clearInterval(timer);
        }
    };


    //商品数据
    var boxWrap = yx.g("#limit .info");
    var str = "";   //存储结构
    var item = json_promotion.itemList;

    for(var i=0; i<item.length; i++){
        str += 
        '<div class="limitBox">'+
        '    <div class="imgBox">'+
        '        <a href="#"><img src="img/empty.gif" data-orignial="'+ item[i].primaryPicUrl+'"></a>'+
        '    </div>'+
        '    <div class="detail right">'+
        '        <p>'+ item[i].itemName+'</p>'+
        '        <span>'+ item[i].simpleDesc+'</span>'+
        '        <div class="numBar">'+
        '            <div class="numCon"><span style="width:'+Number(item[i].currentSellVolume)/Number(item[i].totalSellVolume)*100+'%"></span></div>'+
        '            <span class="numTips">'+ item[i].currentSellVolume+'</span>'+
        '        </div>'+
        '        <div class="payment">'+
        '            <span class="xianshi">限时价</span>'+
        '            <span class="symbol">￥</span>'+
        '            <strong>'+ item[i].actualPrice+'</strong>'+
        '            <span class="yuan">原价￥'+ item[i].retailPrice+'</span>'+
        '        </div>'+
        '        <a href="#" class="qiang">立即抢购</a>'+
        '    </div>'+
        '</div>';
    }

    boxWrap.innerHtml = str;

})();