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
	var _this = this;
	this.params = {
		axis: 			"x",
		links: 			null,
		sections: 		null,
		selected: 		"selected", 
		slides: 		null,
		speed: 			0.5
	}
	for(o in options){
		this.params[o] = options[o];
	}
	this.params.lastScroll = 0;
	this.params.size = {w:0,h:0};
	this.step = 0;
	//this.params.window = (window.innerHeight) ? {width: window.innerWidth, height: window.innerHeight} : {width: document.body.clientWidth, height: document.body.clientHeight};

	this.init = function(){
		this.params.size.w = this.params.sections[0].offsetWidth;

		for(var i=0; i<this.params.sections.length; i++){
			_this.params.links[i].href = "#"+i;
			_this.params.links[i].onclick = function(){
				var index = this.href.split("#")[1];
				_this.classes(index);
				_this.tween(_this.params.sections[index]);
				return false;
			}
		}
		// auto select slide onload
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
		for(s in this.params.sections){
			if(el.scrollX >= this.params.sections[s].offsetLeft && el.scrollX <= (this.params.sections[s].offsetLeft+this.params.sections[s].offsetWidth)){
				this.step = parseInt(s);
				this.params.size = {w: this.params.sections[this.step].offsetWidth, h:this.params.sections[this.step].offsetHeight};
			};
		}

		var step = this.step;
		this.classes(step);

		if(this.params.slides){
			var progress = 1-((this.params.sections[step].offsetLeft+this.params.sections[step].offsetWidth)-el.scrollX)/this.params.sections[step].offsetWidth;
			var cur = (sens) ? step : step+1;
			var next = (sens) ? step+1 : step;

			var sens = this.params.lastScroll<el.scrollX;
			this.params.lastScroll = el.scrollX;
			
			this.hideAll();

			var cur = this.params.slides[cur];
			var next = this.params.slides[next];

			if(cur){
				cur.style.display = "block";
				cur.style.opacity = progress;
			}

			if(next){
				next.style.display = "block";
				next.style.opacity = 1-progress;
			}
		}
		window.onresize = function(e){
			_this.params.size = {w: _this.params.sections[step].offsetWidth, h:_this.params.sections[step].offsetHeight};
		}
		window.onscroll = function(e){
	        _this.switch(this);
	    }
	}

	this.tween = function(el){
		TweenLite.to(window, this.params.speed, {scrollTo:{x:el.offsetLeft}, ease:Linear.easeInOut});
	}
};