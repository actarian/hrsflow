/* jshint esversion: 6 */

export default class Video {

	constructor(node) {
		this.node = node;
		this.addListeners();
	}

	addListeners() {
		const click = () => {
			if (!this.paused) {
				this.paused = true;
				this.disappear();
				this.node.parentNode.classList.add('onpause');
				setTimeout(() => {
					this.node.parentNode.classList.remove('onpause');
				}, 1500);
			} else {
				this.paused = false;
				this.appear();
				this.node.parentNode.classList.add('onplay');
				setTimeout(() => {
					this.node.parentNode.classList.remove('onplay');
				}, 1500);
			}
		};
		this.node.addEventListener('click', click);
	}

	appear() {
		if (!this.visible && !this.paused) {
			this.visible = true;
			this.node.play();
		}
	}

	disappear() {
		if (this.visible) {
			this.visible = false;
			console.log(this.node);
			this.node.pause();
			console.log('video.disappear');
		}
	}

}
