var socket = new io.Socket('dev.troisen.com', {
  port: 1977,
  reconnect: true,
  reconnectionDelay: 500,
  rememberTransport: false,
  maxReconnectionAttempts: 50,
  transports: ['websocket', 'htmlfile', 'xhr-multipart', 'xhr-polling', 'flashsocket'],
});

socket.on('connect', function() {
  log("You connected!");

  $('body').css("background-image", "url(/images/bg/connected.jpg)");
});

socket.on('connect_failed', function () {
  log("Connect failed at " + new Date().getTime() + "<br/><br/>" + socket.reconnectionAttempts + "--" + socket.reconnectionDelay);
  socket.reconnectionDelay = socket.reconnectionDelay / 2;
  log("And now -- " + socket.reconnectionDelay);
});

socket.on('disconnect', function() {
  log("You disconnected!");
  socket.reconnectionDelay = socket.reconnectionDelay / 2;
  log("Reconnect delay is... " + socket.reconnectionDelay);

  $('body').css("background-image", "url(/images/bg/disconnected.jpg)");  
});

socket.on('reconnect', function(evt) {
  log("Reconnected at " + new Date().getTime());
  log("Reconect method is " + JSON.stringify(evt));

  log("Reconnect delay is currently... " + socket.reconnectionDelay);
  socket.reconnectionDelay = socket.reconnectionDelay / 2;
  log("Reconnect delay is now... " + socket.reconnectionDelay);

  $('body').css("background-image", "url(/images/bg/connected.jpg)");  
});

socket.on('reconnecting', function(evt) {
  log("Reconnecting at " + new Date().getTime());
  log("Reconnecting " + JSON.stringify(evt));
});

socket.on('reconnect_failed', function() {
  log("Reconnect failed at " + new Date().getTime());
});

socket.on('message', function(evt) {
  //log("Received " + evt);
  $('#log').html(evt);
});

socket.on('error', function() {
  log("Error received");
});

function log(message) {
  console.log(message);
  $('#log').html(message);
}

function block_move(event) {
  event.preventDefault(); // Tell Safari not to move the window.
}

window.onload = function() {
  socket.connect();
} 
