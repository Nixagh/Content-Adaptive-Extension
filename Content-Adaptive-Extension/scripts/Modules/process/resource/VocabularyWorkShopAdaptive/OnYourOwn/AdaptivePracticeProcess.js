class AdaptivePracticeProcess extends VWAProcess {
    adType = {
        A: 'A',
        B: 'B',
        GO: 'GO'
    }

    getDescription() {
        return 'OYO_AP';
    }

    getFullContent() {
        const adaptivePractice = this.getAdaptivePracticeSheet();
        const wordLists = this.getWordListSheet();
        return {first: adaptivePractice, second: wordLists};
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
        return this.getField("Direction Line", 0);
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
        return this.getFieldOfRow("Direction Line", this.getGoTicketSheet()[row]);
    }

    getSetType(row) {
        return row > 23 ? this.adType.GO : row > 11 && row < 24 ? this.adType.B : this.adType.A;
    }

    getAdaptiveAnswerCount() {
        return 1;
    }

    getQuestionHTML(row) {
        let adaptiveType = this.getSetType(row);
        row = row % 12;

        return `<div adaptivetype="${adaptiveType}" class="question-questionStem question-questionStem-1-column">
                    <div class="question-stem-content">
                    ${adaptiveType === this.adType.GO ? `<div class="whatItMeans">${this.getMeanOfGo(row)}</div>` : ''}
                        <div class="question">${adaptiveType === this.adType.GO ? this.getItemOfGo(row) : adaptiveType === this.adType.A ? this.getItem(row) : this.getItemOfB(row)}
                            <div cid="${this.getCID(row)}" ctype="MultipleChoice" layout="Vertical" qname="a${row + 1}" subtype="MC" total="${this.getTotalOfOption(adaptiveType)}">
                                ${adaptiveType === this.adType.GO ? this.getOptionsHTMLOfGo(row) : adaptiveType === this.adType.A ? this.getOptionsHTML() : this.getOptionsHTMLSetB(row)}
                            </div>
                        </div>
                    </div>
                </div>`;
    }


    getItem(row) {
        return this.getExactlyField("Item", row);
    }

    getItemOfB(row) {
        return this.getExactlyField("Adaptive Item", row);
    }

    getTotalOfOption(adaptiveType) {
        return adaptiveType === this.adType.A ? 12 : 4;
    }

    getOptionsHTMLSetB(row) {
        const data = this.getField("Adaptive Item Answer Choices", row);
        const options = data.split(";").filter(row => row.length > 0).map(row => row.trim());
        if (options.length === 0) this.addError(`Question Content`, `Adaptive Item Answer Choices: Row ${row + 1} is empty`);
        if (options.length !== 4) this.addError(`Question Content`, `Adaptive Item Answer Choices: Row ${row + 1} must have 4 options`);

        return options.map((option, index) => `<div itemid="${String.fromCharCode(97 + index)}" itemlabel="" word="${this.getWordIDWithWord(option)}">${option}</div>`).join('');
    }

    getWordIDWithWord(word) {
        return this.data.find(row => Utility.equalsWordId(row["Word"], word))["Word ID"].trim();
    }

    getOptionsHTML() {
        const data = this.getOptions();
        return data.map(row => `<div itemid="${row.itemid}" itemlabel="" word="${row.word}">${row.value}</div>`).join('');
    }

    getOptions() {
        return this.data.map((row, index) => {
            return {
                "itemid": String.fromCharCode(97 + index),
                word: row["Word ID"],
                value: row["Word"]
            }
        });
    }

    getMeanOfGo(row) {
        const mean = this.getFieldOfRow("What It Means", this.getGoTicketSheet()[row]);
        return mean.trim();
    }

    getItemOfGo(row) {
        return this.getExactlyFieldOfRow("Item", this.getGoTicketSheet()[row]);
    }

    getOptionsHTMLOfGo(row) {
        const options = this.getAnswerGoList(row);
        if (options.length === 0) this.addError(`Question Content`, `Answer choices: Row ${row + 1} is empty`);
        if (options.length !== 4) this.addError(`Question Content`, `Answer choices: Row ${row + 1} must have 4 options`);
        return options.map((option, index) => `<div itemid="${String.fromCharCode(97 + index)}" itemlabel="">${option}</div>`).join('');
    }

    getAnswerGoList(row) {
        const answer = this.getFieldOfRow("Answer choices", this.getGoTicketSheet()[row]);
        return answer.split(";").filter(row => row.length > 0).map(row => row.replaceAll(`"`, "").trim());
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
        const options = this.getAnswerGoList(row);
        const correctAnswer = this.getFieldOfRow("Correct Answer", this.getGoTicketSheet()[row]);
        return String.fromCharCode(97 + options.indexOf(correctAnswer.replaceAll(`"`, "").trim()));
    }

    getCorrectAnswerValueOfSetB(row) {
        const data = this.getField("Adaptive Item Answer Choices", row);
        const options = data.split(";").filter(row => row.length > 0).map(row => row.trim());
        const correctAnswer = this.getExactlyField("Adaptive Item Correct Answer", row);
        return String.fromCharCode(97 + options.indexOf(correctAnswer.replaceAll(`"`, "").trim()));
    }

    getCorrectAnswerValueOfSetA(row) {
        const options = this.getOptions();
        const correctAnswer = this.getExactlyFieldOfRow("Correct Answer", row);
        return options.find(option => option.value === correctAnswer).itemid;
    }

    getFeedback(row) {
        let newRowValue = row % 12;
        if (row > 23) {
            const wordIdInGo = this.getFieldOfRow("Word ID", this.getGoTicketSheet()[newRowValue]);
            newRowValue = this.data.findIndex(row => Utility.equalsWordId(row["Word ID"], wordIdInGo));
        }
        const feedback = {
            "correctFeedback": this.getCorrectFeedback(newRowValue),
            "incorrectFeedback": this.getIncorrectFeedback(newRowValue),
            "correctEmoji": this.getCorrectEmoji(newRowValue),
            "incorrectEmoji": this.getIncorrectEmoji(newRowValue)
        }
        return JSON.stringify(feedback);
    }

    getCorrectFeedback(row) {
        const correctFeedback = this.getField("Correct Feedback", row);
        const wordId = this.getField("Word ID", row);
        return this.toArray(correctFeedback.replace(`<${wordId}>`, `<${wordId}>${wordId}:`));
    }

    getIncorrectFeedback(row) {
        const incorrectFeedback = this.getField("Incorrect Feedback", row);
        const replaceValue = '<b>{0}</b>';

        const firstIndex = incorrectFeedback.indexOf("[");
        const lastIndex = incorrectFeedback.indexOf("]");
        const word = incorrectFeedback.substring(firstIndex + 1, lastIndex);
        return this.toArray(incorrectFeedback.replace(`[${word}]`, replaceValue));
    }

    getCorrectEmoji(row) {
        const correctEmoji = this.getField("Correct emoji and growth mindset phrases randomly shown:", 0);
        return this.toArray(correctEmoji);
    }

    getIncorrectEmoji(row) {
        const incorrectEmoji = this.getField("Incorrect emoji for feedback 1 and growth mindset phrases randomly shown:", 0);
        return this.toArray(incorrectEmoji);
    }

    toArray(content) {
        return content.split("\n").filter(row => row.trim().length > 0).map(row => row.trim());
    }

    getWordId(row) {
        if (row > 23) return this.getFieldOfRow("Word ID", this.getGoTicketSheet()[row % 12]);
        return this.getField("Word ID", row % 12);
    }

    getPathway1(row) {
        let newRowValue = row % 12;
        if (row > 23) {
            const wordIdInGo = this.getFieldOfRow("Word ID", this.getGoTicketSheet()[newRowValue]);
            newRowValue = this.data.findIndex(row => Utility.equalsWordId(row["Word ID"], wordIdInGo));
        }
        return this.getField("P1 Set", newRowValue);
    }

    getPathway2(row) {
        let newRowValue = row % 12;
        if (row > 23) {
            const wordIdInGo = this.getFieldOfRow("Word ID", this.getGoTicketSheet()[newRowValue]);
            newRowValue = this.data.findIndex(row => Utility.equalsWordId(row["Word ID"], wordIdInGo));
        }
        return this.getField("P2 Set", newRowValue);
    }

    getStandard(row) {
        let newRowValue = row % 12;
        if (row > 23) {
            const wordIdInGo = this.getFieldOfRow("Word ID", this.getGoTicketSheet()[newRowValue]);
            newRowValue = this.data.findIndex(row => Utility.equalsWordId(row["Word ID"], wordIdInGo));
        }
        return this.getField("Standard", newRowValue);
    }
}