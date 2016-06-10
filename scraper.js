
// Example pages:
// http://track.ironman.com/newathlete.php?rid=1143240085&race=arizona&bib=6&v=3.0&beta=&1416153600
// http://track.ironman.com/newathlete.php?rid=1143240085&race=arizona&bib=24&v=3.0&beta=&1416150900
urllib = require('urllib');
http = require('http');
request = require('request');

cheerio = require('cheerio');
var fs = require('fs');
verbose = false;



function scraper() {
	this.raceid = 2147483682;
	this.waitTime = 3000; // in ms

	this.athletes = new Array();

	this.reqPool = new http.Agent({ maxSockets: 3 });
}

scraper.prototype.scrape = function(bib, startTime, priority, callback) {

	var athlete = {};
	athlete.bib = bib;
	athlete.startTime = startTime;
	athlete.times = new Array();
	athlete.splits = {swim:[],bike:[],run:[]};

	if(verbose) console.log("Checking athlete: " + bib);
	var that = this;

	var pool = this.reqPool;
	if (priority) {
		//console.log("high priority");
		var pool = false;
	}

	request({
		method: 'GET',
		pool: pool,
		url: 'http://track.ironman.com/newathlete.php?rid='+this.raceid+'&bib='+bib+'&v=3.0'
		//url: 'http://techoutbreak.com'
	}, function(err, response, body) {
		if (!err) {
			that._dataLoaded(athlete,body,callback);
			//console.log("returned");
		}
	})


	// --- Connect & Download ---
/*	var url = 'http://track.ironman.com/newathlete.php?rid='+this.raceid+'&bib='+bib+'&v=3.0';

	var options = {
	  method: 'GET',
	  useragent: 'Mozilla/5.0',
	};
	//var htmldata = httpsync.get(options).end().data.toString();

	var that = this;

	urllib.request(url, options).then(function(result){
		that._dataLoaded(athlete,result.data.toString());
	}).catch(function(err) {
		console.log(err);
	});*/

};

scraper.prototype._dataLoaded = function(athlete,data,callback) {
	var $ = cheerio.load(data);

	// --- Get name or skip on error ---
	try{
		//console.log("startTime: " + startTime);
		athlete.name = $('.eventResults .moduleContentOuter .moduleContentInner section header h1').html().split('>')[3];
		if(verbose) console.log('Name: ' + athlete.name);
		//process and store
		this.processAthlete($, athlete);
		if (typeof(callback) == "function") {
			callback(null,["data",athlete]);
		}

		//this.athletes.push(athlete);

	} catch(e) {
		console.log("Error trying ID " + athlete.bib + ". Skipping...");
		if (typeof(callback) == "function") {
			callback("Failed to load", null);
		}
	}
};

scraper.prototype.processAthlete = function($, athlete) {

		// ---- SWIMMING ---
		athlete.swim = $('.athlete-table-details tfoot tr td').eq(3).children('strong').html();
		if (!athlete.swim) {console.log("bad response"); return;}
		if(athlete.swim.charAt(0) != '-')  {
			athlete.times.push(athlete.swim);
		}

		if(verbose) console.log('Swim: ' + athlete.swim);
		if(verbose) console.log("");

		// --- BIKE ---
		var htmlbike = $('.athlete-table-details table').eq(1).children('tr');
		athlete.bike = new Array();
		for(var row = 0; row < htmlbike.length; row++){
			var new_value = htmlbike.eq(row).children('td').eq(3).html();
			athlete.bike.push(new_value);
			if(verbose) console.log('bike ('+row+'): ' + new_value);

			//if split has data
			if(new_value.charAt(0) != '-') {
				//console.log(new_value.charAt(0));
				athlete.times.push(new_value);

				//get full splits
				var brColumns = ["name","distance","split_time","race_time","speed"];
				var split = {};
				var splitName = htmlbike.eq(row).children('td').eq(0).html();

				for (var col = 0; col < brColumns.length; col++) {
					split[brColumns[col]] = htmlbike.eq(row).children('td').eq(col).html();
				}
				//push to splits
				athlete.splits.bike.push(split);
			}
		}

		if(verbose) console.log("");

		// --- RUN ---
		var htmlrun = $('.athlete-table-details table').eq(2).children('tbody').children('tr');
		athlete.run = new Array();
		for(var row = 0; row < htmlrun.length; row++){
			var new_value = htmlrun.eq(row).children('td').eq(3).html();
			athlete.run.push(new_value);
			if(verbose) console.log('run ('+row+'): ' + new_value);

			if(new_value.charAt(0) != '-'){
				//console.log(new_value.charAt(0));
				athlete.times.push(new_value);


				//if split has data
				if(new_value.charAt(0) != '-') {
					athlete.times.push(new_value);

					//get full splits
					var brColumns = ["name","distance","split_time","race_time","pace"];
					var split = {};
					var splitName = htmlrun.eq(row).children('td').eq(0).html();

					for (var col = 0; col < brColumns.length; col++) {
						split[brColumns[col]] = htmlrun.eq(row).children('td').eq(col).html();
					}
					//push to splits
					athlete.splits.run.push(split);
				}
			}
		}

		//athletes.push(athlete);
		//console.log(JSON.stringify(athlete));

		fs.writeFile("data/"+athlete.bib+".json", JSON.stringify(athlete), function(err){
			console.log(err);
		});

		return athlete;
};

module.exports = scraper;



/*

// --- Sort results ---
athletes.sort(function(a,b) {
	if(a.times.length < b.times.length) return 1;
	if(b.times.length < a.times.length) return -1;

	if(a.times.length == 0) return 0;

	var asplit = a.times[a.times.length-1].split(':');
	var bsplit = b.times[b.times.length-1].split(':');

	if(asplit[0] > bsplit[0]) return 1;
	if(asplit[0] < bsplit[0]) return -1;

	if(asplit[1] > bsplit[1]) return 1;
	if(asplit[1] < bsplit[1]) return -1;

	if(asplit.length < 3 || bsplit.length < 3) return 0;

	if(asplit[2] > bsplit[2]) return 1;
	if(asplit[2] < bsplit[2]) return -1;

	return 0;
});

// --- Print leaderboard ---
for(var i = 0; i < athletes.length; i++){
	console.log((i+1) + ".) " + athletes[i].name + ", checkpoint: " + athletes[i].splits[athletes[i].times.length] + ", time: " + athletes[i].times[athletes[i].times.length-1]);
}

*/
