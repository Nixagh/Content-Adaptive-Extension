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
	}

	async autoRun() {
		const url = window.location.href;
		await new Promise(resolve => setTimeout(resolve, 1000));

		const editURL = (productId, resourceId) => `/cms/question/edit.html?pojo.product.productId=${productId}&pojo.resource.resourceId=${resourceId}`;
		const urlOfPageCreateQuestion = "http://192.168.200.26:8090/cms/question/resourceView.html";
		const urlOfPageInputContent = "http://192.168.200.26:8090/cms/question/edit.html";

		if (!url.includes(urlOfPageCreateQuestion) && !url.includes(urlOfPageInputContent)) return;
		const currentQuestionKey = "currentQuestion";

		let numberQuestion;
		chrome.storage.local.get(['numberQuestion'], (result) => {
			numberQuestion = result.numberQuestion;
		});
		const currentQuestion = parseInt(Storage.Get(currentQuestionKey)) || 1;

		if (!numberQuestion && !currentQuestion) return alert("Please select number question and current question");
		if (currentQuestion > numberQuestion) return alert("All question has been done");

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
			// click button insert and save
			$(`#${Ids.insertAndSave}`).click();
		}
	}
}

const main = new Main();
main.Initialize();


