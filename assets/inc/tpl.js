/*
    FOCUS_CONTENT(1, "关注列表"),
    RECOMMEND_BANNER(2, "推荐banner"),
    RECOMMEND_CONTENT(3, "推荐列表"),
    VLOG_BANNER(4, "vlogbanner"),
    FORUM_BANNER(5, "讲堂banner"),
    DS_BANNER(6, "动态banner"),
    FIND_SCHOOL_BANNER(7, "找学校banner"),
    CONTENT_OF_NO_BANNER(8, "内容号详情（学校、专业）banner")
*/

var bannerTpl = {
    touchstart: function(index) {
        //处理 
        if (swiper) {
            swiper.lockSwipes();
        }
    },
    touchend: function(index) {
        if (swiper) {
            swiper.unlockSwipes();
        }
    },
    inithtml: function(d, index) {
        var html = [];
        html.push('<div class="swiperClass swiper-container' + index + '"  ontouchstart="bannerTpl.touchstart(' + index + ')"  ontouchend="bannerTpl.touchend(' + index + ')"><div class="swiper-wrapper">');

        for (var i = 0; i < d.length; i++) {
            console.log(d[i].adType)
            if (d[i].adType == 1 || d[i].adType == 3 || d[i].adType == 4 || d[i].adType == 5) {
                html.push('<div class="swiper-slide">' + bannerTpl.imghtml(d[i]) + "</div>");
            } else if (d[i].adType == 6) {
                html.push('<div class="swiper-slide">' + bannerTpl.HOT_GROUP(d[i], index, i) + "</div>");
            } else if (d[i].adType == 7) {
                html.push('<div class="swiper-slide">' + bannerTpl.NEW_GROUP(d[i], index, i) + "</div>");
            } else if (d[i].adType == 2) {
                html.push('<div class="swiper-slide">' + bannerTpl.imghtml1(d[i]) + "</div>");
            }
        }
        html.push('</div><div class="swiper-pagination"></div></div>');
        return html.join('');
    },
    imghtml: function(d) {
        var json = JSON.stringify(d);
        if (d.url && d.url != '') {
            return '<img class="imgPad" onclick="bannerTpl.go(' + d.adType + ',' + d.itemID + ',' + d.url + ')" src="' + Comm.OSS.getImgUrl(d.face, 'f') + '"  width="100%" height="180"/>';

        } else {
            return '<img class="imgPad" onclick="bannerTpl.go(' + d.adType + ',' + d.itemID + ')" src="' + Comm.OSS.getImgUrl(d.face, 'f') + '"  width="100%" height="180"/>';

        }
    },
    imghtml1: function(d) {
        console.log(d)
        var json = JSON.stringify(d);
        if (d.url && d.url != '') {
            return '<img class="imgPad" onclick="bannerTpl.go(' + d.adType + ',' + d.advertID + ',' + d.url + ')" src="' + Comm.OSS.getImgUrl(d.face, 'f') + '"  width="100%" height="180"/>';

        } else {
            return '<img class="imgPad" onclick="bannerTpl.go(' + d.adType + ',' + d.advertID + ')" src="' + Comm.OSS.getImgUrl(d.face, 'f') + '"  width="100%" height="180"/>';

        }
    },
    video: function(d) {

        var json = JSON.stringify(d);
        if (d.url && d.url != '') {
            return '<img class="imgPad" onclick="bannerTpl.go(' + d.adType + ',' + d.itemID + ',' + d.url + ')" src="' + Comm.OSS.getImgUrl(d.face, 'f') + '"  width="100%" height="180"/>';

        } else {
            return '<img class="imgPad" onclick="bannerTpl.go(' + d.adType + ',' + d.itemID + ')" src="' + Comm.OSS.getImgUrl(d.face, 'f') + '"  width="100%" height="180"/>';

        }
    },
    forum: function(d) {
        var json = JSON.stringify(d);
        if (d.url && d.url != '') {
            return '<img class="imgPad" onclick="bannerTpl.go(' + d.adType + ',' + d.itemID + ',' + d.url + ')" src="' + Comm.OSS.getImgUrl(d.face, 'f') + '"  width="100%" height="180"/>';

        } else {
            return '<img class="imgPad" onclick="bannerTpl.go(' + d.adType + ',' + d.itemID + ')" src="' + Comm.OSS.getImgUrl(d.face, 'f') + '"  width="100%" height="180"/>';

        }
    },
    question: function(d) {
        var json = JSON.stringify(d);
        if (d.url && d.url != '') {
            return '<img class="imgPad" onclick="bannerTpl.go(' + d.adType + ',' + d.itemID + ',' + d.url + ')" src="' + Comm.OSS.getImgUrl(d.face, 9) + '"  width="100%" height="180"/>';
        } else {
            return '<img class="imgPad" onclick="bannerTpl.go(' + d.adType + ',' + d.itemID + ')" src="' + Comm.OSS.getImgUrl(d.face, 9) + '"  width="100%" height="180"/>';

        }
    },
    HOT_GROUP: function(d, index, i) {

        index = (index - 1) + "-" + i;
        var html = [];
        html.push('<div class="xztj" style="height: 165px;">')
        html.push('<div class="heads paddl10 paddr10">')
        html.push('<div class="name-left fl colorfff">热门圈子</div>')
        html.push('<div class="name-right fr f12 paddl10 paddr10 bg_white lh20" style="color: #098E75;border-radius: 5px;margin-top:7.5px;" onclick="bannerTpl.getGroupsHotList(\'' + index + '\',2,this)" >换一批 </div>')
        html.push('<div class="clearfix"></div>')
        html.push('</div>')
        html.push('<div id="rmxz' + index + '">');
        //加载数据

        html.push('</div>')
        html.push('</div>')
        return html.join('');
    },
    NEW_GROUP: function(d, index, i) {
        index = (index - 1) + "-" + i;

        var html = [];
        html.push('<div class="xztj" style="height: 165px;">')
        html.push('<div class="heads paddl10 paddr10">')
        html.push('<div class="name-left fl colorfff">新组速报</div>')
        html.push('<div class="name-right fr f12 paddl10 paddr10 bg_white lh20" style="color: #098E75;border-radius: 5px;margin-top:7.5px;" onclick="bannerTpl.getGroupsNewList(\'' + index + '\',1,this)" >换一批 </div>')
        html.push('<div class="clearfix"></div>')
        html.push('</div>')
        html.push('<div id="xzsb' + index + '">');
        //加载数据

        html.push('</div>');
        html.push('</div>');
        return html.join('');
    },
    swiper: function(type, index) { //推荐banner初始化
        bannerTpl['swiper' + index] = new Swiper('.swiper-container' + index, {
            pagination: '.swiper-pagination',
            loop: true,
            autoplay: 3000000,
            slidesPerView: 'auto',
            /*
            effect: 'coverflow',
            grabCursor: true,
            centeredSlides: true,
            initialSlide: type,
            centeredSlides: false,
            coverflowEffect: {
                rotate: 30,
                stretch: 10,
                depth: 60,
                modifier: 6,
                slideShadows: true
            },*/
            //centeredSlides: true,
        });
    },
    pageNo: 1,
    pageNo1: 1,
    getGroupsNewList: function(id, type, a) {
        var curpage = bannerTpl.pageNo;
        if (!type) { //重新加载banner（换一批）
            curpage = 1;
            bannerTpl.pageNo = 1;
        }
        AJAX.POST("/api/school/groups/newList", {
            curpage: curpage,
            pagesize: 3
        }, function(d) {
            if (d.code === 1 && d.data.length) {
                bannerTpl.pageNo++;
                var index = id.split('-')[0] * 1;
                //bannerTpl['swiper' + (index + 1)].destroy(false);
                var html = [];
                for (var i = 0; i < d.data.length; i++) {
                    var item = d.data[i];
                    html.push('<div class="schools" onclick="Comm.go(\'postDetails.html?groupId=' + item.groupId + '\')">');
                    html.push('<div class="paddt5 paddr10 flex_wrap">');
                    html.push('<div class="paddb10 paddr10 paddl10" style="">');
                    html.push('<img src="' + Comm.OSS.getImgUrl(item.face, 's') + '" onerror="app.herrorimg(this);this.onerror=null" width="30" height="30" />');
                    html.push('</div>');
                    html.push('<div class="lh30 flex_wrap" style="width: calc(100% - 50px);border-bottom: 1px solid #EEEEEE;justify-content:space-between;">');
                    html.push('<div class="f14 wordW lh30" style="max-width:80%;">');
                    html.push(item.groupName);
                    html.push('</div>');
                    html.push('<div class="f12 c60 lh30">' + item.customerNum + "成员");
                    html.push('</div>');
                    html.push('</div>');
                    html.push('<div class="clearfix"></div>');
                    html.push('</div>');
                    html.push('</div>');
                }
                $('.xztj').each(function(i, e) {
                    $(e).find("#xzsb" + id).html(html.join(''));
                })
            }
        });
    },
    getGroupsHotList: function(id, type, a) {
        var curpage = bannerTpl.pageNo1;
        if (!type) { //重新加载banner（换一批）
            curpage = 1;
            bannerTpl.pageNo1 = 1;
        }
        AJAX.POST("/api/school/groups/hotList", {
            curpage: curpage,
            pagesize: 3
        }, function(d) {
            if (d.code === 1 && d.data.length) {
                bannerTpl.pageNo1++;
                var index = id.split('-')[0] * 1;

                var html = [];
                for (var i = 0; i < d.data.length; i++) {
                    var item = d.data[i];
                    html.push('<div class="schools" onclick="Comm.go(\'postDetails.html?groupId=' + item.groupId + '\')">');
                    html.push('<div class="paddt5 paddr10 flex_wrap">');
                    html.push('<div class="paddb10 paddr10 paddl10" style="">');
                    html.push('<img src="' + Comm.OSS.getImgUrl(item.face, 's') + '" onerror="app.herrorimg(this);this.onerror=null" width="30" height="30" />');
                    html.push('</div>');
                    html.push('<div class="lh30 flex_wrap" style="width: calc(100% - 50px);border-bottom: 1px solid #EEEEEE;justify-content:space-between;">');
                    html.push('<div class="f14 wordW lh30" style="max-width:80%;">');
                    html.push(item.groupName);
                    html.push('</div>');
                    html.push('<div class="f12 c60 lh30">' + item.sumNum + "成员");
                    html.push('</div>');
                    html.push('</div>');
                    html.push('<div class="clearfix"></div>');
                    html.push('</div>');
                    html.push('</div>');
                }
                $('.xztj').each(function(i, e) {
                    $(e).find("#rmxz" + id).html(html.join(''));
                })
            }
        });
    },
    go: function(type, id, url) {
        //var d = JSON.parse($(a).attr('data'));
        if (type == 1) {
            if (url) {
                Page.send('go', url);
            }

        } else if (type == 2) {
            Page.send('go', 'adv.html?id=' + id);
        }
        //		else if(type == 3) {
        //			 top.Comm.go('videoDetails.html?newsId='+ id);
        //		} else if(type == 4) {
        //			 top.Comm.go('classDetail.html?forumId='+id);
        //		} 
        else if (type == 5) {
            Comm.go('qzAskDetail.html?newsId=' + id);
        } else if (type == 6) {

        } else if (type == 7) {

        }
        /*
            PIC_LINK(1, "图片外链"),
            PIC_CONTENT(2, "图文"),
            VIDEO(3, "平台视频"),
            FORUM(4, "课程"),
            QUESTION(5, "问问"),
            HOT_GROUP(6, "热门圈子"),
            NEW_GROUP(7, "新组速报");
        */

    },
    adv: function(cb, postion, pagesize) {
        postion = postion ? postion : '';
        pagesize = pagesize ? pagesize : 5;
        //获取广告
        AJAX.GET('/api/advert/apiList?postion=' + postion + '&pageno=1&pagesize=' + pagesize, function(d) {
            if (d.code == 1) {
                if (d.data && d.data.length > 0) {
                    cb && cb(d.data);
                } else {
                    cb && cb(null);
                }
            } else {
                cb && cb(null);
            }
        })
    }
}
var imgTpl = {
    w: 106,
    h: 106,
    init: function(imgs, h, w) {
        var timgs = [];
        imgTpl.h = h ? h : 106;

        if (imgs && imgs.length > 0) {
            for (var i = 0; i < imgs.length; i++) {
                if (imgs[i]) {
                    timgs.push(imgs[i]);
                }
            }
            imgTpl.imgs = timgs;
            if (timgs.length == 1) {
                return imgTpl.onehtml();
            } else if (timgs.length == 4) {
                compr()
                return imgTpl.fourhtml();
            } else {
                compr()
                return imgTpl.allhtml();
            }

            function compr() {

                if (h == 76) {
                    imgTpl.w = w ? w : 100;
                }
                if (h == 96) {
                    imgTpl.w = w ? w : 96;
                }
                if (h == 106) {
                    imgTpl.w = w ? w : 106;
                }
                if (h == 1024) {
                    imgTpl.w = 100;
                    imgTpl.h = 80;
                }
            }
        }
        return '';
    },
    errorimg: "this.src='img/err.png';this.onerror=null;",
    onehtml: function() {
        var mahtml = [];

        mahtml.push('<div class="imgcontainer wimgbox">');
        if (imgTpl.h == 56) {
            imgTpl.w = '100%';
            //         if (imgTpl.imgs[0].indexOf('gif') > 0) {
            //          	mahtml.push('<div style="position: relative;">')
            //              mahtml.push('<img src="img/index/gi.png" style="position: absolute;bottom: 5px;right: 10px;width: 15px;"  />')
            //          }
            mahtml.push('<div class="getpic" style="width:' + imgTpl.w + ';height:' + imgTpl.h + 'px">')
            if (imgTpl.imgs[0].indexOf('gif') > 0 || imgTpl.imgs[0].indexOf('GIF') > 0) {
                mahtml.push('<img class="wimg 1" onload="app.calcImgTag(this)" onclick="Photo.show(this,false);" rsrc="' + Comm.OSS.getImgUrl(imgTpl.imgs[0]) + '" src="' + Comm.OSS.getImgUrl(imgTpl.imgs[0], 'f') + '" width="' + imgTpl.w + '" height="' + imgTpl.h + 'px" style="border-radius: 5px;" onerror="' + imgTpl.errorimg + '"/>');
            } else {
                mahtml.push('<img class="wimg 2" onload="app.calcImgTag(this)" onclick="Photo.show(this,false);" rsrc="' + Comm.OSS.getImgUrl(imgTpl.imgs[0]) + '" src="' + Comm.OSS.getImgUrl(imgTpl.imgs[0], 'f') + '" width="' + imgTpl.w + '" height="' + imgTpl.h + 'px" style="border-radius: 5px;" onerror="' + imgTpl.errorimg + '"/>');
            }
            mahtml.push('</div>')
            mahtml.push('</div>')
                //          if (imgTpl.imgs[0].indexOf('gif') > 0) {
                //              mahtml.push('</div>')
                //          }
        } else {
            if (imgTpl.h == 1024) {
                imgTpl.w = 100 + "px";
                imgTpl.h = 80;
            } else {
                imgTpl.w = '70%';
                imgTpl.h = '212';
            }
            //          if (imgTpl.imgs[0].indexOf('gif') > 0) {
            //          	mahtml.push('<div style="position: relative;">')
            //          mahtml.push('<img src="img/index/gi.png" style="position: absolute;bottom: 10px;right: 35%;width: 15px;" />')
            //          }
            mahtml.push('<div class="getpic onePic" style="width:' + imgTpl.w + ';height:' + imgTpl.h + 'px">')
            if (imgTpl.imgs[0].indexOf('gif') > 0 || imgTpl.imgs[0].indexOf('GIF') > 0) {
                mahtml.push('<img class="wimg 1" onload="app.calcImgTag(this)" onclick="Photo.show(this,false);" rsrc="' + Comm.OSS.getImgUrl(imgTpl.imgs[0]) + '" src="' + Comm.OSS.getImgUrl(imgTpl.imgs[0], 'f') + '" width="' + imgTpl.w + '" height="' + imgTpl.h + 'px" style="border-radius: 5px;" onerror="' + imgTpl.errorimg + '"/>');
            } else {
                mahtml.push('<img class="wimg 2" onload="app.calcImgTag(this)" onclick="Photo.show(this,false);" rsrc="' + Comm.OSS.getImgUrl(imgTpl.imgs[0]) + '" src="' + Comm.OSS.getImgUrl(imgTpl.imgs[0], 'f') + '" width="' + imgTpl.w + '" height="' + imgTpl.h + 'px" style="border-radius: 5px;" onerror="' + imgTpl.errorimg + '"/>');
            }
            mahtml.push('</div>')
            mahtml.push('</div>')
                //          if (imgTpl.imgs[0].indexOf('gif') > 0) {
                //              mahtml.push('</div>')
                //          }
        }
        //      else if (imgTpl.h == 76) {
        //          imgTpl.w = '100px';
        //      }

        return mahtml.join('')
    },
    fourhtml: function() {
        var mahtml = [];
        mahtml.push('<div class="imgcontainer wimgbox">')
        mahtml.push('<div class="flex_warp clearfix">')
        for (var i = 0; i < imgTpl.imgs.length; i++) {
            if (i >= 4) {
                continue;
            }
            //          if (imgTpl.imgs[i].indexOf('gif') > 0) {
            //          	mahtml.push('<div class="fl"style="position: relative;">')
            //          mahtml.push('<img src="img/index/gi.png" style="position: absolute;bottom: 5px;right: 10px;width: 15px;" />')
            //          }

            mahtml.push('<div class="fl getpic paddt5 paddr5" style="width:' + imgTpl.w + '">')
            if (imgTpl.imgs[i].indexOf('gif') > 0 || imgTpl.imgs[0].indexOf('GIF') > 0) {
                mahtml.push('<img class="wimg" onload="app.calcImgTag(this)" onclick="Photo.show(this,false);"  rsrc="' + Comm.OSS.getImgUrl(imgTpl.imgs[i]) + '" src="' + Comm.OSS.getImgUrl(imgTpl.imgs[i], 'f') + '" style="border-radius: 5px;width:' + imgTpl.w + 'px;height:' + imgTpl.h + 'px;" onerror="' + imgTpl.errorimg + '"/>');
            } else {
                mahtml.push('<img class="wimg" onload="app.calcImgTag(this)" onclick="Photo.show(this,false);"  rsrc="' + Comm.OSS.getImgUrl(imgTpl.imgs[i]) + '" src="' + Comm.OSS.getImgUrl(imgTpl.imgs[i], 'f') + '" style="border-radius: 5px;width:' + imgTpl.w + 'px;height:' + imgTpl.h + 'px;" onerror="' + imgTpl.errorimg + '"/>');
            }
            mahtml.push('</div>')
                //          if (imgTpl.imgs[i].indexOf('gif') > 0) {
                //              mahtml.push('</div>')
                //          }
            if (i == 1) {
                mahtml.push('</div><div class="flex_warp">')
            }

        }
        mahtml.push('</div>')
        mahtml.push('<div class="clearfix"></div>');
        mahtml.push('</div>')
        return mahtml.join('')
    },
    allhtml: function() {
        var mahtml = [];
        mahtml.push('<div class="imgcontainer wimgbox">')
        mahtml.push('<div class="flex_warp">')

        if (imgTpl.imgs.length >= 3 && $('section').width() <= 360) {
            for (var i = 0; i < imgTpl.imgs.length; i++) {
                if (i >= 9) {
                    continue;
                }
                //               if (imgTpl.imgs[i].indexOf('gif') > 0) {
                //          	mahtml.push('<div class="fl"style="position: relative;">')
                //          mahtml.push('<img src="img/index/gi.png" style="position: absolute;bottom: 5px;right: 5px;width: 15px;" />')
                //          }
                mahtml.push('<div class="fl getpic paddt5 paddr5" style="width:' + imgTpl.w + '">');
                if (imgTpl.imgs[i].indexOf('gif') > 0 || imgTpl.imgs[i].indexOf('GIF') > 0) {
                    mahtml.push('<img class="wimg" onload="app.calcImgTag(this)" onclick="Photo.show(this,false);"  rsrc="' + Comm.OSS.getImgUrl(imgTpl.imgs[i]) + '" src="' + Comm.OSS.getImgUrl(imgTpl.imgs[i], 'f') + '" style="border-radius: 5px;width: 85px;height:' + imgTpl.h + 'px;" onerror="' + imgTpl.errorimg + '"/>');
                } else {
                    mahtml.push('<img class="wimg" onload="app.calcImgTag(this)" onclick="Photo.show(this,false);"  rsrc="' + Comm.OSS.getImgUrl(imgTpl.imgs[i]) + '" src="' + Comm.OSS.getImgUrl(imgTpl.imgs[i], 'f') + '" style="border-radius: 5px;width: 85px;height:' + imgTpl.h + 'px;" onerror="' + imgTpl.errorimg + '"/>');
                }
                mahtml.push('</div>')
                    //         if (imgTpl.imgs[i].indexOf('gif') > 0) {
                    //              mahtml.push('</div>')
                    //          }
            }
        } else {
            for (var i = 0; i < imgTpl.imgs.length; i++) {
                if (i >= 9) {
                    continue;
                }
                //              if (imgTpl.imgs[i].indexOf('gif') > 0) {
                //          	mahtml.push('<div class="fl"style="position: relative;">')
                //          mahtml.push('<img src="img/index/gi.png" style="position: absolute;bottom: 5px;right: 10px;width: 15px;" />')
                //          }
                mahtml.push('<div class="fl getpic paddt5 paddr5" style="width:' + imgTpl.w + '">')
                if (imgTpl.imgs[i].indexOf('gif') > 0 || imgTpl.imgs[i].indexOf('GIF') > 0) {
                    mahtml.push('<img class="wimg" onload="app.calcImgTag(this)" onclick="Photo.show(this,false);"  rsrc="' + Comm.OSS.getImgUrl(imgTpl.imgs[i]) + '" src="' + Comm.OSS.getImgUrl(imgTpl.imgs[i]) + '" style="border-radius: 5px;width:' + imgTpl.w + 'px;height:' + imgTpl.h + 'px;" onerror="' + imgTpl.errorimg + '"/>');
                } else {
                    mahtml.push('<img class="wimg" onload="app.calcImgTag(this)" onclick="Photo.show(this,false);"  rsrc="' + Comm.OSS.getImgUrl(imgTpl.imgs[i]) + '" src="' + Comm.OSS.getImgUrl(imgTpl.imgs[i]) + '" style="border-radius: 5px;width:' + imgTpl.w + 'px;height:' + imgTpl.h + 'px;" onerror="' + imgTpl.errorimg + '"/>');
                }
                mahtml.push('</div>')
                    //         	if (imgTpl.imgs[i].indexOf('gif') > 0) {
                    //              mahtml.push('</div>')
                    //          }
            }
        }
        mahtml.push('</div>')
        mahtml.push('<div class="clearfix"></div>');
        mahtml.push('</div>')
        return mahtml.join('')
    }
}

/***转发公用代码**/
var zhuanfa = {
    isfirst: 1,
    ids: [],
    history: [],
    suiji: function(name, type) {
        GDict.init(function() {
            var d = GDict.get(type);
            var index = Math.floor((Math.random() * d.length));
            document.getElementById(name).setAttribute('placeholder', d[index].dictname);
        });
    },
    keydown: function(a) {
        zhuanfa.history = [];
        var d = $(a).clone();
        zhuanfa.history = d;
    },
    copy: false,
    oninput: function(a, maxlen) {
        //a 输入框容器
        //maxlen 数字限制，没有数字限制不传入货传0
        //监听输入内容 截取处理
        var idds = [];
        var ist = true;
        $(a).find('span.blue').each(function(i, e) {
            var len = $(e).attr('len') * 1;
            var curlen = $(e).text().length;
            idds.push({
                len: len,
                idd: $(e).attr('idd')
            })
            if (len > curlen) {
                var font = document.createElement('font')
                $(e).after(font);
                $(e).remove();
                zhuanfa.focus(font);
                return
            } else if (len < curlen) {
                var olds = $(e).attr('old');
                var sl = $(e).html().split(olds);
                var font = document.createElement('font')
                font.innerHTML = sl[1];
                $(e).html("@" + $(e).attr('old')).after(font);
                zhuanfa.focus(font);
                ist = false;
                return
            }
        });
        var lens = $(a).text().length;
        var html = $(a).html(),
            go_ = false;

        if (html.indexOf("@") >= 0) {
            var htmls = html.split('@');
            var olds = zhuanfa.history.html().split('@');
            if (htmls.length > olds.length) {
                var ism = true;
                var temp = [],
                    tempi = 0;
                for (var i = 0; i < htmls.length; i++) {
                    temp.push(htmls[i]);
                    if (htmls[i] != olds[i] && ism && i < htmls.length - 1) {
                        ism = false;
                        temp.push("@");
                    } else if (i + 1 == htmls.length && ism) {
                        ism = false;
                        temp.push("@");
                    } else if (ism && htmls.length != 2) {
                        tempi++;
                    }
                }
                var zhuanfai = temp.join('').indexOf('@') + tempi;
                Comm.db('zhuanfai', zhuanfai);
                go_ = true;
            }
        }
        //判断@
        if (go_ && !zhuanfa.copy) {
            if (!Comm.w9()) {
                Comm.db('inner_', $(a).html());
            }
            document.activeElement.blur();
            Comm.db('zhuanfa', '1');
            Comm.go('atfrend.html')
            return
        }
        if (maxlen && lens > maxlen) {
            if (zhuanfa.isfirst == 1) {
                Comm.message('已输入最大值');
                zhuanfa.isfirst = 2;
            }
        }
    },
    getlen: function(a) {
        //获取容器当前字数长度
        var l = $(a).text();
        return l ? l.length : 0;
    },
    focus: function(a) {
        // 始终聚焦在文本末尾
        el = a;
        el.focus();
        if ($.support.msie) {
            var range = document.selection.createRange();
            this.last = range;
            range.moveToElementText(el);
            range.select();
            document.selection.empty(); //取消选中
        } else {
            var range = document.createRange();
            range.selectNodeContents(el);
            range.collapse(false);
            var sel = window.getSelection();
            sel.removeAllRanges();
            //console.log(range)
            sel.addRange(range);
        }
    },
    removefont: function(a) {
        if (a.childNodes && a.childNodes.length > 0) {
            var e = a.childNodes[0];
            if (e && e.className == "removefont") {
                $(e).remove();
            }
        }
    },
    pageresume: function(a, maxlen) {
        var cc = Comm.db('atfriend');
        //Comm.message(JSON.stringify(cc));
        var aa = Comm.db('inner_') ? Comm.db('inner_') : '';
        var font = null;
        if (!Comm.w9()) {
            $(a).html(aa);
        }
        var htm = ""
        zhuanfa.ids = [];
        if (cc && cc.length > 0) {
            for (var i = 0; i < cc.length; i++) {
                zhuanfa.ids.push(cc[i].id);
                if (i == 0) {
                    htm += '<font class="removefont">&nbsp;</font><span len="' + (cc[i].name.length + 1) + '" old="' + cc[i].name + '" idd="' + cc[i].id + '" class="blue" contenteditable="false" onclick="model.geren(' + cc[i].id + ',0)">@' + cc[i].name + '</span>&nbsp;';
                } else {
                    htm += '<span len="' + (cc[i].name.length + 1) + '" old="' + cc[i].name + '" idd="' + cc[i].id + '" class="blue" contenteditable="false" onclick="model.geren(' + cc[i].id + ',0)">@' + cc[i].name + '</span>&nbsp;';
                }
            }
        }

        if (htm) {
            var rhtml = [];
            var zhuanfai = Comm.db('zhuanfai') * 1;
            $(a).find("#curfont").remove();
            if (zhuanfai >= 0 && htm) {
                var zf = $(a).html().substr(0, zhuanfai);
                var zf2 = $(a).html().substr(zhuanfai + 1, $(a).html().length - 1);
                console.log(zf);
                console.log(zf2);
                console.log(zhuanfai);
                $(a).html(zf + htm + '<font id="curfont"></font>' + zf2);
            }
        }

        if (maxlen && $(a).text().length > maxlen) {
            Comm.message('已输入最大值');
        }
        font = Comm.g('curfont');

        if (Comm.w9()) {
            Comm.db('@temp', '');
            Comm.db('atfriend', '');
            Comm.db('inner_', '');
            Comm.db('zhuanfai', '');
        }
        if (Comm.ios()) {
            setTimeout(function() {
                $(a).focus();
                if (font) {
                    zhuanfa.focus(font);
                } else {
                    zhuanfa.focus(a);
                }
                Comm.PopUpKeyboard({
                    code: 1
                });
            }, 600);
        } else {
            if (font) {
                zhuanfa.focus(font);
            } else {
                zhuanfa.focus(a);
            }
            Comm.PopUpKeyboard({
                code: 1
            });
        }


    }

}

//newsType
/* 
 FORWARD(0, "转发"),
 SAYSAY(1, "说说"),
 ARTICLE(2, "文章"),
 VLOG(3, "VLOG"),
 WITH_VIDEO(4, "随拍"),
 QUESTION(5, "问问"),
 INFORMATION(6, "资讯"),
 INVITATION(7, "帖子"),
 TOPIC(8, "话题"),
 ADMISSION(9, "招生就业"),
 VIDEO(10, "平台视频");
*/

var _Tpl = {
    logo: 'img/my/mti.png',
    sldate: function(timespan) {
        if (timespan) {
            timespan = timespan.replace(/-/g, "/").replace(/\.0/g, "")
            var dateTime = new Date(timespan);

            var year = dateTime.getFullYear();
            var month = dateTime.getMonth() + 1;
            var day = dateTime.getDate();
            var hour = dateTime.getHours();
            var minute = dateTime.getMinutes();
            var second = dateTime.getSeconds();
            var now = new Date();
            var now_new = now.getTime(); //typescript转换写法

            var milliseconds = 0;
            var timeSpanStr;

            milliseconds = now_new - dateTime.getTime();

            if (milliseconds <= 1000 * 60 * 1) {
                timeSpanStr = '刚刚';
            } else if (1000 * 60 * 1 < milliseconds && milliseconds <= 1000 * 60 * 60) {
                timeSpanStr = Math.round((milliseconds / (1000 * 60))) + '分钟前';
            } else if (1000 * 60 * 60 * 1 < milliseconds && milliseconds <= 1000 * 60 * 60 * 24) {
                timeSpanStr = Math.round(milliseconds / (1000 * 60 * 60)) + '小时前';
            } else if (1000 * 60 * 60 * 24 < milliseconds && milliseconds <= 1000 * 60 * 60 * 24 * 7) {
                //timeSpanStr = Math.round(milliseconds / (1000 * 60 * 60 * 24)) + '天前';
                timeSpanStr = month + '-' + day;
            } else if (milliseconds > 1000 * 60 * 60 * 24 * 1 && year == now.getFullYear()) {
                timeSpanStr = month + '-' + day;
                //timeSpanStr = month + '-' + day + ' ' + hour + ':' + minute;
            } else {
                timeSpanStr = year + '-' + month + '-' + day;
                //timeSpanStr = year + '-' + month + '-' + day + ' ' + hour + ':' + minute;
            }
            return timeSpanStr;
        }
        return ''
    },
    _MAIN: function(d) {
        return '<div class="schoolMsg" id="' + d.newsId + '" onclick="Page.send(\'go\',\'articleDetail.html?newsId=' + d.newsId + '\');">\
                    ' + _Tpl._HEAD(d) + '\
                    ' + _Tpl._CONTENT(d) + '\
                    ' + _Tpl.foot(d) + '\
                </div> ';
    },
    _HEAD: function(d) { //头部
        var t = "";
        var typ = "";
        if (d.addTime) {
            t = '<p class="f12 c9e fr marr10" style="margin-top: 6px;">' + _Tpl.sldate(d.addTime) + '</p>';
        }
        if (d.userType == 5) {
            typ = '<p class="f12 c9e wordW" style="margin-top:2px;">' + d.officialCertification + '</p>'
        } else if(d.userType == 0&&d.customerId==1||d.userType == 0&&d.customerId==2){
       	 	typ = '<p class="f12 c9e wordW" style="margin-top:2px;">果仁官方</p>'
        }else {
            if (d.schoolName) {
                typ = '<p class="f12 c9e wordW" style="margin-top:2px;">' + d.schoolName + d.enrollmentYear + '级</p>'
            }

        }
        if (d.userType != 0) {
            return '<div class="heads flex_wrap" style="justify-content:space-between;">\
                    <div class="name-left">\
                        <img onclick="model.geren(' + d.uid + ',0)" class="fl" style="border-radius: 50%;" src="' + Comm.OSS.getImgUrl(d.uface, 's') + '" onerror="this.src=\'' + _Tpl.logo + '\';this.onerror=null;" width="40" height="40">\
                        <div class="fl marl10 lh20">\
                            <p class="f14">' + d.uname + '</p>\
                            ' + typ + '\
                        </div>\
                    </div>\
                    <div class="name-right center" style="margin-top:17px">\
                        <div style="padding: 4px 0px 2px 6px;" class="fr" onclick="event.stopPropagation();model.qh(' + d.newsId + ',' + d.ttype + ',' + d.itemType + ',' + d.uid + ');">\
                            <img src="img/index/more.png" width="14" height="3">\
                        </div>\
                        ' + t + '\
                    </div>\
                </div>';
        } else {
            return '<div class="heads flex_wrap" style="justify-content:space-between;">\
                    <div class="name-left">\
                        <img onclick="model.geren(' + d.uid + ',0)" class="fl" style="border-radius: 50%;" src="' + Comm.OSS.getImgUrl(d.uface, 's') + '" onerror="this.src=\'' + _Tpl.logo + '\';this.onerror=null;" width="40" height="40">\
                        <div class="fl marl10 lh20">\
                            <p class="f14">' + d.uname + '</p>\
                            ' + typ + '\
                        </div>\
                    </div>\
                    <div class="name-right center" style="margin-top:17px">\
                        ' + t + '\
                    </div>\
                </div>';
        }

    },
    _CONTENT: function(d) { //处理内容
        var rhtml = [];
        if (d.newsType == 0) {
            d.title = "";
        }
        if (d.title) {
            rhtml.push('<div class="f15 wordW2 bold mart10 color141 lh20">');
            if (d.newsRange == 1) {
                rhtml.push('<img width="14" style="margin-bottom: 2px;" class="marr5" src="img/nopel.png" />')
            } else if (d.newsRange == 2) {
                rhtml.push('<img width="22" height="18" class="marr5" src="img/gfrend.png"/>')
            }
            if (d.recommend == 1) {
                rhtml.push("<span class='cunbtn'>推荐</span>")
            }
            rhtml.push("<span class='PingFangHKRegular color141'style='font-family: Arial;'>" + d.title + "</span>");
            rhtml.push("</div>")
        }
        if (d.newsType != 1 && d.newsType != 8) {
            if (d.newsType == 0) { //转发
                d.ri = ""
                if (d.ynewsType == 1) d.ri = '说说';
                else if (d.ynewsType == 2) d.ri = '日志';
                else if (d.ynewsType == 7) d.ri = '帖子';
                else if (d.ynewsType == 8) d.ri = '讨论';
				else if (d.ynewsType == 11) d.ri = '动态';
                rhtml.push('<div class="mart10 PingFangHKLight1 lh20 color505">' + '<b>转发：</b>' + d.content + ' </div>');
                if (d.fCid) {
                    rhtml.push('<span class="PingFangHKLight lh20" style="color: #5E8EDD;" onclick="event.stopPropagation();Page.send(\'go\',\'personal.html?customerId=' + d.fCid + '\');">@' + d.fCname + ':</span>' + d.fContent)
                }
                if (d.ynewsId) { //处理原文章
                    if (!d.yvideoId)
                        rhtml.push('<div class="mart5 scl-zf" onclick="event.stopPropagation();Page.send(\'go\',\'articleDetail.html?newsId=' + d.ynewsId + '\')">')
                    else
                        rhtml.push('<div class="mart5 scl-zf" onclick="event.stopPropagation();Page.send(\'go\',\'videoDetails.html?newsId=' + d.ynewsId + '\')">')

                    if (d.yid) {
                        rhtml.push('<div class="wordW f16 marb10 lh21_5">\
                                <span class="color038" style="display: inline-block;" onclick="event.stopPropagation();model.geren(' + d.yid + ',' + d.yitemtype + ');">' + d.yname + '</span>\
                                <span class="color333">的' + d.ri + '</span>\
                            </div>')
                    }
                    if (d.yTitle || d.yContent) {
                        d.yTitle = d.yTitle ? d.yTitle : ''
                        d.yContent = d.yContent ? d.yContent : ''
                        if (d.yTitle) {
                            rhtml.push('<div class="color31 lh21_5 zhuan wordW3"><b class="marr20 bold" style="line-height:17px;">' + d.yTitle + ' </b> <b class="PingFangHKLight" style="word-break: normal; overflow-wrap: break-word; white-space: pre-wrap;">' + template.defaults.imports.repcontent(d.yContent, d.ynewsId, '#F5F5F4') + '</b></div>');
                        } else {
                            rhtml.push('<div class="color31 lh21_5 zhuan"><b class="PingFangHKLight" style="word-break: normal; overflow-wrap: break-word; white-space: pre-wrap;">' + template.defaults.imports.repcontent(d.yContent, d.ynewsId, '#F5F5F4') + '</b></div>');
                        }

                    }
                    if (d.ypic && d.ypic != '') {
                        if (d.ynewsType != 6 && d.ynewsType != 2) {
                            rhtml.push('<div class="mart10">' + imgTpl.init(d.ypic, 96) + ' </div>')
                        } else {
                            rhtml.push('<div class="mart10">' + imgTpl.init(d.ypic, 76) + ' </div>')
                        }
                    } else {

                    }
                    rhtml.push('</div>');
                } else {
                    rhtml.push('<div class="mart15 scl-zf">\
                                <div>该动态已删除</div>\
                                <div class="clearfix"></div>\
                            </div>');
                }
            } else {
                rhtml.push('<div class="mart5 wordW3 PingFangHKRegular f15 lh20" style="color:#464646;font-family: Arial;word-break: normal; overflow-wrap: break-word; white-space: pre-wrap;">' + d.subhead + '</div>')

                if (d.newsType != 6 && d.newsType != 2) {
                    if (d.ypic) {
                        rhtml.push('<div class="mart10">' + imgTpl.init(d.ypic, 96) + ' </div>')
                    }
                } else {
                    rhtml.push('<div class="mart10">' + imgTpl.init(d.face, 76) + ' </div>')
                }

            }
        } else if (d.newsType == 1 || d.newsType == 8) {
            if (d.newsType != 1 && d.newsType != 8) {
                rhtml.push('<div class="mart5 wordW3 PingFangHKRegular f15 lh20" style="word-break: normal; overflow-wrap: break-word; white-space: pre-wrap;">' + d.subhead + ' </div>');
            }
            rhtml.push('<div style="word-wrap:break-word;color:#464646;line-height:22px" class="mart5 f15 colors PingFangHKLight" onclick="event.stopPropagation();Page.send(\'go\',\'articleDetail.html?newsId=' + d.newsId + '\');">');
            if (d.recommend == 1) {
                rhtml.push("<span class='cunbtn'>推荐</span>")
            }
            rhtml.push(template.defaults.imports.repcontent(d.content, d.newsId, '#fff'));
            if (d.face) {
                rhtml.push('<div class="mart10">' + imgTpl.init(d.face, 96) + ' </div>');
            }
            rhtml.push('</div>');
        }

        rhtml.push('<div class="clearfix"></div>');
        if (d.topicId > 0) {
            rhtml.push('<div class="scl-dw mart10 wordW PingFangHKRegular lh21_5" onclick="event.stopPropagation();Page.send(\'go\',\'talkDetail.html?topicId=' + d.tId + '\');">' + d.tTitle + '</div>');
        }
        return rhtml.join('')
    },
    foot: function(d) { //处理底部
        /*
            newsId: d.newsId,
            praiseNumber: d.praiseNumber,
            isPraise:d.isPraise,
            playNumber:d.playNumber,
            commentNumber: d.commentNumber,
            forwardNumber: d.forwardNumber
        */

        var rhtml = [];
        rhtml.push('<div class="scl-but paddt5 paddb5">');
        //点赞 
        if (d.isPraise == 0) {
            //没有点赞
            rhtml.push('<div class="paddt10 paddb10 paddl30 paddr30" onclick="model.zan(' + d.newsId + ',this);event.stopPropagation()"><img src="img/index/zan.png" width="20" height="20"><span style="margin-left: 5px;" class="c9e f12" id="zan' + d.newsId + '">' + app.conunm(d.praiseNumber) + '</span></div>')
        } else {
            rhtml.push('<div class="paddt10 paddb10 paddl30 paddr30" onclick="model.quxiao(' + d.newsId + ',this);event.stopPropagation()"><img src="img/index/zand.png" width="20" height="20"><span style="margin-left: 5px;" class="c9e f12" id="zan' + d.newsId + '">' + app.conunm(d.praiseNumber) + '</span></div>')
        }
        //评论
        rhtml.push('<div class="paddt10 paddb10 paddl30 paddr30" onclick="Page.send(\'go\',\'articleDetail.html?newsId=' + d.newsId + '&amp;cont=1\');event.stopPropagation()"><img src="img/index/pl.png" width="20" height="20"><span style="margin-left: 5px;" class="c9e f12" id="ping' + d.newsId + '">' + app.conunm(d.commentNumber) + '</span></div>');

        //转发 排除 问问
        if (d.newsType != 5) {
            rhtml.push('<div class="paddt10 paddb10 paddl30 paddr30" onclick="model.zhuanfa(' + d.newsId + ');event.stopPropagation()"><img src="img/index/zf.png" width="24" height="20"><span style="margin-left: 5px;" class="c9e f12" id="shou' + d.newsId + '">' + app.conunm(d.forwardNumber) + '</span></div>')
        } else {
            rhtml.push('<div></div>')
        }

        rhtml.push('</div>');

        return rhtml.join('');
    }
}