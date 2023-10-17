class BOYTestProcess extends VWAProcess {
    getDescription() {
        return `g${this.getGrade()}`;
    }

    getCID(row) {
        return `${this.getGlobalResourceId()}_${this.getDescription()}_q${this.convertDigit(this.getQuestionNumber(row))}_ans01`;
    }

    getGrade() {
        const globalResourceId = this.getGlobalResourceId();
        return globalResourceId[globalResourceId.length - 1];
    }

    getFullContent() {
        return "";
    }

    // ------------------ get field ------------------ //
    getDirectionLineHTML(row) {
        return this.getDirectionLine(row);
    }

    getDirectionLine(row) {
        return this.getField("Direction Line", 0);
    }

    getWordId(row) {
        return this.getField("Word ID", row);
    }

    // ------------------ other process ------------------ //
}