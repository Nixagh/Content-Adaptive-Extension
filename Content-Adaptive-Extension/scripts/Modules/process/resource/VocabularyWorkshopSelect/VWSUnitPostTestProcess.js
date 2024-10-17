class VWSUnitPostTestProcess extends VWSProcess {
  getQuestionTypeSelect() {
    return 1; // Multiple Choice
  }

  getQuestionTypeValue() {
    return "MC";
  }

  getFullContent() {
    const contentSheet = this.getContentSheet();
    return { first: contentSheet, second: [] };
  }

  mapping({ first, second }) {
    return first;
  }

  getContentSheet() {
    const contentSheetName = "Post Test";
    const contentSheet = this.getSheet(contentSheetName);
    const contentHeader = this.getHeader(contentSheet);
    return this.getContent(contentSheet, contentHeader);
  }
  setQuestionContent(row) {
    document.getElementsByClassName("mc")[0].style.display = "block";
    super.setQuestionContent(row);

    // set options
    this.setOptionsQuestion(row);
  }

  setOptionsQuestion(row) {
    // cke_6_contents
    const answerChoices = this.getAnswerChoices(row);
    const length = answerChoices.length;
    const correctAnswer = this.getCorrectAnswerCustom(row);

    for (let i = 0; i < length; i++) {
      const answerChoice = answerChoices[i];
      const answerChoiceElement = new Cke(`cke_${6 + i}_contents`);

      answerChoiceElement.setHtml(answerChoice.value);

      // get input with value and type radio
      const input = document.querySelectorAll("input[name='checkList']");
      // find the input with the value of the answer choice
      const radio = Array.from(input).find((e) => e.value === `${i + 1}`);

      if (answerChoice.index === correctAnswer.index) {
        radio.checked = true;
      }
    }
  }
  getQuestionHTML(row) {
    const item =
      this.getExactlyField("Item", row) || this.getExactlyField("Item ", row);
    // The show's end was so [FIB: anno: abrupt], the audience was not sure if the actors had made a mistake.
    // replace [FIB: anno: abrupt] with <option><select></select></option>
    // const options = this.getOptions(row);
    // return item.replace(/\[FIB:.*?]/, options);
    return item.replace(/\[WOL]/, "_______");
  }

  getAnswerChoices(row) {
    const answerChoices =
      this.getField("Answer Choices", row) ||
      this.getField("Answer Choices ", row);
    // a. contemporary; b. adverse; c. incomprehensible; d. serene
    // create regex to get the answer choices
    const regex = /([a-d]\.\s)([a-zA-Z\s]+)/g;
    let match;
    const choices = [];
    while ((match = regex.exec(answerChoices)) !== null) {
      choices.push({ index: match[1], value: match[2] });
    }
    return choices;
  }

  getCorrectAnswerCustom(row) {
    // Correct Answer
    const correctAnswer =
      this.getField("Correct Answer", row) ||
      this.getField("Correct Answer ", row);
    // b. adverse
    // create regex to get the correct answer
    const regex = /([a-d]\.\s)([a-zA-Z\s]+)/;
    const match = regex.exec(correctAnswer);
    return { index: match[1], value: match[2] };
  }

  getPassageContent(row) {
    const activityTitle = this.getField("Activity Title", row) || this.getField("Activity Title ", row);
    const directionLine = this.getField("Direction Line", row) || this.getField("Direction Line ", row);
 
    return `<div class="bhead_1">${activityTitle}</div>
            <strong>${directionLine}</strong>`;
}

    getConditionAndValueChoice(row) {
        return {
            condition: row !== 0 && row !== 5 && row !== 15,
            value: row > 14 ? 3 : row > 4 ? 2 : 1,
        }
}
}
