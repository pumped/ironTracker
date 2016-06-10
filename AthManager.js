
var fs = require("fs");
async = require('async');

var scraper = require('./scraper');
s = new scraper();

function AthManager() {
  this.startFile = "./data/athletes.json";

  this.startTimes = {};

  this.numbers = {
    proMale: [1,20],
    proFemale: [20,39]
  }
  this.proStart = {
    male: "7:30",
    female: "7:35"
  };
  this.agStart = {
    start: "7:45",
    finish: "8:00",
    avg: "7:49"
  };

  this.setup();
}

AthManager.prototype.setup = function() {
  this.load();
};

AthManager.prototype.save = function() {
  fs.writeFile(this.startFile,JSON.stringify(this.startTimes), "utf8");
}

AthManager.prototype.load = function() {
  var that = this;
  fs.readFile(this.startFile, 'utf8', function (err, data) {
    if (err) return; // we'll not consider error handling for now
    that.startTimes = JSON.parse(data);
  });
}

AthManager.prototype.getStartTime = function(bib) {
  //pro male
  if (bib <= this.numbers.proMale[1]) {
    return this.proStart.male;
  }

  //pro female
  if (bib >= this.numbers.proFemale[0] && bib < this.numbers.proFemale[1]) {
    return this.proStart.female;
  }

  //bib set by a user
  if (this.startTimes.hasOwnProperty(bib)) {
    return this.startTimes[bib].startTime;
  }

  //default
  return this.agStart.avg;
}

AthManager.prototype.scrapeData = function(bib, priority, callback) {
  //run a scrape of all athletes in the list
  var start = this.getStartTime(bib, priority);

  console.log("Scraping: " + bib + ", started " + start);
  s.scrape(bib, start, priority, callback);
};

AthManager.prototype.scrapeAll = function() {
  for (var bib in this.startTimes) {
    this.scrapeData(bib, false);
  }
}

AthManager.prototype.addAthlete = function(bib,start,callback) {
  // add to array
  //console.log(bib, start);
  if (this.startTimes.hasOwnProperty(bib)) {
    //console.log("exists");
  } else {
    if (this.start) {
      this.startTimes[bib] = {};
      this.startTimes[bib].startTime = start;

      this.save();
    }
  }

  //check if the file already exists
  var path = "data/"+bib+".json";
  if (!existsSync(path)) {
    //get file
    //console.log("get it")
    this.scrapeData(bib, true, callback);
  } else {
    //console.log("cache exists");
    if (typeof(callback) == "function") {
      callback(null, ["path",path]);
    }
  }
};

function existsSync(filePath){
  try{
    fs.statSync(filePath);
  }catch(err){
    if(err.code == 'ENOENT') return false;
  }
  return true;
};

module.exports = AthManager;
