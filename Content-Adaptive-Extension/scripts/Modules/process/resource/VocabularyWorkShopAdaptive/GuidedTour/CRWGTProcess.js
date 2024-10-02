class CRWGTProcess extends VWAProcess {
	getDescription() {
		return "CTRW";
	}

	getFullContent() {
		const wordListContent = this.getWordListSheet();
		const crwContent = this.getCRWGTSheet();
		return {first: crwContent, second: wordListContent};
	}

	getCRWGTSheet() {
		const crwSheetName = `CtRW`;
		const crwSheet = this.getSheet(crwSheetName);
		const crwHeader = this.getHeader(crwSheet);
		return this.getContent(crwSheet, crwHeader);
	}

	getComponentScoreRules(row) {
		//{"test":null,"scoringGroups":[{"componentGradingRules":[{"": "802906_GT_CTRW_u01_q01_ans01,"componentType":"Drop_Down","componentSubtype":null,"autoScore":true,"rubricRule":null}],"maxScore":1}]}
		const componentScoreRules = {
			test: null,
			scoringGroups: [
				{
					componentGradingRules: [
						{
							componentId: `${this.getCID(row)}`,
							componentType: "Drop_Down",
							componentSubtype: null,
							autoScore: true,
							rubricRule: null
						}
					],
					maxScore: this.getMaxScore()
				}
			]
		}
		return JSON.stringify(componentScoreRules);
	}

	getDirectionLineHTML(row) {
		return '<i>Choose the word that <b>best</b> completes the sentence.</i>';
	}

	getAdaptiveAnswerCount() {
		return 2;
	}

	getQuestionHTML(row) {
		const item = this.getItem(row);
		const option = `<div cid="${this.getCID(row)}" ctype="Drop_Down" qname="a${row + 1}">${this.getOption(row)}</div>`;

		const regex = /[\[(]FIB: anno: (.*)[\])]/;

		const question = item.replace(regex, option);

		return `<div class="question-questionStem question-questionStem-1-column">
					<div class="question-stem-content">
						<div class="question">${question}</div>
					</div>
				</div>`;
	}

	getCorrectAnswer(row) {
		// {"comps":[{"id":"802906_GT_CTRW_u05_q01_ans01","value":"a","type":"Drop_Down","subtype":null}]}
		const correctAnswer = {
			comps: [
				{
					id: `${this.getCID(row)}`,
					value: `${this.getCorrectAnswerValue(row)}`,
					type: "Drop_Down"
				}]
		}
		return JSON.stringify(correctAnswer);
	}

	getCorrectAnswerValue(row) {
		const answerChoices = this.getAnswerChoices(row);
		const correctAnswer = this.getCorrectAnswerText(row);
		const correctAnswerIndex = answerChoices.findIndex(answerChoice => answerChoice.trim() === correctAnswer.trim());
		return String.fromCharCode(97 + correctAnswerIndex);
	}

	getCorrectTextHTML(row) {
		return this.getCorrectAnswerValue(row);
	}

	getCorrectAnswerText(row) {
		return this.getField("Correct Answer", row);
	}

	getFeedback(row) {
		const feedback = {
			"correctFeedback": this.getCorrectFeedback(row),
			"incorrectFeedback1": this.getIncorrectFeedback1(row),
			"incorrectFeedback2": this.getIncorrectFeedback2(row),
			"correctEmoji": this.getCorrectEmoji(),
			"incorrectEmojiFB1": this.getIncorrectEmoji1(),
			"incorrectEmojiFB2": this.getIncorrectEmoji2(),
			"visualClue": this.getVisualClue(row)
		}
		return JSON.stringify(feedback);
	}

	// ------------------ get field ------------------ //
	getItem(row) {
		return this.getExactlyField("Item", row);
	}
	getAnswerChoices(row) {
		const answerChoices = this.getField("Answer Choices", row);
		return answerChoices ? answerChoices.split(/[;|,]/).map(word => Utility.removeExtraSpace(word)).filter(value => Utility.isNotNull(value)) : [];
	}

	getCorrectFeedback(row) {
		const correctFeedback = this.getField("Correct Feedback", row).replaceAll("\n", "").replaceAll("\r", "").trim();

		return this.toArray(correctFeedback).map(item => this.replaceCorrectFeedback(item));
	}

	replaceCorrectFeedback(correctFeedback) {
		correctFeedback = correctFeedback.replaceAll("[", "").replaceAll("]", "");

		const regex = /<(\/|)b>(.*)<(\/|)b>/g;

		const match = correctFeedback.match(regex);
		const word = match ? match[0].replaceAll(/<b>|<\/b>/g, "").trim() : "";

		const wordId = this.getWordIdFromWordList(word).trim();
		if (!wordId) this.addError(`FeedBack`, `Correct Feed Back wrong "${word}" can't find wordID in word list`);

		const replaceValue = `<${wordId}>${wordId}:${word}</${wordId}>`;
		return correctFeedback.replace(regex, replaceValue);
	}

	getIncorrectFeedback1(row) {
		const incorrectFeedback = this.getField("Incorrect Feedback 1", row);
		return this.toArray(incorrectFeedback).map(item => this.replaceIncorrectFeedback(item));
	}

	getIncorrectFeedback2(row) {
		const incorrectFeedback = this.getField("Incorrect Feedback 2", row);
		return this.toArray(incorrectFeedback).map(item => this.replaceIncorrectFeedback(item));
	}

	replaceIncorrectFeedback(incorrectFeedback) {
		const regex = /(\[|)<(\/|)b>(.*)<(\/|)b>(\[|)/g;
		const replaceBy = `<b>{0}</b>`;
		return incorrectFeedback.replace(regex, replaceBy).trim();
	}

	getCorrectEmoji() {
		const correctEmoji = this.getExactlyField("Correct emoji and growth mindset phrases randomly shown:", 0);
		return this.toArray(correctEmoji);
	}

	getIncorrectEmoji1() {
		const incorrectEmoji = this.getField("Incorrect emoji for feedback 1 and growth mindset phrases randomly shown:", 0);
		return this.toArray(incorrectEmoji);
	}

	getIncorrectEmoji2() {
		const incorrectEmoji = this.getField("Incorrect emoji with Growth Mindset Phrase and \"Show Me\" button", 0);
		return this.toArray(incorrectEmoji);
	}

	getVisualClue(row) {
		return this.getField("Visual Clue", row).replaceAll("\"", "").trim();
	}

	// ------------------ other ------------------ //
	toArray(text) {
		return text ? text.split("\n").map(item => Utility.removeExtraSpace(item).replaceAll("\r", "").trim()).filter(value => Utility.isNotNull(value)) : [];
	}

	getOption(row) {
		const answerChoices = this.getAnswerChoices(row);
		let option = '';
		// <div idx="a" word="802906_GT_CTRW_u05_q01_ans01">debits</div>
		answerChoices.forEach((answerChoice, index) => {
			const wordId = this.getWordIdFromWordList(answerChoice.trim());
			if (!wordId) this.addError(`Question Content`, `Answer Choices wrong "${answerChoice}" can't find WordID in word list`);
			option += `<div idx="${String.fromCharCode(97 + index)}" word="${wordId}">${answerChoice}</div>`;
		});
		return `<div subid="options">${option}</div>`;
	}

	getWordIdFromWordList(word) {
		let wordObj = this.data.filter(wordObj =>    wordObj["Word"].trim().toLowerCase() === word.trim().toLowerCase()  
		|| wordObj["Correct Answer"].trim().toLowerCase() === word.trim().toLowerCase() 
		);
		if(wordObj.length === 0 ){
			wordObj = this.ConvertV(word);
		}
		return wordObj.length ? wordObj[0]["Word ID"] : "";
	}

	ConvertV(word){
		let wordConvert = word;
		let check = true;

		while(check){
			if(wordConvert.length === 0 ) return false;
			wordConvert = wordConvert.substr(0 , wordConvert.length - 1);
			let wordObj = this.data.filter((e) => {
 				return e['Word'].trim().toLowerCase().includes(wordConvert.trim().toLowerCase());
				
			});

			if(wordObj.length > 0){
				check = false;
				return wordObj;
			}

		}
		return false;

	}




	
}
