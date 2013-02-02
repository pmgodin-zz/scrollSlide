/*
*
*	scrollSlide: 	Mostly native javascript scroll animated slide show.
*	by: 			Pierre-Michel Morais-Godin, 2013
*	github: 		https://github.com/pmgodin/scrollSlide
*	
*	Using greensock tween for animation - http://www.greensock.com/tweenlite/history.js
*	Using history.js for navigation - https://github.com/balupton/History.js/
*
*/
var slideScroll = function(options){
	this.params = {
		slides: 		null,
		links: 			null,
		sections: 		null,
		selected: 		"selected", 
		speed: 			0.5
	}
	for(o in options){
		this.params[o] = options[o];
	}
	this.lastScroll, this.width = 0;

	this.init = function(){
		var _this = this;
		this.params.width = this.params.sections[0].offsetWidth;

		for(var i=0; i<this.params.sections.length; i++){
			_this.params.links[i].href = "#"+i;
			_this.params.links[i].onclick = function(){
				var index = this.href.split("#")[1];
				_this.classes(index);
				_this.tween(_this.params.sections[index]);
				return false;
			}
		}
		_this.switch(window);
	}

	this.classes = function(index){
		for(var i=0; i<this.params.links.length; i++){
			this.params.links[i].className = this.params.links[i].className.replace(" " + this.params.selected,"");
		}
		this.params.links[index].className += " " + this.params.selected;
	}

	this.hideAll = function(){
		for(var i=0; i<this.params.slides.length; i++){
			this.params.slides[i].style.display = "none";
		}
	}

	this.switch = function(el){
		var step = Math.floor(el.scrollX/this.params.width);
		var progress = (el.scrollX-(this.params.width*step))/this.params.width;
		var cur = (sens) ? this.params.slides[step] : this.params.slides[step+1];
		var next = (sens) ? this.params.slides[step+1] : this.params.slides[step];

		var sens = this.params.lastScroll<el.scrollX;
		this.params.lastScroll = el.scrollX;
		
		this.hideAll();
		this.classes(step);

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
			_this.params.width = _this.params.sections[0].offsetWidth;
		}
	}

	this.tween = function(el){
		TweenLite.to(window, this.params.speed, {scrollTo:{x:el.offsetLeft}, ease:Linear.easeInOut});
	}
};