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

        chrome.storage.local.get(['isAutoResourceSettings'], (result) => {
            if (result.isAutoResourceSettings) this.autoResourceSettings().then();
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

			// add log
			const _errors = GProcess._errors;
			const type = GProcess.type;
			const logStorage = new LogStorage();
			const data = [];
			Object.entries(_errors).forEach(([key, value]) => {
				value.forEach((error) => {
					data.push({
						index: key,
						questionNumber: key,
						error: {
							type: error.tab,
							message: error.message
						},
					})
				});
			});

			const log = logStorage.createLog(type, numberQuestion, data);
			await logStorage.addLog(log, log.name);

			if (confirm('All question has been done, You want to open log page?')) {
				window.open(chrome.runtime.getURL("UI/log.html"));
			}
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
        const urlOfPageCreateWordList = "http://192.168.200.26:8090/cms/program/adaptiveword.html";
        if (!url.includes(editWordListPage) && !url.includes(urlOfPageCreateWordList)) return;

        if(url.includes(urlOfPageCreateWordList)) {
            // set ?programTocId=19774
            const regex = /programTocId=(?<programToWordId>\d+)/g;
            const programTocId = regex.exec(url).groups.programToWordId;

            Storage.Set("programTocId", programTocId);

            // click button create word list
            window.location.href = editWordListPage + `?programTocId=${programTocId}`;
        }

        if ($(`#wordIdSection`).text()) return;

        const message_alert = document.getElementsByClassName('alert-message');
        if (message_alert.length > 0) {
            if (message_alert[0].innerText.includes("Item has been inserted into database successfully.")) {

                // if total word list = current word list
                const totalWordList = parseInt($(`#totalWordList`).text());
                const currentWordList = parseInt($(`#currentWordList`).text());
                if (currentWordList >= totalWordList) {
                    chrome.storage.local.set({isAutoWordList: false});
                    return;
                }

                // update url
                const programTocId = Storage.Get("programTocId");
                // open new tab
                window.open(editWordListPage + `?programTocId=${programTocId}`);
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

    async autoResourceSettings() {
        const baseUrl = "http://192.168.200.26:8090/cms/product/explore.html";
        const editResourcePage = "http://192.168.200.26:8090/cms/resource/edit.html";

        if (!url.includes(baseUrl) && !url.includes(editResourcePage)) return;

        const currentResourceKey = "currentResource";
        const currentUnitKey = "currentUnit";

        const currentResource = await Storage.GetAllStorageSyncData(currentResourceKey);
        const currentUnit = await Storage.GetAllStorageSyncData(currentUnitKey) || "Unit 8";

		if(url.includes(baseUrl)) {

			// get all resource with unit
			const panels = document.getElementsByClassName('panel panel-default');
			let resources = [];

			// get panel has unit
			const panel = Array.from(panels).find(panel => {
				const pHead = panel.getElementsByClassName('panel-heading')[0];
				const H4 = pHead.getElementsByTagName('h4')[0];
				const a = H4.getElementsByTagName('a')[0];
				const unit = a.innerText;
				if (unit.includes(currentUnit[currentUnitKey].toUpperCase())) {
					a.click();
					return panel;
				}
			});

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
					// get table
					const table = $(this).find('table')[0];
					const tbody = $(table).find('tbody')[0];
					const trs = $(tbody).find('tr');

					// get resource
					resources = Array.from(trs).map(tr => {
						const _tr = $(tr).find('td');
						const resourceCode = _tr[1].innerText;
						const description = _tr[3].innerText;
						const links = _tr[11];

						const editLinks = $(links).find('a');
						const regex = /edit.html/g;
						const editLink = Array.from(editLinks).find(link => regex.test(link.href));

						return {
							resourceCode: resourceCode,
							description: description,
							link: editLink.href
						}
					});

					resources.forEach(resource => {
						// create new tab
						window.open(resource.link);
					});
				}
			});
		}

		if (url.includes(editResourcePage)) {

            // get alert message
            const alertMessage = $('.alert');
            const alertMessageText = alertMessage.text();

            if (alertMessage.length > 0) {
                window.close();
            }

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
            const option = Array.from(options).find(option => option.innerText.includes(_description));
            const saveBtn = $('#btnSave');

            if (option) {
                typeSelect.val(option.value);
                insertBtn.click();

                // save resource
                // saveBtn.click();
            }
        }
    }
}

const main = new Main();
main.Initialize();
