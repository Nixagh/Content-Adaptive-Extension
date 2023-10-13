class Modal {
	constructor() {

	}

	static Register(data) {
		if (Modal.Exist(data.name)) return false;

		ModalArgs[data.name] = data;
		return true;
	}

	static Exist(name) {
		if (!ModalArgs.hasOwnProperty(name)) return false;

		return UI.Exist($(`.${ModalArgs[name].cls}`)[0]);
	}

	static async Create(data, innerHtml, rem = false) {
		if (Modal.Exist(data.name)) return false;

		Modal.Register(data);

		let id = data.cls;
		if (data.nid != null) {
			id = data.nid;
		}

		let windowData = {
			id: id,
			cls: data.cls,
			n: data.nx,
			text: data.name,
			html: await Elements.aBuild(data.internal, innerHtml),
			close: data.close
		};

		if (typeof data.minimize !== "undefined") {
			windowData.minimize = data.minimize;
		}

		UI.Append(`${Classes.uiBase}:first`, await Elements.aBuild(data.base, windowData));

		if (data.nid != null) {
			await UI.CloseElementDelegation($(`.${data.nid}`), rem);
		} else {
			await UI.CloseElementDelegation($(`.${data.cls}`), rem);
		}

		return true;
	}
}
