/*
*
*	scrollSlide: 	Mostly native javascript scroll animated slide show.
*	by: 			Pierre-Michel Morais-Godin, 2013
*	github: 		https://github.com/pmgodin/scrollSlide
*
*/
var slideScroll = {
	slides: 		null,
	lastScroll: 	0,
	links: 			null,
	sections: 		null,
	speed: 			0.5, 
	width: 			null,

	init: function(options){
		for(o in options){
			this[o] = options[o];
		}
		this.width = this.sections[0].offsetWidth;

		for(var i=0; i<this.sections.length; i++){
			var _this = this;
			_this.links[i].href = "#"+i;
			_this.links[i].onclick = function(){
				var index = this.href.split("#")[1];
				_this.tween(_this.sections[index]);
				return false;
			}
		}
	},

	hideAll: function(){
		for(var i=0; i<this.slides.length; i++){
			this.slides[i].style.display = "none";
		}
	},

	switch: function(el){
		var step = Math.floor(el.scrollX/this.width);
		var progress = (el.scrollX-(this.width*step))/this.width;
		var cur = (sens) ? this.slides[step] : this.slides[step+1];
		var next = (sens) ? this.slides[step+1] : this.slides[step];

		var sens = this.lastScroll<el.scrollX;
		this.lastScroll = el.scrollX;
		
		this.hideAll();

		if(cur){
			cur.style.display = "block";
			cur.style.opacity = progress;
		}
		if(next){
			next.style.display = "block";
			next.style.opacity = 1-progress;
		}
		var _this = this;
		window.onresize = function(e){
			_this.width = _this.sections[0].offsetWidth;
		}
	},

	tween: function(el){
		TweenLite.to(window, this.speed, {scrollTo:{x:el.offsetLeft}, ease:Linear.easeInOut});
	}
};