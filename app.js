var s = require('node-static');
var http = require('http');
var file = new(s.Server)();
const PORT = process.env.PORT || 3000;

console.log("server running on port " + PORT);
var app = http.createServer(function (req, res) {
  file.serve(req, res);
}).listen(PORT);