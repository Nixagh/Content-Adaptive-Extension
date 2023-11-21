class WordContinuumProcess {
    fileName;
    type = "WordContinuum";
    allSheets;
    data;
    rowMinus = 1;
    errors;

    process() {
        this.data = this.getData();
        Storage.Set("GProcess", JSON.stringify(this));
    }

    insert() {
        const rowNumber = this.getRow();
        const data = this.getDataObject(rowNumber);
        this.setHtml(data);
        console.log(`insert word list row ${rowNumber} success`);
    }

    getData() {
        return this.getContinuumData();
    }

    getContinuumData() {
        const sheet = ExcelUtil.getSheet("Continuum", this.allSheets);
        const header = ExcelUtil.getHeader(sheet);
        return ExcelUtil.getContent(sheet, header);
    }

    getRow() {
        return parseInt(document.getElementById(Ids.questionNumber).value) - this.rowMinus;
    }

    getDataObject(rowNumber) {

    }

    titleObject() {
        return {
            tile: "",
            partOfSpeech: "",
            color: "#F1F2FD",
            definition: ""
        }
    }
}