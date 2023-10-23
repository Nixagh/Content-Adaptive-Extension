class VCProcess extends VWAProcess {
    getAdaptiveAnswerCount() {
        return 2;
    }

    getFullContent() {
        const wordListContent = this.getWordListSheet();
        const wtContent = this.getWTSheet();
        const vcContent = this.getVCSheet();

        const wtMap = wtContent.map((word) => {
            const wt = wordListContent.find(wt => Utility.equalsWordId(wt["WordID"], word["Word ID"]));
            return {
                ...word,
                ...wt
            }
        });

        const vcMap = wtMap.map((word) => {
            const vc = vcContent.find(vc => vc["Pathway 2 Set "] === word["P2 Set"] || vc["Pathway 2 Set"] === word["P2 Set"]);
            return {
                ...word,
                ...vc
            }
        });

        return vcMap.map((word) => {
            this.removeOtherField(word);
            return {...word}
        });
    }

    removeOtherField(word) {
        for (let i = 1; i <= 6; i++) {
            if (word[`Item ${i}`].includes(word["Word"])) {
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
        const wordId = this.getWordIdSpecial(row);
        return value.replace(`<b>`, `<${wordId}>${wordId}:`)
            .replace(`</b>`, `</${wordId}>`)
            .replace(`<b>`, `</${wordId}>`)
            .replaceAll(`“`, `"`)
            .replaceAll(`”`, `"`)
            .trim();
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
        const word = this.getWord(row);
        const passageBody = this.getPassageBody(row).split("\n");

        const regex = /<paragraph id = (\d+)>/;
        const orRegex = /<paragraph = (\d+)\/>/;

        const wordInPassage = passageBody.find(value => value.includes(word));

        const match = wordInPassage.find(value => value.match(regex));
        const orMatch = wordInPassage.find(value => value.match(orRegex));

        if (match) {
            return match.match(regex)[1];
        }

        if (orMatch) {
            return orMatch.match(orRegex)[1];
        }

        return -1;
    }

    getWord(row) {
        return this.getExactlyField("Word", row);
    }

    toArray(value, row) {
        return value.split("\n").map(value => this.replaceFeedback(value.replaceAll("\r", "").trim(), row));
    }

    replaceFeedback(value, row) {
        const wordId = this.getWordIdSpecial(row);
        return value.replace(`<${wordId}>`, `<${wordId}>${wordId}:`)
            .replaceAll(`“`, `"`)
            .replaceAll(`”`, `"`);
    }

    getWordIdSpecial(row) {
        return this.getField("WordID", row);
    }

    getWordId(row) {
        return "";
    }

    getStandard(row) {
        return this.getField("Item Standard", row).split("\n").join(",");
    }
}
