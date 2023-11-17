class setting {
    alternativeResourceTitle;
    keyword;
    allowShuffled; //(True/False)
    subCategory;
    cssClass;
    sourceBrand;
    productResourceBrand;
    iSEMenu; //(select option)
    pathway;
    wordJournalPrompt;
    groupActivity;
    resourceGroupActivity;
    resourceSubGroupActivity;
    retryCount; //(int)
    choicePassage; //(true/false)
    programTocExam; //(select option)

    constructor(alternativeResourceTitle, keyword, allowShuffled, subCategory, cssClass, sourceBrand, productResourceBrand, iSEMenu, pathway, wordJournalPrompt, groupActivity, resourceGroupActivity, resourceSubGroupActivity, retryCount, choicePassage, programTocExam) {
        this.alternativeResourceTitle = alternativeResourceTitle;
        this.keyword = keyword;
        this.allowShuffled = allowShuffled;
        this.subCategory = subCategory;
        this.cssClass = cssClass;
        this.sourceBrand = sourceBrand;
        this.productResourceBrand = productResourceBrand;
        this.iSEMenu = iSEMenu;
        this.pathway = pathway;
        this.wordJournalPrompt = wordJournalPrompt;
        this.groupActivity = groupActivity;
        this.resourceGroupActivity = resourceGroupActivity;
        this.resourceSubGroupActivity = resourceSubGroupActivity;
        this.retryCount = retryCount;
        this.choicePassage = choicePassage;
        this.programTocExam = programTocExam;
    }
}

const SettingScreen = {
    // SP
    "Definitions": new setting("Definition", "", false, "rs_practice_quiz.png",
        "math2018", "ADAPTIVE", "ISE", null, "1,2", "Restate the definition(s) in your own words.",
        "", "", "", null, false, null),

    "Visuals": new setting("Visual", "", false, "video.png",
        "", "ADAPTIVE", "ISE", null, "1,2", "",
        "", "", "", null, false, null),

    "WordStudy": new setting("", "", false, "rs_practice_quiz.png",
        "", "ADAPTIVE", "ISE", null, "1,2", "",
        "", "", "", null, false, null),

    // GT
    "CRW-GT": new setting("", "", true, "ASSESSMENT.png",
        "", "ADAPTIVE", "ISE", null, "1,2", "",
        "Student Choice Activity 1", "", "", null, false, null),

    "E/N": new setting("", "", true, "ASSESSMENT.png",
        "", "ADAPTIVE", "ISE", null, "1,2", "",
        "Student Choice Activity 2", "", "", null, false, null),

    "VC-OLV": new setting("Vocabulary in Context", "", 	false, "ASSESSMENT.png",
        "", "ADAPTIVE", "ISE", null, "2", "",
        "Student Choice Activity 1", "Vocabulary in Context", "On Level Passage", null, false, null),

    "VC-D": new setting("Vocabulary in Context", "", 	false, "ASSESSMENT.png",
        "", "ADAPTIVE", "ISE", null, "1,2", "",
        "Student Choice Activity 1", "Vocabulary in Context", "Differentiated Passage", null, false, null),

    "WT": new setting("", "", true, "ASSESSMENT.png",
        "", "ADAPTIVE", "ISE", null, "1,2", "",
        "Student Choice Activity 2", "", "", null, false, null),

    // OYO
    "AP": new setting("", "", true, "ASSESSMENT.png",
        "", "ADAPTIVE", "ISE", null, "1,2", "",
        "", "", "", null, false, null),

    "CRW-OYO": new setting("", "", true, "ASSESSMENT.png",
        "", "ADAPTIVE", "ISE", null, "1,2", "",
        "", "", "", 1, false, null),

    "CS": new setting("", "", true, "ASSESSMENT.png",
        "", "ADAPTIVE", "ISE", null, "1,2", "",
        "", "", "", 1, false, null),

    "DP1": new setting("Passage", "", false, "ASSESSMENT.png",
        "", "ADAPTIVE", "ISE", null, "1,2", "",
        "Student Choice Activity", "Passage", "Differentiated Passage", 1, false, null),

    "DP2": new setting("Passage", "", false, "ASSESSMENT.png",
        "", "ADAPTIVE", "ISE", null, "1,2", "",
        "Student Choice Activity", "Passage", "Differentiated Passage", 1, false, null),

    "OLV-P1": new setting("Passage", "", false, "ASSESSMENT.png",
        "", "ADAPTIVE", "ISE", null, "1,2", "",
        "Student Choice Activity", "Passage", "On Level Passage", 1, false, null),

    "OLV-P2": new setting("Passage", "", false, "ASSESSMENT.png",
        "", "ADAPTIVE", "ISE", null, "1,2", "",
        "Student Choice Activity", "Passage", "On Level Passage", 1, false, null),
}

class Screen {
    static insert(type) {
        const setting = SettingScreen[type];
        if(setting) this.getHtml(setting);
    }

    static getHtml(setting) {
        const alternativeResourceTitle = new BasicInput("pojo.alternativeTitle");
        const keyword = new BasicInput("pojo.keyword");
        const allowShuffled = new BasicInput("pojo.allowShuffled1");
        const subCategory = new BasicInput("pojo.resourceSubCategory");
        const cssClass = new BasicInput("pojo.cssClass");
        const sourceBrand = new BasicInput("pojo.sourceBrand");
        const productResourceBrand = new BasicInput("pojo.resourceBrand");

        const iSEMenu = document.getElementsByName("pojo.integratedMenuStructure")[0];

        const pathway = new BasicInput("pojo.pathway");
        const wordJournalPrompt = new BasicInput("pojo.wordJournalPrompt");
        const groupActivity = new BasicInput("pojo.groupActivity");
        const resourceGroupActivity = new BasicInput("pojo.resourceGroupActivity");
        const resourceSubGroupActivity = new BasicInput("pojo.resourceSubGroupActivity");
        const retryCount = new BasicInput("pojo.retryCount");
        const choicePassage = new BasicInput("pojo.choicePassage1");

        const programTocExam = document.getElementsByName("pojo.programTocExam")[0];

        alternativeResourceTitle.setValue(setting.alternativeResourceTitle);
        keyword.setValue(setting.keyword);

        allowShuffled.element.checked = setting.allowShuffled;

        subCategory.setValue(setting.subCategory);
        cssClass.setValue(setting.cssClass);
        sourceBrand.setValue(setting.sourceBrand);
        productResourceBrand.setValue(setting.productResourceBrand);

        // todo:
        if (setting.iSEMenu) iSEMenu.value = setting.iSEMenu;
        const displayISEMenu = document.getElementById("select2-chosen-10");

        pathway.setValue(setting.pathway);
        wordJournalPrompt.setValue(setting.wordJournalPrompt);
        groupActivity.setValue(setting.groupActivity);
        resourceGroupActivity.setValue(setting.resourceGroupActivity);
        resourceSubGroupActivity.setValue(setting.resourceSubGroupActivity);
        retryCount.setValue(setting.retryCount);

        choicePassage.element.checked = setting.choicePassage;

        // todo:
        if (setting.programTocExam) programTocExam.value = setting.programTocExam;
        const displayProgramTocExam = document.getElementById("select2-chosen-16");
    }
}