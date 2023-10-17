class WSProcess extends VWAProcess {
	getDescription() {
		return "wordstudy";
	}

	getFullContent() {
		const wordListContent = this.getWordListSheet();
		const wsContent = this.getWSSheet();
		const definitionsContent = this.getDefinitionSheet();

		return wsContent.map((word) => {
			const ws = wordListContent.find(ws => ws["WordID"] === word["WordID"]);
			// get row number of wsContent in definitionsContent by WordID
			const wsRowNumber = definitionsContent.findIndex(definition => definition["WordID"] === word["WordID"]);
			return {
				...word,
				...ws,
				"Question Number": wsRowNumber + 1
			}
		});
	}

	getWSSheet() {
		// D_U08_WordStudy
		const wsSheetName = `WordStudy`;
		const wsSheet = this.getSheet(wsSheetName);
		const wsHeader = this.getHeader(wsSheet);
		return this.getContent(wsSheet, wsHeader);
	}

	getDefinitionSheet(header, row) {
		const definitionSheetName = `Definitions`;
		const definitionSheet = this.getSheet(definitionSheetName);
		const definitionsHeader = this.getHeader(definitionSheet);
		return this.getContent(definitionSheet, definitionsHeader);
	}

	getQuestionHTML(row) {
		const inflected = this.getInflectedForm(row);
		const characteristicsImage = this.getCharacterImage(row);
		const prefix = this.getPrefix(row);
		const rootOrBase = this.getRootOrBase(row);
		const suffix = this.getSuffix(row);
		const introduction = this.getIntroduction(row);
		const firstSample = this.getFirstExample(row);
		const firstExplain = this.getFirstExplanation(row);
		const secondSample = this.getSecondExample(row);
		const secondExplain = this.getSecondExplanation(row);
		const wordJournalPrompt = this.getWordJournalPrompt(row);

		const leftImage = this.getLeftImage(row);
		const rightImage = this.getRightImage(row);
		const wordImage = `<div class="word-image">
									${leftImage ? `<div class="left-image">${leftImage}</div>` : ""}
									${rightImage ? `<div class="right-image">${rightImage}</div>` : ""}
								</div>`;

		// if characteristicsImage is Multiple-meaning, add wordImage
		return `<div class="question-questionStem question-questionStem-1-column">
					<div class="question-stem-content">
						${inflected ? `<div class="inflected-form">${inflected}</div>` : ""}
						${characteristicsImage ? `<div class="characteristics-image">${characteristicsImage}</div>` : ""}
						${prefix ? `<div class="prefix">${prefix}</div>` : ""}
						${rootOrBase ? `<div class="root-or-base">${rootOrBase}</div>` : ""}
						${suffix ? `<div class="suffix">${suffix}</div>` : ""}
						${introduction ? `<div class="introduction">${introduction}</div>` : ""}
						${firstSample ? `<div class="first-sample">${firstSample}</div>` : ""}
						${firstExplain ? `<div class="first-explain">${firstExplain}</div>` : ""}
						${secondSample ? `<div class="second-sample">${secondSample}</div>` : ""}
						${secondExplain ? `<div class="second-explain">${secondExplain}</div>` : ""}
						${wordJournalPrompt ? `<div class="word-jounal-promt">${wordJournalPrompt}</div>` : ""}
						${characteristicsImage === "Multiple-meaning Word" ? wordImage : ""}
						<div class="question">
							<div cid="${this.getCID(row)}" ctype="View" qname="a${this.getQuestionNumber(row)}"></div>
						</div>
					</div>
				</div>`;
	}

	getCorrectAnswer(row) {
		const correctAnswer = {
			comps: [
				{
					id: `${this.getCID(row)}`,
					value: "",
					type: "View"
				}]
		}
		return JSON.stringify(correctAnswer);
	}

	getMaxScore() {
		return 0;
	}

	// ------------------ get field ------------------ //
	getQuestionNumber(row) {
		return this.getField("Question Number", row);
	}

	getInflectedForm(row) {
		return this.getField("Inflected Forms", row);
	}

	getCharacterImage(row) {
		const characterImage = this.getField("Characteristic Image", row);
		// if characterImage is Multiple Meaning, convert to Multiple-meaning
		return characterImage === "Multiple Meaning" ? "Multiple-meaning Word" : characterImage;
	}

	getPrefix(row) {
		const prefix = this.getField("Prefix", row);
		return this.processSplit(prefix);
	}

	getRootOrBase(row) {
		const rootOrBase = this.getField("Root or Base", row);
		return this.processSplit(rootOrBase);
	}

	getSuffix(row) {
		const suffix = this.getField("Suffix", row);
		return this.processSplit(suffix);
	}

	getIntroduction(row) {
		return this.getField("Introduction", row);
	}

	getFirstExample(row) {
		let firstExample = this.getField("Sample Sentence 1", row);
		// firstExample = this.beautifulParagraph(firstExample);
		return this.exampleReplace(firstExample);
	}

	getFirstExplanation(row) {
		return this.getField("Sample Sentence 1 Explanation", row);
	}

	getSecondExample(row) {
		let secondExample = this.getField("Sample Sentence 2", row);
		// secondExample = this.beautifulParagraph(secondExample);
		return this.exampleReplace(secondExample);
	}

	getSecondExplanation(row) {
		return this.getField("Sample Sentence 2 Explanation", row);
	}

	getWordJournalPrompt(row) {
		return this.getField("Word Journal Prompt", row);
	}

	getImageDetail(row) {
		const imageDetail = this.getField("Image Detail", row);
		// template <image>802909_U8_3160_PH_WS_aspire1</image>
		// result 802909_U8_3160_PH_WS_aspire
		return imageDetail ? imageDetail.replaceAll("</image>", "").replaceAll("<image>", "").substring(0, imageDetail.length - 1) : "";
	}

	getLeftImage(row) {
		const imageDetail = this.getImageDetail(row);
		return this.genImageDetail(imageDetail, 1)
	}

	getRightImage(row) {
		const imageDetail = this.getImageDetail(row);
		return this.genImageDetail(imageDetail, 2);
	}

	getAdaptiveAnswerCount(row) {
		return null;
	}

	// ------------------ other ------------------ //
	processSplit(content) {
		if (!Utility.isNotNull(content)) return "";

		const split = content.split("\n").filter(value => Utility.isNotNull(value));
		const newSplit = split.map((value, index) => {
			let _value = value.replaceAll("\n", "").replaceAll("\r", "").trim();
			if (index % 2 === 0) _value = `<b>${_value}</b>`;
			return _value;
		})
		return newSplit.join("<br/>");
	}

	exampleReplace(example) {
		return example ? example.replaceAll("<i>", "<mean><i>").replaceAll("</i>", "</i></mean>") : "";
	}

	genImageDetail(image, number) {
		return image ? `<img src="/cms/repository/cms/images2020/${image}${number}.jpg" style="width: 334px; height: 234px;" />` : "";
	}
}