class OptionContent {
    static fileStorage = [];

    init() {
        OptionContent.initButton();
        OptionContent.initOptionsModal().then();
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
            OptionContent.showOptionsModal(optionsModalKey);
        });
    }

    static initFastInsertButton() {
        const fastInsert = `<button id="${Ids.insertButton}" class="btn blue fast-insert-button">Insert</button>`;
        UI.Append(`.${Classes.mainMenu}`, fastInsert);

        UI.Delegate(`.${Classes.optionsModalInnerHtml}`, "click", `#${Ids.insertButton}`, async () => {
            if (!GProcess) return alert("No file loaded");
            await OptionContent.insert();
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
        const data = OptionContent.getOptionsModalData();
        const innerHtml = OptionContent.getOptionsModalInnerHtml();
        await Modal.Create(data, {html: innerHtml}, false);
        this.showAndHideInsertButton(Storage.Get("CurrentProgram") || "PT");
        this.showAndHideModal(Storage.Get("CurrentShowModal") || ListModalIds.questionModal);
        // this.showCurrentQuestionNumber();

        this.fileInit();

        UI.Delegate(`.emptyWindow`, "click", `#${Ids.openInsertQuestion}`, () => {
            this.showAndHideModal(ListModalIds.questionModal);
        });

        UI.Delegate(`.emptyWindow`, "click", `#${Ids.openInsertType}`, () => {
            this.showAndHideModal(ListModalIds.typeModal);
        });

        UI.Delegate(`.${Classes.optionsModalInnerHtml}`, "click", `#${Ids.fileInputButton}`, async () => {
            console.log("Load file");
            const fileReader = new FileReader();
            const result = await fileReader.loadFileFromStorage(this.fileStorage);
            if (result !== true) alert(result);
            else alert("file loaded");

            // set current program
            const program = $(`#${Ids.program}`).val();
            Storage.Set("CurrentProgram", program);

            // set current file
            $(`#${Ids.currentFile}`).text(GProcess.fileName);
            $(`#${Ids.currentDesc}`).text(Resource[program].resource[GProcess.type].value);
            $(`#${Ids.totalLine}`).text(GProcess.getLengthData());

        });

        UI.Delegate(`.${Classes.optionsModalInnerHtml}`, "click", `#${Ids.insertButton}`, async () => {
            if (!GProcess) return alert("No file loaded");
            await OptionContent.insert();
        });

        UI.Delegate(`.${Classes.optionsModalInnerHtml}`, "click", `#${Ids.insertAndSave}`, async () => {
            if (!GProcess) return alert("No file loaded");
            OptionContent.insert().then((result) => {
                setTimeout(() => {
                    if (result) document.getElementById(Ids.saveBtn).click()
                }, 250);
            });
        })

        UI.Delegate(`.${Classes.optionsModalInnerHtml}`, "click", `#${Ids.insertWordList}`, async () => {
            if (!GProcess) return alert("No file loaded");
            await OptionContent.insert();
            document.getElementById(Ids.saveBtn).click()
        });

        UI.Delegate(`.${Classes.optionsModalInnerHtml}`, "click", `#${Ids.insertWordContinuum}`, async () => {
            if (!GProcess) return alert("No file loaded");
            await OptionContent.insert();
        });

        UI.Delegate(`.${Classes.optionsModalInnerHtml}`, "click", `#${Ids.insertJson}`, async () => {
            if (!GProcess) return alert("No file loaded");
            const autoEditProgramToc = new AutoRunEditProgramToc();
            autoEditProgramToc.run().then(() => console.log("AutoRunEditProgramToc finished"));
        });

        UI.Delegate(`.${Classes.optionsModalInnerHtml}`, "onload", `#${Ids.globalResourceId}`, async () => {
            console.log("initCurrentCode")
            this.initCurrentCode();
        });

        UI.Delegate(`.${Classes.optionsModalInnerHtml}`, "onload", `#${Ids.questionNumber}`, async () => {
            console.log("initNextCurrentQuestionNumber")
            this.initNextCurrentQuestionNumber();
        });

		UI.Delegate(`.${Classes.optionsModalInnerHtml}`, "change", `#${Ids.program}`, async () => {
            console.log("change program")
            const program = $(`#${Ids.program}`).val();
            const getResource = Resource[program].resource;

            const description = $(`#${Ids.description}`);
            description.empty();
            description.append(this.getDescriptions(getResource));

            // hide and show insert button
            this.showAndHideInsertButton(program);
        });


        UI.Delegate(`#${ListModalIds.typeModal}`, "click", `#${Ids.insertSettings}`, async () => {
            const type = $(`#${Ids.type}`).val();
            Screen.insert(type);
            console.log("insertSettings" + type);
        });

        UI.Delegate(`.${Classes.optionsModalInnerHtml}`, "change", `#${Ids.description}`, async () => {
            const program = $(`#${Ids.program}`).val();
            const getResource = Resource[program].resource;
            const resource = getResource[$(`#${Ids.description}`).val()];
            // has
            if (resource.hasOwnProperty("specialSet")) {
                const specialSet = $(`#${Ids.specialSet}`);
                specialSet.empty();
                specialSet.append(this.getSpecialSet(resource.specialSet));

                // show special set
                specialSet.parent().show();
            }
            else {
                $(`#${Ids.specialSet}`).parent().hide();
            }
        });


        //
        UI.Delegate(`.${Classes.optionsModalInnerHtml}`, "change", `#${Ids.questionNumber}`, async () => {
            Storage.Set("CurrentQuestionNumber", $(`#${Ids.questionNumber}`).val());
        });
    }

    static showAndHideInsertButton(program) {
        const buttons = Resource[program].insertButton;
        // show
        buttons.show.forEach((button) => {
            $(`#${button}`).show();
        });
        // hide
        buttons.hide.forEach((button) => {
            $(`#${button}`).hide();
        });
    }

    static showAndHideModal(show) {
        const modals = ListModalIds;
        // show
        $(`#${show}`).show();
        // hide
        Object.entries(modals).forEach(([key, value]) => {
            if (value !== show) {
                $(`#${value}`).hide();
            }
        });
        Storage.Set("CurrentShowModal", show);
    }

    static showCurrentQuestionNumber() {
        const currentQuestionNumber = Storage.Get("CurrentQuestionNumber");
        $(`#${Ids.questionNumber}`).val(currentQuestionNumber);
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

    static async insert() {
        const questionNumber = $(`#${Ids.questionNumber}`).val();
        const totalLine = $(`#${Ids.totalLine}`).text();
        if (parseInt(totalLine) < +questionNumber) {
            OptionContent.turnOffAuto();
            // open check log if ok
            // const checkLog = new CheckLog();
            // checkLog.createLog(GProcess.type);
            return alert("All data inserted, and log created in background");
        }

        const error = await GProcess.insert();
        Storage.Set("currentCode", $(`#${Ids.globalResourceId}`).val());
        Storage.Set("CurrentQuestionNumber", questionNumber);
        return error;
    }

    static turnOffAuto() {
        chrome.storage.local.set({isAuto: false});
        chrome.storage.local.set({isAutoWordList: false});
        chrome.storage.local.set({isAutoWordContinuum: false});
        chrome.storage.local.set({isAutoVWA: false});
        chrome.storage.local.set({isAutoResourceSettings: false});
        chrome.storage.local.set({isAutoDeleteWrongResource: false});
    }

    static fileInit() {
        const fileStorageShow = $(`#${Ids.fileStorageShow}`);
        const fileInput = $(`#${Ids.fileInput}`);
        UI.Delegate(`.${Classes.optionsModalInnerHtml}`, "change", `#${Ids.fileInput}`, async (e) => {
            this.fileStorage.push(e.target.files[0]);
            fileStorageShow.empty();
            this.fileStorage.forEach((file) => {
                fileStorageShow.append(`<div>${file.name}</div>`);
            });
        });

        // clear storage
        UI.Delegate(`.${Classes.optionsModalInnerHtml}`, "click", `#${Ids.fileClear}`, async () => {
            this.fileStorage = [];
            fileInput.val(null);
            fileStorageShow.empty();
        });
    }

    static getOptionsModalInnerHtml() {
        return `
            <div style="display: flex; justify-content: flex-start">
                <button id="${Ids.openInsertQuestion}" style="color: black">Insert Question</button>
                <button id="${Ids.openInsertType}" style="color: black">Insert Type</button>
            </div>
            <div id="${ListModalIds.questionModal}">
                <div class="${Classes.optionsModalInnerHtml}">
                    <div class="file-content">
                        <h1>Load file</h1>
                        <div style="display: flex; justify-content: space-between">
                            <input type="file" id="${Ids.fileInput}" />
                            <input type="button" id="${Ids.fileClear}" style="color: #181d24" value="clear file"/>
                        </div>
                        <div style="margin-top: 10px" id="${Ids.fileStorageShow}"></div>
                    </div>
                    
                    <div class="choose-load">
                        <h1>Program</h1>
                        <select id="${Ids.program}" style="color: #181d24">
                            ${OptionContent.getPrograms()}
                        </select>
                    </div>
                    
                    <div class="choose-unit">
                        <h1>Description</h1>
                        <select id="${Ids.description}" style="color: #181d24">
                            ${OptionContent.getDescriptions(ProgramTocResource)}
                        </select>
                        <div class="special select" style="display: none">
                            <h4>Special Set</h4>
                            <select id="${Ids.specialSet}" style="color: #181d24">
                                ${OptionContent.getSpecialSet({})}
                            </select>
                        </div>
                        <h4>Achieve Set</h4>
                        <select id="${Ids.achieveSet}" style="color: #181d24">
                            ${OptionContent.getAchieveSet(AchieveSet)}
                        </select>
                    </div>
                    <div class="preview">
                        <h1>Load Data</h1>
                        <button id="${Ids.fileInputButton}">Load</button>
                        <div>
                            <span>Current File: </span><span id="${Ids.currentFile}" style="color: #5be8e8">${GProcess ? GProcess.fileName : ""}</span><br/>
                            <span>Current Description: </span><span id="${Ids.currentDesc}" style="color: #5be8e8">${GProcess ? Resource[currentProgram].resource[GProcess.type].value : ""}</span><br/>
                            <span>Total Line: </span><span id="${Ids.totalLine}" style="color: #5be8e8">${GProcess ? GProcess.getLengthData() : ""}</span><br/>
                        </div>
                    </div>
                    <div class="insert-data">
                        <h1>Insert data</h1>
                        <div style="margin-top: 10px">
<!--                            <input id="${Ids.globalResourceId}" placeholder="insert product Code" style="color: #181d24" value="${OptionContent.initCurrentCode()}">-->
                            <label for="${Ids.questionNumber}">Insert Question Number</label>
                            <input id="${Ids.questionNumber}" placeholder="insert question number" style="color: #181d24" value="${this.initNextCurrentQuestionNumber()}">
                        </div>
                        <button id="${Ids.insertButton}">Insert</button>
                        <button id="${Ids.insertAndSave}" style="color: #181d24">Insert And Save</button>
                        <button id="${Ids.insertWordList}" style="color: #181d24">Insert Word List</button>
                        <button id="${Ids.insertWordContinuum}" style="color: #181d24">Insert Word Continnuum</button>
                        <button id="${Ids.insertJson}" style="color: #181d24">Insert Json</button>
                    </div>
                </div>
            </div>
            <div id="${ListModalIds.typeModal}">
                <div class="description">
                    <h1>Insert Type</h1>
                    <select id="${Ids.type}" style="color: #181d24">
                        ${OptionContent.getDescriptions(VWAResourceSetting)}
                    </select>
                    <button id="${Ids.insertSettings}" style="color: black">Insert</button>
                </div>
            </div>`;
    }

    static getDescriptions(resource) {
        let html = ``;
        Object.entries(resource).forEach(([key, value]) => {
            html += `<option value="${key}">${value.value}</option>`;
        });
        return html;
    }

    static getPrograms() {
        // let html = ``;
        // Object.entries(ProgramSeries).forEach(([key, value]) => {
        //     html += `<option value="${key}">${value}</option>`;
        // });
        // return `
        // <option value="WL">Insert Word List</option>
        // <option value="WC">Insert WordContinuum</option>
        // <option value="VWA">Insert Resource</option>
		// `;
        return Object.entries(Resource).map(([key, value]) => {
            return `<option value="${key}">${value.name}</option>`;
        }).join("");
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

    static getAchieveSet(AchieveSet) {
        let html = ``;
        Object.entries(AchieveSet).forEach(([key, value]) => {
            html += `<option value="${key}">${value.display}</option>`;
        });
        return html;
    }

    static getSpecialSet(specialSet) {
        let html = ``;
        Object.entries(specialSet).forEach(([key, value]) => {
            html += `<option value="${key}">${value}</option>`;
        });
        return html;
    }
}
