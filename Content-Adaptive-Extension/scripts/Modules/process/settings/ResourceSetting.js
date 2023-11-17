class setting {
    alternativeResourceTitle;
    keyword;
    allowShuffled; //(True/False)
    subCategory;
    assetFormat;
    cssClass;
    sourceBrand;
    productResourceBrand;
    resourceTemplate; //(select option)
    pathway;
    wordJournalPrompt;
    groupActivity;
    resourceGroupActivity;
    resourceSubGroupActivity;
    retryCount; //(int)
    choicePassage; //(true/false)
    programTocExam; //(select option)
    resourceType;
    singleQuestion; //true/false
    visible; //true/false


    constructor(alternativeResourceTitle, keyword, allowShuffled, subCategory, assetFormat, cssClass, sourceBrand, productResourceBrand, resourceTemplate, pathway, wordJournalPrompt, groupActivity, resourceGroupActivity, resourceSubGroupActivity, retryCount, choicePassage, programTocExam, singleQuestion, visible) {
        this.alternativeResourceTitle = alternativeResourceTitle;
        this.keyword = keyword;
        this.allowShuffled = allowShuffled;
        this.subCategory = subCategory;
        this.assetFormat = assetFormat;
        this.cssClass = cssClass;
        this.sourceBrand = sourceBrand;
        this.productResourceBrand = productResourceBrand;
        this.resourceTemplate = resourceTemplate;
        this.pathway = pathway;
        this.wordJournalPrompt = wordJournalPrompt;
        this.groupActivity = groupActivity;
        this.resourceGroupActivity = resourceGroupActivity;
        this.resourceSubGroupActivity = resourceSubGroupActivity;
        this.retryCount = retryCount;
        this.choicePassage = choicePassage;
        this.programTocExam = programTocExam;
        this.singleQuestion = singleQuestion;
        this.visible = visible;
    }
}

const ResourceSetting = {
    // SP
    "Definitions": new setting("Definition", "DF", false, "rs_practice_quiz.png","ASSESSMENT",
        "", "ADAPTIVE", "ISE", "", "1,2", "Restate the definition(s) in your own words.",
        "", "", "",
        null, false, "", true, true),

    "Visuals": new setting("Visual", "", false, "video.png","ASSESSMENT",
        "", "ADAPTIVE", "ISE", "", "1,2", "",
        "", "", "",
        null, false, "", true, true),

    "WordStudy": new setting("", "", false, "rs_practice_quiz.png","ASSESSMENT",
        "", "ADAPTIVE", "ISE", "", "1,2", "",
        "", "", "",
        null, false, "", true, true),

    // GT
    "CRW-GT": new setting("", "", true, "ASSESSMENT.png","ASSESSMENT",
        "", "ADAPTIVE", "ISE", "", "1,2", "",
        "Student Choice Activity 1", "", "",
        null, false, "", true, true),

    "E/N": new setting("", "", true, "ASSESSMENT.png","ASSESSMENT",
        "", "ADAPTIVE", "ISE", "", "1,2", "",
        "Student Choice Activity 2", "", "",
        null, false, "", true, true),

    "VC-OLV": new setting("Vocabulary in Context", "", 	false, "ASSESSMENT.png","ASSESSMENT",
        "", "ADAPTIVE", "ISE", "", "1,2", "",
        "Student Choice Activity 1", "Vocabulary in Context", "On Level Passage",
        null, false, "", true, true),

    "VC-D": new setting("Vocabulary in Context", "", 	false, "ASSESSMENT.png","ASSESSMENT",
        "", "ADAPTIVE", "ISE", "", "2", "",
        "Student Choice Activity 1", "Vocabulary in Context", "Differentiated Passage",
        null, false, "", true, true),

    "WT": new setting("", "", true, "ASSESSMENT.png","ASSESSMENT",
        "", "ADAPTIVE", "ISE", "", "1,2", "",
        "Student Choice Activity 2", "", "",
        null, false, "", true, true),

    // OYO
    "AP": new setting("", "", true, "ASSESSMENT.png","ASSESSMENT",
        "", "ADAPTIVE", "ISE", "", "1,2", "",
        "", "", "",
        null, false, "", true, true),

    "CRW-OYO": new setting("", "", true, "ASSESSMENT.png","ASSESSMENT",
        "", "ADAPTIVE", "ISE", "", "1,2", "",
        "", "", "",
        1, false, null, true, true),

    "CS": new setting("", "", true, "ASSESSMENT.png","ASSESSMENT",
        "", "ADAPTIVE", "ISE", null, "1,2", "",
        "", "", "",
        1, false, "", true, true),

    "D-P": new setting("Passage", "", false, "ASSESSMENT.png","ASSESSMENT",
        "", "ADAPTIVE", "ISE", "", "2", "",
        "Student Choice Activity", "Passage", "Differentiated Passage",
        1, false, "", true, true),

    "OLV-P": new setting("Passage", "", false, "ASSESSMENT.png","ASSESSMENT",
        "", "ADAPTIVE", "ISE", "", "1,2", "",
        "Student Choice Activity", "Passage", "On Level Passage",
        1, false, "", true, true),

    //Assessment Adaptive ISE Assessment 2023


}

class Screen {
    static insert(type) {
        const setting = ResourceSetting[type];
        if(setting) this.getHtml(setting);
    }

    static getHtml(setting) {
        const alternativeResourceTitle = new BasicInput("pojo.alternativeTitle");
        const keyword = new BasicInput("pojo.keyword");
        const allowShuffled = new BasicInput("pojo.allowShuffled1");
        const subCategory = new BasicInput("pojo.resourceSubCategory");
        const assetFormat =  document.getElementsByName("pojo.formatType")[0];
        const cssClass = new BasicInput("pojo.cssClass");
        const sourceBrand = new BasicInput("pojo.sourceBrand");
        const productResourceBrand = new BasicInput("pojo.resourceBrand");

        const resourceTemplate = document.getElementsByName("pojo.resourceTemplate")[0];

        const pathway = new BasicInput("pojo.pathway");
        const wordJournalPrompt = new BasicInput("pojo.wordJournalPrompt");
        const groupActivity = new BasicInput("pojo.groupActivity");
        const resourceGroupActivity = new BasicInput("pojo.resourceGroupActivity");
        const resourceSubGroupActivity = new BasicInput("pojo.resourceSubGroupActivity");
        const retryCount = new BasicInput("pojo.retryCount");
        const choicePassage = new BasicInput("pojo.choicePassage1");

        const programTocExam = document.getElementsByName("pojo.programTocExam")[0];
        const resourceType = new BasicInput("pojo.resourceType");
        const singleQuestion = new BasicInput("pojo.singleQuestionMode1");
        const visible = new BasicInput("pojo.visible1");

        alternativeResourceTitle.setValue(setting.alternativeResourceTitle);
        keyword.setValue(setting.keyword);

        allowShuffled.element.checked = setting.allowShuffled;

        subCategory.setValue(setting.subCategory);
        cssClass.setValue(setting.cssClass);
        sourceBrand.setValue(setting.sourceBrand);
        productResourceBrand.setValue(setting.productResourceBrand);

        // todo:
        const optionAssetFormat = Array.from(assetFormat.options).find(option => option.innerText.includes(setting.assetFormat));
        if(optionAssetFormat) assetFormat.value = optionAssetFormat.value;
        const displayAssetFormat = document.getElementById("select2-chosen-8");
        displayAssetFormat.innerText = optionAssetFormat.text;

        const optionOptionAssetFormat = Array.from(resourceTemplate.options).find(option => option.innerText.includes(setting.resourceTemplate));
        if(optionOptionAssetFormat) resourceTemplate.value = optionOptionAssetFormat.value;
        const displayResourceTemplate = document.getElementById("select2-chosen-14");
        displayResourceTemplate.innerText = optionOptionAssetFormat.text;

        pathway.setValue(setting.pathway);
        wordJournalPrompt.setValue(setting.wordJournalPrompt);
        groupActivity.setValue(setting.groupActivity);
        resourceGroupActivity.setValue(setting.resourceGroupActivity);
        resourceSubGroupActivity.setValue(setting.resourceSubGroupActivity);
        retryCount.setValue(setting.retryCount);

        choicePassage.element.checked = setting.choicePassage;
        singleQuestion.element.checked = setting.singleQuestion;
        visible.element.checked = setting.visible;

        // todo:
        const optionProgramTocExam = Array.from(programTocExam.options).find(option => option.innerText.includes(setting.programTocExam));
        if(optionProgramTocExam) programTocExam.value = optionProgramTocExam.value;
        const displayProgramTocExam = document.getElementById("select2-chosen-16");
        displayProgramTocExam.innerText = optionProgramTocExam.text;

        resourceType.setValue(setting.resourceType || "LS");
    }
}