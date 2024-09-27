class PostTestProcess extends VWAProcess {
    getDescription() {
        return "posttest";
    }

    getFullContent() {
        return {first: this.getPretestSheet(), second: []};
    }

    getScramble() {
        return true;
    }
    mapping({first, second}) {
        return first;
    }

    getPretestSheet() {

        const unit_regex = /PreTest_U(?<unit>\d+?)/;
        const match = this.fileName.match(unit_regex);
        const unit = match ? match.groups.unit : "";


        const postTestSheetName = this.fileName.includes("Test_BU") ? "PostTest" : `Unit ${unit} PostTest`;
        const postTestSheet = this.getSheet(postTestSheetName);
        const postTestHeader = this.getHeader(pretestSheet);
        return this.getContent(postTestSheet, postTestHeader);
    }

    getComponentScoreRules(row) {
        //{"test":null,"scoringGroups":[{"componentGradingRules":[{"componentId":"802916_posttest_u01_q01_ans01","componentType":"MultipleChoice","componentSubtype":null,"autoScore":true,"rubricRule":null}],"maxScore":1}]}
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
        const content =  this.getExactlyField("Direction Line ", row);
        return `<div class="direction_section">${content}</div>`;
    }
    
    getConditionAndValueChoice(row) {
        return {
            condition: row !== 0 && row !== 5 && row !== 15,
            value: row > 14 ? 3 : row > 4 ? 2 : 1,
        }
    }

    getQuestionHTML(row) {
        return `<div class="question-questionStem question-questionStem-1-column ">
                    <div class="question-stem-content">${this.getItem(row)}
                        <div cid="${this.getCID(row)}" ctype="MultipleChoice" layout="Vertical" qname="a${row + 1}" subtype="MC">
                            ${this.getOptionHTML(row)}
                        </div>
                    </div>
                </div>`;
    }

    getCorrectAnswer(row) {
        //{"comps":[{"id":"802919_g9_q1_ans01","value":"a","type":"MultipleChoice"}]}
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
    // ------------------ get field ------------------ //
    getPathway1(row) {
        return '';
    }

    getPathway2(row) {
        return '';
    }

    getWordId(row) {
        return this.getExactlyField("Word ID", row);
    }

    getStandard(row) {
        return this.getExactlyField("Standard", row);
    }

    getDirectionLine(row) {
        return this.getExactlyField("Direction Line", 0);
    }

    getItem(row) {
        const item = this.getExactlyField("Item", row);
        const replaceString = "[WOL]";
        const replaceValue = "______"; // template: "_" x6
        return item.replace(replaceString, replaceValue);
    }

    getAnswerChoices(row) {
        const answerChoices = this.getExactlyField("Answer Choices", row);
        return answerChoices.split(";");
    }

    getCorrectAnswerValue(row) {
        const correctAnswer = this.getExactlyField("Correct Answer", row);
        return correctAnswer.split(".")[0];
    }
    // ------------------ other process ------------------ //
    getOptionHTML(row) {
        const answerChoices = this.getAnswerChoices(row);
        let optionHTML= '';
        answerChoices.forEach((answerChoice) => {
            const split = answerChoice.split(".");
            optionHTML += `<div itemid="${split[0].trim()}" itemlabel="">${split[1].trim()}</div>`
        });
        return optionHTML;
    }
}