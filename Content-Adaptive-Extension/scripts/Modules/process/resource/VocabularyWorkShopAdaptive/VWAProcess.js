// Vocabulary Word Adaptive Process
class VWAProcess {
    fileName;
    type;
    allSheets;
    data;
    rowMinus;
    setTab = [1, 1, 1, 1];
    errors;
    scramble = false;
    _errors = [];

    constructor(type, rowMinus = 1, setTab = [1, 1, 1, 1]) {
        this.type = type;
        this.allSheets = {};
        this.data = [];
        this.rowMinus = rowMinus;
        this.setTab = setTab;
        this.errors = [];
    }

    getScramble() {
        return this.scramble;
    }

    process() {
        this.data = this.mapping(this.getFullContent());
        // this.data = this.getFullContent();
        this.showErrors();
        Storage.Set("GProcess", JSON.stringify(this));
    }

    getLengthData() {
        return this.data.length;
    }

    mapping({first, second}) {
        return first.map(row => {
            const wordID_1 = this.getFieldOfRow("WordID", row);
            const wordList = second.find(wordList => Utility.equalsWordId(this.getFieldOfRow("WordID", wordList), wordID_1));
            if (wordList === undefined) {
                this.addError(`Question Content`, `Word ID: ${row["Word ID"]} not found in Word List`);
                return {
                    ...row,
                };
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
        return this.showErrors();
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
            scrambleOption: `pojo.scrambleOption1`,
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

        if (this.getScramble()) {
            const scramble = document.getElementById(ids.scrambleOption);
            scramble.checked = true;

            const scrambleParentElement = scramble.parentElement;
            scrambleParentElement.classList.add("checked");
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
        // const scramble = new BasicInput("scrambleCheckbox");
        const choicePassageCheckBox = new BasicInput("choicePassageCheckbox");

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

        const listType = ["DP1", "DP2", "OLV-P1", "OLV-P2", "WWiAC"];
        if (listType.includes(this.type)) {
            choicePassageCheckBox.element.checked = true;
            choicePassageCheckBox.element.parentElement.classList.add("checked");
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

    setQuestionContent(row) {
        const question = new Cke("cke_5_contents");
        const correctAnswer = new Area("pojo.correctAnswer");
        const correctAnswerHTML = new Cke("cke_38_contents");

        const questionContent = this.getQuestionHTML(row);
        const correctText = this.getCorrectTextHTML(row);
        const correctAnswerText = this.getCorrectAnswer(row);

        question.setHtml(questionContent);
        correctAnswer.show();
        correctAnswer.parentShow();
        correctAnswer.setValue(correctAnswerText);
        correctAnswerHTML.setHtml(correctText);

        this.checkQuestionContent(questionContent, correctAnswerText, correctText, row);

        console.log("Set question content")
    }

    setFeedback(row) {
        const feedback = new Area("feedback_data");
        feedback.setValue(this.getFeedback(row));
        console.log("Set feedback");
    }

    checkQuestionContent(questionContent, correctAnswerText, correctText, row) {

    }

    // ------------------ get data for question ------------------ //
    getWordId(row) {
        return this.getField("WordID", row);
    }

    getQuestionNumber(row) {
        return row + 1;
    }

    getStandard(row) {
        const standard = this.getField("Standard", row);
        if (!standard) this.addError("Question", `Can't find Standard in row ${row + 1}`);
        return standard;
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
        return ExcelUtil.getSheet(sheetName, this.allSheets);
    }

    getHeader(sheet) {
        return ExcelUtil.getHeader(sheet);
    }

    getContent(sheet, header) {
        return ExcelUtil.getContent(sheet, header);
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
        // this.addError("Field", `Can't find field ${header} in row ${row + 1} please check your data`);
        return "";
    }

    getExactlyFieldOfRow(header, row) {
        const simplifyHeader = Utility.simplifyString(header);
        for (let key in row) {
            const simplifyKey = Utility.simplifyString(Utility.beautifullyHeader(key));
            if (simplifyHeader === simplifyKey) return row[key];
        }
        // this.addError("Field", `Can't find field ${header} in row ${row + 1} please check your data`);
        return "";
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

    createError(tab, message, row) {
        const _errors = this._errors;
        const arrays = [];
        if (row) {
            arrays.push({
                tab: tab,
                message: message
            });
            _errors[row] = arrays;
        }
        this._errors = _errors;
    }

    showErrors() {
        if (this.errors.length) {
            alert(this.errors.map(error => `${error.tab}: ${error.message}`).join("\n"));
            return false;
        }
        return true;
    }

    replaceItem(item) {
        // template : <i>-dub-</i> => <i style="white-space:nowrap;display:inline;">-dub-</i>
        // <i>dub</i> => <i>dub</i>
        // <i> -dub- </i> => <i style="white-space:nowrap;display:inline;">-dub-</i>
        // <i>-dub</i> => <i style="white-space:nowrap;display:inline;">-dub</i>
        // <i>dub-</i> => <i style="white-space:nowrap;display:inline;">dub-</i>
        item = this.replaceItalicOfItem(item);

        // bold tag and replace item in bold tag
        item = this.replaceBoldOfItemAndAddBoldTag(item);

        // if character before <b> or <i> or <word\d+> is not space, add space before <b> or <i> or <word\d+>
        item = this.addSpaceBeforeTag(item);

        // if character after </b> or </i> or </word\d+> is not space, add space after </b> or </i> or </word\d+>
        item = this.addSpaceAfterTag(item);

        // remove <label></label>
        item = this.removeLabel(item);

        return item;
    }

    removeLabel(item) {
        const regex_ = /<label>(.*?)<(\/|)label>/;
        return item.match(regex_) ? item.replaceAll(item.match(regex_)[0], '').trim() : item.trim();
    }

    replaceItalicOfItem(item, regex) {
        regex = regex || /<i>(.+?)<(\/|)i>/g;
        if (item.match(regex)) {
            item = item.replaceAll(regex, '<i style="white-space:nowrap;display:inline;">$1</i>');
        }
        return item;
    }

    replaceBoldOfItemAndAddBoldTag(item) {
        let regex = /<b>(.+?)<b>/g;
        if (item.match(regex)) {
            item = item.replaceAll(regex, '<b>$1</b>');
        }
        regex = /<b>(?<word>.+?)<(\/|)b>/g;
        if (item.match(regex)) {
            const word = regex.exec(item).groups.word;
            const _regex_ = new RegExp(`([^<b>])${word}([^</b>])`, 'g');
            item = item.replaceAll(_regex_, `<b>${word}</b>`);
        }
        return item;
    }

    addSpaceBeforeTag(item, regex) {
        regex = regex || /<([bi]|word\d+)>/g;
        return this.addSpaceBeforeAndAfterTag(item, regex, true);
    }

    addSpaceAfterTag(item, regex) {
        regex = regex || /<(\/)([bi]|word\d+)>/g;
        return this.addSpaceBeforeAndAfterTag(item, regex, false);
    }

    addSpaceBeforeAndAfterTag(item, regex, before = true) {
        const replace = (match) => before ? `$1 ${match}` : `${match} $1`;
        const _regex = (match) => before ? new RegExp(`([^ ])${match}`, 'g') : new RegExp(`${match}([^ ])`, 'g');

        const match = item.match(regex);

        if (match) {
            match.forEach(match => {
                item = item.replaceAll(_regex(match), replace(match));
            });
        }
        return item;
    }

    passageConverterV02(content) {
        const f_regex = /<paragraph (id|ID|)( |)=( |)(\d+)>/g;
        const l_regex = /<\/paragraph( (id|ID|)( |)=( |)(\d+)|)>/g;

        const word_regex = /<word(\d+)>.+?<(\/|)word(\d+)>/g;

        const title_regex = /<title>.*<(\/|)title>/g;

        content = content
            .replace(title_regex, "")                                   // remove title tag
            .replaceAll(/<bullet>/g, "<li>")                            // replace <bullet> tag to <li> tag
            .replaceAll(/<\/bullet>/g, "</li>")   // replace </bullet> tag to </li> tag
            .replaceAll(/[“”]/g, '"')             // replace “ or ” to "

        // add <ul> tag before first <li> tag
        const firstLiIndex = content.indexOf("<li>");
        const passageBodyWithUl = firstLiIndex !== -1 ? content.slice(0, firstLiIndex) + "<ul>" + content.slice(firstLiIndex) : content;
        // add </ul> tag after last <li> tag
        const lastLiIndex = passageBodyWithUl.lastIndexOf("</li>");
        const passageBodyWithUlAndLi = lastLiIndex !== -1 ? passageBodyWithUl.slice(0, lastLiIndex) + "</ul>" + passageBodyWithUl.slice(lastLiIndex) : passageBodyWithUl;

        // replace <paragraph id=0> to <div class="paragraph" id="0">
        const replaceDiv = (match) => {
            const regexNumber = /\d+/;
            const matchNumber = match.match(regexNumber);
            const paragraphId = matchNumber ? matchNumber[0] : '';
            return `<div class="paragraph" id="${paragraphId}">`;
        }

        // replace <word3186>inanimate</word3186> to <word3186>word3186:inanimate</word3186>
        const replaceWord = (match) => {
            const regexNumber = /\d+/;
            const matchNumber = match.match(regexNumber);
            const wordId = matchNumber ? matchNumber[0] : '';
            const word = match.replaceAll(/<(\/|)word\d+>/g, '').trim();
            return `<word${wordId}>word${wordId}:${word}</word${wordId}>`;
        }

        return passageBodyWithUlAndLi.replaceAll(f_regex, replaceDiv) // replace <paragraph id=0> to <div class="paragraph" id="0">
            .replaceAll(l_regex, "</div>")  // replace </paragraph> tag to </div> tag
            .replaceAll(word_regex, replaceWord); // replace <word3186>inanimate</word3186> to <word3186>word3186:inanimate</word3186>
    }

    getPassageSummaryText(row) {
        const passageSummaryText = this.getField("Choice Page Summary Text", row);

        if (!passageSummaryText) return "";

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

    wordIdConverter(content) {
        const word_regex = /<word(\d+)>.+?<(\/|)word(\d+)>/g;

        const replaceWord = (match) => {
            const regexNumber = /\d+/;
            const matchNumber = match.match(regexNumber);
            const wordId = matchNumber ? matchNumber[0] : '';
            const word = match.replaceAll(/<(\/|)word\d+>/g, '').trim();
            return `<word${wordId}>word${wordId}:${word}</word${wordId}>`;
        }

        return content.replaceAll(word_regex, replaceWord);
    }
}
