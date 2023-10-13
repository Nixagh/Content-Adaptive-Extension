class ENProcess extends VWAProcess {
	getDescription() {
		return "GT_EN";
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
		return this.groupByItemNumber(fullContent).slice(1);
	}

	getEAN() {
		const sheetName = `GP Examples and NonEx`;
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
			const word = wordListContent.find(word => word["WordID"] === row["Word ID"]);
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
													<div cid="${this.getCID(row)}" ctype="Drag_n_Drop_Adaptive" evalsourceanswers="false" framesize="" initcount="" layout="fixed_layout" multipledrag="false" multipledrop="false" printtype="Write_on_Line" qname="a${parseInt(row)}" removeitemafterdrag="false" subtype="">
													<div style="text-align:left" subid="sourceItems">
													<div idx="1">${this.getItem(row, 1)}</div>
													<div idx="2">${this.getItem(row, 2)}</div>
													<div idx="3">${this.getItem(row, 3)}</div>
													<div idx="4">${this.getItem(row, 4)}</div>
												</div>
												<div subid="targetItems">
												<div idx="a">Nonexample</div>
												<div idx="b">Example</div>
												<div idx="c">Neither</div>
											</div>
										</div>
									</div>
								</div>
							</div>`;
	}

	getCorrectAnswer(row) {
		const a = this.getIndexAnswerType(row, "Nonexample");
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
			if (row["Correct Answer"].toLowerCase().trim() === type.toLowerCase().trim()) {
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
		return this.getFieldOfRow("Example column direction pop-up", this.data[row][0]);
	}

	getNeitherColumnDirectionPOPUP(row) {
		return this.getFieldOfRow("Neither column direction pop-up", this.data[row][0]);
	}

	getItem(row, index) {
		return this.getFieldOfRow("item", this.data[row][index - 1]);
	}

	getCorrectEmoji(row) {
		const correctAnswerEmoji = this.data[row][0]["Correct emoji with feedback phrases randomly selected after all tiles are placed correctly whether by the student or by the program:"];
		return this.beautifulEmoji(correctAnswerEmoji);
	}

	getIncorrectEmoji(row) {
		const incorrectAnswerEmoji = this.data[row][0]["Incorrect emoji  with feedback phrases randomly selected:"];
		return this.beautifulEmoji(incorrectAnswerEmoji);
	}

	getItemFeedback(row) {
		return this.data[row].map((row) => {
			const wordId = row["Word ID"];

			const incorrectFeedback1 = this.getFieldOfRow("Incorrect Feedback 1", row);
			const incorrectFeedback2 = row["Incorrect Feedback 2"];

			return {
				item: row["item"],
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
		return this.getFieldOfRow("P1 Set", this.data[row][0]);
	}

	getPathway2(row) {
		return this.getFieldOfRow("P2 Set", this.data[row][0]);
	}

	// ----------------- other ----------------- //
	checkNumberAnswerType(value, key) {
		return value.length !== 0 ? `${key}:${value}` : ``;
	}

	beautifulEmoji(emoji) {
		return emoji.split("\n").map((emoji) => emoji.trim()).filter((emoji) => emoji !== "");
	}

	updateFeedback1(incorrectFeedback1, wordId) {
		const _ = `<b>`;
		const replace = `<${wordId}>`;
		let step1 = incorrectFeedback1.replace(_, `${replace}${wordId}:`);
		if (step1.includes(`<b>`)) step1 = step1.replace(`<b>`, `</${wordId}>`);
		if (step1.includes(`</b>`)) step1 = step1.replace(`</b>`, `</${wordId}>`);
		return step1.trim();
	}

	updateFeedback2(incorrectFeedback2, wordId) {
		const _ = `<${wordId}>`;
		return incorrectFeedback2.replace(_, `${_}${wordId}:`);
	}
}
