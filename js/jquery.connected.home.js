;(function ( $, window, document, undefined ) {

    var pluginName = "connectedHome",
        defaults = {
        	propertyName: "value"
    	}; 

    function Plugin ( element, options ) {
        this.element = element;
        this.settings = $.extend( {}, defaults, options );
        this._defaults = defaults;
        this._name = pluginName;
    	this.nav = $('.section-navigation-container', this.element),
		this.sectionBtn = $('.section-btn'),
		this.container = $('.sections', this.element),
		this.section = $('.section', this.container );
		this.firstLoad = true;
		this.currId = 0;

        this.init();
    }

    Plugin.prototype = {
        init: function () {

			var	current = this.section.filter('.current'),
				id = current.filter('.current').data('item-id');

			var main = this;

			this.sectionBtn.on('click', function(event) {
				event.preventDefault();
				var id = $(this).data('item-id');
				main.gotoSection(id);
			});
			this.gotoSection(id);

			// currSection.on('leave', function(){
			// 	if(currId != this.id){
			// 		animate out
			// 		oncomplete
			// 		this.trigger('exit');
			// 	}
			// });

			// currSection.on('exit', function(){
			// 	animated out
			// 	newSection.trigger('enter');
			// });

			// newSection.on('enter', function(){
			// 	animate in
			// 	oncomplete
			// 	this.trigger('ready');	
			// });

			// newSection.on('ready', function(){
			// 	animated in
			// });	
        },
        gotoSection: function (id) {
        	if (id != this.currId || this.firstLoad) {
        		this.firstLoad = false;
	        	newSection = $('.section[data-item-id="' + id + '"]');

				// set current class to buttons
				this.sectionBtn.removeClass('current');
				$(this).addClass('current');

				this.section.hide();
				newSection.fadeIn().addClass('current');

				this.currId = id;        		

        	}

        }
    };

    $.fn[ pluginName ] = function ( options ) {
        return this.each(function() {
            if ( !$.data( this, "plugin_" + pluginName ) ) {
            	$.data( this, "plugin_" + pluginName, new Plugin( this, options ) );
            }
        });
    };

})( jQuery, window, document );