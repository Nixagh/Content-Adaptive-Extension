class VisualProcess extends VWAProcess {
	getDescription() {
		return "InstructionVideo";
	}

	getFullContent() {
		const wordListContent = this.getWordListSheet();
		const definitionsContent = this.getDefinitionSheet();

		return definitionsContent.map((word) => {
			const visual = wordListContent.find(visual => visual["WordID"] === word["WordID"]);
			return {
				...word,
				...visual
			}
		});
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
	getVideoSource(row) {
		return `/content/${this.getGlobalResourceId()}/${this.getVideoPickup(row)}/VW_unavailableVideo.mp4`;
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
