
var Q = require('q');

/** Wrapper to add support for promises into Connect's middleware
 * @param mw Connect-based middleware which isn't (yet) promise
 * @returns Connect middleware which is now also a promise
 */
module.exports = function(orig_mw) {
	if(!(orig_mw && (typeof orig_mw === 'function'))) {
		throw new TypeError("Argument orig_mw is not a function!");
	}
	return function(req, res, next) {
		
		var counter = 0;
		var defer = Q.defer();
		
		var ret = orig_mw(req, res, function(err) {
			if(counter !== 0) {
				console.warn("Warning! requestListener's next() called again! Ignoring it.");
				return;
			}
			if(err) {
				defer.reject(err);
			} else {
				defer.resolve();
			}
			counter += 1;
		});
		
		// Check if the middleware returned a promise that we could use
		if(ret && (typeof ret === 'object') && (typeof ret.then === 'function')) {
			ret.then(function() {
				defer.resolve();
			}, function(err) {
				defer.reject(err);
			});
		}
		
		// Check if we should return a promise
		if(next && (typeof next === 'function')) {
			defer.promise.then(function() {
				next();
			}).fail(function(err) {
				next(err);
			}).done();
		} else {
			return defer.promise;
		}
	};
};

/* EOF */
