/* jshint esversion: 6 */

export default class Video {

	constructor(node) {
		this.node = node;
	}

	appear() {
		if (!this.visible) {
			this.visible = true;
			this.node.play();
		}
	}

	disappear() {
		if (this.visible) {
			this.visible = false;
			this.node.pause();
		}
	}

}
