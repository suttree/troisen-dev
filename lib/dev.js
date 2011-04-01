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
  $('#status').html(connected_icon());
});

socket.on('connect_failed', function () {
  socket.reconnectionDelay = socket.reconnectionDelay / 2;

  $('#status').html(disconnected_icon());
});

socket.on('disconnect', function() {
  log("Disconnected!");
  socket.reconnectionDelay = socket.reconnectionDelay / 2;

  $('body').css("background-image", "url(/images/bg/disconnected.jpg)");  
  $('#status').html(disconnected_icon());
});

socket.on('reconnect', function(evt) {
  log("Reconnected at " + new Date().getTime());

  socket.reconnectionDelay = socket.reconnectionDelay / 2;

  $('body').css("background-image", "url(/images/bg/connected.jpg)");  
  $('#status').html(connected_icon());
});

socket.on('reconnecting', function(evt) {
  log("Reconnecting at " + new Date().getTime());

  $('#status').html(reconnecting_icon());
});

socket.on('reconnect_failed', function() {
  log("Reconnect failed at " + new Date().getTime());

  $('#status').html(disconnected_icon());
});

socket.on('message', function(evt) {
  $('#log').html(evt);
});

socket.on('error', function() {
  log("Error received");
});

function log(message) {
  console.log(message);
  $('#log').html(message + "&nbsp;" + ajax_loader_icon());
}

function block_move(event) {
  event.preventDefault(); // Tell Safari not to move the window.
}

window.onload = function() {
  socket.connect();
} 

function ajax_loader_icon() {
  return "<img src='/images/ajax-loader.gif' height='16' width='16' id='spinner' />"
}

function connected_icon() {
  return "<img src='/images/icons/switch-network.png' height='16' width='16' id='status' />"
}

function reconnecting_icon() {
  return "<img src='/images/icons/switch--arrow.png' height='16' width='16' id='status' />"
}

function disconnected_icon() {
  return "<img src='/images/icons/switch--minus.png' height='16' width='16' id='status' />"
}
