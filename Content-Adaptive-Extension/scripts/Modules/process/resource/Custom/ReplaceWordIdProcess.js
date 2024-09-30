class ReplaceWordIdProcess extends VWAProcess {
    process() {
        this.data = this.getWordNotes();
        this.showErrors();
        Storage.Set("GProcess", JSON.stringify(this));
    }

    getWordNotes() {
        const sheetName = "Note WordList"
        const sheet = this.getSheet(sheetName);
        const header = this.getHeader(sheet);
        return this.getContent(sheet, header);
    }

    async insert() {
        await this.replace();
        document.title = "Replace Word Id Done";
    }

    createMapWordIdOldNew() {
        const worldIdOldNew = {};

        const sheet = this.data;

        sheet.forEach(row => {
            const id_old = this.getFieldOfRow("Wordid Old", row);
            worldIdOldNew[id_old] = this.getFieldOfRow("Wordid New", row);
        })

        return worldIdOldNew;
    }

    async replace() {
        const worldIdOldNew = this.createMapWordIdOldNew();
        // Get All Ske
        const ckeElements = document.getElementsByClassName("cke_contents");

        for (let i = 0; i < ckeElements.length; i++) {
            const cke = new Cke(ckeElements[i].id);
            this.replaceCkeValue(cke, worldIdOldNew);
        }
    }

    replaceCkeValue(cke, worldIdOldNew) {
        // value
        let value = cke.getBody().innerHTML;

        // get all word ids like word0006
        const wordIds = value.match(/word\d{4}/g);

        // remove duplicates
        const uniqueWordIds = [...new Set(wordIds)];

        // if no word ids, return
        if (!wordIds) {
            return;
        }

        // replace all word ids
        uniqueWordIds.forEach(wordId => {
            const wordIdNew = worldIdOldNew[wordId];
            if (wordIdNew) {
                value = value.replace(new RegExp(wordId, 'g'), wordIdNew);
            }
        });

        // set new value
        cke.setHtml(value);
    }
}