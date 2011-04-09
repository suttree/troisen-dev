require 'socket'

server = TCPServer.new('dev.troisen.com', '1977')
socket = server.accept
line = socket.readline
socket.puts line
puts line
