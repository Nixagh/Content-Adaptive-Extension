class AdaptivePracticeProcess extends VWAProcess {
    adType = {
        A: 'A',
        B: 'B',
        GO: 'GO'
    }

    getDescription() {
        return 'OYO_AP';
    }

    getLengthData() {
        return 36;
    }

    getFullContent() {
        const adaptivePractice = this.getAdaptivePracticeSheet();
        const goTicket = this.getGoTicketSheet();
        const wordLists = this.getWordListSheet();

        const setA = this.getSetA(super.mapping({first: adaptivePractice, second: wordLists}));
        const setB = this.getSetB(super.mapping({first: adaptivePractice, second: wordLists}));
        const go = super.mapping({first: goTicket, second: wordLists});

        return {
            first: [{
                setA: setA,
                setB: setB,
                go: go
            }], second: []
        };
    }

    mapping({first, second}) {
        return first[0];
    }

    getAdaptivePracticeSheet() {
        const adaptivePracticeSheetName = 'Adaptive Practice';
        const adaptivePracticeSheet = this.getSheet(adaptivePracticeSheetName);
        const header = this.getHeader(adaptivePracticeSheet);
        return this.getContent(adaptivePracticeSheet, header);
    }

    getGoTicketSheet() {
        const goTicketSheetName = 'GO Ticket';
        const goTicketSheet = this.getSheet(goTicketSheetName);
        const header = this.getHeader(goTicketSheet);
        return this.getContent(goTicketSheet, header);
    }

    getSetA(adaptivePractice) {
        return adaptivePractice.map((row) => {
            return {
                "Word ID": this.getFieldOfRow("Word ID", row),
                "Word": this.getExactlyFieldOfRow("Word", row),
                "Item": this.getExactlyFieldOfRow("Item", row),
                "Answer Choices": this.getFieldOfRow("Answer Choices", row),
                "Correct Answer": this.getFieldOfRow("Correct Answer", row),
                "Correct Emoji": this.getFieldOfRow("Correct emoji and growth mindset phrases randomly shown:", row),
                "Incorrect Emoji": this.getFieldOfRow("Incorrect emoji for feedback 1 and growth mindset phrases randomly shown:", row),
                "Correct Feedback": this.getFieldOfRow("Correct Feedback", row),
                "Incorrect Feedback": this.getFieldOfRow("Incorrect Feedback", row),
                "P1 Set": this.getFieldOfRow("P1 Set", row),
                "P2 Set": this.getFieldOfRow("P2 Set", row),
                "Standard": this.getFieldOfRow("Standard", row),
            }
        });
    }

    getSetB(adaptivePractice) {
        return adaptivePractice.map((row) => {
            return {
                "Word ID": this.getFieldOfRow("Word ID", row),
                "Word": this.getExactlyFieldOfRow("Word", row),
                "Adaptive Item": this.getFieldOfRow("Adaptive Item", row),
                "Adaptive Item Answer Choices": this.getFieldOfRow("Adaptive Item Answer Choices", row),
                "Adaptive Item Correct Answer": this.getFieldOfRow("Adaptive Item Correct Answer", row),
                "Adaptive Item Correct Feedback": this.getFieldOfRow("Adaptive Item Correct Feedback", row),
                "Adaptive Item Incorrect Feedback": this.getFieldOfRow("Adaptive Item Incorrect Feedback", row),
                "P1 Set": this.getFieldOfRow("P1 Set", row),
                "P2 Set": this.getFieldOfRow("P2 Set", row),
                "Standard": this.getFieldOfRow("Standard", row),
            }
        });
    }

    getComponentScoreRules(row) {
        //{"test":null,"scoringGroups":[{"componentGradingRules":[{"componentId":"802909_oyo_ap_u1_q1_ans1","componentType":"MultipleChoice","componentSubtype":null,"autoScore":true,"rubricRule":null}],"maxScore":1}]}
        const componentScoreRules = {
            "test": null,
            "scoringGroups": [{
                "componentGradingRules": [{
                    "componentId": this.getCID(row),
                    "componentType": "MultipleChoice",
                    "componentSubtype": null,
                    "autoScore": true,
                    "rubricRule": null
                }],
                "maxScore": 1
            }]
        }

        return JSON.stringify(componentScoreRules);
    }

    getDirectionLineHTML(row) {
        return `<i>Select the word that is closest in meaning to the boldface word(s) in the sentence. You will use each word only one time.</i>`;
    }

    setPassage(row) {
        const directionLine = new Cke("cke_directionLine");
        const passageContent = new Cke("cke_2_contents");
        const passageSummary = new Cke("cke_3_contents");
        const choosePassage = document.querySelectorAll("#questionTypeSelection")[1];

        if (row !== 0 && row !== 24) {
            const index = row > 23 ? 2 : 1;
            choosePassage.value = choosePassage.options[index].value;
            this.getAjaxPassage(choosePassage.value).then(result => {
                directionLine.setHtml(result.directionLineHTML);
                passageContent.setHtml(result.passageContentHTML);
                passageSummary.setHtml(result.passageSummaryHTML);
            });
        } else {
            directionLine.setHtml(row === 0 ? this.getDirectionLineHTML(row) : this.getDirectionLineHTMLOfGo(row % 12));
            passageContent.setHtml(this.getPassageContent(row));
            passageSummary.setHtml(this.getPassageSummaryText(row));
        }
        console.log("Set passage");
    }

    getDirectionLineHTMLOfGo(row) {
        return `<i>Use the information provided to complete the GO Ticket.</i>`;
    }

    getSetType(row) {
        return row > 23 ? this.adType.GO : row > 11 && row < 24 ? this.adType.B : this.adType.A;
    }

    getDataRow(type) {
        return type === this.adType.GO ? this.data.go : type === this.adType.A ? this.data.setA : this.data.setB;
    }

    getAdaptiveAnswerCount() {
        return 1;
    }

    getQuestionHTML(rowNumber) {
        let adaptiveType = this.getSetType(rowNumber);
        const newRowNumber = rowNumber % 12;
        const row = this.getDataRow(adaptiveType);

        return `<div adaptivetype="${adaptiveType}" class="question-questionStem question-questionStem-1-column">
                    <div class="question-stem-content">
                    ${adaptiveType === this.adType.GO ? `<div class="whatItMeans">${this.getMeanOfGo(row[newRowNumber])}</div>` : ''}
                        <div class="question">${this.getItemQuestion(row[newRowNumber], adaptiveType)}
                            <div cid="${this.getCID(rowNumber)}" ctype="MultipleChoice" layout="Vertical" qname="a${rowNumber + 1}" subtype="MC" total="${this.getTotalOfOption(adaptiveType)}">
                                ${this.getOptionsQuestionHTML(row[newRowNumber], adaptiveType)}
                            </div>
                        </div>
                    </div>
                </div>`;
    }

    getItemQuestion(row, adaptiveType) {
       return adaptiveType === this.adType.GO ? this.getItemOfGo(row) : adaptiveType === this.adType.A ? this.getItem(row) : this.getItemOfB(row);
    }

    getOptionsQuestionHTML(row, adaptiveType) {
        return adaptiveType === this.adType.GO ? this.getOptionsHTMLOfGo(row) : adaptiveType === this.adType.A ? this.getOptionsHTML() : this.getOptionsHTMLSetB(row)
    }

    getItem(row) {
        return this.getFieldOfRow("Item", row);
    }

    getItemOfB(row) {
        return this.getFieldOfRow("Adaptive Item", row)
            || this.getFieldOfRow("Adaptive Item \n"
            + "[Pick up sentence from column F; change synonym to simpler/more familiar one.]", row);
    }

    getTotalOfOption(adaptiveType) {
        return adaptiveType === this.adType.A ? 12 : 4;
    }

    getOptionsHTMLSetB(row) {
        const data = this.getFieldOfRow("Adaptive Item Answer Choices", row);
        const options = data.split(";").filter(row => row.length > 0).map(row => row.trim());
        if (options.length === 0) this.addError(`Question Content`, `Adaptive Item Answer Choices: Row ${row + 1} is empty`);
        if (options.length !== 4) this.addError(`Question Content`, `Adaptive Item Answer Choices: Row ${row + 1} must have 4 options`);

        return options.map((option, index) => `<div itemid="${String.fromCharCode(97 + index)}" itemlabel="" word="${this.getWordIDWithWord(option)}">${option}</div>`).join('');
    }

    getWordIDWithWord(word) {
        const data = this.getOptions();
        const _word = data.find(row => row.value === word);
        if (_word) return _word.word;
        this.addError("Question Content", `Word ID not found with word: ${word}`);
        return "";
    }

    getOptionsHTML() {
        const data = this.getOptions();
        if (data.length === 0) this.addError(`Question Content`, `Options: Row ${row + 1} is empty`);
        if (data.length !== 12) this.addError(`Question Content`, `Options: Row ${row + 1} must have 12 options`);
        return data.map(row => `<div itemid="${row.itemid}" itemlabel="" word="${row.word}">${row.value}</div>`).join('');
    }

    getOptions() {
        return this.data.setA.map((row, index) => {
            return {
                "itemid": String.fromCharCode(97 + index),
                word: row["Word ID"],
                value: row["Word"]
            }
        });
    }

    getMeanOfGo(row) {
        const mean = this.getFieldOfRow("What It Means", row);
        return mean.trim();
    }

    getItemOfGo(row) {
        return this.getExactlyFieldOfRow("Item", row);
    }

    getOptionsHTMLOfGo(row) {
        const options = this.getAnswerGoList(row);
        return options.map((option, index) => `<div itemid="${String.fromCharCode(97 + index)}" itemlabel="">${option}</div>`).join('');
    }

    getAnswerGoList(row) {
        const answer = this.getFieldOfRow("Answer choices", row);
        const options = Utility.splitStringBySemi(answer).map(row => row.trim());
        if (options.length === 0) this.addError(`Question Content`, `Answer choices: Row ${row + 1} is empty`);
        if (options.length !== 4) this.addError(`Question Content`, `Answer choices: Row ${row + 1} must have 4 options`);
        return options;
    }

    getCorrectAnswer(row) {
        //{"comps":[{"id":"802909_oyo_ap_u1_q1_ans1","value":"a","type":"MultipleChoice"}]}
        const correctAnswer = {
            "comps": [{
                "id": this.getCID(row),
                "value": this.getCorrectAnswerValue(row),
                "type": "MultipleChoice"
            }]
        }
        return JSON.stringify(correctAnswer);
    }

    getCorrectTextHTML(row) {
        return this.getCorrectAnswerValue(row);
    }

    getCorrectAnswerValue(row) {
        const newRowValue = row % 12;
        if (row > 23) return this.getCorrectAnswerValueOfGo(newRowValue);
        if (row > 11 && row < 24) return this.getCorrectAnswerValueOfSetB(newRowValue);
        return this.getCorrectAnswerValueOfSetA(newRowValue);
    }

    getCorrectAnswerValueOfGo(row) {
        try {
            const options = this.getAnswerGoList(this.data.go[row]);
            const correctAnswer = this.getFieldOfRow("Correct Answer", this.data.go[row]);
            return String.fromCharCode(97 + options.indexOf(correctAnswer.trim()));
        } catch (e) {
            this.addError("QuestionContent", `set Go correct answer: some thing wrong at row ${row + 1}`);
            return "";
        }
    }

    getCorrectAnswerValueOfSetB(row) {
        try {
            const data = this.getFieldOfRow("Adaptive Item Answer Choices", this.data.setB[row]);
            const options = Utility.splitStringBySemi(data).map(row => row.trim());
            const correctAnswer = this.getExactlyFieldOfRow("Adaptive Item Correct Answer", this.data.setB[row]);
            return String.fromCharCode(97 + options.indexOf(correctAnswer.trim()));
        } catch (e) {
            this.addError("QuestionContent", `set B correct answer: some thing wrong at row ${row + 1}`);
            return "";
        }
    }

    getCorrectAnswerValueOfSetA(row) {
        try {
            const options = this.getOptions();
            const correctAnswer = this.getExactlyFieldOfRow("Correct Answer", this.data.setA[row]);
            return options.find(option => option.value === correctAnswer).itemid;
        } catch (e) {
            this.addError("QuestionContent", `set A correct answer: some thing wrong at row ${row + 1}`);
            return "";
        }
    }

    getFeedback(rowNumber) {
        // let newRowValue = row % 12;
        if (rowNumber > 23) return '';
        let row = this.data.setA;
        if (rowNumber > 11 && rowNumber < 24) row = this.data.setB;

        const feedback = {
            "correctFeedback": this.getCorrectFeedback(row, rowNumber),
            "incorrectFeedback": this.getIncorrectFeedback(row, rowNumber),
            "correctEmoji": this.getCorrectEmoji(row),
            "incorrectEmoji": this.getIncorrectEmoji(row)
        }
        return JSON.stringify(feedback);
    }

    getCorrectFeedback(row, rowNumber) {
        const newRowValue = rowNumber % 12;
        const correctFeedback = rowNumber > 11 ? this.getFieldOfRow("Adaptive Item Correct Feedback", row[newRowValue]) : this.getFieldOfRow("Correct Feedback", row[newRowValue]);
        return this.toArray(this.wordIdConverter(correctFeedback));
    }

    getIncorrectFeedback(row, rowNumber) {
        const newRowValue = rowNumber % 12;
        const incorrectFeedback = rowNumber > 11 ? this.getFieldOfRow("Adaptive Item Incorrect Feedback", row[newRowValue]) : this.getFieldOfRow("Incorrect Feedback", row[newRowValue]);
        const replaceValue = '<b>{0}</b>';
        const regex = /\[(.*)[\]|>]/g;
        const matches = incorrectFeedback.match(regex);
        if (matches) {
            const replaceSearch = matches[0];
            return this.toArray(incorrectFeedback.replace(replaceSearch, replaceValue));
        }
        this.addError("Incorrect Feedback", `Row ${rowNumber + 1} must have [Insert incorrect chosen]`);
        return this.toArray(incorrectFeedback);
    }

    getCorrectEmoji(row) {
        return ["Great job!","Way to go!","You did it!","Terrific!"];
    }

    getIncorrectEmoji(row) {
        return ["You can do this!","Keep practicing!","Keep trying.","Nice try!","Try another way."];
    }

    toArray(content) {
        return content.split("\n").filter(row => row.trim().length > 0).map(row => row.trim());
    }

    getWordId(row) {
        const rowData = this.getDataRow(this.getSetType(row))[row % 12];
        return this.getFieldOfRow("Word ID", rowData);
    }

    getPathway1(row) {
        const rowData = this.getDataRow(this.getSetType(row))[row % 12];
        return this.getFieldOfRow("P1 Set", rowData);
    }

    getPathway2(row) {
        const rowData = this.getDataRow(this.getSetType(row))[row % 12];
        return this.getFieldOfRow("P2 Set", rowData);
    }

    getStandard(row) {
        const rowData = this.getDataRow(this.getSetType(row))[row % 12];
        return this.getFieldOfRow("Standard", rowData);
    }
}