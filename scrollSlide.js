
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
	var _arguments = arguments;
	this.debug = function(log){
		if(_arguments[1]){
			if(document.getElementById("divug")){
				divug = document.getElementById("divug");
			}else{
				divug = document.createElement("div");
				divug.id = "divug";
				divug.style.position = "fixed";
				divug.style.zIndex = "6000";
				divug.style.opacity = "0.7";
				divug.style.left = "10px";
				divug.style.top = "10px";
				divug.style.padding = "10px";
				divug.style.backgroundColor = "red";
				divug.style.color = "#FFF"
				document.body.appendChild(divug);
			}
			console.log(log);
			divug.innerHTML += log + "<br>";
		}
	}

	var _this = this;
	this.params = {
		axis: 			"x",
		doubleAxis: 	false,
		ease: 			Linear.easeInOut,
		extras: 		null, 
		keepLimits: 	true, 
		links: 			null,
		padd: 			true,
		sections: 		null,
		selected: 		"selected", 
		slides: 		null,
		speed: 			0.5,
	}
	for(var o in options){
		this.params[o] = options[o];
	}
	this.lastScroll = 0;
	this.size = {w:0,h:0};
	this.step = -1;
	this.sens = null;

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
	var scroll = {
		first: this.params.sections[0],
		last: this.params.sections[this.params.sections.length-1],
		maxSize: 0
	};

	this.window = {
		width: function(){
			var w = (window.innerWidth) ? window.innerWidth : document.body.clientWidth;
			if(!w) w = (window.screen.width) ? window.screen.width : window.outerWidth;
			if(!w) w = window.screen.availWidth;
			return w;
		},
		height: function(){
			var h = (window.innerHeight) ? window.innerHeight : document.body.clientHeight;
			if(!h) h = (window.screen.height) ? window.screen.height : window.outerHeight;
			if(!h) h = window.screen.availHeight;
			return h;
		}
	}

	this.init = function(){
		this.size = {w:scroll.first.offsetWidth, h:scroll.first.offsetHeight};

		for(var i=0; i<this.params.sections.length; i++){
			scroll.maxSize += this.params.sections[i][pos.size];
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

		if(this.params.padd){
			if(scroll.maxSize < scroll.last[pos.start]){
				var	add = scroll.first[pos.start]+scroll.last[pos.start]-scroll.maxSize;
				scroll.last.style[pos.style] = scroll.last[pos.size]+add+"px";
			}
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
		for(var x in this.params.extras){
			if(typeof this.params.extras[x] == 'function') this.params.extras[x](el,_this);
		}

		var changed = false;
		for(var s in this.params.sections){
			if(el[pos.scroll] >= this.params.sections[s][pos.start] && el[pos.scroll] <= (this.params.sections[s][pos.start]+this.params.sections[s][pos.size])){
				this.step = parseInt(s);
				this.size = {w: this.params.sections[this.step].offsetWidth, h:this.params.sections[this.step].offsetHeight};
			};
		}
		
		var limit = 0;
		if(el[pos.scroll]<scroll.first[pos.start]) limit = -1;
		if(el[pos.scroll]>scroll.last[pos.start]) limit = this.params.sections;

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
			if(_this.params.sections[step]) _this.size = {w: _this.params.sections[step].offsetWidth, h:_this.params.sections[step].offsetHeight};
			_this.debug(_this.params.sections[0].offsetWidth);
		}
		window.onscroll = function(e){
	        _this.sens = (this[pos.scroll]>_this.lastScroll);
	        _this.switch(this);
	        _this.lastScroll = this[pos.scroll];
	    }
	}

	this.tween = function(el){
		if(this.params.doubleAxis){
			TweenLite.to(window, this.params.speed, {scrollTo:{x:el.offsetLeft,y:el.offsetTop}, ease:this.ease});
		}else{
			if(this.params.axis=="x"){
				TweenLite.to(window, this.params.speed, {scrollTo:{x:el.offsetLeft}, ease:this.ease});
			}else{
				TweenLite.to(window, this.params.speed, {scrollTo:{y:el.offsetTop}, ease:this.ease});
			}
		}
	}
};