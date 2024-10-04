class WSProcess extends VWAProcess {
	getDescription() {
		return "WS";
	}

	getFullContent() {
		const wordListContent = this.getWordListSheet();
		const wsContent = this.getWSSheet();
		const definitionsContent = this.getDefinitionSheet();

		const firstMapping = this.getFirstMapping(wsContent, definitionsContent);
		return {first: firstMapping, second: wordListContent};
	}

	getFirstMapping(wordStudy, definitions) {
		return wordStudy.map((row, index) => {
			return {
				...row,
				"Question Number": index + 1
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
		const definitionSheetName = `Unit 1_VWIE`;
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
						${prefix ? prefix : ""}
						${rootOrBase ? rootOrBase : ""}
						${suffix ? suffix : ""}
						${introduction ? `<div class="introduction">${introduction}</div>` : ""}
						${firstSample ? `<div class="first-sample">${firstSample}</div>` : ""}
						${firstExplain ? `<div class="first-explain">${firstExplain}</div>` : ""}
						${characteristicsImage === "Multiple-meaning Word" ? `<div class="first-alttext"></div>` : ""}
						${secondSample ? `<div class="second-sample">${secondSample}</div>` : ""}
						${secondExplain ? `<div class="second-explain">${secondExplain}</div>` : ""}
						${characteristicsImage === "Multiple-meaning Word" ? `<div class="second-alttext"></div>` : ""}
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
		//return this.getField("Question Number", row);
		return row + 1;
	}

	getInflectedForm(row) {
		return this.getField("Inflected Forms", row) || this.getField("Inflected Form", row);
	}

	getCharacterImage(row) {
		const characterImage = this.getField("Characteristic Image", row) || this.getField("Characteristics Image", row);
		// if characterImage is Multiple Meaning, convert to Multiple-meaning

		return characterImage.includes("Multiple") || characterImage.includes("Meaning")
			? "Multiple-meaning Word"
			: characterImage.replaceAll("Parts of Speech", "Part of Speech").trim();
	}

	getPrefix(row) {
		const prefix = this.getField("Prefix", row);
		const style = (value) => `<div class="prefix">${value}</div>`;
		return this.processSplit(prefix, style);
	}

	getRootOrBase(row) {
		const rootOrBase = this.getField("Root or Base", row);
		const style = (value) => `<div class="root-or-base">${value}</div>`;
		return this.processSplit(rootOrBase, style);
	}

	getSuffix(row) {
		const suffix = this.getField("Suffix", row);
		const style = (value) => `<div class="suffix">${value}</div>`;
		return this.processSplit(suffix, style);
	}

	getIntroduction(row) {
		return this.getField("Introduction", row);
	}

	getFirstExample(row) {
		let firstExample = this.getField("Sample Sentence 1", row) || this.getField("Sample Sentence", row);
		// firstExample = this.beautifulParagraph(firstExample);
		return this.exampleReplace(firstExample);
	}

	getFirstExplanation(row) {
		return this.getField("Sample Sentence 1 Explanation", row);
	}

	getSecondExample(row) {
		let secondExample = this.getField("Sample Sentence 2", row);
		// secondExample = this.beautifulParagraph(secondExample);
		if (secondExample && secondExample.startsWith("or ")) secondExample = secondExample.substring(3);

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
	processSplit(content, stringStyle) {
		if (!Utility.isNotNull(content)) return "";

		const split = content.split("\n").filter(value => Utility.isNotNull(value));
		const newSplit = split.map((value, index) => {
			let _value = value
				.replaceAll("\n", "")
				.replaceAll("\r", "")
				.replace("'", "")
				.trim();
			if (index % 2 === 0) _value = `<b>${_value}</b>`;
			return _value;
		})
		const step2 = newSplit.join("<br/>").split("<br/><b>");
		return step2.map((value, index) => {
			if (index % 2 === 1) return stringStyle(`<b>${value}`);
			return stringStyle(value);
		}).join("\n");
	}

	exampleReplace(example) {
		return example ? example.replaceAll("<i>", "<mean><i>").replaceAll("</i>", "</i></mean>") : "";
	}

	genImageDetail(image, number) {
		return image ? `<img src="/cms/repository/cms/images2020/${image}" style="width: 334px; height: 234px;" />` : "";
	}
}
