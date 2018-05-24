var xmlhttp = new XMLHttpRequest();

var pokedex = {}

var generation = 0;

var last_pokemon = 807;

var load_completed = false;

var app = {
	initialize: function() {
		this.bindEvents();
	},
	bindEvents: function() {
		document.addEventListener('deviceready', this.onDeviceReady, false);
	},
	onDeviceReady: function() {
		dontBack();
		document.addEventListener("backbutton", onBackKeyDown, false);
		app.receivedEvent('deviceready');
	},
	receivedEvent: function(id) {
		printLegend();
		readJson("json/pokedex.json");
	}
};

function readJson(filePath) {
	xmlhttp.open("GET", filePath, true);
	xmlhttp.onreadystatechange = function() {
		if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
			document.getElementById("list").innerHTML = ''; fitDex()
			var fix = document.getElementById("legend").innerHTML
			var pokemon = JSON.parse(xmlhttp.responseText);
			var len = Object.keys(pokemon).length;
			for (i=1;i<=len;i++) {
				var pkmn = i<10?"00"+i:i<100?"0"+i:i
				pokedex[pkmn] = pokemon[pkmn]
			}
			var i = 1
			var refreshIntervalId = setInterval(function() {
				var pkmn = i<10?"00"+i:i<100?"0"+i:i
				if ( i <= ( len ) ) {
					var percent = (i/last_pokemon*100).toFixed(0)+"%"
					document.getElementById("legend").innerHTML = fix + 
					'<div class="init inactive"><div class="init">&nbsp;' + percent + '&nbsp;</div></div>'
					setTimeout(function(){
						printPokedex(pkmn);
					}, 0);
					if ( i == len ) {
						showDex(0);
						swipePkdex();
						load_completed = true;
					}
				} else clearInterval(refreshIntervalId);
				i++
			}, 0);
		}
	};
	xmlhttp.send();
}

function fitDex() {
	var h1 = document.getElementById("body").offsetHeight-50;
	document.getElementById("pkdex").style.height = h1+"px";
	if ( document.getElementById("legend").offsetHeight > 50 ) var h2 = document.getElementById("pkdex").offsetHeight-60;
	else var h2 = document.getElementById("pkdex").offsetHeight-45;
	document.getElementById("list").style.height = h2+"px";
	var h3 = document.getElementById("body").offsetWidth-50;
	document.getElementById("info").style.width = h3+"px";
	var h4 = document.getElementById("info").offsetHeight-50;
	document.getElementById("photo").style.height = h4+"px";
	var photo = document.getElementById("photo-full")
	if ( document.getElementById("body").offsetHeight < document.getElementById("body").offsetWidth ) {
		photo.style.width = "auto";
		photo.style.height = "99%";
	} else {
		photo.style.width = "99%";
		photo.style.height = "auto";
	}
}

function printLegend(pkmn) {
	var legend = '<div style="cursor:default;" class="active"><div>Nacional</div></div>';
	document.getElementById("pkdex").innerHTML = "<legend id='legend'>"+legend+"</legend>" + 
	"<div id='list'><center><img id='loading' title='Cargando...' src='img/loading.gif' /></center></div>";
}

function printPokedex(pkmn) {
	var gen = getGeneration(pkmn);
	var pokemon = "<div id='"+pkmn+"' class='pkmn "+gen+"'>";
	pokemon += "<img class='pk_img' onclick='viewImage(\""+pkmn+"\")' src='pkmn/"+pkmn+".png' />"
	pokemon += "<input type='button' onclick='showDetails(\""+pkmn+"\")' class='pk_name' value='"+pokedex[pkmn].nombre+"' />";
	pokemon += "<input type='button' onclick='showDetails(\""+pkmn+"\")' class='pk_name altura' value='Altura: "+pokedex[pkmn].altura+"' />";
	pokemon += "<input type='button' onclick='showDetails(\""+pkmn+"\")' class='pk_name peso' value='Peso: "+pokedex[pkmn].peso+"' />";
	pokemon += "<div class='pk_types'>";
	for (var t=0;t<pokedex[pkmn].tipo.length;t++) pokemon += "<div onclick='showDetails(\""+pkmn+"\")' class='pk_type "+pokedex[pkmn].tipo[t]+"'><span>"+pokedex[pkmn].tipo[t]+"</span></div>";
	pokemon += "</div></div>";
	var newcontent = document.createElement('div');
	newcontent.innerHTML = pokemon;
	document.getElementById("list").appendChild(newcontent.firstChild);
}

function showDex(n) {
	document.getElementById("loading-mini").style.display='';
	setTimeout(function(){
		generation = n;
		var list = document.querySelectorAll('.pkmn');
		for(i=0; i<list.length; i++) list[i].style.display = "none";
		document.getElementById("html").style.background = getBackground(n);
		if (n==0) var legend = '<div onclick="shearchDex(\'Nacional\');" class="active"><div>Nacional</div></div>';
		else var legend = '<div title="Pokedex Nacional" onclick="showDex(0);" class="inactive"><div>#</div></div>';
		for (i=1;i<=7;i++) {
			if (i==n) legend += '<div onclick="shearchDex(\''+getRegion(i)+'\');" class="G'+i+' active"><div>'+getRegion(i)+'</div></div>';
			else legend += '<div title="Pokedex '+getRegion(i)+'" onclick="showDex('+i+');" class="G'+i+' inactive"><div>'+i+'</div></div>';
		}
		document.getElementById("legend").innerHTML = legend;
		if (n==0) list = document.querySelectorAll('.pkmn');
		else list = document.querySelectorAll('.'+getRegion(n));
		for(i=0; i<list.length; i++) list[i].style.display = "";
		document.getElementById("loading-mini").style.display='none';
	}, 0);
	
}

function shearchDex(region) {
	var search = prompt("Buscar pokemon en la Pokedex " + region);
	if ( search == null ) search = ""
	if ( region == "Nacional" )
		var list = document.querySelectorAll('.pkmn');
	else
		var list = document.querySelectorAll('.' + region);
	for ( i=0 ; i<list.length ; i++ ) 
		if ( parseInt(search, 10) == parseInt(list[i].id, 10) )
			list[i].style.display = "";
		else
			list[i].style.display = "none";
	for ( num in pokedex )
		if ( pokedex.hasOwnProperty(num) )
			if ( region == getGeneration(num) || region == "Nacional" )
				if ( pokedex[num].nombre.toLowerCase().indexOf(search.toLowerCase()) >= 0 )
					document.getElementById(num).style.display = "";
}

function showDetails(pkmn) {
	var details = document.getElementById("details");
	var photo = document.getElementById("photo");
	var info = document.getElementById("info");
	var desc = pokedex[pkmn].info_x;
	if ( desc != pokedex[pkmn].info_y ) desc += " " + pokedex[pkmn].info_y;
	desc += "<center><table><tr><td><b>Altura</b>: "+pokedex[pkmn].altura+"</td>";
	desc += "<td><b>Peso</b>: "+pokedex[pkmn].peso+"</td></tr></table></center>";
	photo.src = "pkmn/"+pkmn+".png";
	var type = "<center><div class='pk_types_info'>";
	for (var t=0;t<pokedex[pkmn].tipo.length;t++) type += "<div class='pk_type "+pokedex[pkmn].tipo[t]+"'><span>"+pokedex[pkmn].tipo[t]+"</span></div>";
	type += "<div></center>";
	info.innerHTML = "<img style='float: right;' class='pk_img' onclick='viewImage(\""+pkmn+"\")' src='img/favicon.png' />"
	info.innerHTML += "<p class='title'>" + pkmn + " - " + pokedex[pkmn].nombre + "</p>" + desc  + "<hr />" + type
	details.style.display = ""; fitDex();
}

function closeDetails() {
	var info = document.getElementById("info");
	var photo = document.getElementById("photo");
	var details = document.getElementById("details");
	info.innerHTML = ""
	photo.src = "";
	details.style.display = "none";
}

function getGeneration(pkmn) {
	var region;
	var idx = parseInt(pkmn, 10);
	switch (true) {
		case (idx >= 1 && idx <= 151):
			region = "Kanto"; break;
		case (idx >= 152 && idx <= 251):
			region = "Johto"; break;
		case (idx >= 252 && idx <= 386):
			region = "Hoenn"; break;
		case (idx >= 387 && idx <= 493):
			region = "Sinnoh"; break;
		case (idx >= 494 && idx <= 649):
			region = "Unova"; break;
		case (idx >= 650 && idx <= 721):
			region = "Kalos"; break;
		case (idx >= 722 && idx <= 807):
			region = "Alola"; break;
	}
	return region
}

function getRegion(n) {
	var region;
	switch (n) {
		case 1:
			region = "Kanto"; break;
		case 2:
			region = "Johto"; break;
		case 3:
			region = "Hoenn"; break;
		case 4:
			region = "Sinnoh"; break;
		case 5:
			region = "Unova"; break;
		case 6:
			region = "Kalos"; break;
		case 7:
			region = "Alola"; break;
		default: 
			region = n;
	}
	return region
}

function getBackground(n) {
	var colors;
	switch (n) {
		case 1:
			colors = "red 50%, green 50%"; break;
		case 2:
			colors = "goldenrod 50%, silver 50%"; break;
		case 3:
			colors = "red 50%, blue 50%"; break;
		case 4:
			colors = "lavender 50%, peachpuff 50%"; break;
		case 5:
			colors = "black 50%, white 50%"; break;
		case 6:
			colors = "darkblue 50%, darkred 50%"; break;
		case 7:
			colors = "gold 50%, blue 50%"; break;
		default: 
			colors = "red 50%, white 50%";
	}
	return "linear-gradient(135deg, " + colors + ")";
}

function viewImage(pkmn) {
	var photo = document.getElementById("photo-full");
	var gallery = document.getElementById("gallery");
	photo.src = "pkmn/"+pkmn+".png";
	gallery.style.display = "";
}

function closeImage() {
	var gallery = document.getElementById("gallery");
	var photo = document.getElementById("photo-full");
	gallery.style.display = "none";
	photo.src = "";
}

function swipePkdex(){
	var xIni, yIni;
	var canvas = document.getElementById('pkdex');
	canvas.addEventListener('touchstart', function(e){
		if (e.targetTouches.length == 1) { 
			var touch = e.targetTouches[0]; 
			xIni = touch.pageX;
			yIni = touch.pageY;
		}
	}, false);
	canvas.addEventListener('touchmove', function(e){
		if (e.targetTouches.length == 1) { 
			var touch = e.targetTouches[0]; 
			if((touch.pageX>xIni+20) && (touch.pageY> yIni-5) && (touch.pageY<yIni+5) && (generation>0)) showDex(--generation);
			if((touch.pageX<xIni-20) && (touch.pageY> yIni-5) && (touch.pageY<yIni+5) && (generation<7)) showDex(++generation);
		}
	}, false); 
}

function dontBack(){
	window.location.hash="no-back-button";
	window.location.hash="Again-No-back-button"
	window.onhashchange=function(){
		window.location.hash="no-back-button";
		if (load_completed) showDex(generation);
		closeImage();
		closeDetails(); 
	}
}

function onBackKeyDown(e) {
	e.preventDefault();
	if (load_completed) showDex(generation);
	closeImage();
	closeDetails(); 
}

$(window).bind('resize',function(e) { fitDex(); });

$(window).bind('orientationchange',function(e) { fitDex(); });
