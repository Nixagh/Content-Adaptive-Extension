class CSProcess extends VWAProcess {
	getFullContent() {
		const wordListContent = this.getWordListSheet();
		const csContent = this.getCSSheet();

		return {first: csContent, second: wordListContent};
	}

	getCSSheet() {
		const csSheetName = `CtheS`;
		const csSheet = this.getSheet(csSheetName);
		const csHeader = this.getHeader(csSheet);
		return this.getContent(csSheet, csHeader);
	}

	getComponentScoreRules(row) {
		const CSR = {
			test: null,
			scoringGroups: [{
				componentGradingRules: [{
					componentId: this.getCID(row),
					componentType: "Drop_Down",
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
		return `<i>Select the word that <b>best</b> completes the sentence. You will use each word only one time.</i>`;
	}

	getQuestionHTML(row) {
		const item = this.getItem(row);
		const option = `<div cid="${this.getCID(row)}" ctype="Drop_Down" qname="a${row + 1}">${this.getOptions()}</div>`;
		// template "The accusation was [FIB: anno: implausible or preposterous] given how little evidence there was to support it."
		// => "The accusation was ${option} given how little evidence there was to support it."
		// template "A(n) [FIB: anno: mediocre] student is one who neither fails nor excels in any subject."
		// => "A(n) ${option} student is one who neither fails nor excels in any subject."
		const regex = /\[FIB: anno: (.*)]/;

		const question = item.replace(regex, option);

		return `<div class="question-questionStem question-questionStem-1-column">
					<div class="question-stem-content">
						<div class="question">${question}</div>
					</div>
				</div>`;
	}

	getCorrectAnswer(row) {
		const index = this.getAnswerList().indexOf(this.getCorrectWord(row)) + 1;
		const value = String.fromCharCode(96 + index);

		// {"comps":[{"id":"802906_OYO_CTRW_u05_q01_ans01","value":"a","type":"Drop_Down","subtype":null}]}
		const comps = {
			"comps": [
				{
					"id": this.getCID(row),
					"value": value,
					"type": "Drop_Down",
					"subtype": null
				}]
		}
		return JSON.stringify(comps);
	}

	getCorrectTextHTML(row) {
		return this.getCorrectWord(row);
	}

	// ----------------- get field -----------------
	getCorrectWord(row) {
		return this.getField("Correct Answer", row);
	}

	getItem(row) {
		return this.getExactlyField("Item", row);
	}

	getWordId(row) {
		return this.getField("Word ID", row);
	}
	getAnswerList() {
		// const string = this.getFieldOfRow("Answer Choices", this.data[0]);
		// const list = string.replaceAll("\r", "").split("\n").map((item) => item.trim());
		// // remove empty string
		// return list.filter((item) => item !== "").slice(1);
		return this.data.map((row) => row["Word"]);
	}
	// ----------------- other -----------------
	getOptions() {
		const listOfAnswers = this.getAnswerList();
		// for loop a -> z
		let options = '';
		for (let i = 0; i < listOfAnswers.length; i++) {
			options += `<div idx="${String.fromCharCode(97 + i)}">${listOfAnswers[i]}</div>`;
		}
		return `<div subid="options">
					${options}
				</div>`;
	}

	getDescription() {
		return "OYO_CTS";
	}

	getPathway2(row) {
		const pathway2 = this.getField("P2 Set", row);
		if (pathway2) return pathway2;
		if (row > 12) return "B";
		return "A";
	}
}
