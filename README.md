node-deferred-listener
======================

Extends Node.js requestListeners with deferred promise support.

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

Example usage with Connect framework
------------------------------------

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
