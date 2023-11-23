const url = window.location.href;

class Main {
    Initialize() {
        const prepare = new Prepare();
        prepare.init();
        const option = new OptionContent();
        option.init();
        const isAuto = chrome.storage.local.get(['isAuto']).isAuto;
        chrome.storage.local.get(['isAuto'], (result) => {
            if (result.isAuto) this.autoRun().then();
        });

        chrome.storage.local.get(['isAutoWordList'], (result) => {
            if (result.isAutoWordList) this.autoInsertWordList().then();
        });
    }

    async autoRun() {
        await new Promise(resolve => setTimeout(resolve, 1000));

        const editURL = (productId, resourceId) => `/cms/question/edit.html?pojo.product.productId=${productId}&pojo.resource.resourceId=${resourceId}`;
        const urlOfPageCreateQuestion = "http://192.168.200.26:8090/cms/question/resourceView.html";
        const urlOfPageInputContent = "http://192.168.200.26:8090/cms/question/edit.html";

        if (!url.includes(urlOfPageCreateQuestion) && !url.includes(urlOfPageInputContent)) return;
        const currentQuestionKey = "currentQuestion";

        let numberQuestion = parseInt($(`#${Ids.totalLine}`).text());
        let currentQuestion = parseInt($(`#${Ids.questionNumber}`).val());

        if (!numberQuestion && !currentQuestion) return alert("Please select number question and current question");
        if (currentQuestion > numberQuestion) {
            chrome.storage.local.set({isAuto: false});
            chrome.storage.local.set({currentQuestion: 1});

            Storage.Set(currentQuestionKey, 1);
            Storage.Set("CurrentQuestionNumber", 1);
            return alert("All question has been done");
        }

        if (url.includes(urlOfPageCreateQuestion)) {
            Storage.Set(currentQuestionKey, currentQuestion + +1);
            // click button create question
            // http://192.168.200.26:8090/cms/question/resourceView.html?pojo.product.productId=2682&pojo.resource.resourceId=350382
            const p_ = /pojo.product.productId=(?<productId>\d+)/g;
            const r_ = /pojo.resource.resourceId=(?<resourceId>\d+)/g;

            const executeP = p_.exec(url);
            const executeR = r_.exec(url);

            const productId = executeP.groups.productId;
            const resourceId = executeR.groups.resourceId;
            //update url
            window.location.href = editURL(productId, resourceId);
        }
        if (url.includes(urlOfPageInputContent)) {
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
        await new Promise(resolve => setTimeout(resolve, 100));
        const editWordListPage = "http://192.168.200.26:8090/cms/program/adaptivewordedit.html";
        if (!url.includes(editWordListPage)) return;

        if ($(`#wordIdSection`).text()) return;

        const message_alert = document.getElementsByClassName('alert-message');
        if (message_alert.length > 0) return;

        $(document).ready(function() { 
				setTimeout(function(){
					console.log('Ready!')
						// click button insert and save
					$(`#${Ids.insertAndSave}`).click();
				} , 2000);
	
			});
    }

const main = new Main();
main.Initialize();
