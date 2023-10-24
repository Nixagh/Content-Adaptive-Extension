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
		//content/802906/007744939/VW_unavailablevideo.mp4
		const productId =  /*this.getGlobalResourceId() ||*/ "802906";
		const videoNumber = /* this.getVideoPickup(row) || */ "007744939";
		const word = /*this.getWord(row).replace("*", "").trim() ||*/ "VW_unavailableVideo.mp4";
		return `/content/${productId}/${videoNumber}/${word}`;
		// return "/content/802906/007744939/VW_unavailablevideo.mp4";
	}

	getVideoPickup(row) {
		let video = this.getField("Instructional Video Pickup Code", row);
		if (!video || video.toLowerCase().trim() === "New".toLowerCase()) {
			this.addError("Question Content", "New video is not available");
			video = "007744939";
		}
		return video;
	}
}
