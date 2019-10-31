var tpl=new function (){
	this.gethead =function(){
		var html='';
	html+='<div class="navBar bottomShadow dflex" style="padding: 0;">';
    html+='<div>';
    html+='<img src="img/hgr.png" width="67" />';           
    html+='</div>';        
    html+='<div></div>';        
    html+='<div class="cgreen" style="border-right: 1px solid #E5E5E5;height: 20px;line-height: 20px;margin-top: 12px;"><a onclick="tpl.openclient();" class="cgreen">打开APP</a></div>';        
    html+='<div class="cgreen"><a  onclick="tpl.openclient();" class="cgreen">注册或登录</a></div>';        
    html+='</div>';    
	return html;
	}
	this.foorers = function(){
		var html='';
	html+='<div class="heads mart10 marb10">';
    html+='<div class="name-left fl">';      
    html+='<img class="fl" src="img/fgr.png" width="40" height="40">';            
    html+='<div class="fl marl10 mart5">';           
    html+=' <p class="f20 cgreen bold">果仁</p>';              
    html+='<p class="f12 c9e">985 211大学社交生态圈</p>';                
    html+='</div>';          
    html+='</div>';       
    html+='<div class="name-right fr">';        
    html+='<a onclick="tpl.openclient();" style="display: inline-block;" class="downApp fr mart5">打开APP</a>';
    html+='</div>';       
    html+='<div class="clearfix"></div>';        
    html+='</div>';    
	return html;
	}
	this.openclient=function() {
		var ua = navigator.userAgent.toLowerCase();
        var t;
        var config = {
            /*scheme:必须*/
            scheme_IOS: 'GRApp://',
            scheme_Adr: 'myapp://jp.app/',
            download_url:'https://www.guorenapp.cn//app_pro/app/share.html',
            timeout: 2000
        };
            var startTime = Date.now();

            var ifr = document.createElement('iframe');
            ifr.src = Comm.ios() ? config.scheme_IOS : config.scheme_Adr;
            ifr.style.display = 'none';
            document.body.appendChild(ifr);

            var t = setTimeout(function() {
                var endTime = Date.now();
				
                if (!startTime || endTime - startTime < config.timeout + 200) {
                		
                    window.location.href = config.download_url;
                } else {

                }
            }, config.timeout);

            window.onblur = function() {
                clearTimeout(t);
            }
        }
}