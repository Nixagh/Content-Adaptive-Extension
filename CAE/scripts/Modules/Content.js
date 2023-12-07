class OptionContent {
    fileReader = new FileReader();

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
        this.showAndHideInsertButton(Storage.Get("CurrentProgram") || "WL" || "WC");
        this.showAndHideModal(Storage.Get("CurrentShowModal") || ModalIds.InsertQuestion.modalId);
        // this.showCurrentQuestionNumber();
        OptionContent.initEventOpenModal();

        UI.Delegate(`.${Classes.optionsModalInnerHtml}`, "click", `#${Ids.fileInputButton}`, async () => {
            console.log("Load file");
            const fileReader = new FileReader();
            const result = await fileReader.loadFile();
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
                if (result) document.getElementById(Ids.saveBtn).click()
            });
        })

        UI.Delegate(`.${Classes.optionsModalInnerHtml}`, "click", `#${Ids.insertWordList}`, async () => {
            if (!GProcess) return alert("No file loaded");
            await OptionContent.insert();
            // document.getElementById(Ids.saveBtn).click()
        });

        UI.Delegate(`.${Classes.optionsModalInnerHtml}`, "click", `#${Ids.insertWordContinuum}`, async () => {
            if (!GProcess) return alert("No file loaded");
            await OptionContent.insert();
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


        UI.Delegate(`#${ModalIds.InsertType.modalId}`, "click", `#${Ids.insertSettings}`, async () => {
            const type = $(`#${Ids.type}`).val();
            Screen.insert(type);
            console.log("insertSettings" + type);
        });


        //
        UI.Delegate(`.${Classes.optionsModalInnerHtml}`, "change", `#${Ids.questionNumber}`, async () => {
            Storage.Set("CurrentQuestionNumber", $(`#${Ids.questionNumber}`).val());
        });

        // event of WWiA
        OptionContent.eventOfWWiA();
    }

    static initEventOpenModal() {
        for (let key in ModalIds) {
            const value = ModalIds[key];
            UI.Delegate(`.${Classes.optionsModal}`, "click", `#${value.buttonId}`, () => {
                OptionContent.showAndHideModal(value.modalId);
            });
        }
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
        const modals = ModalIds;
        // show
        $(`#${show}`).show();
        // hide
        Object.entries(modals).forEach(([key, value]) => {
            const id = value.modalId;
            if (id !== show) {
                $(`#${id}`).hide();
            }
        });
        Storage.Set("CurrentShowModal", show);
    }

    static eventOfWWiA() {
        const fileReader = new FileReader();
        let files = [];

        UI.Delegate(`#${ModalIds.InsertWWiA.modalId}`, "change", `#${Ids.fileInputForWWiA}`, async () => {
            const input = $(`#${Ids.fileInputForWWiA}`);
            files.push(input[0].files[0]);
        });

        UI.Delegate(`#${ModalIds.InsertWWiA.modalId}`, "click", `#${Ids.fileInputButtonOfWWiA}`, async () => {
            console.log("Load file");
            const response = await fileReader.loadFileFromWWiA(files);
            console.log(response);
        });

        UI.Delegate(`#${ModalIds.InsertWWiA.modalId}`, "click", `#${Ids.insertButton}`, async () => {
            if (!GProcess) return alert("No file loaded");
            await OptionContent.insert();
        });
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
        // if (parseInt(totalLine) < +questionNumber) return alert("Đã hết dữ liệu");

        const error = await GProcess.insert();
        Storage.Set("currentCode", $(`#${Ids.globalResourceId}`).val());
        Storage.Set("CurrentQuestionNumber", questionNumber);
        return error;
    }

    static getOptionsModalInnerHtml() {
        return `${this.getOpenButtonModalInnerHtml()}<br/>
            <div id="${ModalIds.InsertQuestion.modalId}">
                <div class="${Classes.optionsModalInnerHtml}">
                    <div class="file-content">
                        <h1>Load file</h1>
                        <input type="file" id="${Ids.fileInput}" />
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
                            ${OptionContent.getDescriptions(WordListResource)}
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
                            <input id="${Ids.globalResourceId}" placeholder="insert product Code" style="color: #181d24" value="${OptionContent.initCurrentCode()}">
                            <input id="${Ids.questionNumber}" placeholder="insert question number" style="color: #181d24" value="${OptionContent.initNextCurrentQuestionNumber()}">
                        </div>
                        <button id="${Ids.insertButton}">Insert</button>
                        <button id="${Ids.insertAndSave}" style="color: #181d24">Insert And Save</button>
                        <button id="${Ids.insertWordList}" style="color: #181d24">Insert Word List</button>
                        <button id="${Ids.insertWordContinuum}" style="color: #181d24">Insert Word Continnuum</button>
                    </div>
                </div>
            </div>
            <div id="${ModalIds.InsertType.modalId}">
                <div class="description">
                    <h1>Insert Type</h1>
                    <select id="${Ids.type}" style="color: #181d24">
                        ${OptionContent.getDescriptions(VWAResourceSetting)}
                    </select>
                    <button id="${Ids.insertSettings}" style="color: black">Insert</button>
                </div>
            </div>
            `;
    }
//<!--<div id="${ModalIds.InsertWWiA.modalId}">
//                 <div class="description">
//                     <div class="file-content">
//                         <h1>Load file</h1>
//                         <h3>WWIA file </h3>
//                         <input type="file" id="${Ids.fileInputForWWiA}" />
//                     </div>
//                     <h1>Insert Type</h1>
//                     <select id="${Ids.type}" style="color: #181d24">
//                         ${OptionContent.getDescriptions(WWiAResource)}
//                     </select>
//                     <div class="preview">
//                         <h1>Load Data</h1>
//                         <button id="${Ids.fileInputButton}">Load</button>
//                         <div>
//                             <span>Current File: </span><span id="${Ids.currentFile}" style="color: #5be8e8">${GProcess ? GProcess.fileName : ""}</span><br/>
//                             <span>Current Description: </span><span id="${Ids.currentDesc}" style="color: #5be8e8">${GProcess ? Resource[currentProgram].resource[GProcess.type].value : ""}</span><br/>
//                             <span>Total Line: </span><span id="${Ids.totalLine}" style="color: #5be8e8">${GProcess ? GProcess.getLengthData() : ""}</span><br/>
//                         </div>
//                      </div>
//                     <button id="${Ids.insertSettings}" style="color: black">Insert</button>
//                 </div>
//             </div>-->
    static getOpenButtonModalInnerHtml() {
        return `
            <div style="display: flex; justify-content: flex-start">
            ${Object.entries(ModalIds).map(([key, value]) => {
            return `<button id="${value.buttonId}" style="color: black">${value.text}</button>`
        }).join("")}
            </div>
        `;
    }

    static getModalInnerHtml() {
        return Object.entries(modals()).map(([key, value]) => value).join("");
    }

    static getDescriptions(resource) {
        let html = ``;
        Object.entries(resource).forEach(([key, value]) => {
            html += `<option value="${key}">${value.value}</option>`;
        });
        return html;
    }

    static getPreviews(GProcess) {
        return `
         <div class="preview">
            <h1>Load Data</h1>
            <button id="${Ids.fileInputButton}">Load</button>
            <div>
                <span>Current File: </span><span id="${Ids.currentFile}" style="color: #5be8e8">${GProcess ? GProcess.fileName : ""}</span><br/>
                <span>Current Description: </span><span id="${Ids.currentDesc}" style="color: #5be8e8">${GProcess ? Resource[currentProgram].resource[GProcess.type].value : ""}</span><br/>
                <span>Total Line: </span><span id="${Ids.totalLine}" style="color: #5be8e8">${GProcess ? GProcess.getLengthData() : ""}</span><br/>
            </div>
         </div>`;
    }

    static getPrograms() {
        // let html = ``;
        // Object.entries(ProgramSeries).forEach(([key, value]) => {
        //     html += `<option value="${key}">${value}</option>`;
        // });
        return `
        <option value="WL">Insert Word List</option>
        <option value="WC">Insert WordContinuum</option>
        <option value="VWA">Insert Resource</option>
		`;

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