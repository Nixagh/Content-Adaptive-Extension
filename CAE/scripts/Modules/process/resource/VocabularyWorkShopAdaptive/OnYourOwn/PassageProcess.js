class PassageProcess extends VWAProcess {

    passageType = {
        ON_LEVEL: 'On Level',
        DIFFERENTIATED: 'Differentiated'
    }

    getFullContent() {
        // const wordListContent = this.getWordListSheet();
        // return {first: this.replaceItem(this.getPassageType()), second: []};
        return {first: [], second: []}
    }

    mapping({first, second}) {
        return this.replaceItem(this.getPassageType());
    }

    getPassageSheet() {
        return [];
    }

    getSheetValue() {
        return [];
    }

    getPassageType() {
        return this.passageType.ON_LEVEL;
    }

    replaceItem(type) {
        const body = type === this.passageType.ON_LEVEL ? "On-Level Passage Body" : "Differentiated Passage Body";
        const olvContent = this.getSheetValue();
        const newData = [];
        for (let i = 1; i <= 10; i++) {
            if (i === 1) {
                const itemA = {
                    "Step": olvContent[`Step`],
                    "Choice Passage": olvContent[`Choice Passage`],
                    "Pathway": olvContent[`Pathway`],
                    "Choice Page Summary Text": olvContent[`Choice Page Summary Text`],
                    "Choice Page Photo": olvContent[`Choice Page Photo`],
                    "Direction Line": olvContent[`Direction Line`],
                    "Passage Body": olvContent[body],
                    "Lexile": olvContent[`Lexile`],
                    "Item Type": olvContent[`Item Type`],
                    "Item": olvContent[`Item ${i} Part A`],
                    "Item Choices": olvContent[`Item ${i} Part A Choices`],
                    "Item Correct Answer": olvContent[`Item ${i} Part A Correct Answer`],
                    "Item Standards": olvContent[`Item ${i} Part A Standards`],
                    "Item Points": olvContent[`Item ${i} Part A Points`],
                }

                const itemB = {
                    "Step": olvContent[`Step`],
                    "Choice Passage": olvContent[`Choice Passage`],
                    "Pathway": olvContent[`Pathway`],
                    "Choice Page Summary Text": olvContent[`Choice Page Summary Text`],
                    "Choice Page Photo": olvContent[`Choice Page Photo`],
                    "Direction Line": olvContent[`Direction Line`],
                    "Passage Body": olvContent[body],
                    "Lexile": olvContent[`Lexile`],
                    "Item Type": olvContent[`Item Type`],
                    "Item": olvContent[`Item ${i} Part B`],
                    "Item Choices": olvContent[`Item ${i} Part B Answer Choices`],
                    "Item Correct Answer": olvContent[`Item ${i} Part B Correct Answer`],
                    "Item Standards": olvContent[`Item ${i} Part B Standards`],
                    "Item Points": olvContent[`Item ${i} Part B Points`],
                }
                newData.push(itemA);
                newData.push(itemB);
            } else {
                const item = {
                    "Step": olvContent[`Step`],
                    "Choice Passage": olvContent[`Choice Passage`],
                    "Pathway": olvContent[`Pathway`],
                    "Choice Page Summary Text": olvContent[`Choice Page Summary Text`],
                    "Choice Page Photo": olvContent[`Choice Page Photo`],
                    "Direction Line": olvContent[`Direction Line`],
                    "Passage Body": olvContent[body],
                    "Lexile": olvContent[`Lexile`],
                    "Item Type": olvContent[`Item Type`],
                    "Item": olvContent[`Item ${i}`],
                    "Item Choices": olvContent[`Item ${i} Choices`],
                    "Item Correct Answer": olvContent[`Item ${i} Correct Answer`],
                    "Item Standards": olvContent[`Item ${i} Standards`] || (i === 10 ? olvContent[`Standard`] || olvContent[`Standards`] : ''),
                    "Item Points": olvContent[`Item ${i} Points`],
                }
                newData.push(item);
            }
        }
        return newData;
    }

    getWordId(row) {
        return '';
    }

    getPathway1(row) {
        return "A";
    }

    getPathway2(row) {
        return "B";
    }

    getLinkToQuestion(row) {
        return row === 1 ? 1 : '';
    }

    getComponentScoreRules(row) {
        //	{"test":null,"scoringGroups":[{"componentGradingRules":[{"componentId":"802906_OYO_OLP1_u05_q01_ans01","componentType":"MultipleChoice","componentSubtype":null,"autoScore":true,"rubricRule":null}],"maxScore":1}]}
        const componentScoreRules = {
            test: null,
            scoringGroups: [
                {
                    componentGradingRules: [
                        {
                            componentId: `${this.getCID(row)}`,
                            componentType: "MultipleChoice",
                            componentSubtype: null,
                            autoScore: true,
                            rubricRule: null
                        }
                    ],
                    maxScore: this.getMaxScore()
                }
            ]
        }
        return JSON.stringify(componentScoreRules);
    }

    getPassageContent(row) {
        return `<div class="direction_section">
                    <div audio-source="/content/${this.getGlobalResourceId()}/AudioPassages/${this.getAudioSource()}" class="audio-inline" style="display: inline-flex; width: auto;"></div>
                    ${this.getPassageTitle(row)}
                    ${this.getPassageContentHTML(row)}
                </div>`;
    }

    getAudioSource() {
        return `${this.getGlobalResourceId()}_ipA_U1_Choice_P1_Drivers.mp3`;
    }

    getDirectionLineHTML(row) {
        return this.getField("Direction Line", row);
    }

    getPassageTitle(row) {
        const passageBody = this.getPassageBody(row);
        const title = passageBody.split("\n")[0]
            .replaceAll(`<title>`, '')
            .replaceAll(`</title>`, '');
        return `<div class="title">${title}</div>`
    }

    getPassageBody(row) {
        return this.getField("Passage Body", row);
    }

    getPassageContentHTML(row) {
        const passageBody = this.getPassageBody(row);
        return this.passageConverterV02(passageBody);
    }

    getPassageSummaryText(row) {
        const passageSummaryText = this.getField("Choice Page Summary Text", row);
        const image = this.getField("Choice Page Photo", row)
            .replaceAll("<image>", "")
            .replaceAll("</image>", "")
            .replaceAll(".png", "")
            .replaceAll(".jpg", "")
            .trim();

        const regex = /<title>(.*)<(\/|)title>/g;
        const match = passageSummaryText.match(regex);
        // get group 0
        const title = match
            ? match[0].replaceAll(/<title>|<\/title>/g, "").trim()
            : "";

        const content = passageSummaryText.replaceAll(regex, "").trim();

        return `<div class="select-page" resourcelevel="true">
                    <div class="sp-cover"><img alt="" src="/cms/repository/cms/images2020/${image}.jpg" /></div>
                    <div class="sp_title">${title}</div>
                    <div class="sp-description">${content}</div>
                </div>`;
    }

    getQuestionHTML(row) {
        return `<div class="question-questionStem question-questionStem-1-column">
                    <div class="question-stem-content">
                        ${row < 2 ? `<div class="part-label">Part ${row === 0 ? 'A' : 'B'}</div>` : ''}
                        <div class="question">${this.getItem(row)}
                            <div cid="${this.getCID(row)}" ctype="MultipleChoice" layout="Vertical" qname="a${row + 1}" showlabel="true" subtype="MC">
                                ${this.getOptionsHTML(row)}
                            </div>
                        </div>
                    </div>
                </div>`;
    }

    getItem(row) {
        let item = this.getExactlyField("Item", row);
        return this.replaceItem(item);
    }

    getOptionsHTML(row) {
        const choices = this.getItemChoicesList(row);
        return choices.map((choice, index) => `<div itemid="${String.fromCharCode(index + 97)}" itemlabel="">${choice.trim()}</div>`).join('');
    }

    getItemChoicesList(row) {
        const itemChoices = this.getExactlyField("Item Choices", row);

        const indexOfAnswerA = itemChoices.indexOf("a. ");
        const indexOfAnswerB = itemChoices.indexOf("b. ");
        const indexOfAnswerC = itemChoices.indexOf("c. ");
        const indexOfAnswerD = itemChoices.indexOf("d. ");

        let answerA = itemChoices.substring(indexOfAnswerA, indexOfAnswerB).trim();
        let answerB = itemChoices.substring(indexOfAnswerB, indexOfAnswerC).trim();
        let answerC = itemChoices.substring(indexOfAnswerC, indexOfAnswerD).trim();
        let answerD = itemChoices.substring(indexOfAnswerD).trim();

        // if last element of answer === ";" => remove it
        answerA = answerA[answerA.length - 1] === ";" ? answerA.substring(0, answerA.length - 1) : answerA;
        answerB = answerB[answerB.length - 1] === ";" ? answerB.substring(0, answerB.length - 1) : answerB;
        answerC = answerC[answerC.length - 1] === ";" ? answerC.substring(0, answerC.length - 1) : answerC;
        answerD = answerD[answerD.length - 1] === ";" ? answerD.substring(0, answerD.length - 1) : answerD;

        answerA = answerA.replace("a. ", "").trim();
        answerB = answerB.replace("b. ", "").trim();
        answerC = answerC.replace("c. ", "").trim();
        answerD = answerD.replace("d. ", "").trim();

        if (Utility.isEmpty(answerA) || Utility.isEmpty(answerB) || Utility.isEmpty(answerC) || Utility.isEmpty(answerD))
            this.addError("Question Content", "Missing answer choice");

        return [answerA, answerB, answerC, answerD];
    }

    getCorrectAnswer(row) {
        //{"comps":[{"id":"802909_ap_olp1_u4_q1_ans1","value":"d","type":"MultipleChoice"}]}
        const correctAnswer = {
            "comps": [{
                "id": this.getCID(row),
                "value": this.getCorrectAnswerValue(row),
                "type": "MultipleChoice"
            }]
        }
        return JSON.stringify(correctAnswer);
    }

    getCorrectAnswerValue(row) {
        const correctAnswer = this.getExactlyField("Item Correct Answer", row);
        const regex = /[abcd]\. .[^.](.*)/;
        const match = correctAnswer.match(regex);
        const answer = match ? match[0] : "";
        return answer.split(".")[0].trim().toLowerCase();
    }

    getCorrectTextHTML(row) {
        return this.getCorrectAnswerValue(row);
    }

    getFeedback(row) {
        const number = this.getNumberFromItem(row);
        return number ? JSON.stringify({paragraphId: `${number}`}) : null;
    }

    getNumberFromItem(row) {
        const item = this.getItem(row);
        const regex = /paragraph \d+/;
        const match = item.match(regex);
        const number = match ? match[0].split(" ")[1] : 0;
        return parseInt(number);
    }
}