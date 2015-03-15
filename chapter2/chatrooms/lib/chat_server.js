var socketio = require('socket.io');
var io;
var guestNumber = 1;
var nickNames = {};
var namesUsed = [];
var currentRoom = {};

exports.listen = function(server) {
	// start socket.io server, allowing it to piggyback on existing HTTP server
	io = socketio.listen(server);

	io.set('log level', 1);

	// define how each user connection will be handled
	io.sockets.on('connection', function(socket) { 
		// assign user a guest name when they connect
		guestNumber = assignGuestName(socket, guestNumber, nickNames, namesUsed);

		// place user in Lobby room when they connect
		joinRoom(socket, 'Lobby');

		// handle user messages, name change attemps, and room creation/changes
		handleMessageBroadcasting(socket, nickNames);
		handleNameChangeAttempts(socket, nickNames, namesUsed);
		handleRoomJoining(socket);

		// provide user with list of occupied rooms on request
		socket.on('rooms', function() {
			socket.emit('rooms', io.sockets.manager.rooms);
		});

		// Define cleanup logic for when user disconnects
		handleClientDisconnection(socket, nickNames, namesUsed);
	});
};

function assignGuestName(socket, guestNumber, nickNames, namesUsed) {
	var name = "Guest" + guestNumber; // generate new guest name
	nickNames[socket.id] = name; // associate guest name with client connection id
	socket.emit('nameResult', { // let the user know their guest name
		success: true,
		name: name
	});
	namesUsed.push(name); // note that guest name is now used
	return guestNumber + 1; // increment counter
}

function joinRoom(socket, room) {
	socket.join(room); // make user join room
	currentRoom[socket.id] = room; // note this user is now in this room
	// Let the user know they're now in the room
	socket.emit('joinResult', {room: room});
	// let other users know that user has joined
	socket.broadcast.to(room).emit('message', {
		text: nickNames[socket.id] + ' has joined ' + room + ': '
	});

	var usersInRoom = io.sockets.clients(room); // determine what other users are in the same room as user
	if(usersInRoom > 1) {
		var usersInRoomSummary = 'Users currently in ' + room + ': ';
		for (var index in usersInRoom) {
			var userSocketId = usersInRoom[index].id;
			if(userSocketId != socket.id) {
				if(index > 0) {
					usersInRoomSummary += ', ';
				}
				usersInRoomSummary += nickNames[userSocketId];
			}
		}
		usersInRoomSummary += '.';
		socket.emit('message', {text: usersInRoomSummary})
	}
}

function handleNameChangeAttempts(socket, nickNames, namesUsed) {
	socket.on('nameAttempt', function(name) {
		if(name.indexOf('Guest') == -1) {
			socket.emit('nameResult', {
				success: false,
				message: 'Names cannot begin with "Guest".'
			});
		} else {
			if(namesUsed.indexOf(name) == -1) {
				var previousName = nickNames[socket.id];
				var previousNameIndex = namesUsed.indexOf(previousName);
				namesUsed.push(name);
				nickNames[socket.id] = name;
				delete namesUsedp[previousNameIndex]; // remove previous name to make available to other clients
				socket.emit('nameResult', {
					success: true,
					name: name
				});
				socket.broadcast.to(currentRoom[socket.id]).emit('message', {
					text: previousName + ' is now known as ' + name + '.'
				});
			} else {
				socket.emit('nameResult', {
					success: false,
					message: 'That name is already in use.'
				});
			}
		}
	});
}

function handleMessageBroadcasting(socket) {
	socket.on('message', function(message) {
		socket.broadcast.to(message.room).emit('message', {
			text: nickNames[socket.id] + ': ' + message.text
		});
	});
}

function handleRoomJoining(socket) {
	socket.on('join', function(room) {
		socket.leave(currentRoom[socket.id]);
		joinRoom(socket, room.newRoom);
	});
}

function handleClientDisconnection(socket) {
	socket.on('disconnect', function() {
		var nameIndex = namesUsed.indexOf(nickNames[socket.id]);
		delete namesUsed[nameIndex];
		delete nickNames[socket.id];
	});
}