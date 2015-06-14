ironman-leaderboard-scraper
===========================

This little cross-plattform Node.js-script scrapes the athlete tracker from ironman.com in order to generate the leaderboard of a race at each checkpoint. The official website releases this information only when transition zones are reached.

requirements
============
- Node.js, see http://www.nodejs.org
- httpsync and cheerio package

install
=======
- After installing node.js run:
``` 
npm install cheerio
npm install httpsync
```

usage
=====
- Change the race-id in this line, to the id of the race you want to use: 
```
var raceid = 1143240085;
```
- run the command:
```
nodejs scraper.js
```
- The result should look similar to this:
```
1.) Brent McMahon, checkpoint: 27, time: 7:55:48
2.) Clemente Alonso Mckernan, checkpoint: 27, time: 8:00:42
3.) Jordan Rapp, checkpoint: 27, time: 8:03:14
4.) Maik Twelsiek, checkpoint: 27, time: 8:07:59
5.) Tim O&apos;Donnell, checkpoint: 27, time: 8:11:00
6.) Viktor Zyemtsev, checkpoint: 27, time: 8:18:16
7.) Marc Duelsen, checkpoint: 27, time: 8:18:39
8.) Jonathan Shearon, checkpoint: 27, time: 8:20:28
9.) David Kahn, checkpoint: 27, time: 8:22:06
10.) Paul Matthews, checkpoint: 27, time: 8:29:52
11.) Nicholas Ward Munoz, checkpoint: 27, time: 8:33:43
12.) Edo Van Der Meer, checkpoint: 27, time: 8:37:52
13.) Christophe Bastie, checkpoint: 27, time: 8:38:25
14.) Joe Umphenour, checkpoint: 27, time: 8:46:24
15.) Meredith Kessler, checkpoint: 27, time: 8:50:41
16.) Stephan Vuckovic, checkpoint: 27, time: 8:54:48
17.) Lisa Huetthaler, checkpoint: 27, time: 8:58:46
18.) Ryan Rau, checkpoint: 27, time: 8:59:08
19.) Jesse Vondracek, checkpoint: 27, time: 9:04:08
20.) Jared Milam, checkpoint: 27, time: 9:04:22
21.) Heather Jackson, checkpoint: 26, time: 8:55:46
22.) Oliver Simon, checkpoint: 26, time: 8:56:04
23.) Katy Blakemore, checkpoint: 26, time: 8:59:02
24.) Amanda Stevens, checkpoint: 26, time: 9:01:06
25.) Patrick Bless, checkpoint: 26, time: 9:09:04
26.) Patrick Wheeler, checkpoint: 26, time: 9:09:10
27.) Michael Ruenz, checkpoint: 26, time: 9:09:38
28.) Mackenzie Madison, checkpoint: 25, time: 8:59:18
29.) Uli Bromme, checkpoint: 25, time: 9:01:18
30.) Steven Zawaski, checkpoint: 24, time: 8:49:24
```
- As you can see, triathletes are sorted by the number of passed checkpoints first and by their total time second