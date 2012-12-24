node-deferred-listener
======================

Extends Node.js requestListeners with [q's deferred promise support](http://documentup.com/kriskowal/q/).

With this library you can turn any listener function that's 
`function(req, res[, next)` into promise capable and still keep it 
working the same way.

You can use it with various frameworks and libraries:

* [http](http://nodejs.org/api/http.html#http_http_createserver_requestlistener)
* [Connect](http://www.senchalabs.org/connect/)
* [Express](http://expressjs.com/)
* [restify](http://mcavage.github.com/node-restify/)

License
-------

It's open source, MIT.

Installation
------------

You can install it simply from NPM:

	npm install deferred-listener

Example how to turn existing Connect middlewares to support promises
--------------------------------------------------------------------

```javascript
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
```

Example how to build Connect middlewares with promises
------------------------------------------------------

`deferred_listener()` can be used also when building your own new 
middleware.

Let's build a simple middleware that fetches some data from the 
filesystem and parses it to `req.file`.

Look, no `next()`!

```javascript
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
```

...and here's how to use it:

```javascript
var app = connect()
  .use(connect.logger('dev'))
  .use(connect.static('public'))
  .use(fetch_file("test.json", "test"))
  .use(function(req, res){
    res.end('hello world!\n\n' + 'test.foo = ' + req.file.test.foo + "\n" );
  })
 .listen(3000);
```

Reference
---------

### `deferred_listener(requestListener)`

The `requestListener` is a function in format `function(request, 
response[, next])`. It's common format for various different Node.js 
middlewares.

The `next` is an optional function in format `function([err])`.

`deferred_listener()` returns a wrapper function to `requestListener`. 

Returned function acts just like the original function but has 
additional support for promises. It can still be called with the `next` 
callback but instead of calling the original callback directly it will 
only reject or resolve single promise and call the original `next` only 
once. However when called without a `next` callback only a promise will 
be returned.

