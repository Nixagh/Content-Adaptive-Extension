class VCProcess extends VWAProcess {
    getAdaptiveAnswerCount() {
        return 2;
    }

    getFullContent() {
        const wordListContent = this.getWordListSheet();
        const wtContent = this.getWTSheet();

        return {first: wtContent, second: wordListContent};
    }

    mapping({first, second}) {
        const vcContent = this.getVCSheet();

        return first.map((word) => {
            const wordID_1 = this.getFieldOfRow("WordID", word);
            const wordList = second.find(wordList => Utility.equalsWordId(this.getFieldOfRow("WordID", wordList), wordID_1));
            if (wordList === undefined) {
                this.addError(`Question Content`, `Word ID: ${word["Word ID"]} not found in Word List`);
                return;
            }
            return {...word, ...wordList};
        }).map((word) => {
            const pathWay = this.getExactlyFieldOfRow("P2 Set", word);
            const vc = vcContent.find(vc => Utility.equals(pathWay, this.getExactlyFieldOfRow("Pathway 2 Set", vc)));
            return {...word, ...vc};
        }).map((word) => {
            this.removeOtherField(word);
            return {...word}
        });
    }

    removeOtherField(word) {
        for (let i = 1; i <= 6; i++) {
            const _word = word[`Word`].toLowerCase().trim();
            const wordIDs = this.getWordListSheet().filter(wordList => wordList["Word"].toLowerCase().trim() === _word).map(item => item["WordID"]);
            const onWord = word[`Item ${i}`].includes(word[`Word`]);
            const CorrectFeedback= word[`Item ${i} Correct Feedback`] || word[`Item ${i} Correct Answer Feedback`];
            const onCorrectFeedback = wordIDs.map(wordID => CorrectFeedback.includes(wordID));
            const onIncorrectFeedback1 = wordIDs.map(wordID => word[`Item ${i} Incorrect Feedback 1`].includes(wordID));
            const onIncorrectFeedback2 = wordIDs.map(wordID => word[`Item ${i} Incorrect Feedback 2`].includes(wordID));

            if (onWord
                || onCorrectFeedback.reduce((x, y) => x || y)
                || onIncorrectFeedback1.reduce((x, y) => x || y)
                || onIncorrectFeedback2.reduce((x, y) => x || y)
            ) {
                word[`Item`] = word[`Item ${i}`];
                word[`Item Standard`] = word[`Item ${i} Standard`];
                word[`Item Answer Choices`] = word[`Item ${i} Answer Choices`];
                word[`Item Correct Answer`] = word[`Item ${i} Correct Answer`];
                word[`Item Correct Answer Feedback`] = word[`Item ${i} Correct Answer Feedback`] || word[`Item ${i} Correct Feedback`];
                word[`Item Incorrect Feedback 1`] = word[`Item ${i} Incorrect Feedback 1`];
                word[`Item Incorrect Feedback 2`] = word[`Item ${i} Incorrect Feedback 2`];
            }
            delete word[`Item ${i}`];
            delete word[`Item ${i} Standard`];
            delete word[`Item ${i} Answer Choices`];
            delete word[`Item ${i} Correct Answer`];
            delete word[`Item ${i} Correct Answer Feedback`];
            delete word[`Item ${i} Incorrect Feedback 1`];
            delete word[`Item ${i} Incorrect Feedback 2`];
        }
    }

    getWTSheet() {
        const wtSheetName = `WordTies`;
        const wtSheet = this.getSheet(wtSheetName);
        const wtHeader = this.getHeader(wtSheet);
        return this.getContent(wtSheet, wtHeader);
    }

    getVCSheet() {
        return [];
    }

    getComponentScoreRules(row) {
        // {"test":null,"scoringGroups":[{"componentGradingRules":[{"componentId":"802909_GT_VIC_OL_u09_q08_ans01","componentType":"MultipleChoice","componentSubtype":null,"autoScore":true,"rubricRule":null}],"maxScore":1}]}
        const componentGradingRules = {
            test: null,
            scoringGroups: [
                {
                    componentGradingRules: [
                        {
                            componentId: this.getCID(row),
                            componentType: "MultipleChoice",
                            componentSubtype: null,
                            autoScore: true,
                            rubricRule: null
                        }
                    ],
                    maxScore: this.getMaxScore()
                }
            ]
        }
        return JSON.stringify(componentGradingRules);
    }

    setPassage(row) {
        const directionLine = new Cke("cke_directionLine");
        const passageContent = new Cke("cke_2_contents");
        const choosePassage = document.querySelectorAll("#questionTypeSelection")[1];

        let directionLineHTML = this.getDirectionLineHTML(row);
        let passageContentHTML = this.getPassageContent(row);

        if (row > 0 && row < 6) {
            choosePassage.value = choosePassage.options[1].value;
        }
        if (row > 6) {
            choosePassage.value = choosePassage.options[2].value;
        }
        if (row === 0 || row === 6) {
            directionLine.setHtml(directionLineHTML);
            passageContent.setHtml(passageContentHTML);
        } else {
            this.getAjaxPassage(choosePassage.value).then(result => {
                directionLine.setHtml(result.directionLineHTML);
                passageContent.setHtml(result.passageContentHTML);
            });
        }

        console.log("Set passage");
    }

    getDirectionLineHTML(row) {
        if (row === 0 || row === 6)
            return this.getField("Direction Line", row);
        return "";
    }

    getPassageContent(row) {
        if (row !== 0 && row !== 6) return "";
        const title = this.getPassageTitle(row);
        const content = this.getPassageBody(row);

        const passageTitle = `<div class="title">${title}</div>`;

        const passageContent = this.passageConverter(content);
        return `<div class="direction_section">
					<div audio-source="" class="audio-inline" style="display: inline-flex; width: auto;"></div>
					${passageTitle}
					${passageContent}
				</div>`
    }

    getPassageBody(row) {
        const passageBody = this.getField("Passage Body", row);
        const splitPassageBody = passageBody.split("\n");
        return splitPassageBody.slice(1).join("\n");
    }

    getPassageTitle(row) {
        const passageBody = this.getField("Passage Body", row);
        const splitPassageBody = passageBody.split("\n");
        return splitPassageBody[0]
            .replace("<title>", "").replace("</title>", "").replace("title>", "").replace("<", "").replace("</title", "");
    }

    getQuestionHTML(row) {
        return `<div class="question-questionStem question-questionStem-1-column">
					<div class="question-stem-content">
						<div class="question">${this.getItem(row)}
							<div cid="${this.getCID(row)}" ctype="MultipleChoice" layout="Vertical" qname="a${row + 1}" showlabel="true" subtype="MC">
								${this.getAnswerChoices(row)}
							</div>
						</div>
					</div>
				</div>`;
    }

    getCorrectAnswer(row) {
        // {"comps":[{"id":"802909_GT_VIC_OL_u09_q12_ans01","value":"a","type":"MultipleChoice"}]}
        const correctAnswer = {
            comps: [
                {
                    id: `${this.getCID(row)}`,
                    value: this.getCorrectAnswerValue(row),
                    type: "MultipleChoice"
                }
            ]
        }
        return JSON.stringify(correctAnswer);
    }

    getCorrectTextHTML(row) {
        return this.getCorrectAnswerValue(row);
    }

    getCorrectAnswerValue(row) {
        const correctAnswer = this.getField("Item Correct Answer", row);
        // const answerChoices = this.getListAnswerChoices(row);
        // const index = answerChoices.findIndex(value => value.includes(correctAnswer));
        // return String.fromCharCode(97 + index);
        return correctAnswer.split(".")[0].trim().toLowerCase();
    }

    getItem(row) {
        let item = this.getExactlyField("Item", row);
        return this.replaceItalicOfItem(item);
    }

    getAnswerChoices(row) {
        const listAnswerChoices = this.getListAnswerChoices(row);
        return listAnswerChoices.map((value, index) => `<div itemid="${String.fromCharCode(97 + index)}" itemlabel="">${value}</div>`)
            .join("");
    }

    getListAnswerChoices(row) {
        const answerChoices = this.getField("Item Answer Choices", row);
        // template : a. spiritless b. alive c. energetic d. sprightly
        // result : ["spiritless", "alive", "energetic", "sprightly"]
        const listAnswerChoices = [];
        listAnswerChoices[0] = answerChoices.split("a. ")[1].split("b. ")[0].replaceAll("\n", "").replace(";", "");
        listAnswerChoices[1] = answerChoices.split("b. ")[1].split("c. ")[0].replaceAll("\n", "").replace(";", "");
        listAnswerChoices[2] = answerChoices.split("c. ")[1].split("d. ")[0].replaceAll("\n", "").replace(";", "");
        listAnswerChoices[3] = answerChoices.split("d. ")[1].replaceAll("\n", "").replace(";", "");
        return listAnswerChoices;
    }

    getFeedback(row) {
        const feedback = {
            "correctFeedback": this.getCorrectFeedback(row),
            "incorrectFeedback1": this.getIncorrectFeedback1(row),
            "incorrectFeedback2": this.getIncorrectFeedback2(row),
            "correctEmoji": this.getCorrectEmoji(row),
            "incorrectEmoji1": this.getIncorrectEmoji1(row),
            "incorrectEmoji2": this.getIncorrectEmoji2(row),
            "paragraphId": `${this.getParagraphId(row)}`,
        }
        return JSON.stringify(feedback);
    }

    getCorrectFeedback(row) {
        return this.getExactlyField("Item Correct Answer Feedback", row).split("\n")
            .map(value => this.replaceCorrectFeedback(value, row));
    }

    replaceCorrectFeedback(value, row) {
        return this.replaceFeedback(value, row);
    }

    getIncorrectFeedback1(row) {
        const incorrectFeedback1 = this.getField("Item Incorrect Feedback 1", row);
        return this.toArray(incorrectFeedback1, row);
    }

    getIncorrectFeedback2(row) {
        const incorrectFeedback2 = this.getField("Item Incorrect Feedback 2", row);
        return this.toArray(incorrectFeedback2, row);
    }

    getCorrectEmoji(row) {
        const correctEmoji = this.getField("Correct emoji with feedback phrases randomly selected:", row);
        return this.toArray(correctEmoji, row);
    }

    getIncorrectEmoji1(row) {
        const incorrectEmoji1 = this.getField("Incorrect emoji with Feedback phrases randomly selected:", row);
        return this.toArray(incorrectEmoji1, row);
    }

    getIncorrectEmoji2(row) {
        const incorrectEmoji2 = this.getField("Incorrect emoji and Final incorrect feedback.", row);
        return this.toArray(incorrectEmoji2, row)
    }

    getParagraphId(row) {
        const item = this.getItem(row);
        const regex = /paragraph \d+/g;
        const match = item.match(regex);
        const numberRegex = /\d+/;
        const number = match ? match[0].match(numberRegex)[0] : -1;
        return parseInt(number);
    }

    getWord(row) {
        return this.getExactlyField("Word", row);
    }

    toArray(value, row) {
        return value.split("\n").map(value => this.replaceFeedback(value.replaceAll("\r", "").trim(), row));
    }

    replaceFeedback(value, row) {
        const wordId = this.getWordIdSpecial(row);

        const regex = /<(b|word(\d+))>.*?<(\/)(b|word(\d+))>/g
        const match = value.match(regex);
        const word = match ? match[0].replaceAll(/<(\/|)(b|word(\d+))>/g, "") : "";
        const replaceValue = `<${wordId}>${wordId}:${word}</${wordId}>`;

        return value
            .replace(regex, replaceValue)
            .replaceAll(/[“|”]/g, `"`)
            .trim();
    }

    getWordIdSpecial(row) {
        return this.getField("WordID", row);
    }

    getWordId(row) {
        return "";
    }

    getStandard(row) {
        const standard = this.getField("Item Standard", row);
        if (!standard) this.addError(`Standard`, `Standard is empty at row ${row + 1}`);
        return standard;
    }
}
