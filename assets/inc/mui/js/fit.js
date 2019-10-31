(function (doc, win) {
    window.base = document.documentElement.clientWidth / 1920;
    var docEl = doc.documentElement,
        resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize',
        recalc = function () {
            window.clientWidth = docEl.clientWidth;
            window.clientHeight = docEl.clientHeight;
            var aspectRatio = window.clientWidth/window.clientHeight;
            if(aspectRatio > 1920 / 1080){
                docEl.style.fontSize = 100 * (window.clientHeight / 1080) + 'px';
                window.base = 100 * (window.clientHeight / 1080); 
            }else{
                docEl.style.fontSize = 100 * (window.clientWidth / 1920) + 'px';
                window.base = 100 * (window.clientWidth / 1920);  
            }
            var isMobile = {
                Android: function () {
                    return navigator.userAgent.match(/Android/i) ? true : false;
                },
                BlackBerry: function () {
                    return navigator.userAgent.match(/BlackBerry/i) ? true : false;
                },
                iOS: function () {
                    return navigator.userAgent.match(/iPhone|iPad|iPod/i) ? true : false;
                },
                Windows: function () {
                    return navigator.userAgent.match(/IEMobile/i) ? true : false;
                },
                any: function () {
                    return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Windows());
                }
            };
            if(isMobile.any()){
                if (window.orientation === 90 || window.orientation === -90 ){   
                    doc.getElementById('warnDrak').style.display = "block"
                }else{

                }   
            }else{
                doc.getElementById('warnDrak').style.display = "block"
            }
        };
    recalc();
    win.addEventListener(resizeEvt, recalc, false);
    doc.addEventListener('DOMContentLoaded', recalc, false);
})(document, window);
