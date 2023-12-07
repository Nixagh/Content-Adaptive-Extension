class Cke {
	element;
	constructor(id) {
		this.element = document.getElementById(id);
	}

	getIframe() {
		return this.element.getElementsByTagName("iframe")[0];
	}

	getDocument() {
		return this.getIframe().contentDocument;
	}

	getBody() {
		return this.getDocument().body;
	}

	setHtml(html) {
		this.getBody().innerHTML = html;
	}
}
