
currId = 0;

currSection.on('leave', function(){
	if(currId != this.id){
		animate out
		oncomplete
		this.trigger('exit');
	}
});

currSection.on('exit', function(){
	animated out
	newSection.trigger('enter');
});

newSection.on('enter', function(){
	animate in
	oncomplete
	this.trigger('ready');	
});

newSection.on('ready', function(){
	animated in
});