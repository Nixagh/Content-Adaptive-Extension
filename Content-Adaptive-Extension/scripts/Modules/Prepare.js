class Prepare {
	init() {
		Prepare.initUIBase();
		Prepare.initLayout();
		Prepare.initMainMenu();
		// Prepare.initScript();
		// Prepare.getCodeAction();
		Prepare.initProcess();
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
		const parent = `#tableList`;
		UI.Delegate(parent, "click", `.tip-top`, Prepare.getCode, this);

		// const explores = $(`.tip-top`);
		// // when click on explore
		// explores.forEach((explore) => {
		// 	explore.addEventListener("click", () => {
		// 		// get parent of parent
		// 		const parent = explore.parentElement.parentElement;
		// 		// get second td child
		// 		const td = parent.children[1];
		// 		// get code
		// 		const code = td.innerText;
		// 		console.log(code);
		// 	});
		// });
	}

	static getCode(element) {
		const parent = element.parentElement.parentElement;
		// get second td child
		const td = parent.children[1];
		// get code
		const code = td.innerText;
		console.log(code);
	}
}
