var express = require('express');
var app = express();

var scraper = require('./scraper');

app.use(express.static('public'));

app.get('/getData', function (req, res) {
  console.log(req.query.id);
  res.send('{"bib":386,"times":["1:30:19","2:12:54","3:03:39","4:32:12"],"splits":{"swim":[],"bike":[{"name":"18 km","distance":"18 km ","split_time":"35:06","race_time":"2:12:54","speed":"30.77 km/h"},{"name":"43.6 km","distance":"25.6 km ","split_time":"50:45","race_time":"3:03:39","speed":"30.27 km/h"},{"name":"69.2 km","distance":"25.6 km ","split_time":"1:28:33","race_time":"4:32:12","speed":"17.35 km/h"}],"run":[]},"name":"Glen HARKER","swim":"1:30:19","bike":["2:12:54","3:03:39","4:32:12","--:--","--:--","--:--"],"run":["--:--","--:--","--:--","--:--","--:--","--:--","--:--","--:--","--:--","--:--","--:--","--:--","--:--","--:--","--:--","--:--","--:--","--:--"]}');
});


var server = app.listen(9871, function () {

  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);

});

//run scraper

s = new scraper();

function autoScrape() {
	try {
		s.scrape(386);
	}
	catch (e) {

	}
}

autoScrape();

//setInterval(autoScrape(), 1*1000*60);
