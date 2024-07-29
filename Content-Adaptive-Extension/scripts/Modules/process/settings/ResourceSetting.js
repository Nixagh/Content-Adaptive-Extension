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
    disableExport; //true/false


    constructor(alternativeResourceTitle, keyword, allowShuffled, subCategory, assetFormat, cssClass, sourceBrand, productResourceBrand, resourceTemplate, pathway, wordJournalPrompt, groupActivity, resourceGroupActivity, resourceSubGroupActivity, retryCount, choicePassage, programTocExam, singleQuestion, visible, disableExport = true, resourceType = "LS") {
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
        this.disableExport = disableExport;
        this.resourceType = resourceType;
    }
}

const ResourceSetting = {
    // SP
    "Definitions": new setting("Definition", "DF", false, "rs_practice_quiz.png","ASSESSMENT",
        "", "ADAPTIVE", "ISE", "Adaptive ISE Assessment 2023", "1,2", "Restate the definition(s) in your own words.",
        "", "", "",
        null, false, "", true, true, false ),

    "Visuals": new setting("Visual", "", false, "video.png","ASSESSMENT",
        "", "ADAPTIVE", "ISE", "Adaptive ISE Assessment 2023", "1,2", "Draw or place a picture or audio file that is meaningful to you to help you quickly understand and remember the word.",
        "", "", "",
        null, false, "", true, true, false),

    "Definitions & Video": new setting("Definitions & Video", "", false, "rs_practice_quiz.png","ASSESSMENT",
        "", "ADAPTIVE", "ISE", "Adaptive ISE Assessment 2023", "1,2", "Restate the definition(s) in your own words.",
        "", "", "",
        null, false, "", true, true, false ),

    "WordStudy": new setting("", "", false, "rs_practice_quiz.png","ASSESSMENT",
        "", "ADAPTIVE", "ISE", "Adaptive ISE Assessment 2023", "1,2", "Now write your own sentence using the vocabulary word.",
        "", "", "",
        null, false, "", true, true, false),

    // GT
    "CRW-GT": new setting("", "", true, "ASSESSMENT.png","ASSESSMENT",
        "", "ADAPTIVE", "ISE", "Adaptive ISE Assessment 2023", "1,2", "",
        "Student Choice Activity 1", "", "",
        null, false, "", true, true, false),

    "E/N": new setting("", "", true, "ASSESSMENT.png","ASSESSMENT",
        "", "ADAPTIVE", "ISE", "Adaptive ISE Assessment 2023", "1,2", "",
        "Student Choice Activity 2", "", "",
        null, false, "", true, true, false),

    "VC-OLV": new setting("Vocabulary in Context", "", 	false, "ASSESSMENT.png","ASSESSMENT",
        "", "ADAPTIVE", "ISE", "Adaptive ISE Assessment 2023", "1,2", "",
        "Student Choice Activity 1", "Vocabulary in Context", "On Level Passage",
        null, false, "", true, true, false),

    "VC-D": new setting("Vocabulary in Context", "", 	false, "ASSESSMENT.png","ASSESSMENT",
        "", "ADAPTIVE", "ISE", "Adaptive ISE Assessment 2023", "2", "",
        "Student Choice Activity 1", "Vocabulary in Context", "Differentiated Passage",
        null, false, "", true, true, false),

    "WT": new setting("", "", true, "ASSESSMENT.png","ASSESSMENT",
        "", "ADAPTIVE", "ISE", "Adaptive ISE Assessment 2023", "1,2", "",
        "Student Choice Activity 2", "", "",
        null, false, "", true, true, false),

    // OYO
    "AP": new setting("", "", true, "ASSESSMENT.png","ASSESSMENT",
        "", "ADAPTIVE", "ISE", "Adaptive ISE Assessment 2023", "1,2", "",
        "", "", "",
        null, false, "", true, true, false),

    "CRW-OYO": new setting("", "", true, "ASSESSMENT.png","ASSESSMENT",
        "", "ADAPTIVE", "ISE", "Adaptive ISE Assessment 2023", "1,2", "",
        "", "", "",
        1, false, null, true, true, false),

    "CS": new setting("", "", true, "ASSESSMENT.png","ASSESSMENT",
        "", "ADAPTIVE", "ISE", "Adaptive ISE Assessment 2023", "1,2", "",
        "Student Choice Activity", "", "",
        1, false, "", true, true, false),

    "D-P1": new setting("Passage", "", false, "ASSESSMENT.png","ASSESSMENT",
        "", "ADAPTIVE", "ISE", "Adaptive ISE Assessment 2023", "2", "",
        "Student Choice Activity", "Passage", "Differentiated Passage",
        1, false, "", true, true, false),
    "D-P2": new setting("Passage", "", false, "ASSESSMENT.png","ASSESSMENT",
        "", "ADAPTIVE", "ISE", "Adaptive ISE Assessment 2023", "2", "",
        "Student Choice Activity", "Passage", "Differentiated Passage",
        1, false, "", true, true, false),

    "OLV-P1": new setting("Passage", "", false, "ASSESSMENT.png","ASSESSMENT",
        "", "ADAPTIVE", "ISE", "Adaptive ISE Assessment 2023", "1,2", "",
        "Student Choice Activity", "Passage", "On Level Passage",
        1, false, "", true, true, false),
    "OLV-P2": new setting("Passage", "", false, "ASSESSMENT.png","ASSESSMENT",
        "", "ADAPTIVE", "ISE", "Adaptive ISE Assessment 2023", "1,2", "",
        "Student Choice Activity", "Passage", "On Level Passage",
        1, false, "", true, true, false),

    //Assessment Adaptive ISE Assessment 2023
    "BOY": new setting("", "", true, "assessment.png","ASSESSMENT",
        "math2018", "ISE", "ISE", "Adaptive ISE Assessment 2023", "", "",
        "", "", "",
        null, false, "", false, true, false),

    "EOY": new setting("", "", true, "assessment.png","ASSESSMENT",
        "math2018", "ISE", "ISE", "Adaptive ISE Assessment 2023", "", "",
        "", "", "",
        null, false, "Unit 15", false, true, false),

    "CumTest1": new setting("", "", true, "assessment.png","ASSESSMENT",
        "math2018", "ISE", "ISE", "Adaptive ISE Assessment 2023", "", "",
        "", "", "",
        null, false, "Unit 4", false, true, false),

    "CumTest2": new setting("", "", true, "assessment.png","ASSESSMENT",
        "math2018", "ISE", "ISE", "Adaptive ISE Assessment 2023", "", "",
        "", "", "",
        null, false, "Unit 8", false, true, false),

    "CumTest3": new setting("", "", true, "assessment.png","ASSESSMENT",
        "math2018", "ISE", "ISE", "Adaptive ISE Assessment 2023", "", "",
        "", "", "",
        null, false, "Unit 12", false, true, false),

    "CumTest4": new setting("", "", true, "assessment.png","ASSESSMENT",
        "math2018", "ISE", "ISE", "Adaptive ISE Assessment 2023", "", "",
        "", "", "",
        null, false, "Unit 15", false, true, false),

    "PreTest": new setting("", "", true, "assessment.png","ASSESSMENT",
        "math2018", "ISE", "ISE", "Adaptive ISE Assessment 2023", "1,2", "",
        "", "", "",
        null, false, "", false, true, false),

    "PostTest": new setting("", "", true, "assessment.png","ASSESSMENT",
        "math2018", "ISE", "ISE", "Adaptive ISE Assessment 2023", "1,2", "",
        "", "", "",
        null, false, "", false, true, false),

    //Games
    "WPG": new setting("", "", true, "ASSESSMENT.png","HTML",
        "", "WPG", "", "", "1,2", "",
        "", "", "",
        null, false, "", false, true, false, "Static"),

    "FC1": new setting("", "", true, "ASSESSMENT.png","HTML",
        "", "FC", "", "", "1", "",
        "", "", "",
        null, false, "", false, true, false, "Static"),

    "FC2": new setting("", "", true, "ASSESSMENT.png","HTML",
        "", "FC", "", "", "2", "",
        "", "", "",
        null, false, "", false, true, false, "Static"),

    "IW1": new setting("", "", true, "audio.png","HTML",
        "", "IW", "", "", "1", "",
        "", "", "",
        null, false, "", false, true, false, "Static"),

    "IW2": new setting("", "", true, "audio.png","HTML",
        "", "IW", "", "", "2", "",
        "", "", "",
        null, false, "", false, true, false, "Static"),

    "WW": new setting("", "", true, "resources.png","HTML",
        "", "WW", "", "", "1,2", "",
        "", "", "",
        null, false, "", false, true, false, "Static"),

    "SolveIt": new setting("", "", true, "games.png","Game",
        "", "PRONK", "", "", "1,2", "",
        "", "", "",
        null, false, "", false, true, false, "Static"),

    "WTW": new setting("", "", true, "games.png","Game",
        "", "PRONK", "", "", "1,2", "",
        "", "", "",
        null, false, "", false, true, false, "Static"),

    "WWiA": new setting("", "WWIA", true, "resources.png","HTML",
        "", "WWIA", "ADAP", "Adaptive ISE Assessment 2023", "1,2", "",
        "", "", "",
        null, true, "", false, true, false),

    "WC": new setting("", "", true, "resources.png","HTML",
        "", "WORD_CONTINUUM", "", "", "1,2", "",
        "", "", "",
        null, false, "", false, true, false),

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
        const disableExport = new BasicInput("pojo.displayOnTOC1");

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
        disableExport.element.checked = setting.disableExport;
        visible.element.checked = setting.visible;

        // todo:
        const optionProgramTocExam = Array.from(programTocExam.options).find(option => option.innerText.includes(setting.programTocExam));
        if(optionProgramTocExam) programTocExam.value = optionProgramTocExam.value;
        const displayProgramTocExam = document.getElementById("select2-chosen-16");
        displayProgramTocExam.innerText = optionProgramTocExam.text;

        resourceType.setValue(setting.resourceType || "LS");
    }
}