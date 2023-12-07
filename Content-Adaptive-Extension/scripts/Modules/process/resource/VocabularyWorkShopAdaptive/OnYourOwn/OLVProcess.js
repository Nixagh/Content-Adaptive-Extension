class OLVProcess extends PassageProcess {
    getPassageSheet() {
        const olvSheetName = `OnLevelPsg`;
        const olvSheet = this.getSheet(olvSheetName);
        const olvHeader = this.getHeader(olvSheet);
        return this.getContent(olvSheet, olvHeader);
    }

    getSheetValue() {
        return this.getPassageSheet()[0];
    }

    getPassageType() {
        return this.passageType.ON_LEVEL;
    }
}