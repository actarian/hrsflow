/* jshint esversion: 6 */

export default class Dom {

	static fragmentFirstElement(fragment) {
		return Array.prototype.slice.call(fragment.children).find((x) => x.nodeType === Node.ELEMENT_NODE);
	}

	static fragmentFromHTML(html) {
		return document.createRange().createContextualFragment(html);
	}

	static scrollTop() {
		return document && document.defaultView ? document.defaultView.pageYOffset : 0;
		/*
		const pageYOffset = window ? window.pageYOffset : 0;
		const scrollTop = document && document.documentElement ? document.documentElement.scrollTop : 0;
		return pageYOffset || scrollTop;
		// window.scrollY;
		*/
	}

}
