# freezing-octo-hipster

### AJAX Not Blocking

```javascript
// non-blocking io
$.post('/resource.json', function(data){
	console.log(data);
});
// blocking io
var data = $.post('/resource.json');
console.log(data);
```
- common use of node is to build servers, but unlike PHP apps where they are hosted on an Apache HTTP Server, in Node the server and the application are the same.

#### HTTP Server that responds with “Hello World"
```javascript
// Hello World HTTP server
var http = require('http');
http.createServer(function(req, res) {
     res.writeHead(200, {'Content-Type': 'text/plain'});
     res.end('Hello World\n');
}).listen(3000);
console.log('Server running at http://localhost:3000/');
```
```javascript
var http = require('http');
var server = http.createServer();
server.on('request', function(req, res){
	res.writeHead(200, {'Content-Type': 'text/plain'});
	res.end('Hello World\n');
})
server.listen(3000);
console.log("Server running at http://localhost:3000/");
```

#### Streaming Data
```javascript
var fs = require('fs');
var stream = fs.createReadStream('./resource.json');
stream.on('data', function(chunk){
	console.log(chunk);
});

stream.on('end', function() {
	console.log("finished");
});
```
```javascript
// piping-example1.js
var http = require('http');
var fs = require('fs');
http.createServer(function(req, res) {
	res.writeHead(200, {'Content-Type': 'image/png'});
	fs.createReadStream('./image.png').pipe(res);
}).listen(3000);
console.log('Server running at http://localhost:3000/');
```
- The Node convention for asynchronous callbacks
```javascript
var fs = require('fs');
fs.readFile('./file-name.json', function(err, data) {
	if (err) throw err;
	// do something with data
});
```

- Custom Event Listener
```javascript
var EventEmitter = require('events').EventEmitter;
var channel = new EventEmitter();
channel.on('join', function() {
	console.log("Welcome!");
});

// to emit event join
channel.emit('join');
// event names can be any string value: data, join, or some crazy long name
```

#### HTTP server
- http module is used
```javascript
var http = require('http');
```
- To create an http server, call the http.createServer() function. Accepts a single argument, a callback function.
- This request callback receives, as arguments, the request and response objects.(req, res)
```javascript
var http = require('http');
var server = http.createServer(function(req, res) {
	// handle request
});
```
- it's your reponsibility to end the response using the res.end() method.
- If you forget to end the reponse, the request will hang until the client times out or it will just remain open.