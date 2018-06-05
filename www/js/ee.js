var c, e;
var ok = false;

var tall = document.getElementById("body").offsetHeight
var wide = document.getElementById("body").offsetWidth

var step = .25;
var delay = 100;

var nextStep = 0;
var numObjects = 6;

var Xpos = wide / 2;
var Ypos = tall / 2;

var app = {
	initialize: function() {
		this.bindEvents();
	},
	bindEvents: function() {
		document.addEventListener('deviceready', this.onDeviceReady, false);
	},
	onDeviceReady: function() {
		app.receivedEvent('deviceready');
	},
	receivedEvent: function(id) {
		objectFloat(); fixScreen(); start();
	}
};

function objectFloat() {
	for (var xx = 1; xx <= numObjects; xx++ ) {
		var objectID = 'ball' + xx;
		var object = document.getElementById(objectID);
		object.style.top = Ypos + Math.cos((20 * Math.sin(nextStep/(30 + xx))) + xx * 70 ) * tall * 
			(Math.sin(10 + nextStep/10) + 0.2) * Math.cos((nextStep + xx * 55)/10) / 3 + "px";
		object.style.left = Xpos + Math.sin((20 * Math.sin(nextStep/30)) + xx * 70 ) * wide * 
			(Math.sin(10 + nextStep / (10 + xx)) + 0.2) * Math.cos((nextStep + xx * 55)/10) /3 + "px";
	}
	nextStep += step;
	setTimeout('objectFloat()', delay);
}

function sum() {
	c++;
	e = 0;
	document.getElementById("cont").innerHTML = c;
	if (c == 5) {
		document.getElementById("msgr").innerHTML = 'Nice';delay = 90;
		document.getElementById("b2").src = "ee/ball.gif?" + new Date().getTime();
		document.getElementById("b2").style.display = 'block';
	} else if (c == 10) {
		document.getElementById("msgr").innerHTML = 'Good';delay = 80;
		document.getElementById("b3").src = "ee/ball.gif?" + new Date().getTime();
		document.getElementById("b3").style.display = 'block';
	} else if (c == 20) {
		document.getElementById("msgr").innerHTML = 'Great';delay = 70;
		document.getElementById("b4").src = "ee/ball.gif?" + new Date().getTime();
		document.getElementById("b4").style.display = 'block';
	} else if (c == 50) {
		document.getElementById("msgr").innerHTML = 'Wonderful';delay = 60;
		document.getElementById("b5").src = "ee/ball.gif?" + new Date().getTime();
		document.getElementById("b5").style.display = 'block';
	} else if (c == 100) {
		document.getElementById("msgr").innerHTML = 'Excellent';delay = 50;
		document.getElementById("b6").src = "ee/ball.gif?" + new Date().getTime();
		document.getElementById("b6").style.display = 'block';
	}
}

function res() {
	c = 0; 
	e = 0;
	document.getElementById("cont").innerHTML = c;
	document.getElementById("msgr").innerHTML = '...';
	for (var xx = 2; xx <= numObjects; xx++ ) document.getElementById("b"+xx).style.display = 'none';
	delay = 100
}

function start(){
	ok = true;
	for (var xx = 1; xx <= numObjects; xx++ ) {
		document.getElementById("ball" + xx).style.display = 'block';
	}
	res();
}

function bad() {
	if ( ++e == 3 ) res();
}

function fixScreen() {
	wide = document.getElementById("body").offsetWidth;  Xpos = wide / 2;
	tall = document.getElementById("body").offsetHeight; Ypos = tall / 2;
	document.getElementById("cont").style.top = ( tall / 2 - 80 ) + "px";
	document.getElementById("msgr").style.top = ( tall / 2 + 60 ) + "px";
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

$(window).bind('resize',function(e) { fixScreen(); });

$(window).bind('orientationchange',function(e) { fixScreen(); });
