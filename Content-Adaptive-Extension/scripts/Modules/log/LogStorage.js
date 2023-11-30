class LogStorage {
    constructor() {
        this.logs = {};
    }

    async init() {
        this.setLogs(await this.getLogs());
    }

    getSampleLog() {
        return {
            id: 12,
            name: "Sample",
            totalQuestion: 2,
            timestamp: "2020-01-01 00:00:00",
            questionStatus: [
                {
                    index: 1,
                    questionNumber: 1,
                    status: "correct",
                    errors: []
                },
                {
                    index: 2,
                    questionNumber: 2,
                    status: "incorrect",
                    errors: [
                        {
                            type: "incorrectFeedback1",
                            message: "Incorrect Feedback 1 to use when all"
                        },
                        {
                            type: "incorrectFeedback2",
                            message: "Incorrect Feedback 2 to use when all"
                        },
                        {
                            type: "incorrectFeedback3",
                            message: "Incorrect Feedback 3 to use when all"
                        }
                    ]
                }
            ]
        }
    }

    getTypes() {
        return !this.logs ? [] : Object.keys(this.logs);
    }

    getTimestamps(type) {
        if (!this.logs[type]) return [];

        const timestamps = [];
        this.logs[type].forEach(log => timestamps.push(log.timestamp));
        return timestamps;
    }

    async addLog(log, type) {
        // get sync logs from local storage
        this.logs = await this.getLogs();
        if (!this.logs[type]) {
            this.logs[type] = [];
        }
        console.log(this.logs);

        // remove old log if it has more than 10 logs in the array
        if (this.logs[type].length > 10) {
            this.logs[type].shift();
        }

        // add new log to the end
        this.logs[type].push(log);

        // save to local storage
        console.log(this.logs);
        chrome.storage.local.set({logs: this.logs});
    }

    async getLogs(type) {
        // get sync logs from chrome local storage
        const res = await this.getAllStorageSyncData("logs");

        // if there is no logs in local storage, return empty object
        this.logs = res.logs ? res.logs : {};
        return !type ? this.logs : this.logs[type];
    }

    setLogs(logs) {
        this.logs = logs;
    }

    createLog(type, totalQuestion, data) {
        // sample data
        /*{
            "1": {
                "index": 1,
                "questionNumber": 1,
                "errors": [
                    {
                        "type": "incorrectFeedback1",
                        "message": "Incorrect Feedback 1 to use when all"
                    }
                ]
            },
            "2": {
                "index": 2,
                "questionNumber": 2,
                "errors": [
                    {
                        "type": "incorrectFeedback1",
                        "message": "Incorrect Feedback 1 to use when all"
                    }
                ]
            }
        }*/

        const log = {
            id: this.logs[type] ? this.logs[type].length + 1 : 1,
            name: type,
            totalQuestion: totalQuestion,
            timestamp: new Date().toLocaleString(),
            questionStatus: []
        };

        for (let i = 1; i <= totalQuestion; i++) {
            const question = {
                index: i,
                questionNumber: i,
                status: "correct",
                errors: []
            };

            if (data[i]) {
                question.status = "incorrect";
                question.errors = data[i];
            }

            log.questionStatus.push(question);
        }

        return log;
    }

    getAllStorageSyncData(top_key) {
        // Immediately return a promise and start asynchronous work
        return new Promise((resolve, reject) => {
            // Asynchronously fetch all data from storage.sync.
            chrome.storage.local.get(top_key, (items) => {
                // Pass any observed errors down the promise chain.
                if (chrome.runtime.lastError) {
                    return reject(chrome.runtime.lastError);
                }
                // Pass the data retrieved from storage down the promise chain.
                resolve(items);
            });
        });
    }
}