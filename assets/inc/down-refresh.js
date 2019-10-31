//创建MeScroll对象,内部已默认开启下拉刷新,自动执行up.callback,刷新列表数据;
// 不能左右滑动切换
var isPC = typeof window.orientation == 'undefined';
var mescroll = null;
function mesrcollFn(){
	mescroll = new MeScroll("mescroll", {
		//下拉刷新的所有配置项
		down:{
			callback: function(mescroll) {
				//下拉刷新的回调,默认重置上拉加载列表为第一页(down的auto默认true,初始化Mescroll之后会自动执行到这里,而mescroll.resetUpScroll会触发up的callback)
				//mescroll.resetUpScroll();
				var page = {num:1, size:10};
				getListData(page)
			},
			offset: 60, //触发刷新的距离,默认80
			mustToTop: true,
			/*outOffsetRate: 0.2, //超过指定距离范围外时,改变下拉区域高度比例;值小于1且越接近0,越往下拉高度变化越小;
			bottomOffset: 20, //当手指touchmove位置在距离body底部20px范围内的时候结束上拉刷新,避免Webview嵌套导致touchend事件不执行
			minAngle: 45, //向下滑动最少偏移的角度,取值区间  [0,90];默认45度,即向下滑动的角度大于45度则触发下拉;而小于45度,将不触发下拉,避免与左右滑动的轮播等组件冲突;
			hardwareClass: "mescroll-hardware", //硬件加速样式;解决iOS下拉因隐藏进度条而闪屏的问题,参见mescroll.css
			mustToTop: false, // 是否滚动条必须在顶部,才可以下拉刷新.默认false. 当您发现下拉刷新会闪白屏时,设置true即可修复.
			warpClass: "mescroll-downwarp", //容器,装载布局内容,参见mescroll.css
			resetClass: "mescroll-downwarp-reset", //高度重置的动画,参见mescroll.css
			textInOffset: '下拉刷新', // 下拉的距离在offset范围内的提示文本
		    textOutOffset: '释放更新', // 下拉的距离大于offset范围的提示文本
		    textLoading: '加载中 ...', // 加载中的提示文本
			inited: function(mescroll, downwarp) {
				console.log("down --> inited");
				//初始化完毕的回调,可缓存dom
				mescroll.downTipDom = downwarp.getElementsByClassName("downwarp-tip")[0];
				mescroll.downProgressDom = downwarp.getElementsByClassName("downwarp-progress")[0];
			},
			inOffset: function(mescroll) {
				console.log("down --> inOffset");
				//进入指定距离offset范围内那一刻的回调
				if (mescroll.downTipDom) mescroll.downTipDom.innerHTML = mescroll.optDown.textInOffset;
				if(mescroll.downProgressDom) mescroll.downProgressDom.classList.remove("mescroll-rotate");
			},
			outOffset: function(mescroll) {
				console.log("down --> outOffset");
				//下拉超过指定距离offset那一刻的回调
				if (mescroll.downTipDom) mescroll.downTipDom.innerHTML = mescroll.optDown.textOutOffset;
			},
			onMoving: function(mescroll, rate, downHight) {
				//下拉过程中的回调,滑动过程一直在执行; rate下拉区域当前高度与指定距离offset的比值(inOffset: rate<1; outOffset: rate>=1); downHight当前下拉区域的高度
				console.log("down --> onMoving --> mescroll.optDown.offset="+mescroll.optDown.offset+", downHight="+downHight+", rate="+rate);
				if(mescroll.downProgressDom) {
					var progress = 360 * rate;
					mescroll.downProgressDom.style.webkitTransform = "rotate(" + progress + "deg)";
					mescroll.downProgressDom.style.transform = "rotate(" + progress + "deg)";
				}
			},
			beforeLoading: function(mescroll, downwarp) {
				console.log("down --> beforeLoading");
				//准备触发下拉刷新的回调
				return false; //如果要完全自定义下拉刷新,那么return true,此时将不再执行showLoading(),callback();
			},
			showLoading: function(mescroll) {
				console.log("down --> showLoading");
				//触发下拉刷新的回调
				if (mescroll.downTipDom) mescroll.downTipDom.innerHTML = mescroll.optDown.textLoading;
				if(mescroll.downProgressDom) mescroll.downProgressDom.classList.add("mescroll-rotate");
			},
		    afterLoading: function (mescroll) {
		    	console.log("down --> afterLoading");
		        // 结束下拉之前的回调. 返回延时执行结束下拉的时间,默认0ms; 常用于结束下拉之前再显示另外一小段动画,才去结束下拉的场景, 参考案例【dotJump】
		        return 0
		    }*/
		},
		//上拉加载的所有配置项
		up: {
			isBounce: false, //是否允许ios的bounce回弹;默认true,允许回弹; 此处配置为false,可解决微信,QQ,Safari等等iOS浏览器列表顶部下拉和底部上拉露出浏览器灰色背景和卡顿2秒的问题
			callback: getListData, //上拉回调,此处可简写; 相当于 callback: function (page, mescroll) { getListData(page); }
			page: {
				num: 0, //当前页 默认0,回调之前会加1; 即callback(page)会从1开始
				size: 10, //每页数据条数
				time: null //加载第一页数据服务器返回的时间; 防止用户翻页时,后台新增了数据从而导致下一页数据重复;
			},
			noMoreSize: 1, //如果列表已无数据,可设置列表的总数量要大于半页才显示无更多数据;避免列表数据过少(比如只有一条数据),显示无更多数据会不好看
			offset: 100, //离底部的距离
//			toTop: { //配置回到顶部按钮
//				src: "img/mescroll-totop.png", //默认滚动到1000px显示,可配置offset修改
//				//offset : 1000
//			},
			empty: {
				icon: "img/noData.png",  //图标,默认null
				tip: "这里空空如也，去看看别的" //提示
			},
			clearEmptyId: "dataList", //相当于同时设置了clearId和empty.warpId; 简化写法;默认null; 注意vue中不能配置此项
//			htmlNodata: '<p class="upwarp-nodata">没有更多数据啦~~</p>', //无数据的布局
		}
	});
}


/*初始化菜单*/
var pdType=0;//结息中全部商品2; 本金兑付2; 已完成3;（可根据需要修改）
//$(".nav>span").click(function(){
//	var i = $(this).attr("i");
//	if(pdType != i) {
//		//更改列表条件
//		pdType = i;
//		$(".nav>span.cur").removeClass("cur");
//		$(this).addClass("cur");
//		//重置列表数据
//		mescroll.resetUpScroll();
//	}
//});


/*联网加载列表数据  page = {num:1, size:10}; num:当前页 从1开始, size:每页数据条数 */
function getListData(page){
	//联网加载数据
	getListDataFromNet(pdType, page.num, page.size, function(curPageData,totalSize){
		//联网成功的回调,隐藏下拉刷新和上拉加载的状态;
		//mescroll会根据传的参数,自动判断列表如果无任何数据,则提示空;列表无下一页数据,则提示无更多数据;
		//console.log("pdType="+pdType+", page.num="+page.num+", page.size="+page.size+", curPageData.length="+curPageData.length);
		
		//方法一(推荐): 后台接口有返回列表的总页数 totalPage
		//mescroll.endByPage(curPageData.length, totalPage); //必传参数(当前页的数据个数, 总页数)
		
		//方法二(推荐): 后台接口有返回列表的总数据量 totalSize
		//mescroll.endBySize(curPageData.length, totalSize); //必传参数(当前页的数据个数, 总数据量)
		
		//方法三(推荐): 您有其他方式知道是否有下一页 hasNext
		var hasNext = totalSize==1?true:false;
		
		mescroll.endSuccess(curPageData.length, hasNext); //必传参数(当前页的数据个数, 是否有下一页true/false)			
		
		
		
		//方法四 (不推荐),会存在一个小问题:比如列表共有20条数据,每页加载10条,共2页.如果只根据当前页的数据个数判断,则需翻到第三页才会知道无更多数据,如果传了hasNext,则翻到第二页即可显示无更多数据.
		//mescroll.endSuccess(curPageData.length);
		
		//设置列表数据
		setListData(curPageData);
	}, function(){
		//联网失败的回调,隐藏下拉刷新和上拉加载的状态;
        mescroll.endErr();
	});
}
