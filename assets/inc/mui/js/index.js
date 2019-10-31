$(function(){
	'utf-8'
	var letter = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','X','Y','Z'];
	var lettetHtml = '<ul>';
	var listHtml = '';
	for (var i = 0; i<letter.length; i++) {
		lettetHtml += '<li>'+letter[i]+'</li>'
		listHtml += '<div class="listEver" id="'+letter[i]+'">'
			+'<p>'+letter[i]+'</p>'
			+'<ul></ul>'
		+'</div>'
	}
	lettetHtml += '</ul>'
	$('.letter').html(lettetHtml);
	$('.list').html(listHtml);
	AJAX.GET('/api/city/list',function(a){
		if(a&&a.code==1){
			var name = [];
			var names = [];
			for(var i =0 ;i<a.data.length;i++){
				name.push({name:a.data[i].cityName,id:a.data[i].cityId});
				names.push(a.data[i].cityName);
			}
	for ( var j =0; j<name.length; j++) {
		var fontPin = chineseToPinYin(names[j]).slice(0,1);
		var liHtml = '<li onclick=model.sel("'+name[j].name+'",'+name[j].id+')>'+name[j].name+'</li>'
		$('#'+fontPin).find('ul').append(liHtml);
	};
	$(".letter li").click(function() {
	 	var thisFont = $(this).html();
        $(".list").animate({
            scrollTop: $("#"+thisFont).offset().top }, {duration: 500,easing: "swing"});
        return false;
    });
	}
	})
})