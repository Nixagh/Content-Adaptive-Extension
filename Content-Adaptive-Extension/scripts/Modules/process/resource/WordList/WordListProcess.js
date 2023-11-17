const wordListIds = {
    wordId: "wordIdSection",
    word: "wordSection",
    multiMeaning: "pojo.multiMeaning1",
    themeResult: "select2-chosen-3",
    themeSelect: "themeSelect",
    pronunciation: "pojo.pronunciation",
    partOfSpeech: "partOfSpeech",
    partOfSpeechShort: "partOfSpeechShort",
    Definitions: "cke_definition",
    rolloverDefinition: "cke_rolloverDefinition",
    synonyms: "cke_pojo.synonyms",
    antonyms: "cke_pojo.antonyms",
    pathway1: "pathWaySet1Select",
    pathway2: "pathWaySet2Select",
    wordType: "wordTypeSelect",
    wjEntryField: "wJEntryField",
    prefix: "prefix",
    rootOrBase: "rootOrBase",
    suffix: "suffix",
    inflectedForm: "cke_inflectedForms",

}

const wordListObject = {
    wordId: "",
    word: "",
    multiMeaning: "",
    themeResult: "",
    themeSelect: "",
    pronunciation: "",
    partOfSpeech: "",
    partOfSpeechShort: "",
    Definitions: "",
    rolloverDefinition: "",
    synonyms: "",
    antonyms: "",
    pathway1: "",
    pathway2: "",
    wordType: "",
    wjEntryField: "",
    prefix: "",
    rootOrBase: "",
    suffix: "",
    inflectedForm: "",
}

class WordListProcess {
    fileName;
    type = "WordList";
    allSheets;
    data;
    rowMinus = 1;
    errors;
    themeDataWithWordId;

    process() {
        this.data = this.getData();
        this.themeDataWithWordId = this.getThemeDataWithWordId();
        Storage.Set("GProcess", JSON.stringify(this));
    }

    insert() {
        const rowNumber = this.getRow();
        const data = this.getDataObject(rowNumber);
        this.setHtml(data);
        console.log(`insert word list row ${rowNumber} success`);
    }

    getRow() {
        return parseInt(document.getElementById(Ids.questionNumber).value) - this.rowMinus;
    }


    getDataObject(rowNumber) {
        return {
            wordId: this.getWordId(this.data[rowNumber]),
            word: this.getWord(this.data[rowNumber]),
            multiMeaning: this.getMultiMeaning(this.data[rowNumber]),
            themeResult: this.getThemeResult(this.data[rowNumber]),
            themeSelect: this.getThemeSelect(this.data[rowNumber]),
            pronunciation: this.getPronunciation(this.data[rowNumber]),
            partOfSpeech: this.getPartOfSpeech(this.data[rowNumber]),
            partOfSpeechShort: this.getPartOfSpeechShort(this.data[rowNumber]),
            Definitions: this.getDefinition(this.data[rowNumber]),
            rolloverDefinition: this.getRolloverDefinition(this.data[rowNumber]),
            synonyms: this.getSynonyms(this.data[rowNumber]),
            antonyms: this.getAntonyms(this.data[rowNumber]),
            pathway1: this.getPathway1(this.data[rowNumber]),
            pathway2: this.getPathway2(this.data[rowNumber]),
            wordType: this.getWordType(this.data[rowNumber]),
            wjEntryField: this.getWjEntryField(this.data[rowNumber]),
            prefix: this.getPrefix(this.data[rowNumber]),
            rootOrBase: this.getRootOrBase(this.data[rowNumber]),
            suffix: this.getSuffix(this.data[rowNumber]),
            inflectedForm: this.getInflectedForm(this.data[rowNumber]),
        }
    }


    setHtml(wordListObject) {
        const wordId = new BasicInput(wordListIds.wordId);
        const word = new BasicInput(wordListIds.word);
        const multiMeaning = new BasicInput(wordListIds.multiMeaning);

        const themeResult = new BasicInput(wordListIds.themeResult);
        const themeSelect = new BasicInput(wordListIds.themeSelect);

        const pronunciation = new BasicInput(wordListIds.pronunciation);
        const partOfSpeech = new BasicInput(wordListIds.partOfSpeech);
        const partOfSpeechShort = new BasicInput(wordListIds.partOfSpeechShort);
        const Definitions = new Cke(wordListIds.Definitions);
        const rolloverDefinition = new Cke(wordListIds.rolloverDefinition);
        const synonyms = new Cke(wordListIds.synonyms);
        const antonyms = new Cke(wordListIds.antonyms);
        const pathway1 = new BasicInput(wordListIds.pathway1);
        const pathway2 = new BasicInput(wordListIds.pathway2);
        const wordType = new BasicInput(wordListIds.wordType);
        const wjEntryField = new BasicInput(wordListIds.wjEntryField);
        const prefix = new BasicInput(wordListIds.prefix);
        const rootOrBase = new BasicInput(wordListIds.rootOrBase);
        const suffix = new BasicInput(wordListIds.suffix);
        const inflectedForm = new Cke(wordListIds.inflectedForm);

        wordId.setValue(wordListObject.wordId);
        word.setValue(wordListObject.word);
        if (wordListObject.multiMeaning === "yes")
        multiMeaning.element.checked = true;

        // get value from themeDataWithWordId
        const themeData = this.themeDataWithWordId.find((themeData) => themeData.wordIds.includes(wordListObject.wordId));
        // get value of theme select
        const options = themeSelect.element.options;
        const option = Array.from(options).find((option) => option.text === themeData.header);

        themeSelect.setValue(option.value);
        const displayThemeSelect = document.getElementById("select2-chosen-3");
        displayThemeSelect.innerHTML = themeData.header;

        pronunciation.setValue(wordListObject.pronunciation);
        partOfSpeech.setValue(wordListObject.partOfSpeech);
        partOfSpeechShort.setValue(wordListObject.partOfSpeechShort);
        Definitions.setHtml(wordListObject.Definitions);
        rolloverDefinition.setHtml(wordListObject.rolloverDefinition);
        synonyms.setHtml(wordListObject.synonyms);
        antonyms.setHtml(wordListObject.antonyms);

        pathway1.setValue(wordListObject.pathway1);
        pathway2.setValue(wordListObject.pathway2);
        wordType.setValue(wordListObject.wordType === "Priority" ? 1 : 2);

        const displayPathWay1 = document.getElementById("select2-chosen-4");
        const displayPathWay2 = document.getElementById("select2-chosen-5");
        const displayWordType = document.getElementById("select2-chosen-6");

        displayPathWay1.innerHTML = wordListObject.pathway1;
        displayPathWay2.innerHTML = wordListObject.pathway2;
        displayWordType.innerHTML = wordListObject.wordType;

        wjEntryField.setValue(wordListObject.wjEntryField);
        prefix.setValue(wordListObject.prefix);
        rootOrBase.setValue(wordListObject.rootOrBase);
        suffix.setValue(wordListObject.suffix);
        inflectedForm.setHtml(wordListObject.inflectedForm);
    }


    getData() {
        const wordLists = this.getWordLists();
        const definitions = this.getDefinitions();
        const wordStudy = this.getWordStudy();

        return wordLists.map((wordList) => {
            const word = Utility.getFieldOfRow("Word ID", wordList);
            const definitionRow = definitions.find((definition) => Utility.equalsWordId(Utility.getFieldOfRow("Word ID", definition), word));
            const wordStudyRow = wordStudy.find((wordStudy) => Utility.equalsWordId(Utility.getFieldOfRow("Word ID", wordStudy), word));

            return {
                ...wordList,
                ...definitionRow,
                ...wordStudyRow,
            }
        });
    }

    getThemeDataWithWordId() {
        const sheetNames = Utility.getSheetNames("Theme", this.allSheets);
        const themeData = [];

        const getWordIdsInWordList = (wordIDs) => {
            const regex = /<(word|)(?<id>\d+)>(?<word>.*?)<(\/|)(word|)(\d+)>/g
            let match = regex.exec(wordIDs);
            const wordIds = [];
            while (match != null) {
                wordIds.push(`word${match.groups.id}`);
                match = regex.exec(wordIDs);
            }
            return wordIds;
        }

        sheetNames.forEach((sheetName) => {
            const data = this.getSheetData(sheetName)[0];

            const header = Utility.getFieldOfRow("Head", data);
            const bodyText = Utility.getFieldOfRow("Body Text", data);
            const wordIDs = Utility.getFieldOfRow("Word List", data);
            const wordIds = getWordIdsInWordList(wordIDs);

            themeData.push({
                header,
                bodyText,
                wordIds,
            });
        });

        return themeData;
    }

    getWordLists() {
        return this.getSheetData("wordList");
    }

    getDefinitions() {
        return this.getSheetData("Definition");
    }

    getWordStudy() {
        return this.getSheetData("WordStudy");
    }

    getSheetData(sheetName) {
        const sheet = ExcelUtil.getSheet(sheetName, this.allSheets);
        const header = ExcelUtil.getHeader(sheet);
        return ExcelUtil.getContent(sheet, header);
    }

    // get field //
    getWordId(row) {
        return Utility.getFieldOfRow("Word ID", row);
    }

    getWord(row) {
        return Utility.getFieldOfRow("Word", row);
    }

    getMultiMeaning(row) {
        return Utility.getFieldOfRow("Multi-meaning", row);
    }

    getThemeResult(row) {
        return Utility.getFieldOfRow("Theme Result", row);
    }

    getThemeSelect(row) {
        return Utility.getFieldOfRow("Theme Select", row);
    }

    getPronunciation(row) {
        return Utility.getFieldOfRow("Pronunciation", row);
    }

    getPartOfSpeech(row) {
        return Utility.getFieldOfRow("Part of Speech", row);
    }

    getPartOfSpeechShort(row) {
        const rollover = this.getRolloverDefinition(row);
        const regex = /(?<short>\(.*?\))/g;
        return regex.exec(rollover).groups.short;
    }

    getDefinition(row) {
        const rollover = this.getRolloverDefinition(row);
        const regex = /(?<short>\(.*?\))(?<definiton>.*)/g
        return regex.exec(rollover).groups.definiton;
    }

    getRolloverDefinition(row) {
        return Utility.getFieldOfRow("Rollover Definition", row);
    }

    getSynonyms(row) {
        return Utility.getFieldOfRow("Synonyms", row);
    }

    getAntonyms(row) {
        return Utility.getFieldOfRow("Antonyms", row);
    }

    getPathway1(row) {
        return Utility.getFieldOfRow("P1 Set", row);
    }

    getPathway2(row) {
        return Utility.getFieldOfRow("P2 Set", row);
    }

    getWordType(row) {
        return Utility.getFieldOfRow("Priority/Challenge", row);
    }

    getWjEntryField(row) {
        return Utility.getFieldOfRow("WJ", row);
    }

    getPrefix(row) {
        return Utility.getFieldOfRow("Prefix", row);
    }

    getRootOrBase(row) {
        return Utility.getFieldOfRow("Root or Base", row);
    }

    getSuffix(row) {
        return Utility.getFieldOfRow("Suffix", row);
    }

    getInflectedForm(row) {
        return Utility.getExactlyFieldOfRow("Inflected Form", row);
    }
}