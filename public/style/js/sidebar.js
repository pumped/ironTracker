 var block = false;

 $(function() {   

	$("html").swipe( { swipeStatus:swipe2, allowPageScroll:"auto"} );
	$("#sidebar").swipe( { swipeStatus:swipe2, allowPageScroll:"auto"} );
	
	$(".sidebar-toggle").click(toggleSidebar);
	$("#sidebar .menuGroup a.list-group-item").each(function(){
		if ($(this).attr('href') == window.location.search) {
			$(this).addClass('active');
			if ($(this).parent().attr("id") != "MainMenu") {
				$(this).parent().collapse('show')
			}
		}
	});

	$(window).resize(function() {
		if ($(window).width() >= 768) {
				$('#sidebar').css('left','0');
		}/* else if ($(window).width() < 768) {
			if ($('#sidebar').css('left').replace('px','') >= 0) {
				$('#sidebar').animate({left:'-220px'},200);
			}
		}*/
	});


	function isOpen() {
		if ($('#sidebar').css('left').replace('px','') <= -220) {
			return false;
		}
		return true;
	}

	function toggleSidebar() {
		if (isOpen()) {
			$('#sidebar').animate({left:'-220px'},200);
		} else {
			$('#sidebar').animate({left:'0px'},200);
		}
	}

	function isScrolling(event, phase, direction, distance) {
		//if already blocked return it
		if (block) {
			//reset the block if finished
			if (phase == 'end') {
				block = false;
			}
			return true;
		}

	 //check if blocking required
		if ((direction == 'up' || direction == 'down') && distance > 10) {
			block = true;
		}

		return block;
	}

	function getStartPos(phase) {
			//store starting position
			if (phase == 'start') {
				$('#sidebar').data('SlideStart', $('#sidebar').css('left').replace('px',''));
			}

			return parseInt($('#sidebar').data('SlideStart'));
	}

	function getTouchStart(event, phase) {
			if (phase == 'start') {
				$('#sidebar').data('TouchStart', event.touches[0].pageX);
			}
			return parseInt($('#sidebar').data('TouchStart'));
	}

	function snap(startPos, phase, direction, distance) {
		if (phase == 'end' || phase == 'cancel') {
			if (distance > 50) {
				if (direction == 'left') {
					newPos = -220;
				} else if (direction == 'right') {
					newPos = 0;
				} else {
					$('#sidebar').animate({left:startPos+'px'},200);
					//$('#power').animate({left:'0px'},200);
				}
				//console.log(newPos+'px');
				//console.log(direction);
				$('#sidebar').animate({left:newPos+'px'},200);
				//$('#power').animate({left:(newPos+220)+'px'},200);
			} else {
				$('#sidebar').animate({left:startPos+'px'},200);
				//$('#power').animate({left:'0px'},200);
			}
			return true;
		}
		return false;
	}

	function swipe2(event, phase, direction, distance) {
			/*
			//console.log(event.path);
			overflow = false;

			for (i=0; i<event.path.length; i++) {
				ele = event.path[i];
				if( ele.offsetHeight < ele.scrollHeight ||
					ele.offsetWidth < ele.scrollWidth){
					overflow = true;
					block = true;
					break;
				}
				if (i>1) {
					break;
				}            
			}
			console.log(overflow);*/

			//block if scrolling detected
			if (isScrolling(event, phase, direction, distance)) {
				return;
			}
			
			//check that touch was within range
			if (getTouchStart(event, phase) > 25 && !isOpen()) {
				return;
			}

			//starting position
			var startPos = getStartPos(phase);

			//calculate snap on end
			if (snap(startPos, phase, direction, distance)) {
				return;
			}
			
			//swipe
			if (distance > 20) {
				swipeDist = distance;
				if (direction == 'left') {
					swipeDist = -distance;
				}
				
				//new position
				var newPos = startPos + swipeDist;
				if (newPos > 0) {
					newPos = 0;
				}
					$('#sidebar').css('left',newPos+'px');
			}
		}
});