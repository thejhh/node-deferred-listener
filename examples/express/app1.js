var express = require('express');
var deferred_listener = require('deferred-listener');
var Q = require('q');
var FS = require('fs');

/* Let's create our middleware */
function fetch_file(file, key) {
	key = key || file;
	var readFile = Q.nfbind(FS.readFile);
	return deferred_listener(function(req, res) {
		return readFile(file, "utf-8").then(function(data) {
			if(!req.file) { req.file = {}; }
			req.file[key] = JSON.parse(data);
		});
	});
}

var app = express();

app.use( fetch_file("test.json", "test") );

app.get('/index.html', function(req, res){
	var body = 'test.foo = ' + req.file.test.foo + "\n";
	res.setHeader('Content-Type', 'text/plain');
	res.setHeader('Content-Length', body.length);
	res.end(body);
});

app.listen(3000);
console.log('Listening on port 3000');
