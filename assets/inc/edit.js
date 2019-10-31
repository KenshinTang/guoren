var first =1;
var wedit = new function() {
	var box, title, content, mark, curImg, positionInfo;

	function estop(e) {
		e.stopPropagation();
		e.preventDefault();
	}

	function ca(tag, att, p) {
		var o = document.createElement(tag);
		if(att)
			for(var i in att) {
				o.setAttribute(i, att[i]);
			}
			(p ? p : box).appendChild(o);
		return o;
	}

	function imgBlur() {
		var imgs = content.querySelectorAll('img.cur');
		if(imgs)
			for(var i = 0; i < imgs.length; i++) {
				imgs[i].className = '';
				if(curImg == imgs[i])
					curImg = null;
			}
			
		showMark();
	}

	function showMark() {
		var css = 'none',
			o;
		if(o = curImg) {
			css = 'block';
			var t = 10 + o.offsetTop,
				l = o.offsetLeft + o.offsetWidth - 40;
			while(o = o.offsetParent) {
				if(o == box || !box.contains(o))
					break;
				t += o.offsetTop;
				l += o.offsetLeft;
			}
			mark.style.top = t + 'px';
			mark.style.left = l + 'px';
		}
		mark.style.display = css;
		
	}

	function clickMark() {
		if(curImg) {
			curImg.remove();
			curImg = null;
			showMark();
			//content.focus();
		}
	}

	function imgFocus(e) {
		estop(e);
		if(Comm.ios()){
			setTimeout(function(){
				var h = Comm.$1("body >header"),
        f = Comm.$1("body >footer"),
        s = Comm.$1("body >section");

    if (s) {
        var wh = window ? (window.innerHeight || 0) : 0;
        var hh = h ? (h.offsetHeight || 0) : 0;
        var fh = f ? (f.offsetHeight || 0) : 0;
        wh = window ? (window.outerHeight || 0) : 0;;

        var sh = wh - hh - fh;

        var log = ('w =' + wh + '>h =' + hh + '>f =' + fh + '>s =' + sh + 'pxpxpx');
        s.style.height = sh + "px";
    }
			},200)
		}else{
			Comm.resizeSection();
		}
		document.activeElement.blur();
		setTimeout(function(){
			document.activeElement.blur();
		},100);
		if(e.target.tagName.toLowerCase() != 'img')
			return;
		
		if(this.className != 'cur') {
			imgBlur();
			this.className = 'cur';
			curImg = this;
			showMark();
		}
	}

	function addImg(srcs) {
		var sel = window.getSelection(),
			range;
		if(sel.getRangeAt && sel.rangeCount) {
			range = sel.getRangeAt(0);
			if(range.endContainer && range.endContainer === title)
				return;
			range.deleteContents();
			positionInfo = {
				sel: sel,
				range: range
			};
			document.activeElement.blur();
		} else {
			positionInfo = null;
		}
		setTimeout(function() {
//				for(var i=0;i<=3;i++)
//					srcs.push(ms[Math.round(Math.random() * 100) % ms.length]);
				//--------测试代码结束
				var divs = document.createElement('br');
				content.appendChild(divs);
				var imgs=[];
				for(var i=0;i<srcs.length;i++){
					var img = document.createElement('img');
					img.src = Comm.OSS.getImgUrl(srcs[i]);
					img.onclick = imgFocus;
					imgs.push(img);
				}
				if (curImg) {
					for(var i=0;i<imgs.length;i++)
					content.insertBefore(imgs[i], curImg);
					imgBlur();
				} else if (positionInfo) {
					var frag = document.createDocumentFragment(),lastNode;
					for(var i=0;i<imgs.length;i++)
						lastNode = frag.appendChild(imgs[i]);
					positionInfo.range.insertNode(frag);
					if (lastNode) {
						positionInfo.range = positionInfo.range.cloneRange();
						positionInfo.range.setStartAfter(lastNode);
						positionInfo.range.collapse(true);
						positionInfo.sel.removeAllRanges();
						positionInfo.sel.addRange(positionInfo.range);
					}
				} else{
					for(var i=0;i<imgs.length;i++){
						content.appendChild(imgs[i]);
						content.appendChild(divs);
					}
					
				}
				
				content.appendChild(divs);
				
				var img=imgs.pop();
				setTimeout(function() {
					box.scrollTo(0, img.offsetTop + title.offsetHeight);
				}, 500);
				positionInfo = null;
				
			document.getElementById('imgupimg').style.display='block';
		}, 50);
	}

	function regEvent(o) {
		var li = null;
		if(o)
			li = [o];
		else
			li = box.querySelectorAll('div');
		if(li)
			for(var i = 0; i < li.length; i++) {
				o = li[i];
				o.oninput = txtinput;
				o.onblur = txtblur;
				o.onfocus = txtfocus;
				o.onclick = txtclick;
				o.ff = false;
			}
	}

	function init() {
		box =document.getElementById('weditbox');
		if(title) return;
		title = ca('div', {
			'class': 'title',
			'id':'title'
		});
		title.maxlength = 50;
		content = ca('div', {
			'class': 'content',
			'id':'content'
		});
		mark = ca('mark');
		mark.innerHTML = '❌';
		mark.onclick = clickMark;
		regEvent();
		box.onclick = function(e) {
			if(e.target == box) {
				if(contentEdit()) {
					content.focus();
					document.getElementById('imgupimg').style.display='block';
					rangeEnd(content);
				}
			}
		}
		
		document.body.addEventListener('focusout', function() {
			document.activeElement.blur();
		});
	}

	function rangeEnd(o) {
		var sel = window.getSelection();
		var range = sel.getRangeAt(0);
		range.deleteContents();
		var el = document.createTextNode("");
		var lastNode = o.appendChild(el);
		if(lastNode) {
			range = range.cloneRange();
			range.setStartAfter(lastNode);
			range.collapse(true);
			sel.removeAllRanges();
			sel.addRange(range);
		}
	}

	function contentEdit() {
		if(!content.ff) {
			content.setAttribute('contenteditable', 'plaintext-only');
			setTimeout(function(){
				Comm.resizeSection();
			},300)
			
		}
		document.getElementById('imgupimg').style.display='block';
		return !content.ff;
	}

	function txtclick(e) {
		if(this == content) {
			estop(e);
			contentEdit();
			var range, sel = window.getSelection(),
				ry = e.offsetY;
			if(range = document.caretRangeFromPoint(e.clientX, e.clientY)) {
				if(!this.ff) {
					content.focus();
					document.getElementById('imgupimg').style.display='block';
					setTimeout(function() {
						if(box.scrollHeight > box.offsetHeight) {
							ry = title.offsetHeight + ry - 50;
							if(ry > 0) {
								box.scrollTo(0, ry);
							}
							range.collapse(true);
							sel.removeAllRanges();
							sel.addRange(range);
						}
					}, 50);

				}
			}

		}
	}

	function txtinput(e) {
		if(this === title) {
			if(first==1){
			if(this.innerHTML.replace(/\s+/g, "").replace(/[ ]|[&nbsp;]/g, '').length >= title.maxlength) {
				
					Comm.message('标题最多输入50字');
					first=2;
				
				//this.innerHTML = this.innerHTML.replace(/\s+/g, "").replace(/[ ]|[&nbsp;]/g, '');
				//.substr(0, title.maxlength)
				rangeEnd(this);
				estop(e);
			}
			}
		}else{
			Comm.resizeSection();
		}
	}

	function txtblur(e) {
		this.ff = false;
		if(this == content) {
			//this.setAttribute('contenteditable', 'false');
		}else{
			
		}
		Comm.resizeSection();
	}

	function txtfocus(e) {
		imgBlur();
		if(this.id=='content'){
		document.getElementById('imgupimg').style.display='block';
		}else{
		document.getElementById('imgupimg').style.display='none';	
		}
		
		this.ff = true;
	}

	return {
		init: init,
		addImg: addImg,
		addImgShow: function(src) {
			var img = document.createElement('img');
			img.src = src;
			img.onclick = imgFocus;
			if(curImg) {
				content.insertBefore(img, curImg);
				imgBlur();
			} else if(positionInfo) {
				var frag = document.createDocumentFragment();
				var lastNode = frag.appendChild(img);
				positionInfo.range.insertNode(frag);
				if(lastNode) {
					positionInfo.range = positionInfo.range.cloneRange();
					positionInfo.range.setStartAfter(lastNode);
					positionInfo.range.collapse(true);
					positionInfo.sel.removeAllRanges();
					positionInfo.sel.addRange(positionInfo.range);
				}
			} else
				content.appendChild(img);
			setTimeout(function() {
				box.scrollTo(0, img.offsetTop + title.offsetHeight);
			}, 50);
			positionInfo = null;
		},
		getData: function(imglen) {
			var imgs = content.querySelectorAll('img'),
				im = [];
			if(imgs && imgs.length > 0) {
				if(!imglen)
					imglen = imgs.length;
				for(var i = 0; i < imgs.length && i < imglen; i++){
				if(imgs[i].src&&imgs[i].src!=""){
					console.log(imgs[i].src)
					im.push(imgs[i].src);
				}
				}
			}
			var data = {
				title: title.innerText,
				content: content.innerHTML,
				img: im
			};
			return data;
		},
		fill: function(data) {
			if(title && content) {
				title.innerHTML = data.title;
				content.innerHTML = data.content;
				var imgs = content.querySelectorAll('img');
				if(imgs)
					for(var i = 0; i < imgs.length; i++)
						imgs[i].onclick = imgFocus;
			}
		}
	}

}