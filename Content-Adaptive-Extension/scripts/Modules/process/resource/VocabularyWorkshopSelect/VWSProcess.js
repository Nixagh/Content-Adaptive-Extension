// Vocabulary Workshop Select
class VWSProcess extends VWAProcess {
    sheetName = ""

    process() {
        const content = this.getFullContent();
        const mapping = this.mapping(content);
        this.data = this.filterAchieveSet(mapping);
        // this.data = this.getFullContent();
        this.showErrors();
        Storage.Set("GProcess", JSON.stringify(this));
    }

    getDirectionLineHTML(row) {
        return this.getField("Direction Line", 0) || this.getField("Direction Line ", 0)
    }
}