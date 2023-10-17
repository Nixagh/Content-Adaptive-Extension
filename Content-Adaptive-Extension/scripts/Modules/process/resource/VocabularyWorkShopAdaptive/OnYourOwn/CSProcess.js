class CSProcess extends VWAProcess {
	getFullContent() {
		const wordListContent = this.getWordListSheet();
		const csContent = this.getCSSheet();

		return csContent.map((cs) => {
			const word = wordListContent.find(word => word["WordID"] === cs["Word ID"]);
			return {
				...word,
				...cs
			}
		});
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
		return this.getField("Direction Line", row);
	}

	getQuestionHTML(row) {
		const item = this.getItem(row);
		const replace = `[FIB: anno: ${this.getCorrectWord(row)}]`;
		const option = `<div cid="${this.getCID(row)}" ctype="Drop_Down" qname="a${row + 1}">${this.getOptions()}</div>`;
		const question = item.replace(replace, option);

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
}