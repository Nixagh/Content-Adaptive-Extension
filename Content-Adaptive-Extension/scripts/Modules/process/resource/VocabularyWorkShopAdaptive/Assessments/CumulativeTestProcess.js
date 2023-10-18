class CumulativeTestProcess extends VWAProcess {
    getDescription() {
        return `g${this.getGrade()}_cml${this.getUnit()}`;
    }

    getGrade() {
        const globalResourceId = this.getGlobalResourceId();
        return globalResourceId[globalResourceId.length - 1];
    }

    getUnit() {
        // todo:
        return 3;
    }

    getCID(row) {
        return `${this.getGlobalResourceId()}_${this.getDescription()}_q${this.convertDigit(this.getQuestionNumber(row))}_ans01`;
    }

    getFullContent() {
        const synonyms = this.getSynonymsSheet();
        const chTheRW2 = this.getCHTheRWSheet();
        const wordAssociations = this.getWordAssociationsSheet();
        return [{
            "syn": synonyms,
            "chTheRW2": chTheRW2,
            "wordAssoc": wordAssociations
        }];
    }


    getSynonymsSheet() {
        const synonymsSheetName = `Synonyms`;
        const synonymsSheet = this.getSheet(synonymsSheetName);
        const synonymsHeader = this.getHeader(synonymsSheet);
        return this.getContent(synonymsSheet, synonymsHeader);
    }

    getCHTheRWSheet() {
        const chTheRWSheetName = `ChtheRW2`;
        const chTheRWSheet = this.getSheet(chTheRWSheetName);
        const chTheRWHeader = this.getHeader(chTheRWSheet);
        return this.getContent(chTheRWSheet, chTheRWHeader);
    }

    getWordAssociationsSheet() {
        const wordAssociationsSheetName = `WordAssoc`;
        const wordAssociationsSheet = this.getSheet(wordAssociationsSheetName);
        const wordAssociationsHeader = this.getHeader(wordAssociationsSheet);
        return this.getContent(wordAssociationsSheet, wordAssociationsHeader);
    }

    getSyn() {
        return this.data[0]["syn"];
    }

    getCHTheRW() {
        return this.data[0]["chTheRW2"];
    }

    getWordAssoc() {
        return this.data[0]["wordAssoc"];
    }

    getComponentScoreRules(row) {
        // {"test":null,"scoringGroups":[{"componentGradingRules":[{"componentId":"802916_g6_cml1_q1_ans01","componentType":"MultipleChoice","componentSubtype":null,"autoScore":true,"rubricRule":null}],"maxScore":1}]}
        const componentScoreRules = {
            test: null,
            scoringGroups: [
                {
                    componentGradingRules: [
                        {
                            componentId: this.getCID(row),
                            componentType: "MultipleChoice",
                            componentSubtype: null,
                            autoScore: true,
                            rubricRule: null
                        }
                    ],
                }
            ],
            maxScore: this.getMaxScore()
        };
        return JSON.stringify(componentScoreRules);
    }

    getPathway1(row) {
        return '';
    }
    getPathway2(row) {
        return '';
    }

    getWordId(row) {
        return this._getField("Word ID", row);
    }

    getStandard(row) {
        return this._getField("Standard", row);
    }

    _getField(header, row) {
        let content = this.getSyn();
        if (row >= 15 && row <= 29) {
            content = this.getCHTheRW();
        }
        if (row >= 30 && row <= 44) {
            content = this.getWordAssoc();
        }
        row = row % 15;
        return this.getExactlyFieldOfRow(header, content[row]);
    }

    getQuestionHTML(row) {
        return `<div class="question-questionStem question-questionStem-1-column ">
                    <div class="question-stem-content">${this.getItems(row)}
                        <div cid="${this.getCID(row)}" ctype="MultipleChoice" layout="Vertical" qname="a${row + 1}" subtype="MC">
                            ${this.getOptionHTML(row)}
                        </div>
                    </div>
                </div>`;
    }

    getItems(row) {
        const searchValue = "[WOL]";
        const replaceValue = "______"; // "_" x6
        return this._getField("Item", row).replace(searchValue, replaceValue);
    }

    getOptionHTML(row) {
        const answerChoices = this.getAnswerChoices(row);
        const step1 = answerChoices.split(";");
        const step2 = step1.map((value) => value.split(".")[1].trim());
        return step2.map((value, index) => `<div itemid="${String.fromCharCode(index + 97)}" itemlabel="">${value}</div>`).join("");
    }

    getCorrectAnswer(row) {
        // {"comps":[{"id":"802916_g6_cml1_q1_ans01","value":"a","type":"MultipleChoice"}]}
        const correctAnswer = {
            comps: [
                {
                    id: this.getCID(row),
                    value: this.getCorrectAnswerValue(row),
                    type: "MultipleChoice"
                }
            ]
        };
        return JSON.stringify(correctAnswer);
    }

    getCorrectTextHTML(row) {
        return this.getCorrectAnswerValue(row);
    }

    getCorrectAnswerValue(row) {
        const correctAnswer = this._getField("Correct Answer", row);
        return correctAnswer.split(".")[0].trim();
    }

    getAnswerChoices(row) {
        return this._getField("Answer Choices", row);
    }
}