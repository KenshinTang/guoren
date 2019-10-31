/*
 *   create by Lee 2018/05/10
 * 
 *   图片放大html布局： 
 * 		<div class="demo-gallery" data-pswp-uid="1">
 * 			<a data-size="1024x1024" data-href="img/local/pic.png" data-med="img/local/pic.png" data-med-size="1024x1024">
 * 				<img class="imgCover" src="img/local/pic.png">
 * 			</a>
 * 		</div>
 * 		or
 * 		<div class="demo-gallery" data-pswp-uid="1">
 * 			<span data-size="1024x1024" data-href="img/local/pic.png" data-med="img/local/pic.png" data-med-size="1024x1024">
 * 				<img class="imgCover" src="img/local/pic.png">
 * 			</span >
 * 		</div>
 * 
 * 	  说明：
 * 		1、class="demo-gallery" ---->  建议使用class,实现多模块图片放大   
 * 		2、data-pswp-uid ---->  值为数字且不可重复、不可省略
 * 		3、data-med ---->  放大后图片的地址，推荐使用原始大图，避免放大后图片模糊
 * 		4、data-href ----> PC端图片放大
 * 		5、data-size和data-med-size ---->  放大后图片尺寸，可根据图片的尺寸做适当的调整
 *		6、使用：initPhotoSwipeFromDOM(".demo-gallery") ---->  点不可少
 */

var photoswipeHtml = document.createElement("DIV");
photoswipeHtml.className = "pswp";
photoswipeHtml.setAttribute("tabindex", "-1");
photoswipeHtml.setAttribute("role", "dialog");
photoswipeHtml.setAttribute("aria-hidden", true);

photoswipeHtml.innerHTML = '<div class="pswp__bg"></div>\
  <div class="pswp__scroll-wrap">\
	<div class="pswp__container">\
		<div class="pswp__item"></div>\
		<div class="pswp__item"></div>\
		<div class="pswp__item"></div>\
	</div>\
	<div class="pswp__ui pswp__ui--hidden">\
		<div class="pswp__top-bar">\
			<div class="pswp__counter"></div>\
			<button class="pswp__button pswp__button--close" title="Close (Esc)"></button>\
			<button class="pswp__button pswp__button--share" title="Share"></button>\
			<button class="pswp__button pswp__button--fs" title="Toggle fullscreen"></button>\
			<button class="pswp__button pswp__button--zoom" title="Zoom in/out"></button>\
			<div class="pswp__preloader">\
				<div class="pswp__preloader__icn">\
					<div class="pswp__preloader__cut">\
						<div class="pswp__preloader__donut"></div>\
					</div>\
				</div>\
			</div>\
		</div>\
		<div class="pswp__share-modal pswp__share-modal--hidden pswp__single-tap">\
			<div class="pswp__share-tooltip"></div>\
		</div>\
		<button class="pswp__button pswp__button--arrow--left" title="Previous (arrow left)"></button>\
		<button class="pswp__button pswp__button--arrow--right" title="Next (arrow right)"></button>\
		<div class="pswp__caption">\
			<div class="pswp__caption__center"></div>\
		</div>\
	</div>\
</div>';


var pswp = document.querySelector(".pswp");
if (!pswp) {
    document.body.appendChild(photoswipeHtml);
}

/* 图片放大 begin */
var initPhotoSwipeFromDOM = function(gallerySelector) {
    event.stopPropagation();
    event.preventDefault();
    var parseThumbnailElements = function(el) {
        var thumbElements = el.childNodes,
            numNodes = thumbElements.length,
            items = [],
            el,
            childElements,
            thumbnailEl,
            size,
            item;

        for (var i = 0; i < numNodes; i++) {
            el = thumbElements[i];

            // include only element nodes
            if (el.nodeType !== 1) {
                continue;
            }

            childElements = el.children;

            size = el.getAttribute('data-size').split('x');

            // create slide object
            item = {
                src: el.getAttribute('data-href'),
                w: parseInt(size[0], 10),
                h: parseInt(size[1], 10)
            };

            item.el = el; // save link to element for getThumbBoundsFn

            if (childElements.length > 0) {
                item.msrc = childElements[0].getAttribute('src'); // thumbnail url
                if (childElements.length > 1) {
                    item.title = childElements[1].innerHTML; // caption (contents of figure)
                }
            }

            var mediumSrc = el.getAttribute('data-med');
            if (mediumSrc) {
                size = el.getAttribute('data-med-size').split('x');
                // "medium-sized" image
                item.m = {
                    src: mediumSrc,
                    w: parseInt(size[0], 10),
                    h: parseInt(size[1], 10)
                };
            }
            // original image
            item.o = {
                src: item.src,
                w: item.w,
                h: item.h
            };

            items.push(item);
        }

        return items;
    };

    // find nearest parent element
    var closest = function closest(el, fn) {
        return el && (fn(el) ? el : closest(el.parentNode, fn));
    };

    var onThumbnailsClick = function(e) {
        e.stopPropagation();

        closej = false;
        Comm.setAndroidHome(0);

        var eTarget = e.target || e.srcElement;

        var clickedListItem = closest(eTarget, function(el) {
            return (el.tagName === 'A' || el.tagName === 'SPAN' || el.tagName === 'LI');
        });

        if (!clickedListItem) {
            return;
        }

        var clickedGallery = clickedListItem.parentNode;

        var childNodes = clickedListItem.parentNode.childNodes,
            numChildNodes = childNodes.length,
            nodeIndex = 0,
            index;

        for (var i = 0; i < numChildNodes; i++) {
            if (childNodes[i].nodeType !== 1) {
                continue;
            }

            if (childNodes[i] === clickedListItem) {
                index = nodeIndex;
                break;
            }
            nodeIndex++;
        }

        if (index >= 0) {
            openPhotoSwipe(index, clickedGallery);
        }
        return false;
    };

    var photoswipeParseHash = function() {
        var hash = window.location.hash.substring(1),
            params = {};

        if (hash.length < 5) { // pid=1
            return params;
        }

        var vars = hash.split('&');
        for (var i = 0; i < vars.length; i++) {
            if (!vars[i]) {
                continue;
            }
            var pair = vars[i].split('=');
            if (pair.length < 2) {
                continue;
            }
            params[pair[0]] = pair[1];
        }

        if (params.gid) {
            params.gid = parseInt(params.gid, 10);
        }

        return params;
    };

    var openPhotoSwipe = function(index, galleryElement, disableAnimation, fromURL) {
        var pswpElement = document.querySelectorAll('.pswp')[0],
            gallery,
            options,
            items;

        items = parseThumbnailElements(galleryElement);

        // define options (if needed)
        options = {
            loop: false,

            galleryUID: galleryElement.getAttribute('data-pswp-uid'),

            getThumbBoundsFn: function(index) {
                // See Options->getThumbBoundsFn section of docs for more info
                var thumbnail = items[index].el.children[0],
                    pageYScroll = window.pageYOffset || document.documentElement.scrollTop,
                    rect = thumbnail.getBoundingClientRect();

                return { x: rect.left, y: rect.top + pageYScroll, w: rect.width };
            },

            addCaptionHTMLFn: function(item, captionEl, isFake) {
                if (!item.title) {
                    captionEl.children[0].innerText = '';
                    return false;
                }
                captionEl.children[0].innerHTML = item.title + '<br/><small>Photo: ' + item.author + '</small>';
                return true;
            }
        };

        // options for control bar
        options.shareEl = false; // 分享按钮
        options.fullscreenEl = false; // 全屏按钮
        options.tapToClose = true; // 点击屏幕关闭
        options.tapToToggleControls = false; // 控制栏切换

        if (fromURL) {
            if (options.galleryPIDs) {
                // parse real index when custom PIDs are used
                // http://photoswipe.com/documentation/faq.html#custom-pid-in-url
                for (var j = 0; j < items.length; j++) {
                    if (items[j].pid == index) {
                        options.index = j;
                        break;
                    }
                }
            } else {
                options.index = parseInt(index, 10) - 1;
            }
        } else {
            options.index = parseInt(index, 10);
        }

        // exit if index not found
        if (isNaN(options.index)) {
            return;
        }



        // Pass data to PhotoSwipe and initialize it
        gallery = new PhotoSwipe(pswpElement, PhotoSwipeUI_Default, items, options);

        // see: http://photoswipe.com/documentation/responsive-images.html
        var realViewportWidth,
            useLargeImages = false,
            firstResize = true,
            imageSrcWillChange;

        gallery.listen('beforeResize', function() {

            var dpiRatio = window.devicePixelRatio ? window.devicePixelRatio : 1;
            dpiRatio = Math.min(dpiRatio, 2.5);
            realViewportWidth = gallery.viewportSize.x * dpiRatio;

            if (realViewportWidth >= 1200 || (!gallery.likelyTouchDevice && realViewportWidth > 800) || screen.width > 1200) {
                if (!useLargeImages) {
                    useLargeImages = true;
                    imageSrcWillChange = true;
                }
            } else {
                if (useLargeImages) {
                    useLargeImages = false;
                    imageSrcWillChange = true;
                }
            }

            if (imageSrcWillChange && !firstResize) {
                gallery.invalidateCurrItems();
            }

            if (firstResize) {
                firstResize = false;
            }

            imageSrcWillChange = false;

        });

        gallery.listen('gettingData', function(index, item) {
            if (useLargeImages) {
                item.src = item.o.src;
                item.w = item.o.w;
                item.h = item.o.h;
            } else {
                item.src = item.m.src;
                item.w = item.m.w;
                item.h = item.m.h;
            }
        });

        gallery.init();
    };

    // select all gallery elements
    var galleryElements = document.querySelectorAll(gallerySelector);
    for (var i = 0, l = galleryElements.length; i < l; i++) {
        galleryElements[i].setAttribute('data-pswp-uid', i + 1);
        galleryElements[i].onclick = onThumbnailsClick;
    }

    // Parse URL and open gallery if it contains #&pid=3&gid=1
    var hashData = photoswipeParseHash();
    if (hashData.pid && hashData.gid) {
        openPhotoSwipe(hashData.pid, galleryElements[hashData.gid - 1], true, true);
    }
};
/* 图片放大 end */

var closej = true;

function androidback() {
    if (closej) {
        if (parseInt(Comm._pageinfo.android_home) === 0) {
            Comm.close();
        } else {
            if (parseInt(Comm._pageinfo.android_home) === 1) {
                Comm._pageinfo.android_home = 2;
                Comm.confirm("您确定要退出应用？", function(a) {
                    if (a == 1) Comm.close();
                    else Comm._pageinfo.android_home = 1;
                });
            }
        }
    } else {
        //判断链接是否存在
        function check(t) {
            return location.href.indexOf(t) >= 0;
        };
        if (check('index.html') || check('sl_askForLeave.html') || check('question.html') || check('my.html')) {
            //处理关闭
            Comm.setAndroidHome(1);
        }
        closej = true;
        $(".pswp__button--close").trigger('click')
    }
}