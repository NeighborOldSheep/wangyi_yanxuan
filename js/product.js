//公用方法调用

//吸顶导航功能
yx.public.navFn();

//回顶部功能
yx.public.backUpFn();

console.log(productList);

//解析url
var params = yx.parseUrl(window.location.href);
console.log(params)
var pageId = params.id;                     //产品对应的id
var curData = productList[pageId];          //产品对应的数据
if(!pageId || !curData){
    //条件满足时，跳转404页面
    window.location.href = "404.html";
} 

console.log(curData)

//面包屑
var positionFn = yx.g("#position");
positionFn.innerHTML = '<a href="#">首页</a> >';
for(var i=0; i<curData.categoryList.length; i++){
    positionFn.innerHTML += '<a href="#">'+curData.categoryList[i].name+'> </a>';
}
positionFn.innerHTML += '<a href="#"> '+curData.name+' </a>';

//http://www.kaivon.cn/getData.php?id=1131017


//产品图功能
(function(){
    //左边图片切换功能
    var bigImg = yx.g("#productImg .left img");
    var smallImgs = yx.ga("#productImg .smallImg img");

    bigImg.src = smallImgs[0].src = curData.primaryPicUrl;

    var last = smallImgs[0];    //上一张图片
    for(var i=0; i<smallImgs.length; i++){
        if(i){
            //这个条件满足，说明现在是后面四张图片
            smallImgs[i].src = curData.itemDetail['picUrl' + i];
        }

        //图片选项卡
        smallImgs[i].index = i;
        smallImgs[i].onmouseover = function(){
            bigImg.src = this.src;
            last.className = 'active';

            last = this;
        };
    }

    //右边图片相关信息更换
    yx.g("#productImg .info h2").innerHTML = curData.name;
    yx.g("#productImg .info p").innerHTML = curData.simpleDesc;
    yx.g("#productImg .info .price").innerHTML = '<div class="price"><div>'+
    '<span>售价</span><strong>￥'+curData.retailPrice+'</strong></div><div><span>促销</span>'+
    '<a href="'+curData.hdrkDetailVOList[0].huodongUrlPc+'" class="tag">'+curData.hdrkDetailVOList[0].activityType+'</a>'+
    '<a href="'+curData.hdrkDetailVOList[0].huodongUrlPc+'" class="discount">'+curData.hdrkDetailVOList[0].name+'</a></div>'+
    '<div><span>服务</span><ul><li><i></i><a href="#">30天无忧  退货</a></li>'+
    '<li><i></i><a href="#">48小时快速退款</a></li>'+
    '<li><i></i><a href="#">满88元免邮费</a></li><li><i></i><a href="#">网易自营品牌</a></li></ul>'+
    '</div></div>';

})();