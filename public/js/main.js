

function eventMap() {
	this.map = L.map('map').setView([ -16.92142702639103, 145.7787742651999], 15);

	this.callbacks = {};

	this.eventGeoJson = {};
	this.distanceHash = {};

	//add base layer
	L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoicHVtcGVkIiwiYSI6Ik5VTjlka2MifQ.0k-6s3mWkXrSYDcQrrLGDg', {
	    attribution: '',
	    maxZoom: 18,
	    id: 'pumped.j9l7pafh',
	    accessToken: 'pk.eyJ1IjoicHVtcGVkIiwiYSI6Ik5VTjlka2MifQ.0k-6s3mWkXrSYDcQrrLGDg'
	}).addTo(this.map);

	//add course layer
	function getRun(callback) {
		$.getJSON("data/run.json", function(data) {
			that.processGeoJSON("run",data);
			callback();
		});
	}

	var that = this;
	$.getJSON("data/cycle.json", function(data) {
		that.processGeoJSON("bike",data);
		getRun(function() {
			that.setupAthleteMarker();
			that.runCallbacks("ready");
		});
	});

	

	//locate user
	//this.map.locate({setView: true, maxZoom: 16});

}



eventMap.prototype.onReady = function(callback) {
	if (!this.callbacks.ready) this.callbacks.ready = [];
	this.callbacks.ready.push(callback);
}

eventMap.prototype.onDistanceChanged = function(callback) {
	if (!this.callbacks.distanceChanged) this.callbacks.distanceChanged = [];
	this.callbacks.distanceChanged.push(callback);
}

eventMap.prototype.runCallbacks = function(event, data) {
	if (!data) data = this;	

	if (this.callbacks[event]) {
		for (i in this.callbacks[event]) {
			if (typeof this.callbacks[event][i] === "function") {
		    // Call it, since we have confirmed it is callable​
		        this.callbacks[event][i](data);
		    }
		}
	}
}

eventMap.prototype.processGeoJSON = function(type, geoJson) {
	var style = {"color":"#FF5F5F"};
	if (type == "run") style = {"color":"#5F86FF"};

	// add to map
	this.eventGeoJson[type] = geoJson;
	L.geoJson(this.eventGeoJson[type], {style:style}).addTo(this.map);


	//build distance hash
	this.distanceHash[type] = [0];
	var coordinates = this.eventGeoJson[type].features[0].geometry.coordinates;

	//foreach coordinate measure the distance to next
	for (var i=1; i < coordinates.length; i++) {
		var previousDistance = this.distanceHash[type][i-1];

		var currentPoint =L.latLng(coordinates[i][1],coordinates[i][0]);
		var lastPoint = L.latLng(coordinates[i-1][1],coordinates[i-1][0]);

		var newDistance = lastPoint.distanceTo(currentPoint);

		this.distanceHash[type][i] = previousDistance + newDistance;
	}

	//total distance
	//console.log(Math.round(this.distanceHash[this.distanceHash.length-1]/1000) + "km")
};

eventMap.prototype.setupAthleteMarker = function() {
	this.markerAthlete = L.marker([-16.92142702639103, 145.7787742651999]).addTo(this.map);
};

eventMap.prototype.setDistance = function(metrics) {
	if (!metrics) return;
	if (!metrics.hasOwnProperty("distance")) return;

	//console.log(this.eventGeoJson);
	
	try {
		var coordinates = this.eventGeoJson[metrics.leg].features[0].geometry.coordinates;

		//get marker index
		var index = this._findNextDistance(metrics.distance, metrics.leg);

		//console.log("Distance: " + distance);
		//console.log("Index: " + index);
		var athletePos = L.latLng(
			coordinates[index][1],
			coordinates[index][0]
			);

		this.markerAthlete.setLatLng(athletePos);

		this.runCallbacks("distanceChanged", metrics);
		this.map.panTo(athletePos);
	}
	catch(e) {
		//console.log(e);
	}

};

eventMap.prototype._findNextDistance = function(distance, type) {
	for (var i in this.distanceHash[type]) {
		if (this.distanceHash[type][i] > distance) {
			return i;
		}
	}

	return this.distanceHash.length - 1;
};











var e = new eventMap();
//e.setDistance();

var j = 0;
var pace = 10; //km/hr

athID = 386;

d = new dataLoader();
d.getData(athID);


e.onDistanceChanged(function updateDistance(metrics) {
	$('#distanceCovered').html(Math.round(metrics.distance/100)/10 + "km");
	$('#legFinish').html(metrics.legFinish);
	$('#legFinishTime').html(metrics.legFinishTime);
	$('#distanceRemaining').html(Math.round(metrics.distanceRemaining/100)/10 + "km");
	$('#athleteName').html(metrics.name);
});

function update(){
	//console.log("udpdated");
	var metrics = d.estimatedDistance();
	//console.log(metrics);
	//console.log(distance);
	e.setDistance(metrics);
	setTimeout(update,1000);
	//console.log(i);
	j = j + 10;
}

e.onReady(function(){update();});



setInterval(function(){d.getData(athID)},100000);

$(window).on('hashchange', function() {
  athID = window.location.hash.substr(1);
  d.getData(athID);
});