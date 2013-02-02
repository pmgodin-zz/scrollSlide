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
		keepLimits: 	true, 
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
	this.params.maxSize = 0;
	this.step = -1;

	var pos = {
		scroll: "scrollX",
		start:  "offsetLeft",
		size: 	"offsetWidth",
		style: 	"width"
	}
	if(this.params.axis=="y"){
		pos = {
			scroll: "scrollY",
			start:  "offsetTop",
			size: 	"offsetHeight",
			style: 	"height"
		}
	}
	var scroll = {};

	//this.params.window = (window.innerHeight) ? {width: window.innerWidth, height: window.innerHeight} : {width: document.body.clientWidth, height: document.body.clientHeight};

	this.init = function(){
		this.params.size = {w:this.params.sections[0].offsetWidth, h:this.params.sections[0].offsetHeight};

		for(var i=0; i<this.params.sections.length; i++){
			this.params.maxSize += this.params.sections[i][pos.size];
			if(_this.params.links[i]){
				_this.params.links[i].href = "#"+i;
				_this.params.links[i].onclick = function(){
					var index = this.href.split("#")[1];
					_this.classes(index);
					_this.tween(_this.params.sections[index]);
					return false;
				}
			}
		}

		if(this.params.maxSize < this.params.sections[this.params.sections.length-1][pos.start]){
			var	add = this.params.sections[this.params.sections.length-1][pos.start]-this.params.maxSize;
			this.params.sections[this.params.sections.length-1].style[pos.style] = this.params.sections[this.params.sections.length-1][pos.size]+add+"px";
			console.log(this.params.sections[this.params.sections.length-1][pos.size]);
		}

		// auto select slide onload
		_this.switch(window);
	}

	this.classes = function(index){
		for(var i=0; i<this.params.links.length; i++){
			this.params.links[i].className = this.params.links[i].className.replace(" " + this.params.selected,"");
		}
		if(this.params.links[index]) this.params.links[index].className += " " + this.params.selected;
	}

	this.hideAll = function(){
		for(var i=0; i<this.params.slides.length; i++){
			this.params.slides[i].style.display = "none";
		}
	}

	this.switch = function(el){
		var changed = false;
		for(s in this.params.sections){
			if(el[pos.scroll] >= this.params.sections[s][pos.start] && el[pos.scroll] <= (this.params.sections[s][pos.start]+this.params.sections[s][pos.size])){
				this.step = parseInt(s);
				this.params.size = {w: this.params.sections[this.step].offsetWidth, h:this.params.sections[this.step].offsetHeight};
			};
		}
		
		var limit = 0;
		if(el[pos.scroll]<this.params.sections[0][pos.start]) limit = -1;
		if(el[pos.scroll]>this.params.sections[this.params.sections.length-1][pos.start]) limit = this.params.sections;

		var step = this.step;
		var cur = (limit==-1) ? -1 : step+1;
		var next = (limit==-1) ? 0 :step;

		if(limit==0){
			this.classes(step);
		}else{
			this.classes(limit);
		}
		if(!this.params.keepLimits) limit = 0;
		
		if(limit==0 && this.params.slides && this.params.sections[step]){
			var progress = Math.abs(1-((this.params.sections[step][pos.start]+this.params.sections[step][pos.size])-el[pos.scroll])/this.params.sections[step][pos.size]);
			this.hideAll();

			cur = this.params.slides[cur];
			next = this.params.slides[next];
			
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
		TweenLite.to(window, this.params.speed, {scrollTo:{x:el.offsetLeft,y:el.offsetTop}, ease:Linear.easeInOut});
	}
};