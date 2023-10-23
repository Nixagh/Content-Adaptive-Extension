// Vocabulary Word Adaptive Process
class VWAProcess {
    fileName;
    type;
    allSheets;
    data;
    rowMinus;
    setTab = [1, 1, 1, 1];
    errors;

    constructor(type, rowMinus = 1, setTab = [1, 1, 1, 1]) {
        this.type = type;
        this.allSheets = {};
        this.data = [];
        this.rowMinus = rowMinus;
        this.setTab = setTab;
        this.errors = [];
    }

    process() {
        this.data = this.mapping(this.getFullContent());
        // this.data = this.getFullContent();
        this.showErrors();
        Storage.Set("GProcess", JSON.stringify(this));
    }

    mapping({first, second}) {
        return first.map(row => {
            const wordID_1 = this.getFieldOfRow("WordID", row);
            const wordList = second.find(wordList => Utility.equalsWordId(this.getFieldOfRow("WordID", wordList), wordID_1));
            if (wordList === undefined) {
                this.addError(`Question Content`, `Word ID: ${row["Word ID"]} not found in Word List`);
                return;
            }
            return {
                ...wordList,
                ...row,
            }
        })
    }

    getFullContent() {
        console.log("getFullContent");
        return {first: [], second: []};
        // return [];
    }

    async insert() {
        this.errors = [];
        // get row from question number
        const row = this.getRow();

        // set question tab
        if (this.setTab[0]) this.setQuestion(row, true);
        // set passage tab
        if (this.setTab[1]) await this.setPassage(row);
        // set question content tab
        if (this.setTab[2]) this.setQuestionContent(row);
        // set feedback tab
        if (this.setTab[3]) this.setFeedback(row);

        console.log(`Insert Vocabulary Word Adaptive, resource: ${VWAResource[this.type].value}`);
        this.showErrors();
    }

    getRow() {
        return parseInt(document.getElementById(Ids.questionNumber).value) - this.rowMinus;
    }

    setQuestion(row, autoScore) {
        const ids = {
            maxScore: `maxscore`,
            questionNumber: `pojo.questionNumber`,
            standards: `pojo.standards`,
            questionTypeSelect: `questionTypeSelection`,
            questionTypeValue: `questionTypeValue`,
            autoScore: `pojo.autoScoreTE1`,
            componentGradingRules: `pojo.componentGradingRules`,
            wordId: `wordId`,
            pathway1: "pathwaySet1",
            pathway2: "pathwaySet2",
            adaptiveAnswerCount: "adaptiveAnswerCount",
            setType: "setType",
            linkToQuestion: "linkToQuestion"
        }

        const wordIdElement = new BasicInput(ids.wordId);
        const maxScoreElement = new BasicInput(ids.maxScore);
        const questionNumberElement = new BasicInput(ids.questionNumber);
        const standardsElement = new BasicInput(ids.standards);
        const questionTypeElement = new BasicInput(ids.questionTypeSelect);
        const questionTypeValueElement = new BasicInput(ids.questionTypeValue);
        const showQuestionTypeValueElement = new BasicInput("select2-chosen-1");
        if (autoScore) {

            // auto score
            const autoScoreElement = document.getElementById(ids.autoScore);
            autoScoreElement.checked = true;
            // parent of auto score
            const autoScoreParentElement = autoScoreElement.parentElement;
            autoScoreParentElement.classList.add("checked");
        }
        const linkToQuestionElement = new BasicInput(ids.linkToQuestion);
        const componentGradingRulesElement = new BasicInput(ids.componentGradingRules);

        const pathway1Element = new BasicInput(ids.pathway1);
        const pathway2Element = new BasicInput(ids.pathway2);
        const setTypeElement = new BasicInput(ids.setType);
        const adaptiveAnswerCountElement = new BasicInput(ids.adaptiveAnswerCount);

        wordIdElement.setValue(this.getWordId(row));
        maxScoreElement.setValue(this.getMaxScore());
        questionNumberElement.setValue(this.getQuestionNumber(row));
        standardsElement.setValue(this.getStandard(row));
        questionTypeElement.setValue(this.getQuestionTypeSelect(row));
        const textShow = questionTypeElement.element.options[questionTypeElement.element.selectedIndex].text;
        questionTypeValueElement.setValue(this.getQuestionTypeValue(row));
        showQuestionTypeValueElement.setText(textShow);
        linkToQuestionElement.setValue(this.getLinkToQuestion(row));
        componentGradingRulesElement.setValue(this.getComponentScoreRules(row));

        pathway1Element.setValue(this.getPathway1(row));
        pathway2Element.setValue(this.getPathway2(row));
        setTypeElement.setValue(this.getSetType(row));
        adaptiveAnswerCountElement.setValue(this.getAdaptiveAnswerCount(row));
        console.log("Set question")
    }

    async setPassage(row) {
        const directionLine = new Cke("cke_directionLine");
        const passageContent = new Cke("cke_2_contents");
        const passageSummary = new Cke("cke_3_contents");
        const choosePassage = document.querySelectorAll("#questionTypeSelection")[1];
        const scramble = new BasicInput("scrambleCheckbox");

        if (row !== 0) {
            choosePassage.value = choosePassage.options[1].value;
            const result = await this.getAjaxPassage(choosePassage.value);

            directionLine.setHtml(result.directionLineHTML);
            passageContent.setHtml(result.passageContentHTML);
            passageSummary.setHtml(result.passageSummaryHTML);
        } else {
            directionLine.setHtml(this.getDirectionLineHTML(row));
            passageContent.setHtml(this.getPassageContent(row));
            passageSummary.setHtml(this.getPassageSummaryText(row));
        }

        const listType = ["DP1", "DP2", "OLV-P1", "OLV-P2"];
        if (listType.includes(this.type)) {
            scramble.element.checked = true;
            scramble.element.parentElement.classList.add("checked");
        }

        console.log("Set passage");
    }

    async getAjaxPassage(passageId) {
        const url = `http://192.168.200.26:8090/cms/ajax/question/loadPassage.html?passageId=${passageId}`;
        const result = await $.ajax({url: url});
        return {
            directionLineHTML: result["directionLine"],
            passageContentHTML: result["content"],
            passageSummaryHTML: result["passageSummary"]
        };
    }

    getPassageSummaryText(row) {
        return '';
    }

    setQuestionContent(row) {
        const question = new Cke("cke_5_contents");
        const correctAnswer = new Area("pojo.correctAnswer");
        const correctAnswerHTML = new Cke("cke_38_contents");

        question.setHtml(this.getQuestionHTML(row));
        correctAnswer.show();
        correctAnswer.parentShow();
        correctAnswer.setValue(this.getCorrectAnswer(row));
        correctAnswerHTML.setHtml(this.getCorrectTextHTML(row));
        console.log("Set question content")
    }

    setFeedback(row) {
        const feedback = new Area("feedback_data");
        feedback.setValue(this.getFeedback(row));
        console.log("Set feedback");
    }

    // ------------------ get data for question ------------------ //
    getWordId(row) {
        return this.getField("WordID", row);
    }

    getQuestionNumber(row) {
        return row + 1;
    }

    getStandard(row) {
        return this.getField("Standard", row);
    }

    getQuestionTypeSelect() {
        // this is default value for question type select
        return 49;
    }

    getQuestionTypeValue() {
        // this is default value for question type select
        return "TE";
    }

    getLinkToQuestion(row) {
        return '';
    }

    getComponentScoreRules(row) {
        return "";
    }

    getPathway1(row) {
        const pathway1 = this.getField("P1 Set", row);
        if (!pathway1) {
            this.addError("Question", `Can't find P1 Set in row ${row + 1}`);
            return 'A';
        }
        return pathway1;
    }

    getPathway2(row) {
        const pathway2 = this.getField("P2 Set", row);
        if (!pathway2) {
            this.addError("Question", `Can't find P2 Set in row ${row + 1}`);
            return 'A';
        }
        return pathway2;
    }

    getSetType() {
        return '';
    }

    getAdaptiveAnswerCount() {
        // this is default value for adaptive answer count
        return '';
    }

    getRetryCount() {
        // this is default value for retry count
        return '';
    }

    // ------------------ get data for passage ------------------ //
    getDirectionLineHTML(row) {
        return '';
    }

    getPassageContent(row) {
        return '';
    }

    // ------------------ get data for question content ------------------ //
    getQuestionHTML(row) {
        return '';
    }

    getCorrectAnswer(row) {
        return '';
    }

    getCorrectTextHTML(row) {
        return '';
    }

    // ------------------ get data for feedback ------------------ //
    getFeedback(row) {
        return '';
    }

    // ------------------ excel process ------------------ //
    getSheet(sheetName) {
        const _sheetName = this.allSheets.SheetNames.find(sheet => sheet.includes(sheetName));
        return this.allSheets.Sheets[_sheetName];
    }

    getHeader(sheet) {
        return XLSX.utils.sheet_to_json(sheet, {header: 1})[0].map(header => header.trim());
    }

    getContent(sheet, header) {
        const content = XLSX.utils.sheet_to_json(sheet, {header: header});
        // remove first row (header)
        let noHeaderContent = content.slice(1);
        // process key in row
        const newContentWithBeautifulKey = noHeaderContent.map((row) => {
            const newRow = {};
            for (const key in row) {
                // remove space in key
                newRow[Utility.beautifullyHeader(key)] = row[key];
                delete row[key];
            }
            return {...newRow};
        });

        newContentWithBeautifulKey.forEach((row) => {
            for (const key in row) {
                if (row[key] instanceof String) row[key] = row[key].trim();
            }
        });

        return newContentWithBeautifulKey;
    }

    getWordListSheet() {
        const wordListSheetName = "wordList";
        const wordListSheet = this.getSheet(wordListSheetName);
        const wordListHeader = this.getHeader(wordListSheet);
        // i need trim() all field in row because some field have space in first and last
        return this.getContent(wordListSheet, wordListHeader);
    }

    // ------------------ other process ------------------ //
    getField(header, row) {
        return this.getFieldOfRow(header, this.data[row]);
    }

    getExactlyField(header, row) {
        return this.getExactlyFieldOfRow(header, this.data[row]);
    }

    getFieldOfRow(header, row) {
        const simplifyHeader = Utility.simplifyString(header);
        for (let key in row) {
            const simplifyKey = Utility.simplifyString(Utility.beautifullyHeader(key));
            if (simplifyKey.includes(simplifyHeader)) return row[key];
        }
        // return alert(`Can't find field ${header} in row ${row}`);
    }

    getExactlyFieldOfRow(header, row) {
        const simplifyHeader = Utility.simplifyString(header);
        for (let key in row) {
            const simplifyKey = Utility.simplifyString(Utility.beautifullyHeader(key));
            if (simplifyHeader === simplifyKey) return row[key];
        }
        // return alert(`Can't find field ${header} in row ${row}`);
    }

    getUnit() {
        const unit = this.fileName.split("_")[2].toLowerCase();
        // get digit in unit
        // template: U01 -> 1 | U10 -> 10
        const unitDigit = unit.match(/\d+/)[0];
        return 'u' + this.convertDigit(unitDigit);
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
        const id = "maxscore";
        return parseInt($(`#${id}`).val());
    }

    getCID(row) {
        return `${this.getGlobalResourceId()}_${this.getDescription()}_${this.getUnit()}_q${this.convertDigit(this.getQuestionNumber(row))}_ans01`;
    }

    getDescription() {
        return "";
    }

    beautifullyItem(item) {
        return item.replaceAll("\n", "").replaceAll("\r", "")
            .replaceAll("{", "[").replaceAll("}", "]")
            .trim();
    }

    addError(tab, message) {
        this.errors.push({
            tab: tab,
            message: message
        });
    }

    showErrors() {
        if (this.errors.length) alert(this.errors.map(error => `${error.tab}: ${error.message}`).join("\n"));
    }

    passageConverter(content) {
        // find the first <bullet> tag and add <ul> tag before it
        const firstBulletIndex = content.indexOf("<bullet>");
        const passageBodyWithUl = firstBulletIndex !== -1 ? content.slice(0, firstBulletIndex) + "<ul>" + content.slice(firstBulletIndex) : content;
        // find the last </bullet> tag and add </ul> tag after it
        const lastBulletIndex = passageBodyWithUl.lastIndexOf("</bullet>");
        const passageBodyWithUlAndLi = lastBulletIndex !== -1 ? passageBodyWithUl.slice(0, lastBulletIndex) + "</ul>" + passageBodyWithUl.slice(lastBulletIndex) : passageBodyWithUl;

        // some time

        return passageBodyWithUlAndLi.split("\n").map(value => {
            // template : <paragraph id=0>The <b>aspiring</b> young actor was excited to be cast in his first play.</paragraph>
            // index = 0;
            // result : <div class="paragraph" id="1">The <b>aspiring</b> young actor was excited to be cast in his first play.</div>
            // but some time not close by </paragraph> , is close by <paragraph>

            // and if paragraph have word like <word3186>inanimate</word3186> replace to <word3186>word3186:inanimate</word3186>
            // but some time not close by </word3186> , is close by <word3186>
            // <word3186>inanimate</word3186> -> <word3186>word3186:inanimate</word3186>
            //todo: <word3186>inanimate<word3186> -> <word3186>word3186:inanimate</word3186>
            const regex = / <word\d+>/g;

            const regexNumber = /\d+/;
            const matchNumber = value.match(regexNumber);
            const paragraphId = matchNumber ? matchNumber[0] : '';

            return value
                .replaceAll(`<paragraph = ${paragraphId}>`, `<div class="paragraph" id = "${paragraphId}">`)
                .replaceAll(`<paragraph id = ${paragraphId}>`, `<div class="paragraph" id = "${paragraphId}">`)
                .replaceAll("</paragraph>", "</div>")
                .replaceAll(`</paragraph`, '</div>')
                .replaceAll("<paragraph>", `</div>`)
                .replaceAll(`</div> id = ${paragraphId}>`, `</div>`)
                .replaceAll(`</div> = ${paragraphId}>`, `</div>`)
                .replaceAll(`</paragraph id = ${paragraphId}>`, "")
                .replaceAll(`</paragraph = ${paragraphId}>`, "")
                .replaceAll(`<bullet>`, '<li>')
                .replaceAll(`</bullet>`, '</li>')
                .replaceAll(`“`, `"`)
                .replaceAll(`”`, `"`)
                .replaceAll(regex, (match) => `${match}word${match.split("word")[1].split(">")[0]}:`)
                // remove /id = \d+/g if have
                .replaceAll(/id = \d+/g, '')
                .trim();
        }).join("\n").trim();
        // todo: still wrong if first data wrong format T.T ....
    }

    replaceItalicOfItem(item) {
        // template : <i>-dub-</i> => <i style="white-space:nowrap;display:inline;">-dub-</i>
        // <i>dub</i> => <i>dub</i>
        // <i> -dub- </i> => <i style="white-space:nowrap;display:inline;">-dub-</i>
        // <i>-dub</i> => <i style="white-space:nowrap;display:inline;">-dub</i>
        // <i>dub-</i> => <i style="white-space:nowrap;display:inline;">dub-</i>

        const regex = /<i>(\s*-\w+-\s*)<\/i>/g;
        const match = item.match(regex);
        if (match) {
            match.forEach((m) => {
                const replace = m.replaceAll('<i>', '<i style="white-space:nowrap;display:inline;">');
                item = item.replace(m, replace);
            })
        }
        // remove <label></label>
        const regex_ = /<label>(.*?)<\/label>/;
        return item.match(regex_) ? item.replaceAll(item.match(regex_)[0], '').trim() : item.trim();
    }
}
