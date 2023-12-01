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

    getLengthData() {
        return this.data.length;
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
        const multiMeaning = document.getElementById(wordListIds.multiMeaning);

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
        multiMeaning.checked = wordListObject.multiMeaning;

        // get value from themeDataWithWordId
        const themeData = this.themeDataWithWordId.find((themeData) => themeData.wordIds.includes(wordListObject.wordId));
        const regex = /<(\/|)i>|<(\/|)b>/g;
        const themeCode = themeData.header.replaceAll(regex, "");
        // get value of theme select
        const themeOptions = themeSelect.element.options;
        const themeOption = Array.from(themeOptions).find((option) => option.text === themeCode) || themeOptions[0];

        themeSelect.setValue(themeOption.value);
        const displayThemeSelect = document.getElementById("select2-chosen-3");
        displayThemeSelect.innerHTML = themeOption.text;

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

            definitionRow["D_Definition"] = Utility.getFieldOfRow("Definition", definitionRow);

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
            const wordIds = [] /*|| getWordIdsInWordList(wordIDs)*/;

            themeData.push({
                header,
                bodyText,
                wordIds,
            });
        });

        // set Theme
        return this.getTheme(themeData);
    }

    getTheme(themeData) {
        const wordLists = this.getWordLists();
        const length = wordLists.length;

        const challengeWords1 = {
            header: "Challenge Words 01",
            bodyText: "Challenge Words 01",
            wordIds: [],
        }
        const challengeWords2 = {
            header: "Challenge Words 02",
            bodyText: "Challenge Words 02",
            wordIds: [],
        }

        const challengeWords = [challengeWords1, challengeWords2];

        let index = 0;
        const ChallengeWord = "Challenge";

        // set challenge words 1
        for (let i = 0; i < length; i++) {
            const wordList = wordLists[i];
            const wordId = this.getWordId(wordList);
            const wordType = this.getWordType(wordList);
            const _theme = this.getThemeResult(wordList);
            if (wordType.includes(ChallengeWord)) {
                challengeWords[index]['wordIds'].push(wordId);
                if (this.getWordType(wordLists[i + 1]) !== ChallengeWord) index++;
            } else {
                // find theme in themeData with header
                for (const theme of themeData) {
                    if (_theme === theme.header) {
                        theme.wordIds.push(wordId);
                        break;
                    }
                }
            }
        }
        themeData.push(...challengeWords);
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
        return Utility.getExactlyFieldOfRow("Word", row).replaceAll("*", "");
    }

    getMultiMeaning(row) {
        const multiMeaning = Utility.getFieldOfRow("Multiple-Meaning", row) || Utility.getFieldOfRow("Multiple-Meaning", row);
        return multiMeaning.toLowerCase().trim() === "yes";
    }

    getThemeResult(row) {
        return Utility.getFieldOfRow("Themes", row);
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

        if (!regex.exec(rollover)) {
            const partOfSpeech = this.getPartOfSpeech(row);

            const _get = (partOfSpeech) => {
                switch (partOfSpeech) {
                    case "noun":
                        return "n.";
                    case "verb":
                        return "v.";
                    case "adjective":
                        return "adj.";
                    case "adverb":
                        return "adv.";
                    case "pronoun":
                        return "pron.";
                    case "preposition":
                        return "prep.";
                    case "conjunction":
                        return "conj.";
                    case "interjection":
                        return "interj.";
                    default:
                        return "";
                }
            }

            const split = partOfSpeech.split("[;,]");
            const newSplit = split.map((value) => {
                return _get(value.trim());
            });
            return `(${newSplit.join(", ")})`;
        }

        return regex.exec(rollover).groups.short
            .replaceAll("(", "")
            .replaceAll(")", "");
    }


    getDefinition(row) {
        const rollover = this.getRolloverDefinition(row);
        const regex = /(?<short>\(.*?\))(?<definiton>.*)/g
        return regex.exec(rollover) ? regex.exec(rollover).groups.definiton : rollover;
    }

    getRolloverDefinition(row) {
        return Utility.getFieldOfRow("Rollover Definition", row) || Utility.getExactlyFieldOfRow("D_Definition", row);
    }

    getSynonyms(row) {
        const synonyms = Utility.getFieldOfRow("Synonyms", row);
        return Utility.isNotNull(synonyms) ? synonyms : "";
    }

    getAntonyms(row) {
        const antonyms = Utility.getFieldOfRow("Antonyms", row);
        return Utility.isNotNull(antonyms) ? antonyms : "";
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
        const prefix = Utility.getFieldOfRow("Prefix", row);
        return this.processSplit(prefix);
    }

    getRootOrBase(row) {
        const rootOrBase = Utility.getFieldOfRow("Root or Base", row);
        return this.processSplit(rootOrBase);
    }

    getSuffix(row) {
        const suffix = Utility.getFieldOfRow("Suffix", row);
        return this.processSplit(suffix);
    }

    getInflectedForm(row) {
        return Utility.getExactlyFieldOfRow("Inflected Form", row) || Utility.getExactlyFieldOfRow("Inflected Forms", row);
    }

    // ------------------ process ------------------ //
    processSplit(content, stringStyle) {
        if (!Utility.isNotNull(content) || content.toLowerCase().trim().includes("n/a")) return "";

        const split = content.split("\n").filter(value => Utility.isNotNull(value));
        const newSplit = split.map((value, index) => {
            let _value = value
                .replaceAll("\n", "")
                .replaceAll("\r", "")
                .replace("'", "")
                .trim();
            if (index % 2 === 0) _value = `<b>${_value}</b>`;
            return _value;
        })
        const step2 = newSplit.join("<br/>").split("<br/><b>");
        if (!stringStyle) return step2.join("\n");
        return step2.map((value, index) => {
            if (index % 2 === 1) return stringStyle(`<b>${value}`);
            return stringStyle(value);
        }).join("\n");
    }
}