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
	}

	process() {
		this.data = this.getFullContent();
		Storage.Set("GProcess", JSON.stringify(this));
	}

	getFullContent() {
		console.log("getFullContent");
		return [];
	}

	insert() {
		this.errors = [];
		// get row from question number
		const row = parseInt(document.getElementById(Ids.questionNumber).value) - this.rowMinus;

		// set question tab
		if (this.setTab[0]) this.setQuestion(row, true);
		// set passage tab
		if (this.setTab[1]) this.setPassage(row);
		// set question content tab
		if (this.setTab[2]) this.setQuestionContent(row);
		// set feedback tab
		if (this.setTab[3]) this.setFeedback(row);

		console.log(`Insert Vocabulary Word Adaptive, resource: ${VWAResource[this.type].value}`);
		if(this.errors.length) {
			alert(this.errors.map(error => `${error.tab}: ${error.message}`).join("\n"));
		}
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
		}

		const wordIdElement = new BasicInput(ids.wordId);
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

		const componentGradingRulesElement = new BasicInput(ids.componentGradingRules);
		const pathway1Element = new BasicInput(ids.pathway1);
		const pathway2Element = new BasicInput(ids.pathway2);
		const adaptiveAnswerCountElement = new BasicInput(ids.adaptiveAnswerCount);

		wordIdElement.setValue(this.getWordId(row));
		questionNumberElement.setValue(this.getQuestionNumber(row));
		standardsElement.setValue(this.getStandard(row));
		questionTypeElement.setValue(this.getQuestionTypeSelect(row));
		const textShow = questionTypeElement.element.options[questionTypeElement.element.selectedIndex].text;
		questionTypeValueElement.setValue(this.getQuestionTypeValue(row));
		showQuestionTypeValueElement.setText(textShow);
		componentGradingRulesElement.setValue(this.getComponentScoreRules(row));

		pathway1Element.setValue(this.getPathway1(row));
		pathway2Element.setValue(this.getPathway2(row));
		adaptiveAnswerCountElement.setValue(this.getAdaptiveAnswerCount(row));
		console.log("Set question")
	}

	setPassage(row) {
		const directionLine = new Cke("cke_directionLine");
		const passageContent = new Cke("cke_2_contents");
		directionLine.setHtml(this.getDirectionLineHTML(row));
		passageContent.setHtml(this.getPassageContent(row));
		console.log("Set passage");
	}

	setQuestionContent(row) {
		const question = new Cke("cke_5_contents");
		const correctAnswer = new Area("pojo.correctAnswer");
		const correctAnswerHTML = new Cke("cke_38_contents");

		question.setHtml(this.getQuestionHTML(row));
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
		noHeaderContent = noHeaderContent.map((row) => {
			const newRow = {};
			for (const key in row) {
				// remove space in key
				newRow[Utility.beautifullyHeader(key)] = row[key];
				delete row[key];
			}
			return newRow;
		});

		return noHeaderContent.map((row) => {
			for (const key in row) {
				if (row[key] instanceof String) row[key] = row[key].trim();
			}
			return row;
		});
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
		for (let key in row) {
			if (key.includes(Utility.beautifullyHeader(header))) return row[key];
		}
		// return alert(`Can't find field ${header} in row ${row}`);
	}

	getExactlyFieldOfRow(header, row) {
		for (let key in row) {
			if (key === Utility.beautifullyHeader(header)) return row[key];
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
}
