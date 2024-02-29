class ProgramToc {
    #programTocId;
    #name;
    #nameOnTab;
    #description;
    #essentialQuestions;
    #lessons;
    #hasSharedResource;
    #programId;
    #parent;
    #showOnLibrary;
    #displayOrder;
    #jsonInfor;
    #jsonGear;
    #jsonCompleteTheme;

    set programTocId(value) {
        this.#programTocId = value;
    }

    set name(value) {
        this.#name = value;
    }

    set nameOnTab(value) {
        this.#nameOnTab = value;
    }

    set description(value) {
        this.#description = value;
    }

    set essentialQuestions(value) {
        this.#essentialQuestions = value;
    }

    set lessons(value) {
        this.#lessons = value;
    }

    set hasSharedResource(value) {
        this.#hasSharedResource = value;
    }

    set programId(value) {
        this.#programId = value;
    }

    set parent(value) {
        this.#parent = value;
    }

    set showOnLibrary(value) {
        this.#showOnLibrary = value;
    }

    set displayOrder(value) {
        this.#displayOrder = value;
    }

    set jsonInfor(value) {
        this.#jsonInfor = value;
    }

    set jsonGear(value) {
        this.#jsonGear = value;
    }

    set jsonCompleteTheme(value) {
        this.#jsonCompleteTheme = value;
    }

    get programTocId() {
        return this.#programTocId;
    }

    get name() {
        return this.#name;
    }

    get nameOnTab() {
        return this.#nameOnTab;
    }

    get description() {
        return this.#description;
    }

    get essentialQuestions() {
        return this.#essentialQuestions;
    }

    get lessons() {
        return this.#lessons;
    }

    get hasSharedResource() {
        return this.#hasSharedResource;
    }

    get programId() {
        return this.#programId;
    }

    get parent() {
        return this.#parent;
    }

    get showOnLibrary() {
        return this.#showOnLibrary;
    }

    get displayOrder() {
        return this.#displayOrder;
    }

    get jsonInfor() {
        return this.#jsonInfor;
    }

    get jsonGear() {
        return this.#jsonGear;
    }

    get jsonCompleteTheme() {
        return this.#jsonCompleteTheme;
    }

    process() {
        this.processJsoninfor();
        this.processJsonGear();
        this.processJsonCompleteTheme();
    }

    processJsoninfor() {
    }

    processJsonGear() {
    }

    processJsonCompleteTheme() {
        this.#jsonCompleteTheme = "this is a new value for jsonCompleteTheme V3";
    }
}
