function dataLoader() {
	this.callbacks = {};
	this.athleteData;
	this.dataSets = {};
	this.currentRaceTime = 21486;
	//this.raceStart = new Date(2015,04,14,08,15,00);
	this.raceStart = new Date(2015,05,14,7,53,00);

	this.legDistance = {"swim": 3.8, "bike": 180, "run": 42};
}

dataLoader.prototype.onData = function(callback) {
	if (!this.callbacks.ready) this.callbacks.onData = [];
	this.callbacks.onData.push(callback);
}

dataLoader.prototype.onDataChanged = function(callback) {
	if (!this.callbacks.ready) this.callbacks.onDataChanged = [];
	this.callbacks.onDataChanged.push(callback);
}

dataLoader.prototype.runCallbacks = function(event, data) {
	if (!data) data = this;

	if (this.callbacks[event]) {
		for (i in this.callbacks[event]) {
			if (typeof this.callbacks[event][i] === "function") {
		    // Call it, since we have confirmed it is callable​
		        this.callbacks[event][i].apply(data);
		    }
		}
	}
}

dataLoader.prototype.setAthlete = function(athlete) {
	this.athlete = athlete;
	if (this.dataSets.hasOwnProperty(athlete)){
		this.runCallbacks("onDataChanged",this.dataSets[athlete]);
	}

	this.getData(athlete);
}

dataLoader.prototype.getData = function(athlete) {
	that = this;
	$.getJSON("/getData?ath="+athlete, function(data) {
		//console.log(data);

		that.athleteData = data;
		that.dataSets[athlete] = data;

		that.runCallbacks("onData", data);

		if (athlete == that.athlete) {
			that.runCallbacks("onDataChanged", data);
		}
	});
};

dataLoader.prototype.estimatedDistance = function(bib) {
	if (!this.dataSets.hasOwnProperty(bib)) return;

	//estimate speed
	var latest = this.latestCheckpoint(bib);



	//console.log(latest);

	if (latest[0] == "run") {
		var pace = latest[1].pace.split("/")[0];
		avgSpeed = this._paceToSpeed(pace);
	}

	if (latest[0] == "bike") {
		avgSpeed = Number(latest[1].speed.split("k")[0]);
	}

	if (latest[0] == "swim") {
		return 0;
	}

	var legStartDistance = parseInt(latest[1].name.split(" ")[0]);
	var splitTime = this._calculateRaceTimeOffset(latest[1].race_time);
	var hours = splitTime / 60 / 60;

	//workout distance
	var distance = (legStartDistance + (avgSpeed * hours)) * 1000;

	//console.log(splitTime);
	//console.log(avgSpeed);
	//console.log("Distance: " + distance);


	var metrics = this.calculateMetrics(bib, distance, avgSpeed, legStartDistance);
	metrics.distance = distance;
	metrics.avgSpeed = avgSpeed;
	metrics.leg = latest[0];
	metrics.splits = this.dataSets[bib].splits;

	return metrics;

}

dataLoader.prototype.calculateMetrics = function(bib, distance, avgSpeed, legStartDistance) {
	//distance remaining
	var latest = this.latestCheckpoint(bib);
	//console.log(latest);
	var distanceRemaining = (latest[1].legDistance*1000) - distance;

	//console.log("Distance Remaining: " + distanceRemaining);

	//est leg finish time
	var splitDistanceRemaining = (latest[1].legDistance*1000) - legStartDistance*1000;
	var splitTimeRemaining = ((splitDistanceRemaining/1000) / avgSpeed*60*60);
	//console.log("splitTimeRemaining: " + splitDistanceRemaining);
	var splitTime = this._convertTimeToSeconds(latest[1].race_time);
	var legFinish = splitTime + splitTimeRemaining;



	//est leg finish
	var timeRemaining = (((distanceRemaining/1000) / avgSpeed*60*60));
	var legFinishSeconds = this.getCurrentRaceTime() + timeRemaining;
	var legFinishTime = new Date(this.raceStart);
	legFinishTime.setSeconds(legFinishSeconds);
	var legFinishString = this._createTimeString(legFinishTime);
	//console.log(legFinishString);

	var metrics = {
		"distanceRemaining":distanceRemaining,
		"legFinishTime": legFinishString,
		"legFinish": this._convertSecondsToTime(legFinish),
		"name": this.dataSets[bib].name,
		"bib": bib
	};

	return metrics;
}

dataLoader.prototype._createTimeString = function(time) {
	var hours = time.getHours();
	var ap = "AM"
	if (hours >= 12) {
		ap = "PM";
		hours = hours % 12;
	}

	if (hours == 0) {
		hours = 12;
	}

	var mins = time.getMinutes();
	if (mins < 10) {
		mins = "0" + mins;
	}

	return hours + ":" + mins + " " +ap;
}

dataLoader.prototype.getCurrentRaceTime = function() {

	//SET THIS TO CURRENT DATE
	var currentDate = new Date(2015,05,14,20,53,00);//new Date();

	//DELETE this
	var thisDate = new Date();
	currentDate.setSeconds(thisDate.getSeconds());
	currentDate.setMinutes(thisDate.getMinutes());

	//console.log(this.raceStart);

	var raceTime = (currentDate - this.raceStart) / 1000;

	//console.log("Race Time: " + raceTime / 60 / 60);

	//return in seconds
	return raceTime;
}

dataLoader.prototype._convertTimeToSeconds = function(time) {
	//console.log(time);
	var hms = time.split(":");
	var dTime = (parseInt(hms[0]) * 60 * 60) + (parseInt(hms[1]) * 60) + parseInt(hms[2]);
	//console.log(dTime);
	return dTime;
}

dataLoader.prototype._convertSecondsToTime = function(time) {
	var hours = parseInt(time / 3600);
	var minutes = parseInt((time / 60)) % 60;
	if (minutes < 10) minutes = "0" + minutes;
	var seconds = parseInt(time % 60);
	if (seconds < 10) seconds = "0" + seconds;
	return hours + ":" + minutes  + ":" + seconds;
}

dataLoader.prototype._calculateRaceTimeOffset = function(time) {
	var dTime = this._convertTimeToSeconds(time);
	return this.getCurrentRaceTime() - dTime;
}

dataLoader.prototype._paceToSpeed = function(pace) {
	var ms = pace.split(":");
	var decimalTime = parseInt(ms[0])+((parseInt(ms[1]) / 60));
	var time = 60 / decimalTime;
	return Number(time);
}

dataLoader.prototype.latestCheckpoint = function(bib) {
	// determine latest checkpoint from data
	var athleteData = this.dataSets[bib];

	//check run length
	if (athleteData.splits.run.length) {
		//console.log("Running")
		var runSplits = athleteData.splits.run;
		run = runSplits[runSplits.length-1];
		run.legDistance = this.legDistance.run;
		return ["run",run]; //fix
	}

	//check bike length
	if (athleteData.splits.bike.length) {
		//console.log("cycling");
		var bikeSplits = athleteData.splits.bike;
		bike = bikeSplits[bikeSplits.length-1];
		bike.legDistance = this.legDistance.bike;
		return ["bike",bike];
	}

	//check swim length
	if (athleteData.splits.swim.length) {
		var swimSplits = athleteData.splits.swim;
		swim = swimSplits[swimSplits.length-1];
		swim.legDistance = this.legDistance.swim;
		return ["swim",swim];
	}

};
