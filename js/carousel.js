/* 
    组件api说明
        1.依赖move.js, 组件前一定要引入move.js
        2. 轮播图需要有一个父级，这个父级一定要给一个id
*/

;(function(window,undefined){
    var Carousel = function(){
        this.settings = {
            id:'pic',           //轮播图父级的id，必需传的参数
            autoplay: true,     //自动播放，true为自动，false为不自动，默认为true
            intervalTime:1000,  //间隔时间，运动后停顿的时间，默认为1s
            loop:true,          //循环播放，true为循环，false为不循环，默认为ture
            totalNum:5,         //图片总数量
            moveNum:1,          //单次运动的图片数量(图片总量必须为运动数量的整倍数)
            circle:true,        //小圆点功能，true为显示，false为不显示，默认为显示
            moveWay:"opacity",  //运动方式，opacity为透明度过度，position为位置过度
        };
    };

    Carousel.prototype={
        constructor:Carousel,
        /* 为了用户不传参数时，程序不会报错 */
        init:function(opt){
            var opt = opt || this.settings;

            for(var attr in opt){
                this.settings[attr]=opt[attr];
            }

            this.createDom();
        },
        //创建结构
        createDom:function(){
            var This = this;    //创建一个构造函数

            this.box = document.getElementById(this.settings.id);
            //创建prev按钮
            this.prevBtn = document.createElement("div");
            this.prevBtn.className = "prev";
            this.prevBtn.innerHTML = "<";
            this.prevBtn.onclick = function(){
                This.prev();
                This.trigger("leftClick");
            };
            this.box.appendChild(this.prevBtn);

            //创建next按钮
            this.nextBtn = document.createElement("div");
            this.nextBtn.className = "next";
            this.nextBtn.innerHTML = ">";
            this.nextBtn.onclick = function(){
                This.next();
                This.trigger("rightClick");
            };
            this.box.appendChild(this.nextBtn);

            //创建导航点
            this.circleWrap = document.createElement("div");
            this.circleWrap.className = "navDot";
            this.circles = []; //用来存储导航点,后面需要修改导航点的class
            
            /* 
                如果每次走一个屏幕的图片的话，导航点的数量就不能是totalNumb,
                所以要拿 totalNum/moveNum 的数量
            */
            for(var i=0; i<this.settings.totalNum/this.settings.moveNum; i++){
                var a = document.createElement("a");
                a.index = i;
                a.onclick = function(){
                    This.cn = this.index;
                    This[This.settings.moveWay+"Fn"]();
                };

                this.circleWrap.appendChild(a);
                //把导航点存入数组
                this.circles.push(a);
            }

            this.circles[0].className = "active";

            if(this.settings.circle){
                this.box.appendChild(this.circleWrap);
            }

            //初始化运动功能
            this.moveInit();

        },

        //运动初始化功能
        moveInit:function(){
            this.cn=0;              //当前的索引
            this.ln=0;              //上一个索引
            this.canClick=true;     //是否可以再次点击
            this.endNum=this.settings.totalNum/this.settings.moveNum;    //停止条件
            this.opacityItem=this.box.children[0].children;             //运动透明度的元素
            this.positionItemWrap=this.box.children[0].children[0];     //运动位置元素的父级
            this.positionItem=this.positionItemWrap.children;           //运动位置的所有元素   
            
            switch(this.settings.moveWay){
                case 'opacity':     //如果是透明度，需要设置透明度与transition
                    for(var i=0; i<this.opacityItem.length; i++){
                        this.opacityItem[i].style.opacity = 0;  //设置所有元素透明度为0
                        this.opacityItem[i].style.transition = ".3s opacity";    //给每个元素设置过度效果
                    }
                    this.opacityItem[0].style.opacity = 1;  //第一个图片的透明度为1

                    break;
                
                case "position":    //如果走的是位置，需要设置父级的宽度
                    //这里需要注意一下，一定要加上元素的margin值
                    var leftMargin = parseInt(getComputedStyle(this.positionItem[0]).marginLeft);
                    var rightMargin = parseInt(getComputedStyle(this.positionItem[0]).marginRight);

                    //一个运动元素的实际宽度
                    this.singleWidth = leftMargin + this.positionItem[0].offsetWidth + rightMargin;

                    //如果运动是循环的，需要复制一份内容
                    if(this.settings.loop){
                        this.positionItemWrap.innerHTML += this.positionItemWrap.innerHTML;
                    }

                    //复制内容后才能设置宽度
                    this.positionItemWrap.style.width = this.singleWidth * this.positionItem.length + "px";
            }

            if(this.settings.autoplay){
                this.autoPlay();
            }
        },   

        //透明度运动方式
        opacityFn:function(){
            //左边到头
            if(this.cn < 0){
                //判断用户是否设置轮播图循环
                if(this.settings.loop){
                    //循环
                    this.cn = this.endNum-1;
                }
                else{
                    //不循环
                    this.cn = 0;
                    /* 
                        解决点击头一张图或者最后一张图，不能再次点击的问题。
                            transitionend里面设置的，如果不循环的话就会不触发transitionend
                    */
                    this.canClick = true;   
                }
            }

            //右边到头
            if(this.cn > this.endNum-1){
                //判断用户是否设置循环
                if(this.settings.loop){
                    //循环
                    this.cn = 0;
                }
                else{
                    //不循环
                    this.cn = this.endNum-1;
                    this.canClick = true;
                }
            }

            this.opacityItem[this.ln].style.opacity = 0;    //让上一张图片的透明度为0
            this.circles[this.ln].className = "";             //让上一个导航点active样式去掉

            this.opacityItem[this.cn].style.opacity = 1;    //设置下一张图片透明度为1
            this.circles[this.cn].className = "active";     //给导航点设置为active

            var This = this;
            var en = 0;

            this.opacityItem[this.cn].addEventListener("transitionend",function(){
                en++;
                if(en==1){
                    This.endFn();   //调用自定义事件
                    This.canClick = true;
                    This.ln = This.cn;
                }
            });
        },

        positionFn:function(){
            //左边到头
            if(this.cn < 0){
                //是否循环
                if(this.settings.loop){
                    //循环
                    /* 
                        在这里需要做两件事情
                            1. 先让运动的父级的位置到达中间，为了往右走不会出现空白
                            2. 同时修改索引值(到中间，并不是停在原地，而是要显示前一屏的内容，所以cn值减一)
                    */
                    this.positionItemWrap.style.left = -this.positionItemWrap.offsetWidth/2+"px";
                    this.cn = this.endNum-1;
                }
                else{
                    //不循环
                    this.cn = 0;
                }
            }

            /* //右边到头
            if(this.cn > this.endNum-1){
                //是否循环
                if(this.settings.loop){
                    //循环,这里不用做任何事情。需要在运动结束后去做条件判断
                }
                else{
                    //不循环
                    this.cn = this.endNum-1;
                }
            } */

            //上面的简写
            if(this.cn > this.endNum-1 && !this.settings.loop){
                this.cn = this.endNum-1;
            }

            //修改圆点，只有不循环的时候才去修改圆点
            if(!this.settings.loop){
                //不循环
                this.circles[this.ln].className = "";
                this.circles[this.ln].className = "active";
            }

            var This = this;

            //运动
            //left的值 = 一个元素的宽度*当前cn的值*一次运动元素的个数(moveNum)
            move(this.positionItemWrap,{left:-this.cn*this.singleWidth*this.settings.moveNum},300,"linear",
                function(){
                    //走到第二份的第一屏的时候需要让运动的父级的left值变为0
                    if(This.cn == This.endNum){
                        //这个条件成立，说明现在已经到了第二份的第一屏
                        this.style.left = 0;
                        this.cn = 0;
                    };

                    This.endFn();   //调用自定义事件

                    This.canClick = true;
                    This.ln = This.cn;
                });
        },

        //上一个按钮点击功能
        prev:function(){
            //能否进行下一次点击，要放在这里面去判断
            if(!this.canClick){
                return;
            }
            this.canClick = false;
            
            this.cn--;
            this[this.settings.moveWay + "Fn"]();     //参数传的是什么运动方式，这里面调用什么方式的函数
        },

        //下一个按钮点击功能
        next:function(){
            if(!this.canClick){
                return;
            }
            this.canClick = false;

            this.cn++;
            this[this.settings.moveWay + "Fn"]();
        },

        //自动播放
        autoPlay:function(){
            var This = this;
            this.timer = setInterval(function(){
                This.next();
            },this.settings.intervalTime);

            //鼠标放上去的时候停止，停止播放
            this.box.onmouseenter = function(){
                clearInterval(This.timer);
                This.timer = null;
            };
            
            //当鼠标离开继续播放
            this.box.onmouseleave = function(){
                This.autoPlay();
            };
        },
        
        //自定义事件

        /* 
            添加自定义事件
                参数:
                    1. type 事件名称
                    2. listener 事件对应触发的函数
        */
        on:function(type,listener){  
            this.events = this.events || {};
            this.events[type] = this.events[type] || [];
            this.events[type].push(listener);
        },

        /* 
            调用自定义事件
                参数:
                    1. type 事件名称
        */
        trigger:function(type){
            //条件说明有些组件有自定义事件，有的没有，所以需要做判断，只有添加自定义事件的实例才能执行下面代码
            if(this.events && this.events[type]){
                for(var i=0; i<this.events[type].length; i++){
                    this.events[type][i].call(this);
                }
            }
        },

        endFn: function(){
            //添加自定义事件的函数，在运动完成以后添加;只能加给不循环的运动
            if(!this.settings.loop){
                //左边运动到头
                if(this.cn==0){
                    this.trigger("leftEnd"); //调用自定义事件
                }
                //右边运动到头
                if(this.cn == this.endNum-1){
                    this.trigger("rightEnd");
                }
            }
        },

    };

    window.Carousel = Carousel;

})(window,undefined);