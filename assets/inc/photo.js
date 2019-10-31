(function() {
	var mbox, imgs, menu, type = 0,
		state = 0,
		box, lis, activeIndex,lastIndex=-1, mLeft = 10,
		compress = 0.3,
		minW = 0,
		maxW = 0,
		closeHandle = 0,
		menuHandle = 0;
	var translate = 'w9xdata',
		tps = 0,
		startTime = 0;

	function feach(list, fn) {
		if (list && list.length > 0 && fn)
			for (var i = 0; i < list.length; i++)
				fn(list[i], i);
	}

	function c(tag, config) {
		tag = document.createElement(tag ? tag : 'div');
		if (config)
			for (var i in config){
				if(config[i]){
					tag.setAttribute(i, config[i]);
				}
			}
		return tag;
	}

	function ao(o, p) {
		if (o) {
			(p ? p : document.body).appendChild(o);
		}
		return o;
	}

	function setS(obj, tv) {
		if (obj && tv)
			for (var t in tv)
				obj.style[{
					w: 'width',
					h: 'height',
					t: 'top',
					l: 'left'
				} [t]] = tv[t] + 'px';
	}

	function estop(e) {
		e.stopPropagation();
		e.preventDefault();
	}

	function calcCompress(v, maxv) {
		if (maxv >= 0)
			return maxv / 2;
		if (v > 0)
			return v * compress;
		else if (v < maxv)
			return (v - maxv) * compress + maxv;
		return v;
	}

	function getMomentum(dir, cp, xy) {
		return +((cp[xy] - dir.lastP[dir.lastP.length - 1][xy]) / (now() - dir.lastTime)).toFixed(3) * box.offsetWidth / 2;
	}

	function aniEnd(o, ev) {
		o.addEventListener("webkitTransitionEnd", ev);
	}

	function init() {
		if (!box) {
			mbox = c('div', {
				id: 'photobox',
				'class': 'photohide'
			});
			setAni(mbox, true);
			aniEnd(mbox,tempEnd);
			box = c('ul');
			pbox = c('p');
			ao(pbox, mbox);
			aniEnd(box,pageEnd)
			regtouch(ao(box, ao(mbox)));
		}
	}
	
	function pageEnd(e){
		if(lastIndex!=-1&&lis[lastIndex].data.flag==1){
			if(imgs[lastIndex].offsetHeight>box.offsetHeight&& imgs[lastIndex].offsetTop>0)
				setS(imgs[lastIndex],{t:0});
		}
	}

	function getLis(imgobj) {
		var root = imgobj,
			s = [],
			rsrc;
		while (root = root.parentNode) {
			if (root.className && root.className.indexOf('wimgbox') > -1) {
				break;
			}
		}
		if (root == null)
			root = imgobj.parentNode;
		if (root) {
			var li = root.querySelectorAll('img.wimg');
			if (li)
				feach(li, function(a, i) {
					if (imgobj === a)
						activeIndex = i;
					rsrc = a.getAttribute('rsrc');
					s.push({
						src: a.src,
						rsrc: rsrc,
						att: getAtt(a)
					});
				});
		}
		return s;
	}

	function addLi(a, b) {
		var li = c('li', {
				'class': "loading"
			}),
			img = c('img', {
				src: a.src,
				rsrc: a.rsrc
			});
			
		var nh=mbox.offsetWidth*a.att.rh/a.att.rw;
		var f = mbox.offsetHeight - nh;
		if (f > 0)
			f = Math.round(f / 2);
		else
			f = 0;
		img.style.top = f + 'px';
		img.data = {
			h: a.rh,
			t: f,
			wh: a.att.rw/a.att.rh,
			flag: 0
		};
		a.img = img;
		img.onload = function() {
			console.log(getRsrc(this))
			if (!getRsrc(this))
			this.parentNode.className = '';
			
		};
		setTimeout(function(){
		img.	parentNode.className = '';
		},3000)
		aniEnd(img, imgEnd);
		return ao(img, ao(li, box));
	}

	function calcPageOff(v) {
		return -v * (document.body.clientWidth + mLeft);
	}

	function gopage(v, first) {
		if (v < 0) v = 0;
		else if (v >= lis.length - 1)
			v = lis.length - 1;
		if (!first)
			setAni(box, true);
		transform(box, calcPageOff(v), 0);
		showRsrc(v, first);
		if (activeIndex != v || first) {
			lastIndex=activeIndex;
			activeIndex = v;
			if (v = pbox.querySelector('.cur')) v.className = '';
			if (v = pbox.querySelector('b:nth-child(' + (activeIndex + 1) + ')')) v.className = 'cur';
		}
	}

	function getDistance(p) {
		return getDistancep(p.x, p.y, p.x1, p.y1);
	}

	function getDistancep(x1, y1, x2, y2) {
		x1 = Math.round(x1 - x2);
		y1 = Math.round(y1 - y2);
		return Math.sqrt((x1 * x1) + (y1 * y1));
	}

	function setAni(obj, ani) {
		if (obj) obj.style.webkitTransition = ani ? 'all .3s ease' : '';
	}

	function transform(obj, x, y) {
		if (obj) {
			obj.style.webkitTransform = "translate3d(" + x + "px," + y + "px,0)";
			objxy(obj, x, y);
		}
	}

	function initMenu() {
		if (!menu) {
			menu = c('div');
			menu.onclick = function(e) {
				if (e.target.tagName != 'LI') {
					estop(e);
					hideMenu();
				}
			}
			menu.className = 'photohide';
			setAni(menu, true);
			var ul = c('ul');
			ao(ul, ao(menu, mbox));
			var li = c('li');
			li.innerHTML = '保存图片';
			li.onclick = function() {
				if(/.gif[\W]?/i.test(lis[activeIndex].src)) {
					var srcPic = lis[activeIndex].src;
					//var srcd = srcPic.substring(0,srcPic.length-4);
					Comm.downloadImage(srcPic,'.gif');
					hideMenu();
				} else {
					var srcPic = lis[activeIndex].src;
					if(srcPic.substring(srcPic.length-4,srcPic.length)=='/800'||srcPic.substring(srcPic.length-4,srcPic.length)=='/250'||srcPic.substring(srcPic.length-4,srcPic.length)=='/480'){
					var type =srcPic.substring(srcPic.length-8,srcPic.length-4);
					var srcd = srcPic.substring(0,srcPic.length-4);
					}else{
						var type =srcPic.substring(srcPic.length-4,srcPic.length);
						var srcd = srcPic;
					}
					console.log(type)
					Comm.downloadImage(srcd + '/1000',type);
					hideMenu();
				}
			}
			ao(li, ul);
			li = c('li');
			li.innerHTML = '取消';
			li.onclick = hideMenu;
			ao(li, ul);
		}
	}

	function showMenu(op, np) {
		if (op == null) {
			return false;
		}
		if (!menu)
			initMenu();
		if (np == null || (Math.abs(op.x - np.x) < 5 && Math.abs(op.y - np.y) < 5)) {
			if (menu && menuHandle > 0) {
				hide(menu, false);
				setTimeout(function() {
					menu.querySelector('ul').style.bottom = 0 + 'px';
					menu.className = 'photoshow';
				}, 100);
				return true;
			}
			menuHandle = 0;
		}
		return false;
	}

	function hideMenu() {
		if (menu) {
			var ul = menu.querySelector('ul');
			ul.style.bottom = (-ul.offsetHeight) + 'px';
			menu.className = 'photohide';
			box.flag = 0;
			if (type == 110) {
				type = 0;
			}
			setTimeout(function() {
				hide(menu);
			}, 210);
		}
	}

	function chagesize(obj, w) {
		var olw = obj.offsetWidth,
			oth = obj.offsetHeight,
			fh;
		fh = w / obj.data.wh;
		if (Math.round(w) == Math.round(box.offsetWidth)) {
			oth = obj.data.t;
			olw = 0;
			obj.data.flag = 0;
		} else {
			obj.data.flag = 1;
			oth = obj.offsetTop - (fh - oth) / 2;
			olw = obj.offsetLeft - (w - olw) / 2;
			if (box.offsetHeight < fh) {
				if (oth > 0)
					oth = 0;
				else if (oth < 0 && oth + fh < box.offsetHeight)
					oth = box.offsetHeight - fh;
			}
			if (box.offsetWidth < w) {
				if (olw > 0)
					olw = 0;
				else if (olw < 0 && olw + w < box.offsetWidth)
					olw = box.offsetWidth - w;
			}
		}
		setS(obj, {
			w: w,
			t: oth,
			l: olw
		});
	}

	function objxy(obj, x, y) {
		if (x == null) {
			var xy = obj[translate];
			return xy ? xy : {
				x: 0,
				y: 0
			};
		}
		obj[translate] = {
			x: x,
			y: y
		};
	}

	function geteventxy(e, end) {
		var ts = end ? e.changedTouches : e.touches;
		var p = {
			x: ts[0].pageX,
			y: ts[0].pageY,
			x1: 0,
			y1: 0
		};
		if (ts.length > 1) {
			p.x1 = ts[1].pageX;
			p.y1 = ts[1].pageY;
		}
		return p;
	}

	function calcLastLT(o, l, t) {
		var ll = box.offsetWidth - o.offsetWidth,
			hh = box.offsetHeight - o.offsetHeight;
		var nl = null,
			nt = null;
		l = l == null ? o.offsetLeft : l;
		t = t == null ? o.offsetTop : t;
		if (t > 0)
			nt = hh > 0 ? hh / 2 : 0;
		else {
			if (t < 0) {
				if (t < hh && hh < 0)
					nt = hh < 0 ? hh : hh / 2;
			}
		}
		if (l > 0)
			nl = 0;
		if (l < 0 && l < ll)
			nl = ll;
		return {
			l: nl,
			t: nt
		};
	}

	function hide(o, hide) {
		hide = hide == null ? true : hide;
		o.style.display = hide ? 'none' : 'block';
	}

	function vhide(o, hide) {
		hide = hide == null ? true : hide;
		o.style.visibility = hide ? 'hidden' : 'visible';
	}

	function imgEnd(e) {
		if (type == 0)
			return;
		var o = e.target,
			d = null;
		if (type < 10)
			d = calcLastLT(o);
		if (d == null || (d.l == null && d.t == null)) {
			type = 0;
			setAni(o, false);
			d = null;
		} else {
			if (d.l != null && Math.abs(o.offsetLeft - d.l) > 3) {
				type = 105;
				setS(o, {
					l: d.l
				});
			}
			if (d.t != null && Math.abs(o.offsetTop - d.t) > 3) {
				type = 105;
				setS(o, {
					t: d.t
				});
			}
		}
	}

	function calcDir(cp, op, np, a) {
		a.x = cp.x - op.x;
		a.y = cp.y - op.y;
		a.d = cp.x - np.x;
		return a;
	}

	function now() {
		return (new Date()).getTime();
	}

	function enlarge() {
		var img = lis[activeIndex],att=imgs[activeIndex].att;
		var z=box.offsetWidth;
		if(img.offsetWidth==box.offsetWidth){
			z*=2;
			if(z/att.wh<box.offsetHeight)
				z=box.offsetHeight*att.wh;
		}
		setAni(img, true);
		chagesize(img, z);
	}

	function getAtt(obj) {
		var o = obj;
		var p = {
			w: obj.offsetWidth,
			h: obj.offsetHeight
		};
		p.rw = obj.naturalWidth;
		p.rh = obj.naturalHeight;
		p.wh=p.rw/p.rh;
		return p;
	}

	function tempEnd(e) {
		if (state == 101) {
			state = 1;
			vhide(box, false);
			hide(pbox, imgs.length > 9);
		} else if (state == 102) {
			state = 0;
			hide(mbox);
			hide(pbox);
			box.innerHTML = '';
			pbox.innerHTML = '';
			lis = imgs = null;
		}
	}

	function showMbox(show) {
		if (state == (show ? 1 : 0) || state > 1)
			return;
		if (show) {
				state = 101;
				vhide(mbox, false);
				hide(mbox, false);
				vhide(box, false);
				hide(pbox, imgs.length > 9);
				setTimeout(function() {
					mbox.className = 'photoshow';
				}, 50);
		} else {
			state = 102;
			mbox.className = 'photohide';
		}
	}

	function clearHandle(v) {
		if (v > 0)
			clearTimeout(v);
		return 0;
	}

	function getRsrc(o) {
		var rsrc = o.getAttribute('rsrc');
		if (rsrc && rsrc.length > 10)
			return rsrc;
		return null;
	}

	function showRsrc(v, first) {
		var o = imgs[v].img;
		if (o) {
			var rsrc = getRsrc(o);
			if (rsrc) {
				setTimeout(function() {
					o.setAttribute('rsrc', '');
					var im = new Image();
					im.onload = function() {
						o.src = im.src;
					}
					im.src = rsrc;
				}, first ? 500 : 20);
			}
		}
	}

	function regtouch(mb) {
		var op, np, cp, img, dir, oxy, olt, nowTime;
		var tch = {
			i1: null,
			i2: null
		};
		minW = box.offsetWidth / 2, maxW = box.offsetWidth * 3,
			mb.ontouchstart = function(e) {
				estop(e);
				if (type > 100) return;
				var tip = now() - startTime;
				if (tps == 0) {
					startTime = now();
					np = op = geteventxy(e);
					setAni(box, false);
					dir = {
						ox: 0,
						lastTime: now(),
						first: true,
						lastP: []
					};
					tch.i1 = e.touches[0].identifier;
					if (e.target.tagName == 'IMG') {
						img = e.target;
						setAni(img, false);
						if (e.changedTouches.length > 1) {
							type = 2;
							tch.i2 = e.touches[1].identifier;
						} else if (img.data.flag) {
							type = 3;
							dir.ll = box.offsetWidth - img.offsetWidth;
							dir.hh = box.offsetHeight - img.offsetHeight;
						}
					}
					if (type != 2) {
						oxy = objxy(box);
						if (img) {
							olt = {
								l: img.offsetLeft,
								t: img.offsetTop
							};
							dir.lastP.push({
								x: op.x,
								y: op.y
							});
						}
					}
				} else if (tip < 200 && e.touches.length > 1 && img && tch.i1 != null) {
					np = op = geteventxy(e);
					type = 2;
					tch.i2 = e.touches[1].identifier;
				}
				tps += e.changedTouches.length;
				closeHandle = clearHandle(closeHandle);
				menuHandle = clearHandle(menuHandle);
				if (box.flag && tip > 350) {
					return;
				}
				if (tps == 1) {
					type = 1;
					menuHandle = setTimeout(function() {
						if (tps == 1 && tch.i1 != null && showMenu(op, np)) {
							box.flag = 0;
							type = 110;
						}
					}, 400);
				}
				if (tip < 250 && tps == 1 && tch.i1 != null) {
					closeHandle = clearHandle(closeHandle);
					type = 120;
					enlarge();
				}
			}
		mb.ontouchmove = function(e) {
			estop(e);
			cp = geteventxy(e);
			if (!op || type > 100) {
				return;
			}
			if (type == 2) {
				dir.x = img.offsetWidth + (getDistance(cp) - getDistance(np)) * (window.devicePixelRatio | 0);
				if (dir.x < minW) {
					dir.x = minW;
				}
				chagesize(img, dir.x);
			} else {
				box.flag = 1;
				dir = calcDir(cp, op, np, dir);
				if (type == 1 || type == 4) {
					if (dir.first) {
						dir.first = false;
						var offX = Math.abs(cp.x - op.x);
						var offY = Math.abs(cp.y - op.y);
						if (img && img.data.t == 0 && img.data.flag == 0 && offX < offY) {
							type = 4;
							dir.hh = box.offsetHeight - img.offsetHeight;
						} else if (img&&img.data.flag == 1)
							type = 3;
						else
							type = 1;
					}
					if (type == 1) {
						if( Math.abs(dir.x)>3){
							dir.y = oxy.x + dir.x;
							if (activeIndex == 0 && dir.x > 0) dir.y = dir.x * compress;
							if (activeIndex == (lis.length - 1) && dir.x < 0) dir.y = oxy.x + dir.x * compress;
							transform(box, dir.y, 0);
						}
					} else if (type == 4) {
						setS(img, {
							t: calcCompress(dir.y + olt.t, dir.hh)
						});
					}
				}
				if (type == 3) {
					if (dir.d > 0 && img.offsetLeft >= 0 && activeIndex > 0) {
						dir.ox = olt.l + dir.x;
						transform(box, oxy.x + dir.ox, 0);
						dir.x = -olt.l;
						type = 1;
						oxy.x += olt.l;
					} else if (dir.d < 0 && img.offsetLeft <= dir.ll && activeIndex != lis.length - 1) {
						dir.ox = olt.l + dir.x - dir.ll;
						transform(box, oxy.x + dir.ox, 0);
						dir.x = dir.ll - olt.l;
						oxy.x -= dir.x;
						type = 1;
					} else
						dir.x -= dir.ox;
					dir.x = calcCompress(dir.x + olt.l, box.offsetWidth - img.offsetWidth);
					dir.y = calcCompress(dir.y + olt.t, box.offsetHeight - img.offsetHeight);
					setS(img, {
						l: dir.x,
						t: dir.y
					});
				}
				if (type != 1) {
					nowTime = (+new Date);
					if (nowTime - dir.lastTime > 300) {
						dir.lastTime = nowTime;
						dir.lastP.push({
							x: cp.x,
							y: cp.y
						});
						if (dir.lastP.length > 2)
							dir.lastP.shift();
					}
				}
			}
			np = cp;
		}
		mb.ontouchcancel = mb.ontouchend = function(e) {
			menuHandle = clearHandle(menuHandle);
			if (e.type && e.type == 'type')
				estop(e);
			if (op == null) return;
			var endType = 0,
				ismove = false;
			tps -= e.changedTouches.length;
			feach(e.changedTouches, function(a, b) {
				if (a.identifier == tch.i1) {
					tch.i1 = null;
					endType |= 1;
				} else if (a.identifier == tch.i2) {
					tch.i2 = null;
					endType |= 2;
				}
			});
			var duration = now() - startTime;
			if (tps <= 0 && duration < 200 && endType == 1 && (Math.abs(op.x - np.x) <= 2 && Math.abs(op.y - np.y) <= 2)) {
				if (type != 2 && type < 100 && (menu == null || menu.style.display != 'block')) {
					closeHandle = setTimeout(function() {
						showMbox(false);
					}, 250);
				}
			} else {
				if (type == 1 && (endType & 1) == 1) {
					box.flag = 0;
					ismove = true;
					if (dir.x > 0) {
						if (dir.x > box.offsetWidth / 2 || (dir.x > 20 && duration < 300)) {
							gopage(activeIndex - 1);
						} else {
							gopage(activeIndex);
						}
					} else {
						if (-dir.x > box.offsetWidth / 2 || (-dir.x > 20 && duration < 300)) {
							gopage(activeIndex + 1);
						} else {
							gopage(activeIndex);
						}
					}
				} else if (type == 2 && endType > 0) {
					setAni(img, true);
					if (img.offsetWidth < box.offsetWidth) {
						chagesize(img, box.offsetWidth);
					} else if (img.offsetWidth > maxW) {
						chagesize(img, maxW);
					}
					type = 0;
				} else if (type == 3 && endType == 1 && img) {
					setAni(img, true);
					dir.y = calcCompress(img.offsetTop + getMomentum(dir, cp, 'y'), dir.hh);
					dir.x = calcCompress(img.offsetLeft + getMomentum(dir, cp, 'x'), dir.ll);
					setS(img, {
						l: dir.x,
						t: dir.y
					});
				} else if (type == 4 && endType == 1 && img) {
					setAni(img, true);
					cp = geteventxy(e, true);
					dir.y = calcCompress(img.offsetTop + getMomentum(dir, cp, 'y'), dir.hh)
					setS(img, {
						t: dir.y
					});
				}
			}
			if (tps <= 0) {
				tps = 0;
				box.flag = 0;
				if (!ismove && objxy(box).x != calcPageOff(activeIndex)) {
					setAni(box, true);
					gopage(activeIndex);
				}
				img = queue = op = np = cp = null;
			}
		}
	}
	var photo = function() {}
	photo.prototype.show = function(o, isroot, data) {
//		if (imgs) return;
		if (o) {
			var e = window.event || arguments.callee.caller.arguments[0],
				rsrc;
			estop(e);
			imgobj = o;
			imgs = getLis(imgobj);
			if (!isroot) {
				Page.send('photoShow', {
					img: imgs,
					ind: activeIndex
				});
				return;
			}
		} else if (data) {
			imgs = data.img;
			activeIndex = data.ind;
		}
		if (imgs && imgs.length > 0) {
			if (state > 1)
				return;
			if (box)
				hide(mbox, false);
			else
				init();
			if (box) {
				lis = [];
				vhide(box);
				setAni(box, false);
				o = imgs.length <= 9;
				feach(imgs, function(a, b) {
					console.log(a.src)
					if(a.src!=""){
					lis.push(addLi(a, b));
					if (o&&imgs.length>1)
						ao(c('b'), pbox);
					}
					
				});
				gopage(activeIndex, true);
				lastIndex=-1;
				showMbox(true);
			}
		}
	}
	photo.prototype.close = function() {
		showMbox(false);
	}
	photo.prototype.isShow = function() {
		return state == 1 || state == 10;
	}
	window.Photo = new photo();
})();
