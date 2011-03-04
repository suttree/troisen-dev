// Retry connection code from http://stackoverflow.com/questions/4432271/node-js-and-socket-io-how-to-reconnect-as-soon-as-disconnect-happens
const RETRY_INTERVAL = 10000;

var timeout;
var connected = false;

var socket = new io.Socket('dev.troisen.com', {
  rememberTransport: false,
  port: 1977,
  transports: ['websocket', 'htmlfile', 'xhr-multipart', 'xhr-polling', 'flashsocket'],
  origins: '*:*'
});

socket.on('connect', function() {
  connected = true;
  clearTimeout(timeout);
  log('You connected');
  socket.send({'subscribe': 'schaftenaar'});
});

socket.on('disconnect', function() {
  log("You disconnected! Trying to automatically to reconnect in " + RETRY_INTERVAL/1000 + " seconds.");
  connected = false;
  retryConnectOnFailure(RETRY_INTERVAL);
});

var retryConnectOnFailure = function(retryInMilliseconds) {
  setTimeout(function() {
    log('Checking your connection status');
    if (!connected) {
      log('Trying to connect');
      socket.connect();
      retryConnectOnFailure(retryInMilliseconds);
    } else {
      log('Connection held');
    }
  }, retryInMilliseconds);
}

window.onload = function() {
  socket.connect();
  retryConnectOnFailure(RETRY_INTERVAL);
} 

function log(message) {
  console.log(message);
  $('#log').html(message);
}
