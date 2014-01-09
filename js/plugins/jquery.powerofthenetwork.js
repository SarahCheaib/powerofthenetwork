;(function ( $, window, document, undefined ) {

    var pluginName = 'powerofthenetwork',
        defaults = {}; 

    function Plugin ( element, options ) {
        var plugin = this;
        this._defaults = defaults;
        this._name = pluginName;
        
        this.init = function(){
            this.element = $(element);
            window.requestAnimationFrame = (function(){
                return window.requestAnimationFrame ||
                window.webkitRequestAnimationFrame ||
                window.mozRequestAnimationFrame ||
                function( callback ){
                    window.setTimeout(callback, 1000 / 60);
                };
            })();

            Modernizr.addTest('ipad', function () {
                return !!navigator.userAgent.match(/iPad/i);
            });

            Modernizr.addTest('iphone', function () {
                return !!navigator.userAgent.match(/iPhone/i);
            });

            Modernizr.addTest('ipod', function () {
                return !!navigator.userAgent.match(/iPod/i);
            });

            Modernizr.addTest('ios', function () {
                return (Modernizr.ipad || Modernizr.ipod || Modernizr.iphone);
            });

            this.sections.init();
            this.tooltips.init();
            this.navigations.init();
            this.infos.init();
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
                    var section = sections.section.filter(this),
                        id = section.data('id'),
                        floorId = Number(String(id).charAt(0)) * 100;
                    
                    if(!Modernizr.cssanimations) {
                        //section.fadeIn(function(){
                            section.addClass('current');
                            section.trigger('ready.section');
                        //});
                    } else {
                        section.addClass('current enter');
                        section.one('webkitAnimationEnd oanimationend msAnimationEnd animationend', function(){
                            section.trigger('ready.section');
                        });
                    }
                    navigations.goto(id);
                    plugin.element.addClass('section-'+id);
                    sections.btn.removeClass('selected');
                    sections.btn.filter('[data-id='+id+'], [data-id='+floorId+']').addClass('selected');
                }).on('ready.section', function(e){
                    var section = sections.section.filter(this),
                        id = section.data('id');

                    section.removeClass('enter').addClass('ready');

                    if($('.image-mask', section).length && !Modernizr.mq('(max-width: 940px)') && !Modernizr.touch){

                        var element = $('.image, .tooltips', section);

                        section.data('move', {
                            currX: 0,
                            animationFrame: requestAnimationFrame(function(){
                                section.trigger('move.section');
                            }),
                            element: $('.image, .tooltips', section),
                            elementWidth: $('.image', section).width(),
                            mask: $('.image-mask', section),
                            maskWidth: $('.image-mask', section).width()
                        });
                    }

                    sections.currId = id;
                }).on('leave.section', function(e){
                    var section = sections.section.filter(this),
                        move = section.data('move');

                    if(!Modernizr.cssanimations) {
                        //section.fadeOut(function(){
                            section.removeClass('enter ready');
                            section.trigger('exit.section');
                        //});
                    } else {
                        section.one('webkitAnimationEnd oanimationend msAnimationEnd animationend', function(){
                            section.trigger('exit.section');
                        });
                        section.removeClass('enter ready').addClass('leave');
                    }

                    if(move){
                    //   cancelAnimationFrame(move.animationFrame);
                    }
                    
                }).on('exit.section', function(e){
                    var section = sections.section.filter(this),
                        id = section.data('id'),
                        tooltip = tooltips.current();

                    plugin.element.removeClass('section-'+id);
                    section.removeClass('current enter ready leave zoom-in zoom-out blur-in');

                    if(tooltip.hasClass('current')){
                        tooltip.trigger('leave.tooltip');
                    }
                }).on('zoom-in.section', function(e){
                    var section = sections.section.filter(this);
                    section.removeClass('zoom-out').addClass('zoom-in');
                    if(Modernizr.cssanimations) {
                        section.one('webkitAnimationEnd oanimationend msAnimationEnd animationend', function(){
                            setTimeout(function(){
                                section.addClass('blur-in');
                            }, 500);
                        });
                    }
                }).on('zoom-out.section', function(e){
                    var section = sections.section.filter(this);
                    section.removeClass('zoom-in blur-in').addClass('zoom-out');
                    
                    if(Modernizr.cssanimations) {
                        section.one('webkitAnimationEnd oanimationend msAnimationEnd animationend', function(){
                            $('.image', section).css({transformOrigin: '0 0'});
                        });
                    }
                }).on('move.section', function(e){
                    // var section = sections.section.filter(this),
                    //     move = section.data('move'),
                    //     currX = move.currX,
                    //     mask = move.mask,
                    //     mousePercentageX = parseInt(((sections.mouseX - mask.offset().left) / move.maskWidth) * 100),
                    //     newPosX = parseFloat(-(move.elementWidth - move.maskWidth) * (mousePercentageX / 100)),
                    //     newPosX = ((newPosX - currX) * 0.05) + currX;
                    
                    // move.element.css('left', newPosX+'px');
                    // move.currX = newPosX;
                    // move.animationFrame = requestAnimationFrame(function(){
                    //     section.trigger('move.section');
                    // });

                    // section.data('move', move);
                }).on('mouseenter', function(){
                    var section = sections.section.filter(this),
                        move = section.data('move');
                    
                    if(move){
                        move.animationFrame = requestAnimationFrame(function(){
                            section.trigger('move.section');
                        });

                        section.data('move', move);
                    }
                }).on('mouseleave', function(){
                    var section = sections.section.filter(this),
                        move = section.data('move');

                    if(move){
                    //    cancelAnimationFrame(move.animationFrame);
                    }
                }).on('mousemove', function(e){
                    sections.mouseX = e.pageX;
                });

                sections.btn.on('click', function(){
                    var id = $(this).data('id');
                    sections.goto(id);
                });

                sections.btn.on('mouseenter', function(){
                    var btn = $(this),
                        id = btn.data('id');

                    sections.btn.filter('[data-id='+id+']').addClass('active');
                    $('.overlay .area', sections.section).filter('[data-id='+id+']').animate({opacity: 0.5}, 'fast');
                }).on('mouseleave', function(){
                     var btn = $(this),
                        id = btn.data('id');

                    sections.btn.filter('[data-id='+id+']').removeClass('active');
                    $('.overlay .area', sections.section).filter('[data-id='+id+']').animate({opacity: 0}, 'fast');
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
                        newSection.trigger('enter.section');
                    } else {
                        currSection = sections.section.filter('[data-id=' + currId + ']');
                        currSection.one('exit.section', function(){
                            newSection.trigger('enter.section');
                        });
                        currSection.trigger('leave.section');

                    }

                    plugin.methods.scrollTop();
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
                    
                    tooltip.addClass('current');
                    if(!Modernizr.cssanimations) {
                        tooltip.trigger('ready.tooltip');
                    } else {
                        tooltip.addClass('enter');
                        // section.one('webkitAnimationEnd oanimationend msAnimationEnd animationend', function(){
                            tooltip.trigger('ready.tooltip');
                        //});
                    }
                    
                    section.trigger('zoom-in.section');
                    
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

                    plugin.methods.scrollTop();
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
                navigations.navigation = $('.navigation', plugin.element);
                navigations.navigation.each(function(){
                    var navigation = $(this);

                    if(navigation.hasClass('floor-navigation')){
                        var btn = $('.section-btn', navigation);
                            
                        btn.on('mouseenter', function(e){
                            var title = $('.title', navigation);
                            title.text($(this).text());                        
                        }).on('mouseleave', function(){
                            var title = $('.title', navigation);
                            title.text(title.data('default'));
                        })

                    }
                });
                
            },
            goto: function(id){
                var navigations = plugin.navigations,
                    sections = plugin.sections,
                    currId = sections.currId;

                if(id != undefined && id != currId){

                    currNavigation = navigations.navigation.filter('[data-id='+currId+']');
                    newNavigation = navigations.navigation.filter('[data-id='+id+']');
                    
                    if(newNavigation.length){
                        newNavigation.addClass('current'); 
                    }
                    if(currNavigation.length){
                        currNavigation.removeClass('current');
                    }
                } 
            }
        };

        this.infos = {
            init: function(){
                var infos = plugin.infos,
                    sections = plugin.sections;
                infos.container = $('> .info', plugin.element);
                infos.content = $('.content', infos.container);


                $('.info-btn', plugin.element).on('click', function(){
                    infos.open();
                });
                $('.close-btn', infos.container).on('click', function(){
                    infos.close();
                });
            },
            open: function(){
                var infos = plugin.infos,
                    sections = plugin.sections,
                    container = infos.container,
                    section = sections.current(),
                    content = infos.content.filter('[data-type='+section.data('type')+']');


                container.addClass('active');
                content.addClass('active');
            },
            close: function(){
                 var infos = plugin.infos,
                    container = infos.container,
                    content = infos.content;

                container.removeClass('active');
                content.removeClass('active');
            }
        };


      

        this.methods = {
            scrollTop: function(){
                if(Modernizr.mq('(max-width: 600px)')) {
                    $('html, body').animate({scrollTop: plugin.element.offset().top});
                }
            }
        }

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