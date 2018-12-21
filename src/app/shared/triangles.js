/* jshint esversion: 6 */

import Triangle from './triangle';

export default class Triangles {

	constructor(element) {
		const triangles = new Array(20).fill(null).map(() => {
			return new Triangle(element.hasAttribute('white'));
		});
		this.element = element;
		this.triangles = triangles;
		const pool = {};
		triangles.forEach((triangle) => {
			triangle.appendInto(element, pool);
		});
	}

	resize() {
		const element = this.element;
		const pool = {};
		this.triangles.forEach((triangle) => {
			triangle.resize(element, pool);
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
