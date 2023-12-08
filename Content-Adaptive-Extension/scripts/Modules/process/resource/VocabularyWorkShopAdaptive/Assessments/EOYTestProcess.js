class EOYTestProcess extends VWAProcess {
    getDescription() {
        return `EOY_g${this.getGrade()}`;
    }

    // getRow() {
    //     const row = parseInt(document.getElementById(Ids.questionNumber).value) - this.rowMinus;
    //     const limit = 15;
    //     return row % limit;
    // }

    getCID(row) {
        return `${this.getGlobalResourceId()}_${this.getDescription()}_q${this.convertDigit(this.getQuestionNumber(row))}_ans01`;
    }

    getGrade() {
        const globalResourceId = this.getGlobalResourceId();
        return globalResourceId[globalResourceId.length - 1];
    }

    getFullContent() {
        const synonymSheet = this.getSynonymSheet();
        const chTheRWSSheet = this.getChTheRWSSheet();
        const wordAssociationSheet = this.getWordAssociationSheet();
        return {
            first: [{
                "syn": synonymSheet,
                "chTheRWS": chTheRWSSheet,
                "wordAssoc": wordAssociationSheet
            }],
            second: []
        }
    }

    mapping({first, second}) {
        return first;
    }

    getSynonymSheet() {
        const synonymSheetName = `Synonyms`;
        const synonymSheet = this.getSheet(synonymSheetName);
        const synonymHeader = this.getHeader(synonymSheet);
        return this.getContent(synonymSheet, synonymHeader);
    }

    getChTheRWSSheet() {
        const chTheRWSSheetName = `ChtheRW2`;
        const chTheRWSSheet = this.getSheet(chTheRWSSheetName);
        const chTheRWSHeader = this.getHeader(chTheRWSSheet);
        return this.getContent(chTheRWSSheet, chTheRWSHeader);
    }

    getWordAssociationSheet() {
        const wordAssociationSheetName = `WordAssoc`;
        const wordAssociationSheet = this.getSheet(wordAssociationSheetName);
        const wordAssociationHeader = this.getHeader(wordAssociationSheet);
        return this.getContent(wordAssociationSheet, wordAssociationHeader);
    }

    getSyn() {
        return this.data[0]["syn"];
    }

    getChTheRWS() {
        return this.data[0]["chTheRWS"];
    }

    getWordAssoc() {
        return this.data[0]["wordAssoc"];
    }

    getComponentScoreRules(row) {
        //{"test":null,"scoringGroups":[{"componentGradingRules":[{"componentId":"802916_g6_q1_ans01","componentType":"MultipleChoice","componentSubtype":null,"autoScore":true,"rubricRule":null}],"maxScore":1}]}
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
                    maxScore: this.getMaxScore()
                }
            ],
        }
        return JSON.stringify(componentScoreRules);
    }

    getPassageContent(row) {
        // if (row >= 0 && row <= 14) {
        //     return "<I>Choose the word or phrase that most nearly expresses the meaning of the word in boldface type in each phrase.</I>"
        // }
        // if (row >= 15 && row <= 29) {
        //     return "<i>Choose the word that best completes the sentence.</i>"
        // }
        // return "<i>Select the word or phrase that best completes the sentence or answers the question.</i>";
        return '';
    }

    getQuestionHTML(row) {
        let content = this.getWordAssoc();
        if (row >= 0 && row <= 14) {
            content = this.getSyn();
        }
        if (row >= 15 && row <= 29) {
            content = this.getChTheRWS();
        }
        const newRow = row % 15;
        let item = this.getItem(newRow, content);
        let option = this.getOptionHTML(newRow, content);

        return `<div class="question-questionStem question-questionStem-1-column">
                    <div class="question-stem-content">${item}
                        <div cid="${this.getCID(row)}" ctype="MultipleChoice" layout="Vertical" qname="a${row + 1}" subtype="MC">
                            ${option}
                        </div>
                    </div>
                </div>`;
    }

    getItem(row, content) {
        return this.getExactlyFieldOfRow("Item", content[row % 15]).replace(/\[WOL]/, "______");
    }

    getOptionHTML(row, content) {
        const options = this.getOptions(row, content);
        return options.map((option, index) => `<div itemid="${String.fromCharCode(index + 97)}" itemlabel="">${option}</div>`).join("");
    }

    getOptions(row, content) {
        return this.getAnswerChoices(row, content).map((option) => option.split(/[abcd]\. /)[1].trim());
    }

    getAnswerChoices(row, content) {
        const answerChoices = this.getExactlyFieldOfRow("Answer Choices", content[row]);
        return answerChoices.split(";");
    }

    getCorrectAnswer(row) {
        // {"comps":[{"id":"802916_g6_q1_ans01","value":"a","type":"MultipleChoice"}]}


        return this.getCorrectAnswerContent(row);
    }

    getCorrectAnswerContent(row) {
        let content = this.getWordAssoc();

        if (row >= 0 && row <= 14) {
            content = this.getSyn();
        }

        if (row >= 15 && row <= 29) {
            content = this.getChTheRWS();
        }
        const newRow = row % 15;
        const correctAnswer = {
            comps: [
                {
                    id: this.getCID(row),
                    value: this.getCorrectAnswerValue(newRow, content),
                    type: "MultipleChoice"
                }
            ]
        }
        return JSON.stringify(correctAnswer);
    }

    getCorrectTextHTML(row) {
        let content = this.getWordAssoc();

        if (row >= 0 && row <= 14) {
            content = this.getSyn();
        }

        if (row >= 15 && row <= 29) {
            content = this.getChTheRWS();
        }
        return this.getCorrectAnswerValue(row % 15, content);
    }


    getCorrectAnswerValue(row, content) {
        const correctAnswer = this.getFieldOfRow("Correct Answer", content[row]);
        return correctAnswer.split(".")[0].toLowerCase();
    }

    // ------------------ get field ------------------ //
    getDirectionLineHTML(row) {
        let content = this.getWordAssoc();

        if (row >= 0 && row <= 14) {
            content = this.getSyn();
        }

        if (row >= 15 && row <= 29) {
            content = this.getChTheRWS();
        }
        return this.getDirectionLine(content[row % 15]);
    }

    getDirectionLine(row) {
        return this.getFieldOfRow("Direction Line", row);
    }

    getWordId(row) {
        let content = this.getWordAssoc();

        if (row >= 0 && row <= 14) {
            content = this.getSyn();
        }

        if (row >= 15 && row <= 29) {
            content = this.getChTheRWS();
        }
        return this.getFieldOfRow("Word ID", content[row % 15]);
    }

    getStandard(row) {
        let content = this.getWordAssoc();

        if (row >= 0 && row <= 14) {
            content = this.getSyn();
        }

        if (row >= 15 && row <= 29) {
            content = this.getChTheRWS();
        }
        return this.getFieldOfRow("Standard", content[row % 15]);
    }

    getPathway1(row) {
        return '';
    }

    getPathway2(row) {
        return '';
    }

    // ------------------ other process ------------------ //
}