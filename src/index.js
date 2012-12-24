
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
		
		var defer = Q.defer();
		orig_mw(req, res, function(err) {
			if(err) {
				defer.reject(err);
			} else {
				defer.resolve();
			}
		});
		
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
