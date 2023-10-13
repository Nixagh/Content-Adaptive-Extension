class Option {
	init() {
		Option.initButton();
		Option.initOptionsModal().then();
		// Option.initFastInsertButton();
	}

	static initButton() {
		const optionsButtonKey = "optionsButton";
		const optionsButtonData = {
			type: "optionsButton",
			action: "openOptionsModal",
			value: "Options",
		}
		const optionsButton = Elements.optionsButton(optionsButtonKey, optionsButtonData);

		UI.Append(`.${Classes.mainMenu}`, optionsButton);

		UI.Delegate(`.${Classes.mainMenu}`, "click", `.${Classes.optionsButton}`, () => {
			const optionsModalKey = "optionsModal";
			Option.showOptionsModal(optionsModalKey);
		});
	}

	static initFastInsertButton() {
		const fastInsert = `<button id="${Ids.insertButton}" class="btn blue fast-insert-button">Insert</button>`;
		UI.Append(`.${Classes.mainMenu}`, fastInsert);

		UI.Delegate(`.${Classes.optionsModalInnerHtml}`, "click", `#${Ids.insertButton}`, async () => {
			if (!GProcess) return alert("No file loaded");
			Option.insert();
		});
	}

	static showOptionsModal(optionsModalKey) {
		const optionsModal = $(`#${optionsModalKey}`);
		if (optionsModal.is(":visible")) {
			optionsModal.hide();
		} else {
			optionsModal.show();
		}
	}

	static async initOptionsModal() {
		const data = Option.getOptionsModalData();
		const innerHtml = Option.getOptionsModalInnerHtml();
		await Modal.Create(data, {html: innerHtml}, false);

		UI.Delegate(`.${Classes.optionsModalInnerHtml}`, "click", `#${Ids.fileInputButton}`, async () => {
			console.log("Load file");
			const fileReader = new FileReader();
			const result = await fileReader.loadFile();
			if (result !== true) alert(result);
			else alert("file loaded");

			$(`#${Ids.currentFile}`).text(GProcess.fileName);
			$(`#${Ids.currentDesc}`).text(VWAResource[GProcess.type].value);
			$(`#${Ids.totalLine}`).text(GProcess.data.length);
		});

		UI.Delegate(`.${Classes.optionsModalInnerHtml}`, "click", `#${Ids.insertButton}`, async () => {
			if (!GProcess) return alert("No file loaded");
			Option.insert();
		});

		UI.Delegate(`.${Classes.optionsModalInnerHtml}`, "click", `#${Ids.insertAndSave}`, async () => {
			if (!GProcess) return alert("No file loaded");
			Option.insert();
			document.getElementById(Ids.saveBtn).click();
		})

		UI.Delegate(`.${Classes.optionsModalInnerHtml}`, "onload", `#${Ids.globalResourceId}`, async () => {
			console.log("initCurrentCode")
			this.initCurrentCode();
		});

		UI.Delegate(`.${Classes.optionsModalInnerHtml}`, "onload", `#${Ids.questionNumber}`, async () => {
			console.log("initNextCurrentQuestionNumber")
			this.initNextCurrentQuestionNumber();
		});


	}

	static initCurrentCode() {
		currentCode = localStorage.getItem("currentCode");
		if (!currentCode) {
			currentCode = 0;
			Storage.Set("currentCode", currentCode);
		}
		return parseInt(currentCode);
	}

	static initNextCurrentQuestionNumber() {
		const nextCurrentQuestionNumber = localStorage.getItem("CurrentQuestionNumber");
		// convert to int
		const nextCurrentQuestionNumberInt = parseInt(nextCurrentQuestionNumber);
		if (!nextCurrentQuestionNumber) {
			const currentQuestionNumber = 1;
			Storage.Set("CurrentQuestionNumber", currentQuestionNumber.toString());
		}
		return nextCurrentQuestionNumberInt + 1;
	}

	static insert() {
		const questionNumber = $(`#${Ids.questionNumber}`).val();
		const totalLine = $(`#${Ids.totalLine}`).text();
		if (parseInt(totalLine) < +questionNumber) return alert("Đã hết dữ liệu");

		const process = JSON.parse(Storage.Get("GProcess"));
		GProcess.insert();
		Storage.Set("currentCode", $(`#${Ids.globalResourceId}`).val());
		Storage.Set("CurrentQuestionNumber", questionNumber);
	}

	static getOptionsModalInnerHtml() {
		return `
			<div class="${Classes.optionsModalInnerHtml}">
				<div class="file-content">
					<h1>Load file</h1>
					<input type="file" id="${Ids.fileInput}" />
				</div>
				<div class="choose-unit">
					<h1>\tDescription</h1>
					<select id="${Ids.description}" style="color: #181d24">
						${Option.getDescriptions()}
					</select>
				</div>
				<div class="preview">
					<h1>Load Data</h1>
					<button id="${Ids.fileInputButton}">Load</button>
					<div>
						<span>Current File: </span><span id="${Ids.currentFile}" style="color: #5be8e8">${GProcess ? GProcess.fileName : ""}</span><br/>
						<span>Current Description: </span><span id="${Ids.currentDesc}" style="color: #5be8e8">${GProcess ? VWAResource[GProcess.type].value : ""}</span><br/>
						<span>Total Line: </span><span id="${Ids.totalLine}" style="color: #5be8e8">${GProcess ? GProcess.data.length : ""}</span><br/>
					</div>
				</div>
				<div class="insert-data">
					<h1>Insert data</h1>
					<div style="margin-top: 10px">
						<input id="${Ids.globalResourceId}" placeholder="insert product Code" style="color: #181d24" value="${Option.initCurrentCode()}">
						<input id="${Ids.questionNumber}" placeholder="insert question number" style="color: #181d24" value="${this.initNextCurrentQuestionNumber()}">
					</div>
					<button id="${Ids.insertButton}">Insert</button>
					<button id="${Ids.insertAndSave}">Insert And Save</button>
				</div>
			</div>`;
	}

	static getDescriptions() {
		let html = ``;
		Object.entries(VWAResource).forEach(([key, value]) => {
			html += `<option value="${key}">${value.value}</option>`;
		});
		return html;
	}

	static getPrograms() {
		let html = ``;
		Object.entries(ProgramSeries).forEach(([key, value]) => {
			html += `<option value="${key}">${value}</option>`;
		});
		return html;
	}

	static getOptionsModalData() {
		return {
			name: "Options Modal",
			element: "mainMenuButton",
			id: "optionsModal",
			cls: "optionsModal",
			base: "windowPanel",
			internal: "emptyWindow",
			position: {
				top: 150,
				left: 150
			},
			modable: true,
			size: {
				width: 100,
				height: 100
			},
			resize: true
		}
	}
}
