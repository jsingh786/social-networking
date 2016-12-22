var getExtraNews = null;
$(document).ready(function(){
//	getNewsLists();
	onScroll();
	
	
	 $('input[name=radio_news_type]').change(function () {


		 if($(this).val())
	        	{
	        	var news_type = $(this).val();
	        	//Alert box for confirming default news type.
	            $( "div#dialog_confirm_default_news_type" ).dialog({
	           	 modal: true,
	           	 autoOpen: false,
	           	 draggable:false,
	           	 width: 304,
	           	 show: {
	           		 effect: "fade"
	           	 },
	           	 hide: {
	           		 effect: "fade"
	           	 },
	           	 buttons: {
	           		 Yes: function() {
	           			 //$( this ).dialog( "close" );
	           			 setDefault($( this ),news_type);
	           			 $(this).dialog("close");
	           		 },
	           		 No: {
	                        click: function () {
	                        	if(news_type == 1)
	                        		{
	                        		window.location.href = "/" + PROJECT_NAME + "news";
	                        		}
	                        	else
	                        		{
	                        		window.location.href = "/" + PROJECT_NAME + "news/ibn";
	                        		}
	                        	
	                            $(this).dialog("close");
	                        },
	                        class: 'only_text',
	                        text : 'No'
	                    }
	           	 }
	            });
	            
	            $("#dialog_confirm_default_news_type").dialog("open");
	        	}
	    });
	   // $('input[id=radio_IBN]').attr('checked', 'checked').trigger('change');        
});

function setDefault(ths,news_type)
{
	//alert(news_type+'set as default');
	var idd = addLoadingImage(ths, "before", "loading_small_purple.gif", 113, 18);
	$.ajax({
		url : "/" + PROJECT_NAME + "news/set-news-type-as-default",
		method : "POST",
		type : "post",
		dataType : "json",
		data: "news_type="+news_type,
		success : function(jsonData) {

			//Remove Loading
			$('span#'+idd).remove();
			showDefaultMsg( "Default news type set.", 1 );
			if(news_type == 1)
    		{

    			window.location.href = "/" + PROJECT_NAME + "news";
    		}
			else
    		{
    			window.location.href = "/" + PROJECT_NAME + "news/ibn";
    		}
		}
	});		
}



function getNewsLists(){
	$.ajax({
		url : "/" + PROJECT_NAME + "news/news-list",
		method : "POST",
		type : "post",
		dataType : "json",
		beforeSend: function(e){
			$("div#loadingDiv").fadeIn();
		},
		success : function(jsonData) {
			$("div#loadingDiv").fadeOut();
			// newslist session create...
			onScroll();
		}
	});		
};

function getNews(){
	var initial = $("#initialPoint").val();
	getExtraNews = $.ajax({
		url : "/" + PROJECT_NAME + "news/remaining-news",
		method : "POST",
		type : "post",
		data: "initial="+initial,
		dataType : "json",
		beforeSend: function(e){
			if(getExtraNews!=null){
				getExtraNews.abort();
			}
//			$("div#loadingDiv").fadeIn();
		},
		success : function(jsonData) 
		{
			var endPt = parseInt(initial)+parseInt(12);	
			if(initial==jsonData.length)
			{
//				$("div#loadingDiv").empty();
//				$("div#loadingDiv").html("No more news to view.");
//				$("div#loadingDiv").fadeIn();
			}
			else
			{
//				$("div#loadingDiv").fadeOut();
				if(endPt>=jsonData.length)
				{
					endPt = jsonData.length;
				}
				var html = '';
				for(var i=initial;i<endPt;i++)
				{
					if(parseInt(i) % parseInt(3) == 0)
					{
						html +='</div><div>';
					}
					html +='<div class="news-listing-col1">';
					if(jsonData[i].videoImg==1)
					{
						html +='<div class="play-icon">';
						html +='<img id="showDownload" src="'+IMAGE_PATH+'/play.png" width="25" height="25" />';
						html +='</div>';
					}
					html +='<div class="top">';			
					html +='<img src="'+jsonData[i].image+'" />';
					html +='</div>';
					html +='<div class="bot">';
					html +='<h3 title="'+jsonData[i].full_title+'">';
					html +='<a href="'+jsonData[i].link+'" class="text-link">';
					html +=jsonData[i].title;
					html +='</a>';	
					html +='</h3>';
					html +='<p class="text-grey2">';
					html +=jsonData[i].dateNtime;
					html +='</p>';
					html +='<p>';
					html +=jsonData[i].description;
					html +='</p>';
					html +='</div>';
					html +='</div>';
				}
				$(".news-content-outer").append(html);
				$("#initialPoint").val(endPt);
			}
		}
	});		
};

function onScroll(){
	 $(window).scroll(function(){
	        var wintop = $(window).scrollTop(), docheight = $(document).height(), winheight = $(window).height();
	        var  scrolltrigger = 0.95;
	        if  ((wintop/(docheight-winheight)) > scrolltrigger) {
	        	getNews();
	        }
	    });
}