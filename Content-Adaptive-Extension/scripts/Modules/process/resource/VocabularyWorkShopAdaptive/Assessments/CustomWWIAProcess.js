class CustomWWIAProcess extends VWAProcess {
    oldContent = {}

    constructor(type, rowMinus = 1, setTab = [1, 1, 1, 1], {
        oldPassage,
        oldSummary,
        oldQuestionContent,
    }) {
        super(type, rowMinus, setTab);
        this.oldContent = {
            oldPassage,
            oldSummary,
            oldQuestionContent,
        }
    }

    getQuestionTypeSelect() {
        return 8; // ES - Essay
    }

    getQuestionTypeValue() {
        return "ES";
    }

    process() {
        this.data = this.convertData();
        this.showErrors();
        Storage.Set("GProcess", JSON.stringify(this));
        Storage.Set("CurrentProgram", "DR");
    }

    convertData() {
        console.log("convertData");
        return [];
    }

    setQuestion(row, autoScore) {
        super.setQuestion(row, autoScore);
        const writeOnLines = new BasicInput("pojo.writeOnLines");
        const questionNumber = new BasicInput("pojo.questionNumber");
        writeOnLines.setValue(5);
        questionNumber.setValue(1);

        const autoScoreTE = new BasicInput("pojo.autoScoreTE1");
        autoScoreTE.element.checked = false;
        autoScoreTE.element.parentElement.classList.remove("checked");
    }

    // setQuestionContent(row) {
    //     super.setQuestionContent(row);
    //     const correctAnswerHTML = new Cke("cke_39_contents");
    //     correctAnswerHTML.setHtml('Answers will vary.');
    // }

    setPassage(row) {
        super.setPassage(row);
        const choicePassageCheckBox = new BasicInput("choicePassageCheckbox");
        choicePassageCheckBox.element.checked = false;
        choicePassageCheckBox.element.parentElement.classList.remove("checked");
    }

    getPassageContent(row) {
        if (!this.oldContent.oldPassage || !this.oldContent.oldSummary) {
            console.error("No passage content or summary content");
            return '';
        }

        let passage = this.removeUnusedData(this.oldContent.oldPassage);
        passage = this.replaceAllWordsToBold(passage);
        passage = this.replaceTitle(passage);
        passage = this.replaceAllParagraph(passage);

        return `
            <div class="passage_box_shadow">
            <div class="vw_la_u1_unit_passage_image_1" style="text-align: center;"><img alt="${this.getImgAlt(this.oldContent.oldSummary)[1]}" src="${this.getImgAlt(this.oldContent.oldSummary)[2]}"  style="width: 432px; height: 304px;" /></div>
            <div><div id="passageAudio_1" audio-src="${(this.getAudioSource(this.oldContent.oldPassage) || [])[1] || ""}" class="mediaElementPlayer center"><img id="audioControl_passageAudio_1" src="//static.assets.sadlierconnect.com/sc-content/images/sound.png"><audio id="mediaElementPlayer" style="display:none;" onended="endedDirectionAudio('passageAudio_1')" data-src="${(this.getAudioSource(this.oldContent.oldPassage) || [])[1] || ""}" type="audio/mp3"><source src="" type="audio/mpeg"></audio></div>
            ${passage}
        `
    }

    removeUnusedData(passage) {
        // <div class="direction_section">
        // <div audio-source="/content/802906/AudioPassages/802906_ipA_U3_Choice_P1_Bicycle.mp3" class="audio-inline" style="display: inline-flex; width: auto;"></div>

        passage = passage.replace(/<div class="direction_section">/g, '');
        const audioSourceRegex = /<div audio-source="[^"]+" class="audio-inline" style="display: inline-flex; width: auto;"><\/div>/g;
        passage = passage.replace(audioSourceRegex, '');

        return passage;
    }

    getAudioSource(passage) {
        const audioSourceRegex = /audio-source="([^"]+)"/g;
        return audioSourceRegex.exec(passage);
    }

    getTitle(passage) {
        const titleRegex = /<div class="title">([^<]+)<\/div>/g;
        return titleRegex.exec(passage);
    }

    getImgAlt(summary) {
        const imgAltRegex = /<img alt="([^"]+)" src="([^"]+)"(.+?|)\/>/g;
        return imgAltRegex.exec(summary);
    }

    replaceAllWordsToBold(passage) {
        // <word1>word1:in</word1> => <word1>in</word1>
        const wordRegex = /<word([^<]+)>word([^<]+):([^<]+)<\/word([^<]+)>/g;
        return passage.replaceAll(wordRegex, `<word$1>$3</word$1>`);
    }

    replaceTitle(passage) {
        const titleRegex = /<div class="title">([^<]+)<\/div>/g;
        return passage.replace(titleRegex, `<h1 class="passage-titles"><span class="passage-title-display">$1</span></h1>`);
    }

    replaceAllParagraph(passage) {
        const paragraphRegex = /<div class="paragraph" id="(\d+)">/g;
        // return matchAll(passage, paragraphRegex);
        const subst = `<div class="passage-copy"><span class="paragraph_index passage-number">$1</span>`;
        passage = passage.replace(paragraphRegex, subst);

        // replace passage 1 with <div class="paragraph"><span class="paragraph_index passage-number">1</span>
        const passage1Regex = /<div class="passage-copy"><span class="paragraph_index passage-number">1<\/span>/g;

        return passage.replace(passage1Regex, `<div class="paragraph"><span class="paragraph_index passage-number">1<\/span>`);
    }

    getQuestionHTML(row) {
        if (!this.oldContent.oldQuestionContent) {
            console.error("No question content");
            return '';
        }

        const question = this.oldContent.oldQuestionContent;
        const questionRegex = /<div class="question">([^<]+)<input[^>]+><\/div>/g;

        const questionMatch = questionRegex.exec(question);
        const content = questionMatch[1];

        return `${content}<br /><quest name="text1"></quest>`;
    }

    getCorrectAnswer(row) {
        return 'Answers will vary.';
    }

    getCorrectTextHTML(row) {
        return 'Answers will vary.';
    }

    getMaxScore() {
        return 4;
    }

    getConditionAndValueChoice() {
        return {
            condition: false,
            value: 1
        }
    }

    getStandard(row) {
        const standardsElement = new BasicInput("pojo.standards");
        return standardsElement.getValue();
    }

}