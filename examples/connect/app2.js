var connect = require('connect');
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

/* Sample usage */
var app = connect()
  .use(connect.logger('dev'))
  .use(connect.static('public'))
  .use(fetch_file("test.json", "test"))
  .use(function(req, res){
    res.end('hello world!\n\n' + 'test.foo = ' + req.file.test.foo + "\n" );
  })
 .listen(3000);
