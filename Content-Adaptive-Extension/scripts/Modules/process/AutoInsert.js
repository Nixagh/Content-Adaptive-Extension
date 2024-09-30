class AutoInsert {
    constructor() {
        this._init();
        this.urlOfPageCreateQuestion = "http://192.168.200.26:8090/cms/question/resourceView.html";
        this.urlOfPageInputContent = "http://192.168.200.26:8090/cms/question/edit.html";
        this.urlOfPageEditWordList = "http://192.168.200.26:8090/cms/program/adaptivewordedit.html";
        this.urlOfPageCreateWordList = "http://192.168.200.26:8090/cms/program/adaptiveword.html";
        this.urlOfPageExploreProduct = "http://192.168.200.26:8090/cms/product/explore.html";
        this.urlOPageEditResource = "http://192.168.200.26:8090/cms/resource/edit.html";
        this.urlOfPagePassageEdit = "http://192.168.200.26:8090/cms/passage/edit.html";

        this.currentQuestionKey = "currentQuestion";
        this.currentResourceKey = "currentResource";
        this.currentUnitKey = "currentUnit";

        this.event = this._event();
        this.timeOut = parseFloat(this.getTimeOut()) * 1000 || 1000;
    }

    getTimeOut() {
        return chrome.storage.local.get(['timeout'], (result) => {
            return result.timeout;
        });
    }

    getEditURL(productId, resourceId) {
        return `/cms/question/edit.html?pojo.product.productId=${productId}&pojo.resource.resourceId=${resourceId}`;
    }

    getCurrentQuestion() {
        return Storage.Get(this.currentQuestionKey);
    }

    getCurrentResource() {
        return Storage.Get(this.currentResourceKey);
    }

    async getCurrentUnit() {
        return await Storage.GetAllStorageSyncData(this.currentUnitKey) || "Unit 8";
    }

    _init() {
        chrome.storage.local.get(['isAuto'], (result) => {
            if (result.isAuto) this.autoRun().then();
        });

        chrome.storage.local.get(['isAutoWordList'], (result) => {
            if (result.isAutoWordList) this.autoInsertWordList().then();
        });

        chrome.storage.local.get(['isAutoResourceSettings'], (result) => {
            if (result.isAutoResourceSettings) this.autoResourceSettings().then();
        });

        chrome.storage.local.get(['isAutoDeleteWrongResource'], (result) => {
            if (result.isAutoDeleteWrongResource) this.autoDeleteWrongResource().then();
        });

        chrome.storage.local.get(['isAutoReplaceWordId'], (result) => {
            if (result.isAutoReplaceWordId) this.autoReplaceWordId(result.isAutoSaveReplaceWordId).then();
        });
    }

    _event() {
        return {
            autoResourceSettings: (resources) => resources.forEach(resource => window.open(resource.link)),
            autoDeleteWrongResource: (resources) => resources[0].delete()
        };
    }

    async autoRun() {
        await new Promise(resolve => setTimeout(resolve, this.timeOut));

        if (!url.includes(this.urlOfPageCreateQuestion) && !url.includes(this.urlOfPageInputContent)) return;

        let numberQuestion = parseInt($(`#${Ids.totalLine}`).text());
        let currentQuestion = parseInt($(`#${Ids.questionNumber}`).val());

        if (!numberQuestion && !currentQuestion) return alert("Please select number question and current question");
        if (currentQuestion > numberQuestion) {
            chrome.storage.local.set({isAuto: false});
            chrome.storage.local.set({currentQuestion: 1});

            Storage.Set(this.currentQuestionKey, 1);
            Storage.Set("CurrentQuestionNumber", 1);

            // add log
            const log = new CheckLog();
            const params = new URLSearchParams(window.location.search);
            const _log = await log.getLog(params);

            console.log(_log);

            if (confirm('All question has been done, You want to open log page?')) {
                window.open(chrome.runtime.getURL("UI/log.html"));
            }
            return;
        }

        if (url.includes(this.urlOfPageCreateQuestion)) {
            Storage.Set(this.currentQuestionKey, currentQuestion + +1);
            // click button create question
            // http://192.168.200.26:8090/cms/question/resourceView.html?pojo.product.productId=2682&pojo.resource.resourceId=350382
            const p_ = /pojo.product.productId=(?<productId>\d+)/g;
            const r_ = /pojo.resource.resourceId=(?<resourceId>\d+)/g;

            const executeP = p_.exec(url);
            const executeR = r_.exec(url);

            const productId = executeP.groups.productId;
            const resourceId = executeR.groups.resourceId;
            //update url
            window.location.href = this.getEditURL(productId, resourceId);
        }
        if (url.includes(this.urlOfPageInputContent)) {
            const btn = $(`#${Ids.insertAndSave}`);
            const message_alert = document.getElementsByClassName('alert alert-success');
            if (message_alert.length > 0) {
                const content = message_alert[0].innerText;
                if (content.includes("An Exception occurred")) btn.click();
                return;
            }

            $(window).ready(() => {
                btn.click();
            });
        }
    }

    async autoInsertWordList() {
        await new Promise(resolve => setTimeout(resolve, this.timeOut));
        if (!url.includes(this.urlOfPageEditWordList) && !url.includes(this.urlOfPageCreateWordList)) return;

        const totalWordList = parseInt($(`#totalWordList`).text());
        const currentWordList = parseInt($(`#currentWordList`).text());

        if (url.includes(this.urlOfPageCreateWordList)) {
            if (currentWordList >= totalWordList) {
                chrome.storage.local.set({isAutoWordList: false});
                return;
            }

            // set ?programTocId=19774
            const regex = /programTocId=(?<programToWordId>\d+)/g;
            const programTocId = regex.exec(url).groups.programToWordId;

            Storage.Set("programTocId", programTocId);

            // click button create word list
            window.location.href = this.urlOfPageEditWordList + `?programTocId=${programTocId}`;
        }

        if ($(`#wordIdSection`).text()) return;

        const message_alert = document.getElementsByClassName('alert-message');
        if (message_alert.length > 0) {
            if (message_alert[0].innerText.includes("Item has been inserted into database successfully.")) {

                // if total word list = current word list
                if (currentWordList >= totalWordList) {
                    chrome.storage.local.set({isAutoWordList: false});
                    return;
                }

                // update url
                const programTocId = Storage.Get("programTocId");
                // open new tab
                window.open(this.urlOfPageEditWordList + `?programTocId=${programTocId}`);
                // close current tab
                window.close();
            }
        }

        $(document).ready(function () {
            setTimeout(function () {
                console.log('Ready!')
                // click button insert and save
                $(`#${Ids.insertWordList}`).click();
            }, 1000);
        });
    }

    async autoDeleteWrongResource() {
        if (!url.includes(this.urlOfPageExploreProduct)) return;

        if (url.includes(this.urlOfPageExploreProduct)) {
            const currentUnit = await this.getCurrentUnit();

            // get panel has unit
            const panel = this.getAndOpenPanel(currentUnit);

            await this.attackEventOnPanel(panel, this.event.autoDeleteWrongResource);
        }
    }

    async autoResourceSettings() {
        if (!url.includes(this.urlOfPageExploreProduct) && !url.includes(this.urlOPageEditResource)) return;

        if (url.includes(this.urlOfPageExploreProduct)) {
            const currentUnit = await this.getCurrentUnit();

            // get panel has unit
            const panel = this.getAndOpenPanel(currentUnit);

            await this.attackEventOnPanel(panel, this.event.autoResourceSettings);
        }

        if (url.includes(this.urlOPageEditResource)) {
            // get alert message
            this.closeTabWhenSuccess();
            this.insertResourceSettings();
        }
    }

    closeTabWhenSuccess() {
        const message_alert = $('.alert');

        if (message_alert.length > 0) {
            const content = message_alert.text();
            if (content.includes("An Exception occurred")) return;
            window.close();
        }
    }

    getAndOpenPanel(currentUnit) {
        const panels = document.getElementsByClassName('panel panel-default');
        return Array.from(panels).find(panel => {
            const pHead = panel.getElementsByClassName('panel-heading')[0];
            const H4 = pHead.getElementsByTagName('h4')[0];
            const a = H4.getElementsByTagName('a')[0];
            const unit = a.innerText;
            if (unit.includes(currentUnit[this.currentUnitKey].toUpperCase())) {
                a.click();
                return panel;
            }
        });
    }

    async attackEventOnPanel(panel, event) {
        // get all resource in panel
        const panelBody = panel.getElementsByClassName('panel-body')[0];

        // wait for load resource
        let count = 0;
        await $(panelBody).on('DOMNodeInserted', function () {
            // delete event
            if (count === 1) {
                $(panelBody).off('DOMNodeInserted');
                return;
            }

            if (count === 0) {
                count++;
                // get resource
                const resources = AutoInsert.getResourceInPanel(this);

                event(resources);
            }
        });
    }

    static getResourceInPanel(panel) {
        const table = $(panel).find('table')[0];
        const tbody = $(table).find('tbody')[0];
        const trs = $(tbody).find('tr');

        return Array.from(trs).map(tr => {
            const _tr = $(tr).find('td');
            const resourceCode = _tr[1].innerText;
            const description = _tr[3].innerText;
            const links = _tr[11];

            const editLinks = $(links).find('a');
            const regex = /edit.html/g;
            const editLink = Array.from(editLinks).find(link => regex.test(link.href));

            const deleteLinks = $(links).find('a');
            const deleteLink = Array.from(deleteLinks).find(link => link.id);

            return {
                resourceCode: resourceCode,
                description: description,
                link: editLink.href,
                delete: () => deleteLink.click()
            }
        });
    }

    insertResourceSettings() {
        // get description
        const _description = document.getElementById("pojo.description").value;

        // change modal tag
        const btn = $('#open-insert-word-list');
        btn.click();

        // select
        const typeSelect = $('#type-select');
        const insertBtn = $('#insert-settings');

        // check option
        const options = typeSelect.find('option');
        const option = Array.from(options).find(option => option.innerText.includes(_description) || _description === option.innerText);

        if (_description.includes("Choosing the Right Word")) {
            const resourceCategory = document.getElementById("pojo_category_name").value;
            // check on your own or guided tour
            if (resourceCategory.includes("On Your Own")) option.value = "CRW-OYO";
        }

        const saveBtn = $('#btnSave');
        if (option) {
            typeSelect.val(option.value);
            insertBtn.click();

            // save resource
            // chrome.storage.local.get(['isAutoSaveForResourceSettings'], (result) => {
            //     if (result.isAutoSaveForResourceSettings)
            // });
        }
        saveBtn[0].click();
    }

    async autoReplaceWordId(isAutoSave) {
        await new Promise(resolve => setTimeout(resolve, this.timeOut));
        if (!url.includes(this.urlOfPagePassageEdit)) return;

        const replaceBtn = $(`#${Ids.replaceButton}`);
        const saveBtn = $('#btnSave');
        replaceBtn.click();

        await new Promise(resolve => setTimeout(resolve, this.timeOut));
        if (isAutoSave) saveBtn[0].click();

        // change title page
        document.title = "Replace Word Id Done";
    }
}