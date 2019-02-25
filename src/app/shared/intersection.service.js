/* jshint esversion: 6 */

export default class IntersectionService {

	constructor(options) {
		this.prevRatio = 0;
		this.numSteps = 20;
		this.elements = [];
		this.callbacks = [];
		this.observer = this.getObserver();
		this.increasingColor = "rgba(40, 40, 190, ratio)";
		this.decreasingColor = "rgba(190, 40, 40, ratio)";
		// this.element = document.querySelector("#element");
		// this.observer.observe(this.element);
	}

	getObserver() {
		const options = {
			root: null,
			rootMargin: '0px',
			threshold: this.getThreshold()
		};
		const observer = new IntersectionObserver((entries, observer) => {
			this.onIntersectionObserver(entries, observer);
		}, options);
		return observer;
	}

	getThreshold() {
		const thresholds = [];
		for (let i = 1; i <= this.numSteps; i++) {
			const ratio = i / this.numSteps;
			thresholds.push(ratio);
		}
		thresholds.push(0);
		return thresholds;
	}

	observe(element, callback) {
		this.elements.push(element);
		this.callbacks.push(callback);
		this.observer.observe(element);
	}

	onIntersectionObserver(entries, observer) {
		entries.forEach((entry, i) => {
			const callback = this.callbacks[this.elements.indexOf(entry.target)];
			if (typeof callback === 'function') {
				callback(entry, i);
			}
		});
	}
}
