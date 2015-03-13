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

