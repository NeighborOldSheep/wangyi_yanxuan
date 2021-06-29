window.yx = {
    g: function (name) {
        return document.querySelector(name);
    },
    ga: function (name) {
        return document.querySelectorAll(name);
    },
    /* 
        事件監聽
            参数:
                obj: 对象名称
                ev: 事件名称
                fn: 回调函数 
    */
    addEvent:function(obj,ev,fn){
        /* 正常浏览器 */
        if(obj.addEventListener){
           obj.addEventListener(ev,fn);
        }
        /* IE浏览器 */
        else{
            obj.attachEvent("on"+ ev,fn);
        }
    },
    removeEvent:function(obj,ev,fn){
        /* 正常浏览器 */
        if(obj.removeEventListener){
            obj.removeEventListener(ev,fn);
        }
        /* IE浏览器 */
        else{
            obj.detachEvent("on" + ev,fn)
        }
    },
    /* 
        获取元素离html的距离 
            参数:
                obj: 获取的对象名
    */
    getTopValue:function(obj){
        var top = 0;
        /* 
            判断该对象是否有父级，如果有就把该对象距离父级元素的距离赋值给top属性，
                并让该对象变为它的父级，依次类推直到只有html才会停。   
        */
        while(obj.offsetParent){
            top  += obj.offsetTop;
            obj = obj.offsetParent;
        };

        return top;
    },

    /* 
        倒计时
            参数:
                1. target 目标时间
    */
    cutTime:function(target){
        var currentDate = new Date();
        var v = Math.abs(target-currentDate);

        return{
            d:parseInt(v/(24*3600000)),
            h:parseInt(v%(24*3600000)/3600000),
            m:parseInt(v%(24*3600000)%3600000/60000),
            s:parseInt(v%(24*3600000)%3600000%60000/1000)
        };
    },
    //给倒计时补零
    format:function(v){
        return v<10?'0'+v:v;
    },

    /* 
        把url后面的参数解析成对象
            参数:
                1. url 真实地址
    */
    parseUrl:function(url){
        //id=1143021
        var reg = /(\w+)=(\w+)/ig;
        var result = {};

        /* 
            参数:
                1. a  整体的url
                2. b  参数前面的字母
                3. c  参数等号后面的数据
        */
        url.replace(reg,function(a,b,c){
            //键值对, b为key c为值
            result[b] = c;
            
        });

        return result;
    },

    public: {
        navFn: function () {
            /* 显示下拉菜单 */

            /* 获取所需的元素 */
            var nav = yx.g(".nav");
            var subNav = yx.g(".subNav");
            var lis = yx.ga(".navBar li");
            var uls = yx.ga(".subNav ul");
            var newLis = []; //存储所需的li元素

            /* 筛选有用的li，-3是为了去除导航栏后三个li，从1开始是因为第一个li没有下拉菜单 */
            for (var i = 1; i < lis.length - 3; i++) {
                newLis.push(lis[i]);
            }

            /* 给每个元素添加所需的样式 */
            for (var i = 0; i < newLis.length; i++) {
                /* 因为li跟ul的功能一样所以等于一起 */
                /* 索引设置 */
                newLis[i].index = uls[i].index = i;
                
                /* 鼠标移入下拉菜单显示 */
                newLis[i].onmouseenter = uls[i].onmouseenter = function () {
                    subNav.style.opacity = 1;
                    uls[this.index].style.display = "block";
                    newLis[this.index].className = "active";
                };

                /* 鼠标移出下拉菜单不显示 */
                newLis[i].onmouseleave = uls[i].onmouseleave = function() {
                    subNav.style.opacity = 0;
                    uls[this.index].style.display = "none";
                    newLis[this.index].className = "";
                };
            }

            yx.addEvent(window,"scroll",setNavPos);

            /* 吸頂導航 */
            function setNavPos(){
                if(window.pageYOffset > nav.offsetTop){
                    nav.id = "navFix"
                }
                else{
                    nav.id = '';
                }

                /* 三目运算符 功能跟上面一样 */
                /* nav.id=window.pageYOffset>nav.offsetTop?'navFix':''; */
            }
        },

        /* 图片懒加载功能 */
        lazyImgFn:function(){
            
            //给window添加scroll事件，每次滚动都调用懒加载函数
            yx.addEvent(window,'scroll',delayImg);
            delayImg();
            function delayImg(){
                var originals = yx.ga(".original"); //所有要懒加载的图片
                var scrollTop = window.innerHeight + window.pageYOffset;    //可视区 + 滚动条的距离
        
                for(var i=0; i<originals.length; i++){
                    /* 
                        如果图片离html上边的距离 小于 滚动条+可视区的距离
                            表示图片已经进入可视区
                    */
                    if(yx.getTopValue(originals[i]) < scrollTop){
                       originals[i].src = originals[i].getAttribute("data-orignial");
                       //如果这个图片地址已经换为真实地址，则移除身上class，为了不再获取该图片属性从而提升优化
                       /* originals[i].removeAttribute('class');    */
                    }
                }

                //移除事件
                if(originals[originals.length-1].getAttribute("src") != "img/empty.gif"){
                    //当这个条件成立，说明所有图片的地址都已经换成真实地址，这时不需要再执行delayImg函数了
                    yx.removeEvent(window,"scroll",delayImg);
                }
            }
        },

        /* 回到顶部功能 */
        backUpFn:function(){
            var back = yx.g(".back");
            var timer;

            /* 给回顶部按钮设置点击响应函数 */
            back.onclick = function(){  
                var top = window.pageYOffset;

                /* 判断是否回到顶部 */
                timer = setInterval(function(){
                    top -= 150;
                    if(top <= 0){
                        top = 0;
                        clearInterval(timer);
                    }
                    /* 
                        设置窗口的滚动条
                            第一个参数是横向滚动条，第二个是竖向的
                     */
                    window.scrollTo(0,top);
                },16);
            };
        }
    }
}

