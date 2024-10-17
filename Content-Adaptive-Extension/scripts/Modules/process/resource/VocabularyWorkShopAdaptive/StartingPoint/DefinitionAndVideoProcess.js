class DefinitionAndVideoProcess extends VWAProcess {

    replacePath(filename) {
        let resourceCode = document.getElementById('pojo.resource.resourceCode').value;
        const productId = this.getProductCode();
        return `/content/${productId}/${resourceCode}/${filename}`;
    }

    getFullContent() {
        const definitionsContent = this.getDefinitionSheet();
        const wordListContent = this.getWordListSheet();

        return {first: definitionsContent, second: wordListContent};
    }

    getDefinitionSheet() {
        const definitionSheetName = `_VWIE`;
        const definitionSheet = this.getSheet(definitionSheetName);
        const definitionsHeader = this.getHeader(definitionSheet);
        return this.getContent(definitionSheet, definitionsHeader);
    }

    getComponentScoreRules(row) {
        const CSR = {
            "test": null,
            "scoringGroups": [
                {
                    "componentGradingRules": [
                        {
                            "componentId": this.getCID(row),
                            "componentType": "Fill_in_Blank",
                            "componentSubtype": "word",
                            "autoScore": true,
                            "rubricRule": null
                        }
                    ],
                    "maxScore": this.getMaxScore()
                }
            ]
        }
        return JSON.stringify(CSR);
    }

    getAdaptiveAnswerCount() {
        return 2;
    }

    getQuestionHTML(row) {

        const inflected = this.getInflectedForm(row);
        const exampleSentence = this.getExampleSentence(row);
        const synAntBody = this.getSynAntBody(row);

        // replace template [FIB: anno: manual] in question by inputReplace
        const inputReplace = `<input autocapitalize="off" autocomplete="off" autocorrect="off" cid="${this.getCID(row)}" ctype="Fill_in_Blank" qname="a${row + 1}" spellcheck="false" subtype="word" type="text" />`;
        const replace = `[${this.getItemType(row)}: anno: ${this.getCorrectWord(row)}]`;

        const _question = this.beautifulQuestion(exampleSentence).replace(replace, inputReplace);
        const inflectedForms = Utility.isNotNull(inflected) ? `<div class="inflected-forms">${inflected}</div>` : ``;
        const question = Utility.isNotNull(_question) ? `<div class="question">${_question}</div>` : ``;

        // Conditional attributes with default paths
        // const captionsUrl = Utility.isNotNull(this.getCaptionsUrl(row)) ? this.replacePath(this.getCaptionsUrl(row)) : ``;
        // const dataDescUrl = Utility.isNotNull(this.getDataDescUrl(row)) ? this.replacePath(this.getDataDescUrl(row)) : ``;
        // const descriptionsUrl = Utility.isNotNull(this.getDescriptionsUrl(row)) ? this.replacePath(this.getDescriptionsUrl(row)) : ``;

        const video = Utility.isNotNull(this.getDataSourceUrl) ? `
        <div class="video" 
            captions-url='${this.getCaptionsUrl(row)}' 
            data-desc-url='${this.getDataDescUrl(row)}' 
            data-source='${this.getDataSourceUrl(row)}' 
            descriptions-url='${this.getDescriptionsUrl(row)}'
        >
        </div>` : ``;

        return `<div class="question-questionStem question-questionStem-1-column">
					<div class="question-stem-content">
						${inflectedForms}
						${synAntBody}
						${question}
						${video}
					</div>
				</div>`;
    }

    getDataSourceUrl(row) {
        let videoNumber = this.getField("Instructional Video Pickup Code", row);

        if (videoNumber === 'TK') {
            return "/content/802906/007744939/VW_unavailablevideo.mp4";
        }

        const videoName = this.getField('Video Name', row);
        return this.replacePath(videoName + ".mp4");
    }

    isNumeric(str) {
        return /^\d+$/.test(str);
    }

    getSynAntBody(row) {
        const synonyms = this.getSynonyms(row);
        const antonyms = this.getAntonyms(row);

        if (!Utility.isNotNull(synonyms) && !Utility.isNotNull(antonyms)) return "";

        const isBoth = Utility.isNotNull(synonyms) && Utility.isNotNull(antonyms);
        const isSyn = Utility.isNotNull(synonyms);
        const isAnt = Utility.isNotNull(antonyms);

        const _synonyms = isSyn ? `<b>SYNONYMS </b>${synonyms}` : '';
        const _antonyms = isAnt ? `<b>ANTONYMS </b>${antonyms}` : '';
        const _separator = isBoth ? `<br/>` : '';

        return `<div class="syn-ant-body">${_synonyms}${_separator}${_antonyms}</div>`
    }

    getCorrectAnswer(row) {
        const correctAnswer = {
            comps: [
                {
                    id: `${this.getCID(row)}`,
                    value: this.getCorrectAnswerValue(row),
                    type: "Fill_in_Blank",
                    subtype: "word"
                }]
        }
        return JSON.stringify(correctAnswer);
    }

    getCorrectTextHTML(row) {
        return this.getCorrectAnswerValue(row);
    }

    getCorrectAnswerValue(row) {
        return this.getCorrectWord(row);
    }

    checkQuestionContent(questionContent, correctAnswerText, correctText, row) {
        const inputRex = /<input.*?\/>/g;

        const input = questionContent.match(inputRex);
        if (input === null) {
            this.createError("questionContent", "Question content does not have input tag", row);
        } else {
            const inputCID = input[0].match(/cid="(?<cid>\d+)"/);
            if (inputCID === null) this.createError("questionContent", "Question content does not have cid attribute", row);

            const inputQName = input[0].match(/qname="(?<qname>.*?)"/);
            if (inputQName === null) this.createError("questionContent", "Question content does not have qname attribute", row);
        }

        // check correct answer text
        if (correctAnswerText !== this.getCorrectAnswerValue(row)) this.createError("correctAnswerText", "Correct answer text is not correct", row);
        if (!correctText) this.createError("correctText", "Correct text is empty", row);
    }

    // ----------------- get field ----------------- //
    getInflectedForm(row) {
        return this.getExactlyField("Inflected Forms", row);
    }

    getSynonyms(row) {
        return this.getField("Synonyms", row);
    }

    getAntonyms(row) {
        return this.getField("Antonyms", row);
    }

    getExampleSentence(row) {
        return this.getField("Example Sentence", row);
    }

    getDataSource(row) {
        return this.getField("Instructional Video Pickup Code", row);
    }

    getCaptionsUrl(row) {
        if (this.checkVideoSub(row)) {
            let videoName = this.getField("Video Name", row);
            return this.replacePath(videoName + "_AD.vtt")
        }
        return "";
    }

    getDataDescUrl(row) {
        if (this.checkVideoSub(row)) {
            let videoName = this.getField("Video Name", row);
            return this.replacePath(videoName + "_AD.mp4")
        }
        return "";
    }

    getDescriptionsUrl(row) {
        if (this.checkVideoSub(row)) {
            let videoName = this.getField("Video Name", row);
            return this.replacePath(videoName + ".srt")
        }
        return "";
    }

    checkVideoSub(row) {
        return this.getField('VideoSub', row) === 'Yes';
    }

    getItemType(row) {
        return this.getField("Item Type", row);
    }

    getCorrectWord(row) {
        return this.getField("Correct Answer(s)", row);
    }

    // ----------------- other ----------------- //
    beautifulQuestion(question) {
        return question.replace("{", "[").replace("}", "]");
    }

    getDescription() {
        return "DV";
    }
}
