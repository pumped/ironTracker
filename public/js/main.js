

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

eventMap.prototype.onDataLoaded = function(callback) {
	if (!this.callbacks.dataLoaded) this.callbacks.dataLoaded = [];
	this.callbacks.dataLoaded.push(callback);
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
		var points = this._findNextDistance(metrics.distance, metrics.leg);
		var index = points[1];

		//work out sub point position
		pos = this._subDistance(points, metrics.distance, metrics.leg);

		var athletePos = L.latLng(
			pos[0],
			pos[1]
			);

		this.markerAthlete.setLatLng(athletePos);
		//console.log("pos");
		//console.log(athletePos);
	}	catch(err) {
		console.error(err);
	}

		this.runCallbacks("distanceChanged", metrics);
		this.map.panTo(athletePos);


};

eventMap.prototype._subDistance = function(points, distance, type) {
	var coordinates = this.eventGeoJson[type].features[0].geometry.coordinates;
	var sd = this.distanceHash[type][points[0]];
	var nd = this.distanceHash[type][points[1]];
	var segDistance = nd - sd;

	if (segDistance == 0) {
		var lat = coordinates[points[0]][1];
		var lon = coordinates[points[0]][0]
	} else {
		var latRange = coordinates[points[1]][1] - coordinates[points[0]][1];
		var lonRange = coordinates[points[1]][0] - coordinates[points[0]][0];

		var lat = (((distance - sd) * latRange) / segDistance) + coordinates[points[0]][1];
		var lon = (((distance - sd) * lonRange) / segDistance) + coordinates[points[0]][0];
	}

	return [lat,lon];
}

eventMap.prototype._findNextDistance = function(distance, type) {
	for (var i in this.distanceHash[type]) {
		if (this.distanceHash[type][i] > distance) {
			return [Math.abs(i-1),i];
		}
	}

	var lastPoint = this.distanceHash[type].length - 1;
	return [lastPoint, lastPoint];
};











var e = new eventMap();
//e.setDistance();

var j = 0;
var pace = 10; //km/hr

//var athID = 386;
var ath = window.location.hash.substr(1);
if (Number(ath) > 0) {
	athID = ath;
} else {
	athID = 0;
}

d = new dataLoader();
d.getData(athID);

var athletes = new athleteList();

$('#btn_addAthlete').click(function(){
  athletes.submit();
});

$("#form_addAthlete").submit(function(){
  athletes.submit();
  return false;
});

athletes.updateDom();



e.onDistanceChanged(function updateDistance(metrics) {
	$('#distanceCovered').html(Math.round(metrics.distance/100)/10 + " km");
	$('#legFinish').html(metrics.legFinish);
	$('#legFinishTime').html(metrics.legFinishTime);
	$('#distanceRemaining').html(Math.round(metrics.distanceRemaining/100)/10 + " km");
	$('#athleteName').html(metrics.name);
	$('#athletePace').html(metrics.avgSpeed.toFixed(1) + " km/h");


	// ---- update splits ---- //
	var t = 0;
	var tables = ["tbl_swim","tbl_bike","tbl_run"];

	var rowTemp = document.querySelector('#splitrow');

	if (rowTemp) {
		var td = rowTemp.content.querySelectorAll("td");
		var tdName = rowTemp.content.querySelectorAll("th")[0];

		for (var leg in metrics.splits) {
			var table = tables[t];
			var tb = document.getElementById(table).getElementsByTagName("tbody");

			for (var splits in metrics.splits[leg] ) {
				var split = metrics.splits[leg][splits];

				//check if it existsv
				var splitExists = false;
				$("#"+table + " th").each(function(index) {
					if ($(this).html() == split.name) {
						splitExists = true;
					}
				});

				if (!splitExists) {
					tdName.textContent = split.name;
					td[0].textContent = split.distance;
					td[1].textContent = split.split_time;
					td[2].textContent = split.race_time;
					if (split.pace) {
						td[3].textContent = split.pace;
					} else {
						td[3].textContent = split.speed;
					}

					var clone = document.importNode(rowTemp.content, true);
					tb[0].appendChild(clone);
				}

			}

			t++;
			//console.log(metrics.splits[i])
		}
	}

//	console.log(metrics);
});

function update(){

	var metrics = d.estimatedDistance();
	//console.log(metrics);
	//console.log(distance);
	e.setDistance(metrics);
	setTimeout(update,1000);
	//console.log(i);
	j = j + 10;
}

e.onReady(function(){update();});

d.onData(function () {
	var data = this;

	//clear splits
	$("#tbl_swim tbody").html("");
	$("#tbl_bike tbody").html("");
	$("#tbl_run tbody").html("");

	//pass data to athletes
	athletes.updateAthlete(data);
});


setInterval(function(){d.getData(athID)},100000);

$(window).on('hashchange', function() {
  athID = window.location.hash.substr(1);
  d.getData(athID);
});
