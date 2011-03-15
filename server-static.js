var sys = require("sys"),
    fs = require("fs"),
    path = require("path"),
    http = require("http"),
    io = require('socket.io'),
    static = require('node-static');

var pidfile = fs.openSync("/var/tmp/node-dev.pid", "w");
fs.writeSync(pidfile, process.pid + "");
fs.closeSync(pidfile);

var nlog = require(__dirname + '/lib/logging');

function log(message) {
  nlog.updateAccessLog(message);
}

var file = new(static.Server);

server = http.createServer(function(request, response){ 
  request.addListener('end', function () {
    file.serve(request, response);
  });
});

var socket = io.listen(server);

socket.on('connection', function(client) {
  log("<"+client.sessionId+"> connected");
  client.send('hi');

  var timeout = setInterval(function() {
    log("<"+client.sessionId+"> sending ping");
    client.send('ping at ' + new Date().getTime());
  }, 1000);

  client.on('message', function(evt) {
    log("<"+client.sessionId+"> " + JSON.stringify(evt));
    client.broadcast('hi2');
  })

  client.on('disconnect', function() {
    log("closed connection: " + client.sessionId);
    clearTimeout(timeout);
    client.broadcast('bye');
  }) 
});

server.listen(80, '173.45.236.98');
