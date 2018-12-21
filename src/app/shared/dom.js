/* jshint esversion: 6 */

export default class Dom {

	static fragmentFirstElement(fragment) {
		return Array.prototype.slice.call(fragment.children).find((x) => x.nodeType === Node.ELEMENT_NODE);
	}

	static fragmentFromHTML(html) {
		return document.createRange().createContextualFragment(html);
	}

	static hasClass(element, name) {
		return element && new RegExp(`(?:^|\\s+)${name}(?:\\s+|$)`).test(element.className);
	}

	static addClass(element, name) {
		if (element && !Dom.hasClass(element, name)) {
			element.className = element.className ? (`${element.className} ${name}`) : name;
		}
		return Dom;
	}

	static removeClass(element, name) {
		if (element && Dom.hasClass(element, name)) {
			element.className = element.className.split(name).join(``).replace(/\s\s+/g, ` `); // .replace(new RegExp('(?:^|\\s+)' + name + '(?:\\s+|$)', 'g'), '');
		}
		return Dom;
	}

	static scrollTop() {
		const pageYOffset = window ? window.pageXOffset : 0;
		const scrollTop = document && document.documentElement ? document.documentElement.scrollTop : 0;
		return pageYOffset || scrollTop;
	}

}
