// Vocabulary in Context (On-level)
class VCOLVProcess extends VCProcess {
	getDescription() {
		return "GT_VinC_OL";
	}

	getVCSheet() {
		const vcSheetName = `VinC OnLevel`;
		const vcSheet = this.getSheet(vcSheetName);
		const vcHeader = this.getHeader(vcSheet);
		return this.getContent(vcSheet, vcHeader);
	}
}
