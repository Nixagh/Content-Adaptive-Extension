class CheckLog {
    constructor() {
        this.ajaxViewResourceQuestionUrl = (resourceId) => `http://192.168.200.26:8090/cms/ajax/question/viewresourcequestion.html?resourceId=${resourceId}`;
        this.viewPageUrl = 'http://192.168.200.26:8090/cms/question/viewresourcequestion.html';
        this.getCorrectAnswerTeUrl = 'http://192.168.200.26:8090/cms/ajax/question/get-correct-answer-te.html';
        this.checkAnswerTeUrl = 'http://192.168.200.26:8090/cms/ajax/question/check-answer.html';
    }

    getViewResourceQuestionUrl(resourceId, productId) {
        // ?pojo.resource.resourceId=350856&pojo.product.productId=2682
        return this.viewPageUrl + `?pojo.resource.resourceId=${resourceId}&pojo.product.productId=${productId}`;
    }

    getViewResourceQuestionUrlByParams(params) {
        return this.viewPageUrl + "?" + params;
    }

    ajax(url, data) {
        return $.ajax({
            url: url,
            type: 'POST',
            data: data,
            dataType: 'json',
        });
    }

    getCorrectAnswerTe(resourceId) {
        const data = {resourceId};
        return this.ajax(this.getCorrectAnswerTeUrl, data);
    }

    async checkAnswerTe(questionIds, responses) {
        const data = {
            questionIds: questionIds,
            responses: responses
        };

        return await fetch(this.checkAnswerTeUrl, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json',
                'X-Requested-With': 'XMLHttpRequest',
            }
        }).then((response) => response.json());
    }

    async getLog(params) {
        const resourceId = params.get('pojo.resource.resourceId');
        const productId = params.get('pojo.product.productId');

        const viewResourceQuestionUrl = this.ajaxViewResourceQuestionUrl(resourceId);

        const response = await fetch(viewResourceQuestionUrl);
        const html = await response.text();

        const regex = /questionId="(?<questionId>\d+)" questionNumber="(\d+)"/g;

        let questionIds = [];
        let responses = [];
        // class="question_content te ise-question-parent"
        let match = regex.exec(html);
        while (match != null) {
            const questionId = match.groups.questionId;
            questionIds.push(questionId);
            match = regex.exec(html);
        }

        const correctAnswerTe = await this.getCorrectAnswerTe(resourceId);
        const correctAnswers = correctAnswerTe["array"];

        responses = correctAnswers.map((correctAnswer) => {
            return JSON.parse(correctAnswer["answers"] || "{}");
        });

        let checkAnswerTe = {};
        try {
            checkAnswerTe = await this.checkAnswerTe(questionIds, responses);
        } catch (error) {
            console.log(error);
        }

        const data = checkAnswerTe["results"] || [];

        if (data.length === 0) {
            console.log("No data");
            return;
        }

        return data.map((item, index) => {
            const questionResponseFeedback = item["questionResponseFeedback"];
            const isCorrect = questionResponseFeedback["correct"];
            return {
                questionNumber: index + 1,
                isCorrect,
            }
        });
    }

    createLog(type) {
        const url = window.location.href;
        const params = new URLSearchParams(url.split("?")[1]);
        this.getLog(params)
            .then(async (_log) => {
                const logStorage = new LogStorage();
                const logs = logStorage.createLogWithAllQuestion(type, _log);
                await logStorage.addLog(logs, type);
                console.log("Log created");
            })
            .catch((error) => console.log(error));
    }
}