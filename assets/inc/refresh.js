//导航菜单
var mescrollArr = ""; //每个菜单对应一个mescroll对象
//当前菜单下标
var curNavIndex = 0;
var totalSize = "";
var swiper = null;
var n = "",
    s = "";
var _pageX = 0;
var _lasttransform = '';

function mescrollRefreshFn(option) {

    n = option && option.menuNumber ? option.menuNumber : 1;
    s = option && option.pagesize ? option.pagesize : 10;
    mescrollArr = new Array(n);
    //初始化首页
    mescrollArr[curNavIndex] = initMescroll(curNavIndex, s);
    wscroll.reg('mescroll' + curNavIndex);
    if (mescrollArr.length > 1) {
        /*初始化轮播*/
        swiper = new Swiper('#swiper', {
            observer: true,
            //effect: 'fade',
            onTransitionEnd: function(swiper) {
                var i = swiper.activeIndex; //轮播切换完毕的事件
                changePage(i);

            },
            onTouchStart: function(swiper, even) {
                if ((swiper.activeIndex == 0 || swiper.activeIndex == $('#swiperWrapper>.swiper-slide').length - 1) && even) {
                    if (even.changedTouches && even.changedTouches.length > 0) {
                        _pageX = even.changedTouches[0].pageX;
                        if (swiper.activeIndex == $('#swiperWrapper>.swiper-slide').length - 1) {
                            _lasttransform = Comm.g('swiperWrapper').style.transform;
                        }
                    }
                }
            },
            onTouchMove: function(swiper, even) {
                if (swiper.activeIndex == 0 && even) { //第一个
                    //console.log(_pageX < even.changedTouches[0].pageX);
                    if (even.changedTouches && even.changedTouches.length > 0) {
                        if (_pageX < even.changedTouches[0].pageX) {
                            $('#swiperWrapper').addClass('notransform');
                        } else {
                            $('#swiperWrapper').removeClass('notransform');
                        }
                    }
                }

                if (swiper.activeIndex == $('#swiperWrapper>.swiper-slide').length - 1 && even) { //最后一个
                    if (even.changedTouches && even.changedTouches.length > 0) {
                        //console.log(_pageX);
                        //console.log(even.changedTouches[0].pageX);
                        if (_pageX > even.changedTouches[0].pageX) {
                            Comm.g('swiperWrapper').style.transform = _lasttransform;
                        } else {}
                    }
                }
            },
            onTouchEnd: function(swiper, even) {
                _lasttransform = "";
                _pageX = 0;
                $('#swiperWrapper').removeClass('notransform');
            }
        });
        /*菜单点击事件*/
        $("#nav div").click(function() {
            var i = Number($(this).attr("i"));
            //_type_ = Number($(this).attr("data-type"));
            swiper.slideTo(i); //以轮播的方式切换列表
            wscroll.reg('mescroll' + i);
            Comm.scorllDel();
        });
    }
}

/*切换列表*/
function changePage(i) {
    if (curNavIndex != i) {
        console.log(window.location.pathname)
            //更改列表条件
        var curNavDom; //当前菜单项
        wscroll.reg('mescroll' + i);
        console.log($('#mescroll' + i).scrollTop())
        if (window.location.pathname == '/app-gr/index.html' || window.location.pathname == '/android_asset/index.html') {
            if ($('#mescroll' + i).scrollTop() == 0) {
                $('.navBar').show();
                $('.navBar').css('opacity', 1);
                $('.sea').hide();
                $('.seae').hide();
                $('.scrollx').css('padding-top', '0px')
                $('.order-t-c').css('width', '25%');
                $('.mmList').css('width', '25%');
                Comm.resizeSection();
            } else {
                $('.navBar').hide();
                $('.sea').show();
                $('.seae').show();
                $('.mmList').css('width', '0');
                if (Comm.ios()) {
                    $('.scrollx').css('padding-top', '44px')
                } else {
                    $('.scrollx').css('padding-top', '0px')
                }
                $('.order-t-c').css('width', '34%');
                $('.sea').css('width', '30%');
                Comm.resizeSection();
            }
        }


        $("#nav div").each(function(n, dom) {
            if (dom.getAttribute("i") == i) {
                dom.classList.add("order-t-c-active");
                curNavDom = dom;
                //_type_ = dom.getAttribute("data-type");
            } else {
                dom.classList.remove("order-t-c-active");
            }
        });
        //菜单项居中动画
        var scrollxContent = document.getElementById("scrollxContent");
        var star = scrollxContent.scrollLeft; //当前位置
        var end = curNavDom.offsetLeft + curNavDom.clientWidth / 2 - document.body.clientWidth / 2; //居中
        mescrollArr[curNavIndex].getStep(star, end, function(step, timer) {
            //scrollxContent.scrollLeft = step; //从当前位置逐渐移动到中间位置,默认时长300ms
            if($('#nav')){
            	$('#nav').scrollLeft(step);
            }
        		
        },0);
        //隐藏当前回到顶部按钮
        mescrollArr[curNavIndex].hideTopBtn();
        //取出菜单所对应的mescroll对象,如果未初始化则初始化
        if (mescrollArr[i] == null) {
            mescrollArr[i] = initMescroll(i, s);
        } else {
            //检查是否需要显示回到到顶按钮
            var curMescroll = mescrollArr[i];
            var curScrollTop = curMescroll.getScrollTop();
            if (curScrollTop >= curMescroll.optUp.toTop.offset) {
                curMescroll.showTopBtn();
            } else {
                curMescroll.hideTopBtn();
            }
        }
        //更新标记
        curNavIndex = i;
    }

}


/**/
/*创建MeScroll对象*/
function initMescroll(index, size) {
    //创建MeScroll对象,内部已默认开启下拉刷新,自动执行up.callback,刷新列表数据;
    var mescroll = new MeScroll("mescroll" + index, {
        //上拉加载的配置项
        down: { offset: 80, mustToTop: true },
        up: {
            auto: true,
            callback: getListData, //上拉回调,此处可简写; 相当于 callback: function (page) { getListData(page); }
            isBounce: true, //此处禁止ios回弹,解析(务必认真阅读,特别是最后一点): http://www.mescroll.com/qa.html#q10
            noMoreSize: 1, //如果列表已无数据,可设置列表的总数量要大于半页才显示无更多数据;避免列表数据过少(比如只有一条数据),显示无更多数据会不好看; 默认5
            // onScroll:mescrollOnScroll,//列表滑动监听, 默认null例 onScroll : function(mescroll, y, isUp){ ... };y为列表当前滚动条的位置;isUp=true向上滑,isUp=false向下滑)isUp是1.2.1版本新增的配置,请检查最新版~
            empty: {
                icon: 'img/noData.png', //图标,默认null
                tip: "这里空空如也，去看看别的", //提示
            },
            page: {
                size: size
            },
            //htmlNodata: '<div class="mescroll-empty"><img class="empty-icon" src="img/noData.png"><p class="empty-tip">这里空空如也，去看看别的</p></div>',
            clearEmptyId: "dataList" + index
        }
    });
    return mescroll;
}

function type(o) {
    return Object.prototype.toString.call(o);
}
/*联网加载列表数据  page = {num:1, size:10}; num:当前页 从1开始, size:每页数据条数 */
function getListData(page) {
	console.log(page)
    //联网加载数据
    var dataIndex = curNavIndex; //记录当前联网的nav下标,防止快速切换时,联网回来curNavIndex已经改变的情况;
    getListDataFromNet(dataIndex, page.num, page.size, function(pageData, totalSize) {
        //联网成功的回调,隐藏下拉刷新和上拉加载的状态;
        //mescroll会根据传的参数,自动判断列表如果无任何数据,则提示空;列表无下一页数据,则提示无更多数据;
        //console.log("dataIndex=" + dataIndex + ", curNavIndex=" + curNavIndex + ", page.num=" + page.num + ", page.size=" + page.size + ", pageData.length=" + pageData.length + ", totalSize=" + totalSize);

        //方法一(推荐): 后台接口有返回列表的总页数 totalPage
        //mescrollArr[dataIndex].endByPage(pageData.length, totalPage); //必传参数(当前页的数据个数, 总页数)

        //方法二(推荐): 后台接口有返回列表的总数据量 totalSize
        //		mescrollArr[dataIndex].endBySize(pageData.length, totalSize); //必传参数(当前页的数据个数, 总数据量)

        //方法三(推荐): 您有其他方式知道是否有下一页 hasNext
        wscroll.reg('mescroll' + dataIndex);
        var hasNext = totalSize == 1 ? true : false;
        if (type(pageData) == "[object Object]") {

            mescrollArr[dataIndex].endSuccess([pageData].length, hasNext); //必传参数(当前页的数据个数, 是否有下一页true/false)
        } else {
            mescrollArr[dataIndex].endSuccess(pageData.length, hasNext); //必传参数(当前页的数据个数, 是否有下一页true/false)			
        }

        //方法四 (不推荐),会存在一个小问题:比如列表共有20条数据,每页加载10条,共2页.如果只根据当前页的数据个数判断,则需翻到第三页才会知道无更多数据,如果传了hasNext,则翻到第二页即可显示无更多数据.
        //mescrollArr[dataIndex].endSuccess(pageData.length);

        //设置列表数据
        setListData(pageData, dataIndex);
    }, function() {
        //联网失败的回调,隐藏下拉刷新和上拉加载的状态;
        mescrollArr[dataIndex].endErr();
    });
}