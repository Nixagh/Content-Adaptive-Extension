class LoadJsonInfo {
    constructor() {
        this.saveUrl = "http://192.168.200.26:8090/cms/ajax/programtoc/update.html";
        this.programId = this.getProgramId();
    }

    createFormData(name, programId, displayOrder, jsonInfo, programTocId, parentProgramTocId = '') {
        const formData = new FormData();
        formData.append("pojo.name", name);
        formData.append("pojo.nameOnTab", "");
        formData.append("pojo.description", "");
        formData.append("pojo.essentialQuestions", "");
        formData.append("pojo.lessons", "");
        formData.append("_pojo.hasSharedResource", "on");
        formData.append("pojo.program.programId", programId);
        formData.append("_pojo.showOnLibrary", "on");
        formData.append("pojo.displayOrder", displayOrder);
        formData.append("pojo.jsonInfor", jsonInfo);
        formData.append("pojo.programTocId", programTocId);
        formData.append("pojo.parent.programTocId", parentProgramTocId);

        return formData;
    }

    getJson(name) {

    }

    save(formData) {
        fetch(this.saveUrl, { method: "POST", body: formData })
            .then(data => data.json())
            .then(data => console.log(data))
            .catch(err => console.log(err));
    }

    getProgramId() {
        const url = window.location.href;
        //?pojo.programId=827
        return url.split("?pojo.programId=")[1];
    }

    getProgramTocId() {
        const nodes = document.querySelectorAll(".pg_" + this.programId);

        const isRemove = (node) => {
            // go to span
            const span = node.querySelector("span");
            const text = span.innerText;
            return !text.includes("Unit");
        }
    }
}