import ('../Libs/external/REF.js');
import ('../Libs/external/Jui.js');

// auto insert
;(function autoInsert() {
    const autoInsertButton = document.getElementById('isAuto');
    const numberQuestion = document.getElementById('number-question');
    const startButton = document.getElementById('start');
    chrome.storage.local.get(['isAuto'], (result) => {
        autoInsertButton.checked = result.isAuto;
    });
    chrome.storage.local.get(['numberQuestion'], (result) => {
        numberQuestion.value = result.numberQuestion;
    });

    numberQuestion.addEventListener('change', (e) => {
        chrome.storage.local.set({totalQuestion: e.target.value});
    });

    autoInsertButton.addEventListener('click', (e) => {
        chrome.storage.local.set({isAuto: e.target.checked});
    });

    startButton.addEventListener('click', (e) => {
        chrome.storage.local.set({numberQuestion: numberQuestion.value});
        chrome.storage.local.set({currentQuestion: 1});
        window.close();
        // reload main page
        chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
            chrome.tabs.update(tabs[0].id, {url: tabs[0].url});
        });
    });
})();

// insert resource settings
(function insertResourceSettings() {
    const insertResourceSettingsButton = document.getElementById('isAutoResourceSettings');
    const autoSaveForResourceSettingsButton = document.getElementById('isAutoSaveForResourceSettings');
    const startButton = document.getElementById('start-resource-settings');

    const unitSelect = document.getElementById('unit-select');

    chrome.storage.local.get(['isAutoResourceSettings'], (result) => {
        insertResourceSettingsButton.checked = result.isAutoResourceSettings;
    });

    chrome.storage.local.get(['isAutoSaveForResourceSettings'], (result) => {
        autoSaveForResourceSettingsButton.checked = result.isAutoSaveForResourceSettings;
    });

    chrome.storage.local.get(['currentUnit'], (result) => {
        unitSelect.value = result.currentUnit;
    });

    for (let i = 1; i <= 15; i++) {
        const option = document.createElement('option');
        option.value = option.text = "Unit " + i;
        unitSelect.appendChild(option);
    }

    insertResourceSettingsButton.addEventListener('click', (e) => {
        chrome.storage.local.set({isAutoResourceSettings: e.target.checked});
    });

    autoSaveForResourceSettingsButton.addEventListener('click', (e) => {
        chrome.storage.local.set({isAutoSaveForResourceSettings: e.target.checked});
    });

    startButton.addEventListener('click', (e) => {
        chrome.storage.local.set({currentUnit: unitSelect.value});
        window.close();
        // reload main page
        chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
            chrome.tabs.update(tabs[0].id, {url: tabs[0].url});
        });
    });
})();

(function deleteWrongResource() {
    const deleteWrongResourceButton = document.getElementById('isAutoDeleteWrongResource');
    const startButton = document.getElementById('start-resource-settings');

    const unitSelect = document.getElementById('unit-select');

    chrome.storage.local.get(['isAutoDeleteWrongResource'], (result) => {
        deleteWrongResourceButton.checked = result.isAutoDeleteWrongResource;
    });

    deleteWrongResourceButton.addEventListener('click', (e) => {
        chrome.storage.local.set({isAutoDeleteWrongResource: e.target.checked});
    });
})();

// insert word list
(function insertWordList() {
    const insertWordListButton = document.getElementById('isAutoWordList');

    chrome.storage.local.get(['isAutoWordList'], (result) => {
        insertWordListButton.checked = result.isAutoWordList;
    });

    insertWordListButton.addEventListener('click', (e) => {
        chrome.storage.local.set({isAutoWordList: e.target.checked});
    });
})();

// open log
(function openLog() {
    const openLogButton = document.getElementById('open-log');
    openLogButton.addEventListener('click', (e) => {
        chrome.tabs.create({url: "UI/log.html"});
    });
})();

// time out
(function timeOut() {
    const timeOutInput = document.getElementById('time-out');

    chrome.storage.local.get(['timeOut'], (result) => {
        timeOutInput.value = result.timeOut;
    });

    timeOutInput.addEventListener('change', (e) => {
        chrome.storage.local.set({timeOut: e.target.value});
    });
})();

(function AutoReplaceWordId() {
    const autoInsertButton = document.getElementById('isAutoReplaceWordId');

    chrome.storage.local.get(['isAutoReplaceWordId'], (result) => {
        autoInsertButton.checked = result.isAutoReplaceWordId;
    });

    autoInsertButton.addEventListener('click', (e) => {
        chrome.storage.local.set({isAutoReplaceWordId: e.target.checked});
    });
})();