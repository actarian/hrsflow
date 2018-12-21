/* jshint esversion: 6 */

export default class Dom {

	static detect(node) {
		const userAgent = navigator.userAgent.toLowerCase();
		const explorer = userAgent.indexOf('msie') > -1;
		const firefox = userAgent.indexOf('firefox') > -1;
		const opera = userAgent.toLowerCase().indexOf('op') > -1;
		let chrome = userAgent.indexOf('chrome') > -1;
		let safari = userAgent.indexOf('safari') > -1;
		if ((chrome) && (safari)) { safari = false; }
		if ((chrome) && (opera)) { chrome = false; }
		const overscroll = navigator.platform === 'MacIntel' && typeof navigator.getBattery === 'function';
		const classList = {
			chrome,
			explorer,
			firefox,
			safari,
			opera,
			overscroll,
		};
		Object.assign(Dom, classList);
		Object.keys(classList).forEach(x => {
			if (classList[x]) {
				node.classList.add(x);
			}
		});
		const onTouchStart = () => {
			document.removeEventListener('touchstart', onTouchStart);
			Dom.touch = true;
			node.classList.add('touch');
		};
		document.addEventListener('touchstart', onTouchStart);
		const onMouseDown = () => {
			document.removeEventListener('mousedown', onMouseDown);
			Dom.mouse = true;
			node.classList.add('mouse');
		};
		document.addEventListener('mousedown', onMouseDown);
	}

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
