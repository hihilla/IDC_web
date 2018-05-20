var http = require("http");
var url = require('url');
var fs = require('fs'); // read write files

http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/html'});
  var q = url.parse(req.url, true).query;
  var txt = q.year + " " + q.month;
  res.end(txt);
}).listen(8080);

// Console will print the message
console.log('Server running at http://127.0.0.1:8080/');

// http://localhost:8080/?year=2017&month=July -> 2017 July