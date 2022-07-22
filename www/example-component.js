// import * as Lit from './lit.js';
import { ifDefined } from '../directives.js';

const { html, LitElement } = Lit;

class ExampleComponent extends LitElement{
	static get properties() {
		return {
			flag: { type: Boolean, reflect: true },
			title: { type: String, reflect: true },
		};
	}

	constructor() {
		super();
		this.flag = false;
		this.title = '';
		this.world = 'world';
		this.count = 1;
	}

	get hello() {
		return this.world;
	}

	add(n = 1) {
		if (typeof n !== 'number') {
			n = Number(n);
		}
		if (isNaN(n)) {
			n = 0;
		}
		this.count += n;
		return this.count;
	}

	_click(event) {
		this.flag = !this.flag;
	}

	render() {
		return html`
			<h1
				?flag=${this.flag}
				title=${ifDefined(this.title ? this.title : undefined)}
				@click=${this._click}
				style="font-size:5rem;text-shadow:0 0 1px black;cursor:pointer;"
			>
				<sub style="font-size:0.3em;">🖱👆🏽</sub>
				${this.flag ? '⛳️ flagged' : '🏴‍☠️	unflagged'}
			</h1>
			<slot>...</slot>
		`;
	}
}

customElements.define('example-component', ExampleComponent);
