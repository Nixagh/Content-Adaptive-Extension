class Area {

	constructor(id) {
		this.element = document.getElementById(id);
	}

	setValue(value) {
		this.element.value = value;
	}

	show() {
		this.element.style.display = "block";
	}

	parentShow() {
		this.element.parentElement.style.display = "block";
	}
}
