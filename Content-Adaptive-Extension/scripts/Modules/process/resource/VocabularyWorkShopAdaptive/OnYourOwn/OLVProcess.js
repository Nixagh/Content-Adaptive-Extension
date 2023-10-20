class OLVProcess extends VWAProcess {

    getFullContent() {
        // const wordListContent = this.getWordListSheet();
        return this.replaceItem(this.getOLVSheetValue());
    }

    getOLVSheet() {
        const olvSheetName = `OnLevelPsg`;
        const olvSheet = this.getSheet(olvSheetName);
        const olvHeader = this.getHeader(olvSheet);
        return this.getContent(olvSheet, olvHeader);
    }

    getOLVSheetValue() {
        return this.getOLVSheet()[0];
    }

    replaceItem() {
        const olvContent = this.getOLVSheetValue();
        const newData = [];
        for (let i = 1; i <= 10; i++) {
            const item = {
                "Step": olvContent[`Step`],
                "Choice Passage": olvContent[`Choice Passage`],
                "Pathway": olvContent[`Pathway`],
                "Choice page summary text": olvContent[`Choice page summary text`],
                "Choice Page Photo": olvContent[`Choice Page Photo`],
                "Direction Line": olvContent[`Direction Line`],
                "Passage Body": olvContent[`On-Level Passage Body`],
                "Lexile": olvContent[`Lexile`],
                "Item Type": olvContent[`Item Type`],
                "Item Part A": olvContent[`Item ${i} Part A`],
                "Item Part A Choices": olvContent[`Item ${i} Part A Choices`],
                "Item Part A Correct Answer": olvContent[`Item ${i} Part A Correct Answer`],
                "Item Part A Standards": olvContent[`Item ${i} Part A Standards`],
                "Item Part A Points": olvContent[`Item ${i} Part A Points`],
                "Item Part B": olvContent[`Item ${i} Part B`],
                "Item Part B Choices": olvContent[`Item ${i} Part B Choices`],
                "Item Part B Correct Answer": olvContent[`Item ${i} Part B Correct Answer`],
                "Item Part B Standards": olvContent[`Item ${i} Part B Standards`],
                "Item Part B Points": olvContent[`Item ${i} Part B Points`],
                "Item": olvContent[`Item ${i}`],
                "Item Choices": olvContent[`Item ${i} Choices`],
                "Item Correct Answer": olvContent[`Item ${i} Correct Answer`],
                "Item Standards": olvContent[`Item ${i} Standards`],
                "Item Points": olvContent[`Item ${i} Points`],
            }
            newData.push(item);
        }
        return newData;
    }

    getWordId(row) {
        return '';
    }

    getPathway1(row) {
        return "A";
    }

    getPathway2(row) {
        return "B";
    }

    getComponentScoreRules(row) {
        //	{"test":null,"scoringGroups":[{"componentGradingRules":[{"componentId":"802906_OYO_OLP1_u05_q01_ans01","componentType":"MultipleChoice","componentSubtype":null,"autoScore":true,"rubricRule":null}],"maxScore":1}]}
        const componentScoreRules = {
            test: null,
            scoringGroups: [
                {
                    componentGradingRules: [
                        {
                            componentId: `${this.getCID(row)}`,
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
        return JSON.stringify(componentScoreRules);
    }

    getPassageContent(row) {
        return `<div class="direction_section">
                    <div audio-source="/content/${this.getGlobalResourceId()}/AudioPassages/${this.getAudioSource()}" class="audio-inline" style="display: inline-flex; width: auto;"></div>
                    ${this.getPassageTitle(row)}
                    ${this.getPassageContentHTML(row)}
                </div>`;
    }

    getAudioSource() {
        return `802906_ipA_U1_Choice_P1_Drivers.mp3`;
    }

    getPassageTitle(row) {
        const passageBody = this.getPassageBody(row);
        const title = passageBody.split("\n")[0]
            .replaceAll(`<title>`, '')
            .replaceAll(`</title>`, '');
        return `<div class="title">${title}</div>`
    }

    getPassageBody(row) {
        return this.getField("Passage Body", row);
    }

    getPassageContentHTML(row) {
        const passageBody = this.getPassageBody(row);
        return passageBody.split("\n").slice(1)
            .map((line) => {
                const regex = / <word\d+>/g;

                const f = line.indexOf("paragraph = ") !== -1;
                const s = line.indexOf("paragraph id = ") !== -1;
                if(!f && !s) return line;

                let step1GetParagraphId = line.split("paragraph = ");
                if (s) step1GetParagraphId = line.split("paragraph id = ");

                const paragraphId = step1GetParagraphId[1].split(">")[0];

                const searchValue = f ? `<paragraph = ${paragraphId}>` : s ? `<paragraph id = ${paragraphId}>` : "";
                const replaceValue = `<div class="paragraph" id = "${paragraphId}">`;

                return line
                    .replaceAll(searchValue, replaceValue)
                    .replaceAll("</paragraph>", "</div>")
                    .replaceAll(`</paragraph`, '</div>')
                    .replaceAll("<paragraph>", `</div>`)
                    .replaceAll(`</div> id = ${paragraphId}>`, `</div>`)
                    .replaceAll(`</div> = ${paragraphId}>`, `</div>`)
                    .replaceAll("<b>", `<mean><b>`)
                    .replaceAll("</b>", `</b></mean>`)
                    .replaceAll(`“`, `"`)
                    .replaceAll(`”`, `"`)
                    .replaceAll(regex, (match) => `${match}word${match.split("word")[1].split(">")[0]}:`)
            }).join("\n");
    }
}