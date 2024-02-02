class VisualProcess extends VWAProcess {
	getDescription() {
		return "InstructionVideo";
	}

	getFullContent() {
		const wordListContent = this.getWordListSheet();
		const definitionsContent = this.getDefinitionSheet();

		return {first: wordListContent, second: definitionsContent};
	}

	getDefinitionSheet() {
		const definitionSheetName = `Definitions`;
		const definitionSheet = this.getSheet(definitionSheetName);
		const definitionsHeader = this.getHeader(definitionSheet);
		return this.getContent(definitionSheet, definitionsHeader);
	}

	mapping({first, second}) {
		const _super = super.mapping({first, second});
		return this.sortInThemeByWord(_super);
	}

	getQuestionHTML(row) {
		return `<div class="question-questionStem question-questionStem-1-column">
					<div class="question-stem-content">
						<div class="question">
							<div cid="${this.getCID(row)}" ctype="Video" data-source="${this.getVideoSource(row)}" qname="a${row + 1}"></div>
						</div>
					</div>
				</div>`
	}

	getCorrectAnswer(row) {
		const correctAnswer = {
			comps: [
				{
					id: `${this.getCID(row)}`,
					value: "",
					type: "Video"
				}]
		}
		return JSON.stringify(correctAnswer);
	}

	// ------------------ get data ------------------ //
	getMaxScore() {
		return 0;
	}

	getVideoSource(row) {
		return this.getVideoPickup(row);
	}

	getVideoPickup(row) {
		const productId =  this.getProductCode();
		const word = this.getWord(row).replace("*", "").trim();
		let videoNumber = this.getField("Instructional Video Pickup Code", row);

		if (isNaN(videoNumber)) {
			return "/content/802906/007744939/VW_unavailablevideo.mp4";
		}
		return `/content/${productId}/resourcecode/${word}.mp4`;
	}

	getWord(row) {
		return this.getExactlyField("Word", row);
	}
}
