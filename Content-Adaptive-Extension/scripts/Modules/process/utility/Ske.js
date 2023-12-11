class Cke {
	element;
	constructor(id) {
		// just add to this.element when loaded
		this.element = document.getElementById(id);
	}

	getIframe() {
		const iframe = $(this.element).find('iframe');

		// wait for iframe to load
		if (iframe.length === 0) {
			iframe.load(() => {
				return iframe[0];
			});
		}
		return iframe[0];
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
