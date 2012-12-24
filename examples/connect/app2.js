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

/* Sample usage */
var deferred_listener = require('deferred-listener');
var connect = require('connect');
var app = connect()
  .use(deferred_listener(connect.logger('dev')))
  .use(deferred_listener(connect.static('public')))
  .use(deferred_listener(fetch_file("test.json", "test")))
  .use(deferred_listener(function(req, res){
    res.end('hello world!\n\n' + 'test.foo = ' + req.file.test.foo + "\n" );
  }))
 .listen(3000);
