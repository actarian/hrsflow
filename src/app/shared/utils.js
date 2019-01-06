/* jshint esversion: 6 */
/* global window, document */

export default class Utils {

	static now() {
		return Date.now ? Date.now() : new Date().getTime();
	}

	static throttle(callback, wait, options) {
		let context = null,
			result = null,
			args = null,
			timeout = null;
		let previous = 0;
		if (!options) {
			options = {};
		}
		const later = () => {
			previous = options.leading === false ? 0 : Utils.now();
			timeout = null;
			result = callback.apply(context, args);
			if (!timeout) {
				context = args = null;
			}
		};
		return function() {
			context = this;
			args = arguments;
			const now = Utils.now();
			if (!previous && options.leading === false) {
				previous = now;
			}
			const remaining = wait - (now - previous);
			if (remaining <= 0 || remaining > wait) {
				if (timeout) {
					clearTimeout(timeout);
					timeout = null;
				}
				previous = now;
				result = callback.apply(context, args);
				if (!timeout) {
					context = args = null;
				}
			} else if (!timeout && options.trailing !== false) {
				timeout = setTimeout(later, remaining);
			}
			return result;
		};
	}

}