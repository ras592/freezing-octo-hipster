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