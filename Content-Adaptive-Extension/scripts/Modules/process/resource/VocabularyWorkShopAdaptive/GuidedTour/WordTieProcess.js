class WordTieProcess extends VWAProcess {
    getDescription() {
        return "GT_WT";
    }

    getFullContent() {
        const wordListSheet = this.getWordListSheet();
        const wordTieSheet = this.getWordTieSheet();

        return wordTieSheet.map(row => {
            const word = wordListSheet.find(wordRow => Utility.equalsWordId(wordRow["WordID"], row["Word ID"]));
            return {
                ...word,
                ...row
            }
        })
    }

    getWordTieSheet() {
        const wordTieSheetName = `WordTies`;
        const wordTieSheet = this.getSheet(wordTieSheetName);
        const wordTieHeader = this.getHeader(wordTieSheet);
        return this.getContent(wordTieSheet, wordTieHeader);
    }

    getComponentScoreRules(row) {
        //{"test":null,"scoringGroups":[{"componentGradingRules":[{"componentId":"802906_GT_WT_u05_q01_ans01","componentType":"MultipleChoice","componentSubtype":null,"autoScore":true,"rubricRule":null}],"maxScore":1}]}
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

    getAdaptiveAnswerCount() {
        return 2;
    }

    getDirectionLineHTML(row) {
        return this.getField("Direction Line", 0);
    }

    getQuestionHTML(row) {
        return `<div class="question-questionStem question-questionStem-1-column">
                    <div class="question-stem-content">
                    <div class="question">${this.getItem(row)}
                        <br />
                        <div cid="${this.getCID(row)}" ctype="MultipleChoice" layout="Vertical" qname="a${row + 1}" subtype="MSC">
                                ${this.getOptionHTML(row)}
                        </div>
                    </div>
                    </div>
                </div>`;
    }

    getItem(row) {
        return this.getExactlyField("Item", row);
    }

    getOptionHTML(row) {
        const answerChoices = this.getAnswerChoices(row);
        return answerChoices.map((choice, index) => `<div itemid="${String.fromCharCode(index + 97)}" itemlabel="">${choice.replace(`"`, "").trim()}</div>`)
            .join("");
    }

    getAnswerChoices(row) {
        const answerChoices = this.getField("Answer Choices", row);
        const answerChoicesArray = answerChoices.split(";");
        if (answerChoicesArray.length === 0 || answerChoicesArray.length !== 4) {
            return alert("Answer Choices is empty or not equal to 4");
        }
        return answerChoicesArray.map(choice => choice.trim());
    }

    getCorrectAnswer(row) {
        //{"comps":[{"id":"802906_GT_WT_u05_q01_ans01","value":"a,c","type":"MultipleChoice"}]}
        const correctAnswer = {
            comps: [
                {
                    id: this.getCID(row),
                    value: this.getCorrectAnswerValue(row),
                    type: "MultipleChoice"
                }
            ]
        }
        return JSON.stringify(correctAnswer);
    }

    getCorrectTextHTML(row) {
        return this.getCorrectAnswerValue(row);
    }

    getCorrectAnswerValue(row) {
        const correctAnswer = this.getField("Correct Answer", row);
        const correctAnswerArray = correctAnswer.split(";").map(answer => {
            const _ = answer.trim();
            if(_[0] === `"` && _[_.length - 1] !== `"`) return `${_}"`;
            if(_[0] !== `"` && _[_.length - 1] === `"`) return `"${_}`;
            return _;
        });
        const answerChoices = this.getAnswerChoices(row);

        const correctAnswerIndexArray = correctAnswerArray.map(answer => answerChoices.indexOf(answer));

        return correctAnswerIndexArray.map(index => String.fromCharCode(index + 97)).join(",");
    }

    getFeedback(row) {
        const feedback = {
            "correctFeedback": this.getCorrectFeedback(row),
            "incorrectFeedback1": this.getIncorrectFeedback1(row),
            "incorrectFeedback2": this.getIncorrectFeedback2(row),
            "incorrectFeedback3": this.getIncorrectFeedback3(row),
            "incorrectFeedback4": this.getIncorrectFeedback4(row),
            "correctEmoji": this.getCorrectEmoji(row),
            "incorrectEmoji1": this.getIncorrectEmoji1(row),
            "incorrectEmoji2": this.getIncorrectEmoji2(row),
            "incorrectEmoji3": this.getIncorrectEmoji3(row),
            "incorrectEmoji4": this.getIncorrectEmoji4(row)
        }
        return JSON.stringify(feedback);
    }

    getCorrectFeedback(row) {

    }

    getIncorrectFeedback1(row) {
        const incorrectFeedback = this.getExactlyField("Incorrect Feedback 1 to use when all correct answers are chosen on first try but also at least one incorrect answer is chosen. Students do not get a second try.", row);
        const wordId = this.getField("Word ID", row);
        return this.hover(incorrectFeedback, wordId);
    }

    getIncorrectFeedback2(row) {
        const incorrectFeedback = this.getExactlyField("Incorrect Feedback 1 to use when none of the student's choices on first try were correct.", row);
        const wordId = this.getField("Word ID", row);
        return this.hover(incorrectFeedback, wordId);
    }

    getIncorrectFeedback3(row) {
        const incorrectFeedback = this.getExactlyField("Incorrect Feedback 1 to use when not all of the correct answers were chosen on the first try. This is also for when the student chooses only one answer, and it is correct.", row);
        const wordId = this.getField("Word ID", row);
        return this.hover(incorrectFeedback, wordId);
    }

    getIncorrectFeedback4(row) {
        const incorrectFeedback = this.getExactlyField("Final incorrect feedback for students who had a second try.", row);
        const wordId = this.getField("Word ID", row);
        return this.hover(incorrectFeedback, wordId);
    }

    hover(context, wordId) {
        return context.replace(`<${wordId}>`, `<${wordId}>$${wordId}:`).split("\n").filter(value => value !== "");
    }

    getCorrectEmoji(row) {
        const correctEmoji = this.getExactlyField("Correct emoji with feedback phrases randomly selected.", 0);
        return this.toArray(correctEmoji);
    }

    getIncorrectEmoji1(row) {
        const incorrectEmoji1 = this.getExactlyField("Incorrect emoji with growth mindset feedback.", 0);
        return this.toArray(incorrectEmoji1);
    }

    getIncorrectEmoji2(row) {
        const incorrectEmoji2 = this.getExactlyField("Incorrect emoji with Feedback phrases randomly selected.", 0);
        return this.toArray(incorrectEmoji2);
    }

    getIncorrectEmoji3(row) {
        const incorrectEmoji3 = this.getExactlyField("Incorrect emoji with Feedback phrases randomly selected.", 0);
        return this.toArray(incorrectEmoji3);
    }

    getIncorrectEmoji4(row) {
        const incorrectEmoji4 = this.getExactlyField("Thinking emoji and Show Me button", 0);
        return this.toArray(incorrectEmoji4);
    }

    toArray(content) {
        return content.split("\n").filter(value => value.trim() !== "" ).map(value => value.replaceAll("\r", "").trim());
    }
}
