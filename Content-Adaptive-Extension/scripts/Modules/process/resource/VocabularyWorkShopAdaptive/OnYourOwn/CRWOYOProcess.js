class CRWOYOProcess extends VWAProcess {
	getFullContent() {
		const crwContent = this.getCRWSheet();
		const wordListContent = this.getWordListSheet();

		return {first: crwContent, second: wordListContent};
	}

	getCRWSheet() {
		const crwSheetName = `CtheRW`;
		const crwSheet = this.getSheet(crwSheetName);
		const crwHeader = this.getHeader(crwSheet);
		return this.getContent(crwSheet, crwHeader);
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
		};
		return JSON.stringify(CSR);
	}

	getRetryCount() {
		return 1;
	}

	getDirectionLineHTML(row) {
		return this.getField("Direction Line", row);
	}

	getQuestionHTML(row) {
		const item = this.getItem(row);
		const regex = /\[FIB: anno: (.*)]/;

		const option = `<div cid="${this.getCID(row)}" ctype="Drop_Down" qname="a${row + 1}">${this.getOptions(row)}</div>`;
		const question = item.replace(regex, option);

		return `<div class="question-questionStem question-questionStem-1-column">
					<div class="question-stem-content">
						<div class="question">${question}</div>
					</div>
				</div>`;
	}

	getCorrectAnswer(row) {
		// {"comps":[{"id":"802906_OYO_CTRW_u05_q01_ans01","value":"a","type":"Drop_Down","subtype":null}]}
		const comps = {
			comps: [{
				id: this.getCID(row),
				value: this.getValueForCorrectAnswer(row),
				type: "Drop_Down",
				subtype: null
			}]
		}
		return JSON.stringify(comps);
	}

	getValueForCorrectAnswer(row) {
		const correctAnswer = this.getCorrectTextHTML(row);
		const answerChoices = this.getAnswerChoices(row);
		const index = answerChoices.indexOf(correctAnswer);
		return String.fromCharCode(97 + index);
	}

	getCorrectTextHTML(row) {
		return this.getCorrectWord(row);
	}

	getCorrectWord(row) {
		return this.getField("Correct Answer", row);
	}
	// ----------------- get field ----------------- //
	getItem(row) {
		return this.beautifullyItem(this.getExactlyField("Item", row));
	}

	getAnswerChoices(row) {
		const string = this.getField("Answer Choices", row);
		const split = string.split(";").map((item) => item.trim());
		if (split.length !== 3) alert("Answer Choices must have 3 items");
		return split;
	}
	// ----------------- other ----------------- //
	getOptions(row) {
		const listOfAnswers = this.getAnswerChoices(row);
		let options = '';
		// for loop a -> z
		for (let i = 0; i < listOfAnswers.length; i++) {
			options += `<div idx="${String.fromCharCode(97 + i)}">${listOfAnswers[i]}</div>`;
		}
		return `<div subid="options">${options}</div>`;
	}

	getDescription() {
		return "OYO_CTRW";
	}
}
