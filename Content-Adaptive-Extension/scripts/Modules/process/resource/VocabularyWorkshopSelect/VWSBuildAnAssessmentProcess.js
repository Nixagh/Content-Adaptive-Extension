class VWSBuildAnAssessmentProcess extends VWSProcess {
    getContentSheet() {
        const sheetNames = this.allSheets.SheetNames;
        let ret = [];
        sheetNames.forEach(sheetName => {
            ret.push(...this.getContentBySheetName(sheetName));
        });

        // fill Direction Line
        ret = this.fillDirectionLine(ret);

        return ret;
    }

    fillDirectionLine(ret) {
        let currentDirectionLine = "";
        ret.forEach(row => {
            if (row["Direction Line"] === "") {
                row["Direction Line"] = currentDirectionLine;
            } else {
                currentDirectionLine = row["Direction Line"];
            }
        })

        return ret;
    }

    getContentBySheetName(sheetName) {
        const header = this.getHeader(sheetName);
        const content = this.getSheet(sheetName);
        const result = this.getContent(content, header);

        // app field learning objective
        const learningObjective = LearningObjectives[sheetName];
        result.forEach(row => row["Learning Objective"] = learningObjective);
        return result;
    }

    getFullContent() {
        const contentSheet = this.getContentSheet();
        return {first: contentSheet, second: []};
    }

    mapping({first, second}) {
        return first
    }

    filterAchieveSet(data) {
        return data;
    }

    getQuestionTypeSelect() {
        return 1; // Multiple Choice
    }

    getQuestionTypeValue() {
        return "MC";
    }

    async insert() {
        await super.insert();
        const row = this.getRow();
        this.setLearningObjective(row);
    }

    setLearningObjective(row) {
        const value = this.getField("Learning Objective", row);
        const element = document.querySelector(`input[name="checkListObj"][value="${value}"]`);
        element.checked = true;
    }

    setQuestion(row, autoScore) {
        super.setQuestion(row, autoScore);

        // uid element
        // const uidElement = new BasicInput("questionUIDField");
        // // title element
        // const titleElement = new BasicInput("title");
        // // pojo.convertToMC4Print1
        // const convertToMC4Print = document.getElementById("pojo.convertToMC4Print1");
        // // name: _pojo.convertToMC4Print
        // const convertToMC4PrintName = document.getElementsByName("_pojo.convertToMC4Print")[0];
        //
        // // set uid value to the title element
        // titleElement.setValue(uidElement.getValue());
        // // check convertToMC4Print
        // convertToMC4Print.checked = true;
        // convertToMC4PrintName.value = 'on';
    }

    async setPassage(row) {
        await super.setPassage(row);
        const choicePassageCheckBox = new BasicInput("choicePassageCheckbox");
        choicePassageCheckBox.element.checked = true;
        choicePassageCheckBox.element.parentElement.classList.add("checked");
    }

    setQuestionContent(row) {
        document.getElementsByClassName('mc')[0].style.display = 'block';
        super.setQuestionContent(row);

        // set options
        this.setOptionsQuestion(row);
    }

    setOptionsQuestion(row) {
        // cke_6_contents
        const answerChoices = this.getAnswerChoices(row);
        const length = answerChoices.length;
        const correctAnswer = this.getCorrectAnswerCustom(row);

        for (let i = 0; i < length; i++) {
            const answerChoice = answerChoices[i];
            const answerChoiceElement = new Cke(`cke_${6 + i}_contents`);

            answerChoiceElement.setHtml(answerChoice.value);

            // get input with value and type radio
            const input = document.querySelectorAll("input[name='checkList']");
            // find the input with the value of the answer choice
            const radio = Array.from(input).find(e => e.value === `${i + 1}`);

            if (answerChoice.index === correctAnswer.index) {
                radio.checked = true;
            }
        }

    }

    getQuestionHTML(row) {
        const item = this.getExactlyField("Item", row) || this.getExactlyField("Item ", row);
        // Five fire departments were [WOL] to the burning building.
        // replace [WOL] with _______
        return item.replace(/\[WOL]/, "_______");
    }

    getAnswerChoices(row) {
        const answerChoices = this.getField("Answer Choices", row) || this.getField("Answer Choices ", row);
        // a. contemporary; b. adverse; c. incomprehensible; d. serene
        // create regex to get the answer choices
        const regex = /([a-d]\.\s)([a-zA-Z\s]+)/g;
        let match;
        const choices = [];
        while ((match = regex.exec(answerChoices)) !== null) {
            choices.push({index: match[1], value: match[2]});
        }
        return choices;
    }

    getCorrectAnswerCustom(row) {
        // Correct Answer
        const correctAnswer = this.getField("Correct Answer", row) || this.getField("Correct Answer ", row);
        // b. adverse
        // create regex to get the correct answer
        const regex = /([a-d]\.\s)([a-zA-Z\s]+)/;
        const match = regex.exec(correctAnswer);
        return {index: match[1], value: match[2]};
    }
}