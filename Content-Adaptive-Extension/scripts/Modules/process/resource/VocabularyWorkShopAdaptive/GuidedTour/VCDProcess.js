class VCDProcess extends VCProcess {
    getDescription() {
        return "GT_VIC_D";
    }

    getVCSheet() {
        const vcSheetName = `VIC Differentiated`;
        const vcSheet = this.getSheet(vcSheetName);
        const vcHeader = this.getHeader(vcSheet);
        return this.getContent(vcSheet, vcHeader);
    }
}