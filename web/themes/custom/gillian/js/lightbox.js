(function ($) {

	let slides = [];
	let slide = 0;

	$(document).ready(function () {
		$('#overlay #close').click(function(){overlayClose()});
		prepareSlides();
	})
	$(document).ajaxComplete(function() {
		slides = [];
		slide = 0;
		prepareSlides(true);
	});
	function prepareSlides(ajax){
		if(!ajax){
			$('#overlay .paddle.left svg').click(function(){
				showSlide('left');
			})
			$('#overlay .paddle.right svg').click(function(){
				showSlide('right');
			})
		}

		$('.slideShow,.slideGroup').each(function(i){
			const images = [];
			$(this).find('img').each(function(){
				const ratio = $(this).attr('data-width')/$(this).attr('data-height')
				images.push([$(this).attr('data-slide'),ratio]);
			});
			slides.push([images,$(this).find('.photoCredit').html()]);
			this.onclick=function(){
				showSlide(i);
			}
		})
	}

	function showSlide(i){
		if(i==='left') i = slide-1;
		if(i==='right') i = slide+1;
		if(i < 0) i = slides.length-1;
		if(i >= slides.length) i = 0;
		slide = i;
		overlayOpen('img');
		let id = $('#overlay .active').attr('id') || '_image_one';
		id = id === '_image_one'?'_image_two':'_image_one';
		const width= Math.floor($(window).width()/100*90/slides[i][0].length);
		$('#overlay .active').removeClass('active').css({opacity:0});
		let html = "";
		for(let url of slides[i][0]){
			html+=`<img style = "opacity:0; max-width:${width}px" src = "${url[0]}" data-ratio = "${url[1]}" />`;
		};
		const activeDiv = $('#overlay #'+id);
		activeDiv.html(html).addClass('active');
		const activeImages = activeDiv.find('img');
		activeImages.each(function(){
			$(this).on("load",function(){
				const height = Math.round(this.width/$(this).attr("data-ratio"));
				console.log(this.width,height);
				this.style.maxHeight = height+"px";
			})
			
		})
		activeImages.first().on('load',function(){
			activeDiv.css({opacity:1});
			activeImages.css({opacity:1});
		});
		if(slides[i][1]){
			$('#overlay #photoCredit').html(slides[i][1]);
		}else{
			$('#overlay #photoCredit').html('');
		}
	}

	function overlayOpen(type){
		setTimeout(function(){
			$('#spinner').css({display:'block'});
		},1000)

		$('#overlay').css({
			width:"100%",
			height:"100%",
			left:0,
			top:0,
			opacity:1
		})
		if(type === 'img'){
			$('#overlay img').css({opacity:0});
			if($('.slideShow img').length > 1){
				$('#overlay .paddle').css({display:'flex'});
			}else{
				$('#overlay .paddle').css({display:'none'});
			}
			$('#overlay iframe').css({display:'none'});
		}else{
			$('#overlay #photoCredit').html('');
			$('#overlay img, #overlay .paddle').css({display:'none'});
			$('#overlay iframe').css({display:'block'});
		}
	}

	function overlayClose(){
		$('#spinner').css({display:'none'});
		$('#overlay').css({
			width:0,
			height:0,
			left:'50%',
			top:'50%',
			opacity:0
		})
		$('#overlay iframe').attr('src','').contents().remove();
		$('#overlay img').attr('src','').contents().remove();
	}
}(jQuery))