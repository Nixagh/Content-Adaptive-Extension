const logStorage = new LogStorage();

const resourceSelect = document.getElementById('resource-select');
const timestampSelect = document.getElementById('timestamp-select');
const btnShowLog = document.getElementById('btn-show-log');

const logContainer = document.getElementById('log-container');

const createOption = (value, text) => {
    const option = document.createElement('option');
    option.value = value;
    option.text = text;
    return option;
}

const addOptions = (select, resources) => {
    // sort resources by name desc
    resources.sort((a, b) => a < b ? 1 : -1);
    resources.forEach(resource => select.append(createOption(resource, resource)));
}
// init sample log
// (async function initSampleLog() {
//     const sampleLog = logStorage.getSampleLog();
//     await logStorage.addLog(sampleLog, sampleLog.name);
// })();


// init resources selector
(async function initSelect() {
    await logStorage.init();

    const init = () => {
        const types = logStorage.getTypes();
        addOptions(resourceSelect, types);
        addOptions(timestampSelect, logStorage.getTimestamps(types[0]));
    }

    init();
})();

// init events
(function initEvents() {
    resourceSelect.addEventListener('change', (event) => {
        const type = event.target.value;
        const timestamps = logStorage.getTimestamps(type);
        timestampSelect.innerHTML = '';
        addOptions(timestampSelect, timestamps);
    });

    btnShowLog.addEventListener('click', () => {
        const type = resourceSelect.value;
        const timestamp = timestampSelect.value;
        showLog(type, timestamp);
    });
})();

// show log
async function showLog(type, timestamp) {
    const logs = await logStorage.getLogs(type);
    if (!logs) return;
    const log = logs.find(log => log.timestamp === timestamp);

    logContainer.innerHTML = '';
    logContainer.append(createLogElement(log));
}

function createLogElement(log) {
    const logElement = document.createElement('div');
    logElement.classList.add('log');

    const logHeader = document.createElement('div');
    logHeader.classList.add('log-header');
    logHeader.innerHTML = `<span class="log-header__title">${log.name}</span><span class="log-header__timestamp">${log.timestamp}</span>`;
    logElement.append(logHeader);

    const logContent = document.createElement('div');
    logContent.classList.add('log-content');
    logContent.append(createLogContentElement(log));
    logElement.append(logContent);

    return logElement;
}

function createLogContentElement(log) {
    const logContentElement = document.createElement('table');
    logContentElement.classList.add('log-content__element');

    const logContentHeader = document.createElement('thead');
    logContentHeader.classList.add('log-content__header');
    logContentHeader.innerHTML = `<tr><th>Index</th><th>Question Number</th><th>Status</th><th>Errors</th></tr>`;
    logContentElement.append(logContentHeader);

    logContentElement.append(createLogContentBodyElement(log));

    return logContentElement;
}

function createLogContentBodyElement(log) {
    const questions = log.questionStatus;
    const logContentBodyElement = document.createElement('tbody');
    logContentBodyElement.classList.add('log-content__body');

    questions.forEach(question => {
        const questionElement = document.createElement('tr');
        questionElement.classList.add('question');

        const indexElement = document.createElement('td');
        indexElement.classList.add('question__index');
        indexElement.innerText = question.index;
        questionElement.append(indexElement);

        const questionNumberElement = document.createElement('td');
        questionNumberElement.classList.add('question__number');
        questionNumberElement.innerText = question.questionNumber;
        questionElement.append(questionNumberElement);

        const statusElement = document.createElement('td');
        statusElement.classList.add('question__status');
        statusElement.innerText = question.status;

        if (question.status === 'incorrect') {
            statusElement.classList.add('incorrect');
        }

        questionElement.append(statusElement);

        const errorsElement = document.createElement('td');
        errorsElement.classList.add('question__errors');

        question.errors.forEach(error => {
            const errorElement = document.createElement('div');
            errorElement.classList.add('question__error');
            errorElement.innerHTML = `<span class="question__error__type"><b>${error.type}:</b> </span><span class="question__error__message">${error.message}</span>`;
            errorsElement.append(errorElement);
        });

        questionElement.append(errorsElement);

        logContentBodyElement.append(questionElement);
    });

    return logContentBodyElement;
}

