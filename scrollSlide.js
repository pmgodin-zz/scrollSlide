/*
*
*	scrollSlide: 	Mostly native javascript scroll animated slide show.
*	by: 			Pierre-Michel Morais-Godin, 2013
*	github: 		https://github.com/pmgodin/scrollSlide
*	
*	Using greensock tween for animation - http://www.greensock.com/tweenlite/
*	Using history.js for navigation - https://github.com/balupton/History.js
*	Using iScroll for mobile scroll support - https://github.com/cubiq/iscroll
*
*/
var slideScroll = function(options){
	var _arguments = arguments;
	this.log = function(log){
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
			console.dir(log);
			divug.innerHTML += log + "<br>";
		}
	}

	var _this = this;
	this.params = {
		axis: 			"x",
		doubleAxis: 	false,
		ease: 			(typeof Linear != "undefined") ? Linear.easeInOut : null,
		extras: 		null, 
		keepLimits: 	true, 
		links: 			null,
		mobile:      	false,
		padd: 			true,
		scrollOn: 		window,
		sections: 		null,
		selected: 		"selected", 
		slides: 		null,
		snap: 			false,
		speed: 			0.5
	}

	for(var o in options){
		this.params[o] = options[o];
	}

	this.lastScroll = 0;
	this.size = {w:0,h:0};
	this.step = -1;
	this.foward = null;
	this.scrolling = false;
	var progress = -1;
	this.progress = progress;

	var pos = {
		scroll: "scrollX",
		start:  "offsetLeft",
		size: 	"offsetWidth",
		style: 	"width"
	}
	if(!this.params.scrollOn[pos.scroll]) pos.scroll = "scrollLeft";
	if(this.params.axis=="y"){
		pos = {
			scroll: "scrollY",
			start:  "offsetTop",
			size: 	"offsetHeight",
			style: 	"height"
		}
		if(!this.params.scrollOn[pos.scroll]) pos.scroll = "scrollTop";
	}
	this.scroll = {
		current: this.params.sections[0],
		first: this.params.sections[0],
		last: this.params.sections[this.params.sections.length-1],
		maxSize: 0,
		pos: 0
	};

	if(this.params.mobile && (typeof Touch == "object" || this.params.mobile=="force")){
		/* help viewport width to be calculed has expected */
    	if (navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPad/i)) {
		    var viewportmeta = document.querySelector('meta[name="viewport"]');
		    if (viewportmeta) {
		        viewportmeta.content = 'width=device-width, minimum-scale=1.0, maximum-scale=1.0, initial-scale=1.0';
		        document.body.addEventListener('gesturestart', function () {
		            viewportmeta.content = 'width=device-width, minimum-scale=0.25, maximum-scale=1.6';
		        }, false);
		    }
		}
		/* add iScroll for mobile if exists */
		if(typeof iScroll == "function"){
			var iScrollOptions = {};
			if(_this.params.snap) iScrollOptions.snap = _this.params.sections;
			iScrollOptions.onScrollEnd = function(){
				_this.scroll.pos = (_this.params.axis == "x") ? Math.abs(_this.params.mobile.x) : Math.abs(_this.params.mobile.y);
				_this.switch();
			}

			function loaded() {
			    _this.params.mobile = new iScroll(_this.params.scrollOn,iScrollOptions);
			    var proto = Object.getPrototypeOf(_this.params.mobile) || 
			    	_this.params.mobile.__proto__ ||
			    	_this.params.mobile.constructor.prototype;

			    proto._startAni = function () {
					var m = Math,
						that = this,
						startX = that.x, startY = that.y,
						startTime = Date.now(),
						step, easeOut,
						animate,
						nextFrame = (function() {
							return window.requestAnimationFrame ||
								window.webkitRequestAnimationFrame ||
								window.mozRequestAnimationFrame ||
								window.oRequestAnimationFrame ||
								window.msRequestAnimationFrame ||
								function(callback) { return setTimeout(callback, 1); };
						})(),
						cancelFrame = (function () {
							return window.cancelRequestAnimationFrame ||
								window.webkitCancelAnimationFrame ||
								window.webkitCancelRequestAnimationFrame ||
								window.mozCancelRequestAnimationFrame ||
								window.oCancelRequestAnimationFrame ||
								window.msCancelRequestAnimationFrame ||
								clearTimeout;
						})();

					if (that.animating) return;
					
					if (!that.steps.length) {
						that._resetPos(400);
						return;
					}
					
					step = that.steps.shift();
					
					if (step.x == startX && step.y == startY) step.time = 0;

					that.animating = true;
					that.moved = true;
					
					if (that.options.useTransition) {
						that._transitionTime(step.time);
						that._pos(step.x, step.y);
						that.animating = false;
						if (step.time) that._bind(TRNEND_EV);
						else that._resetPos(0);
						return;
					}

					animate = function () {
						var now = Date.now(),
							newX, newY;

						if (now >= startTime + step.time) {
							that._pos(step.x, step.y);
							that.animating = false;
							if (that.options.onAnimationEnd) that.options.onAnimationEnd.call(that);			// Execute custom code on animation end
							that._startAni();
							return;
						}

						now = (now - startTime) / step.time - 1;
						easeOut = m.sqrt(1 - now * now);
						newX = (step.x - startX) * easeOut + startX;
						newY = (step.y - startY) * easeOut + startY;
						that._pos(newX, newY);
						_this.scroll.pos = (_this.params.axis == "x") ? Math.abs(_this.params.mobile.x) : Math.abs(_this.params.mobile.y);
						_this.switch();
						if (that.animating){
							that.aniTime = nextFrame(animate);
						}
					};

					animate();
				};
			}
			document.addEventListener('touchmove', function (e) { 
				e.preventDefault();
				_this.scroll.pos = (_this.params.axis == "x") ? Math.abs(_this.params.mobile.x) : Math.abs(_this.params.mobile.y);
				_this.switch();
			}, false);
	       	document.addEventListener('DOMContentLoaded', loaded, false);
	    }else{
	    	this.params.mobile = false;
	    }
	}else{
	    this.params.mobile = false;
	}
	if(!this.params.mobile){
		this.params.scrollOn.onscroll = function(e){
	        _this.scroll.pos = this[pos.scroll];
		    _this.switch();
	    }
	}

	this.window = {
		width: function(){
			return window.innerWidth || 
				document.body.clientWidth ||
				window.screen.width ||
				window.outerWidth ||
				window.screen.availWidth;
		},
		height: function(){
			return window.innerHeight ||
				document.body.clientHeight ||
				window.screen.height ||
				window.outerHeight || 
				window.screen.availHeight;
		}
	}

	this.init = function(){
		this.size = {w:_this.scroll.first.offsetWidth, h:_this.scroll.first.offsetHeight};

		for(var i=0; i<this.params.sections.length; i++){
			_this.scroll.maxSize += this.params.sections[i][pos.size];
			if(_this.params.links[i]){
				_this.params.links[i].href = "#"+i;
				_this.params.links[i].onclick = function(){
					var index = this.href.split("#")[1];
					_this.tween(index);
					return false;
				}
			}
		}

		if(this.params.padd){
			if(_this.scroll.maxSize < _this.scroll.last[pos.start]){
				var	add = _this.scroll.first[pos.start]+_this.scroll.last[pos.start]-_this.scroll.maxSize;
				_this.scroll.last.style[pos.style] = _this.scroll.last[pos.size]+add+"px";
			}
		}

		// auto select slide onload
		_this.scroll.pos = _this.params.scrollOn[pos.scroll];
		_this.switch();
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

	this.switch = function(){
		_this.foward = (_this.scroll.pos>_this.lastScroll);

		for(var x in this.params.extras){
			if(typeof this.params.extras[x] == 'function') this.params.extras[x](el,_this);
		}

		for(var s in this.params.sections){
			if(this.scroll.pos >= this.params.sections[s][pos.start] && this.scroll.pos <= (this.params.sections[s][pos.start]+this.params.sections[s][pos.size])){
				this.step = parseInt(s);
				this.scroll.current = this.params.sections[this.step];
				this.size = {w: this.scroll.current.offsetWidth, h: this.scroll.current.offsetHeight};
			};
		}
		
		var limit = 0;
		if(this.scroll.pos<this.scroll.first[pos.start]) limit = -1;
		if(this.scroll.pos>this.scroll.last[pos.start]) limit = this.params.sections;

		var cur = (limit==-1) ? -1 : this.step+1;
		var next = (limit==-1) ? 0 : this.step;

		if(limit==0){
			this.classes(this.step);
		}else{
			this.classes(limit);
		}
		if(!this.params.keepLimits) limit = 0;
		
		if(limit==0 && this.params.slides && this.scroll.current){
			progress = Number(Math.abs(1-((this.scroll.current[pos.start]+this.scroll.current[pos.size])-this.scroll.pos)/this.scroll.current[pos.size]).toFixed(1));
			if(this.progress != progress){
				this.progress = progress;
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
		}

		_this.lastScroll = _this.scroll.pos;
	}

	this.tween = function(index){
		var el = this.params.sections[index];
		this.classes(index);
		if(this.params.mobile){
			this.params.mobile.scrollToElement(el, (this.params.speed*1000));
		}else{
			if(typeof TweenLite == "function"){
				if(this.params.doubleAxis){
					TweenLite.to(this.params.scrollOn, this.params.speed, {scrollTo:{x:el.offsetLeft,y:el.offsetTop}, ease:this.ease});
				}else{
					if(this.params.axis=="x"){
						TweenLite.to(this.params.scrollOn, this.params.speed, {scrollTo:{x:el.offsetLeft}, ease:this.ease});
					}else{
						TweenLite.to(this.params.scrollOn, this.params.speed, {scrollTo:{y:el.offsetTop}, ease:this.ease});
					}
				}
			}else{
				console.log("Please add TweenLite – A Lightweight, FAST Tweening Engine - http://www.greensock.com/tweenlite/");
			}
		}
	}

	var _resize = window.onresize;
	window.onresize = function(e){
		if(typeof _resize == "function") _resize(e);
		if(_this.scroll.current) _this.size = {w: _this.scroll.current.offsetWidth, h:_this.scroll.current.offsetHeight};
	}
};