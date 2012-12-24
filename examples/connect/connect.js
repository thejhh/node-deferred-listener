var deferred_listener = require('deferred-listener');
var connect = require('connect');
var app = connect()
  .use(deferred_listener(connect.logger('dev')))
  .use(deferred_listener(connect.static('public')))
  .use(deferred_listener(function(req, res, next){
	
	next();
	
	// Now, let's try to make a bug and call next again
	next();
	
	// ...it doesn't work since calling next() only resolves our promise and 
	// it cannot be triggered twice!
	
  }))
  .use(deferred_listener(function(req, res){
    res.end('hello world!\n');
  }))
 .listen(3000);
