;(function ( $, window, document, undefined ) {

    var pluginName = 'connectedHome',
        defaults = {}; 

    function Plugin ( element, options ) {
    	var plugin = this;
    	this._defaults = defaults;
        this._name = pluginName;
        this.element = $(element);
        this.header = $('> .header', this.element);

    	this.init = function(){
    		this.sections.init();
            this.tooltips.init();
            this.navigations.init();
    	};

    	this.sections = {
    		init: function(){
    			var sections = plugin.sections,
                    tooltips = plugin.tooltips,
                    navigations = plugin.navigations;

				sections.container = $('.sections', plugin.element);
    			sections.section = $('.section', sections.container);
    			var id = sections.section.filter(':first-child').data('id');
				
    			
    			sections.currId = 0;
    			sections.firstRun = true;
				sections.btn = $('.section-btn', plugin.element);

    			sections.section.on('enter.section', function(e){
    				var section = $(this),
    					id = section.data('id');

    				section.addClass('current');
    				section.addClass('enter');
    				section.one('webkitAnimationEnd oanimationend msAnimationEnd animationend', function(){
    					section.trigger('ready.section');
    				});
                    navigations.goto(id);
                    plugin.element.addClass('section-'+id);
    				sections.btn.removeClass('selected');
    				sections.btn.filter('[data-id='+id+']').addClass('selected');
                    
    			}).on('ready.section', function(e){
    				var section = $(this),
                        id = section.data('id');
    				section.removeClass('enter').addClass('ready');
                    sections.currId = id;
    			}).on('leave.section', function(e){
    				var section = $(this);
    				section.removeClass('ready').addClass('leave');
    				section.one('webkitAnimationEnd oanimationend msAnimationEnd animationend', function(){
    					section.trigger('exit.section');
    				});

    			}).on('exit.section', function(e){
    				var section = $(this),
                        id = section.data('id'),
    					tooltip = tooltips.current();

                    plugin.element.removeClass('section-'+id);
    				section.removeClass('current leave zoom-in zoom-out');

    				if(tooltip.hasClass('current')){
    					tooltip.trigger('leave');
    				}
    			}).on('zoom-in.section', function(e){
    				var section = $(this);
	    			section.removeClass('zoom-out').addClass('zoom-in');
    			}).on('zoom-out.section', function(e){
    				var section = $(this);
    				section.removeClass('zoom-in').addClass('zoom-out');
    				section.one('webkitAnimationEnd oanimationend msAnimationEnd animationend', function(){
    					$('.image', section).css({transformOrigin: '0 0'});
    				});
    			});

    			sections.btn.on('click', function(){
    				var id = $(this).data('id');
    				sections.goto(id);
    			});

				sections.goto(id);
				sections.firstRun = false;
    		},
    		goto: function(id){
    			var sections = plugin.sections,
    				currId = sections.currId;

    			if(id != currId || sections.firstRun){
	    			
	    			newSection = sections.section.filter('[data-id=' + id + ']');
					if(sections.firstRun){
	    				newSection.trigger('enter');
	    			} else {
	    				currSection = sections.section.filter('[data-id=' + currId + ']');
	    				currSection.trigger('leave.section');
	    				currSection.on('exit.section', function(){
	    					newSection.trigger('enter.section');
	    				});
	    			}
	    		}
    		},
    		current: function(){
    			return this.section.filter('[data-id='+this.currId+']');
    		}	
    	};

    	this.tooltips = {
    		init: function(){
    			var tooltips = plugin.tooltips;
     			tooltips.container = $('.tooltips', plugin.element);
    			tooltips.currId = 0;
    			tooltips.tooltip = $('.tooltip', tooltips.container);
                tooltips.btn = $('.tooltip-btn', plugin.element);

    		  	tooltips.tooltip.on('enter.tooltip', function(){
    				var tooltip = $(this),
                        id = tooltip.data('id'),
    					sections = plugin.sections,
    					section = sections.current(),
    					position = {
		    				top: tooltip.get(0).style.top,
		    				left: tooltip.get(0).style.left,
		    			};

		    		$('.image', section).css({transformOrigin: position.left + ' '+ position.top});
	   				tooltip.addClass('current enter');
    				section.trigger('zoom-in.section');
    				section.one('webkitAnimationEnd oanimationend msAnimationEnd animationend', function(){
    					tooltip.trigger('ready.tooltip');
    				});

                    tooltips.btn.removeClass('selected');
                    tooltips.btn.filter('[data-id='+id+']').addClass('selected');
    			}).on('ready.tooltip', function(){
    				var tooltip = $(this);
    				tooltip.addClass('ready').removeClass('enter');
    			}).on('leave.tooltip', function(e, zoomOut){
    				var tooltip = $(this),
	    				sections = plugin.sections,
    					section = sections.current();
    				tooltip.addClass('leave').removeClass('ready').trigger('exit.tooltip');

    				section.trigger('zoom-out.section');
	    		}).on('exit.tooltip', function(){
					var tooltip = $(this);
    				tooltip.removeClass('current leave');
                    tooltips.btn.removeClass('selected');
    			}).on('change.tooltip', function(){
    				var tooltip = $(this),
	    				currTooltip = tooltips.current();

	    			currTooltip.one('exit.tooltip', function(){
						tooltip.trigger('enter.tooltip');
					}).addClass('leave').removeClass('ready').trigger('exit.tooltip');
    			});

    			$('.tooltip-btn, .close-btn', plugin.element).on('click', function(){
    				var id = $(this).data('id');
    				tooltips.goto(id);
    			});
    		},
    		goto: function(id){
    			var tooltips = plugin.tooltips,
    				currId = tooltips.currId;
    			
    			if(id && id != currId){
   					newTooltip = tooltips.tooltip.filter('[data-id='+id+']');
    				
	    			if(tooltips.tooltip.hasClass('current')){
	    				newTooltip.trigger('change.tooltip');
					} else {
						newTooltip.trigger('enter.tooltip');
					}

					tooltips.currId = id;
    			} else {
    				tooltips.close();
    			}
    			
			},
			close: function(){
				var tooltips = plugin.tooltips,
					tooltip = tooltips.current();
				tooltip.trigger('leave.tooltip');
                tooltips.currId = 0;
			},
			current: function(){
				return this.tooltip.filter('[data-id='+this.currId+']');
			},
			resize: function(){
			
			}
    	};

        this.navigations = {
            init: function(){
                var navigations = plugin.navigations;
                navigations.container = $('.section-navigation-container', plugin.element);
                navigations.navigation = $('.navigation', navigations.container);
            },
            goto: function(id){
                var navigations = plugin.navigations,
                    sections = plugin.sections,
                    currId = sections.currId;
                
                console.log(id, currId);
                if(id && id != currId){

                    currNavigation = navigations.navigation.filter('[data-id='+currId+']');
                    newNavigation = navigations.navigation.filter('[data-id='+id+']');
                    console.log(newNavigation);
                    if(newNavigation.length){
                        newNavigation.addClass('current'); 
                    }
                    if(currNavigation.length){
                        currNavigation.removeClass('current');
                    }
                } else {
                   // navigations.navigation.removeClass('current');
                }
            }
        };

        this.init();
    }

  
    $.fn[ pluginName ] = function ( options ) {
        return this.each(function() {
            if ( !$.data( this, "plugin_" + pluginName ) ) {
            	$.data( this, "plugin_" + pluginName, new Plugin( this, options ) );
            }
        });
    };

})( jQuery, window, document );