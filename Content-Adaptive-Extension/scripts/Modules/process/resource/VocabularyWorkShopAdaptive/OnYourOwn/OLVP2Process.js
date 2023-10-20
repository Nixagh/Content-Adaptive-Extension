class OLVP2Process extends OLVProcess {
    getDescription() {
        return 'OYO_OLP2';
    }

    getOLVSheetValue() {
        return this.getOLVSheet()[1];
    }
}