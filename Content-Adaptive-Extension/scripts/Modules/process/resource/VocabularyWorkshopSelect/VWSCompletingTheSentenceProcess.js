class VWSCompletingTheSentenceProcess extends VWSProcess {

    getQuestionTypeSelect() {
        return 5; // Multiple Choice
    }

    getQuestionTypeValue() {
        return "TSO";
    }

    getFullContent() {
        const contentSheet = this.getContentSheet();
        return {first: contentSheet, second: []};
    }

    mapping({first, second}) {
        return first;
    }

    getContentSheet() {
        const contentSheetName = "CtheS_IP";
        const contentSheet = this.getSheet(contentSheetName);
        const contentHeader = this.getHeader(contentSheet);
        return this.getContent(contentSheet, contentHeader);
    }

    getQuestionHTML(row) {
        const item = this.getExactlyField("Item", row) || this.getExactlyField("Item ", row);
        // The show's end was so [FIB: anno: abrupt], the audience was not sure if the actors had made a mistake.
        // replace [FIB: anno: abrupt] with <option><select></select></option>
        const options = this.getOptions(row);
        return item.replace(/\[FIB:.*?]/, options);
    }

    getCorrectAnswer(row) {
        return this.getField("Correct Answer", row) || this.getField("Correct Answer ", row);
    }

    getOptions(row) {
        const defaultOptions = `<option selected="true" value="">(Select a word)</option>`;
        const options = [];

        const answerChoices = this.getAnswerChoices(row);
        answerChoices.forEach(choice => {
            options.push(`<option value="${choice}">${choice}</option>`);
        });
        return `<select name="a${row + 1}">${defaultOptions}${options.join("")}</select>`;
    }

    getAnswerChoices(row) {
        // get from data
        const words = this.data.map((row) => this.getExactlyFieldOfRow("Word", row) || this.getExactlyFieldOfRow("Word ", row));
        // sort by alphabet
        words.sort();
        return words;
    }


    getDirectionLineHTML(row) {
        return '';
    }

    getPassageContent(row) {
        return super.getDirectionLineHTML(row);
    }
}