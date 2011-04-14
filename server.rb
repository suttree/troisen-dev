#!/usr/bin/env ruby

# EM docs - http://eventmachine.rubyforge.org/EventMachine/Connection.html#M000287

require 'rubygems'
require 'eventmachine'
require 'time'

module ChatClient
  def self.list
    @list ||= []
  end

  def self.ping_clients
    ChatClient.list.each do |c| 
      puts "-- sending ping to #{c.object_id}"
      c.send_data 'ping'
    end
    puts "-- sending ping to #{ChatClient.list.size} clients"
  end

  def post_init
    #@timer = EM::PeriodicTimer.new(0.1) {
    #  send_data "Hello from TestServer at #{Time.now.iso8601}\n"
    #}

    @name = "anonymous_#{rand(99999)}"
    puts "-- #{@name} connected to the chat server!"

    ChatClient.list.each{ |c| c.send_data "#{@name} has joined.\n" }
    ChatClient.list << self
  end

  def receive_data data
    (@buf ||= '') << data
    puts "-- received data: #{@buf}"

    while line = @buf.slice!(/(.+)\r?\n/)
      if line =~ %r|^/nick (.+)|
        new_name = $1.strip
        (ChatClient.list - [self]).each{ |c| c.send_data "#{@name} is now known as #{new_name}\n" }
        @name = new_name
      elsif line =~ %r|^/quit|
        close_connection
      else
        # echo just to test
        send_data "#{@name}: #{line}"
        (ChatClient.list - [self]).each{ |c| c.send_data "#{@name}: #{line}" }
      end
    end
  end

  def unbind
    puts "-- #{@name} disconnected from the echo server!"
    ChatClient.list.delete self
    ChatClient.list.each{ |c| c.send_data "#{@name} has left.\n" }
  end
end

EventMachine::run {
  EventMachine::start_server "dev.troisen.com", 1977, ChatClient
  #EventMachine::add_periodic_timer( 5 ) { ChatClient.ping_clients }
  puts 'running chat server 1977'
}




#module TestServer
#  def post_init
#    puts "-- client connected --"
#    @timer = EM::PeriodicTimer.new(0.1) {
#      send_data "Hello from TestServer at #{Time.now.iso8601}\n"
#    }
#  end
#end
#
#EventMachine::run {
#  EventMachine::start_server "dev.troisen.com", 1977, TestServer
#  puts 'running test server on 1977'
#}
#
