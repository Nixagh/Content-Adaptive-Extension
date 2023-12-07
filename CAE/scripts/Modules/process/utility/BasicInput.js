class BasicInput {
	element;
	constructor(id) {
		this.element = document.getElementById(id);
	}

	setValue(value) {
		this.element.value = value;
	}

	setText(value) {
		this.element.innerText = value;
	}

	getValue() {
		return this.element.value;
	}

	getOptions(index) {
		return this.element.options[index];
	}
}
