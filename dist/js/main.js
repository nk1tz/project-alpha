(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
// shim for using process in browser

var process = module.exports = {};
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = setTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    clearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        setTimeout(drainQueue, 0);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],2:[function(require,module,exports){
/*!
 * Chart.js
 * http://chartjs.org/
 * Version: 1.0.2
 *
 * Copyright 2015 Nick Downie
 * Released under the MIT license
 * https://github.com/nnnick/Chart.js/blob/master/LICENSE.md
 */


(function(){

	"use strict";

	//Declare root variable - window in the browser, global on the server
	var root = this,
		previous = root.Chart;

	//Occupy the global variable of Chart, and create a simple base class
	var Chart = function(context){
		var chart = this;
		this.canvas = context.canvas;

		this.ctx = context;

		//Variables global to the chart
		var computeDimension = function(element,dimension)
		{
			if (element['offset'+dimension])
			{
				return element['offset'+dimension];
			}
			else
			{
				return document.defaultView.getComputedStyle(element).getPropertyValue(dimension);
			}
		}

		var width = this.width = computeDimension(context.canvas,'Width');
		var height = this.height = computeDimension(context.canvas,'Height');

		// Firefox requires this to work correctly
		context.canvas.width  = width;
		context.canvas.height = height;

		var width = this.width = context.canvas.width;
		var height = this.height = context.canvas.height;
		this.aspectRatio = this.width / this.height;
		//High pixel density displays - multiply the size of the canvas height/width by the device pixel ratio, then scale.
		helpers.retinaScale(this);

		return this;
	};
	//Globally expose the defaults to allow for user updating/changing
	Chart.defaults = {
		global: {
			// Boolean - Whether to animate the chart
			animation: true,

			// Number - Number of animation steps
			animationSteps: 60,

			// String - Animation easing effect
			animationEasing: "easeOutQuart",

			// Boolean - If we should show the scale at all
			showScale: true,

			// Boolean - If we want to override with a hard coded scale
			scaleOverride: false,

			// ** Required if scaleOverride is true **
			// Number - The number of steps in a hard coded scale
			scaleSteps: null,
			// Number - The value jump in the hard coded scale
			scaleStepWidth: null,
			// Number - The scale starting value
			scaleStartValue: null,

			// String - Colour of the scale line
			scaleLineColor: "rgba(0,0,0,.1)",

			// Number - Pixel width of the scale line
			scaleLineWidth: 1,

			// Boolean - Whether to show labels on the scale
			scaleShowLabels: true,

			// Interpolated JS string - can access value
			scaleLabel: "<%=value%>",

			// Boolean - Whether the scale should stick to integers, and not show any floats even if drawing space is there
			scaleIntegersOnly: true,

			// Boolean - Whether the scale should start at zero, or an order of magnitude down from the lowest value
			scaleBeginAtZero: false,

			// String - Scale label font declaration for the scale label
			scaleFontFamily: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",

			// Number - Scale label font size in pixels
			scaleFontSize: 12,

			// String - Scale label font weight style
			scaleFontStyle: "normal",

			// String - Scale label font colour
			scaleFontColor: "#666",

			// Boolean - whether or not the chart should be responsive and resize when the browser does.
			responsive: false,

			// Boolean - whether to maintain the starting aspect ratio or not when responsive, if set to false, will take up entire container
			maintainAspectRatio: true,

			// Boolean - Determines whether to draw tooltips on the canvas or not - attaches events to touchmove & mousemove
			showTooltips: true,

			// Boolean - Determines whether to draw built-in tooltip or call custom tooltip function
			customTooltips: false,

			// Array - Array of string names to attach tooltip events
			tooltipEvents: ["mousemove", "touchstart", "touchmove", "mouseout"],

			// String - Tooltip background colour
			tooltipFillColor: "rgba(0,0,0,0.8)",

			// String - Tooltip label font declaration for the scale label
			tooltipFontFamily: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",

			// Number - Tooltip label font size in pixels
			tooltipFontSize: 14,

			// String - Tooltip font weight style
			tooltipFontStyle: "normal",

			// String - Tooltip label font colour
			tooltipFontColor: "#fff",

			// String - Tooltip title font declaration for the scale label
			tooltipTitleFontFamily: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",

			// Number - Tooltip title font size in pixels
			tooltipTitleFontSize: 14,

			// String - Tooltip title font weight style
			tooltipTitleFontStyle: "bold",

			// String - Tooltip title font colour
			tooltipTitleFontColor: "#fff",

			// Number - pixel width of padding around tooltip text
			tooltipYPadding: 6,

			// Number - pixel width of padding around tooltip text
			tooltipXPadding: 6,

			// Number - Size of the caret on the tooltip
			tooltipCaretSize: 8,

			// Number - Pixel radius of the tooltip border
			tooltipCornerRadius: 6,

			// Number - Pixel offset from point x to tooltip edge
			tooltipXOffset: 10,

			// String - Template string for single tooltips
			tooltipTemplate: "<%if (label){%><%=label%>: <%}%><%= value %>",

			// String - Template string for single tooltips
			multiTooltipTemplate: "<%= value %>",

			// String - Colour behind the legend colour block
			multiTooltipKeyBackground: '#fff',

			// Function - Will fire on animation progression.
			onAnimationProgress: function(){},

			// Function - Will fire on animation completion.
			onAnimationComplete: function(){}

		}
	};

	//Create a dictionary of chart types, to allow for extension of existing types
	Chart.types = {};

	//Global Chart helpers object for utility methods and classes
	var helpers = Chart.helpers = {};

		//-- Basic js utility methods
	var each = helpers.each = function(loopable,callback,self){
			var additionalArgs = Array.prototype.slice.call(arguments, 3);
			// Check to see if null or undefined firstly.
			if (loopable){
				if (loopable.length === +loopable.length){
					var i;
					for (i=0; i<loopable.length; i++){
						callback.apply(self,[loopable[i], i].concat(additionalArgs));
					}
				}
				else{
					for (var item in loopable){
						callback.apply(self,[loopable[item],item].concat(additionalArgs));
					}
				}
			}
		},
		clone = helpers.clone = function(obj){
			var objClone = {};
			each(obj,function(value,key){
				if (obj.hasOwnProperty(key)) objClone[key] = value;
			});
			return objClone;
		},
		extend = helpers.extend = function(base){
			each(Array.prototype.slice.call(arguments,1), function(extensionObject) {
				each(extensionObject,function(value,key){
					if (extensionObject.hasOwnProperty(key)) base[key] = value;
				});
			});
			return base;
		},
		merge = helpers.merge = function(base,master){
			//Merge properties in left object over to a shallow clone of object right.
			var args = Array.prototype.slice.call(arguments,0);
			args.unshift({});
			return extend.apply(null, args);
		},
		indexOf = helpers.indexOf = function(arrayToSearch, item){
			if (Array.prototype.indexOf) {
				return arrayToSearch.indexOf(item);
			}
			else{
				for (var i = 0; i < arrayToSearch.length; i++) {
					if (arrayToSearch[i] === item) return i;
				}
				return -1;
			}
		},
		where = helpers.where = function(collection, filterCallback){
			var filtered = [];

			helpers.each(collection, function(item){
				if (filterCallback(item)){
					filtered.push(item);
				}
			});

			return filtered;
		},
		findNextWhere = helpers.findNextWhere = function(arrayToSearch, filterCallback, startIndex){
			// Default to start of the array
			if (!startIndex){
				startIndex = -1;
			}
			for (var i = startIndex + 1; i < arrayToSearch.length; i++) {
				var currentItem = arrayToSearch[i];
				if (filterCallback(currentItem)){
					return currentItem;
				}
			}
		},
		findPreviousWhere = helpers.findPreviousWhere = function(arrayToSearch, filterCallback, startIndex){
			// Default to end of the array
			if (!startIndex){
				startIndex = arrayToSearch.length;
			}
			for (var i = startIndex - 1; i >= 0; i--) {
				var currentItem = arrayToSearch[i];
				if (filterCallback(currentItem)){
					return currentItem;
				}
			}
		},
		inherits = helpers.inherits = function(extensions){
			//Basic javascript inheritance based on the model created in Backbone.js
			var parent = this;
			var ChartElement = (extensions && extensions.hasOwnProperty("constructor")) ? extensions.constructor : function(){ return parent.apply(this, arguments); };

			var Surrogate = function(){ this.constructor = ChartElement;};
			Surrogate.prototype = parent.prototype;
			ChartElement.prototype = new Surrogate();

			ChartElement.extend = inherits;

			if (extensions) extend(ChartElement.prototype, extensions);

			ChartElement.__super__ = parent.prototype;

			return ChartElement;
		},
		noop = helpers.noop = function(){},
		uid = helpers.uid = (function(){
			var id=0;
			return function(){
				return "chart-" + id++;
			};
		})(),
		warn = helpers.warn = function(str){
			//Method for warning of errors
			if (window.console && typeof window.console.warn == "function") console.warn(str);
		},
		amd = helpers.amd = (typeof define == 'function' && define.amd),
		//-- Math methods
		isNumber = helpers.isNumber = function(n){
			return !isNaN(parseFloat(n)) && isFinite(n);
		},
		max = helpers.max = function(array){
			return Math.max.apply( Math, array );
		},
		min = helpers.min = function(array){
			return Math.min.apply( Math, array );
		},
		cap = helpers.cap = function(valueToCap,maxValue,minValue){
			if(isNumber(maxValue)) {
				if( valueToCap > maxValue ) {
					return maxValue;
				}
			}
			else if(isNumber(minValue)){
				if ( valueToCap < minValue ){
					return minValue;
				}
			}
			return valueToCap;
		},
		getDecimalPlaces = helpers.getDecimalPlaces = function(num){
			if (num%1!==0 && isNumber(num)){
				return num.toString().split(".")[1].length;
			}
			else {
				return 0;
			}
		},
		toRadians = helpers.radians = function(degrees){
			return degrees * (Math.PI/180);
		},
		// Gets the angle from vertical upright to the point about a centre.
		getAngleFromPoint = helpers.getAngleFromPoint = function(centrePoint, anglePoint){
			var distanceFromXCenter = anglePoint.x - centrePoint.x,
				distanceFromYCenter = anglePoint.y - centrePoint.y,
				radialDistanceFromCenter = Math.sqrt( distanceFromXCenter * distanceFromXCenter + distanceFromYCenter * distanceFromYCenter);


			var angle = Math.PI * 2 + Math.atan2(distanceFromYCenter, distanceFromXCenter);

			//If the segment is in the top left quadrant, we need to add another rotation to the angle
			if (distanceFromXCenter < 0 && distanceFromYCenter < 0){
				angle += Math.PI*2;
			}

			return {
				angle: angle,
				distance: radialDistanceFromCenter
			};
		},
		aliasPixel = helpers.aliasPixel = function(pixelWidth){
			return (pixelWidth % 2 === 0) ? 0 : 0.5;
		},
		splineCurve = helpers.splineCurve = function(FirstPoint,MiddlePoint,AfterPoint,t){
			//Props to Rob Spencer at scaled innovation for his post on splining between points
			//http://scaledinnovation.com/analytics/splines/aboutSplines.html
			var d01=Math.sqrt(Math.pow(MiddlePoint.x-FirstPoint.x,2)+Math.pow(MiddlePoint.y-FirstPoint.y,2)),
				d12=Math.sqrt(Math.pow(AfterPoint.x-MiddlePoint.x,2)+Math.pow(AfterPoint.y-MiddlePoint.y,2)),
				fa=t*d01/(d01+d12),// scaling factor for triangle Ta
				fb=t*d12/(d01+d12);
			return {
				inner : {
					x : MiddlePoint.x-fa*(AfterPoint.x-FirstPoint.x),
					y : MiddlePoint.y-fa*(AfterPoint.y-FirstPoint.y)
				},
				outer : {
					x: MiddlePoint.x+fb*(AfterPoint.x-FirstPoint.x),
					y : MiddlePoint.y+fb*(AfterPoint.y-FirstPoint.y)
				}
			};
		},
		calculateOrderOfMagnitude = helpers.calculateOrderOfMagnitude = function(val){
			return Math.floor(Math.log(val) / Math.LN10);
		},
		calculateScaleRange = helpers.calculateScaleRange = function(valuesArray, drawingSize, textSize, startFromZero, integersOnly){

			//Set a minimum step of two - a point at the top of the graph, and a point at the base
			var minSteps = 2,
				maxSteps = Math.floor(drawingSize/(textSize * 1.5)),
				skipFitting = (minSteps >= maxSteps);

			var maxValue = max(valuesArray),
				minValue = min(valuesArray);

			// We need some degree of seperation here to calculate the scales if all the values are the same
			// Adding/minusing 0.5 will give us a range of 1.
			if (maxValue === minValue){
				maxValue += 0.5;
				// So we don't end up with a graph with a negative start value if we've said always start from zero
				if (minValue >= 0.5 && !startFromZero){
					minValue -= 0.5;
				}
				else{
					// Make up a whole number above the values
					maxValue += 0.5;
				}
			}

			var	valueRange = Math.abs(maxValue - minValue),
				rangeOrderOfMagnitude = calculateOrderOfMagnitude(valueRange),
				graphMax = Math.ceil(maxValue / (1 * Math.pow(10, rangeOrderOfMagnitude))) * Math.pow(10, rangeOrderOfMagnitude),
				graphMin = (startFromZero) ? 0 : Math.floor(minValue / (1 * Math.pow(10, rangeOrderOfMagnitude))) * Math.pow(10, rangeOrderOfMagnitude),
				graphRange = graphMax - graphMin,
				stepValue = Math.pow(10, rangeOrderOfMagnitude),
				numberOfSteps = Math.round(graphRange / stepValue);

			//If we have more space on the graph we'll use it to give more definition to the data
			while((numberOfSteps > maxSteps || (numberOfSteps * 2) < maxSteps) && !skipFitting) {
				if(numberOfSteps > maxSteps){
					stepValue *=2;
					numberOfSteps = Math.round(graphRange/stepValue);
					// Don't ever deal with a decimal number of steps - cancel fitting and just use the minimum number of steps.
					if (numberOfSteps % 1 !== 0){
						skipFitting = true;
					}
				}
				//We can fit in double the amount of scale points on the scale
				else{
					//If user has declared ints only, and the step value isn't a decimal
					if (integersOnly && rangeOrderOfMagnitude >= 0){
						//If the user has said integers only, we need to check that making the scale more granular wouldn't make it a float
						if(stepValue/2 % 1 === 0){
							stepValue /=2;
							numberOfSteps = Math.round(graphRange/stepValue);
						}
						//If it would make it a float break out of the loop
						else{
							break;
						}
					}
					//If the scale doesn't have to be an int, make the scale more granular anyway.
					else{
						stepValue /=2;
						numberOfSteps = Math.round(graphRange/stepValue);
					}

				}
			}

			if (skipFitting){
				numberOfSteps = minSteps;
				stepValue = graphRange / numberOfSteps;
			}

			return {
				steps : numberOfSteps,
				stepValue : stepValue,
				min : graphMin,
				max	: graphMin + (numberOfSteps * stepValue)
			};

		},
		/* jshint ignore:start */
		// Blows up jshint errors based on the new Function constructor
		//Templating methods
		//Javascript micro templating by John Resig - source at http://ejohn.org/blog/javascript-micro-templating/
		template = helpers.template = function(templateString, valuesObject){

			// If templateString is function rather than string-template - call the function for valuesObject

			if(templateString instanceof Function){
			 	return templateString(valuesObject);
		 	}

			var cache = {};
			function tmpl(str, data){
				// Figure out if we're getting a template, or if we need to
				// load the template - and be sure to cache the result.
				var fn = !/\W/.test(str) ?
				cache[str] = cache[str] :

				// Generate a reusable function that will serve as a template
				// generator (and which will be cached).
				new Function("obj",
					"var p=[],print=function(){p.push.apply(p,arguments);};" +

					// Introduce the data as local variables using with(){}
					"with(obj){p.push('" +

					// Convert the template into pure JavaScript
					str
						.replace(/[\r\t\n]/g, " ")
						.split("<%").join("\t")
						.replace(/((^|%>)[^\t]*)'/g, "$1\r")
						.replace(/\t=(.*?)%>/g, "',$1,'")
						.split("\t").join("');")
						.split("%>").join("p.push('")
						.split("\r").join("\\'") +
					"');}return p.join('');"
				);

				// Provide some basic currying to the user
				return data ? fn( data ) : fn;
			}
			return tmpl(templateString,valuesObject);
		},
		/* jshint ignore:end */
		generateLabels = helpers.generateLabels = function(templateString,numberOfSteps,graphMin,stepValue){
			var labelsArray = new Array(numberOfSteps);
			if (labelTemplateString){
				each(labelsArray,function(val,index){
					labelsArray[index] = template(templateString,{value: (graphMin + (stepValue*(index+1)))});
				});
			}
			return labelsArray;
		},
		//--Animation methods
		//Easing functions adapted from Robert Penner's easing equations
		//http://www.robertpenner.com/easing/
		easingEffects = helpers.easingEffects = {
			linear: function (t) {
				return t;
			},
			easeInQuad: function (t) {
				return t * t;
			},
			easeOutQuad: function (t) {
				return -1 * t * (t - 2);
			},
			easeInOutQuad: function (t) {
				if ((t /= 1 / 2) < 1) return 1 / 2 * t * t;
				return -1 / 2 * ((--t) * (t - 2) - 1);
			},
			easeInCubic: function (t) {
				return t * t * t;
			},
			easeOutCubic: function (t) {
				return 1 * ((t = t / 1 - 1) * t * t + 1);
			},
			easeInOutCubic: function (t) {
				if ((t /= 1 / 2) < 1) return 1 / 2 * t * t * t;
				return 1 / 2 * ((t -= 2) * t * t + 2);
			},
			easeInQuart: function (t) {
				return t * t * t * t;
			},
			easeOutQuart: function (t) {
				return -1 * ((t = t / 1 - 1) * t * t * t - 1);
			},
			easeInOutQuart: function (t) {
				if ((t /= 1 / 2) < 1) return 1 / 2 * t * t * t * t;
				return -1 / 2 * ((t -= 2) * t * t * t - 2);
			},
			easeInQuint: function (t) {
				return 1 * (t /= 1) * t * t * t * t;
			},
			easeOutQuint: function (t) {
				return 1 * ((t = t / 1 - 1) * t * t * t * t + 1);
			},
			easeInOutQuint: function (t) {
				if ((t /= 1 / 2) < 1) return 1 / 2 * t * t * t * t * t;
				return 1 / 2 * ((t -= 2) * t * t * t * t + 2);
			},
			easeInSine: function (t) {
				return -1 * Math.cos(t / 1 * (Math.PI / 2)) + 1;
			},
			easeOutSine: function (t) {
				return 1 * Math.sin(t / 1 * (Math.PI / 2));
			},
			easeInOutSine: function (t) {
				return -1 / 2 * (Math.cos(Math.PI * t / 1) - 1);
			},
			easeInExpo: function (t) {
				return (t === 0) ? 1 : 1 * Math.pow(2, 10 * (t / 1 - 1));
			},
			easeOutExpo: function (t) {
				return (t === 1) ? 1 : 1 * (-Math.pow(2, -10 * t / 1) + 1);
			},
			easeInOutExpo: function (t) {
				if (t === 0) return 0;
				if (t === 1) return 1;
				if ((t /= 1 / 2) < 1) return 1 / 2 * Math.pow(2, 10 * (t - 1));
				return 1 / 2 * (-Math.pow(2, -10 * --t) + 2);
			},
			easeInCirc: function (t) {
				if (t >= 1) return t;
				return -1 * (Math.sqrt(1 - (t /= 1) * t) - 1);
			},
			easeOutCirc: function (t) {
				return 1 * Math.sqrt(1 - (t = t / 1 - 1) * t);
			},
			easeInOutCirc: function (t) {
				if ((t /= 1 / 2) < 1) return -1 / 2 * (Math.sqrt(1 - t * t) - 1);
				return 1 / 2 * (Math.sqrt(1 - (t -= 2) * t) + 1);
			},
			easeInElastic: function (t) {
				var s = 1.70158;
				var p = 0;
				var a = 1;
				if (t === 0) return 0;
				if ((t /= 1) == 1) return 1;
				if (!p) p = 1 * 0.3;
				if (a < Math.abs(1)) {
					a = 1;
					s = p / 4;
				} else s = p / (2 * Math.PI) * Math.asin(1 / a);
				return -(a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * 1 - s) * (2 * Math.PI) / p));
			},
			easeOutElastic: function (t) {
				var s = 1.70158;
				var p = 0;
				var a = 1;
				if (t === 0) return 0;
				if ((t /= 1) == 1) return 1;
				if (!p) p = 1 * 0.3;
				if (a < Math.abs(1)) {
					a = 1;
					s = p / 4;
				} else s = p / (2 * Math.PI) * Math.asin(1 / a);
				return a * Math.pow(2, -10 * t) * Math.sin((t * 1 - s) * (2 * Math.PI) / p) + 1;
			},
			easeInOutElastic: function (t) {
				var s = 1.70158;
				var p = 0;
				var a = 1;
				if (t === 0) return 0;
				if ((t /= 1 / 2) == 2) return 1;
				if (!p) p = 1 * (0.3 * 1.5);
				if (a < Math.abs(1)) {
					a = 1;
					s = p / 4;
				} else s = p / (2 * Math.PI) * Math.asin(1 / a);
				if (t < 1) return -0.5 * (a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * 1 - s) * (2 * Math.PI) / p));
				return a * Math.pow(2, -10 * (t -= 1)) * Math.sin((t * 1 - s) * (2 * Math.PI) / p) * 0.5 + 1;
			},
			easeInBack: function (t) {
				var s = 1.70158;
				return 1 * (t /= 1) * t * ((s + 1) * t - s);
			},
			easeOutBack: function (t) {
				var s = 1.70158;
				return 1 * ((t = t / 1 - 1) * t * ((s + 1) * t + s) + 1);
			},
			easeInOutBack: function (t) {
				var s = 1.70158;
				if ((t /= 1 / 2) < 1) return 1 / 2 * (t * t * (((s *= (1.525)) + 1) * t - s));
				return 1 / 2 * ((t -= 2) * t * (((s *= (1.525)) + 1) * t + s) + 2);
			},
			easeInBounce: function (t) {
				return 1 - easingEffects.easeOutBounce(1 - t);
			},
			easeOutBounce: function (t) {
				if ((t /= 1) < (1 / 2.75)) {
					return 1 * (7.5625 * t * t);
				} else if (t < (2 / 2.75)) {
					return 1 * (7.5625 * (t -= (1.5 / 2.75)) * t + 0.75);
				} else if (t < (2.5 / 2.75)) {
					return 1 * (7.5625 * (t -= (2.25 / 2.75)) * t + 0.9375);
				} else {
					return 1 * (7.5625 * (t -= (2.625 / 2.75)) * t + 0.984375);
				}
			},
			easeInOutBounce: function (t) {
				if (t < 1 / 2) return easingEffects.easeInBounce(t * 2) * 0.5;
				return easingEffects.easeOutBounce(t * 2 - 1) * 0.5 + 1 * 0.5;
			}
		},
		//Request animation polyfill - http://www.paulirish.com/2011/requestanimationframe-for-smart-animating/
		requestAnimFrame = helpers.requestAnimFrame = (function(){
			return window.requestAnimationFrame ||
				window.webkitRequestAnimationFrame ||
				window.mozRequestAnimationFrame ||
				window.oRequestAnimationFrame ||
				window.msRequestAnimationFrame ||
				function(callback) {
					return window.setTimeout(callback, 1000 / 60);
				};
		})(),
		cancelAnimFrame = helpers.cancelAnimFrame = (function(){
			return window.cancelAnimationFrame ||
				window.webkitCancelAnimationFrame ||
				window.mozCancelAnimationFrame ||
				window.oCancelAnimationFrame ||
				window.msCancelAnimationFrame ||
				function(callback) {
					return window.clearTimeout(callback, 1000 / 60);
				};
		})(),
		animationLoop = helpers.animationLoop = function(callback,totalSteps,easingString,onProgress,onComplete,chartInstance){

			var currentStep = 0,
				easingFunction = easingEffects[easingString] || easingEffects.linear;

			var animationFrame = function(){
				currentStep++;
				var stepDecimal = currentStep/totalSteps;
				var easeDecimal = easingFunction(stepDecimal);

				callback.call(chartInstance,easeDecimal,stepDecimal, currentStep);
				onProgress.call(chartInstance,easeDecimal,stepDecimal);
				if (currentStep < totalSteps){
					chartInstance.animationFrame = requestAnimFrame(animationFrame);
				} else{
					onComplete.apply(chartInstance);
				}
			};
			requestAnimFrame(animationFrame);
		},
		//-- DOM methods
		getRelativePosition = helpers.getRelativePosition = function(evt){
			var mouseX, mouseY;
			var e = evt.originalEvent || evt,
				canvas = evt.currentTarget || evt.srcElement,
				boundingRect = canvas.getBoundingClientRect();

			if (e.touches){
				mouseX = e.touches[0].clientX - boundingRect.left;
				mouseY = e.touches[0].clientY - boundingRect.top;

			}
			else{
				mouseX = e.clientX - boundingRect.left;
				mouseY = e.clientY - boundingRect.top;
			}

			return {
				x : mouseX,
				y : mouseY
			};

		},
		addEvent = helpers.addEvent = function(node,eventType,method){
			if (node.addEventListener){
				node.addEventListener(eventType,method);
			} else if (node.attachEvent){
				node.attachEvent("on"+eventType, method);
			} else {
				node["on"+eventType] = method;
			}
		},
		removeEvent = helpers.removeEvent = function(node, eventType, handler){
			if (node.removeEventListener){
				node.removeEventListener(eventType, handler, false);
			} else if (node.detachEvent){
				node.detachEvent("on"+eventType,handler);
			} else{
				node["on" + eventType] = noop;
			}
		},
		bindEvents = helpers.bindEvents = function(chartInstance, arrayOfEvents, handler){
			// Create the events object if it's not already present
			if (!chartInstance.events) chartInstance.events = {};

			each(arrayOfEvents,function(eventName){
				chartInstance.events[eventName] = function(){
					handler.apply(chartInstance, arguments);
				};
				addEvent(chartInstance.chart.canvas,eventName,chartInstance.events[eventName]);
			});
		},
		unbindEvents = helpers.unbindEvents = function (chartInstance, arrayOfEvents) {
			each(arrayOfEvents, function(handler,eventName){
				removeEvent(chartInstance.chart.canvas, eventName, handler);
			});
		},
		getMaximumWidth = helpers.getMaximumWidth = function(domNode){
			var container = domNode.parentNode;
			// TODO = check cross browser stuff with this.
			return container.clientWidth;
		},
		getMaximumHeight = helpers.getMaximumHeight = function(domNode){
			var container = domNode.parentNode;
			// TODO = check cross browser stuff with this.
			return container.clientHeight;
		},
		getMaximumSize = helpers.getMaximumSize = helpers.getMaximumWidth, // legacy support
		retinaScale = helpers.retinaScale = function(chart){
			var ctx = chart.ctx,
				width = chart.canvas.width,
				height = chart.canvas.height;

			if (window.devicePixelRatio) {
				ctx.canvas.style.width = width + "px";
				ctx.canvas.style.height = height + "px";
				ctx.canvas.height = height * window.devicePixelRatio;
				ctx.canvas.width = width * window.devicePixelRatio;
				ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
			}
		},
		//-- Canvas methods
		clear = helpers.clear = function(chart){
			chart.ctx.clearRect(0,0,chart.width,chart.height);
		},
		fontString = helpers.fontString = function(pixelSize,fontStyle,fontFamily){
			return fontStyle + " " + pixelSize+"px " + fontFamily;
		},
		longestText = helpers.longestText = function(ctx,font,arrayOfStrings){
			ctx.font = font;
			var longest = 0;
			each(arrayOfStrings,function(string){
				var textWidth = ctx.measureText(string).width;
				longest = (textWidth > longest) ? textWidth : longest;
			});
			return longest;
		},
		drawRoundedRectangle = helpers.drawRoundedRectangle = function(ctx,x,y,width,height,radius){
			ctx.beginPath();
			ctx.moveTo(x + radius, y);
			ctx.lineTo(x + width - radius, y);
			ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
			ctx.lineTo(x + width, y + height - radius);
			ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
			ctx.lineTo(x + radius, y + height);
			ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
			ctx.lineTo(x, y + radius);
			ctx.quadraticCurveTo(x, y, x + radius, y);
			ctx.closePath();
		};


	//Store a reference to each instance - allowing us to globally resize chart instances on window resize.
	//Destroy method on the chart will remove the instance of the chart from this reference.
	Chart.instances = {};

	Chart.Type = function(data,options,chart){
		this.options = options;
		this.chart = chart;
		this.id = uid();
		//Add the chart instance to the global namespace
		Chart.instances[this.id] = this;

		// Initialize is always called when a chart type is created
		// By default it is a no op, but it should be extended
		if (options.responsive){
			this.resize();
		}
		this.initialize.call(this,data);
	};

	//Core methods that'll be a part of every chart type
	extend(Chart.Type.prototype,{
		initialize : function(){return this;},
		clear : function(){
			clear(this.chart);
			return this;
		},
		stop : function(){
			// Stops any current animation loop occuring
			cancelAnimFrame(this.animationFrame);
			return this;
		},
		resize : function(callback){
			this.stop();
			var canvas = this.chart.canvas,
				newWidth = getMaximumWidth(this.chart.canvas),
				newHeight = this.options.maintainAspectRatio ? newWidth / this.chart.aspectRatio : getMaximumHeight(this.chart.canvas);

			canvas.width = this.chart.width = newWidth;
			canvas.height = this.chart.height = newHeight;

			retinaScale(this.chart);

			if (typeof callback === "function"){
				callback.apply(this, Array.prototype.slice.call(arguments, 1));
			}
			return this;
		},
		reflow : noop,
		render : function(reflow){
			if (reflow){
				this.reflow();
			}
			if (this.options.animation && !reflow){
				helpers.animationLoop(
					this.draw,
					this.options.animationSteps,
					this.options.animationEasing,
					this.options.onAnimationProgress,
					this.options.onAnimationComplete,
					this
				);
			}
			else{
				this.draw();
				this.options.onAnimationComplete.call(this);
			}
			return this;
		},
		generateLegend : function(){
			return template(this.options.legendTemplate,this);
		},
		destroy : function(){
			this.clear();
			unbindEvents(this, this.events);
			var canvas = this.chart.canvas;

			// Reset canvas height/width attributes starts a fresh with the canvas context
			canvas.width = this.chart.width;
			canvas.height = this.chart.height;

			// < IE9 doesn't support removeProperty
			if (canvas.style.removeProperty) {
				canvas.style.removeProperty('width');
				canvas.style.removeProperty('height');
			} else {
				canvas.style.removeAttribute('width');
				canvas.style.removeAttribute('height');
			}

			delete Chart.instances[this.id];
		},
		showTooltip : function(ChartElements, forceRedraw){
			// Only redraw the chart if we've actually changed what we're hovering on.
			if (typeof this.activeElements === 'undefined') this.activeElements = [];

			var isChanged = (function(Elements){
				var changed = false;

				if (Elements.length !== this.activeElements.length){
					changed = true;
					return changed;
				}

				each(Elements, function(element, index){
					if (element !== this.activeElements[index]){
						changed = true;
					}
				}, this);
				return changed;
			}).call(this, ChartElements);

			if (!isChanged && !forceRedraw){
				return;
			}
			else{
				this.activeElements = ChartElements;
			}
			this.draw();
			if(this.options.customTooltips){
				this.options.customTooltips(false);
			}
			if (ChartElements.length > 0){
				// If we have multiple datasets, show a MultiTooltip for all of the data points at that index
				if (this.datasets && this.datasets.length > 1) {
					var dataArray,
						dataIndex;

					for (var i = this.datasets.length - 1; i >= 0; i--) {
						dataArray = this.datasets[i].points || this.datasets[i].bars || this.datasets[i].segments;
						dataIndex = indexOf(dataArray, ChartElements[0]);
						if (dataIndex !== -1){
							break;
						}
					}
					var tooltipLabels = [],
						tooltipColors = [],
						medianPosition = (function(index) {

							// Get all the points at that particular index
							var Elements = [],
								dataCollection,
								xPositions = [],
								yPositions = [],
								xMax,
								yMax,
								xMin,
								yMin;
							helpers.each(this.datasets, function(dataset){
								dataCollection = dataset.points || dataset.bars || dataset.segments;
								if (dataCollection[dataIndex] && dataCollection[dataIndex].hasValue()){
									Elements.push(dataCollection[dataIndex]);
								}
							});

							helpers.each(Elements, function(element) {
								xPositions.push(element.x);
								yPositions.push(element.y);


								//Include any colour information about the element
								tooltipLabels.push(helpers.template(this.options.multiTooltipTemplate, element));
								tooltipColors.push({
									fill: element._saved.fillColor || element.fillColor,
									stroke: element._saved.strokeColor || element.strokeColor
								});

							}, this);

							yMin = min(yPositions);
							yMax = max(yPositions);

							xMin = min(xPositions);
							xMax = max(xPositions);

							return {
								x: (xMin > this.chart.width/2) ? xMin : xMax,
								y: (yMin + yMax)/2
							};
						}).call(this, dataIndex);

					new Chart.MultiTooltip({
						x: medianPosition.x,
						y: medianPosition.y,
						xPadding: this.options.tooltipXPadding,
						yPadding: this.options.tooltipYPadding,
						xOffset: this.options.tooltipXOffset,
						fillColor: this.options.tooltipFillColor,
						textColor: this.options.tooltipFontColor,
						fontFamily: this.options.tooltipFontFamily,
						fontStyle: this.options.tooltipFontStyle,
						fontSize: this.options.tooltipFontSize,
						titleTextColor: this.options.tooltipTitleFontColor,
						titleFontFamily: this.options.tooltipTitleFontFamily,
						titleFontStyle: this.options.tooltipTitleFontStyle,
						titleFontSize: this.options.tooltipTitleFontSize,
						cornerRadius: this.options.tooltipCornerRadius,
						labels: tooltipLabels,
						legendColors: tooltipColors,
						legendColorBackground : this.options.multiTooltipKeyBackground,
						title: ChartElements[0].label,
						chart: this.chart,
						ctx: this.chart.ctx,
						custom: this.options.customTooltips
					}).draw();

				} else {
					each(ChartElements, function(Element) {
						var tooltipPosition = Element.tooltipPosition();
						new Chart.Tooltip({
							x: Math.round(tooltipPosition.x),
							y: Math.round(tooltipPosition.y),
							xPadding: this.options.tooltipXPadding,
							yPadding: this.options.tooltipYPadding,
							fillColor: this.options.tooltipFillColor,
							textColor: this.options.tooltipFontColor,
							fontFamily: this.options.tooltipFontFamily,
							fontStyle: this.options.tooltipFontStyle,
							fontSize: this.options.tooltipFontSize,
							caretHeight: this.options.tooltipCaretSize,
							cornerRadius: this.options.tooltipCornerRadius,
							text: template(this.options.tooltipTemplate, Element),
							chart: this.chart,
							custom: this.options.customTooltips
						}).draw();
					}, this);
				}
			}
			return this;
		},
		toBase64Image : function(){
			return this.chart.canvas.toDataURL.apply(this.chart.canvas, arguments);
		}
	});

	Chart.Type.extend = function(extensions){

		var parent = this;

		var ChartType = function(){
			return parent.apply(this,arguments);
		};

		//Copy the prototype object of the this class
		ChartType.prototype = clone(parent.prototype);
		//Now overwrite some of the properties in the base class with the new extensions
		extend(ChartType.prototype, extensions);

		ChartType.extend = Chart.Type.extend;

		if (extensions.name || parent.prototype.name){

			var chartName = extensions.name || parent.prototype.name;
			//Assign any potential default values of the new chart type

			//If none are defined, we'll use a clone of the chart type this is being extended from.
			//I.e. if we extend a line chart, we'll use the defaults from the line chart if our new chart
			//doesn't define some defaults of their own.

			var baseDefaults = (Chart.defaults[parent.prototype.name]) ? clone(Chart.defaults[parent.prototype.name]) : {};

			Chart.defaults[chartName] = extend(baseDefaults,extensions.defaults);

			Chart.types[chartName] = ChartType;

			//Register this new chart type in the Chart prototype
			Chart.prototype[chartName] = function(data,options){
				var config = merge(Chart.defaults.global, Chart.defaults[chartName], options || {});
				return new ChartType(data,config,this);
			};
		} else{
			warn("Name not provided for this chart, so it hasn't been registered");
		}
		return parent;
	};

	Chart.Element = function(configuration){
		extend(this,configuration);
		this.initialize.apply(this,arguments);
		this.save();
	};
	extend(Chart.Element.prototype,{
		initialize : function(){},
		restore : function(props){
			if (!props){
				extend(this,this._saved);
			} else {
				each(props,function(key){
					this[key] = this._saved[key];
				},this);
			}
			return this;
		},
		save : function(){
			this._saved = clone(this);
			delete this._saved._saved;
			return this;
		},
		update : function(newProps){
			each(newProps,function(value,key){
				this._saved[key] = this[key];
				this[key] = value;
			},this);
			return this;
		},
		transition : function(props,ease){
			each(props,function(value,key){
				this[key] = ((value - this._saved[key]) * ease) + this._saved[key];
			},this);
			return this;
		},
		tooltipPosition : function(){
			return {
				x : this.x,
				y : this.y
			};
		},
		hasValue: function(){
			return isNumber(this.value);
		}
	});

	Chart.Element.extend = inherits;


	Chart.Point = Chart.Element.extend({
		display: true,
		inRange: function(chartX,chartY){
			var hitDetectionRange = this.hitDetectionRadius + this.radius;
			return ((Math.pow(chartX-this.x, 2)+Math.pow(chartY-this.y, 2)) < Math.pow(hitDetectionRange,2));
		},
		draw : function(){
			if (this.display){
				var ctx = this.ctx;
				ctx.beginPath();

				ctx.arc(this.x, this.y, this.radius, 0, Math.PI*2);
				ctx.closePath();

				ctx.strokeStyle = this.strokeColor;
				ctx.lineWidth = this.strokeWidth;

				ctx.fillStyle = this.fillColor;

				ctx.fill();
				ctx.stroke();
			}


			//Quick debug for bezier curve splining
			//Highlights control points and the line between them.
			//Handy for dev - stripped in the min version.

			// ctx.save();
			// ctx.fillStyle = "black";
			// ctx.strokeStyle = "black"
			// ctx.beginPath();
			// ctx.arc(this.controlPoints.inner.x,this.controlPoints.inner.y, 2, 0, Math.PI*2);
			// ctx.fill();

			// ctx.beginPath();
			// ctx.arc(this.controlPoints.outer.x,this.controlPoints.outer.y, 2, 0, Math.PI*2);
			// ctx.fill();

			// ctx.moveTo(this.controlPoints.inner.x,this.controlPoints.inner.y);
			// ctx.lineTo(this.x, this.y);
			// ctx.lineTo(this.controlPoints.outer.x,this.controlPoints.outer.y);
			// ctx.stroke();

			// ctx.restore();



		}
	});

	Chart.Arc = Chart.Element.extend({
		inRange : function(chartX,chartY){

			var pointRelativePosition = helpers.getAngleFromPoint(this, {
				x: chartX,
				y: chartY
			});

			//Check if within the range of the open/close angle
			var betweenAngles = (pointRelativePosition.angle >= this.startAngle && pointRelativePosition.angle <= this.endAngle),
				withinRadius = (pointRelativePosition.distance >= this.innerRadius && pointRelativePosition.distance <= this.outerRadius);

			return (betweenAngles && withinRadius);
			//Ensure within the outside of the arc centre, but inside arc outer
		},
		tooltipPosition : function(){
			var centreAngle = this.startAngle + ((this.endAngle - this.startAngle) / 2),
				rangeFromCentre = (this.outerRadius - this.innerRadius) / 2 + this.innerRadius;
			return {
				x : this.x + (Math.cos(centreAngle) * rangeFromCentre),
				y : this.y + (Math.sin(centreAngle) * rangeFromCentre)
			};
		},
		draw : function(animationPercent){

			var easingDecimal = animationPercent || 1;

			var ctx = this.ctx;

			ctx.beginPath();

			ctx.arc(this.x, this.y, this.outerRadius, this.startAngle, this.endAngle);

			ctx.arc(this.x, this.y, this.innerRadius, this.endAngle, this.startAngle, true);

			ctx.closePath();
			ctx.strokeStyle = this.strokeColor;
			ctx.lineWidth = this.strokeWidth;

			ctx.fillStyle = this.fillColor;

			ctx.fill();
			ctx.lineJoin = 'bevel';

			if (this.showStroke){
				ctx.stroke();
			}
		}
	});

	Chart.Rectangle = Chart.Element.extend({
		draw : function(){
			var ctx = this.ctx,
				halfWidth = this.width/2,
				leftX = this.x - halfWidth,
				rightX = this.x + halfWidth,
				top = this.base - (this.base - this.y),
				halfStroke = this.strokeWidth / 2;

			// Canvas doesn't allow us to stroke inside the width so we can
			// adjust the sizes to fit if we're setting a stroke on the line
			if (this.showStroke){
				leftX += halfStroke;
				rightX -= halfStroke;
				top += halfStroke;
			}

			ctx.beginPath();

			ctx.fillStyle = this.fillColor;
			ctx.strokeStyle = this.strokeColor;
			ctx.lineWidth = this.strokeWidth;

			// It'd be nice to keep this class totally generic to any rectangle
			// and simply specify which border to miss out.
			ctx.moveTo(leftX, this.base);
			ctx.lineTo(leftX, top);
			ctx.lineTo(rightX, top);
			ctx.lineTo(rightX, this.base);
			ctx.fill();
			if (this.showStroke){
				ctx.stroke();
			}
		},
		height : function(){
			return this.base - this.y;
		},
		inRange : function(chartX,chartY){
			return (chartX >= this.x - this.width/2 && chartX <= this.x + this.width/2) && (chartY >= this.y && chartY <= this.base);
		}
	});

	Chart.Tooltip = Chart.Element.extend({
		draw : function(){

			var ctx = this.chart.ctx;

			ctx.font = fontString(this.fontSize,this.fontStyle,this.fontFamily);

			this.xAlign = "center";
			this.yAlign = "above";

			//Distance between the actual element.y position and the start of the tooltip caret
			var caretPadding = this.caretPadding = 2;

			var tooltipWidth = ctx.measureText(this.text).width + 2*this.xPadding,
				tooltipRectHeight = this.fontSize + 2*this.yPadding,
				tooltipHeight = tooltipRectHeight + this.caretHeight + caretPadding;

			if (this.x + tooltipWidth/2 >this.chart.width){
				this.xAlign = "left";
			} else if (this.x - tooltipWidth/2 < 0){
				this.xAlign = "right";
			}

			if (this.y - tooltipHeight < 0){
				this.yAlign = "below";
			}


			var tooltipX = this.x - tooltipWidth/2,
				tooltipY = this.y - tooltipHeight;

			ctx.fillStyle = this.fillColor;

			// Custom Tooltips
			if(this.custom){
				this.custom(this);
			}
			else{
				switch(this.yAlign)
				{
				case "above":
					//Draw a caret above the x/y
					ctx.beginPath();
					ctx.moveTo(this.x,this.y - caretPadding);
					ctx.lineTo(this.x + this.caretHeight, this.y - (caretPadding + this.caretHeight));
					ctx.lineTo(this.x - this.caretHeight, this.y - (caretPadding + this.caretHeight));
					ctx.closePath();
					ctx.fill();
					break;
				case "below":
					tooltipY = this.y + caretPadding + this.caretHeight;
					//Draw a caret below the x/y
					ctx.beginPath();
					ctx.moveTo(this.x, this.y + caretPadding);
					ctx.lineTo(this.x + this.caretHeight, this.y + caretPadding + this.caretHeight);
					ctx.lineTo(this.x - this.caretHeight, this.y + caretPadding + this.caretHeight);
					ctx.closePath();
					ctx.fill();
					break;
				}

				switch(this.xAlign)
				{
				case "left":
					tooltipX = this.x - tooltipWidth + (this.cornerRadius + this.caretHeight);
					break;
				case "right":
					tooltipX = this.x - (this.cornerRadius + this.caretHeight);
					break;
				}

				drawRoundedRectangle(ctx,tooltipX,tooltipY,tooltipWidth,tooltipRectHeight,this.cornerRadius);

				ctx.fill();

				ctx.fillStyle = this.textColor;
				ctx.textAlign = "center";
				ctx.textBaseline = "middle";
				ctx.fillText(this.text, tooltipX + tooltipWidth/2, tooltipY + tooltipRectHeight/2);
			}
		}
	});

	Chart.MultiTooltip = Chart.Element.extend({
		initialize : function(){
			this.font = fontString(this.fontSize,this.fontStyle,this.fontFamily);

			this.titleFont = fontString(this.titleFontSize,this.titleFontStyle,this.titleFontFamily);

			this.height = (this.labels.length * this.fontSize) + ((this.labels.length-1) * (this.fontSize/2)) + (this.yPadding*2) + this.titleFontSize *1.5;

			this.ctx.font = this.titleFont;

			var titleWidth = this.ctx.measureText(this.title).width,
				//Label has a legend square as well so account for this.
				labelWidth = longestText(this.ctx,this.font,this.labels) + this.fontSize + 3,
				longestTextWidth = max([labelWidth,titleWidth]);

			this.width = longestTextWidth + (this.xPadding*2);


			var halfHeight = this.height/2;

			//Check to ensure the height will fit on the canvas
			if (this.y - halfHeight < 0 ){
				this.y = halfHeight;
			} else if (this.y + halfHeight > this.chart.height){
				this.y = this.chart.height - halfHeight;
			}

			//Decide whether to align left or right based on position on canvas
			if (this.x > this.chart.width/2){
				this.x -= this.xOffset + this.width;
			} else {
				this.x += this.xOffset;
			}


		},
		getLineHeight : function(index){
			var baseLineHeight = this.y - (this.height/2) + this.yPadding,
				afterTitleIndex = index-1;

			//If the index is zero, we're getting the title
			if (index === 0){
				return baseLineHeight + this.titleFontSize/2;
			} else{
				return baseLineHeight + ((this.fontSize*1.5*afterTitleIndex) + this.fontSize/2) + this.titleFontSize * 1.5;
			}

		},
		draw : function(){
			// Custom Tooltips
			if(this.custom){
				this.custom(this);
			}
			else{
				drawRoundedRectangle(this.ctx,this.x,this.y - this.height/2,this.width,this.height,this.cornerRadius);
				var ctx = this.ctx;
				ctx.fillStyle = this.fillColor;
				ctx.fill();
				ctx.closePath();

				ctx.textAlign = "left";
				ctx.textBaseline = "middle";
				ctx.fillStyle = this.titleTextColor;
				ctx.font = this.titleFont;

				ctx.fillText(this.title,this.x + this.xPadding, this.getLineHeight(0));

				ctx.font = this.font;
				helpers.each(this.labels,function(label,index){
					ctx.fillStyle = this.textColor;
					ctx.fillText(label,this.x + this.xPadding + this.fontSize + 3, this.getLineHeight(index + 1));

					//A bit gnarly, but clearing this rectangle breaks when using explorercanvas (clears whole canvas)
					//ctx.clearRect(this.x + this.xPadding, this.getLineHeight(index + 1) - this.fontSize/2, this.fontSize, this.fontSize);
					//Instead we'll make a white filled block to put the legendColour palette over.

					ctx.fillStyle = this.legendColorBackground;
					ctx.fillRect(this.x + this.xPadding, this.getLineHeight(index + 1) - this.fontSize/2, this.fontSize, this.fontSize);

					ctx.fillStyle = this.legendColors[index].fill;
					ctx.fillRect(this.x + this.xPadding, this.getLineHeight(index + 1) - this.fontSize/2, this.fontSize, this.fontSize);


				},this);
			}
		}
	});

	Chart.Scale = Chart.Element.extend({
		initialize : function(){
			this.fit();
		},
		buildYLabels : function(){
			this.yLabels = [];

			var stepDecimalPlaces = getDecimalPlaces(this.stepValue);

			for (var i=0; i<=this.steps; i++){
				this.yLabels.push(template(this.templateString,{value:(this.min + (i * this.stepValue)).toFixed(stepDecimalPlaces)}));
			}
			this.yLabelWidth = (this.display && this.showLabels) ? longestText(this.ctx,this.font,this.yLabels) : 0;
		},
		addXLabel : function(label){
			this.xLabels.push(label);
			this.valuesCount++;
			this.fit();
		},
		removeXLabel : function(){
			this.xLabels.shift();
			this.valuesCount--;
			this.fit();
		},
		// Fitting loop to rotate x Labels and figure out what fits there, and also calculate how many Y steps to use
		fit: function(){
			// First we need the width of the yLabels, assuming the xLabels aren't rotated

			// To do that we need the base line at the top and base of the chart, assuming there is no x label rotation
			this.startPoint = (this.display) ? this.fontSize : 0;
			this.endPoint = (this.display) ? this.height - (this.fontSize * 1.5) - 5 : this.height; // -5 to pad labels

			// Apply padding settings to the start and end point.
			this.startPoint += this.padding;
			this.endPoint -= this.padding;

			// Cache the starting height, so can determine if we need to recalculate the scale yAxis
			var cachedHeight = this.endPoint - this.startPoint,
				cachedYLabelWidth;

			// Build the current yLabels so we have an idea of what size they'll be to start
			/*
			 *	This sets what is returned from calculateScaleRange as static properties of this class:
			 *
				this.steps;
				this.stepValue;
				this.min;
				this.max;
			 *
			 */
			this.calculateYRange(cachedHeight);

			// With these properties set we can now build the array of yLabels
			// and also the width of the largest yLabel
			this.buildYLabels();

			this.calculateXLabelRotation();

			while((cachedHeight > this.endPoint - this.startPoint)){
				cachedHeight = this.endPoint - this.startPoint;
				cachedYLabelWidth = this.yLabelWidth;

				this.calculateYRange(cachedHeight);
				this.buildYLabels();

				// Only go through the xLabel loop again if the yLabel width has changed
				if (cachedYLabelWidth < this.yLabelWidth){
					this.calculateXLabelRotation();
				}
			}

		},
		calculateXLabelRotation : function(){
			//Get the width of each grid by calculating the difference
			//between x offsets between 0 and 1.

			this.ctx.font = this.font;

			var firstWidth = this.ctx.measureText(this.xLabels[0]).width,
				lastWidth = this.ctx.measureText(this.xLabels[this.xLabels.length - 1]).width,
				firstRotated,
				lastRotated;


			this.xScalePaddingRight = lastWidth/2 + 3;
			this.xScalePaddingLeft = (firstWidth/2 > this.yLabelWidth + 10) ? firstWidth/2 : this.yLabelWidth + 10;

			this.xLabelRotation = 0;
			if (this.display){
				var originalLabelWidth = longestText(this.ctx,this.font,this.xLabels),
					cosRotation,
					firstRotatedWidth;
				this.xLabelWidth = originalLabelWidth;
				//Allow 3 pixels x2 padding either side for label readability
				var xGridWidth = Math.floor(this.calculateX(1) - this.calculateX(0)) - 6;

				//Max label rotate should be 90 - also act as a loop counter
				while ((this.xLabelWidth > xGridWidth && this.xLabelRotation === 0) || (this.xLabelWidth > xGridWidth && this.xLabelRotation <= 90 && this.xLabelRotation > 0)){
					cosRotation = Math.cos(toRadians(this.xLabelRotation));

					firstRotated = cosRotation * firstWidth;
					lastRotated = cosRotation * lastWidth;

					// We're right aligning the text now.
					if (firstRotated + this.fontSize / 2 > this.yLabelWidth + 8){
						this.xScalePaddingLeft = firstRotated + this.fontSize / 2;
					}
					this.xScalePaddingRight = this.fontSize/2;


					this.xLabelRotation++;
					this.xLabelWidth = cosRotation * originalLabelWidth;

				}
				if (this.xLabelRotation > 0){
					this.endPoint -= Math.sin(toRadians(this.xLabelRotation))*originalLabelWidth + 3;
				}
			}
			else{
				this.xLabelWidth = 0;
				this.xScalePaddingRight = this.padding;
				this.xScalePaddingLeft = this.padding;
			}

		},
		// Needs to be overidden in each Chart type
		// Otherwise we need to pass all the data into the scale class
		calculateYRange: noop,
		drawingArea: function(){
			return this.startPoint - this.endPoint;
		},
		calculateY : function(value){
			var scalingFactor = this.drawingArea() / (this.min - this.max);
			return this.endPoint - (scalingFactor * (value - this.min));
		},
		calculateX : function(index){
			var isRotated = (this.xLabelRotation > 0),
				// innerWidth = (this.offsetGridLines) ? this.width - offsetLeft - this.padding : this.width - (offsetLeft + halfLabelWidth * 2) - this.padding,
				innerWidth = this.width - (this.xScalePaddingLeft + this.xScalePaddingRight),
				valueWidth = innerWidth/Math.max((this.valuesCount - ((this.offsetGridLines) ? 0 : 1)), 1),
				valueOffset = (valueWidth * index) + this.xScalePaddingLeft;

			if (this.offsetGridLines){
				valueOffset += (valueWidth/2);
			}

			return Math.round(valueOffset);
		},
		update : function(newProps){
			helpers.extend(this, newProps);
			this.fit();
		},
		draw : function(){
			var ctx = this.ctx,
				yLabelGap = (this.endPoint - this.startPoint) / this.steps,
				xStart = Math.round(this.xScalePaddingLeft);
			if (this.display){
				ctx.fillStyle = this.textColor;
				ctx.font = this.font;
				each(this.yLabels,function(labelString,index){
					var yLabelCenter = this.endPoint - (yLabelGap * index),
						linePositionY = Math.round(yLabelCenter),
						drawHorizontalLine = this.showHorizontalLines;

					ctx.textAlign = "right";
					ctx.textBaseline = "middle";
					if (this.showLabels){
						ctx.fillText(labelString,xStart - 10,yLabelCenter);
					}

					// This is X axis, so draw it
					if (index === 0 && !drawHorizontalLine){
						drawHorizontalLine = true;
					}

					if (drawHorizontalLine){
						ctx.beginPath();
					}

					if (index > 0){
						// This is a grid line in the centre, so drop that
						ctx.lineWidth = this.gridLineWidth;
						ctx.strokeStyle = this.gridLineColor;
					} else {
						// This is the first line on the scale
						ctx.lineWidth = this.lineWidth;
						ctx.strokeStyle = this.lineColor;
					}

					linePositionY += helpers.aliasPixel(ctx.lineWidth);

					if(drawHorizontalLine){
						ctx.moveTo(xStart, linePositionY);
						ctx.lineTo(this.width, linePositionY);
						ctx.stroke();
						ctx.closePath();
					}

					ctx.lineWidth = this.lineWidth;
					ctx.strokeStyle = this.lineColor;
					ctx.beginPath();
					ctx.moveTo(xStart - 5, linePositionY);
					ctx.lineTo(xStart, linePositionY);
					ctx.stroke();
					ctx.closePath();

				},this);

				each(this.xLabels,function(label,index){
					var xPos = this.calculateX(index) + aliasPixel(this.lineWidth),
						// Check to see if line/bar here and decide where to place the line
						linePos = this.calculateX(index - (this.offsetGridLines ? 0.5 : 0)) + aliasPixel(this.lineWidth),
						isRotated = (this.xLabelRotation > 0),
						drawVerticalLine = this.showVerticalLines;

					// This is Y axis, so draw it
					if (index === 0 && !drawVerticalLine){
						drawVerticalLine = true;
					}

					if (drawVerticalLine){
						ctx.beginPath();
					}

					if (index > 0){
						// This is a grid line in the centre, so drop that
						ctx.lineWidth = this.gridLineWidth;
						ctx.strokeStyle = this.gridLineColor;
					} else {
						// This is the first line on the scale
						ctx.lineWidth = this.lineWidth;
						ctx.strokeStyle = this.lineColor;
					}

					if (drawVerticalLine){
						ctx.moveTo(linePos,this.endPoint);
						ctx.lineTo(linePos,this.startPoint - 3);
						ctx.stroke();
						ctx.closePath();
					}


					ctx.lineWidth = this.lineWidth;
					ctx.strokeStyle = this.lineColor;


					// Small lines at the bottom of the base grid line
					ctx.beginPath();
					ctx.moveTo(linePos,this.endPoint);
					ctx.lineTo(linePos,this.endPoint + 5);
					ctx.stroke();
					ctx.closePath();

					ctx.save();
					ctx.translate(xPos,(isRotated) ? this.endPoint + 12 : this.endPoint + 8);
					ctx.rotate(toRadians(this.xLabelRotation)*-1);
					ctx.font = this.font;
					ctx.textAlign = (isRotated) ? "right" : "center";
					ctx.textBaseline = (isRotated) ? "middle" : "top";
					ctx.fillText(label, 0, 0);
					ctx.restore();
				},this);

			}
		}

	});

	Chart.RadialScale = Chart.Element.extend({
		initialize: function(){
			this.size = min([this.height, this.width]);
			this.drawingArea = (this.display) ? (this.size/2) - (this.fontSize/2 + this.backdropPaddingY) : (this.size/2);
		},
		calculateCenterOffset: function(value){
			// Take into account half font size + the yPadding of the top value
			var scalingFactor = this.drawingArea / (this.max - this.min);

			return (value - this.min) * scalingFactor;
		},
		update : function(){
			if (!this.lineArc){
				this.setScaleSize();
			} else {
				this.drawingArea = (this.display) ? (this.size/2) - (this.fontSize/2 + this.backdropPaddingY) : (this.size/2);
			}
			this.buildYLabels();
		},
		buildYLabels: function(){
			this.yLabels = [];

			var stepDecimalPlaces = getDecimalPlaces(this.stepValue);

			for (var i=0; i<=this.steps; i++){
				this.yLabels.push(template(this.templateString,{value:(this.min + (i * this.stepValue)).toFixed(stepDecimalPlaces)}));
			}
		},
		getCircumference : function(){
			return ((Math.PI*2) / this.valuesCount);
		},
		setScaleSize: function(){
			/*
			 * Right, this is really confusing and there is a lot of maths going on here
			 * The gist of the problem is here: https://gist.github.com/nnnick/696cc9c55f4b0beb8fe9
			 *
			 * Reaction: https://dl.dropboxusercontent.com/u/34601363/toomuchscience.gif
			 *
			 * Solution:
			 *
			 * We assume the radius of the polygon is half the size of the canvas at first
			 * at each index we check if the text overlaps.
			 *
			 * Where it does, we store that angle and that index.
			 *
			 * After finding the largest index and angle we calculate how much we need to remove
			 * from the shape radius to move the point inwards by that x.
			 *
			 * We average the left and right distances to get the maximum shape radius that can fit in the box
			 * along with labels.
			 *
			 * Once we have that, we can find the centre point for the chart, by taking the x text protrusion
			 * on each side, removing that from the size, halving it and adding the left x protrusion width.
			 *
			 * This will mean we have a shape fitted to the canvas, as large as it can be with the labels
			 * and position it in the most space efficient manner
			 *
			 * https://dl.dropboxusercontent.com/u/34601363/yeahscience.gif
			 */


			// Get maximum radius of the polygon. Either half the height (minus the text width) or half the width.
			// Use this to calculate the offset + change. - Make sure L/R protrusion is at least 0 to stop issues with centre points
			var largestPossibleRadius = min([(this.height/2 - this.pointLabelFontSize - 5), this.width/2]),
				pointPosition,
				i,
				textWidth,
				halfTextWidth,
				furthestRight = this.width,
				furthestRightIndex,
				furthestRightAngle,
				furthestLeft = 0,
				furthestLeftIndex,
				furthestLeftAngle,
				xProtrusionLeft,
				xProtrusionRight,
				radiusReductionRight,
				radiusReductionLeft,
				maxWidthRadius;
			this.ctx.font = fontString(this.pointLabelFontSize,this.pointLabelFontStyle,this.pointLabelFontFamily);
			for (i=0;i<this.valuesCount;i++){
				// 5px to space the text slightly out - similar to what we do in the draw function.
				pointPosition = this.getPointPosition(i, largestPossibleRadius);
				textWidth = this.ctx.measureText(template(this.templateString, { value: this.labels[i] })).width + 5;
				if (i === 0 || i === this.valuesCount/2){
					// If we're at index zero, or exactly the middle, we're at exactly the top/bottom
					// of the radar chart, so text will be aligned centrally, so we'll half it and compare
					// w/left and right text sizes
					halfTextWidth = textWidth/2;
					if (pointPosition.x + halfTextWidth > furthestRight) {
						furthestRight = pointPosition.x + halfTextWidth;
						furthestRightIndex = i;
					}
					if (pointPosition.x - halfTextWidth < furthestLeft) {
						furthestLeft = pointPosition.x - halfTextWidth;
						furthestLeftIndex = i;
					}
				}
				else if (i < this.valuesCount/2) {
					// Less than half the values means we'll left align the text
					if (pointPosition.x + textWidth > furthestRight) {
						furthestRight = pointPosition.x + textWidth;
						furthestRightIndex = i;
					}
				}
				else if (i > this.valuesCount/2){
					// More than half the values means we'll right align the text
					if (pointPosition.x - textWidth < furthestLeft) {
						furthestLeft = pointPosition.x - textWidth;
						furthestLeftIndex = i;
					}
				}
			}

			xProtrusionLeft = furthestLeft;

			xProtrusionRight = Math.ceil(furthestRight - this.width);

			furthestRightAngle = this.getIndexAngle(furthestRightIndex);

			furthestLeftAngle = this.getIndexAngle(furthestLeftIndex);

			radiusReductionRight = xProtrusionRight / Math.sin(furthestRightAngle + Math.PI/2);

			radiusReductionLeft = xProtrusionLeft / Math.sin(furthestLeftAngle + Math.PI/2);

			// Ensure we actually need to reduce the size of the chart
			radiusReductionRight = (isNumber(radiusReductionRight)) ? radiusReductionRight : 0;
			radiusReductionLeft = (isNumber(radiusReductionLeft)) ? radiusReductionLeft : 0;

			this.drawingArea = largestPossibleRadius - (radiusReductionLeft + radiusReductionRight)/2;

			//this.drawingArea = min([maxWidthRadius, (this.height - (2 * (this.pointLabelFontSize + 5)))/2])
			this.setCenterPoint(radiusReductionLeft, radiusReductionRight);

		},
		setCenterPoint: function(leftMovement, rightMovement){

			var maxRight = this.width - rightMovement - this.drawingArea,
				maxLeft = leftMovement + this.drawingArea;

			this.xCenter = (maxLeft + maxRight)/2;
			// Always vertically in the centre as the text height doesn't change
			this.yCenter = (this.height/2);
		},

		getIndexAngle : function(index){
			var angleMultiplier = (Math.PI * 2) / this.valuesCount;
			// Start from the top instead of right, so remove a quarter of the circle

			return index * angleMultiplier - (Math.PI/2);
		},
		getPointPosition : function(index, distanceFromCenter){
			var thisAngle = this.getIndexAngle(index);
			return {
				x : (Math.cos(thisAngle) * distanceFromCenter) + this.xCenter,
				y : (Math.sin(thisAngle) * distanceFromCenter) + this.yCenter
			};
		},
		draw: function(){
			if (this.display){
				var ctx = this.ctx;
				each(this.yLabels, function(label, index){
					// Don't draw a centre value
					if (index > 0){
						var yCenterOffset = index * (this.drawingArea/this.steps),
							yHeight = this.yCenter - yCenterOffset,
							pointPosition;

						// Draw circular lines around the scale
						if (this.lineWidth > 0){
							ctx.strokeStyle = this.lineColor;
							ctx.lineWidth = this.lineWidth;

							if(this.lineArc){
								ctx.beginPath();
								ctx.arc(this.xCenter, this.yCenter, yCenterOffset, 0, Math.PI*2);
								ctx.closePath();
								ctx.stroke();
							} else{
								ctx.beginPath();
								for (var i=0;i<this.valuesCount;i++)
								{
									pointPosition = this.getPointPosition(i, this.calculateCenterOffset(this.min + (index * this.stepValue)));
									if (i === 0){
										ctx.moveTo(pointPosition.x, pointPosition.y);
									} else {
										ctx.lineTo(pointPosition.x, pointPosition.y);
									}
								}
								ctx.closePath();
								ctx.stroke();
							}
						}
						if(this.showLabels){
							ctx.font = fontString(this.fontSize,this.fontStyle,this.fontFamily);
							if (this.showLabelBackdrop){
								var labelWidth = ctx.measureText(label).width;
								ctx.fillStyle = this.backdropColor;
								ctx.fillRect(
									this.xCenter - labelWidth/2 - this.backdropPaddingX,
									yHeight - this.fontSize/2 - this.backdropPaddingY,
									labelWidth + this.backdropPaddingX*2,
									this.fontSize + this.backdropPaddingY*2
								);
							}
							ctx.textAlign = 'center';
							ctx.textBaseline = "middle";
							ctx.fillStyle = this.fontColor;
							ctx.fillText(label, this.xCenter, yHeight);
						}
					}
				}, this);

				if (!this.lineArc){
					ctx.lineWidth = this.angleLineWidth;
					ctx.strokeStyle = this.angleLineColor;
					for (var i = this.valuesCount - 1; i >= 0; i--) {
						if (this.angleLineWidth > 0){
							var outerPosition = this.getPointPosition(i, this.calculateCenterOffset(this.max));
							ctx.beginPath();
							ctx.moveTo(this.xCenter, this.yCenter);
							ctx.lineTo(outerPosition.x, outerPosition.y);
							ctx.stroke();
							ctx.closePath();
						}
						// Extra 3px out for some label spacing
						var pointLabelPosition = this.getPointPosition(i, this.calculateCenterOffset(this.max) + 5);
						ctx.font = fontString(this.pointLabelFontSize,this.pointLabelFontStyle,this.pointLabelFontFamily);
						ctx.fillStyle = this.pointLabelFontColor;

						var labelsCount = this.labels.length,
							halfLabelsCount = this.labels.length/2,
							quarterLabelsCount = halfLabelsCount/2,
							upperHalf = (i < quarterLabelsCount || i > labelsCount - quarterLabelsCount),
							exactQuarter = (i === quarterLabelsCount || i === labelsCount - quarterLabelsCount);
						if (i === 0){
							ctx.textAlign = 'center';
						} else if(i === halfLabelsCount){
							ctx.textAlign = 'center';
						} else if (i < halfLabelsCount){
							ctx.textAlign = 'left';
						} else {
							ctx.textAlign = 'right';
						}

						// Set the correct text baseline based on outer positioning
						if (exactQuarter){
							ctx.textBaseline = 'middle';
						} else if (upperHalf){
							ctx.textBaseline = 'bottom';
						} else {
							ctx.textBaseline = 'top';
						}

						ctx.fillText(this.labels[i], pointLabelPosition.x, pointLabelPosition.y);
					}
				}
			}
		}
	});

	// Attach global event to resize each chart instance when the browser resizes
	helpers.addEvent(window, "resize", (function(){
		// Basic debounce of resize function so it doesn't hurt performance when resizing browser.
		var timeout;
		return function(){
			clearTimeout(timeout);
			timeout = setTimeout(function(){
				each(Chart.instances,function(instance){
					// If the responsive flag is set in the chart instance config
					// Cascade the resize event down to the chart.
					if (instance.options.responsive){
						instance.resize(instance.render, true);
					}
				});
			}, 50);
		};
	})());


	if (amd) {
		define(function(){
			return Chart;
		});
	} else if (typeof module === 'object' && module.exports) {
		module.exports = Chart;
	}

	root.Chart = Chart;

	Chart.noConflict = function(){
		root.Chart = previous;
		return Chart;
	};

}).call(this);

(function(){
	"use strict";

	var root = this,
		Chart = root.Chart,
		helpers = Chart.helpers;


	var defaultConfig = {
		//Boolean - Whether the scale should start at zero, or an order of magnitude down from the lowest value
		scaleBeginAtZero : true,

		//Boolean - Whether grid lines are shown across the chart
		scaleShowGridLines : true,

		//String - Colour of the grid lines
		scaleGridLineColor : "rgba(0,0,0,.05)",

		//Number - Width of the grid lines
		scaleGridLineWidth : 1,

		//Boolean - Whether to show horizontal lines (except X axis)
		scaleShowHorizontalLines: true,

		//Boolean - Whether to show vertical lines (except Y axis)
		scaleShowVerticalLines: true,

		//Boolean - If there is a stroke on each bar
		barShowStroke : true,

		//Number - Pixel width of the bar stroke
		barStrokeWidth : 2,

		//Number - Spacing between each of the X value sets
		barValueSpacing : 5,

		//Number - Spacing between data sets within X values
		barDatasetSpacing : 1,

		//String - A legend template
		legendTemplate : "<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<datasets.length; i++){%><li><span style=\"background-color:<%=datasets[i].fillColor%>\"></span><%if(datasets[i].label){%><%=datasets[i].label%><%}%></li><%}%></ul>"

	};


	Chart.Type.extend({
		name: "Bar",
		defaults : defaultConfig,
		initialize:  function(data){

			//Expose options as a scope variable here so we can access it in the ScaleClass
			var options = this.options;

			this.ScaleClass = Chart.Scale.extend({
				offsetGridLines : true,
				calculateBarX : function(datasetCount, datasetIndex, barIndex){
					//Reusable method for calculating the xPosition of a given bar based on datasetIndex & width of the bar
					var xWidth = this.calculateBaseWidth(),
						xAbsolute = this.calculateX(barIndex) - (xWidth/2),
						barWidth = this.calculateBarWidth(datasetCount);

					return xAbsolute + (barWidth * datasetIndex) + (datasetIndex * options.barDatasetSpacing) + barWidth/2;
				},
				calculateBaseWidth : function(){
					return (this.calculateX(1) - this.calculateX(0)) - (2*options.barValueSpacing);
				},
				calculateBarWidth : function(datasetCount){
					//The padding between datasets is to the right of each bar, providing that there are more than 1 dataset
					var baseWidth = this.calculateBaseWidth() - ((datasetCount - 1) * options.barDatasetSpacing);

					return (baseWidth / datasetCount);
				}
			});

			this.datasets = [];

			//Set up tooltip events on the chart
			if (this.options.showTooltips){
				helpers.bindEvents(this, this.options.tooltipEvents, function(evt){
					var activeBars = (evt.type !== 'mouseout') ? this.getBarsAtEvent(evt) : [];

					this.eachBars(function(bar){
						bar.restore(['fillColor', 'strokeColor']);
					});
					helpers.each(activeBars, function(activeBar){
						activeBar.fillColor = activeBar.highlightFill;
						activeBar.strokeColor = activeBar.highlightStroke;
					});
					this.showTooltip(activeBars);
				});
			}

			//Declare the extension of the default point, to cater for the options passed in to the constructor
			this.BarClass = Chart.Rectangle.extend({
				strokeWidth : this.options.barStrokeWidth,
				showStroke : this.options.barShowStroke,
				ctx : this.chart.ctx
			});

			//Iterate through each of the datasets, and build this into a property of the chart
			helpers.each(data.datasets,function(dataset,datasetIndex){

				var datasetObject = {
					label : dataset.label || null,
					fillColor : dataset.fillColor,
					strokeColor : dataset.strokeColor,
					bars : []
				};

				this.datasets.push(datasetObject);

				helpers.each(dataset.data,function(dataPoint,index){
					//Add a new point for each piece of data, passing any required data to draw.
					datasetObject.bars.push(new this.BarClass({
						value : dataPoint,
						label : data.labels[index],
						datasetLabel: dataset.label,
						strokeColor : dataset.strokeColor,
						fillColor : dataset.fillColor,
						highlightFill : dataset.highlightFill || dataset.fillColor,
						highlightStroke : dataset.highlightStroke || dataset.strokeColor
					}));
				},this);

			},this);

			this.buildScale(data.labels);

			this.BarClass.prototype.base = this.scale.endPoint;

			this.eachBars(function(bar, index, datasetIndex){
				helpers.extend(bar, {
					width : this.scale.calculateBarWidth(this.datasets.length),
					x: this.scale.calculateBarX(this.datasets.length, datasetIndex, index),
					y: this.scale.endPoint
				});
				bar.save();
			}, this);

			this.render();
		},
		update : function(){
			this.scale.update();
			// Reset any highlight colours before updating.
			helpers.each(this.activeElements, function(activeElement){
				activeElement.restore(['fillColor', 'strokeColor']);
			});

			this.eachBars(function(bar){
				bar.save();
			});
			this.render();
		},
		eachBars : function(callback){
			helpers.each(this.datasets,function(dataset, datasetIndex){
				helpers.each(dataset.bars, callback, this, datasetIndex);
			},this);
		},
		getBarsAtEvent : function(e){
			var barsArray = [],
				eventPosition = helpers.getRelativePosition(e),
				datasetIterator = function(dataset){
					barsArray.push(dataset.bars[barIndex]);
				},
				barIndex;

			for (var datasetIndex = 0; datasetIndex < this.datasets.length; datasetIndex++) {
				for (barIndex = 0; barIndex < this.datasets[datasetIndex].bars.length; barIndex++) {
					if (this.datasets[datasetIndex].bars[barIndex].inRange(eventPosition.x,eventPosition.y)){
						helpers.each(this.datasets, datasetIterator);
						return barsArray;
					}
				}
			}

			return barsArray;
		},
		buildScale : function(labels){
			var self = this;

			var dataTotal = function(){
				var values = [];
				self.eachBars(function(bar){
					values.push(bar.value);
				});
				return values;
			};

			var scaleOptions = {
				templateString : this.options.scaleLabel,
				height : this.chart.height,
				width : this.chart.width,
				ctx : this.chart.ctx,
				textColor : this.options.scaleFontColor,
				fontSize : this.options.scaleFontSize,
				fontStyle : this.options.scaleFontStyle,
				fontFamily : this.options.scaleFontFamily,
				valuesCount : labels.length,
				beginAtZero : this.options.scaleBeginAtZero,
				integersOnly : this.options.scaleIntegersOnly,
				calculateYRange: function(currentHeight){
					var updatedRanges = helpers.calculateScaleRange(
						dataTotal(),
						currentHeight,
						this.fontSize,
						this.beginAtZero,
						this.integersOnly
					);
					helpers.extend(this, updatedRanges);
				},
				xLabels : labels,
				font : helpers.fontString(this.options.scaleFontSize, this.options.scaleFontStyle, this.options.scaleFontFamily),
				lineWidth : this.options.scaleLineWidth,
				lineColor : this.options.scaleLineColor,
				showHorizontalLines : this.options.scaleShowHorizontalLines,
				showVerticalLines : this.options.scaleShowVerticalLines,
				gridLineWidth : (this.options.scaleShowGridLines) ? this.options.scaleGridLineWidth : 0,
				gridLineColor : (this.options.scaleShowGridLines) ? this.options.scaleGridLineColor : "rgba(0,0,0,0)",
				padding : (this.options.showScale) ? 0 : (this.options.barShowStroke) ? this.options.barStrokeWidth : 0,
				showLabels : this.options.scaleShowLabels,
				display : this.options.showScale
			};

			if (this.options.scaleOverride){
				helpers.extend(scaleOptions, {
					calculateYRange: helpers.noop,
					steps: this.options.scaleSteps,
					stepValue: this.options.scaleStepWidth,
					min: this.options.scaleStartValue,
					max: this.options.scaleStartValue + (this.options.scaleSteps * this.options.scaleStepWidth)
				});
			}

			this.scale = new this.ScaleClass(scaleOptions);
		},
		addData : function(valuesArray,label){
			//Map the values array for each of the datasets
			helpers.each(valuesArray,function(value,datasetIndex){
				//Add a new point for each piece of data, passing any required data to draw.
				this.datasets[datasetIndex].bars.push(new this.BarClass({
					value : value,
					label : label,
					x: this.scale.calculateBarX(this.datasets.length, datasetIndex, this.scale.valuesCount+1),
					y: this.scale.endPoint,
					width : this.scale.calculateBarWidth(this.datasets.length),
					base : this.scale.endPoint,
					strokeColor : this.datasets[datasetIndex].strokeColor,
					fillColor : this.datasets[datasetIndex].fillColor
				}));
			},this);

			this.scale.addXLabel(label);
			//Then re-render the chart.
			this.update();
		},
		removeData : function(){
			this.scale.removeXLabel();
			//Then re-render the chart.
			helpers.each(this.datasets,function(dataset){
				dataset.bars.shift();
			},this);
			this.update();
		},
		reflow : function(){
			helpers.extend(this.BarClass.prototype,{
				y: this.scale.endPoint,
				base : this.scale.endPoint
			});
			var newScaleProps = helpers.extend({
				height : this.chart.height,
				width : this.chart.width
			});
			this.scale.update(newScaleProps);
		},
		draw : function(ease){
			var easingDecimal = ease || 1;
			this.clear();

			var ctx = this.chart.ctx;

			this.scale.draw(easingDecimal);

			//Draw all the bars for each dataset
			helpers.each(this.datasets,function(dataset,datasetIndex){
				helpers.each(dataset.bars,function(bar,index){
					if (bar.hasValue()){
						bar.base = this.scale.endPoint;
						//Transition then draw
						bar.transition({
							x : this.scale.calculateBarX(this.datasets.length, datasetIndex, index),
							y : this.scale.calculateY(bar.value),
							width : this.scale.calculateBarWidth(this.datasets.length)
						}, easingDecimal).draw();
					}
				},this);

			},this);
		}
	});


}).call(this);

(function(){
	"use strict";

	var root = this,
		Chart = root.Chart,
		//Cache a local reference to Chart.helpers
		helpers = Chart.helpers;

	var defaultConfig = {
		//Boolean - Whether we should show a stroke on each segment
		segmentShowStroke : true,

		//String - The colour of each segment stroke
		segmentStrokeColor : "#fff",

		//Number - The width of each segment stroke
		segmentStrokeWidth : 2,

		//The percentage of the chart that we cut out of the middle.
		percentageInnerCutout : 50,

		//Number - Amount of animation steps
		animationSteps : 100,

		//String - Animation easing effect
		animationEasing : "easeOutBounce",

		//Boolean - Whether we animate the rotation of the Doughnut
		animateRotate : true,

		//Boolean - Whether we animate scaling the Doughnut from the centre
		animateScale : false,

		//String - A legend template
		legendTemplate : "<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<segments.length; i++){%><li><span style=\"background-color:<%=segments[i].fillColor%>\"></span><%if(segments[i].label){%><%=segments[i].label%><%}%></li><%}%></ul>"

	};


	Chart.Type.extend({
		//Passing in a name registers this chart in the Chart namespace
		name: "Doughnut",
		//Providing a defaults will also register the deafults in the chart namespace
		defaults : defaultConfig,
		//Initialize is fired when the chart is initialized - Data is passed in as a parameter
		//Config is automatically merged by the core of Chart.js, and is available at this.options
		initialize:  function(data){

			//Declare segments as a static property to prevent inheriting across the Chart type prototype
			this.segments = [];
			this.outerRadius = (helpers.min([this.chart.width,this.chart.height]) -	this.options.segmentStrokeWidth/2)/2;

			this.SegmentArc = Chart.Arc.extend({
				ctx : this.chart.ctx,
				x : this.chart.width/2,
				y : this.chart.height/2
			});

			//Set up tooltip events on the chart
			if (this.options.showTooltips){
				helpers.bindEvents(this, this.options.tooltipEvents, function(evt){
					var activeSegments = (evt.type !== 'mouseout') ? this.getSegmentsAtEvent(evt) : [];

					helpers.each(this.segments,function(segment){
						segment.restore(["fillColor"]);
					});
					helpers.each(activeSegments,function(activeSegment){
						activeSegment.fillColor = activeSegment.highlightColor;
					});
					this.showTooltip(activeSegments);
				});
			}
			this.calculateTotal(data);

			helpers.each(data,function(datapoint, index){
				this.addData(datapoint, index, true);
			},this);

			this.render();
		},
		getSegmentsAtEvent : function(e){
			var segmentsArray = [];

			var location = helpers.getRelativePosition(e);

			helpers.each(this.segments,function(segment){
				if (segment.inRange(location.x,location.y)) segmentsArray.push(segment);
			},this);
			return segmentsArray;
		},
		addData : function(segment, atIndex, silent){
			var index = atIndex || this.segments.length;
			this.segments.splice(index, 0, new this.SegmentArc({
				value : segment.value,
				outerRadius : (this.options.animateScale) ? 0 : this.outerRadius,
				innerRadius : (this.options.animateScale) ? 0 : (this.outerRadius/100) * this.options.percentageInnerCutout,
				fillColor : segment.color,
				highlightColor : segment.highlight || segment.color,
				showStroke : this.options.segmentShowStroke,
				strokeWidth : this.options.segmentStrokeWidth,
				strokeColor : this.options.segmentStrokeColor,
				startAngle : Math.PI * 1.5,
				circumference : (this.options.animateRotate) ? 0 : this.calculateCircumference(segment.value),
				label : segment.label
			}));
			if (!silent){
				this.reflow();
				this.update();
			}
		},
		calculateCircumference : function(value){
			return (Math.PI*2)*(Math.abs(value) / this.total);
		},
		calculateTotal : function(data){
			this.total = 0;
			helpers.each(data,function(segment){
				this.total += Math.abs(segment.value);
			},this);
		},
		update : function(){
			this.calculateTotal(this.segments);

			// Reset any highlight colours before updating.
			helpers.each(this.activeElements, function(activeElement){
				activeElement.restore(['fillColor']);
			});

			helpers.each(this.segments,function(segment){
				segment.save();
			});
			this.render();
		},

		removeData: function(atIndex){
			var indexToDelete = (helpers.isNumber(atIndex)) ? atIndex : this.segments.length-1;
			this.segments.splice(indexToDelete, 1);
			this.reflow();
			this.update();
		},

		reflow : function(){
			helpers.extend(this.SegmentArc.prototype,{
				x : this.chart.width/2,
				y : this.chart.height/2
			});
			this.outerRadius = (helpers.min([this.chart.width,this.chart.height]) -	this.options.segmentStrokeWidth/2)/2;
			helpers.each(this.segments, function(segment){
				segment.update({
					outerRadius : this.outerRadius,
					innerRadius : (this.outerRadius/100) * this.options.percentageInnerCutout
				});
			}, this);
		},
		draw : function(easeDecimal){
			var animDecimal = (easeDecimal) ? easeDecimal : 1;
			this.clear();
			helpers.each(this.segments,function(segment,index){
				segment.transition({
					circumference : this.calculateCircumference(segment.value),
					outerRadius : this.outerRadius,
					innerRadius : (this.outerRadius/100) * this.options.percentageInnerCutout
				},animDecimal);

				segment.endAngle = segment.startAngle + segment.circumference;

				segment.draw();
				if (index === 0){
					segment.startAngle = Math.PI * 1.5;
				}
				//Check to see if it's the last segment, if not get the next and update the start angle
				if (index < this.segments.length-1){
					this.segments[index+1].startAngle = segment.endAngle;
				}
			},this);

		}
	});

	Chart.types.Doughnut.extend({
		name : "Pie",
		defaults : helpers.merge(defaultConfig,{percentageInnerCutout : 0})
	});

}).call(this);
(function(){
	"use strict";

	var root = this,
		Chart = root.Chart,
		helpers = Chart.helpers;

	var defaultConfig = {

		///Boolean - Whether grid lines are shown across the chart
		scaleShowGridLines : true,

		//String - Colour of the grid lines
		scaleGridLineColor : "rgba(0,0,0,.05)",

		//Number - Width of the grid lines
		scaleGridLineWidth : 1,

		//Boolean - Whether to show horizontal lines (except X axis)
		scaleShowHorizontalLines: true,

		//Boolean - Whether to show vertical lines (except Y axis)
		scaleShowVerticalLines: true,

		//Boolean - Whether the line is curved between points
		bezierCurve : true,

		//Number - Tension of the bezier curve between points
		bezierCurveTension : 0.4,

		//Boolean - Whether to show a dot for each point
		pointDot : true,

		//Number - Radius of each point dot in pixels
		pointDotRadius : 4,

		//Number - Pixel width of point dot stroke
		pointDotStrokeWidth : 1,

		//Number - amount extra to add to the radius to cater for hit detection outside the drawn point
		pointHitDetectionRadius : 20,

		//Boolean - Whether to show a stroke for datasets
		datasetStroke : true,

		//Number - Pixel width of dataset stroke
		datasetStrokeWidth : 2,

		//Boolean - Whether to fill the dataset with a colour
		datasetFill : true,

		//String - A legend template
		legendTemplate : "<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<datasets.length; i++){%><li><span style=\"background-color:<%=datasets[i].strokeColor%>\"></span><%if(datasets[i].label){%><%=datasets[i].label%><%}%></li><%}%></ul>"

	};


	Chart.Type.extend({
		name: "Line",
		defaults : defaultConfig,
		initialize:  function(data){
			//Declare the extension of the default point, to cater for the options passed in to the constructor
			this.PointClass = Chart.Point.extend({
				strokeWidth : this.options.pointDotStrokeWidth,
				radius : this.options.pointDotRadius,
				display: this.options.pointDot,
				hitDetectionRadius : this.options.pointHitDetectionRadius,
				ctx : this.chart.ctx,
				inRange : function(mouseX){
					return (Math.pow(mouseX-this.x, 2) < Math.pow(this.radius + this.hitDetectionRadius,2));
				}
			});

			this.datasets = [];

			//Set up tooltip events on the chart
			if (this.options.showTooltips){
				helpers.bindEvents(this, this.options.tooltipEvents, function(evt){
					var activePoints = (evt.type !== 'mouseout') ? this.getPointsAtEvent(evt) : [];
					this.eachPoints(function(point){
						point.restore(['fillColor', 'strokeColor']);
					});
					helpers.each(activePoints, function(activePoint){
						activePoint.fillColor = activePoint.highlightFill;
						activePoint.strokeColor = activePoint.highlightStroke;
					});
					this.showTooltip(activePoints);
				});
			}

			//Iterate through each of the datasets, and build this into a property of the chart
			helpers.each(data.datasets,function(dataset){

				var datasetObject = {
					label : dataset.label || null,
					fillColor : dataset.fillColor,
					strokeColor : dataset.strokeColor,
					pointColor : dataset.pointColor,
					pointStrokeColor : dataset.pointStrokeColor,
					points : []
				};

				this.datasets.push(datasetObject);


				helpers.each(dataset.data,function(dataPoint,index){
					//Add a new point for each piece of data, passing any required data to draw.
					datasetObject.points.push(new this.PointClass({
						value : dataPoint,
						label : data.labels[index],
						datasetLabel: dataset.label,
						strokeColor : dataset.pointStrokeColor,
						fillColor : dataset.pointColor,
						highlightFill : dataset.pointHighlightFill || dataset.pointColor,
						highlightStroke : dataset.pointHighlightStroke || dataset.pointStrokeColor
					}));
				},this);

				this.buildScale(data.labels);


				this.eachPoints(function(point, index){
					helpers.extend(point, {
						x: this.scale.calculateX(index),
						y: this.scale.endPoint
					});
					point.save();
				}, this);

			},this);


			this.render();
		},
		update : function(){
			this.scale.update();
			// Reset any highlight colours before updating.
			helpers.each(this.activeElements, function(activeElement){
				activeElement.restore(['fillColor', 'strokeColor']);
			});
			this.eachPoints(function(point){
				point.save();
			});
			this.render();
		},
		eachPoints : function(callback){
			helpers.each(this.datasets,function(dataset){
				helpers.each(dataset.points,callback,this);
			},this);
		},
		getPointsAtEvent : function(e){
			var pointsArray = [],
				eventPosition = helpers.getRelativePosition(e);
			helpers.each(this.datasets,function(dataset){
				helpers.each(dataset.points,function(point){
					if (point.inRange(eventPosition.x,eventPosition.y)) pointsArray.push(point);
				});
			},this);
			return pointsArray;
		},
		buildScale : function(labels){
			var self = this;

			var dataTotal = function(){
				var values = [];
				self.eachPoints(function(point){
					values.push(point.value);
				});

				return values;
			};

			var scaleOptions = {
				templateString : this.options.scaleLabel,
				height : this.chart.height,
				width : this.chart.width,
				ctx : this.chart.ctx,
				textColor : this.options.scaleFontColor,
				fontSize : this.options.scaleFontSize,
				fontStyle : this.options.scaleFontStyle,
				fontFamily : this.options.scaleFontFamily,
				valuesCount : labels.length,
				beginAtZero : this.options.scaleBeginAtZero,
				integersOnly : this.options.scaleIntegersOnly,
				calculateYRange : function(currentHeight){
					var updatedRanges = helpers.calculateScaleRange(
						dataTotal(),
						currentHeight,
						this.fontSize,
						this.beginAtZero,
						this.integersOnly
					);
					helpers.extend(this, updatedRanges);
				},
				xLabels : labels,
				font : helpers.fontString(this.options.scaleFontSize, this.options.scaleFontStyle, this.options.scaleFontFamily),
				lineWidth : this.options.scaleLineWidth,
				lineColor : this.options.scaleLineColor,
				showHorizontalLines : this.options.scaleShowHorizontalLines,
				showVerticalLines : this.options.scaleShowVerticalLines,
				gridLineWidth : (this.options.scaleShowGridLines) ? this.options.scaleGridLineWidth : 0,
				gridLineColor : (this.options.scaleShowGridLines) ? this.options.scaleGridLineColor : "rgba(0,0,0,0)",
				padding: (this.options.showScale) ? 0 : this.options.pointDotRadius + this.options.pointDotStrokeWidth,
				showLabels : this.options.scaleShowLabels,
				display : this.options.showScale
			};

			if (this.options.scaleOverride){
				helpers.extend(scaleOptions, {
					calculateYRange: helpers.noop,
					steps: this.options.scaleSteps,
					stepValue: this.options.scaleStepWidth,
					min: this.options.scaleStartValue,
					max: this.options.scaleStartValue + (this.options.scaleSteps * this.options.scaleStepWidth)
				});
			}


			this.scale = new Chart.Scale(scaleOptions);
		},
		addData : function(valuesArray,label){
			//Map the values array for each of the datasets

			helpers.each(valuesArray,function(value,datasetIndex){
				//Add a new point for each piece of data, passing any required data to draw.
				this.datasets[datasetIndex].points.push(new this.PointClass({
					value : value,
					label : label,
					x: this.scale.calculateX(this.scale.valuesCount+1),
					y: this.scale.endPoint,
					strokeColor : this.datasets[datasetIndex].pointStrokeColor,
					fillColor : this.datasets[datasetIndex].pointColor
				}));
			},this);

			this.scale.addXLabel(label);
			//Then re-render the chart.
			this.update();
		},
		removeData : function(){
			this.scale.removeXLabel();
			//Then re-render the chart.
			helpers.each(this.datasets,function(dataset){
				dataset.points.shift();
			},this);
			this.update();
		},
		reflow : function(){
			var newScaleProps = helpers.extend({
				height : this.chart.height,
				width : this.chart.width
			});
			this.scale.update(newScaleProps);
		},
		draw : function(ease){
			var easingDecimal = ease || 1;
			this.clear();

			var ctx = this.chart.ctx;

			// Some helper methods for getting the next/prev points
			var hasValue = function(item){
				return item.value !== null;
			},
			nextPoint = function(point, collection, index){
				return helpers.findNextWhere(collection, hasValue, index) || point;
			},
			previousPoint = function(point, collection, index){
				return helpers.findPreviousWhere(collection, hasValue, index) || point;
			};

			this.scale.draw(easingDecimal);


			helpers.each(this.datasets,function(dataset){
				var pointsWithValues = helpers.where(dataset.points, hasValue);

				//Transition each point first so that the line and point drawing isn't out of sync
				//We can use this extra loop to calculate the control points of this dataset also in this loop

				helpers.each(dataset.points, function(point, index){
					if (point.hasValue()){
						point.transition({
							y : this.scale.calculateY(point.value),
							x : this.scale.calculateX(index)
						}, easingDecimal);
					}
				},this);


				// Control points need to be calculated in a seperate loop, because we need to know the current x/y of the point
				// This would cause issues when there is no animation, because the y of the next point would be 0, so beziers would be skewed
				if (this.options.bezierCurve){
					helpers.each(pointsWithValues, function(point, index){
						var tension = (index > 0 && index < pointsWithValues.length - 1) ? this.options.bezierCurveTension : 0;
						point.controlPoints = helpers.splineCurve(
							previousPoint(point, pointsWithValues, index),
							point,
							nextPoint(point, pointsWithValues, index),
							tension
						);

						// Prevent the bezier going outside of the bounds of the graph

						// Cap puter bezier handles to the upper/lower scale bounds
						if (point.controlPoints.outer.y > this.scale.endPoint){
							point.controlPoints.outer.y = this.scale.endPoint;
						}
						else if (point.controlPoints.outer.y < this.scale.startPoint){
							point.controlPoints.outer.y = this.scale.startPoint;
						}

						// Cap inner bezier handles to the upper/lower scale bounds
						if (point.controlPoints.inner.y > this.scale.endPoint){
							point.controlPoints.inner.y = this.scale.endPoint;
						}
						else if (point.controlPoints.inner.y < this.scale.startPoint){
							point.controlPoints.inner.y = this.scale.startPoint;
						}
					},this);
				}


				//Draw the line between all the points
				ctx.lineWidth = this.options.datasetStrokeWidth;
				ctx.strokeStyle = dataset.strokeColor;
				ctx.beginPath();

				helpers.each(pointsWithValues, function(point, index){
					if (index === 0){
						ctx.moveTo(point.x, point.y);
					}
					else{
						if(this.options.bezierCurve){
							var previous = previousPoint(point, pointsWithValues, index);

							ctx.bezierCurveTo(
								previous.controlPoints.outer.x,
								previous.controlPoints.outer.y,
								point.controlPoints.inner.x,
								point.controlPoints.inner.y,
								point.x,
								point.y
							);
						}
						else{
							ctx.lineTo(point.x,point.y);
						}
					}
				}, this);

				ctx.stroke();

				if (this.options.datasetFill && pointsWithValues.length > 0){
					//Round off the line by going to the base of the chart, back to the start, then fill.
					ctx.lineTo(pointsWithValues[pointsWithValues.length - 1].x, this.scale.endPoint);
					ctx.lineTo(pointsWithValues[0].x, this.scale.endPoint);
					ctx.fillStyle = dataset.fillColor;
					ctx.closePath();
					ctx.fill();
				}

				//Now draw the points over the line
				//A little inefficient double looping, but better than the line
				//lagging behind the point positions
				helpers.each(pointsWithValues,function(point){
					point.draw();
				});
			},this);
		}
	});


}).call(this);

(function(){
	"use strict";

	var root = this,
		Chart = root.Chart,
		//Cache a local reference to Chart.helpers
		helpers = Chart.helpers;

	var defaultConfig = {
		//Boolean - Show a backdrop to the scale label
		scaleShowLabelBackdrop : true,

		//String - The colour of the label backdrop
		scaleBackdropColor : "rgba(255,255,255,0.75)",

		// Boolean - Whether the scale should begin at zero
		scaleBeginAtZero : true,

		//Number - The backdrop padding above & below the label in pixels
		scaleBackdropPaddingY : 2,

		//Number - The backdrop padding to the side of the label in pixels
		scaleBackdropPaddingX : 2,

		//Boolean - Show line for each value in the scale
		scaleShowLine : true,

		//Boolean - Stroke a line around each segment in the chart
		segmentShowStroke : true,

		//String - The colour of the stroke on each segement.
		segmentStrokeColor : "#fff",

		//Number - The width of the stroke value in pixels
		segmentStrokeWidth : 2,

		//Number - Amount of animation steps
		animationSteps : 100,

		//String - Animation easing effect.
		animationEasing : "easeOutBounce",

		//Boolean - Whether to animate the rotation of the chart
		animateRotate : true,

		//Boolean - Whether to animate scaling the chart from the centre
		animateScale : false,

		//String - A legend template
		legendTemplate : "<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<segments.length; i++){%><li><span style=\"background-color:<%=segments[i].fillColor%>\"></span><%if(segments[i].label){%><%=segments[i].label%><%}%></li><%}%></ul>"
	};


	Chart.Type.extend({
		//Passing in a name registers this chart in the Chart namespace
		name: "PolarArea",
		//Providing a defaults will also register the deafults in the chart namespace
		defaults : defaultConfig,
		//Initialize is fired when the chart is initialized - Data is passed in as a parameter
		//Config is automatically merged by the core of Chart.js, and is available at this.options
		initialize:  function(data){
			this.segments = [];
			//Declare segment class as a chart instance specific class, so it can share props for this instance
			this.SegmentArc = Chart.Arc.extend({
				showStroke : this.options.segmentShowStroke,
				strokeWidth : this.options.segmentStrokeWidth,
				strokeColor : this.options.segmentStrokeColor,
				ctx : this.chart.ctx,
				innerRadius : 0,
				x : this.chart.width/2,
				y : this.chart.height/2
			});
			this.scale = new Chart.RadialScale({
				display: this.options.showScale,
				fontStyle: this.options.scaleFontStyle,
				fontSize: this.options.scaleFontSize,
				fontFamily: this.options.scaleFontFamily,
				fontColor: this.options.scaleFontColor,
				showLabels: this.options.scaleShowLabels,
				showLabelBackdrop: this.options.scaleShowLabelBackdrop,
				backdropColor: this.options.scaleBackdropColor,
				backdropPaddingY : this.options.scaleBackdropPaddingY,
				backdropPaddingX: this.options.scaleBackdropPaddingX,
				lineWidth: (this.options.scaleShowLine) ? this.options.scaleLineWidth : 0,
				lineColor: this.options.scaleLineColor,
				lineArc: true,
				width: this.chart.width,
				height: this.chart.height,
				xCenter: this.chart.width/2,
				yCenter: this.chart.height/2,
				ctx : this.chart.ctx,
				templateString: this.options.scaleLabel,
				valuesCount: data.length
			});

			this.updateScaleRange(data);

			this.scale.update();

			helpers.each(data,function(segment,index){
				this.addData(segment,index,true);
			},this);

			//Set up tooltip events on the chart
			if (this.options.showTooltips){
				helpers.bindEvents(this, this.options.tooltipEvents, function(evt){
					var activeSegments = (evt.type !== 'mouseout') ? this.getSegmentsAtEvent(evt) : [];
					helpers.each(this.segments,function(segment){
						segment.restore(["fillColor"]);
					});
					helpers.each(activeSegments,function(activeSegment){
						activeSegment.fillColor = activeSegment.highlightColor;
					});
					this.showTooltip(activeSegments);
				});
			}

			this.render();
		},
		getSegmentsAtEvent : function(e){
			var segmentsArray = [];

			var location = helpers.getRelativePosition(e);

			helpers.each(this.segments,function(segment){
				if (segment.inRange(location.x,location.y)) segmentsArray.push(segment);
			},this);
			return segmentsArray;
		},
		addData : function(segment, atIndex, silent){
			var index = atIndex || this.segments.length;

			this.segments.splice(index, 0, new this.SegmentArc({
				fillColor: segment.color,
				highlightColor: segment.highlight || segment.color,
				label: segment.label,
				value: segment.value,
				outerRadius: (this.options.animateScale) ? 0 : this.scale.calculateCenterOffset(segment.value),
				circumference: (this.options.animateRotate) ? 0 : this.scale.getCircumference(),
				startAngle: Math.PI * 1.5
			}));
			if (!silent){
				this.reflow();
				this.update();
			}
		},
		removeData: function(atIndex){
			var indexToDelete = (helpers.isNumber(atIndex)) ? atIndex : this.segments.length-1;
			this.segments.splice(indexToDelete, 1);
			this.reflow();
			this.update();
		},
		calculateTotal: function(data){
			this.total = 0;
			helpers.each(data,function(segment){
				this.total += segment.value;
			},this);
			this.scale.valuesCount = this.segments.length;
		},
		updateScaleRange: function(datapoints){
			var valuesArray = [];
			helpers.each(datapoints,function(segment){
				valuesArray.push(segment.value);
			});

			var scaleSizes = (this.options.scaleOverride) ?
				{
					steps: this.options.scaleSteps,
					stepValue: this.options.scaleStepWidth,
					min: this.options.scaleStartValue,
					max: this.options.scaleStartValue + (this.options.scaleSteps * this.options.scaleStepWidth)
				} :
				helpers.calculateScaleRange(
					valuesArray,
					helpers.min([this.chart.width, this.chart.height])/2,
					this.options.scaleFontSize,
					this.options.scaleBeginAtZero,
					this.options.scaleIntegersOnly
				);

			helpers.extend(
				this.scale,
				scaleSizes,
				{
					size: helpers.min([this.chart.width, this.chart.height]),
					xCenter: this.chart.width/2,
					yCenter: this.chart.height/2
				}
			);

		},
		update : function(){
			this.calculateTotal(this.segments);

			helpers.each(this.segments,function(segment){
				segment.save();
			});
			
			this.reflow();
			this.render();
		},
		reflow : function(){
			helpers.extend(this.SegmentArc.prototype,{
				x : this.chart.width/2,
				y : this.chart.height/2
			});
			this.updateScaleRange(this.segments);
			this.scale.update();

			helpers.extend(this.scale,{
				xCenter: this.chart.width/2,
				yCenter: this.chart.height/2
			});

			helpers.each(this.segments, function(segment){
				segment.update({
					outerRadius : this.scale.calculateCenterOffset(segment.value)
				});
			}, this);

		},
		draw : function(ease){
			var easingDecimal = ease || 1;
			//Clear & draw the canvas
			this.clear();
			helpers.each(this.segments,function(segment, index){
				segment.transition({
					circumference : this.scale.getCircumference(),
					outerRadius : this.scale.calculateCenterOffset(segment.value)
				},easingDecimal);

				segment.endAngle = segment.startAngle + segment.circumference;

				// If we've removed the first segment we need to set the first one to
				// start at the top.
				if (index === 0){
					segment.startAngle = Math.PI * 1.5;
				}

				//Check to see if it's the last segment, if not get the next and update the start angle
				if (index < this.segments.length - 1){
					this.segments[index+1].startAngle = segment.endAngle;
				}
				segment.draw();
			}, this);
			this.scale.draw();
		}
	});

}).call(this);
(function(){
	"use strict";

	var root = this,
		Chart = root.Chart,
		helpers = Chart.helpers;



	Chart.Type.extend({
		name: "Radar",
		defaults:{
			//Boolean - Whether to show lines for each scale point
			scaleShowLine : true,

			//Boolean - Whether we show the angle lines out of the radar
			angleShowLineOut : true,

			//Boolean - Whether to show labels on the scale
			scaleShowLabels : false,

			// Boolean - Whether the scale should begin at zero
			scaleBeginAtZero : true,

			//String - Colour of the angle line
			angleLineColor : "rgba(0,0,0,.1)",

			//Number - Pixel width of the angle line
			angleLineWidth : 1,

			//String - Point label font declaration
			pointLabelFontFamily : "'Arial'",

			//String - Point label font weight
			pointLabelFontStyle : "normal",

			//Number - Point label font size in pixels
			pointLabelFontSize : 10,

			//String - Point label font colour
			pointLabelFontColor : "#666",

			//Boolean - Whether to show a dot for each point
			pointDot : true,

			//Number - Radius of each point dot in pixels
			pointDotRadius : 3,

			//Number - Pixel width of point dot stroke
			pointDotStrokeWidth : 1,

			//Number - amount extra to add to the radius to cater for hit detection outside the drawn point
			pointHitDetectionRadius : 20,

			//Boolean - Whether to show a stroke for datasets
			datasetStroke : true,

			//Number - Pixel width of dataset stroke
			datasetStrokeWidth : 2,

			//Boolean - Whether to fill the dataset with a colour
			datasetFill : true,

			//String - A legend template
			legendTemplate : "<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<datasets.length; i++){%><li><span style=\"background-color:<%=datasets[i].strokeColor%>\"></span><%if(datasets[i].label){%><%=datasets[i].label%><%}%></li><%}%></ul>"

		},

		initialize: function(data){
			this.PointClass = Chart.Point.extend({
				strokeWidth : this.options.pointDotStrokeWidth,
				radius : this.options.pointDotRadius,
				display: this.options.pointDot,
				hitDetectionRadius : this.options.pointHitDetectionRadius,
				ctx : this.chart.ctx
			});

			this.datasets = [];

			this.buildScale(data);

			//Set up tooltip events on the chart
			if (this.options.showTooltips){
				helpers.bindEvents(this, this.options.tooltipEvents, function(evt){
					var activePointsCollection = (evt.type !== 'mouseout') ? this.getPointsAtEvent(evt) : [];

					this.eachPoints(function(point){
						point.restore(['fillColor', 'strokeColor']);
					});
					helpers.each(activePointsCollection, function(activePoint){
						activePoint.fillColor = activePoint.highlightFill;
						activePoint.strokeColor = activePoint.highlightStroke;
					});

					this.showTooltip(activePointsCollection);
				});
			}

			//Iterate through each of the datasets, and build this into a property of the chart
			helpers.each(data.datasets,function(dataset){

				var datasetObject = {
					label: dataset.label || null,
					fillColor : dataset.fillColor,
					strokeColor : dataset.strokeColor,
					pointColor : dataset.pointColor,
					pointStrokeColor : dataset.pointStrokeColor,
					points : []
				};

				this.datasets.push(datasetObject);

				helpers.each(dataset.data,function(dataPoint,index){
					//Add a new point for each piece of data, passing any required data to draw.
					var pointPosition;
					if (!this.scale.animation){
						pointPosition = this.scale.getPointPosition(index, this.scale.calculateCenterOffset(dataPoint));
					}
					datasetObject.points.push(new this.PointClass({
						value : dataPoint,
						label : data.labels[index],
						datasetLabel: dataset.label,
						x: (this.options.animation) ? this.scale.xCenter : pointPosition.x,
						y: (this.options.animation) ? this.scale.yCenter : pointPosition.y,
						strokeColor : dataset.pointStrokeColor,
						fillColor : dataset.pointColor,
						highlightFill : dataset.pointHighlightFill || dataset.pointColor,
						highlightStroke : dataset.pointHighlightStroke || dataset.pointStrokeColor
					}));
				},this);

			},this);

			this.render();
		},
		eachPoints : function(callback){
			helpers.each(this.datasets,function(dataset){
				helpers.each(dataset.points,callback,this);
			},this);
		},

		getPointsAtEvent : function(evt){
			var mousePosition = helpers.getRelativePosition(evt),
				fromCenter = helpers.getAngleFromPoint({
					x: this.scale.xCenter,
					y: this.scale.yCenter
				}, mousePosition);

			var anglePerIndex = (Math.PI * 2) /this.scale.valuesCount,
				pointIndex = Math.round((fromCenter.angle - Math.PI * 1.5) / anglePerIndex),
				activePointsCollection = [];

			// If we're at the top, make the pointIndex 0 to get the first of the array.
			if (pointIndex >= this.scale.valuesCount || pointIndex < 0){
				pointIndex = 0;
			}

			if (fromCenter.distance <= this.scale.drawingArea){
				helpers.each(this.datasets, function(dataset){
					activePointsCollection.push(dataset.points[pointIndex]);
				});
			}

			return activePointsCollection;
		},

		buildScale : function(data){
			this.scale = new Chart.RadialScale({
				display: this.options.showScale,
				fontStyle: this.options.scaleFontStyle,
				fontSize: this.options.scaleFontSize,
				fontFamily: this.options.scaleFontFamily,
				fontColor: this.options.scaleFontColor,
				showLabels: this.options.scaleShowLabels,
				showLabelBackdrop: this.options.scaleShowLabelBackdrop,
				backdropColor: this.options.scaleBackdropColor,
				backdropPaddingY : this.options.scaleBackdropPaddingY,
				backdropPaddingX: this.options.scaleBackdropPaddingX,
				lineWidth: (this.options.scaleShowLine) ? this.options.scaleLineWidth : 0,
				lineColor: this.options.scaleLineColor,
				angleLineColor : this.options.angleLineColor,
				angleLineWidth : (this.options.angleShowLineOut) ? this.options.angleLineWidth : 0,
				// Point labels at the edge of each line
				pointLabelFontColor : this.options.pointLabelFontColor,
				pointLabelFontSize : this.options.pointLabelFontSize,
				pointLabelFontFamily : this.options.pointLabelFontFamily,
				pointLabelFontStyle : this.options.pointLabelFontStyle,
				height : this.chart.height,
				width: this.chart.width,
				xCenter: this.chart.width/2,
				yCenter: this.chart.height/2,
				ctx : this.chart.ctx,
				templateString: this.options.scaleLabel,
				labels: data.labels,
				valuesCount: data.datasets[0].data.length
			});

			this.scale.setScaleSize();
			this.updateScaleRange(data.datasets);
			this.scale.buildYLabels();
		},
		updateScaleRange: function(datasets){
			var valuesArray = (function(){
				var totalDataArray = [];
				helpers.each(datasets,function(dataset){
					if (dataset.data){
						totalDataArray = totalDataArray.concat(dataset.data);
					}
					else {
						helpers.each(dataset.points, function(point){
							totalDataArray.push(point.value);
						});
					}
				});
				return totalDataArray;
			})();


			var scaleSizes = (this.options.scaleOverride) ?
				{
					steps: this.options.scaleSteps,
					stepValue: this.options.scaleStepWidth,
					min: this.options.scaleStartValue,
					max: this.options.scaleStartValue + (this.options.scaleSteps * this.options.scaleStepWidth)
				} :
				helpers.calculateScaleRange(
					valuesArray,
					helpers.min([this.chart.width, this.chart.height])/2,
					this.options.scaleFontSize,
					this.options.scaleBeginAtZero,
					this.options.scaleIntegersOnly
				);

			helpers.extend(
				this.scale,
				scaleSizes
			);

		},
		addData : function(valuesArray,label){
			//Map the values array for each of the datasets
			this.scale.valuesCount++;
			helpers.each(valuesArray,function(value,datasetIndex){
				var pointPosition = this.scale.getPointPosition(this.scale.valuesCount, this.scale.calculateCenterOffset(value));
				this.datasets[datasetIndex].points.push(new this.PointClass({
					value : value,
					label : label,
					x: pointPosition.x,
					y: pointPosition.y,
					strokeColor : this.datasets[datasetIndex].pointStrokeColor,
					fillColor : this.datasets[datasetIndex].pointColor
				}));
			},this);

			this.scale.labels.push(label);

			this.reflow();

			this.update();
		},
		removeData : function(){
			this.scale.valuesCount--;
			this.scale.labels.shift();
			helpers.each(this.datasets,function(dataset){
				dataset.points.shift();
			},this);
			this.reflow();
			this.update();
		},
		update : function(){
			this.eachPoints(function(point){
				point.save();
			});
			this.reflow();
			this.render();
		},
		reflow: function(){
			helpers.extend(this.scale, {
				width : this.chart.width,
				height: this.chart.height,
				size : helpers.min([this.chart.width, this.chart.height]),
				xCenter: this.chart.width/2,
				yCenter: this.chart.height/2
			});
			this.updateScaleRange(this.datasets);
			this.scale.setScaleSize();
			this.scale.buildYLabels();
		},
		draw : function(ease){
			var easeDecimal = ease || 1,
				ctx = this.chart.ctx;
			this.clear();
			this.scale.draw();

			helpers.each(this.datasets,function(dataset){

				//Transition each point first so that the line and point drawing isn't out of sync
				helpers.each(dataset.points,function(point,index){
					if (point.hasValue()){
						point.transition(this.scale.getPointPosition(index, this.scale.calculateCenterOffset(point.value)), easeDecimal);
					}
				},this);



				//Draw the line between all the points
				ctx.lineWidth = this.options.datasetStrokeWidth;
				ctx.strokeStyle = dataset.strokeColor;
				ctx.beginPath();
				helpers.each(dataset.points,function(point,index){
					if (index === 0){
						ctx.moveTo(point.x,point.y);
					}
					else{
						ctx.lineTo(point.x,point.y);
					}
				},this);
				ctx.closePath();
				ctx.stroke();

				ctx.fillStyle = dataset.fillColor;
				ctx.fill();

				//Now draw the points over the line
				//A little inefficient double looping, but better than the line
				//lagging behind the point positions
				helpers.each(dataset.points,function(point){
					if (point.hasValue()){
						point.draw();
					}
				});

			},this);

		}

	});





}).call(this);
},{}],3:[function(require,module,exports){
module.exports = require('react/lib/ReactComponentWithPureRenderMixin');
},{"react/lib/ReactComponentWithPureRenderMixin":329}],4:[function(require,module,exports){
'use strict';

var _extends = require('babel-runtime/helpers/extends')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

exports.__esModule = true;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _PanelGroup = require('./PanelGroup');

var _PanelGroup2 = _interopRequireDefault(_PanelGroup);

var Accordion = _react2['default'].createClass({
  displayName: 'Accordion',

  render: function render() {
    return _react2['default'].createElement(
      _PanelGroup2['default'],
      _extends({}, this.props, { accordion: true }),
      this.props.children
    );
  }
});

exports['default'] = Accordion;
module.exports = exports['default'];
},{"./PanelGroup":59,"babel-runtime/helpers/extends":92,"babel-runtime/helpers/interop-require-default":94,"react":453}],5:[function(require,module,exports){
'use strict';

var _extends = require('babel-runtime/helpers/extends')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

exports.__esModule = true;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _AffixMixin = require('./AffixMixin');

var _AffixMixin2 = _interopRequireDefault(_AffixMixin);

var Affix = _react2['default'].createClass({
  displayName: 'Affix',

  mixins: [_AffixMixin2['default']],

  render: function render() {
    var holderStyle = _extends({
      top: this.state.affixPositionTop
    }, this.props.style);

    // eslint-disable-line react/prop-types
    return _react2['default'].createElement(
      'div',
      _extends({}, this.props, {
        className: _classnames2['default'](this.props.className, this.state.affixClass),
        style: holderStyle }),
      this.props.children
    );
  }
});

exports['default'] = Affix;
module.exports = exports['default'];
// we don't want to expose the `style` property
},{"./AffixMixin":6,"babel-runtime/helpers/extends":92,"babel-runtime/helpers/interop-require-default":94,"classnames":122,"react":453}],6:[function(require,module,exports){
'use strict';

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

exports.__esModule = true;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _utilsDomUtils = require('./utils/domUtils');

var _utilsDomUtils2 = _interopRequireDefault(_utilsDomUtils);

var _domHelpersQueryOffset = require('dom-helpers/query/offset');

var _domHelpersQueryOffset2 = _interopRequireDefault(_domHelpersQueryOffset);

var _utilsEventListener = require('./utils/EventListener');

var _utilsEventListener2 = _interopRequireDefault(_utilsEventListener);

var AffixMixin = {
  propTypes: {
    offset: _react2['default'].PropTypes.number,
    offsetTop: _react2['default'].PropTypes.number,
    offsetBottom: _react2['default'].PropTypes.number
  },

  getInitialState: function getInitialState() {
    return {
      affixClass: 'affix-top'
    };
  },

  getPinnedOffset: function getPinnedOffset(DOMNode) {
    if (this.pinnedOffset) {
      return this.pinnedOffset;
    }

    DOMNode.className = DOMNode.className.replace(/affix-top|affix-bottom|affix/, '');
    DOMNode.className += DOMNode.className.length ? ' affix' : 'affix';

    this.pinnedOffset = _domHelpersQueryOffset2['default'](DOMNode).top - window.pageYOffset;

    return this.pinnedOffset;
  },

  checkPosition: function checkPosition() {
    var DOMNode = undefined,
        scrollHeight = undefined,
        scrollTop = undefined,
        position = undefined,
        offsetTop = undefined,
        offsetBottom = undefined,
        affix = undefined,
        affixType = undefined,
        affixPositionTop = undefined;

    // TODO: or not visible
    if (!this.isMounted()) {
      return;
    }

    DOMNode = _reactDom2['default'].findDOMNode(this);
    scrollHeight = _utilsDomUtils2['default'].getDocumentHeight();
    scrollTop = window.pageYOffset;
    position = _domHelpersQueryOffset2['default'](DOMNode);

    if (this.affixed === 'top') {
      position.top += scrollTop;
    }

    offsetTop = this.props.offsetTop != null ? this.props.offsetTop : this.props.offset;
    offsetBottom = this.props.offsetBottom != null ? this.props.offsetBottom : this.props.offset;

    if (offsetTop == null && offsetBottom == null) {
      return;
    }
    if (offsetTop == null) {
      offsetTop = 0;
    }
    if (offsetBottom == null) {
      offsetBottom = 0;
    }

    if (this.unpin != null && scrollTop + this.unpin <= position.top) {
      affix = false;
    } else if (offsetBottom != null && position.top + DOMNode.offsetHeight >= scrollHeight - offsetBottom) {
      affix = 'bottom';
    } else if (offsetTop != null && scrollTop <= offsetTop) {
      affix = 'top';
    } else {
      affix = false;
    }

    if (this.affixed === affix) {
      return;
    }

    if (this.unpin != null) {
      DOMNode.style.top = '';
    }

    affixType = 'affix' + (affix ? '-' + affix : '');

    this.affixed = affix;
    this.unpin = affix === 'bottom' ? this.getPinnedOffset(DOMNode) : null;

    if (affix === 'bottom') {
      DOMNode.className = DOMNode.className.replace(/affix-top|affix-bottom|affix/, 'affix-bottom');
      affixPositionTop = scrollHeight - offsetBottom - DOMNode.offsetHeight - _domHelpersQueryOffset2['default'](DOMNode).top;
    }

    this.setState({
      affixClass: affixType,
      affixPositionTop: affixPositionTop
    });
  },

  checkPositionWithEventLoop: function checkPositionWithEventLoop() {
    setTimeout(this.checkPosition, 0);
  },

  componentDidMount: function componentDidMount() {
    this._onWindowScrollListener = _utilsEventListener2['default'].listen(window, 'scroll', this.checkPosition);
    this._onDocumentClickListener = _utilsEventListener2['default'].listen(_utilsDomUtils2['default'].ownerDocument(this), 'click', this.checkPositionWithEventLoop);
  },

  componentWillUnmount: function componentWillUnmount() {
    if (this._onWindowScrollListener) {
      this._onWindowScrollListener.remove();
    }

    if (this._onDocumentClickListener) {
      this._onDocumentClickListener.remove();
    }
  },

  componentDidUpdate: function componentDidUpdate(prevProps, prevState) {
    if (prevState.affixClass === this.state.affixClass) {
      this.checkPositionWithEventLoop();
    }
  }
};

exports['default'] = AffixMixin;
module.exports = exports['default'];
},{"./utils/EventListener":77,"./utils/domUtils":85,"babel-runtime/helpers/interop-require-default":94,"dom-helpers/query/offset":130,"react":453,"react-dom":249}],7:[function(require,module,exports){
'use strict';

var _extends = require('babel-runtime/helpers/extends')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

exports.__esModule = true;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _BootstrapMixin = require('./BootstrapMixin');

var _BootstrapMixin2 = _interopRequireDefault(_BootstrapMixin);

var Alert = _react2['default'].createClass({
  displayName: 'Alert',

  mixins: [_BootstrapMixin2['default']],

  propTypes: {
    onDismiss: _react2['default'].PropTypes.func,
    dismissAfter: _react2['default'].PropTypes.number,
    closeLabel: _react2['default'].PropTypes.string
  },

  getDefaultProps: function getDefaultProps() {
    return {
      bsClass: 'alert',
      bsStyle: 'info',
      closeLabel: 'Close Alert'
    };
  },

  renderDismissButton: function renderDismissButton() {
    return _react2['default'].createElement(
      'button',
      {
        type: 'button',
        className: 'close',
        onClick: this.props.onDismiss,
        'aria-hidden': 'true' },
      _react2['default'].createElement(
        'span',
        null,
        '×'
      )
    );
  },

  renderSrOnlyDismissButton: function renderSrOnlyDismissButton() {
    return _react2['default'].createElement(
      'button',
      {
        type: 'button',
        className: 'close sr-only',
        onClick: this.props.onDismiss },
      this.props.closeLabel
    );
  },

  render: function render() {
    var classes = this.getBsClassSet();
    var isDismissable = !!this.props.onDismiss;

    classes['alert-dismissable'] = isDismissable;

    return _react2['default'].createElement(
      'div',
      _extends({}, this.props, { role: 'alert', className: _classnames2['default'](this.props.className, classes) }),
      isDismissable ? this.renderDismissButton() : null,
      this.props.children,
      isDismissable ? this.renderSrOnlyDismissButton() : null
    );
  },

  componentDidMount: function componentDidMount() {
    if (this.props.dismissAfter && this.props.onDismiss) {
      this.dismissTimer = setTimeout(this.props.onDismiss, this.props.dismissAfter);
    }
  },

  componentWillUnmount: function componentWillUnmount() {
    clearTimeout(this.dismissTimer);
  }
});

exports['default'] = Alert;
module.exports = exports['default'];
},{"./BootstrapMixin":9,"babel-runtime/helpers/extends":92,"babel-runtime/helpers/interop-require-default":94,"classnames":122,"react":453}],8:[function(require,module,exports){
'use strict';

var _extends = require('babel-runtime/helpers/extends')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

exports.__esModule = true;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _utilsValidComponentChildren = require('./utils/ValidComponentChildren');

var _utilsValidComponentChildren2 = _interopRequireDefault(_utilsValidComponentChildren);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var Badge = _react2['default'].createClass({
  displayName: 'Badge',

  propTypes: {
    pullRight: _react2['default'].PropTypes.bool
  },

  getDefaultProps: function getDefaultProps() {
    return {
      pullRight: false
    };
  },

  hasContent: function hasContent() {
    return _utilsValidComponentChildren2['default'].hasValidComponent(this.props.children) || _react2['default'].Children.count(this.props.children) > 1 || typeof this.props.children === 'string' || typeof this.props.children === 'number';
  },

  render: function render() {
    var classes = {
      'pull-right': this.props.pullRight,
      'badge': this.hasContent()
    };
    return _react2['default'].createElement(
      'span',
      _extends({}, this.props, {
        className: _classnames2['default'](this.props.className, classes) }),
      this.props.children
    );
  }
});

exports['default'] = Badge;
module.exports = exports['default'];
},{"./utils/ValidComponentChildren":79,"babel-runtime/helpers/extends":92,"babel-runtime/helpers/interop-require-default":94,"classnames":122,"react":453}],9:[function(require,module,exports){
'use strict';

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

exports.__esModule = true;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _styleMaps = require('./styleMaps');

var _styleMaps2 = _interopRequireDefault(_styleMaps);

var _reactPropTypesLibKeyOf = require('react-prop-types/lib/keyOf');

var _reactPropTypesLibKeyOf2 = _interopRequireDefault(_reactPropTypesLibKeyOf);

var BootstrapMixin = {
  propTypes: {
    /**
     * bootstrap className
     * @private
     */
    bsClass: _reactPropTypesLibKeyOf2['default'](_styleMaps2['default'].CLASSES),
    /**
     * Style variants
     * @type {("default"|"primary"|"success"|"info"|"warning"|"danger"|"link")}
     */
    bsStyle: _react2['default'].PropTypes.oneOf(_styleMaps2['default'].STYLES),
    /**
     * Size variants
     * @type {("xsmall"|"small"|"medium"|"large"|"xs"|"sm"|"md"|"lg")}
     */
    bsSize: _reactPropTypesLibKeyOf2['default'](_styleMaps2['default'].SIZES)
  },

  getBsClassSet: function getBsClassSet() {
    var classes = {};

    var bsClass = this.props.bsClass && _styleMaps2['default'].CLASSES[this.props.bsClass];
    if (bsClass) {
      classes[bsClass] = true;

      var prefix = bsClass + '-';

      var bsSize = this.props.bsSize && _styleMaps2['default'].SIZES[this.props.bsSize];
      if (bsSize) {
        classes[prefix + bsSize] = true;
      }

      if (this.props.bsStyle) {
        if (_styleMaps2['default'].STYLES.indexOf(this.props.bsStyle) >= 0) {
          classes[prefix + this.props.bsStyle] = true;
        } else {
          classes[this.props.bsStyle] = true;
        }
      }
    }

    return classes;
  },

  prefixClass: function prefixClass(subClass) {
    return _styleMaps2['default'].CLASSES[this.props.bsClass] + '-' + subClass;
  }
};

exports['default'] = BootstrapMixin;
module.exports = exports['default'];
},{"./styleMaps":75,"babel-runtime/helpers/interop-require-default":94,"react":453,"react-prop-types/lib/keyOf":234}],10:[function(require,module,exports){
'use strict';

var _objectWithoutProperties = require('babel-runtime/helpers/object-without-properties')['default'];

var _extends = require('babel-runtime/helpers/extends')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

exports.__esModule = true;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _utilsValidComponentChildren = require('./utils/ValidComponentChildren');

var _utilsValidComponentChildren2 = _interopRequireDefault(_utilsValidComponentChildren);

var Breadcrumb = _react2['default'].createClass({
  displayName: 'Breadcrumb',

  propTypes: {
    /**
     * bootstrap className
     * @private
     */
    bsClass: _react2['default'].PropTypes.string
  },

  getDefaultProps: function getDefaultProps() {
    return {
      bsClass: 'breadcrumb'
    };
  },

  render: function render() {
    var _props = this.props;
    var className = _props.className;

    var props = _objectWithoutProperties(_props, ['className']);

    return _react2['default'].createElement(
      'ol',
      _extends({}, props, {
        role: 'navigation',
        'aria-label': 'breadcrumbs',
        className: _classnames2['default'](className, this.props.bsClass) }),
      _utilsValidComponentChildren2['default'].map(this.props.children, this.renderBreadcrumbItem)
    );
  },

  renderBreadcrumbItem: function renderBreadcrumbItem(child, index) {
    return _react.cloneElement(child, { key: child.key ? child.key : index });
  }
});

exports['default'] = Breadcrumb;
module.exports = exports['default'];
},{"./utils/ValidComponentChildren":79,"babel-runtime/helpers/extends":92,"babel-runtime/helpers/interop-require-default":94,"babel-runtime/helpers/object-without-properties":96,"classnames":122,"react":453}],11:[function(require,module,exports){
'use strict';

var _objectWithoutProperties = require('babel-runtime/helpers/object-without-properties')['default'];

var _extends = require('babel-runtime/helpers/extends')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

exports.__esModule = true;

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _warning = require('warning');

var _warning2 = _interopRequireDefault(_warning);

var _SafeAnchor = require('./SafeAnchor');

var _SafeAnchor2 = _interopRequireDefault(_SafeAnchor);

var BreadcrumbItem = _react2['default'].createClass({
  displayName: 'BreadcrumbItem',

  propTypes: {
    /**
     * If set to true, renders `span` instead of `a`
     */
    active: _react2['default'].PropTypes.bool,
    /**
     * HTML id for the wrapper `li` element
     */
    id: _react2['default'].PropTypes.oneOfType([_react2['default'].PropTypes.string, _react2['default'].PropTypes.number]),
    /**
     * HTML id for the inner `a` element
     */
    linkId: _react2['default'].PropTypes.oneOfType([_react2['default'].PropTypes.string, _react2['default'].PropTypes.number]),
    /**
     * `href` attribute for the inner `a` element
     */
    href: _react2['default'].PropTypes.string,
    /**
     * `title` attribute for the inner `a` element
     */
    title: _react2['default'].PropTypes.node,
    /**
     * `target` attribute for the inner `a` element
     */
    target: _react2['default'].PropTypes.string
  },

  getDefaultProps: function getDefaultProps() {
    return {
      active: false
    };
  },

  render: function render() {
    var _props = this.props;
    var active = _props.active;
    var className = _props.className;
    var id = _props.id;
    var linkId = _props.linkId;
    var children = _props.children;
    var href = _props.href;
    var title = _props.title;
    var target = _props.target;

    var props = _objectWithoutProperties(_props, ['active', 'className', 'id', 'linkId', 'children', 'href', 'title', 'target']);

    _warning2['default'](!(href && active), '[react-bootstrap] `href` and `active` properties cannot be set at the same time');

    var linkProps = {
      href: href,
      title: title,
      target: target,
      id: linkId
    };

    return _react2['default'].createElement(
      'li',
      { id: id, className: _classnames2['default'](className, { active: active }) },
      active ? _react2['default'].createElement(
        'span',
        props,
        children
      ) : _react2['default'].createElement(
        _SafeAnchor2['default'],
        _extends({}, props, linkProps),
        children
      )
    );
  }
});

exports['default'] = BreadcrumbItem;
module.exports = exports['default'];
},{"./SafeAnchor":64,"babel-runtime/helpers/extends":92,"babel-runtime/helpers/interop-require-default":94,"babel-runtime/helpers/object-without-properties":96,"classnames":122,"react":453,"warning":240}],12:[function(require,module,exports){
'use strict';

var _extends = require('babel-runtime/helpers/extends')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

exports.__esModule = true;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _BootstrapMixin = require('./BootstrapMixin');

var _BootstrapMixin2 = _interopRequireDefault(_BootstrapMixin);

var _reactPropTypesLibElementType = require('react-prop-types/lib/elementType');

var _reactPropTypesLibElementType2 = _interopRequireDefault(_reactPropTypesLibElementType);

var _ButtonInput = require('./ButtonInput');

var _ButtonInput2 = _interopRequireDefault(_ButtonInput);

var Button = _react2['default'].createClass({
  displayName: 'Button',

  mixins: [_BootstrapMixin2['default']],

  propTypes: {
    active: _react2['default'].PropTypes.bool,
    disabled: _react2['default'].PropTypes.bool,
    block: _react2['default'].PropTypes.bool,
    navItem: _react2['default'].PropTypes.bool,
    navDropdown: _react2['default'].PropTypes.bool,
    /**
     * You can use a custom element for this component
     */
    componentClass: _reactPropTypesLibElementType2['default'],
    href: _react2['default'].PropTypes.string,
    target: _react2['default'].PropTypes.string,
    /**
     * Defines HTML button type Attribute
     * @type {("button"|"reset"|"submit")}
     * @defaultValue 'button'
     */
    type: _react2['default'].PropTypes.oneOf(_ButtonInput2['default'].types)
  },

  getDefaultProps: function getDefaultProps() {
    return {
      active: false,
      block: false,
      bsClass: 'button',
      bsStyle: 'default',
      disabled: false,
      navItem: false,
      navDropdown: false
    };
  },

  render: function render() {
    var classes = this.props.navDropdown ? {} : this.getBsClassSet();
    var renderFuncName = undefined;

    classes = _extends({
      active: this.props.active,
      'btn-block': this.props.block
    }, classes);

    if (this.props.navItem) {
      return this.renderNavItem(classes);
    }

    renderFuncName = this.props.href || this.props.target || this.props.navDropdown ? 'renderAnchor' : 'renderButton';

    return this[renderFuncName](classes);
  },

  renderAnchor: function renderAnchor(classes) {
    var Component = this.props.componentClass || 'a';
    var href = this.props.href || '#';
    classes.disabled = this.props.disabled;

    return _react2['default'].createElement(
      Component,
      _extends({}, this.props, {
        href: href,
        className: _classnames2['default'](this.props.className, classes),
        role: 'button' }),
      this.props.children
    );
  },

  renderButton: function renderButton(classes) {
    var Component = this.props.componentClass || 'button';

    return _react2['default'].createElement(
      Component,
      _extends({}, this.props, {
        type: this.props.type || 'button',
        className: _classnames2['default'](this.props.className, classes) }),
      this.props.children
    );
  },

  renderNavItem: function renderNavItem(classes) {
    var liClasses = {
      active: this.props.active
    };

    return _react2['default'].createElement(
      'li',
      { className: _classnames2['default'](liClasses) },
      this.renderAnchor(classes)
    );
  }
});

exports['default'] = Button;
module.exports = exports['default'];
},{"./BootstrapMixin":9,"./ButtonInput":14,"babel-runtime/helpers/extends":92,"babel-runtime/helpers/interop-require-default":94,"classnames":122,"react":453,"react-prop-types/lib/elementType":232}],13:[function(require,module,exports){
'use strict';

var _extends = require('babel-runtime/helpers/extends')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

exports.__esModule = true;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _BootstrapMixin = require('./BootstrapMixin');

var _BootstrapMixin2 = _interopRequireDefault(_BootstrapMixin);

var _reactPropTypesLibAll = require('react-prop-types/lib/all');

var _reactPropTypesLibAll2 = _interopRequireDefault(_reactPropTypesLibAll);

var ButtonGroup = _react2['default'].createClass({
  displayName: 'ButtonGroup',

  mixins: [_BootstrapMixin2['default']],

  propTypes: {
    vertical: _react2['default'].PropTypes.bool,
    justified: _react2['default'].PropTypes.bool,
    /**
     * Display block buttons, only useful when used with the "vertical" prop.
     * @type {bool}
     */
    block: _reactPropTypesLibAll2['default'](_react2['default'].PropTypes.bool, function (props) {
      if (props.block && !props.vertical) {
        return new Error('The block property requires the vertical property to be set to have any effect');
      }
    })
  },

  getDefaultProps: function getDefaultProps() {
    return {
      block: false,
      bsClass: 'button-group',
      justified: false,
      vertical: false
    };
  },

  render: function render() {
    var classes = this.getBsClassSet();
    classes['btn-group'] = !this.props.vertical;
    classes['btn-group-vertical'] = this.props.vertical;
    classes['btn-group-justified'] = this.props.justified;
    classes['btn-block'] = this.props.block;

    return _react2['default'].createElement(
      'div',
      _extends({}, this.props, {
        className: _classnames2['default'](this.props.className, classes) }),
      this.props.children
    );
  }
});

exports['default'] = ButtonGroup;
module.exports = exports['default'];
},{"./BootstrapMixin":9,"babel-runtime/helpers/extends":92,"babel-runtime/helpers/interop-require-default":94,"classnames":122,"react":453,"react-prop-types/lib/all":229}],14:[function(require,module,exports){
'use strict';

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _objectWithoutProperties = require('babel-runtime/helpers/object-without-properties')['default'];

var _extends = require('babel-runtime/helpers/extends')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

exports.__esModule = true;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _Button = require('./Button');

var _Button2 = _interopRequireDefault(_Button);

var _FormGroup = require('./FormGroup');

var _FormGroup2 = _interopRequireDefault(_FormGroup);

var _InputBase2 = require('./InputBase');

var _InputBase3 = _interopRequireDefault(_InputBase2);

var _utilsChildrenValueInputValidation = require('./utils/childrenValueInputValidation');

var _utilsChildrenValueInputValidation2 = _interopRequireDefault(_utilsChildrenValueInputValidation);

var ButtonInput = (function (_InputBase) {
  _inherits(ButtonInput, _InputBase);

  function ButtonInput() {
    _classCallCheck(this, ButtonInput);

    _InputBase.apply(this, arguments);
  }

  ButtonInput.prototype.renderFormGroup = function renderFormGroup(children) {
    var _props = this.props;
    var bsStyle = _props.bsStyle;
    var value = _props.value;

    var other = _objectWithoutProperties(_props, ['bsStyle', 'value']);

    return _react2['default'].createElement(
      _FormGroup2['default'],
      other,
      children
    );
  };

  ButtonInput.prototype.renderInput = function renderInput() {
    var _props2 = this.props;
    var children = _props2.children;
    var value = _props2.value;

    var other = _objectWithoutProperties(_props2, ['children', 'value']);

    var val = children ? children : value;
    return _react2['default'].createElement(_Button2['default'], _extends({}, other, { componentClass: 'input', ref: 'input', key: 'input', value: val }));
  };

  return ButtonInput;
})(_InputBase3['default']);

ButtonInput.types = ['button', 'reset', 'submit'];

ButtonInput.defaultProps = {
  type: 'button'
};

ButtonInput.propTypes = {
  type: _react2['default'].PropTypes.oneOf(ButtonInput.types),
  bsStyle: function bsStyle() {
    // defer to Button propTypes of bsStyle
    return null;
  },
  children: _utilsChildrenValueInputValidation2['default'],
  value: _utilsChildrenValueInputValidation2['default']
};

exports['default'] = ButtonInput;
module.exports = exports['default'];
},{"./Button":12,"./FormGroup":28,"./InputBase":33,"./utils/childrenValueInputValidation":81,"babel-runtime/helpers/class-call-check":91,"babel-runtime/helpers/extends":92,"babel-runtime/helpers/inherits":93,"babel-runtime/helpers/interop-require-default":94,"babel-runtime/helpers/object-without-properties":96,"react":453}],15:[function(require,module,exports){
'use strict';

var _extends = require('babel-runtime/helpers/extends')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

exports.__esModule = true;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _BootstrapMixin = require('./BootstrapMixin');

var _BootstrapMixin2 = _interopRequireDefault(_BootstrapMixin);

var ButtonToolbar = _react2['default'].createClass({
  displayName: 'ButtonToolbar',

  mixins: [_BootstrapMixin2['default']],

  getDefaultProps: function getDefaultProps() {
    return {
      bsClass: 'button-toolbar'
    };
  },

  render: function render() {
    var classes = this.getBsClassSet();

    return _react2['default'].createElement(
      'div',
      _extends({}, this.props, {
        role: 'toolbar',
        className: _classnames2['default'](this.props.className, classes) }),
      this.props.children
    );
  }
});

exports['default'] = ButtonToolbar;
module.exports = exports['default'];
},{"./BootstrapMixin":9,"babel-runtime/helpers/extends":92,"babel-runtime/helpers/interop-require-default":94,"classnames":122,"react":453}],16:[function(require,module,exports){
'use strict';

var _extends = require('babel-runtime/helpers/extends')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

exports.__esModule = true;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _BootstrapMixin = require('./BootstrapMixin');

var _BootstrapMixin2 = _interopRequireDefault(_BootstrapMixin);

var _utilsValidComponentChildren = require('./utils/ValidComponentChildren');

var _utilsValidComponentChildren2 = _interopRequireDefault(_utilsValidComponentChildren);

var _Glyphicon = require('./Glyphicon');

var _Glyphicon2 = _interopRequireDefault(_Glyphicon);

var Carousel = _react2['default'].createClass({
  displayName: 'Carousel',

  mixins: [_BootstrapMixin2['default']],

  propTypes: {
    slide: _react2['default'].PropTypes.bool,
    indicators: _react2['default'].PropTypes.bool,
    interval: _react2['default'].PropTypes.number,
    controls: _react2['default'].PropTypes.bool,
    pauseOnHover: _react2['default'].PropTypes.bool,
    wrap: _react2['default'].PropTypes.bool,
    onSelect: _react2['default'].PropTypes.func,
    onSlideEnd: _react2['default'].PropTypes.func,
    activeIndex: _react2['default'].PropTypes.number,
    defaultActiveIndex: _react2['default'].PropTypes.number,
    direction: _react2['default'].PropTypes.oneOf(['prev', 'next']),
    prevIcon: _react2['default'].PropTypes.node,
    nextIcon: _react2['default'].PropTypes.node
  },

  getDefaultProps: function getDefaultProps() {
    return {
      slide: true,
      interval: 5000,
      pauseOnHover: true,
      wrap: true,
      indicators: true,
      controls: true,
      prevIcon: _react2['default'].createElement(_Glyphicon2['default'], { glyph: 'chevron-left' }),
      nextIcon: _react2['default'].createElement(_Glyphicon2['default'], { glyph: 'chevron-right' })
    };
  },

  getInitialState: function getInitialState() {
    return {
      activeIndex: this.props.defaultActiveIndex == null ? 0 : this.props.defaultActiveIndex,
      previousActiveIndex: null,
      direction: null
    };
  },

  getDirection: function getDirection(prevIndex, index) {
    if (prevIndex === index) {
      return null;
    }

    return prevIndex > index ? 'prev' : 'next';
  },

  componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
    var activeIndex = this.getActiveIndex();

    if (nextProps.activeIndex != null && nextProps.activeIndex !== activeIndex) {
      clearTimeout(this.timeout);
      this.setState({
        previousActiveIndex: activeIndex,
        direction: nextProps.direction != null ? nextProps.direction : this.getDirection(activeIndex, nextProps.activeIndex)
      });
    }
  },

  componentDidMount: function componentDidMount() {
    this.waitForNext();
  },

  componentWillUnmount: function componentWillUnmount() {
    clearTimeout(this.timeout);
  },

  next: function next(e) {
    if (e) {
      e.preventDefault();
    }

    var index = this.getActiveIndex() + 1;
    var count = _utilsValidComponentChildren2['default'].numberOf(this.props.children);

    if (index > count - 1) {
      if (!this.props.wrap) {
        return;
      }
      index = 0;
    }

    this.handleSelect(index, 'next');
  },

  prev: function prev(e) {
    if (e) {
      e.preventDefault();
    }

    var index = this.getActiveIndex() - 1;

    if (index < 0) {
      if (!this.props.wrap) {
        return;
      }
      index = _utilsValidComponentChildren2['default'].numberOf(this.props.children) - 1;
    }

    this.handleSelect(index, 'prev');
  },

  pause: function pause() {
    this.isPaused = true;
    clearTimeout(this.timeout);
  },

  play: function play() {
    this.isPaused = false;
    this.waitForNext();
  },

  waitForNext: function waitForNext() {
    if (!this.isPaused && this.props.slide && this.props.interval && this.props.activeIndex == null) {
      this.timeout = setTimeout(this.next, this.props.interval);
    }
  },

  handleMouseOver: function handleMouseOver() {
    if (this.props.pauseOnHover) {
      this.pause();
    }
  },

  handleMouseOut: function handleMouseOut() {
    if (this.isPaused) {
      this.play();
    }
  },

  render: function render() {
    var classes = {
      carousel: true,
      slide: this.props.slide
    };

    return _react2['default'].createElement(
      'div',
      _extends({}, this.props, {
        className: _classnames2['default'](this.props.className, classes),
        onMouseOver: this.handleMouseOver,
        onMouseOut: this.handleMouseOut }),
      this.props.indicators ? this.renderIndicators() : null,
      _react2['default'].createElement(
        'div',
        { className: 'carousel-inner', ref: 'inner' },
        _utilsValidComponentChildren2['default'].map(this.props.children, this.renderItem)
      ),
      this.props.controls ? this.renderControls() : null
    );
  },

  renderPrev: function renderPrev() {
    return _react2['default'].createElement(
      'a',
      { className: 'left carousel-control', href: '#prev', key: 0, onClick: this.prev },
      this.props.prevIcon
    );
  },

  renderNext: function renderNext() {
    return _react2['default'].createElement(
      'a',
      { className: 'right carousel-control', href: '#next', key: 1, onClick: this.next },
      this.props.nextIcon
    );
  },

  renderControls: function renderControls() {
    if (!this.props.wrap) {
      var activeIndex = this.getActiveIndex();
      var count = _utilsValidComponentChildren2['default'].numberOf(this.props.children);

      return [activeIndex !== 0 ? this.renderPrev() : null, activeIndex !== count - 1 ? this.renderNext() : null];
    }

    return [this.renderPrev(), this.renderNext()];
  },

  renderIndicator: function renderIndicator(child, index) {
    var className = index === this.getActiveIndex() ? 'active' : null;

    return _react2['default'].createElement('li', {
      key: index,
      className: className,
      onClick: this.handleSelect.bind(this, index, null) });
  },

  renderIndicators: function renderIndicators() {
    var _this = this;

    var indicators = [];
    _utilsValidComponentChildren2['default'].forEach(this.props.children, function (child, index) {
      indicators.push(_this.renderIndicator(child, index),

      // Force whitespace between indicator elements, bootstrap
      // requires this for correct spacing of elements.
      ' ');
    }, this);

    return _react2['default'].createElement(
      'ol',
      { className: 'carousel-indicators' },
      indicators
    );
  },

  getActiveIndex: function getActiveIndex() {
    return this.props.activeIndex != null ? this.props.activeIndex : this.state.activeIndex;
  },

  handleItemAnimateOutEnd: function handleItemAnimateOutEnd() {
    var _this2 = this;

    this.setState({
      previousActiveIndex: null,
      direction: null
    }, function () {
      _this2.waitForNext();

      if (_this2.props.onSlideEnd) {
        _this2.props.onSlideEnd();
      }
    });
  },

  renderItem: function renderItem(child, index) {
    var activeIndex = this.getActiveIndex();
    var isActive = index === activeIndex;
    var isPreviousActive = this.state.previousActiveIndex != null && this.state.previousActiveIndex === index && this.props.slide;

    return _react.cloneElement(child, {
      active: isActive,
      ref: child.ref,
      key: child.key ? child.key : index,
      index: index,
      animateOut: isPreviousActive,
      animateIn: isActive && this.state.previousActiveIndex != null && this.props.slide,
      direction: this.state.direction,
      onAnimateOutEnd: isPreviousActive ? this.handleItemAnimateOutEnd : null
    });
  },

  handleSelect: function handleSelect(index, direction) {
    clearTimeout(this.timeout);

    if (this.isMounted()) {
      var previousActiveIndex = this.getActiveIndex();
      direction = direction || this.getDirection(previousActiveIndex, index);

      if (this.props.onSelect) {
        this.props.onSelect(index, direction);
      }

      if (this.props.activeIndex == null && index !== previousActiveIndex) {
        if (this.state.previousActiveIndex != null) {
          // If currently animating don't activate the new index.
          // TODO: look into queuing this canceled call and
          // animating after the current animation has ended.
          return;
        }

        this.setState({
          activeIndex: index,
          previousActiveIndex: previousActiveIndex,
          direction: direction
        });
      }
    }
  }
});

exports['default'] = Carousel;
module.exports = exports['default'];
},{"./BootstrapMixin":9,"./Glyphicon":29,"./utils/ValidComponentChildren":79,"babel-runtime/helpers/extends":92,"babel-runtime/helpers/interop-require-default":94,"classnames":122,"react":453}],17:[function(require,module,exports){
'use strict';

var _extends = require('babel-runtime/helpers/extends')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

exports.__esModule = true;

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _utilsTransitionEvents = require('./utils/TransitionEvents');

var _utilsTransitionEvents2 = _interopRequireDefault(_utilsTransitionEvents);

var CarouselItem = _react2['default'].createClass({
  displayName: 'CarouselItem',

  propTypes: {
    direction: _react2['default'].PropTypes.oneOf(['prev', 'next']),
    onAnimateOutEnd: _react2['default'].PropTypes.func,
    active: _react2['default'].PropTypes.bool,
    animateIn: _react2['default'].PropTypes.bool,
    animateOut: _react2['default'].PropTypes.bool,
    caption: _react2['default'].PropTypes.node,
    index: _react2['default'].PropTypes.number
  },

  getInitialState: function getInitialState() {
    return {
      direction: null
    };
  },

  getDefaultProps: function getDefaultProps() {
    return {
      active: false,
      animateIn: false,
      animateOut: false
    };
  },

  handleAnimateOutEnd: function handleAnimateOutEnd() {
    if (this.props.onAnimateOutEnd && this.isMounted()) {
      this.props.onAnimateOutEnd(this.props.index);
    }
  },

  componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
    if (this.props.active !== nextProps.active) {
      this.setState({
        direction: null
      });
    }
  },

  componentDidUpdate: function componentDidUpdate(prevProps) {
    if (!this.props.active && prevProps.active) {
      _utilsTransitionEvents2['default'].addEndEventListener(_reactDom2['default'].findDOMNode(this), this.handleAnimateOutEnd);
    }

    if (this.props.active !== prevProps.active) {
      setTimeout(this.startAnimation, 20);
    }
  },

  startAnimation: function startAnimation() {
    if (!this.isMounted()) {
      return;
    }

    this.setState({
      direction: this.props.direction === 'prev' ? 'right' : 'left'
    });
  },

  render: function render() {
    var classes = {
      item: true,
      active: this.props.active && !this.props.animateIn || this.props.animateOut,
      next: this.props.active && this.props.animateIn && this.props.direction === 'next',
      prev: this.props.active && this.props.animateIn && this.props.direction === 'prev'
    };

    if (this.state.direction && (this.props.animateIn || this.props.animateOut)) {
      classes[this.state.direction] = true;
    }

    return _react2['default'].createElement(
      'div',
      _extends({}, this.props, { className: _classnames2['default'](this.props.className, classes) }),
      this.props.children,
      this.props.caption ? this.renderCaption() : null
    );
  },

  renderCaption: function renderCaption() {
    return _react2['default'].createElement(
      'div',
      { className: 'carousel-caption' },
      this.props.caption
    );
  }
});

exports['default'] = CarouselItem;
module.exports = exports['default'];
},{"./utils/TransitionEvents":78,"babel-runtime/helpers/extends":92,"babel-runtime/helpers/interop-require-default":94,"classnames":122,"react":453,"react-dom":249}],18:[function(require,module,exports){
'use strict';

var _extends = require('babel-runtime/helpers/extends')['default'];

var _Object$keys = require('babel-runtime/core-js/object/keys')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

exports.__esModule = true;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _styleMaps = require('./styleMaps');

var _styleMaps2 = _interopRequireDefault(_styleMaps);

var _reactPropTypesLibElementType = require('react-prop-types/lib/elementType');

var _reactPropTypesLibElementType2 = _interopRequireDefault(_reactPropTypesLibElementType);

var Col = _react2['default'].createClass({
  displayName: 'Col',

  propTypes: {
    /**
     * The number of columns you wish to span
     *
     * for Extra small devices Phones (<768px)
     *
     * class-prefix `col-xs-`
     */
    xs: _react2['default'].PropTypes.number,
    /**
     * The number of columns you wish to span
     *
     * for Small devices Tablets (≥768px)
     *
     * class-prefix `col-sm-`
     */
    sm: _react2['default'].PropTypes.number,
    /**
     * The number of columns you wish to span
     *
     * for Medium devices Desktops (≥992px)
     *
     * class-prefix `col-md-`
     */
    md: _react2['default'].PropTypes.number,
    /**
     * The number of columns you wish to span
     *
     * for Large devices Desktops (≥1200px)
     *
     * class-prefix `col-lg-`
     */
    lg: _react2['default'].PropTypes.number,
    /**
     * Move columns to the right
     *
     * for Extra small devices Phones
     *
     * class-prefix `col-xs-offset-`
     */
    xsOffset: _react2['default'].PropTypes.number,
    /**
     * Move columns to the right
     *
     * for Small devices Tablets
     *
     * class-prefix `col-sm-offset-`
     */
    smOffset: _react2['default'].PropTypes.number,
    /**
     * Move columns to the right
     *
     * for Medium devices Desktops
     *
     * class-prefix `col-md-offset-`
     */
    mdOffset: _react2['default'].PropTypes.number,
    /**
     * Move columns to the right
     *
     * for Large devices Desktops
     *
     * class-prefix `col-lg-offset-`
     */
    lgOffset: _react2['default'].PropTypes.number,
    /**
     * Change the order of grid columns to the right
     *
     * for Extra small devices Phones
     *
     * class-prefix `col-xs-push-`
     */
    xsPush: _react2['default'].PropTypes.number,
    /**
     * Change the order of grid columns to the right
     *
     * for Small devices Tablets
     *
     * class-prefix `col-sm-push-`
     */
    smPush: _react2['default'].PropTypes.number,
    /**
     * Change the order of grid columns to the right
     *
     * for Medium devices Desktops
     *
     * class-prefix `col-md-push-`
     */
    mdPush: _react2['default'].PropTypes.number,
    /**
     * Change the order of grid columns to the right
     *
     * for Large devices Desktops
     *
     * class-prefix `col-lg-push-`
     */
    lgPush: _react2['default'].PropTypes.number,
    /**
     * Change the order of grid columns to the left
     *
     * for Extra small devices Phones
     *
     * class-prefix `col-xs-pull-`
     */
    xsPull: _react2['default'].PropTypes.number,
    /**
     * Change the order of grid columns to the left
     *
     * for Small devices Tablets
     *
     * class-prefix `col-sm-pull-`
     */
    smPull: _react2['default'].PropTypes.number,
    /**
     * Change the order of grid columns to the left
     *
     * for Medium devices Desktops
     *
     * class-prefix `col-md-pull-`
     */
    mdPull: _react2['default'].PropTypes.number,
    /**
     * Change the order of grid columns to the left
     *
     * for Large devices Desktops
     *
     * class-prefix `col-lg-pull-`
     */
    lgPull: _react2['default'].PropTypes.number,
    /**
     * You can use a custom element for this component
     */
    componentClass: _reactPropTypesLibElementType2['default']
  },

  getDefaultProps: function getDefaultProps() {
    return {
      componentClass: 'div'
    };
  },

  render: function render() {
    var _this = this;

    var ComponentClass = this.props.componentClass;
    var classes = {};

    _Object$keys(_styleMaps2['default'].SIZES).forEach(function (key) {
      var size = _styleMaps2['default'].SIZES[key];
      var prop = size;
      var classPart = size + '-';

      if (_this.props[prop]) {
        classes['col-' + classPart + _this.props[prop]] = true;
      }

      prop = size + 'Offset';
      classPart = size + '-offset-';
      if (_this.props[prop] >= 0) {
        classes['col-' + classPart + _this.props[prop]] = true;
      }

      prop = size + 'Push';
      classPart = size + '-push-';
      if (_this.props[prop] >= 0) {
        classes['col-' + classPart + _this.props[prop]] = true;
      }

      prop = size + 'Pull';
      classPart = size + '-pull-';
      if (_this.props[prop] >= 0) {
        classes['col-' + classPart + _this.props[prop]] = true;
      }
    }, this);

    return _react2['default'].createElement(
      ComponentClass,
      _extends({}, this.props, { className: _classnames2['default'](this.props.className, classes) }),
      this.props.children
    );
  }
});

exports['default'] = Col;
module.exports = exports['default'];
},{"./styleMaps":75,"babel-runtime/core-js/object/keys":89,"babel-runtime/helpers/extends":92,"babel-runtime/helpers/interop-require-default":94,"classnames":122,"react":453,"react-prop-types/lib/elementType":232}],19:[function(require,module,exports){
'use strict';

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _extends = require('babel-runtime/helpers/extends')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

exports.__esModule = true;

var _domHelpersStyle = require('dom-helpers/style');

var _domHelpersStyle2 = _interopRequireDefault(_domHelpersStyle);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactOverlaysLibTransition = require('react-overlays/lib/Transition');

var _reactOverlaysLibTransition2 = _interopRequireDefault(_reactOverlaysLibTransition);

var _reactPropTypesLibDeprecated = require('react-prop-types/lib/deprecated');

var _reactPropTypesLibDeprecated2 = _interopRequireDefault(_reactPropTypesLibDeprecated);

var _utilsCreateChainedFunction = require('./utils/createChainedFunction');

var _utilsCreateChainedFunction2 = _interopRequireDefault(_utilsCreateChainedFunction);

var capitalize = function capitalize(str) {
  return str[0].toUpperCase() + str.substr(1);
};

// reading a dimension prop will cause the browser to recalculate,
// which will let our animations work
var triggerBrowserReflow = function triggerBrowserReflow(node) {
  return node.offsetHeight;
};

var MARGINS = {
  height: ['marginTop', 'marginBottom'],
  width: ['marginLeft', 'marginRight']
};

function getDimensionValue(dimension, elem) {
  var value = elem['offset' + capitalize(dimension)];
  var margins = MARGINS[dimension];

  return value + parseInt(_domHelpersStyle2['default'](elem, margins[0]), 10) + parseInt(_domHelpersStyle2['default'](elem, margins[1]), 10);
}

var Collapse = (function (_React$Component) {
  _inherits(Collapse, _React$Component);

  function Collapse(props, context) {
    _classCallCheck(this, Collapse);

    _React$Component.call(this, props, context);

    this.onEnterListener = this.handleEnter.bind(this);
    this.onEnteringListener = this.handleEntering.bind(this);
    this.onEnteredListener = this.handleEntered.bind(this);
    this.onExitListener = this.handleExit.bind(this);
    this.onExitingListener = this.handleExiting.bind(this);
  }

  // Explicitly copied from Transition for doc generation.
  // TODO: Remove duplication once #977 is resolved.

  Collapse.prototype.render = function render() {
    var enter = _utilsCreateChainedFunction2['default'](this.onEnterListener, this.props.onEnter);
    var entering = _utilsCreateChainedFunction2['default'](this.onEnteringListener, this.props.onEntering);
    var entered = _utilsCreateChainedFunction2['default'](this.onEnteredListener, this.props.onEntered);
    var exit = _utilsCreateChainedFunction2['default'](this.onExitListener, this.props.onExit);
    var exiting = _utilsCreateChainedFunction2['default'](this.onExitingListener, this.props.onExiting);

    return _react2['default'].createElement(
      _reactOverlaysLibTransition2['default'],
      _extends({
        ref: 'transition'
      }, this.props, {
        'aria-expanded': this.props.role ? this.props['in'] : null,
        className: this._dimension() === 'width' ? 'width' : '',
        exitedClassName: 'collapse',
        exitingClassName: 'collapsing',
        enteredClassName: 'collapse in',
        enteringClassName: 'collapsing',
        onEnter: enter,
        onEntering: entering,
        onEntered: entered,
        onExit: exit,
        onExiting: exiting,
        onExited: this.props.onExited
      }),
      this.props.children
    );
  };

  /* -- Expanding -- */

  Collapse.prototype.handleEnter = function handleEnter(elem) {
    var dimension = this._dimension();
    elem.style[dimension] = '0';
  };

  Collapse.prototype.handleEntering = function handleEntering(elem) {
    var dimension = this._dimension();

    elem.style[dimension] = this._getScrollDimensionValue(elem, dimension);
  };

  Collapse.prototype.handleEntered = function handleEntered(elem) {
    var dimension = this._dimension();
    elem.style[dimension] = null;
  };

  /* -- Collapsing -- */

  Collapse.prototype.handleExit = function handleExit(elem) {
    var dimension = this._dimension();

    elem.style[dimension] = this.props.getDimensionValue(dimension, elem) + 'px';
  };

  Collapse.prototype.handleExiting = function handleExiting(elem) {
    var dimension = this._dimension();

    triggerBrowserReflow(elem);
    elem.style[dimension] = '0';
  };

  Collapse.prototype._dimension = function _dimension() {
    return typeof this.props.dimension === 'function' ? this.props.dimension() : this.props.dimension;
  };

  // for testing

  Collapse.prototype._getTransitionInstance = function _getTransitionInstance() {
    return this.refs.transition;
  };

  Collapse.prototype._getScrollDimensionValue = function _getScrollDimensionValue(elem, dimension) {
    return elem['scroll' + capitalize(dimension)] + 'px';
  };

  return Collapse;
})(_react2['default'].Component);

Collapse.propTypes = {
  /**
   * Show the component; triggers the expand or collapse animation
   */
  'in': _react2['default'].PropTypes.bool,

  /**
   * Unmount the component (remove it from the DOM) when it is collapsed
   */
  unmountOnExit: _react2['default'].PropTypes.bool,

  /**
   * Run the expand animation when the component mounts, if it is initially
   * shown
   */
  transitionAppear: _react2['default'].PropTypes.bool,

  /**
   * Duration of the collapse animation in milliseconds, to ensure that
   * finishing callbacks are fired even if the original browser transition end
   * events are canceled
   */
  timeout: _react2['default'].PropTypes.number,

  /**
   * duration
   * @private
   */
  duration: _reactPropTypesLibDeprecated2['default'](_react2['default'].PropTypes.number, 'Use `timeout`.'),

  /**
   * Callback fired before the component expands
   */
  onEnter: _react2['default'].PropTypes.func,
  /**
   * Callback fired after the component starts to expand
   */
  onEntering: _react2['default'].PropTypes.func,
  /**
   * Callback fired after the component has expanded
   */
  onEntered: _react2['default'].PropTypes.func,
  /**
   * Callback fired before the component collapses
   */
  onExit: _react2['default'].PropTypes.func,
  /**
   * Callback fired after the component starts to collapse
   */
  onExiting: _react2['default'].PropTypes.func,
  /**
   * Callback fired after the component has collapsed
   */
  onExited: _react2['default'].PropTypes.func,

  /**
   * The dimension used when collapsing, or a function that returns the
   * dimension
   *
   * _Note: Bootstrap only partially supports 'width'!
   * You will need to supply your own CSS animation for the `.width` CSS class._
   */
  dimension: _react2['default'].PropTypes.oneOfType([_react2['default'].PropTypes.oneOf(['height', 'width']), _react2['default'].PropTypes.func]),

  /**
   * Function that returns the height or width of the animating DOM node
   *
   * Allows for providing some custom logic for how much the Collapse component
   * should animate in its specified dimension. Called with the current
   * dimension prop value and the DOM node.
   */
  getDimensionValue: _react2['default'].PropTypes.func,

  /**
   * ARIA role of collapsible element
   */
  role: _react2['default'].PropTypes.string
};

Collapse.defaultProps = {
  'in': false,
  timeout: 300,
  unmountOnExit: false,
  transitionAppear: false,

  dimension: 'height',
  getDimensionValue: getDimensionValue
};

exports['default'] = Collapse;
module.exports = exports['default'];
},{"./utils/createChainedFunction":82,"babel-runtime/helpers/class-call-check":91,"babel-runtime/helpers/extends":92,"babel-runtime/helpers/inherits":93,"babel-runtime/helpers/interop-require-default":94,"dom-helpers/style":136,"react":453,"react-overlays/lib/Transition":220,"react-prop-types/lib/deprecated":231}],20:[function(require,module,exports){
'use strict';

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

exports.__esModule = true;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _BootstrapMixin = require('./BootstrapMixin');

var _BootstrapMixin2 = _interopRequireDefault(_BootstrapMixin);

var _Collapse = require('./Collapse');

var _Collapse2 = _interopRequireDefault(_Collapse);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _utilsValidComponentChildren = require('./utils/ValidComponentChildren');

var _utilsValidComponentChildren2 = _interopRequireDefault(_utilsValidComponentChildren);

var _utilsCreateChainedFunction = require('./utils/createChainedFunction');

var _utilsCreateChainedFunction2 = _interopRequireDefault(_utilsCreateChainedFunction);

var CollapsibleNav = _react2['default'].createClass({
  displayName: 'CollapsibleNav',

  mixins: [_BootstrapMixin2['default']],

  propTypes: {
    onSelect: _react2['default'].PropTypes.func,
    activeHref: _react2['default'].PropTypes.string,
    activeKey: _react2['default'].PropTypes.any,
    collapsible: _react2['default'].PropTypes.bool,
    expanded: _react2['default'].PropTypes.bool,
    eventKey: _react2['default'].PropTypes.any
  },

  getDefaultProps: function getDefaultProps() {
    return {
      collapsible: false,
      expanded: false
    };
  },

  render: function render() {
    /*
     * this.props.collapsible is set in NavBar when an eventKey is supplied.
     */
    var classes = this.props.collapsible ? 'navbar-collapse' : null;
    var renderChildren = this.props.collapsible ? this.renderCollapsibleNavChildren : this.renderChildren;

    var nav = _react2['default'].createElement(
      'div',
      { eventKey: this.props.eventKey, className: _classnames2['default'](this.props.className, classes) },
      _utilsValidComponentChildren2['default'].map(this.props.children, renderChildren)
    );

    if (this.props.collapsible) {
      return _react2['default'].createElement(
        _Collapse2['default'],
        { 'in': this.props.expanded },
        nav
      );
    }
    return nav;
  },

  getChildActiveProp: function getChildActiveProp(child) {
    if (child.props.active) {
      return true;
    }
    if (this.props.activeKey != null) {
      if (child.props.eventKey === this.props.activeKey) {
        return true;
      }
    }
    if (this.props.activeHref != null) {
      if (child.props.href === this.props.activeHref) {
        return true;
      }
    }

    return child.props.active;
  },

  renderChildren: function renderChildren(child, index) {
    var key = child.key ? child.key : index;
    return _react.cloneElement(child, {
      activeKey: this.props.activeKey,
      activeHref: this.props.activeHref,
      ref: 'nocollapse_' + key,
      key: key,
      navItem: true
    });
  },

  renderCollapsibleNavChildren: function renderCollapsibleNavChildren(child, index) {
    var key = child.key ? child.key : index;
    return _react.cloneElement(child, {
      active: this.getChildActiveProp(child),
      activeKey: this.props.activeKey,
      activeHref: this.props.activeHref,
      onSelect: _utilsCreateChainedFunction2['default'](child.props.onSelect, this.props.onSelect),
      ref: 'collapsible_' + key,
      key: key,
      navItem: true
    });
  }
});

exports['default'] = CollapsibleNav;
module.exports = exports['default'];
},{"./BootstrapMixin":9,"./Collapse":19,"./utils/ValidComponentChildren":79,"./utils/createChainedFunction":82,"babel-runtime/helpers/interop-require-default":94,"classnames":122,"react":453}],21:[function(require,module,exports){
'use strict';

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _extends = require('babel-runtime/helpers/extends')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

exports.__esModule = true;

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _domHelpersActiveElement = require('dom-helpers/activeElement');

var _domHelpersActiveElement2 = _interopRequireDefault(_domHelpersActiveElement);

var _domHelpersQueryContains = require('dom-helpers/query/contains');

var _domHelpersQueryContains2 = _interopRequireDefault(_domHelpersQueryContains);

var _keycode = require('keycode');

var _keycode2 = _interopRequireDefault(_keycode);

var _lodashCompatCollectionFind = require('lodash-compat/collection/find');

var _lodashCompatCollectionFind2 = _interopRequireDefault(_lodashCompatCollectionFind);

var _lodashCompatObjectOmit = require('lodash-compat/object/omit');

var _lodashCompatObjectOmit2 = _interopRequireDefault(_lodashCompatObjectOmit);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _reactPropTypesLibAll = require('react-prop-types/lib/all');

var _reactPropTypesLibAll2 = _interopRequireDefault(_reactPropTypesLibAll);

var _reactPropTypesLibElementType = require('react-prop-types/lib/elementType');

var _reactPropTypesLibElementType2 = _interopRequireDefault(_reactPropTypesLibElementType);

var _reactPropTypesLibIsRequiredForA11y = require('react-prop-types/lib/isRequiredForA11y');

var _reactPropTypesLibIsRequiredForA11y2 = _interopRequireDefault(_reactPropTypesLibIsRequiredForA11y);

var _uncontrollable = require('uncontrollable');

var _uncontrollable2 = _interopRequireDefault(_uncontrollable);

var _ButtonGroup = require('./ButtonGroup');

var _ButtonGroup2 = _interopRequireDefault(_ButtonGroup);

var _DropdownMenu = require('./DropdownMenu');

var _DropdownMenu2 = _interopRequireDefault(_DropdownMenu);

var _DropdownToggle = require('./DropdownToggle');

var _DropdownToggle2 = _interopRequireDefault(_DropdownToggle);

var _utilsCreateChainedFunction = require('./utils/createChainedFunction');

var _utilsCreateChainedFunction2 = _interopRequireDefault(_utilsCreateChainedFunction);

var _utilsCustomPropTypes = require('./utils/CustomPropTypes');

var _utilsCustomPropTypes2 = _interopRequireDefault(_utilsCustomPropTypes);

var _utilsValidComponentChildren = require('./utils/ValidComponentChildren');

var _utilsValidComponentChildren2 = _interopRequireDefault(_utilsValidComponentChildren);

var TOGGLE_REF = 'toggle-btn';
var TOGGLE_ROLE = _DropdownToggle2['default'].defaultProps.bsRole;
var MENU_ROLE = _DropdownMenu2['default'].defaultProps.bsRole;

var Dropdown = (function (_React$Component) {
  _inherits(Dropdown, _React$Component);

  function Dropdown(props) {
    _classCallCheck(this, Dropdown);

    _React$Component.call(this, props);

    this.Toggle = _DropdownToggle2['default'];

    this.toggleOpen = this.toggleOpen.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.extractChildren = this.extractChildren.bind(this);

    this.refineMenu = this.refineMenu.bind(this);
    this.refineToggle = this.refineToggle.bind(this);

    this.childExtractors = [{
      key: 'toggle',
      matches: function matches(child) {
        return child.props.bsRole === TOGGLE_ROLE;
      },
      refine: this.refineToggle
    }, {
      key: 'menu',
      exclusive: true,
      matches: function matches(child) {
        return child.props.bsRole === MENU_ROLE;
      },
      refine: this.refineMenu
    }];

    this.state = {};

    this.lastOpenEventType = null;
  }

  Dropdown.prototype.componentDidMount = function componentDidMount() {
    this.focusNextOnOpen();
  };

  Dropdown.prototype.componentWillUpdate = function componentWillUpdate(nextProps) {
    if (!nextProps.open && this.props.open) {
      this._focusInDropdown = _domHelpersQueryContains2['default'](_reactDom2['default'].findDOMNode(this.refs.menu), _domHelpersActiveElement2['default'](document));
    }
  };

  Dropdown.prototype.componentDidUpdate = function componentDidUpdate(prevProps) {
    if (this.props.open && !prevProps.open) {
      this.focusNextOnOpen();
    }

    if (!this.props.open && prevProps.open) {
      // if focus hasn't already moved from the menu lets return it
      // to the toggle
      if (this._focusInDropdown) {
        this._focusInDropdown = false;
        this.focus();
      }
    }
  };

  Dropdown.prototype.render = function render() {
    var children = this.extractChildren();
    var Component = this.props.componentClass;

    var props = _lodashCompatObjectOmit2['default'](this.props, ['id', 'role']);

    var rootClasses = {
      open: this.props.open,
      disabled: this.props.disabled,
      dropdown: !this.props.dropup,
      dropup: this.props.dropup
    };

    return _react2['default'].createElement(
      Component,
      _extends({}, props, {
        tabIndex: '-1',
        className: _classnames2['default'](this.props.className, rootClasses)
      }),
      children
    );
  };

  Dropdown.prototype.toggleOpen = function toggleOpen() {
    var eventType = arguments.length <= 0 || arguments[0] === undefined ? null : arguments[0];

    var open = !this.props.open;

    if (open) {
      this.lastOpenEventType = eventType;
    }

    if (this.props.onToggle) {
      this.props.onToggle(open);
    }
  };

  Dropdown.prototype.handleClick = function handleClick() {
    if (this.props.disabled) {
      return;
    }

    this.toggleOpen('click');
  };

  Dropdown.prototype.handleKeyDown = function handleKeyDown(event) {
    if (this.props.disabled) {
      return;
    }

    switch (event.keyCode) {
      case _keycode2['default'].codes.down:
        if (!this.props.open) {
          this.toggleOpen('keydown');
        } else if (this.refs.menu.focusNext) {
          this.refs.menu.focusNext();
        }
        event.preventDefault();
        break;
      case _keycode2['default'].codes.esc:
      case _keycode2['default'].codes.tab:
        this.handleClose(event);
        break;
      default:
    }
  };

  Dropdown.prototype.handleClose = function handleClose() {
    if (!this.props.open) {
      return;
    }

    this.toggleOpen();
  };

  Dropdown.prototype.focusNextOnOpen = function focusNextOnOpen() {
    var menu = this.refs.menu;

    if (!menu.focusNext) {
      return;
    }

    if (this.lastOpenEventType === 'keydown' || this.props.role === 'menuitem') {
      menu.focusNext();
    }
  };

  Dropdown.prototype.focus = function focus() {
    var toggle = _reactDom2['default'].findDOMNode(this.refs[TOGGLE_REF]);

    if (toggle && toggle.focus) {
      toggle.focus();
    }
  };

  Dropdown.prototype.extractChildren = function extractChildren() {
    var _this = this;

    var open = !!this.props.open;
    var seen = {};

    return _utilsValidComponentChildren2['default'].map(this.props.children, function (child) {
      var extractor = _lodashCompatCollectionFind2['default'](_this.childExtractors, function (x) {
        return x.matches(child);
      });

      if (extractor) {
        if (seen[extractor.key]) {
          return false;
        }

        seen[extractor.key] = extractor.exclusive;
        child = extractor.refine(child, open);
      }

      return child;
    });
  };

  Dropdown.prototype.refineMenu = function refineMenu(menu, open) {
    var menuProps = {
      ref: 'menu',
      open: open,
      labelledBy: this.props.id,
      pullRight: this.props.pullRight
    };

    menuProps.onClose = _utilsCreateChainedFunction2['default'](menu.props.onClose, this.props.onClose, this.handleClose);

    menuProps.onSelect = _utilsCreateChainedFunction2['default'](menu.props.onSelect, this.props.onSelect, this.handleClose);

    return _react.cloneElement(menu, menuProps, menu.props.children);
  };

  Dropdown.prototype.refineToggle = function refineToggle(toggle, open) {
    var toggleProps = {
      open: open,
      id: this.props.id,
      ref: TOGGLE_REF,
      role: this.props.role
    };

    toggleProps.onClick = _utilsCreateChainedFunction2['default'](toggle.props.onClick, this.handleClick);

    toggleProps.onKeyDown = _utilsCreateChainedFunction2['default'](toggle.props.onKeyDown, this.handleKeyDown);

    return _react.cloneElement(toggle, toggleProps, toggle.props.children);
  };

  return Dropdown;
})(_react2['default'].Component);

Dropdown.Toggle = _DropdownToggle2['default'];

Dropdown.TOGGLE_REF = TOGGLE_REF;
Dropdown.TOGGLE_ROLE = TOGGLE_ROLE;
Dropdown.MENU_ROLE = MENU_ROLE;

Dropdown.defaultProps = {
  componentClass: _ButtonGroup2['default'],
  alwaysFocusNextOnOpen: false
};

Dropdown.propTypes = {
  /**
   * The menu will open above the dropdown button, instead of below it.
   */
  dropup: _react2['default'].PropTypes.bool,

  /**
   * An html id attribute, necessary for assistive technologies, such as screen readers.
   * @type {string|number}
   * @required
   */
  id: _reactPropTypesLibIsRequiredForA11y2['default'](_react2['default'].PropTypes.oneOfType([_react2['default'].PropTypes.string, _react2['default'].PropTypes.number])),

  componentClass: _reactPropTypesLibElementType2['default'],

  /**
   * The children of a Dropdown may be a `<Dropdown.Toggle/>` or a `<Dropdown.Menu/>`.
   * @type {node}
   */
  children: _reactPropTypesLibAll2['default'](_utilsCustomPropTypes2['default'].requiredRoles(TOGGLE_ROLE, MENU_ROLE), _utilsCustomPropTypes2['default'].exclusiveRoles(MENU_ROLE)),

  /**
   * Whether or not component is disabled.
   */
  disabled: _react2['default'].PropTypes.bool,

  /**
   * Align the menu to the right side of the Dropdown toggle
   */
  pullRight: _react2['default'].PropTypes.bool,

  /**
   * Whether or not the Dropdown is visible.
   *
   * @controllable onToggle
   */
  open: _react2['default'].PropTypes.bool,

  /**
   * A callback fired when the Dropdown closes.
   */
  onClose: _react2['default'].PropTypes.func,

  /**
   * A callback fired when the Dropdown wishes to change visibility. Called with the requested
   * `open` value.
   *
   * ```js
   * function(Boolean isOpen) {}
   * ```
   * @controllable open
   */
  onToggle: _react2['default'].PropTypes.func,

  /**
   * A callback fired when a menu item is selected.
   *
   * ```js
   * function(Object event, Any eventKey)
   * ```
   */
  onSelect: _react2['default'].PropTypes.func,

  /**
   * If `'menuitem'`, causes the dropdown to behave like a menu item rather than
   * a menu button.
   */
  role: _react2['default'].PropTypes.string
};

Dropdown = _uncontrollable2['default'](Dropdown, { open: 'onToggle' });

Dropdown.Toggle = _DropdownToggle2['default'];
Dropdown.Menu = _DropdownMenu2['default'];

exports['default'] = Dropdown;
module.exports = exports['default'];
},{"./ButtonGroup":13,"./DropdownMenu":23,"./DropdownToggle":24,"./utils/CustomPropTypes":76,"./utils/ValidComponentChildren":79,"./utils/createChainedFunction":82,"babel-runtime/helpers/class-call-check":91,"babel-runtime/helpers/extends":92,"babel-runtime/helpers/inherits":93,"babel-runtime/helpers/interop-require-default":94,"classnames":122,"dom-helpers/activeElement":123,"dom-helpers/query/contains":128,"keycode":146,"lodash-compat/collection/find":148,"lodash-compat/object/omit":210,"react":453,"react-dom":249,"react-prop-types/lib/all":229,"react-prop-types/lib/elementType":232,"react-prop-types/lib/isRequiredForA11y":233,"uncontrollable":237}],22:[function(require,module,exports){
'use strict';

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _extends = require('babel-runtime/helpers/extends')['default'];

var _objectWithoutProperties = require('babel-runtime/helpers/object-without-properties')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

exports.__esModule = true;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _BootstrapMixin = require('./BootstrapMixin');

var _BootstrapMixin2 = _interopRequireDefault(_BootstrapMixin);

var _Dropdown = require('./Dropdown');

var _Dropdown2 = _interopRequireDefault(_Dropdown);

var _lodashCompatObjectOmit = require('lodash-compat/object/omit');

var _lodashCompatObjectOmit2 = _interopRequireDefault(_lodashCompatObjectOmit);

var DropdownButton = (function (_React$Component) {
  _inherits(DropdownButton, _React$Component);

  function DropdownButton(props) {
    _classCallCheck(this, DropdownButton);

    _React$Component.call(this, props);
  }

  DropdownButton.prototype.render = function render() {
    var _props = this.props;
    var title = _props.title;

    var props = _objectWithoutProperties(_props, ['title']);

    var toggleProps = _lodashCompatObjectOmit2['default'](props, _Dropdown2['default'].ControlledComponent.propTypes);

    return _react2['default'].createElement(
      _Dropdown2['default'],
      props,
      _react2['default'].createElement(
        _Dropdown2['default'].Toggle,
        toggleProps,
        title
      ),
      _react2['default'].createElement(
        _Dropdown2['default'].Menu,
        null,
        this.props.children
      )
    );
  };

  return DropdownButton;
})(_react2['default'].Component);

DropdownButton.propTypes = _extends({
  /**
   * When used with the `title` prop, the noCaret option will not render a caret icon, in the toggle element.
   */
  noCaret: _react2['default'].PropTypes.bool,

  title: _react2['default'].PropTypes.node.isRequired

}, _Dropdown2['default'].propTypes, _BootstrapMixin2['default'].propTypes);

DropdownButton.defaultProps = {
  pullRight: false,
  dropup: false,
  navItem: false,
  noCaret: false
};

exports['default'] = DropdownButton;
module.exports = exports['default'];
},{"./BootstrapMixin":9,"./Dropdown":21,"babel-runtime/helpers/class-call-check":91,"babel-runtime/helpers/extends":92,"babel-runtime/helpers/inherits":93,"babel-runtime/helpers/interop-require-default":94,"babel-runtime/helpers/object-without-properties":96,"lodash-compat/object/omit":210,"react":453}],23:[function(require,module,exports){
'use strict';

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _objectWithoutProperties = require('babel-runtime/helpers/object-without-properties')['default'];

var _extends = require('babel-runtime/helpers/extends')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

exports.__esModule = true;

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _keycode = require('keycode');

var _keycode2 = _interopRequireDefault(_keycode);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _reactOverlaysLibRootCloseWrapper = require('react-overlays/lib/RootCloseWrapper');

var _reactOverlaysLibRootCloseWrapper2 = _interopRequireDefault(_reactOverlaysLibRootCloseWrapper);

var _utilsValidComponentChildren = require('./utils/ValidComponentChildren');

var _utilsValidComponentChildren2 = _interopRequireDefault(_utilsValidComponentChildren);

var _utilsCreateChainedFunction = require('./utils/createChainedFunction');

var _utilsCreateChainedFunction2 = _interopRequireDefault(_utilsCreateChainedFunction);

var DropdownMenu = (function (_React$Component) {
  _inherits(DropdownMenu, _React$Component);

  function DropdownMenu(props) {
    _classCallCheck(this, DropdownMenu);

    _React$Component.call(this, props);

    this.focusNext = this.focusNext.bind(this);
    this.focusPrevious = this.focusPrevious.bind(this);
    this.getFocusableMenuItems = this.getFocusableMenuItems.bind(this);
    this.getItemsAndActiveIndex = this.getItemsAndActiveIndex.bind(this);

    this.handleKeyDown = this.handleKeyDown.bind(this);
  }

  DropdownMenu.prototype.handleKeyDown = function handleKeyDown(event) {
    switch (event.keyCode) {
      case _keycode2['default'].codes.down:
        this.focusNext();
        event.preventDefault();
        break;
      case _keycode2['default'].codes.up:
        this.focusPrevious();
        event.preventDefault();
        break;
      case _keycode2['default'].codes.esc:
      case _keycode2['default'].codes.tab:
        this.props.onClose(event);
        break;
      default:
    }
  };

  DropdownMenu.prototype.focusNext = function focusNext() {
    var _getItemsAndActiveIndex = this.getItemsAndActiveIndex();

    var items = _getItemsAndActiveIndex.items;
    var activeItemIndex = _getItemsAndActiveIndex.activeItemIndex;

    if (items.length === 0) {
      return;
    }

    if (activeItemIndex === items.length - 1) {
      items[0].focus();
      return;
    }

    items[activeItemIndex + 1].focus();
  };

  DropdownMenu.prototype.focusPrevious = function focusPrevious() {
    var _getItemsAndActiveIndex2 = this.getItemsAndActiveIndex();

    var items = _getItemsAndActiveIndex2.items;
    var activeItemIndex = _getItemsAndActiveIndex2.activeItemIndex;

    if (activeItemIndex === 0) {
      items[items.length - 1].focus();
      return;
    }

    items[activeItemIndex - 1].focus();
  };

  DropdownMenu.prototype.getItemsAndActiveIndex = function getItemsAndActiveIndex() {
    var items = this.getFocusableMenuItems();
    var activeElement = document.activeElement;
    var activeItemIndex = items.indexOf(activeElement);

    return { items: items, activeItemIndex: activeItemIndex };
  };

  DropdownMenu.prototype.getFocusableMenuItems = function getFocusableMenuItems() {
    var menuNode = _reactDom2['default'].findDOMNode(this);

    if (menuNode === undefined) {
      return [];
    }

    return [].slice.call(menuNode.querySelectorAll('[tabIndex="-1"]'), 0);
  };

  DropdownMenu.prototype.render = function render() {
    var _this = this;

    var _props = this.props;
    var children = _props.children;
    var onSelect = _props.onSelect;
    var pullRight = _props.pullRight;
    var className = _props.className;
    var labelledBy = _props.labelledBy;
    var open = _props.open;
    var onClose = _props.onClose;

    var props = _objectWithoutProperties(_props, ['children', 'onSelect', 'pullRight', 'className', 'labelledBy', 'open', 'onClose']);

    var items = _utilsValidComponentChildren2['default'].map(children, function (child) {
      var childProps = child.props || {};

      return _react2['default'].cloneElement(child, {
        onKeyDown: _utilsCreateChainedFunction2['default'](childProps.onKeyDown, _this.handleKeyDown),
        onSelect: _utilsCreateChainedFunction2['default'](childProps.onSelect, onSelect)
      }, childProps.children);
    });

    var classes = {
      'dropdown-menu': true,
      'dropdown-menu-right': pullRight
    };

    var list = _react2['default'].createElement(
      'ul',
      _extends({
        className: _classnames2['default'](className, classes),
        role: 'menu',
        'aria-labelledby': labelledBy
      }, props),
      items
    );

    if (open) {
      list = _react2['default'].createElement(
        _reactOverlaysLibRootCloseWrapper2['default'],
        { noWrap: true, onRootClose: onClose },
        list
      );
    }

    return list;
  };

  return DropdownMenu;
})(_react2['default'].Component);

DropdownMenu.defaultProps = {
  bsRole: 'menu',
  pullRight: false
};

DropdownMenu.propTypes = {
  open: _react2['default'].PropTypes.bool,
  pullRight: _react2['default'].PropTypes.bool,
  onClose: _react2['default'].PropTypes.func,
  labelledBy: _react2['default'].PropTypes.oneOfType([_react2['default'].PropTypes.string, _react2['default'].PropTypes.number]),
  onSelect: _react2['default'].PropTypes.func
};

exports['default'] = DropdownMenu;
module.exports = exports['default'];
},{"./utils/ValidComponentChildren":79,"./utils/createChainedFunction":82,"babel-runtime/helpers/class-call-check":91,"babel-runtime/helpers/extends":92,"babel-runtime/helpers/inherits":93,"babel-runtime/helpers/interop-require-default":94,"babel-runtime/helpers/object-without-properties":96,"classnames":122,"keycode":146,"react":453,"react-dom":249,"react-overlays/lib/RootCloseWrapper":219}],24:[function(require,module,exports){
'use strict';

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _extends = require('babel-runtime/helpers/extends')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

exports.__esModule = true;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _Button = require('./Button');

var _Button2 = _interopRequireDefault(_Button);

var _SafeAnchor = require('./SafeAnchor');

var _SafeAnchor2 = _interopRequireDefault(_SafeAnchor);

var CARET = _react2['default'].createElement(
  'span',
  null,
  ' ',
  _react2['default'].createElement('span', { className: 'caret' })
);

var DropdownToggle = (function (_React$Component) {
  _inherits(DropdownToggle, _React$Component);

  function DropdownToggle() {
    _classCallCheck(this, DropdownToggle);

    _React$Component.apply(this, arguments);
  }

  DropdownToggle.prototype.render = function render() {
    var caret = this.props.noCaret ? null : CARET;

    var classes = {
      'dropdown-toggle': true
    };

    var Component = this.props.useAnchor ? _SafeAnchor2['default'] : _Button2['default'];

    return _react2['default'].createElement(
      Component,
      _extends({}, this.props, {
        className: _classnames2['default'](classes, this.props.className),
        type: 'button',
        'aria-haspopup': true,
        'aria-expanded': this.props.open }),
      this.props.children || this.props.title,
      caret
    );
  };

  return DropdownToggle;
})(_react2['default'].Component);

exports['default'] = DropdownToggle;

DropdownToggle.defaultProps = {
  open: false,
  useAnchor: false,
  bsRole: 'toggle'
};

DropdownToggle.propTypes = {
  bsRole: _react2['default'].PropTypes.string,
  noCaret: _react2['default'].PropTypes.bool,
  open: _react2['default'].PropTypes.bool,
  title: _react2['default'].PropTypes.string,
  useAnchor: _react2['default'].PropTypes.bool
};

DropdownToggle.isToggle = true;
DropdownToggle.titleProp = 'title';
DropdownToggle.onClickProp = 'onClick';
module.exports = exports['default'];
},{"./Button":12,"./SafeAnchor":64,"babel-runtime/helpers/class-call-check":91,"babel-runtime/helpers/extends":92,"babel-runtime/helpers/inherits":93,"babel-runtime/helpers/interop-require-default":94,"classnames":122,"react":453}],25:[function(require,module,exports){
'use strict';

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _extends = require('babel-runtime/helpers/extends')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

exports.__esModule = true;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactOverlaysLibTransition = require('react-overlays/lib/Transition');

var _reactOverlaysLibTransition2 = _interopRequireDefault(_reactOverlaysLibTransition);

var _reactPropTypesLibDeprecated = require('react-prop-types/lib/deprecated');

var _reactPropTypesLibDeprecated2 = _interopRequireDefault(_reactPropTypesLibDeprecated);

var Fade = (function (_React$Component) {
  _inherits(Fade, _React$Component);

  function Fade() {
    _classCallCheck(this, Fade);

    _React$Component.apply(this, arguments);
  }

  // Explicitly copied from Transition for doc generation.
  // TODO: Remove duplication once #977 is resolved.

  Fade.prototype.render = function render() {
    var timeout = this.props.timeout || this.props.duration;

    return _react2['default'].createElement(
      _reactOverlaysLibTransition2['default'],
      _extends({}, this.props, {
        timeout: timeout,
        className: 'fade',
        enteredClassName: 'in',
        enteringClassName: 'in'
      }),
      this.props.children
    );
  };

  return Fade;
})(_react2['default'].Component);

Fade.propTypes = {
  /**
   * Show the component; triggers the fade in or fade out animation
   */
  'in': _react2['default'].PropTypes.bool,

  /**
   * Unmount the component (remove it from the DOM) when it is faded out
   */
  unmountOnExit: _react2['default'].PropTypes.bool,

  /**
   * Run the fade in animation when the component mounts, if it is initially
   * shown
   */
  transitionAppear: _react2['default'].PropTypes.bool,

  /**
   * Duration of the fade animation in milliseconds, to ensure that finishing
   * callbacks are fired even if the original browser transition end events are
   * canceled
   */
  timeout: _react2['default'].PropTypes.number,

  /**
   * duration
   * @private
   */
  duration: _reactPropTypesLibDeprecated2['default'](_react2['default'].PropTypes.number, 'Use `timeout`.'),

  /**
   * Callback fired before the component fades in
   */
  onEnter: _react2['default'].PropTypes.func,
  /**
   * Callback fired after the component starts to fade in
   */
  onEntering: _react2['default'].PropTypes.func,
  /**
   * Callback fired after the has component faded in
   */
  onEntered: _react2['default'].PropTypes.func,
  /**
   * Callback fired before the component fades out
   */
  onExit: _react2['default'].PropTypes.func,
  /**
   * Callback fired after the component starts to fade out
   */
  onExiting: _react2['default'].PropTypes.func,
  /**
   * Callback fired after the component has faded out
   */
  onExited: _react2['default'].PropTypes.func
};

Fade.defaultProps = {
  'in': false,
  timeout: 300,
  unmountOnExit: false,
  transitionAppear: false
};

exports['default'] = Fade;
module.exports = exports['default'];
},{"babel-runtime/helpers/class-call-check":91,"babel-runtime/helpers/extends":92,"babel-runtime/helpers/inherits":93,"babel-runtime/helpers/interop-require-default":94,"react":453,"react-overlays/lib/Transition":220,"react-prop-types/lib/deprecated":231}],26:[function(require,module,exports){
'use strict';

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _extends = require('babel-runtime/helpers/extends')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

exports.__esModule = true;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _InputBase2 = require('../InputBase');

var _InputBase3 = _interopRequireDefault(_InputBase2);

var _utilsChildrenValueInputValidation = require('../utils/childrenValueInputValidation');

var _utilsChildrenValueInputValidation2 = _interopRequireDefault(_utilsChildrenValueInputValidation);

var Static = (function (_InputBase) {
  _inherits(Static, _InputBase);

  function Static() {
    _classCallCheck(this, Static);

    _InputBase.apply(this, arguments);
  }

  Static.prototype.getValue = function getValue() {
    var _props = this.props;
    var children = _props.children;
    var value = _props.value;

    return children ? children : value;
  };

  Static.prototype.renderInput = function renderInput() {
    return _react2['default'].createElement(
      'p',
      _extends({}, this.props, { className: _classnames2['default'](this.props.className, 'form-control-static'), ref: 'input', key: 'input' }),
      this.getValue()
    );
  };

  return Static;
})(_InputBase3['default']);

Static.propTypes = {
  value: _utilsChildrenValueInputValidation2['default'],
  children: _utilsChildrenValueInputValidation2['default']
};

exports['default'] = Static;
module.exports = exports['default'];
},{"../InputBase":33,"../utils/childrenValueInputValidation":81,"babel-runtime/helpers/class-call-check":91,"babel-runtime/helpers/extends":92,"babel-runtime/helpers/inherits":93,"babel-runtime/helpers/interop-require-default":94,"classnames":122,"react":453}],27:[function(require,module,exports){
'use strict';

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

exports.__esModule = true;

var _Static2 = require('./Static');

var _Static3 = _interopRequireDefault(_Static2);

exports.Static = _Static3['default'];
},{"./Static":26,"babel-runtime/helpers/interop-require-default":94}],28:[function(require,module,exports){
'use strict';

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

exports.__esModule = true;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var FormGroup = (function (_React$Component) {
  _inherits(FormGroup, _React$Component);

  function FormGroup() {
    _classCallCheck(this, FormGroup);

    _React$Component.apply(this, arguments);
  }

  FormGroup.prototype.render = function render() {
    var classes = {
      'form-group': !this.props.standalone,
      'form-group-lg': !this.props.standalone && this.props.bsSize === 'large',
      'form-group-sm': !this.props.standalone && this.props.bsSize === 'small',
      'has-feedback': this.props.hasFeedback,
      'has-success': this.props.bsStyle === 'success',
      'has-warning': this.props.bsStyle === 'warning',
      'has-error': this.props.bsStyle === 'error'
    };

    return _react2['default'].createElement(
      'div',
      { className: _classnames2['default'](classes, this.props.groupClassName) },
      this.props.children
    );
  };

  return FormGroup;
})(_react2['default'].Component);

FormGroup.defaultProps = {
  hasFeedback: false,
  standalone: false
};

FormGroup.propTypes = {
  standalone: _react2['default'].PropTypes.bool,
  hasFeedback: _react2['default'].PropTypes.bool,
  bsSize: function bsSize(props) {
    if (props.standalone && props.bsSize !== undefined) {
      return new Error('bsSize will not be used when `standalone` is set.');
    }

    return _react2['default'].PropTypes.oneOf(['small', 'medium', 'large']).apply(null, arguments);
  },
  bsStyle: _react2['default'].PropTypes.oneOf(['success', 'warning', 'error']),
  groupClassName: _react2['default'].PropTypes.string
};

exports['default'] = FormGroup;
module.exports = exports['default'];
},{"babel-runtime/helpers/class-call-check":91,"babel-runtime/helpers/inherits":93,"babel-runtime/helpers/interop-require-default":94,"classnames":122,"react":453}],29:[function(require,module,exports){
'use strict';

var _extends = require('babel-runtime/helpers/extends')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

exports.__esModule = true;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var Glyphicon = _react2['default'].createClass({
  displayName: 'Glyphicon',

  propTypes: {
    /**
     * bootstrap className
     * @private
     */
    bsClass: _react2['default'].PropTypes.string,
    /**
     * An icon name. See e.g. http://getbootstrap.com/components/#glyphicons
     */
    glyph: _react2['default'].PropTypes.string.isRequired,
    /**
     * Adds 'form-control-feedback' class
     * @private
     */
    formControlFeedback: _react2['default'].PropTypes.bool
  },

  getDefaultProps: function getDefaultProps() {
    return {
      bsClass: 'glyphicon',
      formControlFeedback: false
    };
  },

  render: function render() {
    var _classNames;

    var className = _classnames2['default'](this.props.className, (_classNames = {}, _classNames[this.props.bsClass] = true, _classNames['glyphicon-' + this.props.glyph] = true, _classNames['form-control-feedback'] = this.props.formControlFeedback, _classNames));

    return _react2['default'].createElement(
      'span',
      _extends({}, this.props, { className: className }),
      this.props.children
    );
  }
});

exports['default'] = Glyphicon;
module.exports = exports['default'];
},{"babel-runtime/helpers/extends":92,"babel-runtime/helpers/interop-require-default":94,"classnames":122,"react":453}],30:[function(require,module,exports){
'use strict';

var _extends = require('babel-runtime/helpers/extends')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

exports.__esModule = true;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _reactPropTypesLibElementType = require('react-prop-types/lib/elementType');

var _reactPropTypesLibElementType2 = _interopRequireDefault(_reactPropTypesLibElementType);

var Grid = _react2['default'].createClass({
  displayName: 'Grid',

  propTypes: {
    /**
     * Turn any fixed-width grid layout into a full-width layout by this property.
     *
     * Adds `container-fluid` class.
     */
    fluid: _react2['default'].PropTypes.bool,
    /**
     * You can use a custom element for this component
     */
    componentClass: _reactPropTypesLibElementType2['default']
  },

  getDefaultProps: function getDefaultProps() {
    return {
      componentClass: 'div',
      fluid: false
    };
  },

  render: function render() {
    var ComponentClass = this.props.componentClass;
    var className = this.props.fluid ? 'container-fluid' : 'container';

    return _react2['default'].createElement(
      ComponentClass,
      _extends({}, this.props, {
        className: _classnames2['default'](this.props.className, className) }),
      this.props.children
    );
  }
});

exports['default'] = Grid;
module.exports = exports['default'];
},{"babel-runtime/helpers/extends":92,"babel-runtime/helpers/interop-require-default":94,"classnames":122,"react":453,"react-prop-types/lib/elementType":232}],31:[function(require,module,exports){
'use strict';

var _extends = require('babel-runtime/helpers/extends')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

exports.__esModule = true;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var Image = _react2['default'].createClass({
  displayName: 'Image',

  propTypes: {

    /**
     * Sets image as responsive image
     */
    responsive: _react2['default'].PropTypes.bool,

    /**
     * Sets image shape as rounded
     */
    rounded: _react2['default'].PropTypes.bool,

    /**
     * Sets image shape as circle
     */
    circle: _react2['default'].PropTypes.bool,

    /**
     * Sets image shape as thumbnail
     */
    thumbnail: _react2['default'].PropTypes.bool
  },

  getDefaultProps: function getDefaultProps() {
    return {
      responsive: false,
      rounded: false,
      circle: false,
      thumbnail: false
    };
  },

  render: function render() {
    var classes = {
      'img-responsive': this.props.responsive,
      'img-rounded': this.props.rounded,
      'img-circle': this.props.circle,
      'img-thumbnail': this.props.thumbnail
    };

    return _react2['default'].createElement('img', _extends({}, this.props, { className: _classnames2['default'](this.props.className, classes) }));
  }
});

exports['default'] = Image;
module.exports = exports['default'];
},{"babel-runtime/helpers/extends":92,"babel-runtime/helpers/interop-require-default":94,"classnames":122,"react":453}],32:[function(require,module,exports){
'use strict';

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

var _interopRequireWildcard = require('babel-runtime/helpers/interop-require-wildcard')['default'];

exports.__esModule = true;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _InputBase2 = require('./InputBase');

var _InputBase3 = _interopRequireDefault(_InputBase2);

var _FormControls = require('./FormControls');

var FormControls = _interopRequireWildcard(_FormControls);

var _utilsDeprecationWarning = require('./utils/deprecationWarning');

var _utilsDeprecationWarning2 = _interopRequireDefault(_utilsDeprecationWarning);

var Input = (function (_InputBase) {
  _inherits(Input, _InputBase);

  function Input() {
    _classCallCheck(this, Input);

    _InputBase.apply(this, arguments);
  }

  Input.prototype.render = function render() {
    if (this.props.type === 'static') {
      _utilsDeprecationWarning2['default']('Input type=static', 'FormControls.Static');
      return _react2['default'].createElement(FormControls.Static, this.props);
    }

    return _InputBase.prototype.render.call(this);
  };

  return Input;
})(_InputBase3['default']);

Input.propTypes = {
  type: _react2['default'].PropTypes.string
};

exports['default'] = Input;
module.exports = exports['default'];
},{"./FormControls":27,"./InputBase":33,"./utils/deprecationWarning":84,"babel-runtime/helpers/class-call-check":91,"babel-runtime/helpers/inherits":93,"babel-runtime/helpers/interop-require-default":94,"babel-runtime/helpers/interop-require-wildcard":95,"react":453}],33:[function(require,module,exports){
'use strict';

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _extends = require('babel-runtime/helpers/extends')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

exports.__esModule = true;

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _FormGroup = require('./FormGroup');

var _FormGroup2 = _interopRequireDefault(_FormGroup);

var _Glyphicon = require('./Glyphicon');

var _Glyphicon2 = _interopRequireDefault(_Glyphicon);

var InputBase = (function (_React$Component) {
  _inherits(InputBase, _React$Component);

  function InputBase() {
    _classCallCheck(this, InputBase);

    _React$Component.apply(this, arguments);
  }

  InputBase.prototype.getInputDOMNode = function getInputDOMNode() {
    return this.refs.input;
  };

  InputBase.prototype.getValue = function getValue() {
    if (this.props.type === 'static') {
      return this.props.value;
    } else if (this.props.type) {
      if (this.props.type === 'select' && this.props.multiple) {
        return this.getSelectedOptions();
      }
      return this.getInputDOMNode().value;
    }
    throw new Error('Cannot use getValue without specifying input type.');
  };

  InputBase.prototype.getChecked = function getChecked() {
    return this.getInputDOMNode().checked;
  };

  InputBase.prototype.getSelectedOptions = function getSelectedOptions() {
    var values = [];

    Array.prototype.forEach.call(this.getInputDOMNode().getElementsByTagName('option'), function (option) {
      if (option.selected) {
        var value = option.getAttribute('value') || option.innerHtml;
        values.push(value);
      }
    });

    return values;
  };

  InputBase.prototype.isCheckboxOrRadio = function isCheckboxOrRadio() {
    return this.props.type === 'checkbox' || this.props.type === 'radio';
  };

  InputBase.prototype.isFile = function isFile() {
    return this.props.type === 'file';
  };

  InputBase.prototype.renderInputGroup = function renderInputGroup(children) {
    var addonBefore = this.props.addonBefore ? _react2['default'].createElement(
      'span',
      { className: 'input-group-addon', key: 'addonBefore' },
      this.props.addonBefore
    ) : null;

    var addonAfter = this.props.addonAfter ? _react2['default'].createElement(
      'span',
      { className: 'input-group-addon', key: 'addonAfter' },
      this.props.addonAfter
    ) : null;

    var buttonBefore = this.props.buttonBefore ? _react2['default'].createElement(
      'span',
      { className: 'input-group-btn' },
      this.props.buttonBefore
    ) : null;

    var buttonAfter = this.props.buttonAfter ? _react2['default'].createElement(
      'span',
      { className: 'input-group-btn' },
      this.props.buttonAfter
    ) : null;

    var inputGroupClassName = undefined;
    switch (this.props.bsSize) {
      case 'small':
        inputGroupClassName = 'input-group-sm';break;
      case 'large':
        inputGroupClassName = 'input-group-lg';break;
      default:
    }

    return addonBefore || addonAfter || buttonBefore || buttonAfter ? _react2['default'].createElement(
      'div',
      { className: _classnames2['default'](inputGroupClassName, 'input-group'), key: 'input-group' },
      addonBefore,
      buttonBefore,
      children,
      addonAfter,
      buttonAfter
    ) : children;
  };

  InputBase.prototype.renderIcon = function renderIcon() {
    if (this.props.hasFeedback) {
      if (this.props.feedbackIcon) {
        return _react2['default'].cloneElement(this.props.feedbackIcon, { formControlFeedback: true });
      }

      switch (this.props.bsStyle) {
        case 'success':
          return _react2['default'].createElement(_Glyphicon2['default'], { formControlFeedback: true, glyph: 'ok', key: 'icon' });
        case 'warning':
          return _react2['default'].createElement(_Glyphicon2['default'], { formControlFeedback: true, glyph: 'warning-sign', key: 'icon' });
        case 'error':
          return _react2['default'].createElement(_Glyphicon2['default'], { formControlFeedback: true, glyph: 'remove', key: 'icon' });
        default:
          return _react2['default'].createElement('span', { className: 'form-control-feedback', key: 'icon' });
      }
    } else {
      return null;
    }
  };

  InputBase.prototype.renderHelp = function renderHelp() {
    return this.props.help ? _react2['default'].createElement(
      'span',
      { className: 'help-block', key: 'help' },
      this.props.help
    ) : null;
  };

  InputBase.prototype.renderCheckboxAndRadioWrapper = function renderCheckboxAndRadioWrapper(children) {
    var classes = {
      'checkbox': this.props.type === 'checkbox',
      'radio': this.props.type === 'radio'
    };

    return _react2['default'].createElement(
      'div',
      { className: _classnames2['default'](classes), key: 'checkboxRadioWrapper' },
      children
    );
  };

  InputBase.prototype.renderWrapper = function renderWrapper(children) {
    return this.props.wrapperClassName ? _react2['default'].createElement(
      'div',
      { className: this.props.wrapperClassName, key: 'wrapper' },
      children
    ) : children;
  };

  InputBase.prototype.renderLabel = function renderLabel(children) {
    var classes = {
      'control-label': !this.isCheckboxOrRadio()
    };
    classes[this.props.labelClassName] = this.props.labelClassName;

    return this.props.label ? _react2['default'].createElement(
      'label',
      { htmlFor: this.props.id, className: _classnames2['default'](classes), key: 'label' },
      children,
      this.props.label
    ) : children;
  };

  InputBase.prototype.renderInput = function renderInput() {
    if (!this.props.type) {
      return this.props.children;
    }

    switch (this.props.type) {
      case 'select':
        return _react2['default'].createElement(
          'select',
          _extends({}, this.props, { className: _classnames2['default'](this.props.className, 'form-control'), ref: 'input', key: 'input' }),
          this.props.children
        );
      case 'textarea':
        return _react2['default'].createElement('textarea', _extends({}, this.props, { className: _classnames2['default'](this.props.className, 'form-control'), ref: 'input', key: 'input' }));
      case 'static':
        return _react2['default'].createElement(
          'p',
          _extends({}, this.props, { className: _classnames2['default'](this.props.className, 'form-control-static'), ref: 'input', key: 'input' }),
          this.props.value
        );
      default:
        var className = this.isCheckboxOrRadio() || this.isFile() ? '' : 'form-control';
        return _react2['default'].createElement('input', _extends({}, this.props, { className: _classnames2['default'](this.props.className, className), ref: 'input', key: 'input' }));
    }
  };

  InputBase.prototype.renderFormGroup = function renderFormGroup(children) {
    return _react2['default'].createElement(
      _FormGroup2['default'],
      this.props,
      children
    );
  };

  InputBase.prototype.renderChildren = function renderChildren() {
    return !this.isCheckboxOrRadio() ? [this.renderLabel(), this.renderWrapper([this.renderInputGroup(this.renderInput()), this.renderIcon(), this.renderHelp()])] : this.renderWrapper([this.renderCheckboxAndRadioWrapper(this.renderLabel(this.renderInput())), this.renderHelp()]);
  };

  InputBase.prototype.render = function render() {
    var children = this.renderChildren();
    return this.renderFormGroup(children);
  };

  return InputBase;
})(_react2['default'].Component);

InputBase.propTypes = {
  type: _react2['default'].PropTypes.string,
  label: _react2['default'].PropTypes.node,
  help: _react2['default'].PropTypes.node,
  addonBefore: _react2['default'].PropTypes.node,
  addonAfter: _react2['default'].PropTypes.node,
  buttonBefore: _react2['default'].PropTypes.node,
  buttonAfter: _react2['default'].PropTypes.node,
  bsSize: _react2['default'].PropTypes.oneOf(['small', 'medium', 'large']),
  bsStyle: _react2['default'].PropTypes.oneOf(['success', 'warning', 'error']),
  hasFeedback: _react2['default'].PropTypes.bool,
  feedbackIcon: _react2['default'].PropTypes.node,
  id: _react2['default'].PropTypes.oneOfType([_react2['default'].PropTypes.string, _react2['default'].PropTypes.number]),
  groupClassName: _react2['default'].PropTypes.string,
  wrapperClassName: _react2['default'].PropTypes.string,
  labelClassName: _react2['default'].PropTypes.string,
  multiple: _react2['default'].PropTypes.bool,
  disabled: _react2['default'].PropTypes.bool,
  value: _react2['default'].PropTypes.any
};

InputBase.defaultProps = {
  disabled: false,
  hasFeedback: false,
  multiple: false
};

exports['default'] = InputBase;
module.exports = exports['default'];
},{"./FormGroup":28,"./Glyphicon":29,"babel-runtime/helpers/class-call-check":91,"babel-runtime/helpers/extends":92,"babel-runtime/helpers/inherits":93,"babel-runtime/helpers/interop-require-default":94,"classnames":122,"react":453}],34:[function(require,module,exports){
// https://www.npmjs.org/package/react-interpolate-component
// TODO: Drop this in favor of es6 string interpolation

'use strict';

var _extends = require('babel-runtime/helpers/extends')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

exports.__esModule = true;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _utilsValidComponentChildren = require('./utils/ValidComponentChildren');

var _utilsValidComponentChildren2 = _interopRequireDefault(_utilsValidComponentChildren);

var REGEXP = /\%\((.+?)\)s/;

var Interpolate = _react2['default'].createClass({
  displayName: 'Interpolate',

  propTypes: {
    component: _react2['default'].PropTypes.node,
    format: _react2['default'].PropTypes.string,
    unsafe: _react2['default'].PropTypes.bool
  },

  getDefaultProps: function getDefaultProps() {
    return {
      component: 'span',
      unsafe: false
    };
  },

  render: function render() {
    var format = _utilsValidComponentChildren2['default'].hasValidComponent(this.props.children) || typeof this.props.children === 'string' ? this.props.children : this.props.format;
    var parent = this.props.component;
    var unsafe = this.props.unsafe === true;
    var props = _extends({}, this.props);

    delete props.children;
    delete props.format;
    delete props.component;
    delete props.unsafe;

    if (unsafe) {
      var content = format.split(REGEXP).reduce(function (memo, match, index) {
        var html = undefined;

        if (index % 2 === 0) {
          html = match;
        } else {
          html = props[match];
          delete props[match];
        }

        if (_react2['default'].isValidElement(html)) {
          throw new Error('cannot interpolate a React component into unsafe text');
        }

        memo += html;

        return memo;
      }, '');

      props.dangerouslySetInnerHTML = { __html: content };

      return _react2['default'].createElement(parent, props);
    }
    var kids = format.split(REGEXP).reduce(function (memo, match, index) {
      var child = undefined;

      if (index % 2 === 0) {
        if (match.length === 0) {
          return memo;
        }

        child = match;
      } else {
        child = props[match];
        delete props[match];
      }

      memo.push(child);

      return memo;
    }, []);

    return _react2['default'].createElement(parent, props, kids);
  }
});

exports['default'] = Interpolate;
module.exports = exports['default'];
},{"./utils/ValidComponentChildren":79,"babel-runtime/helpers/extends":92,"babel-runtime/helpers/interop-require-default":94,"react":453}],35:[function(require,module,exports){
'use strict';

var _extends = require('babel-runtime/helpers/extends')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

exports.__esModule = true;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _reactPropTypesLibElementType = require('react-prop-types/lib/elementType');

var _reactPropTypesLibElementType2 = _interopRequireDefault(_reactPropTypesLibElementType);

var Jumbotron = _react2['default'].createClass({
  displayName: 'Jumbotron',

  propTypes: {
    /**
     * You can use a custom element for this component
     */
    componentClass: _reactPropTypesLibElementType2['default']
  },

  getDefaultProps: function getDefaultProps() {
    return { componentClass: 'div' };
  },

  render: function render() {
    var ComponentClass = this.props.componentClass;

    return _react2['default'].createElement(
      ComponentClass,
      _extends({}, this.props, { className: _classnames2['default'](this.props.className, 'jumbotron') }),
      this.props.children
    );
  }
});

exports['default'] = Jumbotron;
module.exports = exports['default'];
},{"babel-runtime/helpers/extends":92,"babel-runtime/helpers/interop-require-default":94,"classnames":122,"react":453,"react-prop-types/lib/elementType":232}],36:[function(require,module,exports){
'use strict';

var _extends = require('babel-runtime/helpers/extends')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

exports.__esModule = true;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _BootstrapMixin = require('./BootstrapMixin');

var _BootstrapMixin2 = _interopRequireDefault(_BootstrapMixin);

var Label = _react2['default'].createClass({
  displayName: 'Label',

  mixins: [_BootstrapMixin2['default']],

  getDefaultProps: function getDefaultProps() {
    return {
      bsClass: 'label',
      bsStyle: 'default'
    };
  },

  render: function render() {
    var classes = this.getBsClassSet();

    return _react2['default'].createElement(
      'span',
      _extends({}, this.props, { className: _classnames2['default'](this.props.className, classes) }),
      this.props.children
    );
  }
});

exports['default'] = Label;
module.exports = exports['default'];
},{"./BootstrapMixin":9,"babel-runtime/helpers/extends":92,"babel-runtime/helpers/interop-require-default":94,"classnames":122,"react":453}],37:[function(require,module,exports){
'use strict';

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _extends = require('babel-runtime/helpers/extends')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

exports.__esModule = true;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _ListGroupItem = require('./ListGroupItem');

var _ListGroupItem2 = _interopRequireDefault(_ListGroupItem);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _utilsValidComponentChildren = require('./utils/ValidComponentChildren');

var _utilsValidComponentChildren2 = _interopRequireDefault(_utilsValidComponentChildren);

var ListGroup = (function (_React$Component) {
  _inherits(ListGroup, _React$Component);

  function ListGroup() {
    _classCallCheck(this, ListGroup);

    _React$Component.apply(this, arguments);
  }

  ListGroup.prototype.render = function render() {
    var _this = this;

    var items = _utilsValidComponentChildren2['default'].map(this.props.children, function (item, index) {
      return _react.cloneElement(item, { key: item.key ? item.key : index });
    });

    if (this.areCustomChildren(items)) {
      var Component = this.props.componentClass;
      return _react2['default'].createElement(
        Component,
        _extends({}, this.props, {
          className: _classnames2['default'](this.props.className, 'list-group') }),
        items
      );
    }

    var shouldRenderDiv = false;

    if (!this.props.children) {
      shouldRenderDiv = true;
    } else {
      _utilsValidComponentChildren2['default'].forEach(this.props.children, function (child) {
        if (_this.isAnchorOrButton(child.props)) {
          shouldRenderDiv = true;
        }
      });
    }

    return shouldRenderDiv ? this.renderDiv(items) : this.renderUL(items);
  };

  ListGroup.prototype.isAnchorOrButton = function isAnchorOrButton(props) {
    return props.href || props.onClick;
  };

  ListGroup.prototype.areCustomChildren = function areCustomChildren(children) {
    var customChildren = false;

    _utilsValidComponentChildren2['default'].forEach(children, function (child) {
      if (child.type !== _ListGroupItem2['default']) {
        customChildren = true;
      }
    }, this);

    return customChildren;
  };

  ListGroup.prototype.renderUL = function renderUL(items) {
    var listItems = _utilsValidComponentChildren2['default'].map(items, function (item) {
      return _react.cloneElement(item, { listItem: true });
    });

    return _react2['default'].createElement(
      'ul',
      _extends({}, this.props, {
        className: _classnames2['default'](this.props.className, 'list-group') }),
      listItems
    );
  };

  ListGroup.prototype.renderDiv = function renderDiv(items) {
    return _react2['default'].createElement(
      'div',
      _extends({}, this.props, {
        className: _classnames2['default'](this.props.className, 'list-group') }),
      items
    );
  };

  return ListGroup;
})(_react2['default'].Component);

ListGroup.defaultProps = {
  componentClass: 'div'
};

ListGroup.propTypes = {
  className: _react2['default'].PropTypes.string,
  /**
   * The element for ListGroup if children are
   * user-defined custom components.
   * @type {("ul"|"div")}
   */
  componentClass: _react2['default'].PropTypes.oneOf(['ul', 'div']),
  id: _react2['default'].PropTypes.oneOfType([_react2['default'].PropTypes.string, _react2['default'].PropTypes.number])
};

exports['default'] = ListGroup;
module.exports = exports['default'];
},{"./ListGroupItem":38,"./utils/ValidComponentChildren":79,"babel-runtime/helpers/class-call-check":91,"babel-runtime/helpers/extends":92,"babel-runtime/helpers/inherits":93,"babel-runtime/helpers/interop-require-default":94,"classnames":122,"react":453}],38:[function(require,module,exports){
'use strict';

var _extends = require('babel-runtime/helpers/extends')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

exports.__esModule = true;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _BootstrapMixin = require('./BootstrapMixin');

var _BootstrapMixin2 = _interopRequireDefault(_BootstrapMixin);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var ListGroupItem = _react2['default'].createClass({
  displayName: 'ListGroupItem',

  mixins: [_BootstrapMixin2['default']],

  propTypes: {
    bsStyle: _react2['default'].PropTypes.oneOf(['danger', 'info', 'success', 'warning']),
    className: _react2['default'].PropTypes.string,
    active: _react2['default'].PropTypes.any,
    disabled: _react2['default'].PropTypes.any,
    header: _react2['default'].PropTypes.node,
    listItem: _react2['default'].PropTypes.bool,
    onClick: _react2['default'].PropTypes.func,
    href: _react2['default'].PropTypes.string
  },

  getDefaultProps: function getDefaultProps() {
    return {
      bsClass: 'list-group-item',
      listItem: false
    };
  },

  render: function render() {
    var classes = this.getBsClassSet();

    classes.active = this.props.active;
    classes.disabled = this.props.disabled;

    if (this.props.href) {
      return this.renderAnchor(classes);
    } else if (this.props.onClick) {
      return this.renderButton(classes);
    } else if (this.props.listItem) {
      return this.renderLi(classes);
    }
    return this.renderSpan(classes);
  },

  renderLi: function renderLi(classes) {
    return _react2['default'].createElement(
      'li',
      _extends({}, this.props, { className: _classnames2['default'](this.props.className, classes) }),
      this.props.header ? this.renderStructuredContent() : this.props.children
    );
  },

  renderAnchor: function renderAnchor(classes) {
    return _react2['default'].createElement(
      'a',
      _extends({}, this.props, {
        className: _classnames2['default'](this.props.className, classes)
      }),
      this.props.header ? this.renderStructuredContent() : this.props.children
    );
  },

  renderButton: function renderButton(classes) {
    return _react2['default'].createElement(
      'button',
      _extends({
        type: 'button'
      }, this.props, {
        className: _classnames2['default'](this.props.className, classes) }),
      this.props.header ? this.renderStructuredContent() : this.props.children
    );
  },

  renderSpan: function renderSpan(classes) {
    return _react2['default'].createElement(
      'span',
      _extends({}, this.props, { className: _classnames2['default'](this.props.className, classes) }),
      this.props.header ? this.renderStructuredContent() : this.props.children
    );
  },

  renderStructuredContent: function renderStructuredContent() {
    var header = undefined;
    if (_react2['default'].isValidElement(this.props.header)) {
      header = _react.cloneElement(this.props.header, {
        key: 'header',
        className: _classnames2['default'](this.props.header.props.className, 'list-group-item-heading')
      });
    } else {
      header = _react2['default'].createElement(
        'h4',
        { key: 'header', className: 'list-group-item-heading' },
        this.props.header
      );
    }

    var content = _react2['default'].createElement(
      'p',
      { key: 'content', className: 'list-group-item-text' },
      this.props.children
    );

    return [header, content];
  }
});

exports['default'] = ListGroupItem;
module.exports = exports['default'];
},{"./BootstrapMixin":9,"babel-runtime/helpers/extends":92,"babel-runtime/helpers/interop-require-default":94,"classnames":122,"react":453}],39:[function(require,module,exports){
'use strict';

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _objectWithoutProperties = require('babel-runtime/helpers/object-without-properties')['default'];

var _extends = require('babel-runtime/helpers/extends')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

exports.__esModule = true;

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactPropTypesLibAll = require('react-prop-types/lib/all');

var _reactPropTypesLibAll2 = _interopRequireDefault(_reactPropTypesLibAll);

var _SafeAnchor = require('./SafeAnchor');

var _SafeAnchor2 = _interopRequireDefault(_SafeAnchor);

var _utilsCreateChainedFunction = require('./utils/createChainedFunction');

var _utilsCreateChainedFunction2 = _interopRequireDefault(_utilsCreateChainedFunction);

var MenuItem = (function (_React$Component) {
  _inherits(MenuItem, _React$Component);

  function MenuItem(props) {
    _classCallCheck(this, MenuItem);

    _React$Component.call(this, props);

    this.handleClick = this.handleClick.bind(this);
  }

  MenuItem.prototype.handleClick = function handleClick(event) {
    if (!this.props.href || this.props.disabled) {
      event.preventDefault();
    }

    if (this.props.disabled) {
      return;
    }

    if (this.props.onSelect) {
      this.props.onSelect(event, this.props.eventKey);
    }
  };

  MenuItem.prototype.render = function render() {
    if (this.props.divider) {
      return _react2['default'].createElement('li', { role: 'separator', className: 'divider' });
    }

    if (this.props.header) {
      return _react2['default'].createElement(
        'li',
        { role: 'heading', className: 'dropdown-header' },
        this.props.children
      );
    }

    var _props = this.props;
    var className = _props.className;
    var style = _props.style;
    var onClick = _props.onClick;

    var props = _objectWithoutProperties(_props, ['className', 'style', 'onClick']);

    var classes = {
      disabled: this.props.disabled,
      active: this.props.active
    };

    return _react2['default'].createElement(
      'li',
      { role: 'presentation',
        className: _classnames2['default'](className, classes),
        style: style
      },
      _react2['default'].createElement(_SafeAnchor2['default'], _extends({}, props, {
        role: 'menuitem',
        tabIndex: '-1',
        onClick: _utilsCreateChainedFunction2['default'](onClick, this.handleClick)
      }))
    );
  };

  return MenuItem;
})(_react2['default'].Component);

exports['default'] = MenuItem;

MenuItem.propTypes = {
  active: _react2['default'].PropTypes.bool,
  disabled: _react2['default'].PropTypes.bool,
  divider: _reactPropTypesLibAll2['default'](_react2['default'].PropTypes.bool, function (props) {
    if (props.divider && props.children) {
      return new Error('Children will not be rendered for dividers');
    }
  }),
  eventKey: _react2['default'].PropTypes.oneOfType([_react2['default'].PropTypes.number, _react2['default'].PropTypes.string]),
  header: _react2['default'].PropTypes.bool,
  href: _react2['default'].PropTypes.string,
  target: _react2['default'].PropTypes.string,
  title: _react2['default'].PropTypes.string,
  onClick: _react2['default'].PropTypes.func,
  onKeyDown: _react2['default'].PropTypes.func,
  onSelect: _react2['default'].PropTypes.func,
  id: _react2['default'].PropTypes.oneOfType([_react2['default'].PropTypes.string, _react2['default'].PropTypes.number])
};

MenuItem.defaultProps = {
  divider: false,
  disabled: false,
  header: false
};
module.exports = exports['default'];
},{"./SafeAnchor":64,"./utils/createChainedFunction":82,"babel-runtime/helpers/class-call-check":91,"babel-runtime/helpers/extends":92,"babel-runtime/helpers/inherits":93,"babel-runtime/helpers/interop-require-default":94,"babel-runtime/helpers/object-without-properties":96,"classnames":122,"react":453,"react-prop-types/lib/all":229}],40:[function(require,module,exports){
/* eslint-disable react/prop-types */

'use strict';

var _extends = require('babel-runtime/helpers/extends')['default'];

var _objectWithoutProperties = require('babel-runtime/helpers/object-without-properties')['default'];

var _Object$isFrozen = require('babel-runtime/core-js/object/is-frozen')['default'];

var _Object$keys = require('babel-runtime/core-js/object/keys')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

exports.__esModule = true;

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _utilsDomUtils = require('./utils/domUtils');

var _utilsDomUtils2 = _interopRequireDefault(_utilsDomUtils);

var _domHelpersUtilScrollbarSize = require('dom-helpers/util/scrollbarSize');

var _domHelpersUtilScrollbarSize2 = _interopRequireDefault(_domHelpersUtilScrollbarSize);

var _utilsEventListener = require('./utils/EventListener');

var _utilsEventListener2 = _interopRequireDefault(_utilsEventListener);

var _utilsCreateChainedFunction = require('./utils/createChainedFunction');

var _utilsCreateChainedFunction2 = _interopRequireDefault(_utilsCreateChainedFunction);

var _reactPropTypesLibElementType = require('react-prop-types/lib/elementType');

var _reactPropTypesLibElementType2 = _interopRequireDefault(_reactPropTypesLibElementType);

var _domHelpersUtilInDOM = require('dom-helpers/util/inDOM');

var _domHelpersUtilInDOM2 = _interopRequireDefault(_domHelpersUtilInDOM);

var _domHelpersQueryContains = require('dom-helpers/query/contains');

var _domHelpersQueryContains2 = _interopRequireDefault(_domHelpersQueryContains);

var _domHelpersActiveElement = require('dom-helpers/activeElement');

var _domHelpersActiveElement2 = _interopRequireDefault(_domHelpersActiveElement);

var _reactOverlaysLibPortal = require('react-overlays/lib/Portal');

var _reactOverlaysLibPortal2 = _interopRequireDefault(_reactOverlaysLibPortal);

var _Fade = require('./Fade');

var _Fade2 = _interopRequireDefault(_Fade);

var _ModalDialog = require('./ModalDialog');

var _ModalDialog2 = _interopRequireDefault(_ModalDialog);

var _ModalBody = require('./ModalBody');

var _ModalBody2 = _interopRequireDefault(_ModalBody);

var _ModalHeader = require('./ModalHeader');

var _ModalHeader2 = _interopRequireDefault(_ModalHeader);

var _ModalTitle = require('./ModalTitle');

var _ModalTitle2 = _interopRequireDefault(_ModalTitle);

var _ModalFooter = require('./ModalFooter');

var _ModalFooter2 = _interopRequireDefault(_ModalFooter);

/**
 * Gets the correct clientHeight of the modal container
 * when the body/window/document you need to use the docElement clientHeight
 * @param  {HTMLElement} container
 * @param  {ReactElement|HTMLElement} context
 * @return {Number}
 */
function containerClientHeight(container, context) {
  var doc = _utilsDomUtils2['default'].ownerDocument(context);

  return container === doc.body || container === doc.documentElement ? doc.documentElement.clientHeight : container.clientHeight;
}

function getContainer(context) {
  return context.props.container && _reactDom2['default'].findDOMNode(context.props.container) || _utilsDomUtils2['default'].ownerDocument(context).body;
}

var currentFocusListener = undefined;

/**
 * Firefox doesn't have a focusin event so using capture is easiest way to get bubbling
 * IE8 can't do addEventListener, but does have onfocusin, so we use that in ie8
 *
 * We only allow one Listener at a time to avoid stack overflows
 *
 * @param  {ReactElement|HTMLElement} context
 * @param  {Function} handler
 */
function onFocus(context, handler) {
  var doc = _utilsDomUtils2['default'].ownerDocument(context);
  var useFocusin = !doc.addEventListener;
  var remove = undefined;

  if (currentFocusListener) {
    currentFocusListener.remove();
  }

  if (useFocusin) {
    document.attachEvent('onfocusin', handler);
    remove = function () {
      return document.detachEvent('onfocusin', handler);
    };
  } else {
    document.addEventListener('focus', handler, true);
    remove = function () {
      return document.removeEventListener('focus', handler, true);
    };
  }

  currentFocusListener = { remove: remove };

  return currentFocusListener;
}

var Modal = _react2['default'].createClass({
  displayName: 'Modal',

  propTypes: _extends({}, _reactOverlaysLibPortal2['default'].propTypes, _ModalDialog2['default'].propTypes, {

    /**
     * Include a backdrop component. Specify 'static' for a backdrop that doesn't trigger an "onHide" when clicked.
     */
    backdrop: _react2['default'].PropTypes.oneOf(['static', true, false]),

    /**
     * Close the modal when escape key is pressed
     */
    keyboard: _react2['default'].PropTypes.bool,

    /**
     * Open and close the Modal with a slide and fade animation.
     */
    animation: _react2['default'].PropTypes.bool,

    /**
     * A Component type that provides the modal content Markup. This is a useful prop when you want to use your own
     * styles and markup to create a custom modal component.
     */
    dialogComponent: _reactPropTypesLibElementType2['default'],

    /**
     * When `true` The modal will automatically shift focus to itself when it opens, and replace it to the last focused element when it closes.
     * Generally this should never be set to false as it makes the Modal less accessible to assistive technologies, like screen-readers.
     */
    autoFocus: _react2['default'].PropTypes.bool,

    /**
     * When `true` The modal will prevent focus from leaving the Modal while open.
     * Consider leaving the default value here, as it is necessary to make the Modal work well with assistive technologies,
     * such as screen readers.
     */
    enforceFocus: _react2['default'].PropTypes.bool,

    /**
     * Hide this from automatic props documentation generation.
     * @private
     */
    bsStyle: _react2['default'].PropTypes.string,

    /**
     * When `true` The modal will show itself.
     */
    show: _react2['default'].PropTypes.bool
  }),

  getDefaultProps: function getDefaultProps() {
    return {
      bsClass: 'modal',
      dialogComponent: _ModalDialog2['default'],
      show: false,
      animation: true,
      backdrop: true,
      keyboard: true,
      autoFocus: true,
      enforceFocus: true
    };
  },

  getInitialState: function getInitialState() {
    return {
      exited: !this.props.show
    };
  },

  render: function render() {
    var _props = this.props;
    var children = _props.children;
    var animation = _props.animation;
    var backdrop = _props.backdrop;

    var props = _objectWithoutProperties(_props, ['children', 'animation', 'backdrop']);

    var onExit = props.onExit;
    var onExiting = props.onExiting;
    var onEnter = props.onEnter;
    var onEntering = props.onEntering;
    var onEntered = props.onEntered;

    var show = !!props.show;
    var Dialog = props.dialogComponent;

    var mountModal = show || animation && !this.state.exited;
    if (!mountModal) {
      return null;
    }

    var modal = _react2['default'].createElement(
      Dialog,
      _extends({}, props, {
        ref: this._setDialogRef,
        className: _classnames2['default'](this.props.className, { 'in': show && !animation }),
        onClick: backdrop === true ? this.handleBackdropClick : null }),
      this.renderContent()
    );

    if (animation) {
      modal = _react2['default'].createElement(
        _Fade2['default'],
        {
          transitionAppear: true,
          unmountOnExit: true,
          'in': show,
          timeout: Modal.TRANSITION_DURATION,
          onExit: onExit,
          onExiting: onExiting,
          onExited: this.handleHidden,
          onEnter: onEnter,
          onEntering: onEntering,
          onEntered: onEntered },
        modal
      );
    }

    if (backdrop) {
      modal = this.renderBackdrop(modal);
    }

    return _react2['default'].createElement(
      _reactOverlaysLibPortal2['default'],
      { container: props.container },
      modal
    );
  },

  renderContent: function renderContent() {
    var _this = this;

    return _react2['default'].Children.map(this.props.children, function (child) {
      // TODO: use context in 0.14
      if (child && child.type && child.type.__isModalHeader) {
        return _react.cloneElement(child, {
          onHide: _utilsCreateChainedFunction2['default'](_this.props.onHide, child.props.onHide)
        });
      }
      return child;
    });
  },

  renderBackdrop: function renderBackdrop(modal) {
    var _props2 = this.props;
    var animation = _props2.animation;
    var bsClass = _props2.bsClass;

    var duration = Modal.BACKDROP_TRANSITION_DURATION;

    // Don't handle clicks for "static" backdrops
    var onClick = this.props.backdrop === true ? this.handleBackdropClick : null;

    var backdrop = _react2['default'].createElement('div', {
      ref: 'backdrop',
      className: _classnames2['default'](bsClass + '-backdrop', { 'in': this.props.show && !animation }),
      onClick: onClick });

    return _react2['default'].createElement(
      'div',
      {
        ref: 'modal' },
      animation ? _react2['default'].createElement(
        _Fade2['default'],
        { transitionAppear: true, 'in': this.props.show, timeout: duration },
        backdrop
      ) : backdrop,
      modal
    );
  },

  _setDialogRef: function _setDialogRef(ref) {
    // issue #1074
    // due to: https://github.com/facebook/react/blob/v0.13.3/src/core/ReactCompositeComponent.js#L842
    //
    // when backdrop is `false` react hasn't had a chance to reassign the refs to a usable object, b/c there are no other
    // "classic" refs on the component (or they haven't been processed yet)
    // TODO: Remove the need for this in next breaking release
    if (_Object$isFrozen(this.refs) && !_Object$keys(this.refs).length) {
      this.refs = {};
    }

    this.refs.dialog = ref;

    // maintains backwards compat with older component breakdown
    if (!this.props.backdrop) {
      this.refs.modal = ref;
    }
  },

  componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
    if (nextProps.show) {
      this.setState({ exited: false });
    } else if (!nextProps.animation) {
      // Otherwise let handleHidden take care of marking exited.
      this.setState({ exited: true });
    }
  },

  componentWillUpdate: function componentWillUpdate(nextProps) {
    if (nextProps.show) {
      this.checkForFocus();
    }
  },

  componentDidMount: function componentDidMount() {
    if (this.props.show) {
      this.onShow();
    }
  },

  componentDidUpdate: function componentDidUpdate(prevProps) {
    var animation = this.props.animation;

    if (prevProps.show && !this.props.show && !animation) {
      // otherwise handleHidden will call this.
      this.onHide();
    } else if (!prevProps.show && this.props.show) {
      this.onShow();
    }
  },

  componentWillUnmount: function componentWillUnmount() {
    if (this.props.show) {
      this.onHide();
    }
  },

  onShow: function onShow() {
    var _this2 = this;

    var doc = _utilsDomUtils2['default'].ownerDocument(this);
    var win = _utilsDomUtils2['default'].ownerWindow(this);

    this._onDocumentKeyupListener = _utilsEventListener2['default'].listen(doc, 'keyup', this.handleDocumentKeyUp);

    this._onWindowResizeListener = _utilsEventListener2['default'].listen(win, 'resize', this.handleWindowResize);

    if (this.props.enforceFocus) {
      this._onFocusinListener = onFocus(this, this.enforceFocus);
    }

    var container = getContainer(this);

    container.className += container.className.length ? ' modal-open' : 'modal-open';

    this._containerIsOverflowing = container.scrollHeight > containerClientHeight(container, this);

    this._originalPadding = container.style.paddingRight;

    if (this._containerIsOverflowing) {
      container.style.paddingRight = parseInt(this._originalPadding || 0, 10) + _domHelpersUtilScrollbarSize2['default']() + 'px';
    }

    this.setState(this._getStyles(), function () {
      return _this2.focusModalContent();
    });
  },

  onHide: function onHide() {
    this._onDocumentKeyupListener.remove();
    this._onWindowResizeListener.remove();

    if (this._onFocusinListener) {
      this._onFocusinListener.remove();
    }

    var container = getContainer(this);

    container.style.paddingRight = this._originalPadding;

    container.className = container.className.replace(/ ?modal-open/, '');

    this.restoreLastFocus();
  },

  handleHidden: function handleHidden() {
    this.setState({ exited: true });

    this.onHide();

    if (this.props.onExited) {
      var _props3;

      (_props3 = this.props).onExited.apply(_props3, arguments);
    }
  },

  handleBackdropClick: function handleBackdropClick(e) {
    if (e.target !== e.currentTarget) {
      return;
    }

    this.props.onHide();
  },

  handleDocumentKeyUp: function handleDocumentKeyUp(e) {
    if (this.props.keyboard && e.keyCode === 27) {
      this.props.onHide();
    }
  },

  handleWindowResize: function handleWindowResize() {
    this.setState(this._getStyles());
  },

  checkForFocus: function checkForFocus() {
    if (_domHelpersUtilInDOM2['default']) {
      this.lastFocus = _domHelpersActiveElement2['default'](document);
    }
  },

  focusModalContent: function focusModalContent() {
    var modalContent = _reactDom2['default'].findDOMNode(this.refs.dialog);
    var current = _domHelpersActiveElement2['default'](_utilsDomUtils2['default'].ownerDocument(this));
    var focusInModal = current && _domHelpersQueryContains2['default'](modalContent, current);

    if (modalContent && this.props.autoFocus && !focusInModal) {
      this.lastFocus = current;
      modalContent.focus();
    }
  },

  restoreLastFocus: function restoreLastFocus() {
    if (this.lastFocus && this.lastFocus.focus) {
      this.lastFocus.focus();
      this.lastFocus = null;
    }
  },

  enforceFocus: function enforceFocus() {
    if (!this.isMounted()) {
      return;
    }

    var active = _domHelpersActiveElement2['default'](_utilsDomUtils2['default'].ownerDocument(this));
    var modal = _reactDom2['default'].findDOMNode(this.refs.dialog);

    if (modal && modal !== active && !_domHelpersQueryContains2['default'](modal, active)) {
      modal.focus();
    }
  },

  _getStyles: function _getStyles() {
    if (!_domHelpersUtilInDOM2['default']) {
      return {};
    }

    var node = _reactDom2['default'].findDOMNode(this.refs.modal);
    var scrollHt = node.scrollHeight;
    var container = getContainer(this);
    var containerIsOverflowing = this._containerIsOverflowing;
    var modalIsOverflowing = scrollHt > containerClientHeight(container, this);

    return {
      dialogStyles: {
        paddingRight: containerIsOverflowing && !modalIsOverflowing ? _domHelpersUtilScrollbarSize2['default']() : void 0,
        paddingLeft: !containerIsOverflowing && modalIsOverflowing ? _domHelpersUtilScrollbarSize2['default']() : void 0
      }
    };
  }

});

Modal.Body = _ModalBody2['default'];
Modal.Header = _ModalHeader2['default'];
Modal.Title = _ModalTitle2['default'];
Modal.Footer = _ModalFooter2['default'];

Modal.Dialog = _ModalDialog2['default'];

Modal.TRANSITION_DURATION = 300;
Modal.BACKDROP_TRANSITION_DURATION = 150;

exports['default'] = Modal;
module.exports = exports['default'];
},{"./Fade":25,"./ModalBody":41,"./ModalDialog":42,"./ModalFooter":43,"./ModalHeader":44,"./ModalTitle":45,"./utils/EventListener":77,"./utils/createChainedFunction":82,"./utils/domUtils":85,"babel-runtime/core-js/object/is-frozen":88,"babel-runtime/core-js/object/keys":89,"babel-runtime/helpers/extends":92,"babel-runtime/helpers/interop-require-default":94,"babel-runtime/helpers/object-without-properties":96,"classnames":122,"dom-helpers/activeElement":123,"dom-helpers/query/contains":128,"dom-helpers/util/inDOM":144,"dom-helpers/util/scrollbarSize":145,"react":453,"react-dom":249,"react-overlays/lib/Portal":217,"react-prop-types/lib/elementType":232}],41:[function(require,module,exports){
'use strict';

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _extends = require('babel-runtime/helpers/extends')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

exports.__esModule = true;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var ModalBody = (function (_React$Component) {
  _inherits(ModalBody, _React$Component);

  function ModalBody() {
    _classCallCheck(this, ModalBody);

    _React$Component.apply(this, arguments);
  }

  ModalBody.prototype.render = function render() {
    return _react2['default'].createElement(
      'div',
      _extends({}, this.props, {
        className: _classnames2['default'](this.props.className, this.props.modalClassName) }),
      this.props.children
    );
  };

  return ModalBody;
})(_react2['default'].Component);

ModalBody.propTypes = {
  /**
   * A css class applied to the Component
   */
  modalClassName: _react2['default'].PropTypes.string
};

ModalBody.defaultProps = {
  modalClassName: 'modal-body'
};

exports['default'] = ModalBody;
module.exports = exports['default'];
},{"babel-runtime/helpers/class-call-check":91,"babel-runtime/helpers/extends":92,"babel-runtime/helpers/inherits":93,"babel-runtime/helpers/interop-require-default":94,"classnames":122,"react":453}],42:[function(require,module,exports){
/* eslint-disable react/prop-types */
'use strict';

var _extends = require('babel-runtime/helpers/extends')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

exports.__esModule = true;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _BootstrapMixin = require('./BootstrapMixin');

var _BootstrapMixin2 = _interopRequireDefault(_BootstrapMixin);

var ModalDialog = _react2['default'].createClass({
  displayName: 'ModalDialog',

  mixins: [_BootstrapMixin2['default']],

  propTypes: {
    /**
     * A Callback fired when the header closeButton or non-static backdrop is clicked.
     * @type {function}
     * @required
     */
    onHide: _react2['default'].PropTypes.func.isRequired,

    /**
     * A css class to apply to the Modal dialog DOM node.
     */
    dialogClassName: _react2['default'].PropTypes.string

  },

  getDefaultProps: function getDefaultProps() {
    return {
      bsClass: 'modal',
      closeButton: true
    };
  },

  render: function render() {
    var modalStyle = _extends({
      display: 'block'
    }, this.props.style);
    var bsClass = this.props.bsClass;
    var dialogClasses = this.getBsClassSet();

    delete dialogClasses.modal;
    dialogClasses[bsClass + '-dialog'] = true;

    return _react2['default'].createElement(
      'div',
      _extends({}, this.props, {
        title: null,
        tabIndex: '-1',
        role: 'dialog',
        style: modalStyle,
        className: _classnames2['default'](this.props.className, bsClass) }),
      _react2['default'].createElement(
        'div',
        { className: _classnames2['default'](this.props.dialogClassName, dialogClasses) },
        _react2['default'].createElement(
          'div',
          { className: bsClass + '-content', role: 'document' },
          this.props.children
        )
      )
    );
  }
});

exports['default'] = ModalDialog;
module.exports = exports['default'];
},{"./BootstrapMixin":9,"babel-runtime/helpers/extends":92,"babel-runtime/helpers/interop-require-default":94,"classnames":122,"react":453}],43:[function(require,module,exports){
'use strict';

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _extends = require('babel-runtime/helpers/extends')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

exports.__esModule = true;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var ModalFooter = (function (_React$Component) {
  _inherits(ModalFooter, _React$Component);

  function ModalFooter() {
    _classCallCheck(this, ModalFooter);

    _React$Component.apply(this, arguments);
  }

  ModalFooter.prototype.render = function render() {
    return _react2['default'].createElement(
      'div',
      _extends({}, this.props, {
        className: _classnames2['default'](this.props.className, this.props.modalClassName) }),
      this.props.children
    );
  };

  return ModalFooter;
})(_react2['default'].Component);

ModalFooter.propTypes = {
  /**
   * A css class applied to the Component
   */
  modalClassName: _react2['default'].PropTypes.string
};

ModalFooter.defaultProps = {
  modalClassName: 'modal-footer'
};

exports['default'] = ModalFooter;
module.exports = exports['default'];
},{"babel-runtime/helpers/class-call-check":91,"babel-runtime/helpers/extends":92,"babel-runtime/helpers/inherits":93,"babel-runtime/helpers/interop-require-default":94,"classnames":122,"react":453}],44:[function(require,module,exports){
'use strict';

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _extends = require('babel-runtime/helpers/extends')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

exports.__esModule = true;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var ModalHeader = (function (_React$Component) {
  _inherits(ModalHeader, _React$Component);

  function ModalHeader() {
    _classCallCheck(this, ModalHeader);

    _React$Component.apply(this, arguments);
  }

  // used in liue of parent contexts right now to auto wire the close button

  ModalHeader.prototype.render = function render() {
    return _react2['default'].createElement(
      'div',
      _extends({}, this.props, {
        className: _classnames2['default'](this.props.className, this.props.modalClassName) }),
      this.props.closeButton && _react2['default'].createElement(
        'button',
        {
          className: 'close',
          onClick: this.props.onHide },
        _react2['default'].createElement(
          'span',
          { 'aria-hidden': 'true' },
          '×'
        )
      ),
      this.props.children
    );
  };

  return ModalHeader;
})(_react2['default'].Component);

ModalHeader.__isModalHeader = true;

ModalHeader.propTypes = {
  /**
   * The 'aria-label' attribute is used to define a string that labels the current element.
   * It is used for Assistive Technology when the label text is not visible on screen.
   */
  'aria-label': _react2['default'].PropTypes.string,

  /**
   * A css class applied to the Component
   */
  modalClassName: _react2['default'].PropTypes.string,

  /**
   * Specify whether the Component should contain a close button
   */
  closeButton: _react2['default'].PropTypes.bool,

  /**
   * A Callback fired when the close button is clicked. If used directly inside a Modal component, the onHide will automatically
   * be propagated up to the parent Modal `onHide`.
   */
  onHide: _react2['default'].PropTypes.func
};

ModalHeader.defaultProps = {
  'aria-label': 'Close',
  modalClassName: 'modal-header',
  closeButton: false
};

exports['default'] = ModalHeader;
module.exports = exports['default'];
},{"babel-runtime/helpers/class-call-check":91,"babel-runtime/helpers/extends":92,"babel-runtime/helpers/inherits":93,"babel-runtime/helpers/interop-require-default":94,"classnames":122,"react":453}],45:[function(require,module,exports){
'use strict';

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _extends = require('babel-runtime/helpers/extends')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

exports.__esModule = true;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var ModalTitle = (function (_React$Component) {
  _inherits(ModalTitle, _React$Component);

  function ModalTitle() {
    _classCallCheck(this, ModalTitle);

    _React$Component.apply(this, arguments);
  }

  ModalTitle.prototype.render = function render() {
    return _react2['default'].createElement(
      'h4',
      _extends({}, this.props, {
        className: _classnames2['default'](this.props.className, this.props.modalClassName) }),
      this.props.children
    );
  };

  return ModalTitle;
})(_react2['default'].Component);

ModalTitle.propTypes = {
  /**
   * A css class applied to the Component
   */
  modalClassName: _react2['default'].PropTypes.string
};

ModalTitle.defaultProps = {
  modalClassName: 'modal-title'
};

exports['default'] = ModalTitle;
module.exports = exports['default'];
},{"babel-runtime/helpers/class-call-check":91,"babel-runtime/helpers/extends":92,"babel-runtime/helpers/inherits":93,"babel-runtime/helpers/interop-require-default":94,"classnames":122,"react":453}],46:[function(require,module,exports){
'use strict';

var _extends = require('babel-runtime/helpers/extends')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

exports.__esModule = true;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _BootstrapMixin = require('./BootstrapMixin');

var _BootstrapMixin2 = _interopRequireDefault(_BootstrapMixin);

var _Collapse = require('./Collapse');

var _Collapse2 = _interopRequireDefault(_Collapse);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _utilsValidComponentChildren = require('./utils/ValidComponentChildren');

var _utilsValidComponentChildren2 = _interopRequireDefault(_utilsValidComponentChildren);

var _utilsCreateChainedFunction = require('./utils/createChainedFunction');

var _utilsCreateChainedFunction2 = _interopRequireDefault(_utilsCreateChainedFunction);

var Nav = _react2['default'].createClass({
  displayName: 'Nav',

  mixins: [_BootstrapMixin2['default']],

  propTypes: {
    activeHref: _react2['default'].PropTypes.string,
    activeKey: _react2['default'].PropTypes.any,
    bsStyle: _react2['default'].PropTypes.oneOf(['tabs', 'pills']),
    stacked: _react2['default'].PropTypes.bool,
    justified: _react2['default'].PropTypes.bool,
    onSelect: _react2['default'].PropTypes.func,
    collapsible: _react2['default'].PropTypes.bool,
    /**
     * CSS classes for the wrapper `nav` element
     */
    className: _react2['default'].PropTypes.string,
    /**
     * HTML id for the wrapper `nav` element
     */
    id: _react2['default'].PropTypes.oneOfType([_react2['default'].PropTypes.string, _react2['default'].PropTypes.number]),
    /**
     * CSS classes for the inner `ul` element
     */
    ulClassName: _react2['default'].PropTypes.string,
    /**
     * HTML id for the inner `ul` element
     */
    ulId: _react2['default'].PropTypes.string,
    expanded: _react2['default'].PropTypes.bool,
    navbar: _react2['default'].PropTypes.bool,
    eventKey: _react2['default'].PropTypes.any,
    pullRight: _react2['default'].PropTypes.bool,
    right: _react2['default'].PropTypes.bool
  },

  getDefaultProps: function getDefaultProps() {
    return {
      bsClass: 'nav',
      collapsible: false,
      expanded: true,
      justified: false,
      navbar: false,
      pullRight: false,
      right: false,
      stacked: false
    };
  },

  render: function render() {
    var classes = this.props.collapsible ? 'navbar-collapse' : null;

    if (this.props.navbar && !this.props.collapsible) {
      return this.renderUl();
    }

    return _react2['default'].createElement(
      _Collapse2['default'],
      { 'in': this.props.expanded },
      _react2['default'].createElement(
        'nav',
        _extends({}, this.props, { className: _classnames2['default'](this.props.className, classes) }),
        this.renderUl()
      )
    );
  },

  renderUl: function renderUl() {
    var classes = this.getBsClassSet();

    classes['nav-stacked'] = this.props.stacked;
    classes['nav-justified'] = this.props.justified;
    classes['navbar-nav'] = this.props.navbar;
    classes['pull-right'] = this.props.pullRight;
    classes['navbar-right'] = this.props.right;

    return _react2['default'].createElement(
      'ul',
      _extends({}, this.props, {
        role: this.props.bsStyle === 'tabs' ? 'tablist' : null,
        className: _classnames2['default'](this.props.ulClassName, classes),
        id: this.props.ulId,
        ref: 'ul'
      }),
      _utilsValidComponentChildren2['default'].map(this.props.children, this.renderNavItem)
    );
  },

  getChildActiveProp: function getChildActiveProp(child) {
    if (child.props.active) {
      return true;
    }
    if (this.props.activeKey != null) {
      if (child.props.eventKey === this.props.activeKey) {
        return true;
      }
    }
    if (this.props.activeHref != null) {
      if (child.props.href === this.props.activeHref) {
        return true;
      }
    }

    return child.props.active;
  },

  renderNavItem: function renderNavItem(child, index) {
    return _react.cloneElement(child, {
      role: this.props.bsStyle === 'tabs' ? 'tab' : null,
      active: this.getChildActiveProp(child),
      activeKey: this.props.activeKey,
      activeHref: this.props.activeHref,
      onSelect: _utilsCreateChainedFunction2['default'](child.props.onSelect, this.props.onSelect),
      key: child.key ? child.key : index,
      navItem: true
    });
  }
});

exports['default'] = Nav;
module.exports = exports['default'];
},{"./BootstrapMixin":9,"./Collapse":19,"./utils/ValidComponentChildren":79,"./utils/createChainedFunction":82,"babel-runtime/helpers/extends":92,"babel-runtime/helpers/interop-require-default":94,"classnames":122,"react":453}],47:[function(require,module,exports){
'use strict';

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _objectWithoutProperties = require('babel-runtime/helpers/object-without-properties')['default'];

var _extends = require('babel-runtime/helpers/extends')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

exports.__esModule = true;

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var NavBrand = (function (_React$Component) {
  _inherits(NavBrand, _React$Component);

  function NavBrand() {
    _classCallCheck(this, NavBrand);

    _React$Component.apply(this, arguments);
  }

  NavBrand.prototype.render = function render() {
    var _props = this.props;
    var className = _props.className;
    var children = _props.children;

    var props = _objectWithoutProperties(_props, ['className', 'children']);

    if (_react2['default'].isValidElement(children)) {
      return _react2['default'].cloneElement(children, {
        className: _classnames2['default'](children.props.className, className, 'navbar-brand')
      });
    }

    return _react2['default'].createElement(
      'span',
      _extends({}, props, { className: _classnames2['default'](className, 'navbar-brand') }),
      children
    );
  };

  return NavBrand;
})(_react2['default'].Component);

NavBrand.propTypes = {
  bsRole: _react2['default'].PropTypes.string
};

NavBrand.defaultProps = {
  bsRole: 'brand'
};

exports['default'] = NavBrand;
module.exports = exports['default'];
},{"babel-runtime/helpers/class-call-check":91,"babel-runtime/helpers/extends":92,"babel-runtime/helpers/inherits":93,"babel-runtime/helpers/interop-require-default":94,"babel-runtime/helpers/object-without-properties":96,"classnames":122,"react":453}],48:[function(require,module,exports){
'use strict';

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _extends = require('babel-runtime/helpers/extends')['default'];

var _objectWithoutProperties = require('babel-runtime/helpers/object-without-properties')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

exports.__esModule = true;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _Dropdown = require('./Dropdown');

var _Dropdown2 = _interopRequireDefault(_Dropdown);

var NavDropdown = (function (_React$Component) {
  _inherits(NavDropdown, _React$Component);

  function NavDropdown() {
    _classCallCheck(this, NavDropdown);

    _React$Component.apply(this, arguments);
  }

  NavDropdown.prototype.render = function render() {
    var _props = this.props;
    var children = _props.children;
    var title = _props.title;
    var noCaret = _props.noCaret;

    var props = _objectWithoutProperties(_props, ['children', 'title', 'noCaret']);

    return _react2['default'].createElement(
      _Dropdown2['default'],
      _extends({}, props, { componentClass: 'li' }),
      _react2['default'].createElement(
        _Dropdown2['default'].Toggle,
        {
          useAnchor: true,
          disabled: props.disabled,
          noCaret: noCaret
        },
        title
      ),
      _react2['default'].createElement(
        _Dropdown2['default'].Menu,
        null,
        children
      )
    );
  };

  return NavDropdown;
})(_react2['default'].Component);

NavDropdown.propTypes = _extends({
  noCaret: _react2['default'].PropTypes.bool,
  title: _react2['default'].PropTypes.node.isRequired
}, _Dropdown2['default'].propTypes);

exports['default'] = NavDropdown;
module.exports = exports['default'];
},{"./Dropdown":21,"babel-runtime/helpers/class-call-check":91,"babel-runtime/helpers/extends":92,"babel-runtime/helpers/inherits":93,"babel-runtime/helpers/interop-require-default":94,"babel-runtime/helpers/object-without-properties":96,"react":453}],49:[function(require,module,exports){
'use strict';

var _objectWithoutProperties = require('babel-runtime/helpers/object-without-properties')['default'];

var _extends = require('babel-runtime/helpers/extends')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

exports.__esModule = true;

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _BootstrapMixin = require('./BootstrapMixin');

var _BootstrapMixin2 = _interopRequireDefault(_BootstrapMixin);

var _SafeAnchor = require('./SafeAnchor');

var _SafeAnchor2 = _interopRequireDefault(_SafeAnchor);

var _utilsCreateChainedFunction = require('./utils/createChainedFunction');

var _utilsCreateChainedFunction2 = _interopRequireDefault(_utilsCreateChainedFunction);

var NavItem = _react2['default'].createClass({
  displayName: 'NavItem',

  mixins: [_BootstrapMixin2['default']],

  propTypes: {
    linkId: _react2['default'].PropTypes.string,
    onSelect: _react2['default'].PropTypes.func,
    active: _react2['default'].PropTypes.bool,
    disabled: _react2['default'].PropTypes.bool,
    href: _react2['default'].PropTypes.string,
    onClick: _react2['default'].PropTypes.func,
    role: _react2['default'].PropTypes.string,
    title: _react2['default'].PropTypes.node,
    eventKey: _react2['default'].PropTypes.any,
    target: _react2['default'].PropTypes.string,
    'aria-controls': _react2['default'].PropTypes.string
  },

  getDefaultProps: function getDefaultProps() {
    return {
      active: false,
      disabled: false
    };
  },

  render: function render() {
    var _props = this.props;
    var role = _props.role;
    var linkId = _props.linkId;
    var disabled = _props.disabled;
    var active = _props.active;
    var href = _props.href;
    var onClick = _props.onClick;
    var title = _props.title;
    var target = _props.target;
    var children = _props.children;
    var tabIndex = _props.tabIndex;
    var ariaControls = _props['aria-controls'];

    var props = _objectWithoutProperties(_props, ['role', 'linkId', 'disabled', 'active', 'href', 'onClick', 'title', 'target', 'children', 'tabIndex', 'aria-controls']);

    var classes = {
      active: active,
      disabled: disabled
    };
    var linkProps = {
      role: role,
      href: href,
      onClick: _utilsCreateChainedFunction2['default'](onClick, this.handleClick),
      title: title,
      target: target,
      tabIndex: tabIndex,
      id: linkId
    };

    if (!role && href === '#') {
      linkProps.role = 'button';
    } else if (role === 'tab') {
      linkProps['aria-selected'] = active;
    }

    return _react2['default'].createElement(
      'li',
      _extends({}, props, { role: 'presentation', className: _classnames2['default'](props.className, classes) }),
      _react2['default'].createElement(
        _SafeAnchor2['default'],
        _extends({}, linkProps, { 'aria-controls': ariaControls }),
        children
      )
    );
  },

  handleClick: function handleClick(e) {
    if (this.props.onSelect) {
      e.preventDefault();

      if (!this.props.disabled) {
        this.props.onSelect(this.props.eventKey, this.props.href, this.props.target);
      }
    }
  }
});

exports['default'] = NavItem;
module.exports = exports['default'];
//eslint-disable-line
},{"./BootstrapMixin":9,"./SafeAnchor":64,"./utils/createChainedFunction":82,"babel-runtime/helpers/extends":92,"babel-runtime/helpers/interop-require-default":94,"babel-runtime/helpers/object-without-properties":96,"classnames":122,"react":453}],50:[function(require,module,exports){
'use strict';

var _objectWithoutProperties = require('babel-runtime/helpers/object-without-properties')['default'];

var _extends = require('babel-runtime/helpers/extends')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

exports.__esModule = true;

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactPropTypesLibDeprecated = require('react-prop-types/lib/deprecated');

var _reactPropTypesLibDeprecated2 = _interopRequireDefault(_reactPropTypesLibDeprecated);

var _reactPropTypesLibElementType = require('react-prop-types/lib/elementType');

var _reactPropTypesLibElementType2 = _interopRequireDefault(_reactPropTypesLibElementType);

var _BootstrapMixin = require('./BootstrapMixin');

var _BootstrapMixin2 = _interopRequireDefault(_BootstrapMixin);

var _Grid = require('./Grid');

var _Grid2 = _interopRequireDefault(_Grid);

var _NavBrand = require('./NavBrand');

var _NavBrand2 = _interopRequireDefault(_NavBrand);

var _utilsCreateChainedFunction = require('./utils/createChainedFunction');

var _utilsCreateChainedFunction2 = _interopRequireDefault(_utilsCreateChainedFunction);

var _utilsValidComponentChildren = require('./utils/ValidComponentChildren');

var _utilsValidComponentChildren2 = _interopRequireDefault(_utilsValidComponentChildren);

var Navbar = _react2['default'].createClass({
  displayName: 'Navbar',

  mixins: [_BootstrapMixin2['default']],

  propTypes: {
    fixedTop: _react2['default'].PropTypes.bool,
    fixedBottom: _react2['default'].PropTypes.bool,
    staticTop: _react2['default'].PropTypes.bool,
    inverse: _react2['default'].PropTypes.bool,
    fluid: _react2['default'].PropTypes.bool,
    role: _react2['default'].PropTypes.string,
    /**
     * You can use a custom element for this component
     */
    componentClass: _reactPropTypesLibElementType2['default'],
    brand: _reactPropTypesLibDeprecated2['default'](_react2['default'].PropTypes.node, 'Use the `NavBrand` component.'),
    toggleButton: _react2['default'].PropTypes.node,
    toggleNavKey: _react2['default'].PropTypes.oneOfType([_react2['default'].PropTypes.string, _react2['default'].PropTypes.number]),
    onToggle: _react2['default'].PropTypes.func,
    navExpanded: _react2['default'].PropTypes.bool,
    defaultNavExpanded: _react2['default'].PropTypes.bool
  },

  getDefaultProps: function getDefaultProps() {
    return {
      bsClass: 'navbar',
      bsStyle: 'default',
      role: 'navigation',
      componentClass: 'nav',
      fixedTop: false,
      fixedBottom: false,
      staticTop: false,
      inverse: false,
      fluid: false,
      defaultNavExpanded: false
    };
  },

  getInitialState: function getInitialState() {
    return {
      navExpanded: this.props.defaultNavExpanded
    };
  },

  shouldComponentUpdate: function shouldComponentUpdate() {
    // Defer any updates to this component during the `onSelect` handler.
    return !this._isChanging;
  },

  handleToggle: function handleToggle() {
    if (this.props.onToggle) {
      this._isChanging = true;
      this.props.onToggle();
      this._isChanging = false;
    }

    this.setState({
      navExpanded: !this.state.navExpanded
    });
  },

  isNavExpanded: function isNavExpanded() {
    return this.props.navExpanded != null ? this.props.navExpanded : this.state.navExpanded;
  },

  hasNavBrandChild: function hasNavBrandChild() {
    return _utilsValidComponentChildren2['default'].findValidComponents(this.props.children, function (child) {
      return child.props.bsRole === 'brand';
    }).length > 0;
  },

  render: function render() {
    var _props = this.props;
    var brand = _props.brand;
    var toggleButton = _props.toggleButton;
    var toggleNavKey = _props.toggleNavKey;
    var fixedTop = _props.fixedTop;
    var fixedBottom = _props.fixedBottom;
    var staticTop = _props.staticTop;
    var inverse = _props.inverse;
    var ComponentClass = _props.componentClass;
    var fluid = _props.fluid;
    var className = _props.className;
    var children = _props.children;

    var props = _objectWithoutProperties(_props, ['brand', 'toggleButton', 'toggleNavKey', 'fixedTop', 'fixedBottom', 'staticTop', 'inverse', 'componentClass', 'fluid', 'className', 'children']);

    var classes = this.getBsClassSet();
    classes['navbar-fixed-top'] = fixedTop;
    classes['navbar-fixed-bottom'] = fixedBottom;
    classes['navbar-static-top'] = staticTop;
    classes['navbar-inverse'] = inverse;

    var showHeader = (brand || toggleButton || toggleNavKey != null) && !this.hasNavBrandChild();

    return _react2['default'].createElement(
      ComponentClass,
      _extends({}, props, { className: _classnames2['default'](className, classes) }),
      _react2['default'].createElement(
        _Grid2['default'],
        { fluid: fluid },
        showHeader ? this.renderBrandHeader() : null,
        _utilsValidComponentChildren2['default'].map(children, this.renderChild)
      )
    );
  },

  renderBrandHeader: function renderBrandHeader() {
    var brand = this.props.brand;

    if (brand) {
      brand = _react2['default'].createElement(
        _NavBrand2['default'],
        null,
        brand
      );
    }

    return this.renderHeader(brand);
  },

  renderHeader: function renderHeader(brand) {
    var hasToggle = this.props.toggleButton || this.props.toggleNavKey != null;

    return _react2['default'].createElement(
      'div',
      { className: 'navbar-header' },
      brand,
      hasToggle ? this.renderToggleButton() : null
    );
  },

  renderChild: function renderChild(child, index) {
    var key = child.key != null ? child.key : index;

    if (child.props.bsRole === 'brand') {
      return _react2['default'].cloneElement(this.renderHeader(child), { key: key });
    }

    var toggleNavKey = this.props.toggleNavKey;

    var collapsible = toggleNavKey != null && toggleNavKey === child.props.eventKey;

    return _react2['default'].cloneElement(child, {
      navbar: true,
      collapsible: collapsible,
      expanded: collapsible && this.isNavExpanded(),
      key: key
    });
  },

  renderToggleButton: function renderToggleButton() {
    var toggleButton = this.props.toggleButton;

    if (_react2['default'].isValidElement(toggleButton)) {
      return _react2['default'].cloneElement(toggleButton, {
        className: _classnames2['default'](toggleButton.props.className, 'navbar-toggle'),
        onClick: _utilsCreateChainedFunction2['default'](this.handleToggle, toggleButton.props.onClick)
      });
    }

    var children = undefined;
    if (toggleButton != null) {
      children = toggleButton;
    } else {
      children = [_react2['default'].createElement(
        'span',
        { className: 'sr-only', key: 0 },
        'Toggle navigation'
      ), _react2['default'].createElement('span', { className: 'icon-bar', key: 1 }), _react2['default'].createElement('span', { className: 'icon-bar', key: 2 }), _react2['default'].createElement('span', { className: 'icon-bar', key: 3 })];
    }

    return _react2['default'].createElement(
      'button',
      {
        type: 'button',
        onClick: this.handleToggle,
        className: 'navbar-toggle'
      },
      children
    );
  }

});

exports['default'] = Navbar;
module.exports = exports['default'];
},{"./BootstrapMixin":9,"./Grid":30,"./NavBrand":47,"./utils/ValidComponentChildren":79,"./utils/createChainedFunction":82,"babel-runtime/helpers/extends":92,"babel-runtime/helpers/interop-require-default":94,"babel-runtime/helpers/object-without-properties":96,"classnames":122,"react":453,"react-prop-types/lib/deprecated":231,"react-prop-types/lib/elementType":232}],51:[function(require,module,exports){
/* eslint react/prop-types: [2, {ignore: ["container", "containerPadding", "target", "placement", "children"] }] */
/* These properties are validated in 'Portal' and 'Position' components */

'use strict';

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _extends = require('babel-runtime/helpers/extends')['default'];

var _objectWithoutProperties = require('babel-runtime/helpers/object-without-properties')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

exports.__esModule = true;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactOverlaysLibOverlay = require('react-overlays/lib/Overlay');

var _reactOverlaysLibOverlay2 = _interopRequireDefault(_reactOverlaysLibOverlay);

var _reactPropTypesLibElementType = require('react-prop-types/lib/elementType');

var _reactPropTypesLibElementType2 = _interopRequireDefault(_reactPropTypesLibElementType);

var _Fade = require('./Fade');

var _Fade2 = _interopRequireDefault(_Fade);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var Overlay = (function (_React$Component) {
  _inherits(Overlay, _React$Component);

  function Overlay() {
    _classCallCheck(this, Overlay);

    _React$Component.apply(this, arguments);
  }

  Overlay.prototype.render = function render() {
    var _props = this.props;
    var child = _props.children;
    var transition = _props.animation;

    var props = _objectWithoutProperties(_props, ['children', 'animation']);

    if (transition === true) {
      transition = _Fade2['default'];
    }

    if (!transition) {
      child = _react.cloneElement(child, {
        className: _classnames2['default']('in', child.props.className)
      });
    }

    return _react2['default'].createElement(
      _reactOverlaysLibOverlay2['default'],
      _extends({}, props, {
        transition: transition
      }),
      child
    );
  };

  return Overlay;
})(_react2['default'].Component);

Overlay.propTypes = _extends({}, _reactOverlaysLibOverlay2['default'].propTypes, {

  /**
   * Set the visibility of the Overlay
   */
  show: _react2['default'].PropTypes.bool,
  /**
   * Specify whether the overlay should trigger onHide when the user clicks outside the overlay
   */
  rootClose: _react2['default'].PropTypes.bool,
  /**
   * A callback invoked by the overlay when it wishes to be hidden. Required if
   * `rootClose` is specified.
   */
  onHide: _react2['default'].PropTypes.func,

  /**
   * Use animation
   */
  animation: _react2['default'].PropTypes.oneOfType([_react2['default'].PropTypes.bool, _reactPropTypesLibElementType2['default']]),

  /**
   * Callback fired before the Overlay transitions in
   */
  onEnter: _react2['default'].PropTypes.func,

  /**
   * Callback fired as the Overlay begins to transition in
   */
  onEntering: _react2['default'].PropTypes.func,

  /**
   * Callback fired after the Overlay finishes transitioning in
   */
  onEntered: _react2['default'].PropTypes.func,

  /**
   * Callback fired right before the Overlay transitions out
   */
  onExit: _react2['default'].PropTypes.func,

  /**
   * Callback fired as the Overlay begins to transition out
   */
  onExiting: _react2['default'].PropTypes.func,

  /**
   * Callback fired after the Overlay finishes transitioning out
   */
  onExited: _react2['default'].PropTypes.func
});

Overlay.defaultProps = {
  animation: _Fade2['default'],
  rootClose: false,
  show: false
};

exports['default'] = Overlay;
module.exports = exports['default'];
},{"./Fade":25,"babel-runtime/helpers/class-call-check":91,"babel-runtime/helpers/extends":92,"babel-runtime/helpers/inherits":93,"babel-runtime/helpers/interop-require-default":94,"babel-runtime/helpers/object-without-properties":96,"classnames":122,"react":453,"react-overlays/lib/Overlay":216,"react-prop-types/lib/elementType":232}],52:[function(require,module,exports){
/* eslint-disable react/prop-types */

'use strict';

var _extends = require('babel-runtime/helpers/extends')['default'];

var _Object$keys = require('babel-runtime/core-js/object/keys')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

exports.__esModule = true;

var _domHelpersQueryContains = require('dom-helpers/query/contains');

var _domHelpersQueryContains2 = _interopRequireDefault(_domHelpersQueryContains);

var _lodashCompatObjectPick = require('lodash-compat/object/pick');

var _lodashCompatObjectPick2 = _interopRequireDefault(_lodashCompatObjectPick);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _warning = require('warning');

var _warning2 = _interopRequireDefault(_warning);

var _Overlay = require('./Overlay');

var _Overlay2 = _interopRequireDefault(_Overlay);

var _utilsCreateChainedFunction = require('./utils/createChainedFunction');

var _utilsCreateChainedFunction2 = _interopRequireDefault(_utilsCreateChainedFunction);

/**
 * Check if value one is inside or equal to the of value
 *
 * @param {string} one
 * @param {string|array} of
 * @returns {boolean}
 */
function isOneOf(one, of) {
  if (Array.isArray(of)) {
    return of.indexOf(one) >= 0;
  }
  return one === of;
}

var OverlayTrigger = _react2['default'].createClass({
  displayName: 'OverlayTrigger',

  propTypes: _extends({}, _Overlay2['default'].propTypes, {

    /**
    * Specify which action or actions trigger Overlay visibility
    */
    trigger: _react2['default'].PropTypes.oneOfType([_react2['default'].PropTypes.oneOf(['click', 'hover', 'focus']), _react2['default'].PropTypes.arrayOf(_react2['default'].PropTypes.oneOf(['click', 'hover', 'focus']))]),

    /**
     * A millisecond delay amount to show and hide the Overlay once triggered
     */
    delay: _react2['default'].PropTypes.number,
    /**
     * A millisecond delay amount before showing the Overlay once triggered.
     */
    delayShow: _react2['default'].PropTypes.number,
    /**
     * A millisecond delay amount before hiding the Overlay once triggered.
     */
    delayHide: _react2['default'].PropTypes.number,

    /**
     * The initial visibility state of the Overlay, for more nuanced visibility controll consider
     * using the Overlay component directly.
     */
    defaultOverlayShown: _react2['default'].PropTypes.bool,

    /**
     * An element or text to overlay next to the target.
     */
    overlay: _react2['default'].PropTypes.node.isRequired,

    /**
     * @private
     */
    onBlur: _react2['default'].PropTypes.func,
    /**
     * @private
     */
    onClick: _react2['default'].PropTypes.func,
    /**
     * @private
     */
    onFocus: _react2['default'].PropTypes.func,
    /**
     * @private
     */
    onMouseEnter: _react2['default'].PropTypes.func,
    /**
     * @private
     */
    onMouseLeave: _react2['default'].PropTypes.func,

    // override specific overlay props
    /**
     * @private
     */
    target: function target() {},
    /**
    * @private
    */
    onHide: function onHide() {},
    /**
     * @private
     */
    show: function show() {}
  }),

  getDefaultProps: function getDefaultProps() {
    return {
      defaultOverlayShown: false,
      trigger: ['hover', 'focus']
    };
  },

  getInitialState: function getInitialState() {
    return {
      isOverlayShown: this.props.defaultOverlayShown
    };
  },

  show: function show() {
    this.setState({
      isOverlayShown: true
    });
  },

  hide: function hide() {
    this.setState({
      isOverlayShown: false
    });
  },

  toggle: function toggle() {
    if (this.state.isOverlayShown) {
      this.hide();
    } else {
      this.show();
    }
  },

  componentWillMount: function componentWillMount() {
    this.handleMouseOver = this.handleMouseOverOut.bind(null, this.handleDelayedShow);
    this.handleMouseOut = this.handleMouseOverOut.bind(null, this.handleDelayedHide);
  },

  componentDidMount: function componentDidMount() {
    this._mountNode = document.createElement('div');
    this.renderOverlay();
  },

  renderOverlay: function renderOverlay() {
    _reactDom2['default'].unstable_renderSubtreeIntoContainer(this, this._overlay, this._mountNode);
  },

  componentWillUnmount: function componentWillUnmount() {
    _reactDom2['default'].unmountComponentAtNode(this._mountNode);
    this._mountNode = null;
    clearTimeout(this._hoverDelay);
  },

  componentDidUpdate: function componentDidUpdate() {
    if (this._mountNode) {
      this.renderOverlay();
    }
  },

  getOverlayTarget: function getOverlayTarget() {
    return _reactDom2['default'].findDOMNode(this);
  },

  getOverlay: function getOverlay() {
    var overlayProps = _extends({}, _lodashCompatObjectPick2['default'](this.props, _Object$keys(_Overlay2['default'].propTypes)), {
      show: this.state.isOverlayShown,
      onHide: this.hide,
      target: this.getOverlayTarget,
      onExit: this.props.onExit,
      onExiting: this.props.onExiting,
      onExited: this.props.onExited,
      onEnter: this.props.onEnter,
      onEntering: this.props.onEntering,
      onEntered: this.props.onEntered
    });

    var overlay = _react.cloneElement(this.props.overlay, {
      placement: overlayProps.placement,
      container: overlayProps.container
    });

    return _react2['default'].createElement(
      _Overlay2['default'],
      overlayProps,
      overlay
    );
  },

  render: function render() {
    var trigger = _react2['default'].Children.only(this.props.children);
    var triggerProps = trigger.props;

    var props = {
      'aria-describedby': this.props.overlay.props.id
    };

    // create in render otherwise owner is lost...
    this._overlay = this.getOverlay();

    props.onClick = _utilsCreateChainedFunction2['default'](triggerProps.onClick, this.props.onClick);

    if (isOneOf('click', this.props.trigger)) {
      props.onClick = _utilsCreateChainedFunction2['default'](this.toggle, props.onClick);
    }

    if (isOneOf('hover', this.props.trigger)) {
      _warning2['default'](!(this.props.trigger === 'hover'), '[react-bootstrap] Specifying only the `"hover"` trigger limits the visibilty of the overlay to just mouse users. ' + 'Consider also including the `"focus"` trigger so that touch and keyboard only users can see the overlay as well.');

      props.onMouseOver = _utilsCreateChainedFunction2['default'](this.handleMouseOver, this.props.onMouseOver, triggerProps.onMouseOver);
      props.onMouseOut = _utilsCreateChainedFunction2['default'](this.handleMouseOut, this.props.onMouseOut, triggerProps.onMouseOut);
    }

    if (isOneOf('focus', this.props.trigger)) {
      props.onFocus = _utilsCreateChainedFunction2['default'](this.handleDelayedShow, this.props.onFocus, triggerProps.onFocus);
      props.onBlur = _utilsCreateChainedFunction2['default'](this.handleDelayedHide, this.props.onBlur, triggerProps.onBlur);
    }

    return _react.cloneElement(trigger, props);
  },

  handleDelayedShow: function handleDelayedShow() {
    var _this = this;

    if (this._hoverDelay != null) {
      clearTimeout(this._hoverDelay);
      this._hoverDelay = null;
      return;
    }

    var delay = this.props.delayShow != null ? this.props.delayShow : this.props.delay;

    if (!delay) {
      this.show();
      return;
    }

    this._hoverDelay = setTimeout(function () {
      _this._hoverDelay = null;
      _this.show();
    }, delay);
  },

  handleDelayedHide: function handleDelayedHide() {
    var _this2 = this;

    if (this._hoverDelay != null) {
      clearTimeout(this._hoverDelay);
      this._hoverDelay = null;
      return;
    }

    var delay = this.props.delayHide != null ? this.props.delayHide : this.props.delay;

    if (!delay) {
      this.hide();
      return;
    }

    this._hoverDelay = setTimeout(function () {
      _this2._hoverDelay = null;
      _this2.hide();
    }, delay);
  },

  // Simple implementation of mouseEnter and mouseLeave.
  // React's built version is broken: https://github.com/facebook/react/issues/4251
  // for cases when the trigger is disabled and mouseOut/Over can cause flicker moving
  // from one child element to another.
  handleMouseOverOut: function handleMouseOverOut(handler, e) {
    var target = e.currentTarget;
    var related = e.relatedTarget || e.nativeEvent.toElement;

    if (!related || related !== target && !_domHelpersQueryContains2['default'](target, related)) {
      handler(e);
    }
  }

});

exports['default'] = OverlayTrigger;
module.exports = exports['default'];
},{"./Overlay":51,"./utils/createChainedFunction":82,"babel-runtime/core-js/object/keys":89,"babel-runtime/helpers/extends":92,"babel-runtime/helpers/interop-require-default":94,"dom-helpers/query/contains":128,"lodash-compat/object/pick":212,"react":453,"react-dom":249,"warning":240}],53:[function(require,module,exports){
'use strict';

var _extends = require('babel-runtime/helpers/extends')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

exports.__esModule = true;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var PageHeader = _react2['default'].createClass({
  displayName: 'PageHeader',

  render: function render() {
    return _react2['default'].createElement(
      'div',
      _extends({}, this.props, { className: _classnames2['default'](this.props.className, 'page-header') }),
      _react2['default'].createElement(
        'h1',
        null,
        this.props.children
      )
    );
  }
});

exports['default'] = PageHeader;
module.exports = exports['default'];
},{"babel-runtime/helpers/extends":92,"babel-runtime/helpers/interop-require-default":94,"classnames":122,"react":453}],54:[function(require,module,exports){
'use strict';

var _extends = require('babel-runtime/helpers/extends')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

exports.__esModule = true;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _SafeAnchor = require('./SafeAnchor');

var _SafeAnchor2 = _interopRequireDefault(_SafeAnchor);

var PageItem = _react2['default'].createClass({
  displayName: 'PageItem',

  propTypes: {
    href: _react2['default'].PropTypes.string,
    target: _react2['default'].PropTypes.string,
    title: _react2['default'].PropTypes.string,
    disabled: _react2['default'].PropTypes.bool,
    previous: _react2['default'].PropTypes.bool,
    next: _react2['default'].PropTypes.bool,
    onSelect: _react2['default'].PropTypes.func,
    eventKey: _react2['default'].PropTypes.any
  },

  getDefaultProps: function getDefaultProps() {
    return {
      disabled: false,
      previous: false,
      next: false
    };
  },

  render: function render() {
    var classes = {
      'disabled': this.props.disabled,
      'previous': this.props.previous,
      'next': this.props.next
    };

    return _react2['default'].createElement(
      'li',
      _extends({}, this.props, {
        className: _classnames2['default'](this.props.className, classes) }),
      _react2['default'].createElement(
        _SafeAnchor2['default'],
        {
          href: this.props.href,
          title: this.props.title,
          target: this.props.target,
          onClick: this.handleSelect },
        this.props.children
      )
    );
  },

  handleSelect: function handleSelect(e) {
    if (this.props.onSelect || this.props.disabled) {
      e.preventDefault();

      if (!this.props.disabled) {
        this.props.onSelect(this.props.eventKey, this.props.href, this.props.target);
      }
    }
  }
});

exports['default'] = PageItem;
module.exports = exports['default'];
},{"./SafeAnchor":64,"babel-runtime/helpers/extends":92,"babel-runtime/helpers/interop-require-default":94,"classnames":122,"react":453}],55:[function(require,module,exports){
'use strict';

var _extends = require('babel-runtime/helpers/extends')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

exports.__esModule = true;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _utilsValidComponentChildren = require('./utils/ValidComponentChildren');

var _utilsValidComponentChildren2 = _interopRequireDefault(_utilsValidComponentChildren);

var _utilsCreateChainedFunction = require('./utils/createChainedFunction');

var _utilsCreateChainedFunction2 = _interopRequireDefault(_utilsCreateChainedFunction);

var Pager = _react2['default'].createClass({
  displayName: 'Pager',

  propTypes: {
    onSelect: _react2['default'].PropTypes.func
  },

  render: function render() {
    return _react2['default'].createElement(
      'ul',
      _extends({}, this.props, {
        className: _classnames2['default'](this.props.className, 'pager') }),
      _utilsValidComponentChildren2['default'].map(this.props.children, this.renderPageItem)
    );
  },

  renderPageItem: function renderPageItem(child, index) {
    return _react.cloneElement(child, {
      onSelect: _utilsCreateChainedFunction2['default'](child.props.onSelect, this.props.onSelect),
      key: child.key ? child.key : index
    });
  }
});

exports['default'] = Pager;
module.exports = exports['default'];
},{"./utils/ValidComponentChildren":79,"./utils/createChainedFunction":82,"babel-runtime/helpers/extends":92,"babel-runtime/helpers/interop-require-default":94,"classnames":122,"react":453}],56:[function(require,module,exports){
'use strict';

var _extends = require('babel-runtime/helpers/extends')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

exports.__esModule = true;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _BootstrapMixin = require('./BootstrapMixin');

var _BootstrapMixin2 = _interopRequireDefault(_BootstrapMixin);

var _PaginationButton = require('./PaginationButton');

var _PaginationButton2 = _interopRequireDefault(_PaginationButton);

var _reactPropTypesLibElementType = require('react-prop-types/lib/elementType');

var _reactPropTypesLibElementType2 = _interopRequireDefault(_reactPropTypesLibElementType);

var _SafeAnchor = require('./SafeAnchor');

var _SafeAnchor2 = _interopRequireDefault(_SafeAnchor);

var Pagination = _react2['default'].createClass({
  displayName: 'Pagination',

  mixins: [_BootstrapMixin2['default']],

  propTypes: {
    activePage: _react2['default'].PropTypes.number,
    items: _react2['default'].PropTypes.number,
    maxButtons: _react2['default'].PropTypes.number,
    /**
     * When `true`, will display the default node value ('...').
     * Otherwise, will display provided node (when specified).
     */
    ellipsis: _react2['default'].PropTypes.oneOfType([_react2['default'].PropTypes.bool, _react2['default'].PropTypes.node]),
    /**
     * When `true`, will display the default node value ('&laquo;').
     * Otherwise, will display provided node (when specified).
     */
    first: _react2['default'].PropTypes.oneOfType([_react2['default'].PropTypes.bool, _react2['default'].PropTypes.node]),
    /**
     * When `true`, will display the default node value ('&raquo;').
     * Otherwise, will display provided node (when specified).
     */
    last: _react2['default'].PropTypes.oneOfType([_react2['default'].PropTypes.bool, _react2['default'].PropTypes.node]),
    /**
     * When `true`, will display the default node value ('&lsaquo;').
     * Otherwise, will display provided node (when specified).
     */
    prev: _react2['default'].PropTypes.oneOfType([_react2['default'].PropTypes.bool, _react2['default'].PropTypes.node]),
    /**
     * When `true`, will display the default node value ('&rsaquo;').
     * Otherwise, will display provided node (when specified).
     */
    next: _react2['default'].PropTypes.oneOfType([_react2['default'].PropTypes.bool, _react2['default'].PropTypes.node]),
    onSelect: _react2['default'].PropTypes.func,
    /**
     * You can use a custom element for the buttons
     */
    buttonComponentClass: _reactPropTypesLibElementType2['default']
  },

  getDefaultProps: function getDefaultProps() {
    return {
      activePage: 1,
      items: 1,
      maxButtons: 0,
      first: false,
      last: false,
      prev: false,
      next: false,
      ellipsis: true,
      buttonComponentClass: _SafeAnchor2['default'],
      bsClass: 'pagination'
    };
  },

  renderPageButtons: function renderPageButtons() {
    var pageButtons = [];
    var startPage = undefined,
        endPage = undefined,
        hasHiddenPagesAfter = undefined;
    var _props = this.props;
    var maxButtons = _props.maxButtons;
    var activePage = _props.activePage;
    var items = _props.items;
    var onSelect = _props.onSelect;
    var ellipsis = _props.ellipsis;
    var buttonComponentClass = _props.buttonComponentClass;

    if (maxButtons) {
      var hiddenPagesBefore = activePage - parseInt(maxButtons / 2, 10);
      startPage = hiddenPagesBefore > 1 ? hiddenPagesBefore : 1;
      hasHiddenPagesAfter = startPage + maxButtons <= items;

      if (!hasHiddenPagesAfter) {
        endPage = items;
        startPage = items - maxButtons + 1;
        if (startPage < 1) {
          startPage = 1;
        }
      } else {
        endPage = startPage + maxButtons - 1;
      }
    } else {
      startPage = 1;
      endPage = items;
    }

    for (var pagenumber = startPage; pagenumber <= endPage; pagenumber++) {
      pageButtons.push(_react2['default'].createElement(
        _PaginationButton2['default'],
        {
          key: pagenumber,
          eventKey: pagenumber,
          active: pagenumber === activePage,
          onSelect: onSelect,
          buttonComponentClass: buttonComponentClass },
        pagenumber
      ));
    }

    if (maxButtons && hasHiddenPagesAfter && ellipsis) {
      pageButtons.push(_react2['default'].createElement(
        _PaginationButton2['default'],
        {
          key: 'ellipsis',
          disabled: true,
          buttonComponentClass: buttonComponentClass },
        _react2['default'].createElement(
          'span',
          { 'aria-label': 'More' },
          this.props.ellipsis === true ? '...' : this.props.ellipsis
        )
      ));
    }

    return pageButtons;
  },

  renderPrev: function renderPrev() {
    if (!this.props.prev) {
      return null;
    }

    return _react2['default'].createElement(
      _PaginationButton2['default'],
      {
        key: 'prev',
        eventKey: this.props.activePage - 1,
        disabled: this.props.activePage === 1,
        onSelect: this.props.onSelect,
        buttonComponentClass: this.props.buttonComponentClass },
      _react2['default'].createElement(
        'span',
        { 'aria-label': 'Previous' },
        this.props.prev === true ? '‹' : this.props.prev
      )
    );
  },

  renderNext: function renderNext() {
    if (!this.props.next) {
      return null;
    }

    return _react2['default'].createElement(
      _PaginationButton2['default'],
      {
        key: 'next',
        eventKey: this.props.activePage + 1,
        disabled: this.props.activePage >= this.props.items,
        onSelect: this.props.onSelect,
        buttonComponentClass: this.props.buttonComponentClass },
      _react2['default'].createElement(
        'span',
        { 'aria-label': 'Next' },
        this.props.next === true ? '›' : this.props.next
      )
    );
  },

  renderFirst: function renderFirst() {
    if (!this.props.first) {
      return null;
    }

    return _react2['default'].createElement(
      _PaginationButton2['default'],
      {
        key: 'first',
        eventKey: 1,
        disabled: this.props.activePage === 1,
        onSelect: this.props.onSelect,
        buttonComponentClass: this.props.buttonComponentClass },
      _react2['default'].createElement(
        'span',
        { 'aria-label': 'First' },
        this.props.first === true ? '«' : this.props.first
      )
    );
  },

  renderLast: function renderLast() {
    if (!this.props.last) {
      return null;
    }

    return _react2['default'].createElement(
      _PaginationButton2['default'],
      {
        key: 'last',
        eventKey: this.props.items,
        disabled: this.props.activePage >= this.props.items,
        onSelect: this.props.onSelect,
        buttonComponentClass: this.props.buttonComponentClass },
      _react2['default'].createElement(
        'span',
        { 'aria-label': 'Last' },
        this.props.last === true ? '»' : this.props.last
      )
    );
  },

  render: function render() {
    return _react2['default'].createElement(
      'ul',
      _extends({}, this.props, {
        className: _classnames2['default'](this.props.className, this.getBsClassSet()) }),
      this.renderFirst(),
      this.renderPrev(),
      this.renderPageButtons(),
      this.renderNext(),
      this.renderLast()
    );
  }
});

exports['default'] = Pagination;
module.exports = exports['default'];
},{"./BootstrapMixin":9,"./PaginationButton":57,"./SafeAnchor":64,"babel-runtime/helpers/extends":92,"babel-runtime/helpers/interop-require-default":94,"classnames":122,"react":453,"react-prop-types/lib/elementType":232}],57:[function(require,module,exports){
'use strict';

var _extends = require('babel-runtime/helpers/extends')['default'];

var _objectWithoutProperties = require('babel-runtime/helpers/object-without-properties')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

exports.__esModule = true;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _BootstrapMixin = require('./BootstrapMixin');

var _BootstrapMixin2 = _interopRequireDefault(_BootstrapMixin);

var _utilsCreateSelectedEvent = require('./utils/createSelectedEvent');

var _utilsCreateSelectedEvent2 = _interopRequireDefault(_utilsCreateSelectedEvent);

var _reactPropTypesLibElementType = require('react-prop-types/lib/elementType');

var _reactPropTypesLibElementType2 = _interopRequireDefault(_reactPropTypesLibElementType);

var PaginationButton = _react2['default'].createClass({
  displayName: 'PaginationButton',

  mixins: [_BootstrapMixin2['default']],

  propTypes: {
    className: _react2['default'].PropTypes.string,
    eventKey: _react2['default'].PropTypes.oneOfType([_react2['default'].PropTypes.string, _react2['default'].PropTypes.number]),
    onSelect: _react2['default'].PropTypes.func,
    disabled: _react2['default'].PropTypes.bool,
    active: _react2['default'].PropTypes.bool,
    /**
     * You can use a custom element for this component
     */
    buttonComponentClass: _reactPropTypesLibElementType2['default']
  },

  getDefaultProps: function getDefaultProps() {
    return {
      active: false,
      disabled: false
    };
  },

  handleClick: function handleClick(event) {
    if (this.props.disabled) {
      return;
    }

    if (this.props.onSelect) {
      var selectedEvent = _utilsCreateSelectedEvent2['default'](this.props.eventKey);
      this.props.onSelect(event, selectedEvent);
    }
  },

  render: function render() {
    var classes = _extends({
      active: this.props.active,
      disabled: this.props.disabled
    }, this.getBsClassSet());

    var _props = this.props;
    var className = _props.className;

    var anchorProps = _objectWithoutProperties(_props, ['className']);

    var ButtonComponentClass = this.props.buttonComponentClass;

    return _react2['default'].createElement(
      'li',
      { className: _classnames2['default'](className, classes) },
      _react2['default'].createElement(ButtonComponentClass, _extends({}, anchorProps, {
        onClick: this.handleClick }))
    );
  }
});

exports['default'] = PaginationButton;
module.exports = exports['default'];
},{"./BootstrapMixin":9,"./utils/createSelectedEvent":83,"babel-runtime/helpers/extends":92,"babel-runtime/helpers/interop-require-default":94,"babel-runtime/helpers/object-without-properties":96,"classnames":122,"react":453,"react-prop-types/lib/elementType":232}],58:[function(require,module,exports){
'use strict';

var _objectWithoutProperties = require('babel-runtime/helpers/object-without-properties')['default'];

var _extends = require('babel-runtime/helpers/extends')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

exports.__esModule = true;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _BootstrapMixin = require('./BootstrapMixin');

var _BootstrapMixin2 = _interopRequireDefault(_BootstrapMixin);

var _Collapse = require('./Collapse');

var _Collapse2 = _interopRequireDefault(_Collapse);

var Panel = _react2['default'].createClass({
  displayName: 'Panel',

  mixins: [_BootstrapMixin2['default']],

  propTypes: {
    collapsible: _react2['default'].PropTypes.bool,
    onSelect: _react2['default'].PropTypes.func,
    header: _react2['default'].PropTypes.node,
    id: _react2['default'].PropTypes.oneOfType([_react2['default'].PropTypes.string, _react2['default'].PropTypes.number]),
    footer: _react2['default'].PropTypes.node,
    defaultExpanded: _react2['default'].PropTypes.bool,
    expanded: _react2['default'].PropTypes.bool,
    eventKey: _react2['default'].PropTypes.any,
    headerRole: _react2['default'].PropTypes.string,
    panelRole: _react2['default'].PropTypes.string
  },

  getDefaultProps: function getDefaultProps() {
    return {
      bsClass: 'panel',
      bsStyle: 'default',
      defaultExpanded: false
    };
  },

  getInitialState: function getInitialState() {
    return {
      expanded: this.props.defaultExpanded
    };
  },

  handleSelect: function handleSelect(e) {
    e.selected = true;

    if (this.props.onSelect) {
      this.props.onSelect(e, this.props.eventKey);
    } else {
      e.preventDefault();
    }

    if (e.selected) {
      this.handleToggle();
    }
  },

  handleToggle: function handleToggle() {
    this.setState({ expanded: !this.state.expanded });
  },

  isExpanded: function isExpanded() {
    return this.props.expanded != null ? this.props.expanded : this.state.expanded;
  },

  render: function render() {
    var _props = this.props;
    var headerRole = _props.headerRole;
    var panelRole = _props.panelRole;

    var props = _objectWithoutProperties(_props, ['headerRole', 'panelRole']);

    return _react2['default'].createElement(
      'div',
      _extends({}, props, {
        className: _classnames2['default'](this.props.className, this.getBsClassSet()),
        id: this.props.collapsible ? null : this.props.id, onSelect: null }),
      this.renderHeading(headerRole),
      this.props.collapsible ? this.renderCollapsibleBody(panelRole) : this.renderBody(),
      this.renderFooter()
    );
  },

  renderCollapsibleBody: function renderCollapsibleBody(panelRole) {
    var props = {
      className: this.prefixClass('collapse'),
      id: this.props.id,
      ref: 'panel',
      'aria-hidden': !this.isExpanded()
    };
    if (panelRole) {
      props.role = panelRole;
    }

    return _react2['default'].createElement(
      _Collapse2['default'],
      { 'in': this.isExpanded() },
      _react2['default'].createElement(
        'div',
        props,
        this.renderBody()
      )
    );
  },

  renderBody: function renderBody() {
    var _this = this;

    var allChildren = this.props.children;
    var bodyElements = [];
    var panelBodyChildren = [];
    var bodyClass = this.prefixClass('body');

    function getProps() {
      return { key: bodyElements.length };
    }

    function addPanelChild(child) {
      bodyElements.push(_react.cloneElement(child, getProps()));
    }

    function addPanelBody(children) {
      bodyElements.push(_react2['default'].createElement(
        'div',
        _extends({ className: bodyClass }, getProps()),
        children
      ));
    }

    function maybeRenderPanelBody() {
      if (panelBodyChildren.length === 0) {
        return;
      }

      addPanelBody(panelBodyChildren);
      panelBodyChildren = [];
    }

    // Handle edge cases where we should not iterate through children.
    if (!Array.isArray(allChildren) || allChildren.length === 0) {
      if (this.shouldRenderFill(allChildren)) {
        addPanelChild(allChildren);
      } else {
        addPanelBody(allChildren);
      }
    } else {
      allChildren.forEach(function (child) {
        if (_this.shouldRenderFill(child)) {
          maybeRenderPanelBody();

          // Separately add the filled element.
          addPanelChild(child);
        } else {
          panelBodyChildren.push(child);
        }
      });

      maybeRenderPanelBody();
    }

    return bodyElements;
  },

  shouldRenderFill: function shouldRenderFill(child) {
    return _react2['default'].isValidElement(child) && child.props.fill != null;
  },

  renderHeading: function renderHeading(headerRole) {
    var header = this.props.header;

    if (!header) {
      return null;
    }

    if (!_react2['default'].isValidElement(header) || Array.isArray(header)) {
      header = this.props.collapsible ? this.renderCollapsibleTitle(header, headerRole) : header;
    } else {
      var className = _classnames2['default'](this.prefixClass('title'), header.props.className);

      if (this.props.collapsible) {
        header = _react.cloneElement(header, {
          className: className,
          children: this.renderAnchor(header.props.children, headerRole)
        });
      } else {
        header = _react.cloneElement(header, { className: className });
      }
    }

    return _react2['default'].createElement(
      'div',
      { className: this.prefixClass('heading') },
      header
    );
  },

  renderAnchor: function renderAnchor(header, headerRole) {
    return _react2['default'].createElement(
      'a',
      {
        href: '#' + (this.props.id || ''),
        'aria-controls': this.props.collapsible ? this.props.id : null,
        className: this.isExpanded() ? null : 'collapsed',
        'aria-expanded': this.isExpanded(),
        'aria-selected': this.isExpanded(),
        onClick: this.handleSelect,
        role: headerRole },
      header
    );
  },

  renderCollapsibleTitle: function renderCollapsibleTitle(header, headerRole) {
    return _react2['default'].createElement(
      'h4',
      { className: this.prefixClass('title'), role: 'presentation' },
      this.renderAnchor(header, headerRole)
    );
  },

  renderFooter: function renderFooter() {
    if (!this.props.footer) {
      return null;
    }

    return _react2['default'].createElement(
      'div',
      { className: this.prefixClass('footer') },
      this.props.footer
    );
  }
});

exports['default'] = Panel;
module.exports = exports['default'];
},{"./BootstrapMixin":9,"./Collapse":19,"babel-runtime/helpers/extends":92,"babel-runtime/helpers/interop-require-default":94,"babel-runtime/helpers/object-without-properties":96,"classnames":122,"react":453}],59:[function(require,module,exports){
/* eslint react/prop-types: [2, {ignore: "bsStyle"}] */
/* BootstrapMixin contains `bsStyle` type validation */

'use strict';

var _objectWithoutProperties = require('babel-runtime/helpers/object-without-properties')['default'];

var _extends = require('babel-runtime/helpers/extends')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

exports.__esModule = true;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _BootstrapMixin = require('./BootstrapMixin');

var _BootstrapMixin2 = _interopRequireDefault(_BootstrapMixin);

var _utilsValidComponentChildren = require('./utils/ValidComponentChildren');

var _utilsValidComponentChildren2 = _interopRequireDefault(_utilsValidComponentChildren);

var PanelGroup = _react2['default'].createClass({
  displayName: 'PanelGroup',

  mixins: [_BootstrapMixin2['default']],

  propTypes: {
    accordion: _react2['default'].PropTypes.bool,
    activeKey: _react2['default'].PropTypes.any,
    className: _react2['default'].PropTypes.string,
    children: _react2['default'].PropTypes.node,
    defaultActiveKey: _react2['default'].PropTypes.any,
    onSelect: _react2['default'].PropTypes.func
  },

  getDefaultProps: function getDefaultProps() {
    return {
      accordion: false,
      bsClass: 'panel-group'
    };
  },

  getInitialState: function getInitialState() {
    var defaultActiveKey = this.props.defaultActiveKey;

    return {
      activeKey: defaultActiveKey
    };
  },

  render: function render() {
    var classes = this.getBsClassSet();
    var _props = this.props;
    var className = _props.className;

    var props = _objectWithoutProperties(_props, ['className']);

    if (this.props.accordion) {
      props.role = 'tablist';
    }
    return _react2['default'].createElement(
      'div',
      _extends({}, props, { className: _classnames2['default'](className, classes), onSelect: null }),
      _utilsValidComponentChildren2['default'].map(props.children, this.renderPanel)
    );
  },

  renderPanel: function renderPanel(child, index) {
    var activeKey = this.props.activeKey != null ? this.props.activeKey : this.state.activeKey;

    var props = {
      bsStyle: child.props.bsStyle || this.props.bsStyle,
      key: child.key ? child.key : index,
      ref: child.ref
    };

    if (this.props.accordion) {
      props.headerRole = 'tab';
      props.panelRole = 'tabpanel';
      props.collapsible = true;
      props.expanded = child.props.eventKey === activeKey;
      props.onSelect = this.handleSelect;
    }

    return _react.cloneElement(child, props);
  },

  shouldComponentUpdate: function shouldComponentUpdate() {
    // Defer any updates to this component during the `onSelect` handler.
    return !this._isChanging;
  },

  handleSelect: function handleSelect(e, key) {
    e.preventDefault();

    if (this.props.onSelect) {
      this._isChanging = true;
      this.props.onSelect(key);
      this._isChanging = false;
    }

    if (this.state.activeKey === key) {
      key = null;
    }

    this.setState({
      activeKey: key
    });
  }
});

exports['default'] = PanelGroup;
module.exports = exports['default'];
},{"./BootstrapMixin":9,"./utils/ValidComponentChildren":79,"babel-runtime/helpers/extends":92,"babel-runtime/helpers/interop-require-default":94,"babel-runtime/helpers/object-without-properties":96,"classnames":122,"react":453}],60:[function(require,module,exports){
'use strict';

var _extends = require('babel-runtime/helpers/extends')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

exports.__esModule = true;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _BootstrapMixin = require('./BootstrapMixin');

var _BootstrapMixin2 = _interopRequireDefault(_BootstrapMixin);

var _reactPropTypesLibIsRequiredForA11y = require('react-prop-types/lib/isRequiredForA11y');

var _reactPropTypesLibIsRequiredForA11y2 = _interopRequireDefault(_reactPropTypesLibIsRequiredForA11y);

var Popover = _react2['default'].createClass({
  displayName: 'Popover',

  mixins: [_BootstrapMixin2['default']],

  propTypes: {
    /**
     * An html id attribute, necessary for accessibility
     * @type {string}
     * @required
     */
    id: _reactPropTypesLibIsRequiredForA11y2['default'](_react2['default'].PropTypes.oneOfType([_react2['default'].PropTypes.string, _react2['default'].PropTypes.number])),

    /**
     * Sets the direction the Popover is positioned towards.
     */
    placement: _react2['default'].PropTypes.oneOf(['top', 'right', 'bottom', 'left']),

    /**
     * The "left" position value for the Popover.
     */
    positionLeft: _react2['default'].PropTypes.number,
    /**
     * The "top" position value for the Popover.
     */
    positionTop: _react2['default'].PropTypes.number,
    /**
     * The "left" position value for the Popover arrow.
     */
    arrowOffsetLeft: _react2['default'].PropTypes.oneOfType([_react2['default'].PropTypes.number, _react2['default'].PropTypes.string]),
    /**
     * The "top" position value for the Popover arrow.
     */
    arrowOffsetTop: _react2['default'].PropTypes.oneOfType([_react2['default'].PropTypes.number, _react2['default'].PropTypes.string]),
    /**
     * Title text
     */
    title: _react2['default'].PropTypes.node
  },

  getDefaultProps: function getDefaultProps() {
    return {
      placement: 'right'
    };
  },

  render: function render() {
    var _classes;

    var classes = (_classes = {
      'popover': true
    }, _classes[this.props.placement] = true, _classes);

    var style = _extends({
      'left': this.props.positionLeft,
      'top': this.props.positionTop,
      'display': 'block'
    }, this.props.style);

    // eslint-disable-line react/prop-types
    var arrowStyle = {
      'left': this.props.arrowOffsetLeft,
      'top': this.props.arrowOffsetTop
    };

    return _react2['default'].createElement(
      'div',
      _extends({ role: 'tooltip' }, this.props, { className: _classnames2['default'](this.props.className, classes), style: style, title: null }),
      _react2['default'].createElement('div', { className: 'arrow', style: arrowStyle }),
      this.props.title ? this.renderTitle() : null,
      _react2['default'].createElement(
        'div',
        { className: 'popover-content' },
        this.props.children
      )
    );
  },

  renderTitle: function renderTitle() {
    return _react2['default'].createElement(
      'h3',
      { className: 'popover-title' },
      this.props.title
    );
  }
});

exports['default'] = Popover;
module.exports = exports['default'];
// we don't want to expose the `style` property
},{"./BootstrapMixin":9,"babel-runtime/helpers/extends":92,"babel-runtime/helpers/interop-require-default":94,"classnames":122,"react":453,"react-prop-types/lib/isRequiredForA11y":233}],61:[function(require,module,exports){
/* eslint react/prop-types: [2, {ignore: "bsStyle"}] */
/* BootstrapMixin contains `bsStyle` type validation */

'use strict';

var _extends = require('babel-runtime/helpers/extends')['default'];

var _objectWithoutProperties = require('babel-runtime/helpers/object-without-properties')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

exports.__esModule = true;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _Interpolate = require('./Interpolate');

var _Interpolate2 = _interopRequireDefault(_Interpolate);

var _BootstrapMixin = require('./BootstrapMixin');

var _BootstrapMixin2 = _interopRequireDefault(_BootstrapMixin);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _utilsValidComponentChildren = require('./utils/ValidComponentChildren');

var _utilsValidComponentChildren2 = _interopRequireDefault(_utilsValidComponentChildren);

var ProgressBar = _react2['default'].createClass({
  displayName: 'ProgressBar',

  propTypes: {
    min: _react.PropTypes.number,
    now: _react.PropTypes.number,
    max: _react.PropTypes.number,
    label: _react.PropTypes.node,
    srOnly: _react.PropTypes.bool,
    striped: _react.PropTypes.bool,
    active: _react.PropTypes.bool,
    children: onlyProgressBar, // eslint-disable-line no-use-before-define
    className: _react2['default'].PropTypes.string,
    interpolateClass: _react.PropTypes.node,
    /**
     * @private
     */
    isChild: _react.PropTypes.bool
  },

  mixins: [_BootstrapMixin2['default']],

  getDefaultProps: function getDefaultProps() {
    return {
      bsClass: 'progress-bar',
      min: 0,
      max: 100,
      active: false,
      isChild: false,
      srOnly: false,
      striped: false
    };
  },

  getPercentage: function getPercentage(now, min, max) {
    var roundPrecision = 1000;
    return Math.round((now - min) / (max - min) * 100 * roundPrecision) / roundPrecision;
  },

  render: function render() {
    if (this.props.isChild) {
      return this.renderProgressBar();
    }

    var content = undefined;

    if (this.props.children) {
      content = _utilsValidComponentChildren2['default'].map(this.props.children, this.renderChildBar);
    } else {
      content = this.renderProgressBar();
    }

    return _react2['default'].createElement(
      'div',
      _extends({}, this.props, {
        className: _classnames2['default'](this.props.className, 'progress'),
        min: null,
        max: null,
        label: null,
        'aria-valuetext': null
      }),
      content
    );
  },

  renderChildBar: function renderChildBar(child, index) {
    return _react.cloneElement(child, {
      isChild: true,
      key: child.key ? child.key : index
    });
  },

  renderProgressBar: function renderProgressBar() {
    var _props = this.props;
    var className = _props.className;
    var label = _props.label;
    var now = _props.now;
    var min = _props.min;
    var max = _props.max;

    var props = _objectWithoutProperties(_props, ['className', 'label', 'now', 'min', 'max']);

    var percentage = this.getPercentage(now, min, max);

    if (typeof label === 'string') {
      label = this.renderLabel(percentage);
    }

    if (this.props.srOnly) {
      label = _react2['default'].createElement(
        'span',
        { className: 'sr-only' },
        label
      );
    }

    var classes = _classnames2['default'](className, this.getBsClassSet(), {
      active: this.props.active,
      'progress-bar-striped': this.props.active || this.props.striped
    });

    return _react2['default'].createElement(
      'div',
      _extends({}, props, {
        className: classes,
        role: 'progressbar',
        style: { width: percentage + '%' },
        'aria-valuenow': this.props.now,
        'aria-valuemin': this.props.min,
        'aria-valuemax': this.props.max }),
      label
    );
  },

  renderLabel: function renderLabel(percentage) {
    var InterpolateClass = this.props.interpolateClass || _Interpolate2['default'];

    return _react2['default'].createElement(
      InterpolateClass,
      {
        now: this.props.now,
        min: this.props.min,
        max: this.props.max,
        percent: percentage,
        bsStyle: this.props.bsStyle },
      this.props.label
    );
  }
});

/**
 * Custom propTypes checker
 */
function onlyProgressBar(props, propName, componentName) {
  if (props[propName]) {
    var _ret = (function () {
      var error = undefined,
          childIdentifier = undefined;

      _react2['default'].Children.forEach(props[propName], function (child) {
        if (child.type !== ProgressBar) {
          childIdentifier = child.type.displayName ? child.type.displayName : child.type;
          error = new Error('Children of ' + componentName + ' can contain only ProgressBar components. Found ' + childIdentifier);
        }
      });

      return {
        v: error
      };
    })();

    if (typeof _ret === 'object') return _ret.v;
  }
}

exports['default'] = ProgressBar;
module.exports = exports['default'];
},{"./BootstrapMixin":9,"./Interpolate":34,"./utils/ValidComponentChildren":79,"babel-runtime/helpers/extends":92,"babel-runtime/helpers/interop-require-default":94,"babel-runtime/helpers/object-without-properties":96,"classnames":122,"react":453}],62:[function(require,module,exports){
'use strict';

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _extends = require('babel-runtime/helpers/extends')['default'];

var _objectWithoutProperties = require('babel-runtime/helpers/object-without-properties')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

exports.__esModule = true;

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _warning = require('warning');

var _warning2 = _interopRequireDefault(_warning);

var ResponsiveEmbed = (function (_React$Component) {
  _inherits(ResponsiveEmbed, _React$Component);

  function ResponsiveEmbed() {
    _classCallCheck(this, ResponsiveEmbed);

    _React$Component.apply(this, arguments);
  }

  ResponsiveEmbed.prototype.render = function render() {
    var _props = this.props;
    var bsClass = _props.bsClass;
    var className = _props.className;
    var a16by9 = _props.a16by9;
    var a4by3 = _props.a4by3;

    var props = _objectWithoutProperties(_props, ['bsClass', 'className', 'a16by9', 'a4by3']);

    _warning2['default'](!(!a16by9 && !a4by3), '`a16by9` or `a4by3` attribute must be set.');
    _warning2['default'](!(a16by9 && a4by3), 'Either `a16by9` or `a4by3` attribute can be set. Not both.');

    var aspectRatio = {
      'embed-responsive-16by9': a16by9,
      'embed-responsive-4by3': a4by3
    };

    return _react2['default'].createElement(
      'div',
      { className: _classnames2['default'](bsClass, aspectRatio) },
      _react.cloneElement(this.props.children, _extends({}, props, {
        className: _classnames2['default'](className, 'embed-responsive-item')
      }))
    );
  };

  return ResponsiveEmbed;
})(_react2['default'].Component);

ResponsiveEmbed.defaultProps = {
  bsClass: 'embed-responsive',
  a16by9: false,
  a4by3: false
};

ResponsiveEmbed.propTypes = {
  /**
   * bootstrap className
   * @private
   */
  bsClass: _react.PropTypes.string,
  /**
   * This component accepts only one child element
   */
  children: _react.PropTypes.element.isRequired,
  /**
   * 16by9 aspect ratio
   */
  a16by9: _react.PropTypes.bool,
  /**
   * 4by3 aspect ratio
   */
  a4by3: _react.PropTypes.bool
};

exports['default'] = ResponsiveEmbed;
module.exports = exports['default'];
},{"babel-runtime/helpers/class-call-check":91,"babel-runtime/helpers/extends":92,"babel-runtime/helpers/inherits":93,"babel-runtime/helpers/interop-require-default":94,"babel-runtime/helpers/object-without-properties":96,"classnames":122,"react":453,"warning":240}],63:[function(require,module,exports){
'use strict';

var _extends = require('babel-runtime/helpers/extends')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

exports.__esModule = true;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _reactPropTypesLibElementType = require('react-prop-types/lib/elementType');

var _reactPropTypesLibElementType2 = _interopRequireDefault(_reactPropTypesLibElementType);

var Row = _react2['default'].createClass({
  displayName: 'Row',

  propTypes: {
    /**
     * You can use a custom element for this component
     */
    componentClass: _reactPropTypesLibElementType2['default']
  },

  getDefaultProps: function getDefaultProps() {
    return {
      componentClass: 'div'
    };
  },

  render: function render() {
    var ComponentClass = this.props.componentClass;

    return _react2['default'].createElement(
      ComponentClass,
      _extends({}, this.props, { className: _classnames2['default'](this.props.className, 'row') }),
      this.props.children
    );
  }
});

exports['default'] = Row;
module.exports = exports['default'];
},{"babel-runtime/helpers/extends":92,"babel-runtime/helpers/interop-require-default":94,"classnames":122,"react":453,"react-prop-types/lib/elementType":232}],64:[function(require,module,exports){
'use strict';

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _extends = require('babel-runtime/helpers/extends')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

exports.__esModule = true;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _utilsCreateChainedFunction = require('./utils/createChainedFunction');

var _utilsCreateChainedFunction2 = _interopRequireDefault(_utilsCreateChainedFunction);

/**
 * Note: This is intended as a stop-gap for accessibility concerns that the
 * Bootstrap CSS does not address as they have styled anchors and not buttons
 * in many cases.
 */

var SafeAnchor = (function (_React$Component) {
  _inherits(SafeAnchor, _React$Component);

  function SafeAnchor(props) {
    _classCallCheck(this, SafeAnchor);

    _React$Component.call(this, props);

    this.handleClick = this.handleClick.bind(this);
  }

  SafeAnchor.prototype.handleClick = function handleClick(event) {
    if (this.props.href === undefined) {
      event.preventDefault();
    }
  };

  SafeAnchor.prototype.render = function render() {
    return _react2['default'].createElement('a', _extends({ role: this.props.href ? undefined : 'button'
    }, this.props, {
      onClick: _utilsCreateChainedFunction2['default'](this.props.onClick, this.handleClick),
      href: this.props.href || '' }));
  };

  return SafeAnchor;
})(_react2['default'].Component);

exports['default'] = SafeAnchor;

SafeAnchor.propTypes = {
  href: _react2['default'].PropTypes.string,
  onClick: _react2['default'].PropTypes.func
};
module.exports = exports['default'];
},{"./utils/createChainedFunction":82,"babel-runtime/helpers/class-call-check":91,"babel-runtime/helpers/extends":92,"babel-runtime/helpers/inherits":93,"babel-runtime/helpers/interop-require-default":94,"react":453}],65:[function(require,module,exports){
'use strict';

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _extends = require('babel-runtime/helpers/extends')['default'];

var _objectWithoutProperties = require('babel-runtime/helpers/object-without-properties')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

exports.__esModule = true;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _BootstrapMixin = require('./BootstrapMixin');

var _BootstrapMixin2 = _interopRequireDefault(_BootstrapMixin);

var _Button = require('./Button');

var _Button2 = _interopRequireDefault(_Button);

var _Dropdown = require('./Dropdown');

var _Dropdown2 = _interopRequireDefault(_Dropdown);

var _SplitToggle = require('./SplitToggle');

var _SplitToggle2 = _interopRequireDefault(_SplitToggle);

var SplitButton = (function (_React$Component) {
  _inherits(SplitButton, _React$Component);

  function SplitButton() {
    _classCallCheck(this, SplitButton);

    _React$Component.apply(this, arguments);
  }

  SplitButton.prototype.render = function render() {
    var _props = this.props;
    var children = _props.children;
    var title = _props.title;
    var onClick = _props.onClick;
    var target = _props.target;
    var href = _props.href;
    var
    // bsStyle is validated by 'Button' component
    bsStyle = _props.bsStyle;

    var props = _objectWithoutProperties(_props, ['children', 'title', 'onClick', 'target', 'href', 'bsStyle']);

    var disabled = props.disabled;

    var button = _react2['default'].createElement(
      _Button2['default'],
      {
        onClick: onClick,
        bsStyle: bsStyle,
        disabled: disabled,
        target: target,
        href: href
      },
      title
    );

    return _react2['default'].createElement(
      _Dropdown2['default'],
      props,
      button,
      _react2['default'].createElement(_SplitToggle2['default'], {
        'aria-label': title,
        bsStyle: bsStyle,
        disabled: disabled
      }),
      _react2['default'].createElement(
        _Dropdown2['default'].Menu,
        null,
        children
      )
    );
  };

  return SplitButton;
})(_react2['default'].Component);

SplitButton.propTypes = _extends({}, _Dropdown2['default'].propTypes, _BootstrapMixin2['default'].propTypes, {

  /**
   * @private
   */
  onClick: function onClick() {},
  target: _react2['default'].PropTypes.string,
  href: _react2['default'].PropTypes.string,
  /**
   * The content of the split button.
   */
  title: _react2['default'].PropTypes.node.isRequired
});

SplitButton.defaultProps = {
  disabled: false,
  dropup: false,
  pullRight: false
};

SplitButton.Toggle = _SplitToggle2['default'];

exports['default'] = SplitButton;
module.exports = exports['default'];
// eslint-disable-line
},{"./BootstrapMixin":9,"./Button":12,"./Dropdown":21,"./SplitToggle":66,"babel-runtime/helpers/class-call-check":91,"babel-runtime/helpers/extends":92,"babel-runtime/helpers/inherits":93,"babel-runtime/helpers/interop-require-default":94,"babel-runtime/helpers/object-without-properties":96,"react":453}],66:[function(require,module,exports){
'use strict';

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _extends = require('babel-runtime/helpers/extends')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

exports.__esModule = true;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _DropdownToggle = require('./DropdownToggle');

var _DropdownToggle2 = _interopRequireDefault(_DropdownToggle);

var SplitToggle = (function (_React$Component) {
  _inherits(SplitToggle, _React$Component);

  function SplitToggle() {
    _classCallCheck(this, SplitToggle);

    _React$Component.apply(this, arguments);
  }

  SplitToggle.prototype.render = function render() {
    return _react2['default'].createElement(_DropdownToggle2['default'], _extends({}, this.props, {
      useAnchor: false,
      noCaret: false
    }));
  };

  return SplitToggle;
})(_react2['default'].Component);

exports['default'] = SplitToggle;

SplitToggle.defaultProps = _DropdownToggle2['default'].defaultProps;
module.exports = exports['default'];
},{"./DropdownToggle":24,"babel-runtime/helpers/class-call-check":91,"babel-runtime/helpers/extends":92,"babel-runtime/helpers/inherits":93,"babel-runtime/helpers/interop-require-default":94,"react":453}],67:[function(require,module,exports){
'use strict';

var _extends = require('babel-runtime/helpers/extends')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

exports.__esModule = true;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _utilsValidComponentChildren = require('./utils/ValidComponentChildren');

var _utilsValidComponentChildren2 = _interopRequireDefault(_utilsValidComponentChildren);

var _utilsCreateChainedFunction = require('./utils/createChainedFunction');

var _utilsCreateChainedFunction2 = _interopRequireDefault(_utilsCreateChainedFunction);

var _BootstrapMixin = require('./BootstrapMixin');

var _BootstrapMixin2 = _interopRequireDefault(_BootstrapMixin);

var _SafeAnchor = require('./SafeAnchor');

var _SafeAnchor2 = _interopRequireDefault(_SafeAnchor);

var SubNav = _react2['default'].createClass({
  displayName: 'SubNav',

  mixins: [_BootstrapMixin2['default']],

  propTypes: {
    onSelect: _react2['default'].PropTypes.func,
    active: _react2['default'].PropTypes.bool,
    activeHref: _react2['default'].PropTypes.string,
    activeKey: _react2['default'].PropTypes.any,
    disabled: _react2['default'].PropTypes.bool,
    eventKey: _react2['default'].PropTypes.any,
    href: _react2['default'].PropTypes.string,
    title: _react2['default'].PropTypes.string,
    text: _react2['default'].PropTypes.node,
    target: _react2['default'].PropTypes.string
  },

  getDefaultProps: function getDefaultProps() {
    return {
      bsClass: 'nav',
      active: false,
      disabled: false
    };
  },

  handleClick: function handleClick(e) {
    if (this.props.onSelect) {
      e.preventDefault();

      if (!this.props.disabled) {
        this.props.onSelect(this.props.eventKey, this.props.href, this.props.target);
      }
    }
  },

  isActive: function isActive() {
    return this.isChildActive(this);
  },

  isChildActive: function isChildActive(child) {
    var _this = this;

    if (child.props.active) {
      return true;
    }

    if (this.props.activeKey != null && this.props.activeKey === child.props.eventKey) {
      return true;
    }

    if (this.props.activeHref != null && this.props.activeHref === child.props.href) {
      return true;
    }

    if (child.props.children) {
      var isActive = false;

      _utilsValidComponentChildren2['default'].forEach(child.props.children, function (grandchild) {
        if (_this.isChildActive(grandchild)) {
          isActive = true;
        }
      }, this);

      return isActive;
    }

    return false;
  },

  getChildActiveProp: function getChildActiveProp(child) {
    if (child.props.active) {
      return true;
    }
    if (this.props.activeKey != null) {
      if (child.props.eventKey === this.props.activeKey) {
        return true;
      }
    }
    if (this.props.activeHref != null) {
      if (child.props.href === this.props.activeHref) {
        return true;
      }
    }

    return child.props.active;
  },

  render: function render() {
    var classes = {
      'active': this.isActive(),
      'disabled': this.props.disabled
    };

    return _react2['default'].createElement(
      'li',
      _extends({}, this.props, { className: _classnames2['default'](this.props.className, classes) }),
      _react2['default'].createElement(
        _SafeAnchor2['default'],
        {
          href: this.props.href,
          title: this.props.title,
          target: this.props.target,
          onClick: this.handleClick },
        this.props.text
      ),
      _react2['default'].createElement(
        'ul',
        { className: 'nav' },
        _utilsValidComponentChildren2['default'].map(this.props.children, this.renderNavItem)
      )
    );
  },

  renderNavItem: function renderNavItem(child, index) {
    return _react.cloneElement(child, {
      active: this.getChildActiveProp(child),
      onSelect: _utilsCreateChainedFunction2['default'](child.props.onSelect, this.props.onSelect),
      key: child.key ? child.key : index
    });
  }
});

exports['default'] = SubNav;
module.exports = exports['default'];
},{"./BootstrapMixin":9,"./SafeAnchor":64,"./utils/ValidComponentChildren":79,"./utils/createChainedFunction":82,"babel-runtime/helpers/extends":92,"babel-runtime/helpers/interop-require-default":94,"classnames":122,"react":453}],68:[function(require,module,exports){
'use strict';

var _extends = require('babel-runtime/helpers/extends')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

exports.__esModule = true;

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _utilsTransitionEvents = require('./utils/TransitionEvents');

var _utilsTransitionEvents2 = _interopRequireDefault(_utilsTransitionEvents);

var Tab = _react2['default'].createClass({
  displayName: 'Tab',

  propTypes: {
    /**
     * @private
     */
    active: _react2['default'].PropTypes.bool,
    animation: _react2['default'].PropTypes.bool,
    /**
     * It is used by 'Tabs' - parent component
     * @private
     */
    onAnimateOutEnd: _react2['default'].PropTypes.func,
    disabled: _react2['default'].PropTypes.bool,
    title: _react2['default'].PropTypes.node,
    /**
     * tabClassName is used as className for the associated NavItem
     */
    tabClassName: _react2['default'].PropTypes.string
  },

  getDefaultProps: function getDefaultProps() {
    return {
      animation: true
    };
  },

  getInitialState: function getInitialState() {
    return {
      animateIn: false,
      animateOut: false
    };
  },

  componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
    if (this.props.animation) {
      if (!this.state.animateIn && nextProps.active && !this.props.active) {
        this.setState({
          animateIn: true
        });
      } else if (!this.state.animateOut && !nextProps.active && this.props.active) {
        this.setState({
          animateOut: true
        });
      }
    }
  },

  componentDidUpdate: function componentDidUpdate() {
    if (this.state.animateIn) {
      setTimeout(this.startAnimateIn, 0);
    }
    if (this.state.animateOut) {
      _utilsTransitionEvents2['default'].addEndEventListener(_reactDom2['default'].findDOMNode(this), this.stopAnimateOut);
    }
  },

  startAnimateIn: function startAnimateIn() {
    if (this.isMounted()) {
      this.setState({
        animateIn: false
      });
    }
  },

  stopAnimateOut: function stopAnimateOut() {
    if (this.isMounted()) {
      this.setState({
        animateOut: false
      });

      if (this.props.onAnimateOutEnd) {
        this.props.onAnimateOutEnd();
      }
    }
  },

  render: function render() {
    var classes = {
      'tab-pane': true,
      'fade': true,
      'active': this.props.active || this.state.animateOut,
      'in': this.props.active && !this.state.animateIn
    };

    return _react2['default'].createElement(
      'div',
      _extends({}, this.props, {
        title: undefined,
        role: 'tabpanel',
        'aria-hidden': !this.props.active,
        className: _classnames2['default'](this.props.className, classes)
      }),
      this.props.children
    );
  }
});

exports['default'] = Tab;
module.exports = exports['default'];
},{"./utils/TransitionEvents":78,"babel-runtime/helpers/extends":92,"babel-runtime/helpers/interop-require-default":94,"classnames":122,"react":453,"react-dom":249}],69:[function(require,module,exports){
'use strict';

var _extends = require('babel-runtime/helpers/extends')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

exports.__esModule = true;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var Table = _react2['default'].createClass({
  displayName: 'Table',

  propTypes: {
    striped: _react2['default'].PropTypes.bool,
    bordered: _react2['default'].PropTypes.bool,
    condensed: _react2['default'].PropTypes.bool,
    hover: _react2['default'].PropTypes.bool,
    responsive: _react2['default'].PropTypes.bool
  },

  getDefaultProps: function getDefaultProps() {
    return {
      bordered: false,
      condensed: false,
      hover: false,
      responsive: false,
      striped: false
    };
  },

  render: function render() {
    var classes = {
      'table': true,
      'table-striped': this.props.striped,
      'table-bordered': this.props.bordered,
      'table-condensed': this.props.condensed,
      'table-hover': this.props.hover
    };
    var table = _react2['default'].createElement(
      'table',
      _extends({}, this.props, { className: _classnames2['default'](this.props.className, classes) }),
      this.props.children
    );

    return this.props.responsive ? _react2['default'].createElement(
      'div',
      { className: 'table-responsive' },
      table
    ) : table;
  }
});

exports['default'] = Table;
module.exports = exports['default'];
},{"babel-runtime/helpers/extends":92,"babel-runtime/helpers/interop-require-default":94,"classnames":122,"react":453}],70:[function(require,module,exports){
'use strict';

var _extends = require('babel-runtime/helpers/extends')['default'];

var _objectWithoutProperties = require('babel-runtime/helpers/object-without-properties')['default'];

var _Object$keys = require('babel-runtime/core-js/object/keys')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

exports.__esModule = true;

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _Col = require('./Col');

var _Col2 = _interopRequireDefault(_Col);

var _Nav = require('./Nav');

var _Nav2 = _interopRequireDefault(_Nav);

var _NavItem = require('./NavItem');

var _NavItem2 = _interopRequireDefault(_NavItem);

var _styleMaps = require('./styleMaps');

var _styleMaps2 = _interopRequireDefault(_styleMaps);

var _keycode = require('keycode');

var _keycode2 = _interopRequireDefault(_keycode);

var _utilsCreateChainedFunction = require('./utils/createChainedFunction');

var _utilsCreateChainedFunction2 = _interopRequireDefault(_utilsCreateChainedFunction);

var _utilsValidComponentChildren = require('./utils/ValidComponentChildren');

var _utilsValidComponentChildren2 = _interopRequireDefault(_utilsValidComponentChildren);

var paneId = function paneId(props, child) {
  return child.props.id ? child.props.id : props.id && props.id + '___pane___' + child.props.eventKey;
};
var tabId = function tabId(props, child) {
  return child.props.id ? child.props.id + '___tab' : props.id && props.id + '___tab___' + child.props.eventKey;
};

var findChild = _utilsValidComponentChildren2['default'].find;

function getDefaultActiveKeyFromChildren(children) {
  var defaultActiveKey = undefined;

  _utilsValidComponentChildren2['default'].forEach(children, function (child) {
    if (defaultActiveKey == null) {
      defaultActiveKey = child.props.eventKey;
    }
  });

  return defaultActiveKey;
}

function move(children, currentKey, keys, moveNext) {
  var lastIdx = keys.length - 1;
  var stopAt = keys[moveNext ? Math.max(lastIdx, 0) : 0];
  var nextKey = currentKey;

  function getNext() {
    var idx = keys.indexOf(nextKey);
    nextKey = moveNext ? keys[Math.min(lastIdx, idx + 1)] : keys[Math.max(0, idx - 1)];

    return findChild(children, function (_child) {
      return _child.props.eventKey === nextKey;
    });
  }

  var next = getNext();

  while (next.props.eventKey !== stopAt && next.props.disabled) {
    next = getNext();
  }

  return next.props.disabled ? currentKey : next.props.eventKey;
}

var Tabs = _react2['default'].createClass({
  displayName: 'Tabs',

  propTypes: {
    activeKey: _react2['default'].PropTypes.any,
    defaultActiveKey: _react2['default'].PropTypes.any,
    /**
     * Navigation style for tabs
     *
     * If not specified, it will be treated as `'tabs'` when vertically
     * positioned and `'pills'` when horizontally positioned.
     */
    bsStyle: _react2['default'].PropTypes.oneOf(['tabs', 'pills']),
    animation: _react2['default'].PropTypes.bool,
    id: _react2['default'].PropTypes.oneOfType([_react2['default'].PropTypes.string, _react2['default'].PropTypes.number]),
    onSelect: _react2['default'].PropTypes.func,
    position: _react2['default'].PropTypes.oneOf(['top', 'left', 'right']),
    /**
     * Number of grid columns for the tabs if horizontally positioned
     *
     * This accepts either a single width or a mapping of size to width.
     */
    tabWidth: _react2['default'].PropTypes.oneOfType([_react2['default'].PropTypes.number, _react2['default'].PropTypes.object]),
    /**
     * Number of grid columns for the panes if horizontally positioned
     *
     * This accepts either a single width or a mapping of size to width. If not
     * specified, it will be treated as `styleMaps.GRID_COLUMNS` minus
     * `tabWidth`.
     */
    paneWidth: _react2['default'].PropTypes.oneOfType([_react2['default'].PropTypes.number, _react2['default'].PropTypes.object]),
    /**
     * Render without clearfix if horizontally positioned
     */
    standalone: _react2['default'].PropTypes.bool
  },

  getDefaultProps: function getDefaultProps() {
    return {
      animation: true,
      tabWidth: 2,
      position: 'top',
      standalone: false
    };
  },

  getInitialState: function getInitialState() {
    var defaultActiveKey = this.props.defaultActiveKey != null ? this.props.defaultActiveKey : getDefaultActiveKeyFromChildren(this.props.children);

    return {
      activeKey: defaultActiveKey,
      previousActiveKey: null
    };
  },

  componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
    var _this = this;

    if (nextProps.activeKey != null && nextProps.activeKey !== this.props.activeKey) {
      (function () {
        // check if the 'previousActiveKey' child still exists
        var previousActiveKey = _this.props.activeKey;
        _react2['default'].Children.forEach(nextProps.children, function (child) {
          if (_react2['default'].isValidElement(child)) {
            if (child.props.eventKey === previousActiveKey) {
              _this.setState({
                previousActiveKey: previousActiveKey
              });
              return;
            }
          }
        });
      })();
    }
  },

  componentDidUpdate: function componentDidUpdate() {
    var tabs = this._tabs;
    var tabIdx = this._eventKeys().indexOf(this.getActiveKey());

    if (this._needsRefocus) {
      this._needsRefocus = false;
      if (tabs && tabIdx !== -1) {
        var tabNode = _reactDom2['default'].findDOMNode(tabs[tabIdx]);

        if (tabNode) {
          tabNode.firstChild.focus();
        }
      }
    }
  },

  handlePaneAnimateOutEnd: function handlePaneAnimateOutEnd() {
    this.setState({
      previousActiveKey: null
    });
  },

  render: function render() {
    var _props = this.props;
    var id = _props.id;
    var className = _props.className;
    var style = _props.style;
    var position = _props.position;
    var bsStyle = _props.bsStyle;
    var tabWidth = _props.tabWidth;
    var paneWidth = _props.paneWidth;
    var standalone = _props.standalone;
    var children = _props.children;

    var props = _objectWithoutProperties(_props, ['id', 'className', 'style', 'position', 'bsStyle', 'tabWidth', 'paneWidth', 'standalone', 'children']);

    var isHorizontal = position === 'left' || position === 'right';

    if (bsStyle == null) {
      bsStyle = isHorizontal ? 'pills' : 'tabs';
    }

    var containerProps = { id: id, className: className, style: style };

    var tabsProps = _extends({}, props, {
      bsStyle: bsStyle,
      stacked: isHorizontal,
      activeKey: this.getActiveKey(),
      onSelect: this.handleSelect,
      ref: 'tabs',
      role: 'tablist'
    });
    var childTabs = _utilsValidComponentChildren2['default'].map(children, this.renderTab);

    var panesProps = {
      className: 'tab-content',
      ref: 'panes'
    };
    var childPanes = _utilsValidComponentChildren2['default'].map(children, this.renderPane);

    if (isHorizontal) {
      if (!standalone) {
        containerProps.className = _classnames2['default'](containerProps.className, 'clearfix');
      }

      var _getColProps = this.getColProps({ tabWidth: tabWidth, paneWidth: paneWidth });

      var tabsColProps = _getColProps.tabsColProps;
      var panesColProps = _getColProps.panesColProps;

      var tabs = _react2['default'].createElement(
        _Col2['default'],
        _extends({ componentClass: _Nav2['default'] }, tabsProps, tabsColProps),
        childTabs
      );
      var panes = _react2['default'].createElement(
        _Col2['default'],
        _extends({}, panesProps, panesColProps),
        childPanes
      );

      if (position === 'left') {
        return _react2['default'].createElement(
          'div',
          containerProps,
          tabs,
          panes
        );
      }

      return _react2['default'].createElement(
        'div',
        containerProps,
        panes,
        tabs
      );
    }

    return _react2['default'].createElement(
      'div',
      containerProps,
      _react2['default'].createElement(
        _Nav2['default'],
        tabsProps,
        childTabs
      ),
      _react2['default'].createElement(
        'div',
        panesProps,
        childPanes
      )
    );
  },

  getActiveKey: function getActiveKey() {
    return this.props.activeKey !== undefined ? this.props.activeKey : this.state.activeKey;
  },

  renderPane: function renderPane(child, index) {
    var previousActiveKey = this.state.previousActiveKey;

    var shouldPaneBeSetActive = child.props.eventKey === this.getActiveKey();
    var thereIsNoActivePane = previousActiveKey == null;

    var paneIsAlreadyActive = previousActiveKey != null && child.props.eventKey === previousActiveKey;

    return _react.cloneElement(child, {
      active: shouldPaneBeSetActive && (thereIsNoActivePane || !this.props.animation),
      id: paneId(this.props, child),
      'aria-labelledby': tabId(this.props, child),
      key: child.key ? child.key : index,
      animation: this.props.animation,
      onAnimateOutEnd: paneIsAlreadyActive ? this.handlePaneAnimateOutEnd : null
    });
  },

  renderTab: function renderTab(child, index) {
    var _this2 = this;

    if (child.props.title == null) {
      return null;
    }

    var _child$props = child.props;
    var eventKey = _child$props.eventKey;
    var title = _child$props.title;
    var disabled = _child$props.disabled;
    var onKeyDown = _child$props.onKeyDown;
    var tabClassName = _child$props.tabClassName;
    var _child$props$tabIndex = _child$props.tabIndex;
    var tabIndex = _child$props$tabIndex === undefined ? 0 : _child$props$tabIndex;

    var isActive = this.getActiveKey() === eventKey;

    return _react2['default'].createElement(
      _NavItem2['default'],
      {
        linkId: tabId(this.props, child),
        ref: function (ref) {
          return (_this2._tabs || (_this2._tabs = []))[index] = ref;
        },
        'aria-controls': paneId(this.props, child),
        onKeyDown: _utilsCreateChainedFunction2['default'](this.handleKeyDown, onKeyDown),
        eventKey: eventKey,
        tabIndex: isActive ? tabIndex : -1,
        disabled: disabled,
        className: tabClassName },
      title
    );
  },

  getColProps: function getColProps(_ref) {
    var tabWidth = _ref.tabWidth;
    var paneWidth = _ref.paneWidth;

    var tabsColProps = undefined;
    if (tabWidth instanceof Object) {
      tabsColProps = tabWidth;
    } else {
      tabsColProps = { xs: tabWidth };
    }

    var panesColProps = undefined;
    if (paneWidth == null) {
      panesColProps = {};
      _Object$keys(tabsColProps).forEach(function (size) {
        panesColProps[size] = _styleMaps2['default'].GRID_COLUMNS - tabsColProps[size];
      });
    } else if (paneWidth instanceof Object) {
      panesColProps = paneWidth;
    } else {
      panesColProps = { xs: paneWidth };
    }

    return { tabsColProps: tabsColProps, panesColProps: panesColProps };
  },

  shouldComponentUpdate: function shouldComponentUpdate() {
    // Defer any updates to this component during the `onSelect` handler.
    return !this._isChanging;
  },

  handleSelect: function handleSelect(selectedKey) {
    if (this.props.onSelect) {
      this._isChanging = true;
      this.props.onSelect(selectedKey);
      this._isChanging = false;
      return;
    }

    // if there is no external handler, then use embedded one
    var previousActiveKey = this.getActiveKey();
    if (selectedKey !== previousActiveKey) {
      this.setState({
        activeKey: selectedKey,
        previousActiveKey: previousActiveKey
      });
    }
  },

  handleKeyDown: function handleKeyDown(event) {
    var keys = this._eventKeys();
    var currentKey = this.getActiveKey() || keys[0];
    var next = undefined;

    switch (event.keyCode) {

      case _keycode2['default'].codes.left:
      case _keycode2['default'].codes.up:
        next = move(this.props.children, currentKey, keys, false);

        if (next && next !== currentKey) {
          event.preventDefault();
          this.handleSelect(next);
          this._needsRefocus = true;
        }
        break;
      case _keycode2['default'].codes.right:
      case _keycode2['default'].codes.down:
        next = move(this.props.children, currentKey, keys, true);

        if (next && next !== currentKey) {
          event.preventDefault();
          this.handleSelect(next);
          this._needsRefocus = true;
        }
        break;
      default:
    }
  },

  _eventKeys: function _eventKeys() {
    var keys = [];

    _utilsValidComponentChildren2['default'].forEach(this.props.children, function (_ref2) {
      var eventKey = _ref2.props.eventKey;
      return keys.push(eventKey);
    });

    return keys;
  }
});

exports['default'] = Tabs;
module.exports = exports['default'];
},{"./Col":18,"./Nav":46,"./NavItem":49,"./styleMaps":75,"./utils/ValidComponentChildren":79,"./utils/createChainedFunction":82,"babel-runtime/core-js/object/keys":89,"babel-runtime/helpers/extends":92,"babel-runtime/helpers/interop-require-default":94,"babel-runtime/helpers/object-without-properties":96,"classnames":122,"keycode":146,"react":453,"react-dom":249}],71:[function(require,module,exports){
'use strict';

var _extends = require('babel-runtime/helpers/extends')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

exports.__esModule = true;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _BootstrapMixin = require('./BootstrapMixin');

var _BootstrapMixin2 = _interopRequireDefault(_BootstrapMixin);

var _SafeAnchor = require('./SafeAnchor');

var _SafeAnchor2 = _interopRequireDefault(_SafeAnchor);

var Thumbnail = _react2['default'].createClass({
  displayName: 'Thumbnail',

  mixins: [_BootstrapMixin2['default']],

  propTypes: {
    alt: _react2['default'].PropTypes.string,
    href: _react2['default'].PropTypes.string,
    src: _react2['default'].PropTypes.string
  },

  getDefaultProps: function getDefaultProps() {
    return {
      bsClass: 'thumbnail'
    };
  },

  render: function render() {
    var classes = this.getBsClassSet();

    if (this.props.href) {
      return _react2['default'].createElement(
        _SafeAnchor2['default'],
        _extends({}, this.props, { href: this.props.href, className: _classnames2['default'](this.props.className, classes) }),
        _react2['default'].createElement('img', { src: this.props.src, alt: this.props.alt })
      );
    }

    if (this.props.children) {
      return _react2['default'].createElement(
        'div',
        _extends({}, this.props, { className: _classnames2['default'](this.props.className, classes) }),
        _react2['default'].createElement('img', { src: this.props.src, alt: this.props.alt }),
        _react2['default'].createElement(
          'div',
          { className: 'caption' },
          this.props.children
        )
      );
    }

    return _react2['default'].createElement(
      'div',
      _extends({}, this.props, { className: _classnames2['default'](this.props.className, classes) }),
      _react2['default'].createElement('img', { src: this.props.src, alt: this.props.alt })
    );
  }
});

exports['default'] = Thumbnail;
module.exports = exports['default'];
},{"./BootstrapMixin":9,"./SafeAnchor":64,"babel-runtime/helpers/extends":92,"babel-runtime/helpers/interop-require-default":94,"classnames":122,"react":453}],72:[function(require,module,exports){
'use strict';

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _extends = require('babel-runtime/helpers/extends')['default'];

var _objectWithoutProperties = require('babel-runtime/helpers/object-without-properties')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

exports.__esModule = true;

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactPropTypesLibIsRequiredForA11y = require('react-prop-types/lib/isRequiredForA11y');

var _reactPropTypesLibIsRequiredForA11y2 = _interopRequireDefault(_reactPropTypesLibIsRequiredForA11y);

var Tooltip = (function (_React$Component) {
  _inherits(Tooltip, _React$Component);

  function Tooltip() {
    _classCallCheck(this, Tooltip);

    _React$Component.apply(this, arguments);
  }

  Tooltip.prototype.render = function render() {
    var _props = this.props;
    var placement = _props.placement;
    var positionLeft = _props.positionLeft;
    var positionTop = _props.positionTop;
    var arrowOffsetLeft = _props.arrowOffsetLeft;
    var arrowOffsetTop = _props.arrowOffsetTop;
    var className = _props.className;
    var style = _props.style;
    var children = _props.children;

    var props = _objectWithoutProperties(_props, ['placement', 'positionLeft', 'positionTop', 'arrowOffsetLeft', 'arrowOffsetTop', 'className', 'style', 'children']);

    return _react2['default'].createElement(
      'div',
      _extends({
        role: 'tooltip'
      }, props, {
        className: _classnames2['default'](className, 'tooltip', placement),
        style: _extends({ left: positionLeft, top: positionTop }, style)
      }),
      _react2['default'].createElement('div', {
        className: 'tooltip-arrow',
        style: { left: arrowOffsetLeft, top: arrowOffsetTop }
      }),
      _react2['default'].createElement(
        'div',
        { className: 'tooltip-inner' },
        children
      )
    );
  };

  return Tooltip;
})(_react2['default'].Component);

exports['default'] = Tooltip;

Tooltip.propTypes = {
  /**
   * An html id attribute, necessary for accessibility
   * @type {string}
   * @required
   */
  id: _reactPropTypesLibIsRequiredForA11y2['default'](_react2['default'].PropTypes.oneOfType([_react2['default'].PropTypes.string, _react2['default'].PropTypes.number])),

  /**
   * The direction the tooltip is positioned towards
   */
  placement: _react2['default'].PropTypes.oneOf(['top', 'right', 'bottom', 'left']),

  /**
   * The `left` position value for the tooltip
   */
  positionLeft: _react2['default'].PropTypes.number,
  /**
   * The `top` position value for the tooltip
   */
  positionTop: _react2['default'].PropTypes.number,
  /**
   * The `left` position value for the tooltip arrow
   */
  arrowOffsetLeft: _react2['default'].PropTypes.oneOfType([_react2['default'].PropTypes.number, _react2['default'].PropTypes.string]),
  /**
   * The `top` position value for the tooltip arrow
   */
  arrowOffsetTop: _react2['default'].PropTypes.oneOfType([_react2['default'].PropTypes.number, _react2['default'].PropTypes.string])
};

Tooltip.defaultProps = {
  placement: 'right'
};
module.exports = exports['default'];
},{"babel-runtime/helpers/class-call-check":91,"babel-runtime/helpers/extends":92,"babel-runtime/helpers/inherits":93,"babel-runtime/helpers/interop-require-default":94,"babel-runtime/helpers/object-without-properties":96,"classnames":122,"react":453,"react-prop-types/lib/isRequiredForA11y":233}],73:[function(require,module,exports){
'use strict';

var _extends = require('babel-runtime/helpers/extends')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

exports.__esModule = true;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _BootstrapMixin = require('./BootstrapMixin');

var _BootstrapMixin2 = _interopRequireDefault(_BootstrapMixin);

var Well = _react2['default'].createClass({
  displayName: 'Well',

  mixins: [_BootstrapMixin2['default']],

  getDefaultProps: function getDefaultProps() {
    return {
      bsClass: 'well'
    };
  },

  render: function render() {
    var classes = this.getBsClassSet();

    return _react2['default'].createElement(
      'div',
      _extends({}, this.props, { className: _classnames2['default'](this.props.className, classes) }),
      this.props.children
    );
  }
});

exports['default'] = Well;
module.exports = exports['default'];
},{"./BootstrapMixin":9,"babel-runtime/helpers/extends":92,"babel-runtime/helpers/interop-require-default":94,"classnames":122,"react":453}],74:[function(require,module,exports){
'use strict';

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

var _interopRequireWildcard = require('babel-runtime/helpers/interop-require-wildcard')['default'];

exports.__esModule = true;

var _utilsChildrenValueInputValidation = require('./utils/childrenValueInputValidation');

var _utilsChildrenValueInputValidation2 = _interopRequireDefault(_utilsChildrenValueInputValidation);

var _utilsCreateChainedFunction = require('./utils/createChainedFunction');

var _utilsCreateChainedFunction2 = _interopRequireDefault(_utilsCreateChainedFunction);

var _utilsValidComponentChildren = require('./utils/ValidComponentChildren');

var _utilsValidComponentChildren2 = _interopRequireDefault(_utilsValidComponentChildren);

var _Accordion2 = require('./Accordion');

var _Accordion3 = _interopRequireDefault(_Accordion2);

exports.Accordion = _Accordion3['default'];

var _Affix2 = require('./Affix');

var _Affix3 = _interopRequireDefault(_Affix2);

exports.Affix = _Affix3['default'];

var _AffixMixin2 = require('./AffixMixin');

var _AffixMixin3 = _interopRequireDefault(_AffixMixin2);

exports.AffixMixin = _AffixMixin3['default'];

var _Alert2 = require('./Alert');

var _Alert3 = _interopRequireDefault(_Alert2);

exports.Alert = _Alert3['default'];

var _Badge2 = require('./Badge');

var _Badge3 = _interopRequireDefault(_Badge2);

exports.Badge = _Badge3['default'];

var _BootstrapMixin2 = require('./BootstrapMixin');

var _BootstrapMixin3 = _interopRequireDefault(_BootstrapMixin2);

exports.BootstrapMixin = _BootstrapMixin3['default'];

var _Breadcrumb2 = require('./Breadcrumb');

var _Breadcrumb3 = _interopRequireDefault(_Breadcrumb2);

exports.Breadcrumb = _Breadcrumb3['default'];

var _BreadcrumbItem2 = require('./BreadcrumbItem');

var _BreadcrumbItem3 = _interopRequireDefault(_BreadcrumbItem2);

exports.BreadcrumbItem = _BreadcrumbItem3['default'];

var _Button2 = require('./Button');

var _Button3 = _interopRequireDefault(_Button2);

exports.Button = _Button3['default'];

var _ButtonGroup2 = require('./ButtonGroup');

var _ButtonGroup3 = _interopRequireDefault(_ButtonGroup2);

exports.ButtonGroup = _ButtonGroup3['default'];

var _ButtonInput2 = require('./ButtonInput');

var _ButtonInput3 = _interopRequireDefault(_ButtonInput2);

exports.ButtonInput = _ButtonInput3['default'];

var _ButtonToolbar2 = require('./ButtonToolbar');

var _ButtonToolbar3 = _interopRequireDefault(_ButtonToolbar2);

exports.ButtonToolbar = _ButtonToolbar3['default'];

var _Carousel2 = require('./Carousel');

var _Carousel3 = _interopRequireDefault(_Carousel2);

exports.Carousel = _Carousel3['default'];

var _CarouselItem2 = require('./CarouselItem');

var _CarouselItem3 = _interopRequireDefault(_CarouselItem2);

exports.CarouselItem = _CarouselItem3['default'];

var _Col2 = require('./Col');

var _Col3 = _interopRequireDefault(_Col2);

exports.Col = _Col3['default'];

var _CollapsibleNav2 = require('./CollapsibleNav');

var _CollapsibleNav3 = _interopRequireDefault(_CollapsibleNav2);

exports.CollapsibleNav = _CollapsibleNav3['default'];

var _Dropdown2 = require('./Dropdown');

var _Dropdown3 = _interopRequireDefault(_Dropdown2);

exports.Dropdown = _Dropdown3['default'];

var _DropdownButton2 = require('./DropdownButton');

var _DropdownButton3 = _interopRequireDefault(_DropdownButton2);

exports.DropdownButton = _DropdownButton3['default'];

var _Glyphicon2 = require('./Glyphicon');

var _Glyphicon3 = _interopRequireDefault(_Glyphicon2);

exports.Glyphicon = _Glyphicon3['default'];

var _Grid2 = require('./Grid');

var _Grid3 = _interopRequireDefault(_Grid2);

exports.Grid = _Grid3['default'];

var _Image2 = require('./Image');

var _Image3 = _interopRequireDefault(_Image2);

exports.Image = _Image3['default'];

var _Input2 = require('./Input');

var _Input3 = _interopRequireDefault(_Input2);

exports.Input = _Input3['default'];

var _Interpolate2 = require('./Interpolate');

var _Interpolate3 = _interopRequireDefault(_Interpolate2);

exports.Interpolate = _Interpolate3['default'];

var _Jumbotron2 = require('./Jumbotron');

var _Jumbotron3 = _interopRequireDefault(_Jumbotron2);

exports.Jumbotron = _Jumbotron3['default'];

var _Label2 = require('./Label');

var _Label3 = _interopRequireDefault(_Label2);

exports.Label = _Label3['default'];

var _ListGroup2 = require('./ListGroup');

var _ListGroup3 = _interopRequireDefault(_ListGroup2);

exports.ListGroup = _ListGroup3['default'];

var _ListGroupItem2 = require('./ListGroupItem');

var _ListGroupItem3 = _interopRequireDefault(_ListGroupItem2);

exports.ListGroupItem = _ListGroupItem3['default'];

var _MenuItem2 = require('./MenuItem');

var _MenuItem3 = _interopRequireDefault(_MenuItem2);

exports.MenuItem = _MenuItem3['default'];

var _Modal2 = require('./Modal');

var _Modal3 = _interopRequireDefault(_Modal2);

exports.Modal = _Modal3['default'];

var _ModalBody2 = require('./ModalBody');

var _ModalBody3 = _interopRequireDefault(_ModalBody2);

exports.ModalBody = _ModalBody3['default'];

var _ModalFooter2 = require('./ModalFooter');

var _ModalFooter3 = _interopRequireDefault(_ModalFooter2);

exports.ModalFooter = _ModalFooter3['default'];

var _ModalHeader2 = require('./ModalHeader');

var _ModalHeader3 = _interopRequireDefault(_ModalHeader2);

exports.ModalHeader = _ModalHeader3['default'];

var _ModalTitle2 = require('./ModalTitle');

var _ModalTitle3 = _interopRequireDefault(_ModalTitle2);

exports.ModalTitle = _ModalTitle3['default'];

var _Nav2 = require('./Nav');

var _Nav3 = _interopRequireDefault(_Nav2);

exports.Nav = _Nav3['default'];

var _Navbar2 = require('./Navbar');

var _Navbar3 = _interopRequireDefault(_Navbar2);

exports.Navbar = _Navbar3['default'];

var _NavBrand2 = require('./NavBrand');

var _NavBrand3 = _interopRequireDefault(_NavBrand2);

exports.NavBrand = _NavBrand3['default'];

var _NavDropdown2 = require('./NavDropdown');

var _NavDropdown3 = _interopRequireDefault(_NavDropdown2);

exports.NavDropdown = _NavDropdown3['default'];

var _NavItem2 = require('./NavItem');

var _NavItem3 = _interopRequireDefault(_NavItem2);

exports.NavItem = _NavItem3['default'];

var _Overlay2 = require('./Overlay');

var _Overlay3 = _interopRequireDefault(_Overlay2);

exports.Overlay = _Overlay3['default'];

var _OverlayTrigger2 = require('./OverlayTrigger');

var _OverlayTrigger3 = _interopRequireDefault(_OverlayTrigger2);

exports.OverlayTrigger = _OverlayTrigger3['default'];

var _PageHeader2 = require('./PageHeader');

var _PageHeader3 = _interopRequireDefault(_PageHeader2);

exports.PageHeader = _PageHeader3['default'];

var _PageItem2 = require('./PageItem');

var _PageItem3 = _interopRequireDefault(_PageItem2);

exports.PageItem = _PageItem3['default'];

var _Pager2 = require('./Pager');

var _Pager3 = _interopRequireDefault(_Pager2);

exports.Pager = _Pager3['default'];

var _Pagination2 = require('./Pagination');

var _Pagination3 = _interopRequireDefault(_Pagination2);

exports.Pagination = _Pagination3['default'];

var _Panel2 = require('./Panel');

var _Panel3 = _interopRequireDefault(_Panel2);

exports.Panel = _Panel3['default'];

var _PanelGroup2 = require('./PanelGroup');

var _PanelGroup3 = _interopRequireDefault(_PanelGroup2);

exports.PanelGroup = _PanelGroup3['default'];

var _Popover2 = require('./Popover');

var _Popover3 = _interopRequireDefault(_Popover2);

exports.Popover = _Popover3['default'];

var _ProgressBar2 = require('./ProgressBar');

var _ProgressBar3 = _interopRequireDefault(_ProgressBar2);

exports.ProgressBar = _ProgressBar3['default'];

var _ResponsiveEmbed2 = require('./ResponsiveEmbed');

var _ResponsiveEmbed3 = _interopRequireDefault(_ResponsiveEmbed2);

exports.ResponsiveEmbed = _ResponsiveEmbed3['default'];

var _Row2 = require('./Row');

var _Row3 = _interopRequireDefault(_Row2);

exports.Row = _Row3['default'];

var _SafeAnchor2 = require('./SafeAnchor');

var _SafeAnchor3 = _interopRequireDefault(_SafeAnchor2);

exports.SafeAnchor = _SafeAnchor3['default'];

var _SplitButton3 = require('./SplitButton');

var _SplitButton4 = _interopRequireDefault(_SplitButton3);

exports.SplitButton = _SplitButton4['default'];

var _SplitButton5 = _interopRequireDefault(_SplitButton3);

exports.SplitButton = _SplitButton5['default'];

var _styleMaps2 = require('./styleMaps');

var _styleMaps3 = _interopRequireDefault(_styleMaps2);

exports.styleMaps = _styleMaps3['default'];

var _SubNav2 = require('./SubNav');

var _SubNav3 = _interopRequireDefault(_SubNav2);

exports.SubNav = _SubNav3['default'];

var _Tab2 = require('./Tab');

var _Tab3 = _interopRequireDefault(_Tab2);

exports.Tab = _Tab3['default'];

var _Table2 = require('./Table');

var _Table3 = _interopRequireDefault(_Table2);

exports.Table = _Table3['default'];

var _Tabs2 = require('./Tabs');

var _Tabs3 = _interopRequireDefault(_Tabs2);

exports.Tabs = _Tabs3['default'];

var _Thumbnail2 = require('./Thumbnail');

var _Thumbnail3 = _interopRequireDefault(_Thumbnail2);

exports.Thumbnail = _Thumbnail3['default'];

var _Tooltip2 = require('./Tooltip');

var _Tooltip3 = _interopRequireDefault(_Tooltip2);

exports.Tooltip = _Tooltip3['default'];

var _Well2 = require('./Well');

var _Well3 = _interopRequireDefault(_Well2);

exports.Well = _Well3['default'];

var _Collapse2 = require('./Collapse');

var _Collapse3 = _interopRequireDefault(_Collapse2);

exports.Collapse = _Collapse3['default'];

var _Fade2 = require('./Fade');

var _Fade3 = _interopRequireDefault(_Fade2);

exports.Fade = _Fade3['default'];

var _FormControls2 = require('./FormControls');

var _FormControls = _interopRequireWildcard(_FormControls2);

exports.FormControls = _FormControls;
var utils = {
  childrenValueInputValidation: _utilsChildrenValueInputValidation2['default'],
  createChainedFunction: _utilsCreateChainedFunction2['default'],
  ValidComponentChildren: _utilsValidComponentChildren2['default']
};
exports.utils = utils;
},{"./Accordion":4,"./Affix":5,"./AffixMixin":6,"./Alert":7,"./Badge":8,"./BootstrapMixin":9,"./Breadcrumb":10,"./BreadcrumbItem":11,"./Button":12,"./ButtonGroup":13,"./ButtonInput":14,"./ButtonToolbar":15,"./Carousel":16,"./CarouselItem":17,"./Col":18,"./Collapse":19,"./CollapsibleNav":20,"./Dropdown":21,"./DropdownButton":22,"./Fade":25,"./FormControls":27,"./Glyphicon":29,"./Grid":30,"./Image":31,"./Input":32,"./Interpolate":34,"./Jumbotron":35,"./Label":36,"./ListGroup":37,"./ListGroupItem":38,"./MenuItem":39,"./Modal":40,"./ModalBody":41,"./ModalFooter":43,"./ModalHeader":44,"./ModalTitle":45,"./Nav":46,"./NavBrand":47,"./NavDropdown":48,"./NavItem":49,"./Navbar":50,"./Overlay":51,"./OverlayTrigger":52,"./PageHeader":53,"./PageItem":54,"./Pager":55,"./Pagination":56,"./Panel":58,"./PanelGroup":59,"./Popover":60,"./ProgressBar":61,"./ResponsiveEmbed":62,"./Row":63,"./SafeAnchor":64,"./SplitButton":65,"./SubNav":67,"./Tab":68,"./Table":69,"./Tabs":70,"./Thumbnail":71,"./Tooltip":72,"./Well":73,"./styleMaps":75,"./utils/ValidComponentChildren":79,"./utils/childrenValueInputValidation":81,"./utils/createChainedFunction":82,"babel-runtime/helpers/interop-require-default":94,"babel-runtime/helpers/interop-require-wildcard":95}],75:[function(require,module,exports){
'use strict';

exports.__esModule = true;
var styleMaps = {
  CLASSES: {
    'alert': 'alert',
    'button': 'btn',
    'button-group': 'btn-group',
    'button-toolbar': 'btn-toolbar',
    'column': 'col',
    'input-group': 'input-group',
    'form': 'form',
    'glyphicon': 'glyphicon',
    'label': 'label',
    'thumbnail': 'thumbnail',
    'list-group-item': 'list-group-item',
    'panel': 'panel',
    'panel-group': 'panel-group',
    'pagination': 'pagination',
    'progress-bar': 'progress-bar',
    'nav': 'nav',
    'navbar': 'navbar',
    'modal': 'modal',
    'row': 'row',
    'well': 'well'
  },
  STYLES: ['default', 'primary', 'success', 'info', 'warning', 'danger', 'link', 'inline', 'tabs', 'pills'],
  addStyle: function addStyle(name) {
    styleMaps.STYLES.push(name);
  },
  SIZES: {
    'large': 'lg',
    'medium': 'md',
    'small': 'sm',
    'xsmall': 'xs',
    'lg': 'lg',
    'md': 'md',
    'sm': 'sm',
    'xs': 'xs'
  },
  GRID_COLUMNS: 12
};

exports['default'] = styleMaps;
module.exports = exports['default'];
},{}],76:[function(require,module,exports){
'use strict';

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

exports.__esModule = true;

var _reactPropTypesLibCommon = require('react-prop-types/lib/common');

var _childrenToArray = require('./childrenToArray');

var _childrenToArray2 = _interopRequireDefault(_childrenToArray);

exports['default'] = {

  requiredRoles: function requiredRoles() {
    for (var _len = arguments.length, roles = Array(_len), _key = 0; _key < _len; _key++) {
      roles[_key] = arguments[_key];
    }

    return _reactPropTypesLibCommon.createChainableTypeChecker(function requiredRolesValidator(props, propName, component) {
      var missing = undefined;
      var children = _childrenToArray2['default'](props.children);

      var inRole = function inRole(role, child) {
        return role === child.props.bsRole;
      };

      roles.every(function (role) {
        if (!children.some(function (child) {
          return inRole(role, child);
        })) {
          missing = role;
          return false;
        }
        return true;
      });

      if (missing) {
        return new Error('(children) ' + component + ' - Missing a required child with bsRole: ' + missing + '. ' + (component + ' must have at least one child of each of the following bsRoles: ' + roles.join(', ')));
      }
    });
  },

  exclusiveRoles: function exclusiveRoles() {
    for (var _len2 = arguments.length, roles = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      roles[_key2] = arguments[_key2];
    }

    return _reactPropTypesLibCommon.createChainableTypeChecker(function exclusiveRolesValidator(props, propName, component) {
      var children = _childrenToArray2['default'](props.children);
      var duplicate = undefined;

      roles.every(function (role) {
        var childrenWithRole = children.filter(function (child) {
          return child.props.bsRole === role;
        });

        if (childrenWithRole.length > 1) {
          duplicate = role;
          return false;
        }
        return true;
      });

      if (duplicate) {
        return new Error('(children) ' + component + ' - Duplicate children detected of bsRole: ' + duplicate + '. ' + ('Only one child each allowed with the following bsRoles: ' + roles.join(', ')));
      }
    });
  }
};
module.exports = exports['default'];
},{"./childrenToArray":80,"babel-runtime/helpers/interop-require-default":94,"react-prop-types/lib/common":230}],77:[function(require,module,exports){
/**
 * Copyright 2013-2014 Facebook, Inc.
 *
 * This file contains a modified version of:
 * https://github.com/facebook/react/blob/v0.12.0/src/vendor/stubs/EventListener.js
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * TODO: remove in favour of solution provided by:
 *  https://github.com/facebook/react/issues/285
 */

/**
 * Does not take into account specific nature of platform.
 */
'use strict';

exports.__esModule = true;
var EventListener = {
  /**
   * Listen to DOM events during the bubble phase.
   *
   * @param {DOMEventTarget} target DOM element to register listener on.
   * @param {string} eventType Event type, e.g. 'click' or 'mouseover'.
   * @param {function} callback Callback function.
   * @return {object} Object with a `remove` method.
   */
  listen: function listen(target, eventType, callback) {
    if (target.addEventListener) {
      target.addEventListener(eventType, callback, false);
      return {
        remove: function remove() {
          target.removeEventListener(eventType, callback, false);
        }
      };
    } else if (target.attachEvent) {
      target.attachEvent('on' + eventType, callback);
      return {
        remove: function remove() {
          target.detachEvent('on' + eventType, callback);
        }
      };
    }
  }
};

exports['default'] = EventListener;
module.exports = exports['default'];
},{}],78:[function(require,module,exports){
/**
 * Copyright 2013-2014, Facebook, Inc.
 * All rights reserved.
 *
 * This file contains a modified version of:
 * https://github.com/facebook/react/blob/v0.12.0/src/addons/transitions/ReactTransitionEvents.js
 *
 * This source code is licensed under the BSD-style license found here:
 * https://github.com/facebook/react/blob/v0.12.0/LICENSE
 * An additional grant of patent rights can be found here:
 * https://github.com/facebook/react/blob/v0.12.0/PATENTS
 */

'use strict';

exports.__esModule = true;
var canUseDOM = !!(typeof window !== 'undefined' && window.document && window.document.createElement);

/**
 * EVENT_NAME_MAP is used to determine which event fired when a
 * transition/animation ends, based on the style property used to
 * define that event.
 */
var EVENT_NAME_MAP = {
  transitionend: {
    'transition': 'transitionend',
    'WebkitTransition': 'webkitTransitionEnd',
    'MozTransition': 'mozTransitionEnd',
    'OTransition': 'oTransitionEnd',
    'msTransition': 'MSTransitionEnd'
  },

  animationend: {
    'animation': 'animationend',
    'WebkitAnimation': 'webkitAnimationEnd',
    'MozAnimation': 'mozAnimationEnd',
    'OAnimation': 'oAnimationEnd',
    'msAnimation': 'MSAnimationEnd'
  }
};

var endEvents = [];

function detectEvents() {
  var testEl = document.createElement('div');
  var style = testEl.style;

  // On some platforms, in particular some releases of Android 4.x,
  // the un-prefixed "animation" and "transition" properties are defined on the
  // style object but the events that fire will still be prefixed, so we need
  // to check if the un-prefixed events are useable, and if not remove them
  // from the map
  if (!('AnimationEvent' in window)) {
    delete EVENT_NAME_MAP.animationend.animation;
  }

  if (!('TransitionEvent' in window)) {
    delete EVENT_NAME_MAP.transitionend.transition;
  }

  for (var baseEventName in EVENT_NAME_MAP) {
    // eslint-disable-line guard-for-in
    var baseEvents = EVENT_NAME_MAP[baseEventName];
    for (var styleName in baseEvents) {
      if (styleName in style) {
        endEvents.push(baseEvents[styleName]);
        break;
      }
    }
  }
}

if (canUseDOM) {
  detectEvents();
}

// We use the raw {add|remove}EventListener() call because EventListener
// does not know how to remove event listeners and we really should
// clean up. Also, these events are not triggered in older browsers
// so we should be A-OK here.

function addEventListener(node, eventName, eventListener) {
  node.addEventListener(eventName, eventListener, false);
}

function removeEventListener(node, eventName, eventListener) {
  node.removeEventListener(eventName, eventListener, false);
}

var ReactTransitionEvents = {
  addEndEventListener: function addEndEventListener(node, eventListener) {
    if (endEvents.length === 0) {
      // If CSS transitions are not supported, trigger an "end animation"
      // event immediately.
      window.setTimeout(eventListener, 0);
      return;
    }
    endEvents.forEach(function (endEvent) {
      addEventListener(node, endEvent, eventListener);
    });
  },

  removeEndEventListener: function removeEndEventListener(node, eventListener) {
    if (endEvents.length === 0) {
      return;
    }
    endEvents.forEach(function (endEvent) {
      removeEventListener(node, endEvent, eventListener);
    });
  }
};

exports['default'] = ReactTransitionEvents;
module.exports = exports['default'];
},{}],79:[function(require,module,exports){
'use strict';

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

exports.__esModule = true;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

/**
 * Maps children that are typically specified as `props.children`,
 * but only iterates over children that are "valid components".
 *
 * The mapFunction provided index will be normalised to the components mapped,
 * so an invalid component would not increase the index.
 *
 * @param {?*} children Children tree container.
 * @param {function(*, int)} mapFunction.
 * @param {*} mapContext Context for mapFunction.
 * @return {object} Object containing the ordered map of results.
 */
function mapValidComponents(children, func, context) {
  var index = 0;

  return _react2['default'].Children.map(children, function (child) {
    if (_react2['default'].isValidElement(child)) {
      var lastIndex = index;
      index++;
      return func.call(context, child, lastIndex);
    }

    return child;
  });
}

/**
 * Iterates through children that are typically specified as `props.children`,
 * but only iterates over children that are "valid components".
 *
 * The provided forEachFunc(child, index) will be called for each
 * leaf child with the index reflecting the position relative to "valid components".
 *
 * @param {?*} children Children tree container.
 * @param {function(*, int)} forEachFunc.
 * @param {*} forEachContext Context for forEachContext.
 */
function forEachValidComponents(children, func, context) {
  var index = 0;

  return _react2['default'].Children.forEach(children, function (child) {
    if (_react2['default'].isValidElement(child)) {
      func.call(context, child, index);
      index++;
    }
  });
}

/**
 * Count the number of "valid components" in the Children container.
 *
 * @param {?*} children Children tree container.
 * @returns {number}
 */
function numberOfValidComponents(children) {
  var count = 0;

  _react2['default'].Children.forEach(children, function (child) {
    if (_react2['default'].isValidElement(child)) {
      count++;
    }
  });

  return count;
}

/**
 * Determine if the Child container has one or more "valid components".
 *
 * @param {?*} children Children tree container.
 * @returns {boolean}
 */
function hasValidComponent(children) {
  var hasValid = false;

  _react2['default'].Children.forEach(children, function (child) {
    if (!hasValid && _react2['default'].isValidElement(child)) {
      hasValid = true;
    }
  });

  return hasValid;
}

function find(children, finder) {
  var child = undefined;

  forEachValidComponents(children, function (c, idx) {
    if (!child && finder(c, idx, children)) {
      child = c;
    }
  });

  return child;
}

/**
 * Finds children that are typically specified as `props.children`,
 * but only iterates over children that are "valid components".
 *
 * The provided forEachFunc(child, index) will be called for each
 * leaf child with the index reflecting the position relative to "valid components".
 *
 * @param {?*} children Children tree container.
 * @param {function(*, int)} findFunc.
 * @param {*} findContext Context for findContext.
 * @returns {array} of children that meet the findFunc return statement
 */
function findValidComponents(children, func, context) {
  var index = 0;
  var returnChildren = [];

  _react2['default'].Children.forEach(children, function (child) {
    if (_react2['default'].isValidElement(child)) {
      if (func.call(context, child, index)) {
        returnChildren.push(child);
      }
      index++;
    }
  });

  return returnChildren;
}

exports['default'] = {
  map: mapValidComponents,
  forEach: forEachValidComponents,
  numberOf: numberOfValidComponents,
  find: find,
  findValidComponents: findValidComponents,
  hasValidComponent: hasValidComponent
};
module.exports = exports['default'];
},{"babel-runtime/helpers/interop-require-default":94,"react":453}],80:[function(require,module,exports){
'use strict';

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

exports.__esModule = true;
exports['default'] = childrenAsArray;

var _ValidComponentChildren = require('./ValidComponentChildren');

var _ValidComponentChildren2 = _interopRequireDefault(_ValidComponentChildren);

function childrenAsArray(children) {
  var result = [];

  if (children === undefined) {
    return result;
  }

  _ValidComponentChildren2['default'].forEach(children, function (child) {
    result.push(child);
  });

  return result;
}

module.exports = exports['default'];
},{"./ValidComponentChildren":79,"babel-runtime/helpers/interop-require-default":94}],81:[function(require,module,exports){
'use strict';

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

exports.__esModule = true;
exports['default'] = valueValidation;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactPropTypesLibSinglePropFrom = require('react-prop-types/lib/singlePropFrom');

var _reactPropTypesLibSinglePropFrom2 = _interopRequireDefault(_reactPropTypesLibSinglePropFrom);

function valueValidation(props, propName, componentName) {
  var error = _reactPropTypesLibSinglePropFrom2['default']('children', 'value')(props, propName, componentName);

  if (!error) {
    error = _react2['default'].PropTypes.node(props, propName, componentName);
  }

  return error;
}

module.exports = exports['default'];
},{"babel-runtime/helpers/interop-require-default":94,"react":453,"react-prop-types/lib/singlePropFrom":235}],82:[function(require,module,exports){
/**
 * Safe chained function
 *
 * Will only create a new function if needed,
 * otherwise will pass back existing functions or null.
 *
 * @param {function} functions to chain
 * @returns {function|null}
 */
'use strict';

exports.__esModule = true;
function createChainedFunction() {
  for (var _len = arguments.length, funcs = Array(_len), _key = 0; _key < _len; _key++) {
    funcs[_key] = arguments[_key];
  }

  return funcs.filter(function (f) {
    return f != null;
  }).reduce(function (acc, f) {
    if (typeof f !== 'function') {
      throw new Error('Invalid Argument Type, must only provide functions, undefined, or null.');
    }

    if (acc === null) {
      return f;
    }

    return function chainedFunction() {
      for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        args[_key2] = arguments[_key2];
      }

      acc.apply(this, args);
      f.apply(this, args);
    };
  }, null);
}

exports['default'] = createChainedFunction;
module.exports = exports['default'];
},{}],83:[function(require,module,exports){
"use strict";

exports.__esModule = true;
exports["default"] = createSelectedEvent;

function createSelectedEvent(eventKey) {
  var selectionPrevented = false;

  return {
    eventKey: eventKey,

    preventSelection: function preventSelection() {
      selectionPrevented = true;
    },

    isSelectionPrevented: function isSelectionPrevented() {
      return selectionPrevented;
    }
  };
}

module.exports = exports["default"];
},{}],84:[function(require,module,exports){
'use strict';

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

exports.__esModule = true;

var _warning = require('warning');

var _warning2 = _interopRequireDefault(_warning);

var warned = {};

function deprecationWarning(oldname, newname, link) {
  var message = undefined;

  if (typeof oldname === 'object') {
    message = oldname.message;
  } else {
    message = oldname + ' is deprecated. Use ' + newname + ' instead.';

    if (link) {
      message += '\nYou can read more about it at ' + link;
    }
  }

  if (warned[message]) {
    return;
  }

  _warning2['default'](false, message);
  warned[message] = true;
}

deprecationWarning.wrapper = function (Component) {
  for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    args[_key - 1] = arguments[_key];
  }

  return (function (_Component) {
    _inherits(DeprecatedComponent, _Component);

    function DeprecatedComponent() {
      _classCallCheck(this, DeprecatedComponent);

      _Component.apply(this, arguments);
    }

    DeprecatedComponent.prototype.componentWillMount = function componentWillMount() {
      deprecationWarning.apply(undefined, args);

      if (_Component.prototype.componentWillMount) {
        var _Component$prototype$componentWillMount;

        for (var _len2 = arguments.length, methodArgs = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
          methodArgs[_key2] = arguments[_key2];
        }

        (_Component$prototype$componentWillMount = _Component.prototype.componentWillMount).call.apply(_Component$prototype$componentWillMount, [this].concat(methodArgs));
      }
    };

    return DeprecatedComponent;
  })(Component);
};

exports['default'] = deprecationWarning;
module.exports = exports['default'];
},{"babel-runtime/helpers/class-call-check":91,"babel-runtime/helpers/inherits":93,"babel-runtime/helpers/interop-require-default":94,"warning":240}],85:[function(require,module,exports){
'use strict';

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

exports.__esModule = true;

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _domHelpersOwnerDocument = require('dom-helpers/ownerDocument');

var _domHelpersOwnerDocument2 = _interopRequireDefault(_domHelpersOwnerDocument);

var _domHelpersOwnerWindow = require('dom-helpers/ownerWindow');

var _domHelpersOwnerWindow2 = _interopRequireDefault(_domHelpersOwnerWindow);

function ownerDocument(componentOrElement) {
  var elem = _reactDom2['default'].findDOMNode(componentOrElement);
  return _domHelpersOwnerDocument2['default'](elem && elem.ownerDocument || document);
}

function ownerWindow(componentOrElement) {
  var doc = ownerDocument(componentOrElement);
  return _domHelpersOwnerWindow2['default'](doc);
}

/**
 * Get the height of the document
 *
 * @returns {documentHeight: number}
 */
function getDocumentHeight() {
  return Math.max(document.documentElement.offsetHeight, document.height, document.body.scrollHeight, document.body.offsetHeight);
}

/**
 * Get an element's size
 *
 * @param {HTMLElement} elem
 * @returns {{width: number, height: number}}
 */
function getSize(elem) {
  var rect = {
    width: elem.offsetWidth || 0,
    height: elem.offsetHeight || 0
  };
  if (typeof elem.getBoundingClientRect !== 'undefined') {
    var _elem$getBoundingClientRect = elem.getBoundingClientRect();

    var width = _elem$getBoundingClientRect.width;
    var height = _elem$getBoundingClientRect.height;

    rect.width = width || rect.width;
    rect.height = height || rect.height;
  }
  return rect;
}

exports['default'] = {
  ownerWindow: ownerWindow,
  ownerDocument: ownerDocument,
  getDocumentHeight: getDocumentHeight,
  getSize: getSize
};
module.exports = exports['default'];
},{"babel-runtime/helpers/interop-require-default":94,"dom-helpers/ownerDocument":126,"dom-helpers/ownerWindow":127,"react-dom":249}],86:[function(require,module,exports){
module.exports = { "default": require("core-js/library/fn/object/assign"), __esModule: true };
},{"core-js/library/fn/object/assign":97}],87:[function(require,module,exports){
module.exports = { "default": require("core-js/library/fn/object/create"), __esModule: true };
},{"core-js/library/fn/object/create":98}],88:[function(require,module,exports){
module.exports = { "default": require("core-js/library/fn/object/is-frozen"), __esModule: true };
},{"core-js/library/fn/object/is-frozen":99}],89:[function(require,module,exports){
module.exports = { "default": require("core-js/library/fn/object/keys"), __esModule: true };
},{"core-js/library/fn/object/keys":100}],90:[function(require,module,exports){
module.exports = { "default": require("core-js/library/fn/object/set-prototype-of"), __esModule: true };
},{"core-js/library/fn/object/set-prototype-of":101}],91:[function(require,module,exports){
"use strict";

exports["default"] = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

exports.__esModule = true;
},{}],92:[function(require,module,exports){
"use strict";

var _Object$assign = require("babel-runtime/core-js/object/assign")["default"];

exports["default"] = _Object$assign || function (target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];

    for (var key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
  }

  return target;
};

exports.__esModule = true;
},{"babel-runtime/core-js/object/assign":86}],93:[function(require,module,exports){
"use strict";

var _Object$create = require("babel-runtime/core-js/object/create")["default"];

var _Object$setPrototypeOf = require("babel-runtime/core-js/object/set-prototype-of")["default"];

exports["default"] = function (subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
  }

  subClass.prototype = _Object$create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  if (superClass) _Object$setPrototypeOf ? _Object$setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
};

exports.__esModule = true;
},{"babel-runtime/core-js/object/create":87,"babel-runtime/core-js/object/set-prototype-of":90}],94:[function(require,module,exports){
"use strict";

exports["default"] = function (obj) {
  return obj && obj.__esModule ? obj : {
    "default": obj
  };
};

exports.__esModule = true;
},{}],95:[function(require,module,exports){
"use strict";

exports["default"] = function (obj) {
  if (obj && obj.__esModule) {
    return obj;
  } else {
    var newObj = {};

    if (obj != null) {
      for (var key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key];
      }
    }

    newObj["default"] = obj;
    return newObj;
  }
};

exports.__esModule = true;
},{}],96:[function(require,module,exports){
"use strict";

exports["default"] = function (obj, keys) {
  var target = {};

  for (var i in obj) {
    if (keys.indexOf(i) >= 0) continue;
    if (!Object.prototype.hasOwnProperty.call(obj, i)) continue;
    target[i] = obj[i];
  }

  return target;
};

exports.__esModule = true;
},{}],97:[function(require,module,exports){
require('../../modules/es6.object.assign');
module.exports = require('../../modules/$.core').Object.assign;
},{"../../modules/$.core":106,"../../modules/es6.object.assign":118}],98:[function(require,module,exports){
var $ = require('../../modules/$');
module.exports = function create(P, D){
  return $.create(P, D);
};
},{"../../modules/$":114}],99:[function(require,module,exports){
require('../../modules/es6.object.is-frozen');
module.exports = require('../../modules/$.core').Object.isFrozen;
},{"../../modules/$.core":106,"../../modules/es6.object.is-frozen":119}],100:[function(require,module,exports){
require('../../modules/es6.object.keys');
module.exports = require('../../modules/$.core').Object.keys;
},{"../../modules/$.core":106,"../../modules/es6.object.keys":120}],101:[function(require,module,exports){
require('../../modules/es6.object.set-prototype-of');
module.exports = require('../../modules/$.core').Object.setPrototypeOf;
},{"../../modules/$.core":106,"../../modules/es6.object.set-prototype-of":121}],102:[function(require,module,exports){
module.exports = function(it){
  if(typeof it != 'function')throw TypeError(it + ' is not a function!');
  return it;
};
},{}],103:[function(require,module,exports){
var isObject = require('./$.is-object');
module.exports = function(it){
  if(!isObject(it))throw TypeError(it + ' is not an object!');
  return it;
};
},{"./$.is-object":113}],104:[function(require,module,exports){
// 19.1.2.1 Object.assign(target, source, ...)
var $        = require('./$')
  , toObject = require('./$.to-object')
  , IObject  = require('./$.iobject');

// should work with symbols and should have deterministic property order (V8 bug)
module.exports = require('./$.fails')(function(){
  var a = Object.assign
    , A = {}
    , B = {}
    , S = Symbol()
    , K = 'abcdefghijklmnopqrst';
  A[S] = 7;
  K.split('').forEach(function(k){ B[k] = k; });
  return a({}, A)[S] != 7 || Object.keys(a({}, B)).join('') != K;
}) ? function assign(target, source){ // eslint-disable-line no-unused-vars
  var T     = toObject(target)
    , $$    = arguments
    , $$len = $$.length
    , index = 1
    , getKeys    = $.getKeys
    , getSymbols = $.getSymbols
    , isEnum     = $.isEnum;
  while($$len > index){
    var S      = IObject($$[index++])
      , keys   = getSymbols ? getKeys(S).concat(getSymbols(S)) : getKeys(S)
      , length = keys.length
      , j      = 0
      , key;
    while(length > j)if(isEnum.call(S, key = keys[j++]))T[key] = S[key];
  }
  return T;
} : Object.assign;
},{"./$":114,"./$.fails":110,"./$.iobject":112,"./$.to-object":117}],105:[function(require,module,exports){
var toString = {}.toString;

module.exports = function(it){
  return toString.call(it).slice(8, -1);
};
},{}],106:[function(require,module,exports){
var core = module.exports = {version: '1.2.2'};
if(typeof __e == 'number')__e = core; // eslint-disable-line no-undef
},{}],107:[function(require,module,exports){
// optional / simple context binding
var aFunction = require('./$.a-function');
module.exports = function(fn, that, length){
  aFunction(fn);
  if(that === undefined)return fn;
  switch(length){
    case 1: return function(a){
      return fn.call(that, a);
    };
    case 2: return function(a, b){
      return fn.call(that, a, b);
    };
    case 3: return function(a, b, c){
      return fn.call(that, a, b, c);
    };
  }
  return function(/* ...args */){
    return fn.apply(that, arguments);
  };
};
},{"./$.a-function":102}],108:[function(require,module,exports){
var global    = require('./$.global')
  , core      = require('./$.core')
  , PROTOTYPE = 'prototype';
var ctx = function(fn, that){
  return function(){
    return fn.apply(that, arguments);
  };
};
var $def = function(type, name, source){
  var key, own, out, exp
    , isGlobal = type & $def.G
    , isProto  = type & $def.P
    , target   = isGlobal ? global : type & $def.S
        ? global[name] : (global[name] || {})[PROTOTYPE]
    , exports  = isGlobal ? core : core[name] || (core[name] = {});
  if(isGlobal)source = name;
  for(key in source){
    // contains in native
    own = !(type & $def.F) && target && key in target;
    if(own && key in exports)continue;
    // export native or passed
    out = own ? target[key] : source[key];
    // prevent global pollution for namespaces
    if(isGlobal && typeof target[key] != 'function')exp = source[key];
    // bind timers to global for call from export context
    else if(type & $def.B && own)exp = ctx(out, global);
    // wrap global constructors for prevent change them in library
    else if(type & $def.W && target[key] == out)!function(C){
      exp = function(param){
        return this instanceof C ? new C(param) : C(param);
      };
      exp[PROTOTYPE] = C[PROTOTYPE];
    }(out);
    else exp = isProto && typeof out == 'function' ? ctx(Function.call, out) : out;
    // export
    exports[key] = exp;
    if(isProto)(exports[PROTOTYPE] || (exports[PROTOTYPE] = {}))[key] = out;
  }
};
// type bitmap
$def.F = 1;  // forced
$def.G = 2;  // global
$def.S = 4;  // static
$def.P = 8;  // proto
$def.B = 16; // bind
$def.W = 32; // wrap
module.exports = $def;
},{"./$.core":106,"./$.global":111}],109:[function(require,module,exports){
// 7.2.1 RequireObjectCoercible(argument)
module.exports = function(it){
  if(it == undefined)throw TypeError("Can't call method on  " + it);
  return it;
};
},{}],110:[function(require,module,exports){
module.exports = function(exec){
  try {
    return !!exec();
  } catch(e){
    return true;
  }
};
},{}],111:[function(require,module,exports){
// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
var global = module.exports = typeof window != 'undefined' && window.Math == Math
  ? window : typeof self != 'undefined' && self.Math == Math ? self : Function('return this')();
if(typeof __g == 'number')__g = global; // eslint-disable-line no-undef
},{}],112:[function(require,module,exports){
// indexed object, fallback for non-array-like ES3 strings
var cof = require('./$.cof');
module.exports = 0 in Object('z') ? Object : function(it){
  return cof(it) == 'String' ? it.split('') : Object(it);
};
},{"./$.cof":105}],113:[function(require,module,exports){
module.exports = function(it){
  return typeof it === 'object' ? it !== null : typeof it === 'function';
};
},{}],114:[function(require,module,exports){
var $Object = Object;
module.exports = {
  create:     $Object.create,
  getProto:   $Object.getPrototypeOf,
  isEnum:     {}.propertyIsEnumerable,
  getDesc:    $Object.getOwnPropertyDescriptor,
  setDesc:    $Object.defineProperty,
  setDescs:   $Object.defineProperties,
  getKeys:    $Object.keys,
  getNames:   $Object.getOwnPropertyNames,
  getSymbols: $Object.getOwnPropertySymbols,
  each:       [].forEach
};
},{}],115:[function(require,module,exports){
// most Object methods by ES6 should accept primitives
module.exports = function(KEY, exec){
  var $def = require('./$.def')
    , fn   = (require('./$.core').Object || {})[KEY] || Object[KEY]
    , exp  = {};
  exp[KEY] = exec(fn);
  $def($def.S + $def.F * require('./$.fails')(function(){ fn(1); }), 'Object', exp);
};
},{"./$.core":106,"./$.def":108,"./$.fails":110}],116:[function(require,module,exports){
// Works with __proto__ only. Old v8 can't work with null proto objects.
/* eslint-disable no-proto */
var getDesc  = require('./$').getDesc
  , isObject = require('./$.is-object')
  , anObject = require('./$.an-object');
var check = function(O, proto){
  anObject(O);
  if(!isObject(proto) && proto !== null)throw TypeError(proto + ": can't set as prototype!");
};
module.exports = {
  set: Object.setPrototypeOf || ('__proto__' in {} ? // eslint-disable-line
    function(test, buggy, set){
      try {
        set = require('./$.ctx')(Function.call, getDesc(Object.prototype, '__proto__').set, 2);
        set(test, []);
        buggy = !(test instanceof Array);
      } catch(e){ buggy = true; }
      return function setPrototypeOf(O, proto){
        check(O, proto);
        if(buggy)O.__proto__ = proto;
        else set(O, proto);
        return O;
      };
    }({}, false) : undefined),
  check: check
};
},{"./$":114,"./$.an-object":103,"./$.ctx":107,"./$.is-object":113}],117:[function(require,module,exports){
// 7.1.13 ToObject(argument)
var defined = require('./$.defined');
module.exports = function(it){
  return Object(defined(it));
};
},{"./$.defined":109}],118:[function(require,module,exports){
// 19.1.3.1 Object.assign(target, source)
var $def = require('./$.def');

$def($def.S + $def.F, 'Object', {assign: require('./$.assign')});
},{"./$.assign":104,"./$.def":108}],119:[function(require,module,exports){
// 19.1.2.12 Object.isFrozen(O)
var isObject = require('./$.is-object');

require('./$.object-sap')('isFrozen', function($isFrozen){
  return function isFrozen(it){
    return isObject(it) ? $isFrozen ? $isFrozen(it) : false : true;
  };
});
},{"./$.is-object":113,"./$.object-sap":115}],120:[function(require,module,exports){
// 19.1.2.14 Object.keys(O)
var toObject = require('./$.to-object');

require('./$.object-sap')('keys', function($keys){
  return function keys(it){
    return $keys(toObject(it));
  };
});
},{"./$.object-sap":115,"./$.to-object":117}],121:[function(require,module,exports){
// 19.1.3.19 Object.setPrototypeOf(O, proto)
var $def = require('./$.def');
$def($def.S, 'Object', {setPrototypeOf: require('./$.set-proto').set});
},{"./$.def":108,"./$.set-proto":116}],122:[function(require,module,exports){
/*!
  Copyright (c) 2015 Jed Watson.
  Licensed under the MIT License (MIT), see
  http://jedwatson.github.io/classnames
*/
/* global define */

(function () {
	'use strict';

	var hasOwn = {}.hasOwnProperty;

	function classNames () {
		var classes = '';

		for (var i = 0; i < arguments.length; i++) {
			var arg = arguments[i];
			if (!arg) continue;

			var argType = typeof arg;

			if (argType === 'string' || argType === 'number') {
				classes += ' ' + arg;
			} else if (Array.isArray(arg)) {
				classes += ' ' + classNames.apply(null, arg);
			} else if (argType === 'object') {
				for (var key in arg) {
					if (hasOwn.call(arg, key) && arg[key]) {
						classes += ' ' + key;
					}
				}
			}
		}

		return classes.substr(1);
	}

	if (typeof module !== 'undefined' && module.exports) {
		module.exports = classNames;
	} else if (typeof define === 'function' && typeof define.amd === 'object' && define.amd) {
		// register as 'classnames', consistent with npm package name
		define('classnames', function () {
			return classNames;
		});
	} else {
		window.classNames = classNames;
	}
}());

},{}],123:[function(require,module,exports){
'use strict';

var babelHelpers = require('./util/babelHelpers.js');

exports.__esModule = true;

/**
 * document.activeElement
 */
exports['default'] = activeElement;

var _ownerDocument = require('./ownerDocument');

var _ownerDocument2 = babelHelpers.interopRequireDefault(_ownerDocument);

function activeElement() {
  var doc = arguments[0] === undefined ? document : arguments[0];

  try {
    return doc.activeElement;
  } catch (e) {}
}

module.exports = exports['default'];
},{"./ownerDocument":126,"./util/babelHelpers.js":139}],124:[function(require,module,exports){
'use strict';
var canUseDOM = require('../util/inDOM');
var off = function off() {};

if (canUseDOM) {

  off = (function () {

    if (document.addEventListener) return function (node, eventName, handler, capture) {
      return node.removeEventListener(eventName, handler, capture || false);
    };else if (document.attachEvent) return function (node, eventName, handler) {
      return node.detachEvent('on' + eventName, handler);
    };
  })();
}

module.exports = off;
},{"../util/inDOM":144}],125:[function(require,module,exports){
'use strict';
var canUseDOM = require('../util/inDOM');
var on = function on() {};

if (canUseDOM) {
  on = (function () {

    if (document.addEventListener) return function (node, eventName, handler, capture) {
      return node.addEventListener(eventName, handler, capture || false);
    };else if (document.attachEvent) return function (node, eventName, handler) {
      return node.attachEvent('on' + eventName, handler);
    };
  })();
}

module.exports = on;
},{"../util/inDOM":144}],126:[function(require,module,exports){
"use strict";

exports.__esModule = true;
exports["default"] = ownerDocument;

function ownerDocument(node) {
  return node && node.ownerDocument || document;
}

module.exports = exports["default"];
},{}],127:[function(require,module,exports){
'use strict';

var babelHelpers = require('./util/babelHelpers.js');

exports.__esModule = true;
exports['default'] = ownerWindow;

var _ownerDocument = require('./ownerDocument');

var _ownerDocument2 = babelHelpers.interopRequireDefault(_ownerDocument);

function ownerWindow(node) {
  var doc = (0, _ownerDocument2['default'])(node);
  return doc && doc.defaultView || doc.parentWindow;
}

module.exports = exports['default'];
},{"./ownerDocument":126,"./util/babelHelpers.js":139}],128:[function(require,module,exports){
'use strict';
var canUseDOM = require('../util/inDOM');

var contains = (function () {
  var root = canUseDOM && document.documentElement;

  return root && root.contains ? function (context, node) {
    return context.contains(node);
  } : root && root.compareDocumentPosition ? function (context, node) {
    return context === node || !!(context.compareDocumentPosition(node) & 16);
  } : function (context, node) {
    if (node) do {
      if (node === context) return true;
    } while (node = node.parentNode);

    return false;
  };
})();

module.exports = contains;
},{"../util/inDOM":144}],129:[function(require,module,exports){
'use strict';

module.exports = function getWindow(node) {
  return node === node.window ? node : node.nodeType === 9 ? node.defaultView || node.parentWindow : false;
};
},{}],130:[function(require,module,exports){
'use strict';
var contains = require('./contains'),
    getWindow = require('./isWindow'),
    ownerDocument = require('../ownerDocument');

module.exports = function offset(node) {
  var doc = ownerDocument(node),
      win = getWindow(doc),
      docElem = doc && doc.documentElement,
      box = { top: 0, left: 0, height: 0, width: 0 };

  if (!doc) return;

  // Make sure it's not a disconnected DOM node
  if (!contains(docElem, node)) return box;

  if (node.getBoundingClientRect !== undefined) box = node.getBoundingClientRect();

  if (box.width || box.height) {

    box = {
      top: box.top + (win.pageYOffset || docElem.scrollTop) - (docElem.clientTop || 0),
      left: box.left + (win.pageXOffset || docElem.scrollLeft) - (docElem.clientLeft || 0),
      width: (box.width == null ? node.offsetWidth : box.width) || 0,
      height: (box.height == null ? node.offsetHeight : box.height) || 0
    };
  }

  return box;
};
},{"../ownerDocument":126,"./contains":128,"./isWindow":129}],131:[function(require,module,exports){
'use strict';

var babelHelpers = require('../util/babelHelpers.js');

exports.__esModule = true;
exports['default'] = offsetParent;

var _ownerDocument = require('../ownerDocument');

var _ownerDocument2 = babelHelpers.interopRequireDefault(_ownerDocument);

var _style = require('../style');

var _style2 = babelHelpers.interopRequireDefault(_style);

function nodeName(node) {
  return node.nodeName && node.nodeName.toLowerCase();
}

function offsetParent(node) {
  var doc = (0, _ownerDocument2['default'])(node),
      offsetParent = node && node.offsetParent;

  while (offsetParent && nodeName(node) !== 'html' && (0, _style2['default'])(offsetParent, 'position') === 'static') {
    offsetParent = offsetParent.offsetParent;
  }

  return offsetParent || doc.documentElement;
}

module.exports = exports['default'];
},{"../ownerDocument":126,"../style":136,"../util/babelHelpers.js":139}],132:[function(require,module,exports){
'use strict';

var babelHelpers = require('../util/babelHelpers.js');

exports.__esModule = true;
exports['default'] = position;

var _offset = require('./offset');

var _offset2 = babelHelpers.interopRequireDefault(_offset);

var _offsetParent = require('./offsetParent');

var _offsetParent2 = babelHelpers.interopRequireDefault(_offsetParent);

var _scrollTop = require('./scrollTop');

var _scrollTop2 = babelHelpers.interopRequireDefault(_scrollTop);

var _scrollLeft = require('./scrollLeft');

var _scrollLeft2 = babelHelpers.interopRequireDefault(_scrollLeft);

var _style = require('../style');

var _style2 = babelHelpers.interopRequireDefault(_style);

function nodeName(node) {
  return node.nodeName && node.nodeName.toLowerCase();
}

function position(node, offsetParent) {
  var parentOffset = { top: 0, left: 0 },
      offset;

  // Fixed elements are offset from window (parentOffset = {top:0, left: 0},
  // because it is its only offset parent
  if ((0, _style2['default'])(node, 'position') === 'fixed') {
    offset = node.getBoundingClientRect();
  } else {
    offsetParent = offsetParent || (0, _offsetParent2['default'])(node);
    offset = (0, _offset2['default'])(node);

    if (nodeName(offsetParent) !== 'html') parentOffset = (0, _offset2['default'])(offsetParent);

    parentOffset.top += parseInt((0, _style2['default'])(offsetParent, 'borderTopWidth'), 10) - (0, _scrollTop2['default'])(offsetParent) || 0;
    parentOffset.left += parseInt((0, _style2['default'])(offsetParent, 'borderLeftWidth'), 10) - (0, _scrollLeft2['default'])(offsetParent) || 0;
  }

  // Subtract parent offsets and node margins
  return babelHelpers._extends({}, offset, {
    top: offset.top - parentOffset.top - (parseInt((0, _style2['default'])(node, 'marginTop'), 10) || 0),
    left: offset.left - parentOffset.left - (parseInt((0, _style2['default'])(node, 'marginLeft'), 10) || 0)
  });
}

module.exports = exports['default'];
},{"../style":136,"../util/babelHelpers.js":139,"./offset":130,"./offsetParent":131,"./scrollLeft":133,"./scrollTop":134}],133:[function(require,module,exports){
'use strict';
var getWindow = require('./isWindow');

module.exports = function scrollTop(node, val) {
  var win = getWindow(node);

  if (val === undefined) return win ? 'pageXOffset' in win ? win.pageXOffset : win.document.documentElement.scrollLeft : node.scrollLeft;

  if (win) win.scrollTo(val, 'pageYOffset' in win ? win.pageYOffset : win.document.documentElement.scrollTop);else node.scrollLeft = val;
};
},{"./isWindow":129}],134:[function(require,module,exports){
'use strict';
var getWindow = require('./isWindow');

module.exports = function scrollTop(node, val) {
  var win = getWindow(node);

  if (val === undefined) return win ? 'pageYOffset' in win ? win.pageYOffset : win.document.documentElement.scrollTop : node.scrollTop;

  if (win) win.scrollTo('pageXOffset' in win ? win.pageXOffset : win.document.documentElement.scrollLeft, val);else node.scrollTop = val;
};
},{"./isWindow":129}],135:[function(require,module,exports){
'use strict';

var babelHelpers = require('../util/babelHelpers.js');

var _utilCamelizeStyle = require('../util/camelizeStyle');

var _utilCamelizeStyle2 = babelHelpers.interopRequireDefault(_utilCamelizeStyle);

var rposition = /^(top|right|bottom|left)$/;
var rnumnonpx = /^([+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|))(?!px)[a-z%]+$/i;

module.exports = function _getComputedStyle(node) {
  if (!node) throw new TypeError('No Element passed to `getComputedStyle()`');
  var doc = node.ownerDocument;

  return 'defaultView' in doc ? doc.defaultView.opener ? node.ownerDocument.defaultView.getComputedStyle(node, null) : window.getComputedStyle(node, null) : { //ie 8 "magic" from: https://github.com/jquery/jquery/blob/1.11-stable/src/css/curCSS.js#L72
    getPropertyValue: function getPropertyValue(prop) {
      var style = node.style;

      prop = (0, _utilCamelizeStyle2['default'])(prop);

      if (prop == 'float') prop = 'styleFloat';

      var current = node.currentStyle[prop] || null;

      if (current == null && style && style[prop]) current = style[prop];

      if (rnumnonpx.test(current) && !rposition.test(prop)) {
        // Remember the original values
        var left = style.left;
        var runStyle = node.runtimeStyle;
        var rsLeft = runStyle && runStyle.left;

        // Put in the new values to get a computed value out
        if (rsLeft) runStyle.left = node.currentStyle.left;

        style.left = prop === 'fontSize' ? '1em' : current;
        current = style.pixelLeft + 'px';

        // Revert the changed values
        style.left = left;
        if (rsLeft) runStyle.left = rsLeft;
      }

      return current;
    }
  };
};
},{"../util/babelHelpers.js":139,"../util/camelizeStyle":141}],136:[function(require,module,exports){
'use strict';

var camelize = require('../util/camelizeStyle'),
    hyphenate = require('../util/hyphenateStyle'),
    _getComputedStyle = require('./getComputedStyle'),
    removeStyle = require('./removeStyle');

var has = Object.prototype.hasOwnProperty;

module.exports = function style(node, property, value) {
  var css = '',
      props = property;

  if (typeof property === 'string') {

    if (value === undefined) return node.style[camelize(property)] || _getComputedStyle(node).getPropertyValue(hyphenate(property));else (props = {})[property] = value;
  }

  for (var key in props) if (has.call(props, key)) {
    !props[key] && props[key] !== 0 ? removeStyle(node, hyphenate(key)) : css += hyphenate(key) + ':' + props[key] + ';';
  }

  node.style.cssText += ';' + css;
};
},{"../util/camelizeStyle":141,"../util/hyphenateStyle":143,"./getComputedStyle":135,"./removeStyle":137}],137:[function(require,module,exports){
'use strict';

module.exports = function removeStyle(node, key) {
  return 'removeProperty' in node.style ? node.style.removeProperty(key) : node.style.removeAttribute(key);
};
},{}],138:[function(require,module,exports){
'use strict';
var canUseDOM = require('../util/inDOM');

var has = Object.prototype.hasOwnProperty,
    transform = 'transform',
    transition = {},
    transitionTiming,
    transitionDuration,
    transitionProperty,
    transitionDelay;

if (canUseDOM) {
  transition = getTransitionProperties();

  transform = transition.prefix + transform;

  transitionProperty = transition.prefix + 'transition-property';
  transitionDuration = transition.prefix + 'transition-duration';
  transitionDelay = transition.prefix + 'transition-delay';
  transitionTiming = transition.prefix + 'transition-timing-function';
}

module.exports = {
  transform: transform,
  end: transition.end,
  property: transitionProperty,
  timing: transitionTiming,
  delay: transitionDelay,
  duration: transitionDuration
};

function getTransitionProperties() {
  var endEvent,
      prefix = '',
      transitions = {
    O: 'otransitionend',
    Moz: 'transitionend',
    Webkit: 'webkitTransitionEnd',
    ms: 'MSTransitionEnd'
  };

  var element = document.createElement('div');

  for (var vendor in transitions) if (has.call(transitions, vendor)) {
    if (element.style[vendor + 'TransitionProperty'] !== undefined) {
      prefix = '-' + vendor.toLowerCase() + '-';
      endEvent = transitions[vendor];
      break;
    }
  }

  if (!endEvent && element.style.transitionProperty !== undefined) endEvent = 'transitionend';

  return { end: endEvent, prefix: prefix };
}
},{"../util/inDOM":144}],139:[function(require,module,exports){
(function (root, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports"], factory);
  } else if (typeof exports === "object") {
    factory(exports);
  } else {
    factory(root.babelHelpers = {});
  }
})(this, function (global) {
  var babelHelpers = global;

  babelHelpers.interopRequireDefault = function (obj) {
    return obj && obj.__esModule ? obj : {
      "default": obj
    };
  };

  babelHelpers._extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };
})
},{}],140:[function(require,module,exports){
"use strict";

var rHyphen = /-(.)/g;

module.exports = function camelize(string) {
  return string.replace(rHyphen, function (_, chr) {
    return chr.toUpperCase();
  });
};
},{}],141:[function(require,module,exports){
/**
 * Copyright 2014-2015, Facebook, Inc.
 * All rights reserved.
 * https://github.com/facebook/react/blob/2aeb8a2a6beb00617a4217f7f8284924fa2ad819/src/vendor/core/camelizeStyleName.js
 */

'use strict';
var camelize = require('./camelize');
var msPattern = /^-ms-/;

module.exports = function camelizeStyleName(string) {
  return camelize(string.replace(msPattern, 'ms-'));
};
},{"./camelize":140}],142:[function(require,module,exports){
'use strict';

var rUpper = /([A-Z])/g;

module.exports = function hyphenate(string) {
  return string.replace(rUpper, '-$1').toLowerCase();
};
},{}],143:[function(require,module,exports){
/**
 * Copyright 2013-2014, Facebook, Inc.
 * All rights reserved.
 * https://github.com/facebook/react/blob/2aeb8a2a6beb00617a4217f7f8284924fa2ad819/src/vendor/core/hyphenateStyleName.js
 */

"use strict";

var hyphenate = require("./hyphenate");
var msPattern = /^ms-/;

module.exports = function hyphenateStyleName(string) {
  return hyphenate(string).replace(msPattern, "-ms-");
};
},{"./hyphenate":142}],144:[function(require,module,exports){
'use strict';
module.exports = !!(typeof window !== 'undefined' && window.document && window.document.createElement);
},{}],145:[function(require,module,exports){
'use strict';

var canUseDOM = require('./inDOM');

var size;

module.exports = function (recalc) {
  if (!size || recalc) {
    if (canUseDOM) {
      var scrollDiv = document.createElement('div');

      scrollDiv.style.position = 'absolute';
      scrollDiv.style.top = '-9999px';
      scrollDiv.style.width = '50px';
      scrollDiv.style.height = '50px';
      scrollDiv.style.overflow = 'scroll';

      document.body.appendChild(scrollDiv);
      size = scrollDiv.offsetWidth - scrollDiv.clientWidth;
      document.body.removeChild(scrollDiv);
    }
  }

  return size;
};
},{"./inDOM":144}],146:[function(require,module,exports){
// Source: http://jsfiddle.net/vWx8V/
// http://stackoverflow.com/questions/5603195/full-list-of-javascript-keycodes



/**
 * Conenience method returns corresponding value for given keyName or keyCode.
 *
 * @param {Mixed} keyCode {Number} or keyName {String}
 * @return {Mixed}
 * @api public
 */

exports = module.exports = function(searchInput) {
  // Keyboard Events
  if (searchInput && 'object' === typeof searchInput) {
    var hasKeyCode = searchInput.which || searchInput.keyCode || searchInput.charCode
    if (hasKeyCode) searchInput = hasKeyCode
  }

  // Numbers
  if ('number' === typeof searchInput) return names[searchInput]

  // Everything else (cast to string)
  var search = String(searchInput)

  // check codes
  var foundNamedKey = codes[search.toLowerCase()]
  if (foundNamedKey) return foundNamedKey

  // check aliases
  var foundNamedKey = aliases[search.toLowerCase()]
  if (foundNamedKey) return foundNamedKey

  // weird character?
  if (search.length === 1) return search.charCodeAt(0)

  return undefined
}

/**
 * Get by name
 *
 *   exports.code['enter'] // => 13
 */

var codes = exports.code = exports.codes = {
  'backspace': 8,
  'tab': 9,
  'enter': 13,
  'shift': 16,
  'ctrl': 17,
  'alt': 18,
  'pause/break': 19,
  'caps lock': 20,
  'esc': 27,
  'space': 32,
  'page up': 33,
  'page down': 34,
  'end': 35,
  'home': 36,
  'left': 37,
  'up': 38,
  'right': 39,
  'down': 40,
  'insert': 45,
  'delete': 46,
  'command': 91,
  'right click': 93,
  'numpad *': 106,
  'numpad +': 107,
  'numpad -': 109,
  'numpad .': 110,
  'numpad /': 111,
  'num lock': 144,
  'scroll lock': 145,
  'my computer': 182,
  'my calculator': 183,
  ';': 186,
  '=': 187,
  ',': 188,
  '-': 189,
  '.': 190,
  '/': 191,
  '`': 192,
  '[': 219,
  '\\': 220,
  ']': 221,
  "'": 222,
}

// Helper aliases

var aliases = exports.aliases = {
  'windows': 91,
  '⇧': 16,
  '⌥': 18,
  '⌃': 17,
  '⌘': 91,
  'ctl': 17,
  'control': 17,
  'option': 18,
  'pause': 19,
  'break': 19,
  'caps': 20,
  'return': 13,
  'escape': 27,
  'spc': 32,
  'pgup': 33,
  'pgdn': 33,
  'ins': 45,
  'del': 46,
  'cmd': 91
}


/*!
 * Programatically add the following
 */

// lower case chars
for (i = 97; i < 123; i++) codes[String.fromCharCode(i)] = i - 32

// numbers
for (var i = 48; i < 58; i++) codes[i - 48] = i

// function keys
for (i = 1; i < 13; i++) codes['f'+i] = i + 111

// numpad keys
for (i = 0; i < 10; i++) codes['numpad '+i] = i + 96

/**
 * Get by code
 *
 *   exports.name[13] // => 'Enter'
 */

var names = exports.names = exports.title = {} // title for backward compat

// Create reverse mapping
for (i in codes) names[codes[i]] = i

// Add aliases
for (var alias in aliases) {
  codes[alias] = aliases[alias]
}

},{}],147:[function(require,module,exports){
/**
 * Gets the last element of `array`.
 *
 * @static
 * @memberOf _
 * @category Array
 * @param {Array} array The array to query.
 * @returns {*} Returns the last element of `array`.
 * @example
 *
 * _.last([1, 2, 3]);
 * // => 3
 */
function last(array) {
  var length = array ? array.length : 0;
  return length ? array[length - 1] : undefined;
}

module.exports = last;

},{}],148:[function(require,module,exports){
var baseEach = require('../internal/baseEach'),
    createFind = require('../internal/createFind');

/**
 * Iterates over elements of `collection`, returning the first element
 * `predicate` returns truthy for. The predicate is bound to `thisArg` and
 * invoked with three arguments: (value, index|key, collection).
 *
 * If a property name is provided for `predicate` the created `_.property`
 * style callback returns the property value of the given element.
 *
 * If a value is also provided for `thisArg` the created `_.matchesProperty`
 * style callback returns `true` for elements that have a matching property
 * value, else `false`.
 *
 * If an object is provided for `predicate` the created `_.matches` style
 * callback returns `true` for elements that have the properties of the given
 * object, else `false`.
 *
 * @static
 * @memberOf _
 * @alias detect
 * @category Collection
 * @param {Array|Object|string} collection The collection to search.
 * @param {Function|Object|string} [predicate=_.identity] The function invoked
 *  per iteration.
 * @param {*} [thisArg] The `this` binding of `predicate`.
 * @returns {*} Returns the matched element, else `undefined`.
 * @example
 *
 * var users = [
 *   { 'user': 'barney',  'age': 36, 'active': true },
 *   { 'user': 'fred',    'age': 40, 'active': false },
 *   { 'user': 'pebbles', 'age': 1,  'active': true }
 * ];
 *
 * _.result(_.find(users, function(chr) {
 *   return chr.age < 40;
 * }), 'user');
 * // => 'barney'
 *
 * // using the `_.matches` callback shorthand
 * _.result(_.find(users, { 'age': 1, 'active': true }), 'user');
 * // => 'pebbles'
 *
 * // using the `_.matchesProperty` callback shorthand
 * _.result(_.find(users, 'active', false), 'user');
 * // => 'fred'
 *
 * // using the `_.property` callback shorthand
 * _.result(_.find(users, 'active'), 'user');
 * // => 'barney'
 */
var find = createFind(baseEach);

module.exports = find;

},{"../internal/baseEach":157,"../internal/createFind":181}],149:[function(require,module,exports){
/** Used as the `TypeError` message for "Functions" methods. */
var FUNC_ERROR_TEXT = 'Expected a function';

/* Native method references for those with the same name as other `lodash` methods. */
var nativeMax = Math.max;

/**
 * Creates a function that invokes `func` with the `this` binding of the
 * created function and arguments from `start` and beyond provided as an array.
 *
 * **Note:** This method is based on the [rest parameter](https://developer.mozilla.org/Web/JavaScript/Reference/Functions/rest_parameters).
 *
 * @static
 * @memberOf _
 * @category Function
 * @param {Function} func The function to apply a rest parameter to.
 * @param {number} [start=func.length-1] The start position of the rest parameter.
 * @returns {Function} Returns the new function.
 * @example
 *
 * var say = _.restParam(function(what, names) {
 *   return what + ' ' + _.initial(names).join(', ') +
 *     (_.size(names) > 1 ? ', & ' : '') + _.last(names);
 * });
 *
 * say('hello', 'fred', 'barney', 'pebbles');
 * // => 'hello fred, barney, & pebbles'
 */
function restParam(func, start) {
  if (typeof func != 'function') {
    throw new TypeError(FUNC_ERROR_TEXT);
  }
  start = nativeMax(start === undefined ? (func.length - 1) : (+start || 0), 0);
  return function() {
    var args = arguments,
        index = -1,
        length = nativeMax(args.length - start, 0),
        rest = Array(length);

    while (++index < length) {
      rest[index] = args[start + index];
    }
    switch (start) {
      case 0: return func.call(this, rest);
      case 1: return func.call(this, args[0], rest);
      case 2: return func.call(this, args[0], args[1], rest);
    }
    var otherArgs = Array(start + 1);
    index = -1;
    while (++index < start) {
      otherArgs[index] = args[index];
    }
    otherArgs[start] = rest;
    return func.apply(this, otherArgs);
  };
}

module.exports = restParam;

},{}],150:[function(require,module,exports){
(function (global){
var cachePush = require('./cachePush'),
    getNative = require('./getNative');

/** Native method references. */
var Set = getNative(global, 'Set');

/* Native method references for those with the same name as other `lodash` methods. */
var nativeCreate = getNative(Object, 'create');

/**
 *
 * Creates a cache object to store unique values.
 *
 * @private
 * @param {Array} [values] The values to cache.
 */
function SetCache(values) {
  var length = values ? values.length : 0;

  this.data = { 'hash': nativeCreate(null), 'set': new Set };
  while (length--) {
    this.push(values[length]);
  }
}

// Add functions to the `Set` cache.
SetCache.prototype.push = cachePush;

module.exports = SetCache;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./cachePush":177,"./getNative":187}],151:[function(require,module,exports){
/**
 * A specialized version of `_.forEach` for arrays without support for callback
 * shorthands and `this` binding.
 *
 * @private
 * @param {Array} array The array to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns `array`.
 */
function arrayEach(array, iteratee) {
  var index = -1,
      length = array.length;

  while (++index < length) {
    if (iteratee(array[index], index, array) === false) {
      break;
    }
  }
  return array;
}

module.exports = arrayEach;

},{}],152:[function(require,module,exports){
/**
 * A specialized version of `_.map` for arrays without support for callback
 * shorthands and `this` binding.
 *
 * @private
 * @param {Array} array The array to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns the new mapped array.
 */
function arrayMap(array, iteratee) {
  var index = -1,
      length = array.length,
      result = Array(length);

  while (++index < length) {
    result[index] = iteratee(array[index], index, array);
  }
  return result;
}

module.exports = arrayMap;

},{}],153:[function(require,module,exports){
/**
 * Appends the elements of `values` to `array`.
 *
 * @private
 * @param {Array} array The array to modify.
 * @param {Array} values The values to append.
 * @returns {Array} Returns `array`.
 */
function arrayPush(array, values) {
  var index = -1,
      length = values.length,
      offset = array.length;

  while (++index < length) {
    array[offset + index] = values[index];
  }
  return array;
}

module.exports = arrayPush;

},{}],154:[function(require,module,exports){
/**
 * A specialized version of `_.some` for arrays without support for callback
 * shorthands and `this` binding.
 *
 * @private
 * @param {Array} array The array to iterate over.
 * @param {Function} predicate The function invoked per iteration.
 * @returns {boolean} Returns `true` if any element passes the predicate check,
 *  else `false`.
 */
function arraySome(array, predicate) {
  var index = -1,
      length = array.length;

  while (++index < length) {
    if (predicate(array[index], index, array)) {
      return true;
    }
  }
  return false;
}

module.exports = arraySome;

},{}],155:[function(require,module,exports){
var baseMatches = require('./baseMatches'),
    baseMatchesProperty = require('./baseMatchesProperty'),
    bindCallback = require('./bindCallback'),
    identity = require('../utility/identity'),
    property = require('../utility/property');

/**
 * The base implementation of `_.callback` which supports specifying the
 * number of arguments to provide to `func`.
 *
 * @private
 * @param {*} [func=_.identity] The value to convert to a callback.
 * @param {*} [thisArg] The `this` binding of `func`.
 * @param {number} [argCount] The number of arguments to provide to `func`.
 * @returns {Function} Returns the callback.
 */
function baseCallback(func, thisArg, argCount) {
  var type = typeof func;
  if (type == 'function') {
    return thisArg === undefined
      ? func
      : bindCallback(func, thisArg, argCount);
  }
  if (func == null) {
    return identity;
  }
  if (type == 'object') {
    return baseMatches(func);
  }
  return thisArg === undefined
    ? property(func)
    : baseMatchesProperty(func, thisArg);
}

module.exports = baseCallback;

},{"../utility/identity":214,"../utility/property":215,"./baseMatches":169,"./baseMatchesProperty":170,"./bindCallback":175}],156:[function(require,module,exports){
var baseIndexOf = require('./baseIndexOf'),
    cacheIndexOf = require('./cacheIndexOf'),
    createCache = require('./createCache');

/** Used as the size to enable large array optimizations. */
var LARGE_ARRAY_SIZE = 200;

/**
 * The base implementation of `_.difference` which accepts a single array
 * of values to exclude.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {Array} values The values to exclude.
 * @returns {Array} Returns the new array of filtered values.
 */
function baseDifference(array, values) {
  var length = array ? array.length : 0,
      result = [];

  if (!length) {
    return result;
  }
  var index = -1,
      indexOf = baseIndexOf,
      isCommon = true,
      cache = (isCommon && values.length >= LARGE_ARRAY_SIZE) ? createCache(values) : null,
      valuesLength = values.length;

  if (cache) {
    indexOf = cacheIndexOf;
    isCommon = false;
    values = cache;
  }
  outer:
  while (++index < length) {
    var value = array[index];

    if (isCommon && value === value) {
      var valuesIndex = valuesLength;
      while (valuesIndex--) {
        if (values[valuesIndex] === value) {
          continue outer;
        }
      }
      result.push(value);
    }
    else if (indexOf(values, value, 0) < 0) {
      result.push(value);
    }
  }
  return result;
}

module.exports = baseDifference;

},{"./baseIndexOf":165,"./cacheIndexOf":176,"./createCache":180}],157:[function(require,module,exports){
var baseForOwn = require('./baseForOwn'),
    createBaseEach = require('./createBaseEach');

/**
 * The base implementation of `_.forEach` without support for callback
 * shorthands and `this` binding.
 *
 * @private
 * @param {Array|Object|string} collection The collection to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array|Object|string} Returns `collection`.
 */
var baseEach = createBaseEach(baseForOwn);

module.exports = baseEach;

},{"./baseForOwn":163,"./createBaseEach":178}],158:[function(require,module,exports){
/**
 * The base implementation of `_.find`, `_.findLast`, `_.findKey`, and `_.findLastKey`,
 * without support for callback shorthands and `this` binding, which iterates
 * over `collection` using the provided `eachFunc`.
 *
 * @private
 * @param {Array|Object|string} collection The collection to search.
 * @param {Function} predicate The function invoked per iteration.
 * @param {Function} eachFunc The function to iterate over `collection`.
 * @param {boolean} [retKey] Specify returning the key of the found element
 *  instead of the element itself.
 * @returns {*} Returns the found element or its key, else `undefined`.
 */
function baseFind(collection, predicate, eachFunc, retKey) {
  var result;
  eachFunc(collection, function(value, key, collection) {
    if (predicate(value, key, collection)) {
      result = retKey ? key : value;
      return false;
    }
  });
  return result;
}

module.exports = baseFind;

},{}],159:[function(require,module,exports){
/**
 * The base implementation of `_.findIndex` and `_.findLastIndex` without
 * support for callback shorthands and `this` binding.
 *
 * @private
 * @param {Array} array The array to search.
 * @param {Function} predicate The function invoked per iteration.
 * @param {boolean} [fromRight] Specify iterating from right to left.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */
function baseFindIndex(array, predicate, fromRight) {
  var length = array.length,
      index = fromRight ? length : -1;

  while ((fromRight ? index-- : ++index < length)) {
    if (predicate(array[index], index, array)) {
      return index;
    }
  }
  return -1;
}

module.exports = baseFindIndex;

},{}],160:[function(require,module,exports){
var arrayPush = require('./arrayPush'),
    isArguments = require('../lang/isArguments'),
    isArray = require('../lang/isArray'),
    isArrayLike = require('./isArrayLike'),
    isObjectLike = require('./isObjectLike');

/**
 * The base implementation of `_.flatten` with added support for restricting
 * flattening and specifying the start index.
 *
 * @private
 * @param {Array} array The array to flatten.
 * @param {boolean} [isDeep] Specify a deep flatten.
 * @param {boolean} [isStrict] Restrict flattening to arrays-like objects.
 * @param {Array} [result=[]] The initial result value.
 * @returns {Array} Returns the new flattened array.
 */
function baseFlatten(array, isDeep, isStrict, result) {
  result || (result = []);

  var index = -1,
      length = array.length;

  while (++index < length) {
    var value = array[index];
    if (isObjectLike(value) && isArrayLike(value) &&
        (isStrict || isArray(value) || isArguments(value))) {
      if (isDeep) {
        // Recursively flatten arrays (susceptible to call stack limits).
        baseFlatten(value, isDeep, isStrict, result);
      } else {
        arrayPush(result, value);
      }
    } else if (!isStrict) {
      result[result.length] = value;
    }
  }
  return result;
}

module.exports = baseFlatten;

},{"../lang/isArguments":201,"../lang/isArray":202,"./arrayPush":153,"./isArrayLike":189,"./isObjectLike":194}],161:[function(require,module,exports){
var createBaseFor = require('./createBaseFor');

/**
 * The base implementation of `baseForIn` and `baseForOwn` which iterates
 * over `object` properties returned by `keysFunc` invoking `iteratee` for
 * each property. Iteratee functions may exit iteration early by explicitly
 * returning `false`.
 *
 * @private
 * @param {Object} object The object to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @param {Function} keysFunc The function to get the keys of `object`.
 * @returns {Object} Returns `object`.
 */
var baseFor = createBaseFor();

module.exports = baseFor;

},{"./createBaseFor":179}],162:[function(require,module,exports){
var baseFor = require('./baseFor'),
    keysIn = require('../object/keysIn');

/**
 * The base implementation of `_.forIn` without support for callback
 * shorthands and `this` binding.
 *
 * @private
 * @param {Object} object The object to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Object} Returns `object`.
 */
function baseForIn(object, iteratee) {
  return baseFor(object, iteratee, keysIn);
}

module.exports = baseForIn;

},{"../object/keysIn":209,"./baseFor":161}],163:[function(require,module,exports){
var baseFor = require('./baseFor'),
    keys = require('../object/keys');

/**
 * The base implementation of `_.forOwn` without support for callback
 * shorthands and `this` binding.
 *
 * @private
 * @param {Object} object The object to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Object} Returns `object`.
 */
function baseForOwn(object, iteratee) {
  return baseFor(object, iteratee, keys);
}

module.exports = baseForOwn;

},{"../object/keys":208,"./baseFor":161}],164:[function(require,module,exports){
var toObject = require('./toObject');

/**
 * The base implementation of `get` without support for string paths
 * and default values.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {Array} path The path of the property to get.
 * @param {string} [pathKey] The key representation of path.
 * @returns {*} Returns the resolved value.
 */
function baseGet(object, path, pathKey) {
  if (object == null) {
    return;
  }
  object = toObject(object);
  if (pathKey !== undefined && pathKey in object) {
    path = [pathKey];
  }
  var index = 0,
      length = path.length;

  while (object != null && index < length) {
    object = toObject(object)[path[index++]];
  }
  return (index && index == length) ? object : undefined;
}

module.exports = baseGet;

},{"./toObject":199}],165:[function(require,module,exports){
var indexOfNaN = require('./indexOfNaN');

/**
 * The base implementation of `_.indexOf` without support for binary searches.
 *
 * @private
 * @param {Array} array The array to search.
 * @param {*} value The value to search for.
 * @param {number} fromIndex The index to search from.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */
function baseIndexOf(array, value, fromIndex) {
  if (value !== value) {
    return indexOfNaN(array, fromIndex);
  }
  var index = fromIndex - 1,
      length = array.length;

  while (++index < length) {
    if (array[index] === value) {
      return index;
    }
  }
  return -1;
}

module.exports = baseIndexOf;

},{"./indexOfNaN":188}],166:[function(require,module,exports){
var baseIsEqualDeep = require('./baseIsEqualDeep'),
    isObject = require('../lang/isObject'),
    isObjectLike = require('./isObjectLike');

/**
 * The base implementation of `_.isEqual` without support for `this` binding
 * `customizer` functions.
 *
 * @private
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @param {Function} [customizer] The function to customize comparing values.
 * @param {boolean} [isLoose] Specify performing partial comparisons.
 * @param {Array} [stackA] Tracks traversed `value` objects.
 * @param {Array} [stackB] Tracks traversed `other` objects.
 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
 */
function baseIsEqual(value, other, customizer, isLoose, stackA, stackB) {
  if (value === other) {
    return true;
  }
  if (value == null || other == null || (!isObject(value) && !isObjectLike(other))) {
    return value !== value && other !== other;
  }
  return baseIsEqualDeep(value, other, baseIsEqual, customizer, isLoose, stackA, stackB);
}

module.exports = baseIsEqual;

},{"../lang/isObject":205,"./baseIsEqualDeep":167,"./isObjectLike":194}],167:[function(require,module,exports){
var equalArrays = require('./equalArrays'),
    equalByTag = require('./equalByTag'),
    equalObjects = require('./equalObjects'),
    isArray = require('../lang/isArray'),
    isHostObject = require('./isHostObject'),
    isTypedArray = require('../lang/isTypedArray');

/** `Object#toString` result references. */
var argsTag = '[object Arguments]',
    arrayTag = '[object Array]',
    objectTag = '[object Object]';

/** Used for native method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Used to resolve the [`toStringTag`](http://ecma-international.org/ecma-262/6.0/#sec-object.prototype.tostring)
 * of values.
 */
var objToString = objectProto.toString;

/**
 * A specialized version of `baseIsEqual` for arrays and objects which performs
 * deep comparisons and tracks traversed objects enabling objects with circular
 * references to be compared.
 *
 * @private
 * @param {Object} object The object to compare.
 * @param {Object} other The other object to compare.
 * @param {Function} equalFunc The function to determine equivalents of values.
 * @param {Function} [customizer] The function to customize comparing objects.
 * @param {boolean} [isLoose] Specify performing partial comparisons.
 * @param {Array} [stackA=[]] Tracks traversed `value` objects.
 * @param {Array} [stackB=[]] Tracks traversed `other` objects.
 * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
 */
function baseIsEqualDeep(object, other, equalFunc, customizer, isLoose, stackA, stackB) {
  var objIsArr = isArray(object),
      othIsArr = isArray(other),
      objTag = arrayTag,
      othTag = arrayTag;

  if (!objIsArr) {
    objTag = objToString.call(object);
    if (objTag == argsTag) {
      objTag = objectTag;
    } else if (objTag != objectTag) {
      objIsArr = isTypedArray(object);
    }
  }
  if (!othIsArr) {
    othTag = objToString.call(other);
    if (othTag == argsTag) {
      othTag = objectTag;
    } else if (othTag != objectTag) {
      othIsArr = isTypedArray(other);
    }
  }
  var objIsObj = objTag == objectTag && !isHostObject(object),
      othIsObj = othTag == objectTag && !isHostObject(other),
      isSameTag = objTag == othTag;

  if (isSameTag && !(objIsArr || objIsObj)) {
    return equalByTag(object, other, objTag);
  }
  if (!isLoose) {
    var objIsWrapped = objIsObj && hasOwnProperty.call(object, '__wrapped__'),
        othIsWrapped = othIsObj && hasOwnProperty.call(other, '__wrapped__');

    if (objIsWrapped || othIsWrapped) {
      return equalFunc(objIsWrapped ? object.value() : object, othIsWrapped ? other.value() : other, customizer, isLoose, stackA, stackB);
    }
  }
  if (!isSameTag) {
    return false;
  }
  // Assume cyclic values are equal.
  // For more information on detecting circular references see https://es5.github.io/#JO.
  stackA || (stackA = []);
  stackB || (stackB = []);

  var length = stackA.length;
  while (length--) {
    if (stackA[length] == object) {
      return stackB[length] == other;
    }
  }
  // Add `object` and `other` to the stack of traversed objects.
  stackA.push(object);
  stackB.push(other);

  var result = (objIsArr ? equalArrays : equalObjects)(object, other, equalFunc, customizer, isLoose, stackA, stackB);

  stackA.pop();
  stackB.pop();

  return result;
}

module.exports = baseIsEqualDeep;

},{"../lang/isArray":202,"../lang/isTypedArray":207,"./equalArrays":182,"./equalByTag":183,"./equalObjects":184,"./isHostObject":190}],168:[function(require,module,exports){
var baseIsEqual = require('./baseIsEqual'),
    toObject = require('./toObject');

/**
 * The base implementation of `_.isMatch` without support for callback
 * shorthands and `this` binding.
 *
 * @private
 * @param {Object} object The object to inspect.
 * @param {Array} matchData The propery names, values, and compare flags to match.
 * @param {Function} [customizer] The function to customize comparing objects.
 * @returns {boolean} Returns `true` if `object` is a match, else `false`.
 */
function baseIsMatch(object, matchData, customizer) {
  var index = matchData.length,
      length = index,
      noCustomizer = !customizer;

  if (object == null) {
    return !length;
  }
  object = toObject(object);
  while (index--) {
    var data = matchData[index];
    if ((noCustomizer && data[2])
          ? data[1] !== object[data[0]]
          : !(data[0] in object)
        ) {
      return false;
    }
  }
  while (++index < length) {
    data = matchData[index];
    var key = data[0],
        objValue = object[key],
        srcValue = data[1];

    if (noCustomizer && data[2]) {
      if (objValue === undefined && !(key in object)) {
        return false;
      }
    } else {
      var result = customizer ? customizer(objValue, srcValue, key) : undefined;
      if (!(result === undefined ? baseIsEqual(srcValue, objValue, customizer, true) : result)) {
        return false;
      }
    }
  }
  return true;
}

module.exports = baseIsMatch;

},{"./baseIsEqual":166,"./toObject":199}],169:[function(require,module,exports){
var baseIsMatch = require('./baseIsMatch'),
    getMatchData = require('./getMatchData'),
    toObject = require('./toObject');

/**
 * The base implementation of `_.matches` which does not clone `source`.
 *
 * @private
 * @param {Object} source The object of property values to match.
 * @returns {Function} Returns the new function.
 */
function baseMatches(source) {
  var matchData = getMatchData(source);
  if (matchData.length == 1 && matchData[0][2]) {
    var key = matchData[0][0],
        value = matchData[0][1];

    return function(object) {
      if (object == null) {
        return false;
      }
      object = toObject(object);
      return object[key] === value && (value !== undefined || (key in object));
    };
  }
  return function(object) {
    return baseIsMatch(object, matchData);
  };
}

module.exports = baseMatches;

},{"./baseIsMatch":168,"./getMatchData":186,"./toObject":199}],170:[function(require,module,exports){
var baseGet = require('./baseGet'),
    baseIsEqual = require('./baseIsEqual'),
    baseSlice = require('./baseSlice'),
    isArray = require('../lang/isArray'),
    isKey = require('./isKey'),
    isStrictComparable = require('./isStrictComparable'),
    last = require('../array/last'),
    toObject = require('./toObject'),
    toPath = require('./toPath');

/**
 * The base implementation of `_.matchesProperty` which does not clone `srcValue`.
 *
 * @private
 * @param {string} path The path of the property to get.
 * @param {*} srcValue The value to compare.
 * @returns {Function} Returns the new function.
 */
function baseMatchesProperty(path, srcValue) {
  var isArr = isArray(path),
      isCommon = isKey(path) && isStrictComparable(srcValue),
      pathKey = (path + '');

  path = toPath(path);
  return function(object) {
    if (object == null) {
      return false;
    }
    var key = pathKey;
    object = toObject(object);
    if ((isArr || !isCommon) && !(key in object)) {
      object = path.length == 1 ? object : baseGet(object, baseSlice(path, 0, -1));
      if (object == null) {
        return false;
      }
      key = last(path);
      object = toObject(object);
    }
    return object[key] === srcValue
      ? (srcValue !== undefined || (key in object))
      : baseIsEqual(srcValue, object[key], undefined, true);
  };
}

module.exports = baseMatchesProperty;

},{"../array/last":147,"../lang/isArray":202,"./baseGet":164,"./baseIsEqual":166,"./baseSlice":173,"./isKey":192,"./isStrictComparable":195,"./toObject":199,"./toPath":200}],171:[function(require,module,exports){
var toObject = require('./toObject');

/**
 * The base implementation of `_.property` without support for deep paths.
 *
 * @private
 * @param {string} key The key of the property to get.
 * @returns {Function} Returns the new function.
 */
function baseProperty(key) {
  return function(object) {
    return object == null ? undefined : toObject(object)[key];
  };
}

module.exports = baseProperty;

},{"./toObject":199}],172:[function(require,module,exports){
var baseGet = require('./baseGet'),
    toPath = require('./toPath');

/**
 * A specialized version of `baseProperty` which supports deep paths.
 *
 * @private
 * @param {Array|string} path The path of the property to get.
 * @returns {Function} Returns the new function.
 */
function basePropertyDeep(path) {
  var pathKey = (path + '');
  path = toPath(path);
  return function(object) {
    return baseGet(object, path, pathKey);
  };
}

module.exports = basePropertyDeep;

},{"./baseGet":164,"./toPath":200}],173:[function(require,module,exports){
/**
 * The base implementation of `_.slice` without an iteratee call guard.
 *
 * @private
 * @param {Array} array The array to slice.
 * @param {number} [start=0] The start position.
 * @param {number} [end=array.length] The end position.
 * @returns {Array} Returns the slice of `array`.
 */
function baseSlice(array, start, end) {
  var index = -1,
      length = array.length;

  start = start == null ? 0 : (+start || 0);
  if (start < 0) {
    start = -start > length ? 0 : (length + start);
  }
  end = (end === undefined || end > length) ? length : (+end || 0);
  if (end < 0) {
    end += length;
  }
  length = start > end ? 0 : ((end - start) >>> 0);
  start >>>= 0;

  var result = Array(length);
  while (++index < length) {
    result[index] = array[index + start];
  }
  return result;
}

module.exports = baseSlice;

},{}],174:[function(require,module,exports){
/**
 * Converts `value` to a string if it's not one. An empty string is returned
 * for `null` or `undefined` values.
 *
 * @private
 * @param {*} value The value to process.
 * @returns {string} Returns the string.
 */
function baseToString(value) {
  return value == null ? '' : (value + '');
}

module.exports = baseToString;

},{}],175:[function(require,module,exports){
var identity = require('../utility/identity');

/**
 * A specialized version of `baseCallback` which only supports `this` binding
 * and specifying the number of arguments to provide to `func`.
 *
 * @private
 * @param {Function} func The function to bind.
 * @param {*} thisArg The `this` binding of `func`.
 * @param {number} [argCount] The number of arguments to provide to `func`.
 * @returns {Function} Returns the callback.
 */
function bindCallback(func, thisArg, argCount) {
  if (typeof func != 'function') {
    return identity;
  }
  if (thisArg === undefined) {
    return func;
  }
  switch (argCount) {
    case 1: return function(value) {
      return func.call(thisArg, value);
    };
    case 3: return function(value, index, collection) {
      return func.call(thisArg, value, index, collection);
    };
    case 4: return function(accumulator, value, index, collection) {
      return func.call(thisArg, accumulator, value, index, collection);
    };
    case 5: return function(value, other, key, object, source) {
      return func.call(thisArg, value, other, key, object, source);
    };
  }
  return function() {
    return func.apply(thisArg, arguments);
  };
}

module.exports = bindCallback;

},{"../utility/identity":214}],176:[function(require,module,exports){
var isObject = require('../lang/isObject');

/**
 * Checks if `value` is in `cache` mimicking the return signature of
 * `_.indexOf` by returning `0` if the value is found, else `-1`.
 *
 * @private
 * @param {Object} cache The cache to search.
 * @param {*} value The value to search for.
 * @returns {number} Returns `0` if `value` is found, else `-1`.
 */
function cacheIndexOf(cache, value) {
  var data = cache.data,
      result = (typeof value == 'string' || isObject(value)) ? data.set.has(value) : data.hash[value];

  return result ? 0 : -1;
}

module.exports = cacheIndexOf;

},{"../lang/isObject":205}]