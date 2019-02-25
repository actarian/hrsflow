/* jshint esversion: 6 */

import Triangle from './triangle';

export default class Triangles {

	constructor(node) {
		const triangles = new Array(20).fill(null).map(() => {
			return new Triangle(node.hasAttribute('white'));
		});
		this.node = node;
		this.triangles = triangles;
		const pool = {};
		triangles.forEach((triangle) => {
			triangle.appendInto(node, pool);
		});
	}

	resize() {
		const node = this.node;
		const pool = {};
		this.triangles.forEach((triangle) => {
			triangle.resize(node, pool);
			if (this.visible) {
				triangle.appear();
			}
		});
	}

	appear() {
		if (!this.visible) {
			this.visible = true;
			this.triangles.forEach((triangle) => {
				triangle.appear();
			});
		}
	}

	disappear() {
		if (this.visible) {
			this.visible = false;
			this.triangles.forEach((triangle) => {
				triangle.kill();
			});
		}
	}

}
