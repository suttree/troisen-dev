var socket = new io.Socket('dev.troisen.com', {
  rememberTransport: false,
  port: 1977,
  transports: ['websocket', 'htmlfile', 'xhr-multipart', 'xhr-polling', 'flashsocket'],
  reconnect: true,
  reconnectionDelay: 500,
  maxReconnectionAttempts: 100,
});

socket.on('connect', function() {
  log("You connected!");
  socket.send({'subscribe': 'troisen'});
});

socket.on('connect_failed', function () {
  log("Connect failed at " + new Date().getTime());
});

socket.on('disconnect', function() {
  log("You disconnected! Will this try to reconnect automatically?");
});

socket.on('reconnect', function(evt) {
  log("Reconnected at " + new Date().getTime());
  log(JSON.stringify(evt));
  socket.send({'subscribe': 'troisen_reconnect'});
});

socket.on('reconnecting', function(evt) {
  log("Reconnecting at " + new Date().getTime());
  log(JSON.stringify(evt));
});

socket.on('reconnect_failed', function() {
  log("Reconnect failed at " + new Date().getTime());
});

socket.on('message', function(evt) {
    log("Received " + evt);
    $('#status').html(evt);
});

socket.on('error', function() {
  log("Error received");
});

window.onload = function() {
  socket.connect();
} 

function log(message) {
  console.log(message);
  $('#log').html(message);
}
