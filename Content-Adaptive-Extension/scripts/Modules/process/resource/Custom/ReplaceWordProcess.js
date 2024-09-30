class ReplaceWordProcess extends ReplaceWordIdProcess {

    process() {
        this.data = this.getWordNotes();
        this.showErrors();
        Storage.Set("GProcess", JSON.stringify(this));
    }

    getWordNotes() {
        const sheetName = "WordList_Replace"
        const sheet = this.getSheet(sheetName);
        const header = this.getHeader(sheet);
        return this.getContent(sheet, header);
    }

    createMapWordIdOldNew() {
        const worldIdOldNew = {};

        const sheet = this.data;

        sheet.forEach(row => {
            const word = this.getExactlyFieldOfRow("Word", row);
            worldIdOldNew[`<b>${word}</b>`] = this.getFieldOfRow("Wordid", row);
        })

        return worldIdOldNew;
    }

    replaceCkeValue(cke, worldNew) {
        // value
        let value = cke.getBody().innerHTML;

        // get all word ids like word0006
        const words = value.match(/<b>(.+?)<\/b>/g);

        // remove duplicates
        const uniqueWord = [...new Set(words)];

        // if no word ids, return
        if (!uniqueWord) {
            return;
        }

        // replace all word ids
        uniqueWord.forEach(word => {
            const _wordId = worldNew[word];
            // remove <b> and </b> from word
            const _word = word.replace(/<\/?b>/g, '');

            if (_wordId) {
                value = value.replace(new RegExp(word, 'g'), `<${_wordId}>${_word}</${_wordId}>`);
            }
        });

        // set new value
        cke.setHtml(value);
    }
}