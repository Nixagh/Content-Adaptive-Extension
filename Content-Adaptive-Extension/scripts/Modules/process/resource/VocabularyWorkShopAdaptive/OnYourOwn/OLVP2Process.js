class OLVP2Process extends OLVProcess {
    getDescription() {
        return 'OYO_OLP2';
    }

    getSheetValue() {
        return this.getPassageSheet()[1];
    }
}