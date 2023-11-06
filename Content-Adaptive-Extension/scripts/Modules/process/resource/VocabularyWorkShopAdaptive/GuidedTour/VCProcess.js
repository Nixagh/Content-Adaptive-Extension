class VCProcess extends VWAProcess {
    getAdaptiveAnswerCount() {
        return 2;
    }

    getFullContent() {
        const wordListContent = this.getWordListSheet();
        const vcContent = this.getVCSheet();

        return {first: vcContent, second: wordListContent};
    }

    mapping({first, second}) {
        const setA = first[0];
        const setB = first[1];

        const newArray = [];
        newArray.push(...this.getFullRowData(setA, second));
        newArray.push(...this.getFullRowData(setB, second));

        return newArray;
    }

    getFullRowData(set, wordList) {
        const directionLine = this.getFieldOfRow("Direction Line", set);
        const passageBody = this.getFieldOfRow("Passage Body", set);
        const pathway1 = this.getFieldOfRow("Pathway 1 Set", set);
        const pathway2 = this.getFieldOfRow("Pathway 2 Set", set);

        const newArray = [];

        for (let i = 1; i <= 6; i++) {
            newArray.push(
                {
                    "Direction Line": directionLine,
                    "Passage Body": passageBody,
                    "P1 Set": pathway1,
                    "P2 Set": pathway2,
                    "Item": this.getFieldOfRow(`Item ${i}`, set),
                    "Item Standard": this.getFieldOfRow(`Item ${i} Standard`, set),
                    "Item Answer Choices": this.getFieldOfRow(`Item ${i} Answer Choices`, set),
                    "Item Correct Answer": this.getFieldOfRow(`Item ${i} Correct Answer`, set),
                    "Item Correct Answer Feedback": this.getFieldOfRow(`Item ${i} Correct Answer Feedback`, set),
                    "Item Incorrect Feedback 1": this.getFieldOfRow(`Item ${i} Incorrect Feedback 1`, set),
                    "Item Incorrect Feedback 2": this.getFieldOfRow(`Item ${i} Incorrect Feedback 2`, set),
                }
            )
        }

        return newArray.map((item, index) => {
            const _item = item[`Item`].toLowerCase().trim();
            const correctAnswer = item[`Item Correct Answer`].toLowerCase().trim();
            const correctAnswerFeedback = item[`Item Correct Answer Feedback`].toLowerCase().trim();
            const incorrectFeedback1 = item[`Item Incorrect Feedback 1`].toLowerCase().trim();
            const incorrectFeedback2 = item[`Item Incorrect Feedback 2`].toLowerCase().trim();

            const word = wordList.find(word => {
                const wordID = word[`WordID`].toLowerCase().trim();
                return _item.includes(wordID) ||
                    correctAnswer.includes(wordID) ||
                    correctAnswerFeedback.includes(wordID) ||
                    incorrectFeedback1.includes(wordID) ||
                    incorrectFeedback2.includes(wordID);
            });

            if (!word) {
                this.addError("Word", `Word is not found at row ${index + 1} in Word List of pathway set ${pathway2}`);
                return null;
            }
            const wordId = word[`WordID`].toLowerCase().trim();
            return {
                ...item,
                "WordID": wordId,
            }
        });
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
        return "<i>Read the following passage, taking note of the boldface words and their contexts. Use the tools provided to annotate the text as you read. Then answer the questions.</i>";
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
        }
        const paragraphId = this.getParagraphId(row);
        if (paragraphId !== -1) {
            feedback["paragraphId"] = `${paragraphId}`;
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
        return ["Great job!","Way to go!","You did it!","Terrific!"];
    }

    getIncorrectEmoji1(row) {
        return ["Nice try!"];
    }

    getIncorrectEmoji2(row) {
        return ["You can do this!","Keep practicing.","Keep trying.","Nice try!","Try another way."];
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

    getPathway1(row) {
        return 'A';
    }
}
