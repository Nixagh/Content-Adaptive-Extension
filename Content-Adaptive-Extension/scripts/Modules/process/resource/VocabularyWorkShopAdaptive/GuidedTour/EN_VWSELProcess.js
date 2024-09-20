class EN_VWSELProcess extends VWAProcess {
	getDescription() {
		return "ENE";
	}

	getFullContent() {
		const wordListContent = this.getWordListSheet();
		const eanContent = this.getEAN();

		// process data in eanContent
		// update other rows in eanContent by first row with if other row not have field in first row
		// template: firstRow = {a: 1, b: 2, c: 3} | otherRow = {a: 1, b: 2} => otherRow = {a: 1, b: 2, c: 3}
		this.updateContentByFirstRow(eanContent);
		const fullContent = this.mapWordListWithContent(eanContent, wordListContent);

		// group eanContent by Item Number
		// template: [{ "Item Number": 1, a: 1}, {"Item Number: 1, a: 2}] => {1: [{ "Item Number": 1, a: 1}, {"Item Number: 1, a: 2}]}
		return {first: this.groupByItemNumber(fullContent).slice(1), second: []};
	}

	mapping({first, second}) {
		return first;
	}

	filterAchieveSet(data) {
		return data.filter(row => {
			const first = row.filter(e => this.getFieldOfRow("Achieve Set", e) !== "")[0];
			const achieveSet = this.getFieldOfRow("Achieve Set", first);
			return achieveSet.toLowerCase() === this.achieveSet.toLowerCase() || this.achieveSet.toLowerCase() === "ALL".toLowerCase();
		})
	}

	getEAN() {
		const sheetName = `ENE`;
		const sheet = this.getSheet(sheetName);
		const header = this.getHeader(sheet);
		return this.getContent(sheet, header);
	}

	updateContentByFirstRow(content) {
		const firstRow = content[0];
		content.map((row, index) => {
			row["Word ID"] = row["Word ID"].split(" ")[0].trim();
			if (index === 0) return row;
			for (const key in firstRow) {
				// no key in newRow anh except "Points" key
				if (!row.hasOwnProperty(key) && key !== "Points") {
					row[key] = firstRow[key];
				}
			}
			return row;
		});
	}

	mapWordListWithContent(content, wordListContent) {
		return content.map((row) => {
			const word = wordListContent.find(word => Utility.equalsWordId(word["WordID"], row["Word ID"]));
			return {
				...row,
				...word
			}
		});
	}

	groupByItemNumber(content) {
		const groupByItemNumber = [];
		content.forEach((row) => {
			const itemNumber = row["Item Number"];
			if (!groupByItemNumber.hasOwnProperty(itemNumber)) {
				groupByItemNumber[itemNumber] = [];
			}
			groupByItemNumber[itemNumber].push(row);
		});
		return groupByItemNumber;
	}

	getComponentScoreRules(row) {
		const CSR = {
			test: null,
			scoringGroups: [{
				componentGradingRules: [{
					componentId: this.getCID(row),
					componentType: "Drag_n_Drop_Adaptive",
					componentSubtype: null,
					autoScore: true,
					rubricRule: null
				}],
				maxScore: this.getMaxScore()
			}]
		}
		return JSON.stringify(CSR);
	}

	getAdaptiveAnswerCount() {
		return 2;
	}

	getDirectionLineHTML(row) {
		return this.getExactlyFieldOfRow("Direction Line", this.data[row][0]);
	}

	getQuestionHTML(row) {
		return `<div class="question-questionStem question-questionStem-1-column">
								<div class="question-stem-content">
									<div class="nonexample">${this.getNonExampleColumnDirectionPOPUP(row)}</div>
										<div class="example">${this.getExampleColumnDirectionPOPUP(row)}</div>
											<div class="neither">${this.getNeitherColumnDirectionPOPUP(row)}</div>
												<div class="question">
													<div cid="${this.getCID(row)}" ctype="Drag_n_Drop_Adaptive" evalsourceanswers="false" framesize="" initcount="" layout="fixed_layout" multipledrag="false" multipledrop="false" printtype="Write_on_Line" qname="a${parseInt(row) + 1}" removeitemafterdrag="false" subtype="">
													<div style="text-align:left" subid="sourceItems">
													<div idx="1">${this.getItem(row, 1)}</div>
													<div idx="2">${this.getItem(row, 2)}</div>
													<div idx="3">${this.getItem(row, 3)}</div>
													<div idx="4">${this.getItem(row, 4)}</div>
												</div>
												<div subid="targetItems">
												<div idx="a">Non Example</div>
												<div idx="b">Example</div>
												<div idx="c">Neither</div>
											</div>
										</div>
									</div>
								</div>
							</div>`;
	}

	getCorrectAnswer(row) {
		const a = this.getIndexAnswerType(row, "NonExample");
		const b = this.getIndexAnswerType(row, "Example");
		const c = this.getIndexAnswerType(row, "Neither");
		const value = [this.checkNumberAnswerType(a, "a"), this.checkNumberAnswerType(b, "b"), this.checkNumberAnswerType(c, "c")]
			.filter((value) => value !== "");

		const correctAnswer = {
			comps: [
				{
					id: `${this.getCID(row)}`,
					value: value.join(";"),
					type: "Drag_n_Drop_Adaptive"
				}]
		}
		return JSON.stringify(correctAnswer);
	}

	getFeedback(row) {
		const feedback = {
			correctAnswerEmoji: this.getCorrectEmoji(row),
			incorrectAnswerEmoji: this.getIncorrectEmoji(row),
			items: this.getItemFeedback(row)
		}

		return JSON.stringify(feedback);
	}

	// ----------------- get field ----------------- //
	getIndexAnswerType(row, type) {
		const indexes = this.data[row].map((row, index) => {
			const correctAnswer = this.getFieldOfRow("Correct Answer", row);
			if (correctAnswer.toLowerCase().trim() === type.toLowerCase().trim()) {
				return index + 1;
			}
			return 0;
		});
		return indexes.filter(index => index !== 0).join(",");
	}

	getCorrectTextHTML(row) {
		return `Answer will vary.`;
	}

		getNonExampleColumnDirectionPOPUP(row) {
		return this.getFieldOfRow("Nonexample column direction pop-up", this.data[row][0]);
	}

	getExampleColumnDirectionPOPUP(row) {
		return this.getExactlyFieldOfRow("Example column direction pop-up", this.data[row][0]);
	}

	getNeitherColumnDirectionPOPUP(row) {
		return this.getFieldOfRow("Neither column direction pop-up", this.data[row][0]);
	}

	getItem(row, index) {
		const item = this.getExactlyFieldOfRow("Item", this.data[row][index - 1])
		return item[0] === `"` ? item.substring(1, item.length - 1) : item;
	}

	getCorrectEmoji(row) {
		const correctAnswerEmoji = this.getFieldOfRow("Correct Emoji With Feedback", this.data[row][0]);
		return this.beautifulEmoji(correctAnswerEmoji);
	}

	getIncorrectEmoji(row) {
		const incorrectAnswerEmoji = this.getFieldOfRow("Incorrect Emoji With Feedback", this.data[row][0]);
		return this.beautifulEmoji(incorrectAnswerEmoji);
	}

	getItemFeedback(row) {
		return this.data[row].map((row) => {
			const wordId = row["Word ID"];

			const incorrectFeedback1 = this.getFieldOfRow("Incorrect Feedback 1", row);
			const incorrectFeedback2 = this.getFieldOfRow("Incorrect Feedback 2", row);

			return {
				item: row["Item"].trim(),
				correctAnswerFeedback: "",
				incorrectFeedback1: this.updateFeedback1(incorrectFeedback1, wordId) || "",
				incorrectFeedback2: this.updateFeedback2(incorrectFeedback2, wordId) || ""
			}
		});
	}

	getWordId(row) {
		return this.getFieldOfRow("Word ID", this.data[row][0]);
	}

	getStandard(row) {
		return this.getFieldOfRow("Standard", this.data[row][0]);
	}

	getPathway1(row) {
		return 'A';
	}
	
	getPathway2(row) {
		return this.getFieldOfRow("Achieve Set", this.data[row][0]);
	}

	// ----------------- other ----------------- //
	checkNumberAnswerType(value, key) {
		return value.length !== 0 ? `${key}:${value}` : ``;
	}

	beautifulEmoji(emoji) {
		return emoji.split("\n").map((emoji) => emoji.trim()).filter((emoji) => emoji !== "");
	}

	updateFeedback1(incorrectFeedback1, wordId) {
		const regex = /<((?<wordId1>(word|)\d+)|b)>(?<word>.+?)<(\/|)((?<wordId2>(word|)\d+)|b)>/g

		const match = incorrectFeedback1.match(regex);

		if (!match) return incorrectFeedback1;

		const execute = regex.exec(incorrectFeedback1);

		const wordId1 = execute.groups.wordId1;
		const wordId2 = execute.groups.wordId2;

		if(wordId1 !== wordId2) this.addError("Incorrect Feedback", "Word ID is not match");

		const _wordId = wordId1 || wordId;
		const word = execute.groups.word;

		return incorrectFeedback1.replace(regex, `<${_wordId}>${_wordId}:${word}</${_wordId}>`).trim();
	}

	updateFeedback2(incorrectFeedback2, wordId) {
		return incorrectFeedback2.replace(/<b>(.*?)<\/b>/g, `<${wordId}>${wordId}:$1</${wordId}>`);
	}
}
