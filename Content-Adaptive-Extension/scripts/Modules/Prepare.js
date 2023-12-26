const url = window.location.href;
class Prepare {
	constructor() {
		this.explore = `http://192.168.200.26:8090/cms/product/explore.html`;
	}

	init() {
		Prepare.initUIBase();
		Prepare.initLayout();
		Prepare.initMainMenu();
		// Prepare.initScript();
		Prepare.initProcess();

		if (url.includes(this.explore)) Prepare.getCodeAction();
	}

	static initUIBase() {
		const uiBaseKey = "uiBase";
		const uiBaseData = {
			type: "uiBase",
			cls: "uiBase",
			value: "UI Base",
			innerHTML: ``,
		}
		const uiBase = Elements.Build(uiBaseKey, uiBaseData);
		UI.Append($(`body`), uiBase);
	}

	static initLayout() {
		const layoutKey = "layout";
		const layout = Elements.Build(layoutKey, null);
		UI.Append(`${Classes.uiBase}`, layout);
	}

	static initMainMenu() {
		const mainMenuKey = "mainMenu";
		const mainMenuData = {
			type: "mainMenu",
			cls: "mainMenu",
			value: "Main Menu",
			innerHTML: ``,
		}
		const mainMenu = Elements.Build(mainMenuKey, mainMenuData);
		UI.Append(`.${Classes.layout}`, mainMenu);
	}

	static initScript() {
		const src = 'https://unpkg.com/read-excel-file@4.1.0/bundle/read-excel-file.min.js';
		const script = `<script src="${src}"></script>`;
		UI.Append(`${Classes.uiBase}`, script);
	}

	static initProcess() {
		currentProgram = Storage.Get("CurrentProgram");
		GProcess = getProcess();
	}

	static getCodeAction() {
		const panels = document.querySelectorAll('.panel.panel-default');
		for (let _ of panels) _.onclick = () => Prepare.eventOnUnit(_);
	}

	static eventOnUnit(panel) {
		const as = panel.querySelectorAll('a[data-original-title="View Question Pool"]');
		for (let _ of as) _.onclick = () => Prepare.setCode2Storage(_);
	}

	static setCode2Storage(element) {
		const parent = element.parentElement.parentElement.parentElement; // tr
		const code = parent.cells[1].innerText

		// save to local storage
		Storage.Set("CurrentResourceCode", code);
	}
}
