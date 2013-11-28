;(function ( $, window, document, undefined ) {

    var pluginName = 'connectedHome',
        defaults = {}; 

    function Plugin ( element, options ) {
    	var plugin = this;
    	this._defaults = defaults;
        this._name = pluginName;
        
    	this.init = function(){
    		this.element = element;

    		this.sections.init();
    	};

    	this.sections = {
    		init: function(){
    			var sections = plugin.sections;
    			sections.section = $('.section', plugin.element);
    			
    			//console.log(sections.section);
    			// var id = sections.elements.filter(':first-child').data('id');
    			// sections.goto(id);

    			// sections.elements.on('enter', function(){
    			// 	console.log(this);
    			// });

    		},
    		section: {
    			enter: function(){
	    			var sections = plugin.sections,
	    			section = sections.elements.filter('[data-id=' + id + ']');
	    			section.addClass('current');
	    		},
	    		ready: function(){

	    		}
    		},
    		goto: function(id){
    			section = sections.elements.filter('[data-id=' + id + ']');
    		},
    		
    	}


  //       this.element = element;
  //       this.settings = $.extend( {}, defaults, options );
        


  //   	this.sections = {
  //   		elements: $('.section')
  //   	};
  //   	this.sections.section = $('.section', this.element);
  //   	this.images = {};
  //   	this.images.image = $('.image', this.sections.section);
  //   	this.navigation = {};
  //   	this.navigation.btn = $('.section-btn', this.element);
  //   	this.tooltips = {};
  //   	this.tooltips.btn = $('.tooltip-btn', this.element);
  // 		this.firstLoad = true;
		// this.sections.currId = 0;

         this.init();
    }

   //  Plugin.prototype = {
   //      init: function() {

   //      	$(window).on('load', this.loaded);
        	
			// var	id = this.sections.section.filter(':first-child').data('id'),
			// 	plugin = this;

			// this.navigation.btn.on('click', function(e) {
			// 	e.preventDefault();
			// 	var id = $(this).data('id');
			// 	plugin.gotoSection(id);
			// });

			// plugin.gotoSection(id);

			
			// // this.images.image.each(function(){
			// // 	var image = $(this);
			// // 	if(image.parent().hasClass('image-mask')){
			// // 		image.mask = image.parent();
			// // 		image.move = {};
			// // 		image.move.currX = 0;
			// // 		image.move.mouseX = 0;
			// // 		image.move.do = function(){
			// // 			image.move.currX = parseFloat(image.css('left'));
			// // 			var mousePercentageX = parseInt(((image.move.mouseX - image.mask.offset().left) / image.mask.outerWidth()) * 100);
			// // 			var newPosX = parseFloat(-($('img', image).width() - image.mask.outerWidth()) * (mousePercentageX / 100));
			// // 			newPosX = ((newPosX - image.move.currX) * 0.5) + image.move.currX;
			// // 			image.css('left', newPosX+'px');
			// // 		}

			// // 		image.on('mouseenter', function(){
			// // 			image.move.interval = setInterval(image.move.do, 33);
			// // 		}).on('mouseleave', function(){
			// // 			clearInterval(image.move.interval);
			// // 		}).on('mousemove', function(e){
			// // 			image.move.mouseX = e.pageX;
			// // 		});
			// // 	}
			// // });


			// // if (Modernizr.touch){
			// // 	itemsNavigationMask.css({'overflow': 'scroll'})
			// // } else {
			// // 	itemsNavigation.hover(function(e){
			// // 		navigationInterval = setInterval(moveNavigation, 33);
			// // 	}, function(e){
			// // 		clearInterval(navigationInterval);
			// // 	});
			
			// // 	itemsNavigation.mousemove(function(e){
			// // 		mouseYPos = e.pageY;
			// // 	});
			// // }

			// // $('.map area', this.element).on('mouseenter', function(){
			// // 	var area = $(this),
			// // 		id = area.data('id');

			// // 	$('.overlay', this.element).filter('[data-id='+id+']').fadeIn();
			// // }).on('mouseleave', function(){
			// // 	var area = $(this),
			// // 		id = area.data('id');

			// // 	$('.overlay', this.element).filter('[data-id='+id+']').fadeOut();
			// // });

			// // currSection.on('leave', function(){
			// // 	if(currId != this.id){
			// // 		animate out
			// // 		oncomplete
			// // 		this.trigger('exit');
			// // 	}
			// // });

			// // currSection.on('exit', function(){
			// // 	animated out
			// // 	newSection.trigger('enter');
			// // });

			// // newSection.on('enter', function(){
			// // 	animate in
			// // 	oncomplete
			// // 	this.trigger('ready');	
			// // });

			// // newSection.on('ready', function(){
			// // 	animated in
			// // });
   //      },
   //      loaded: function(){
			// if($.fn.maphilight){
	  //   		$('img[usemap]', this.element).maphilight();
	  //       }
   //      },

   //      gotoSection: function (id) {
   //      	if (id != this.sections.currId || this.firstLoad) {
   //      		var section = this.sections.section.filter('[data-id=' + id + ']');
        		
   //      		// set current class to buttons
			// 	this.navigation.btn.removeClass('selected');
			// 	this.navigation.btn.filter('[data-id='+id+']').addClass('selected');
			// 	this.sections.section.removeClass('current').hide();
			// 	section.addClass('current').fadeIn();
			// 	// this.sectsection.hide();
			// 	// section.fadeIn().addClass('current');
			// 	// this.firstLoad = false;
	  //  			// this.sections.currId = id;
   //      	}
   //      },

   //      gotoTooltip: function(id){
   //      //	console.log();
   //      }
   //  };

    $.fn[ pluginName ] = function ( options ) {
        return this.each(function() {
            if ( !$.data( this, "plugin_" + pluginName ) ) {
            	$.data( this, "plugin_" + pluginName, new Plugin( this, options ) );
            }
        });
    };

})( jQuery, window, document );