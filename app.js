var fs = require('fs');
var path = require('path');
var https = require('https');
var express = require('express');
var app = express();

var Athletes = require('./AthManager');
var athletes = new Athletes();

// --- SSL Certificates/Keys --- ///
var privateKey = fs.readFileSync( 'ssl/server.key' );
var certificate = fs.readFileSync( 'ssl/wheresmyathlete_com.crt' );
var caBundle = fs.readFileSync('ssl/wheresmyathlete_com.ca-bundle', 'utf8');

// --- SSL Server --- //
https.createServer({
    key: privateKey,
    cert: certificate,
    ca: caBundle
}, app).listen(443);
app.use(express.static('public'));

// -- get data request -- //
app.get('/getData', function (req, res) {
  var query = req.query;

  //Validate the fuck out of user input
  if (query) {
    if (query.hasOwnProperty("ath")) {
      var bib = Number(query.ath);
      var start = null;
      if (query.hasOwnProperty("start")) {
        var start = formatTime(query.start);
      }



      if (bib < 1 || bib > 5000 || start==false) {
        res.send("Invalid Request");
        return;
      }

      async.series([
        function(callback) {
          var filePath = athletes.addAthlete(bib,start,function(err,filePath){
            callback(err,filePath);
          });
        }
      ],function(err,results) {
        if (err) {
            res.status(500).send("Server Error")
            return;
        }

        var data = results[0];
        if (data[0] == "path") {
          var filePath = data[1];
          res.sendFile(filePath, { root: path.join(__dirname) });
          return;
        } else if (data[0] == "data") {
          res.send(data[1]);
          return;
        }

        res.status(500).send("Server Error")
      });
    }
  }
  //res.send("Invalid Request");
  //res.send('{"bib":386,"times":["1:30:19","2:12:54","3:03:39","4:32:12"],"splits":{"swim":[],"bike":[{"name":"18 km","distance":"18 km ","split_time":"35:06","race_time":"2:12:54","speed":"30.77 km/h"},{"name":"43.6 km","distance":"25.6 km ","split_time":"50:45","race_time":"3:03:39","speed":"30.27 km/h"},{"name":"69.2 km","distance":"25.6 km ","split_time":"1:28:33","race_time":"4:32:12","speed":"17.35 km/h"}],"run":[]},"name":"Glen HARKER","swim":"1:30:19","bike":["2:12:54","3:03:39","4:32:12","--:--","--:--","--:--"],"run":["--:--","--:--","--:--","--:--","--:--","--:--","--:--","--:--","--:--","--:--","--:--","--:--","--:--","--:--","--:--","--:--","--:--","--:--"]}');
});

app.get('/scrape', function (req, res) {
  athletes.scrapeAll();
  res.send("scraped");
});

// --- redirect server --- //
var http = require('http');
http.createServer(function (req, res) {
    res.writeHead(301, { "Location": "https://" + req.headers['host'] + req.url });
    res.end();
}).listen(80);








// validate time formatting
function formatTime(time) {
    var result = false, m;
    var re = /^\s*([01]?\d|2[0-3]):?([0-5]\d)\s*$/;
    if ((m = time.match(re))) {
        result = (m[1].length === 2 ? "" : "0") + m[1] + ":" + m[2];
    }
    return result;
}



// function autoScrape() {
// 	try {
// 		/*s.scrape(658);
//     s.scrape(819);
//     s.scrape(901);
//     s.scrape(554);
//     s.scrape(857);
//     s.scrape(812);*/
// 	}
// 	catch (e) {
//
// 	}
// }
//
// autoScrape();

setInterval(function() {
  athletes.scrapeAll();
}, 10*(60*1000)); // minutes
