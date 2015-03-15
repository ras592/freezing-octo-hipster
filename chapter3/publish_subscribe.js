var events = require('events');
var net = require('net');

var channel = new events.EventEmitter();
channel.clients = {};
channel.subscriptions = {};

channel.on('join', function(id, client) {
	this.clients[id] = client; // add a listener for the join event that stores a users client object, allowing the application to send data backt to the user
	this.subscriptions[id] = function(senderId, message) {
		if(id != senderId) { // ignore data if it's been directly broadcast by the user
			this.clients[id].write(message);
		}
	}
	this.on('broadcast', this.subscriptions[id]); // add a listener, specific to the current user, for the broadcast event
});

var server = net.createServer(function(client) {
	var id = client.remoteAddress + ':' + client.remotePort;
	client.on('connect', function() {
		channel.emit('join', id, client); // emit a join event when a user connects to the server, specifying the user id and client object
	});
	client.on('data', function(data) {
		data = data.toString();
		channel.emit('broadcast', id, data); // emit a channel broadcast event, specifying the user id and message, when any user sends data
	});
});
server.listen(8888);