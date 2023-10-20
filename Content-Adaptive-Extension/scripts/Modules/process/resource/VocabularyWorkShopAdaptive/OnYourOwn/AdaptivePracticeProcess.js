class AdaptivePracticeProcess extends VWAProcess {
    getDescription() {
        return 'OYO_AP';
    }

    getFullContent() {
        const wordLists = this.getWordListSheet();
        const adaptivePractice = this.getAdaptivePracticeSheet();

        return adaptivePractice.map(row => {
            const wordList = wordLists.find(wordList => wordList["WordID"] === row["Word ID"]);
            return {
                ...wordList,
                ...row
            }
        })
    }

    getAdaptivePracticeSheet() {
        const adaptivePracticeSheetName = 'Adaptive Practice';
        const adaptivePracticeSheet = this.getSheet(adaptivePracticeSheetName);
        const header = this.getHeader(adaptivePracticeSheet);
        return this.getContent(adaptivePracticeSheet, header);
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

    getSetType() {
        return 'A';
    }

    getAdaptiveAnswerCount() {
        return 1;
    }

    getQuestionHTML(row) {
        return `<div adaptivetype="A" class="question-questionStem question-questionStem-1-column">
                    <div class="question-stem-content">
                        <div class="question">${this.getItem(row)}
                            <div cid="${this.getCID(row)}" ctype="MultipleChoice" layout="Vertical" qname="a${row + 1}" subtype="MC" total="12">
                                ${this.getOptionsHTML()}
                            </div>
                        </div>
                    </div>
                </div>`;
    }

    getItem(row) {
        return this.getExactlyField("Item", row);
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
        const correctAnswer = this.getField("Correct Answer", row);
        return this.getOptions().find(option => option.value === correctAnswer).itemid;
    }

    getFeedback(row) {
        const feedback = {
            "correctFeedback": this.getCorrectFeedback(row),
            "incorrectFeedback": this.getIncorrectFeedback(row),
            "correctEmoji": this.getCorrectEmoji(row),
            "incorrectEmoji": this.getIncorrectEmoji(row)
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
        return content.split("\n").filter(row => row.length > 0).map(row => row.trim());
    }
}