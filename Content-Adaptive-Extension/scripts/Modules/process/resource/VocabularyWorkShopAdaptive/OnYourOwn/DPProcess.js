class DPProcess extends PassageProcess {
    getPassageSheet() {
        const olvSheetName = `DiffPsg`;
        const olvSheet = this.getSheet(olvSheetName);
        const olvHeader = this.getHeader(olvSheet);
        return this.getContent(olvSheet, olvHeader);
    }

    getPassageType() {
        return this.passageType.DIFFERENTIATED;
    }
}