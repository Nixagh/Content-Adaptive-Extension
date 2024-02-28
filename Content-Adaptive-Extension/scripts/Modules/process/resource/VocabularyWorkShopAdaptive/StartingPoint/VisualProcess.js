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
		const url = this.getUrl(row);
		return `<div class="question-questionStem question-questionStem-1-column">
					<div class="question-stem-content">
						<div class="question">
							<div cid="${this.getCID(row)}" ctype="Video" 
								data-source="${url["data-source"]}"
								captions-url="${url["captions-url"]}"
								data-desc-url="${url["data-desc-url"]}"
								descriptions-url="${url["descriptions-url"]}" 
								qname="a${row + 1}">
							</div>
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

	getUrl(row) {
		const videoNumber = this.getField("Instructional Video Pickup Code", row);

		if (isNaN(videoNumber)) return {
			"data-source": "/content/802906/007744939/VW_unavailablevideo.mp4",
			"captions-url": "",
			"data-desc-url": "",
			"descriptions-url": ""
		}

		const productCode = this.getProductCode();
		const word = this.getWord(row).replace("*", "").trim();
		const partOfSpeech = this.getPartOfSpeech(row);
		const wordId = this.getWordId(row);
		const level = this.getLevelFromFileName().replace(" ", "_");
		const unit = this.getUnitFromFileName().toUpperCase();

		const name = this.createVideoName(wordId, level, unit, word, partOfSpeech);

		const resourceCode = "resourcecode"

		const videoUrl = `/content/${productCode}/${resourceCode}/${name}.mp4`;
		const captionsUrl = `/content/${productCode}/${resourceCode}/${name}.srt`;
		const descriptionsUrl = `/content/${productCode}/${resourceCode}/${name}_AD.vtt`;
		const descUrl = `/content/${productCode}/${resourceCode}/${name}_AD.mp4`;

		return {
			"data-source": videoUrl,
			"captions-url": captionsUrl,
			"data-desc-url": descUrl,
			"descriptions-url": descriptionsUrl
		}
	}

	createVideoName(wordId, level, unit, word, partOfSpeech) {
		return `${wordId}_${level}_${unit}_${word}_${partOfSpeech}`;
	}
}
