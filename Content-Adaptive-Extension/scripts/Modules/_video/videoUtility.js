class VideoUtility {
    baseURL = `http://192.168.200.26:8090/cms`;

    downloadVideo(videoUrl, videoName) {
        // const a = document.createElement('a');
        // a.href = videoUrl;
        // a.download = videoName;
        // a.click();
        // a.remove();
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
            body : formData,
        }

        // console.log(url, formData, options);
        const res = await fetch(url, options).then(res => res.text());
        const regex = /<td>(?<videoLink>\/content.*\.mp4?)<\/td>/g
        const execute = regex.exec(res);
        const videoLink = execute.groups.videoLink;

        return `${this.baseURL}/${videoLink}`;
    }
}

