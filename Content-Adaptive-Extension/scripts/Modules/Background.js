import ('../Libs/external/REF.js');
import ('../Libs/external/Jui.js');

class VideoUtility {
    baseURL = `http://192.168.200.26:8090/cms`;

    downloadVideo(videoUrl, videoName) {
        const a = document.createElement('a');
        a.href = videoUrl;
        a.download = videoName;
        a.click();
        console.log(videoUrl, videoName, 'downloaded');
    }

    async downloadVideoWithVideoCode(code, word) {
        const url = await this.getAssets(code, word);
        const videoName = `${word}.mp4`;
        this.downloadVideo(url, videoName);
    }

    async getAssets(code, word) {
        // http://192.168.200.26:8090/cms/product/listAssetsWithUrl.html
        const path = `/product/listAssetsWithUrl.html`;
        const url = `${this.baseURL}${path}`;

        const formData = new FormData();
        formData.append("path", `/content/${code}`);
        formData.append("nameSearch", `${word}.mp4`);
        formData.append("crudaction", ``);

        const options = {
            method: 'post',
            body: formData,
        }

        // console.log(url, formData, options);
        const res = await fetch(url, options).then(res => res.text());
        const regex = /<td>(?<videoLink>\/content.*\.mp4?)<\/td>/g
        const execute = regex.exec(res);
        if (!execute) return null;
        const videoLink = execute.groups.videoLink;

        return `${this.baseURL}${videoLink}`;
    }
}

const readExcel = async () => {
    const file = $('#video-list-file')[0].files[0];
    const arrayBuffer = await file.arrayBuffer();
    return XLSX.read(arrayBuffer);
}

const getSheet = (sheetName, excel) => {
    sheetName = sheetName.toLowerCase().trim();
    for (const sheet of excel.SheetNames) {
        if (sheet.toLowerCase().trim().includes(sheetName)) return excel.Sheets[sheet];
    }
    alert('Sheet not found');
    return null;
}

const renewDataWithTrimKey = (data) => {
    const newData = [];
    for (const row of data) {
        const newRow = {};
        for (const key in row) {
            newRow[key.trim()] = row[key];
        }
        newData.push(newRow);
    }
    return newData;
}

const getFieldInRow = (row, field) => {
    const keys = Object.keys(row);
    field = field.toLowerCase().trim();

    for (const key of keys) {
        if (key.toLowerCase().trim().includes(field)) return row[key];
    }
    return null;
}

const getExactFieldInRow = (row, field) => {
    const keys = Object.keys(row);
    field = field.toLowerCase().trim();

    for (const key of keys) {
        if (key.toLowerCase().trim() === field) return row[key];
    }
    return null;
}

const mapper = (sheet) => {
    const header = XLSX.utils.sheet_to_json(sheet, {header: 1})[0];
    let data = XLSX.utils.sheet_to_json(sheet, {header: header}).slice(1);
    data = renewDataWithTrimKey(data);
    return data.map((row) => {
        return {
            wordId: getFieldInRow(row, 'WordID'),
            word: getExactFieldInRow(row, 'Word'),
            videoCode: getFieldInRow(row, 'Video Pickup Code'),
        }
    });
}

const downloadWithFor = async (data) => {
    const videoUtility = new VideoUtility();
    for (const row of data) {
        const {wordId, word, videoCode} = row;
        if (!videoCode || videoCode.toLowerCase() === 'new') continue;
        await videoUtility.downloadVideoWithVideoCode(videoCode, word);
    }
}

const getVideoHaveCode = (data) => {
    return data.filter((row) => row.videoCode.toLowerCase() !== 'new');
}

const download = async () => {
    const message = $('#message');
    message.empty();
    console.log('download');
    const excel = await readExcel();
    const sheet = getSheet('Definitions', excel);
    const _mapper = mapper(sheet);
    console.log(_mapper);
    const data = getVideoHaveCode(_mapper);
    downloadWithFor(data).then(() => {
        console.log('downloaded');
        message.append('Downloaded');
    });
}

document.getElementById('download-popup').addEventListener('click', download);


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