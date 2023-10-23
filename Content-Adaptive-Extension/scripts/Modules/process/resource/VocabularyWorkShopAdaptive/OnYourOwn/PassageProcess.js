class PassageProcess extends VWAProcess {

    passageType = {
        ON_LEVEL: 'On Level',
        DIFFERENTIATED: 'Differentiated'
    }

    getFullContent() {
        // const wordListContent = this.getWordListSheet();
        return this.replaceItem(this.getPassageType());
    }

    getPassageSheet() {
        return [];
    }

    getSheetValue() {
        return [];
    }

    getPassageType() {
        return '';
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
                    "Item Standards": olvContent[`Item ${i} Standards`] || i === 10 ? olvContent[`Standards`] : '',
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
        const passageBody = this.getPassageBody(row).split("\n").slice(1).join("\n");
        return this.passageConverter(passageBody);
    }

    getPassageSummaryText(row) {
        const passageSummaryText = this.getField("Choice Page Summary Text", row);
        const image = this.getField("Choice Page Photo", row)
            .replaceAll("<image>", "")
            .replaceAll("</image>", "")
            .replaceAll(".png", "")
            .replaceAll(".jpg", "")
            .trim();

        const title = passageSummaryText.split("\n")[0]
            .replaceAll(`<title>`, '')
            .replaceAll(`</title>`, '')
            .replaceAll(`“`, `"`)
            .trim();
        const content = passageSummaryText.split("\n").slice(1).join("\n").trim();

        return `<div class="select-page" resourcelevel="true">
                    <div class="sp-cover"><img alt="" src="/cms/repository/cms/images2020/${image}.jpg" /></div>
                    <div class="sp_title">${title}</div>
                    <div class="sp-description">${content}</div>
                </div>`;
    }

    getQuestionHTML(row) {
        return `<div class="question-questionStem question-questionStem-1-column">
                    <div class="question-stem-content">
                        ${row < 2 ? `<div className="part-label">Part ${row === 0 ? 'A' : 'B'}</div>` : ''}
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
        return this.replaceItalicOfItem(item);
    }

    getOptionsHTML(row) {
        const choices = this.getItemChoicesList(row);
        return choices.map((choice, index) => `<div itemid="${String.fromCharCode(index + 97)}" itemlabel="">${choice.trim()}</div>`).join('');
    }

    getItemChoicesList(row) {
        const itemChoices = this.getExactlyField("Item Choices", row);
        return itemChoices.split(";").map((item) => item.split(".")[1].trim());
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
        return correctAnswer.split(".")[0].trim().toLowerCase();
    }

    getCorrectTextHTML(row) {
        return this.getCorrectAnswerValue(row);
    }

    getFeedback(row) {
        const number = this.getNumberFromItem(row);
        return number ? JSON.stringify({
            paragraphs: number
        }) : '';
    }

    getNumberFromItem(row) {
        const item = this.getItem(row);
        const regex = /\d+/;
        const match = item.match(regex);
        return match ? match[0] : '';
    }
}