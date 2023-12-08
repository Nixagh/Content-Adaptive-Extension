class WWiAProcess extends VWAProcess {
    setQuestion(row, autoScore) {
        super.setQuestion(row, false);

        // auto hide question label
        const hideQuestionLabel = document.getElementById("pojo.hideQuestionLabel1");

        hideQuestionLabel.checked = true;
        // parent of auto score
        const autoScoreParentElement = hideQuestionLabel.parentElement;
        autoScoreParentElement.classList.add("checked");

    }

    getPassageSheet() {
        const olvSheetName = `OnLevelPsg`;
        const olvSheet = this.getSheet(olvSheetName);
        const olvHeader = this.getHeader(olvSheet);
        return this.getContent(olvSheet, olvHeader);
    }

    //DATA
    mapping({first, second}) {
        return this.replaceItem('On Level');
    }

    getSheetValue() {
        return this.getPassageSheet(); // return array[] 2
    }

    replaceItem(type) {
        const body = "On-Level Passage Body";
        const olvContent = this.getSheetValue();
        const newData = [];

        olvContent.forEach(element => {
            const item = {
                "Choice Page Summary Text": element[`Choice Page Summary Text`],
                "Choice Page Photo": element[`Choice Page Photo`],
                "Passage Body": element[`${body}`]
            }
            newData.push(item);
        });


        return newData;

    }

    // COMPONENT
    getComponentScoreRules(row) {

        const componentScoreRules = {
            test: null,
            scoringGroups: [
                {
                    componentGradingRules: [
                        {
                            componentId: `${this.getCID(row)}`,
                            componentType: "Fill_in_Blank",
                            componentSubtype: null,
                            autoScore: false,
                            rubricRule: null
                        }
                    ],
                    maxScore: this.getMaxScore()
                }
            ]
        }
        return JSON.stringify(componentScoreRules);
    }

    //  PASSAGE
    getPassageContent(row) {
        return `<div class="direction_section">
                    <div audio-source="" class="audio-inline" style="display: inline-flex; width: auto;"></div>
                    ${this.getPassageTitle(row)}
                    ${this.getPassageContentHTML(row)}
                </div>`;
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

    getDirectionLineHTML() {
        return '<i>Read the passage and answer the question.</i>'
    }

    setPassage(row) {
        const directionLine = new Cke("cke_directionLine");
        const passageContent = new Cke("cke_2_contents");
        const passageSummary = new Cke("cke_3_contents");
        // const scramble = new BasicInput("scrambleCheckbox");
        const choicePassageCheckBox = new BasicInput("choicePassageCheckbox");

        directionLine.setHtml(this.getDirectionLineHTML(row));
        passageContent.setHtml(this.getPassageContent(row));
        passageSummary.setHtml(this.getPassageSummaryText(row));

        choicePassageCheckBox.element.checked = true;
        choicePassageCheckBox.element.parentElement.classList.add("checked");


        console.log("Set passage");
    }

    //  GET QUESTION CONTENT
    getCorrectAnswer(row) {
        // `{"comps":[{"id":"${this.getCID()}","value":"Answer will vary.","type":"Fill_in_Blank"}]}`;

        const correctAnswer = {
            "comps": [{
                "id": this.getCID(row),
                "value": "Answer will vary.",
                "type": "Fill_in_Blank"
            }]
        }
        return JSON.stringify(correctAnswer);
    }

    getCorrectTextHTML() {
        return `Answer will vary.`;
    }

    getQuestionHTML(row) {
        return `<div class="question-questionStem question-questionStem-1-column Q000000_Pre_K_03">
        <div class="question-stem-content">
        <div class="question"><input autocapitalize="off" autocomplete="off" autocorrect="off" cid="${this.getCID(row)}" ctype="Fill_in_Blank" qname="a1" spellcheck="false" subtype="essay" type="text" /></div>
        </div>
    </div>`;
    }

    getCID(row) {
        // 802930_g10_unit15_action_q01_ans01

        return `${this.getGlobalResourceId()}_g${this.getGrade()}_unit${this.getUnit()}_action_q${this.convertDigit(this.getQuestionNumber(row))}_ans01`;
    }

    getUnit() {
        const unit = this.fileName.split("_")[2].toLowerCase();
        // get digit in unit
        // template: U01 -> 1 | U10 -> 10
        const unitDigit = unit.match(/\d+/)[0];
        return this.convertDigit(unitDigit);
    }


    getGrade() {

   // ['6' , '7' , '9' , | '0'  ]
        const globalResourceId = this.getGlobalResourceId();

        var lastS = globalResourceId[globalResourceId.length - 1];
        if(lastS == '0')
            return '1' + lastS;
        return lastS;
        
    }


    convertDigit(digits) {
        // if digit in unit has 1 digit, add 0 before digit
        // template: 1 -> 01 | 10 -> 10
        digits += "";
        return digits.length === 1 ? `0${digits}` : digits;
    }

    getGlobalResourceId() {
        const id = "programs-id";
        return $(`#${id}`).val();
    }

    getMaxScore() {
        return "4"
    }

    getPathway1(row) {
        return "";
    }

    getPathway2(row) {
        return "";
    }

    getStandard() {
        return "";
    }
}