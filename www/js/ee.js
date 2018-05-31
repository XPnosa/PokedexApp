var c = 0;

var ok = false;
var aux = true;

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
		objectFloat();
		fixScreen();
		start();
	}
};

function objectFloat() {
	for (var xx = 1; xx <= numObjects; xx++ ) {
		var objectID = 'ball' + xx;
		var object = document.getElementById(objectID);
		object.style.top = Ypos + Math.cos((20 * Math.sin(nextStep/(30 + xx))) + xx * 70 ) * tall * (Math.sin(10 + nextStep/10) + 0.2) * Math.cos((nextStep + xx * 55)/10) + "px";
		object.style.left = Xpos + Math.sin((20 * Math.sin(nextStep/30)) + xx * 70 ) * wide * (Math.sin(10 + nextStep / (10 + xx)) + 0.2) * Math.cos((nextStep + xx * 55) / 10) + "px";
	}
	nextStep += step;
	setTimeout('objectFloat()', delay);
}

function sum() {
	aux = false;
	c = c + 1;
	document.getElementById("cont").innerHTML = c;
	if (c == 5) {document.getElementById("msgr").innerHTML = 'Nice';delay = 90}
	else if (c == 10) {document.getElementById("msgr").innerHTML = 'Good';delay = 80}
	else if (c == 20) {document.getElementById("msgr").innerHTML = 'Great';delay = 70}
	else if (c == 50) {document.getElementById("msgr").innerHTML = 'Wonderful';delay = 60}
	else if (c == 100) {document.getElementById("msgr").innerHTML = 'Excellent';delay = 50}
}

function res() {
	fixScreen();
	if (aux) {
		c = 0
		document.getElementById("cont").innerHTML = c;
		document.getElementById("msgr").innerHTML = '...';
		delay = 100
	}
	aux = true;
}

function start(){
	ok = true;
	for (var xx = 1; xx <= numObjects; xx++ ) document.getElementById("ball" + xx).style.display = 'block';
	res();
}

function fixScreen() {
	wide = document.getElementById("body").offsetWidth;  Xpos = wide / 2;
	tall = document.getElementById("body").offsetHeight; Ypos = tall / 2;
	document.getElementById("cont").style.top = ( tall / 2 - 80 ) + "px";
	document.getElementById("msgr").style.top = ( tall / 2 + 60 ) + "px";
}

app.initialize();

$(window).bind('resize',function(e) { fixScreen(); });

$(window).bind('orientationchange',function(e) { fixScreen(); });
