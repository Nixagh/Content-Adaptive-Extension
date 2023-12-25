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

    getUnitSheet() {
        const unitSheetName = `Unit`;
        const unitSheet = this.getSheet(unitSheetName);
        const unitHeader = this.getHeader(unitSheet);
        return this.getContent(unitSheet, unitHeader);
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
        const unitContent = this.getUnitSheet();
        const newData = [];

        olvContent.forEach(element => {
            const choicePageSummaryText = Utility.getFieldOfRow("Choice Page Summary Text", element);
            const choicePagePhoto = Utility.getFieldOfRow("Choice Page Photo", element);
            const passageBody = Utility.getFieldOfRow(body, element);

            const unit = unitContent.find(item => {
                const passage = Utility.getFieldOfRow("Passage", item);
                if (choicePageSummaryText.includes(passage) || passageBody.includes(passage)) {
                    return item;
                }
            });

            let _item;
            let standard;
            if(unit) {
                _item = Utility.getFieldOfRow("Item", unit);
                standard = Utility.getFieldOfRow("Standard", unit);
            }

            const item = {
                "Choice Page Summary Text": choicePageSummaryText,
                "Choice Page Photo": choicePagePhoto,
                "Passage Body": passageBody,
                "Item": _item,
                "Standard": standard
            }
            if (item["Choice Page Photo"]) newData.push(item);
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
        <div class="question">${this.getItem(row)}<input autocapitalize="off" autocomplete="off" autocorrect="off" cid="${this.getCID(row)}" ctype="Fill_in_Blank" qname="a${row+1}" spellcheck="false" subtype="essay" type="text" /></div>
        </div>
    </div>`;
    }

    getItem(row) {
        return this.getField("Item", row);
    }

    getCID(row) {
        // 802930_g10_unit15_action_q01_ans01
        return `${this.getProductCode()}_g${this.getGrade()}_unit${this.getUnit().replace("u", "")}_action_q${this.convertDigit(this.getQuestionNumber(row))}_ans01`;
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

    getStandard(row) {
        return this.getField("Standard", row);
    }
}