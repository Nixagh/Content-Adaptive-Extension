class AutoRunEditProgramToc {
    #key = {
        programTocId: "pojo.programTocId",
        name: "pojo.name",
        nameOnTab: "pojo.nameOnTab",
        description: "pojo.description",
        essentialQuestions: "pojo.essentialQuestions",
        lessons: "pojo.lessons",
        hasSharedResource: "pojo.hasSharedResource",
        programId: "pojo.program.programId",
        parent: "pojo.parent.programTocId",
        showOnLibrary: "pojo.showOnLibrary",
        displayOrder: "pojo.displayOrder",
        jsonInfor: "pojo.jsonInfor",
        jsonGear: "pojo.jsonGear",
        jsonCompleteTheme: "pojo.jsonCompleteTheme",
        btnSave: "body > div.modal-scrollable > div > div > div > div.modal-footer > button.btn.btn-small.btn-primary",
        editProgramToc: "editProgramToc"
    }

    getProgramId() {
        //http://192.168.200.26:8090/cms/program/viewdetail.html?pojo.programId=826
        const url = window.location.href;
        const urlSplit = url.split("=");
        return urlSplit[urlSplit.length - 1];
    }

    getUnitList() {
        const unitIdList = [];
        const unitList = document.querySelectorAll('.context-menu-one');
        unitList.forEach((unit) => {
            unitIdList.push(unit.id);
        });
        // remove 3 elements: 0, Overview, Assessment
        unitIdList.splice(0, 3);
        return unitIdList;
    }

    #createContainer(html) {
        const form = document.createElement("div");
        form.innerHTML = html;

        form.addEventListener("submit", (e) => {
            e.preventDefault();
        });

        document.body.appendChild(form);
        return form;
    }

    #deleteContainer(container) {
        container.remove();
    }

    #getFormElement(container) {
        return container.querySelector("form");
    }

    #getElementByName(parent, name) {
        return parent.querySelector(`[name="${name}"]`);
    }

    #setElementByName(parent, name, value) {
        const element = this.#getElementByName(parent, name);
        element.value = value;
    }

    #getGrade() {
        const grade = this.#getElementByName(document, this.#key.programId)[0];
        const text = grade.text.trim().replaceAll("\n", "");
        const gradeText = text.split(": ")[1];
        return productCode["DA"][gradeText].grade;
    }

    async run() {
        const programId = this.getProgramId();
        const unitList = this.getUnitList();

        let i = 0;
        let len = unitList.length;

        while (i <= len - 1) {
            const programTocId = unitList[i];

            const res = await this.#editProgramToc(programTocId);
            const container = this.#createContainer(res);
            const form = this.#getFormElement(container);
            const programToc = this.#createProgramToc(form);

            // process
            programToc.programId = programId;
            programToc.process();

            this.#editForm(form, programToc);

            // this.#submitForm(form);
            // const result = await this.saveProgramToc();
            // console.log("done unit: ", programToc.name, "result: ", result["array"][0]["result"]);
            // if(result["array"][0]["result"] === "success") {
            //     this.#deleteContainer(container);
            // }
            console.log("done unit: ", programToc.name, "result: ", "success");
            this.#deleteContainer(container);
            console.log(programToc);

            i++;
        }
    }

    async saveProgramToc() {
        return $.ajax({
            url: `/cms/ajax/programtoc/update.html`,
            type: "POST",
            dataType: "json",
            cache: false,
            data: $(`#${this.#key.editProgramToc}`).serialize(),
            success: function (res) {
                return res;
            }
        });
    }

    async #editProgramToc(programTocId) {
        let programId = $("#programId").val();
        return $.ajax({
            url: "/cms/ajax/programtoc/view.html",
            type: "GET",
            data: {
                programTocID: programTocId,
                parentID: 0,
                programID: programId
            },
            dataType: "html",
            cache: false,
            complete: function (res) {
                return res.responseText;
            }
        });
    }

     #createProgramToc(form) {
        const unit = this.#getElementByName(form, this.#key.name).value;

        const programToc = new ProgramToc(unit, this.#getGrade());
        programToc.name = unit;
        programToc.nameOnTab = this.#getElementByName(form, this.#key.nameOnTab).value;
        programToc.description = this.#getElementByName(form, this.#key.description).value;
        programToc.essentialQuestions = this.#getElementByName(form, this.#key.essentialQuestions).value;
        programToc.lessons = this.#getElementByName(form, this.#key.lessons).value;
        programToc.hasSharedResource = this.#getElementByName(form, this.#key.hasSharedResource).value;
        programToc.programId = this.#getElementByName(form, this.#key.programId).value;
        programToc.parent = this.#getElementByName(form, this.#key.parent).value;
        programToc.showOnLibrary = this.#getElementByName(form, this.#key.showOnLibrary).value;
        programToc.displayOrder = this.#getElementByName(form, this.#key.displayOrder).value;
        programToc.jsonInfor = this.#getElementByName(form, this.#key.jsonInfor).value;
        programToc.jsonGear = this.#getElementByName(form, this.#key.jsonGear).value;
        // programToc.jsonCompleteTheme = this.#getElementByName(form, this.#key.jsonCompleteTheme).value || "";

        programToc.programTocId = this.#getElementByName(form, this.#key.programTocId).value;

        return programToc;
    }

    #editForm(form, programToc) {
        this.#setElementByName(form, this.#key.programTocId, programToc.programTocId);
        this.#setElementByName(form, this.#key.name, programToc.name);
        this.#setElementByName(form, this.#key.nameOnTab, programToc.nameOnTab);
        this.#setElementByName(form, this.#key.description, programToc.description);
        this.#setElementByName(form, this.#key.essentialQuestions, programToc.essentialQuestions);
        this.#setElementByName(form, this.#key.lessons, programToc.lessons);
        this.#setElementByName(form, this.#key.hasSharedResource, programToc.hasSharedResource);
        this.#setElementByName(form, this.#key.programId, programToc.programId);
        this.#setElementByName(form, this.#key.parent, programToc.parent);
        this.#setElementByName(form, this.#key.showOnLibrary, programToc.showOnLibrary);
        this.#setElementByName(form, this.#key.displayOrder, programToc.displayOrder);
        this.#setElementByName(form, this.#key.jsonInfor, programToc.jsonInfor);
        this.#setElementByName(form, this.#key.jsonGear, programToc.jsonGear);
        // this.#setElementByName(form, this.#key.jsonCompleteTheme, programToc.jsonCompleteTheme);
    }
}