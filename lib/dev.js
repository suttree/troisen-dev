// Retry connection code from http://stackoverflow.com/questions/4432271/node-js-and-socket-io-how-to-reconnect-as-soon-as-disconnect-happens
const RETRY_INTERVAL = 10000;

var timeout;
var connected = false;

var socket = new io.Socket(null, {                                                                                                                                        
  rememberTransport: true,
  port: 19760,
  transports: ['websocket', 'htmlfile', 'xhr-multipart', 'xhr-polling', 'flashsocket']
});

socket.on('connect', function() {
  console.log('connected');
  connected = true;
  clearTimeout(timeout);
  socket.send({'subscribe': 'schaftenaar'});
});

socket.on('disconnect', function() {
  connected = false;
  console.log("Disconnected! Trying to automatically to reconnect in " + RETRY_INTERVAL/1000 + " seconds.");
  retryConnectOnFailure(RETRY_INTERVAL);
});

var retryConnectOnFailure = function(retryInMilliseconds) {
  setTimeout(function() {
    console.log('checking connection status');
    if (!connected) {
      console.log('trying to connect');
      socket.connect();
      retryConnectOnFailure(retryInMilliseconds);
    }
  }, retryInMilliseconds);
}

window.onload = function() {
  socket.connect();
  retryConnectOnFailure(RETRY_INTERVAL);
} 
