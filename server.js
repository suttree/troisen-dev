var sys = require("sys"),
    fs = require("fs"),
    path = require("path"),
    http = require("http"),
    io = require('socket.io');

var pidfile = fs.openSync("/var/tmp/node-dev.pid", "w");
fs.writeSync(pidfile, process.pid + "");
fs.closeSync(pidfile);

var nlog = require(__dirname + '/lib/logging');

function log(message) {    
  nlog.updateAccessLog(message);    
} 

server = http.createServer(function(req, res){
  res.writeHead(200, {'Content-Type': 'text/html'});
  res.write('<h1>dev.troisen.com</h1>');
  res.end();
});

var socket = io.listen(server);

socket.on('connection', function(client) {
  log("<"+client.sessionId+"> connected");

  client.on('message', function(evt) {
    client.broadcast('pong');
  })

  client.on('disconnect', function() {
  })
});

server.listen(19760, "173.45.236.98");
