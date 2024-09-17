class FileReader {
    processFile(arrayBuffers) {
		const data = arrayBuffers.map(arrayBuffer => XLSX.read(arrayBuffer));
        console.log(data);
		// group data
		const first = data[0];
        const sheetNames = first.SheetNames || [];
        const sheets = first.Sheets || {};

        for (let i = 1; i < data.length; i++) {
            const _data = data[i];
            sheetNames.push(..._data.SheetNames);
            Object.entries(_data.Sheets).forEach(([key, value]) => sheets[key] = value);
        }

        GProcess.allSheets = first;
        GProcess.process();
    }

    async loadFile() {
        const file = await FileReader.getFile();
        if (!file) return "No file selected";
        if (!ExcelType[file.type]) return "Invalid file type";

        const program = this.getProgram();
        if (!program) return "No program selected";

        const desc = await FileReader.getDesc();
        if (!desc) return "No description selected";

        const arrayBuffer = await FileReader.getArrayBuffer(file);

        GProcess = Resource[program].resource[desc].new();
        if (!GProcess) return "Invalid description";

        GProcess.fileName = file.name;
        this.processFile(arrayBuffer);
        return true;
    }

    static async getFile() {
        const input = $(`#${Ids.fileInput}`);
        // get path of file in input

        this.file = input[0].files[0];
        return this.file;
    }

    getProgram() {
        return $(`#${Ids.program}`).val();
    }

    static async getDesc() {
        return $(`#${Ids.description}`).val();
    }

    static async getArrayBuffer(file) {
        return file.arrayBuffer();
    }

    async loadFileFromStorage(fileStorage) {
        if (fileStorage.length === 0) return "No file selected";

        const program = this.getProgram();
        const desc = await FileReader.getDesc();

        GProcess = Resource[program].resource[desc].new();
        GProcess.fileName = fileStorage.map(file => file.name).join(" - ");
        GProcess.achieveSet = AchieveSet[$(`#${Ids.achieveSet}`).val()].value;

        const moreThanOneFile = ["WWiAC", "WordList"];

		let arrayBuffers = [await FileReader.getArrayBuffer(fileStorage[0])];

        if (moreThanOneFile.includes(desc)) {
			for (let i = 1; i < fileStorage.length; i++) {
                arrayBuffers.push(await FileReader.getArrayBuffer(fileStorage[i]));
            }
		}
        this.processFile(arrayBuffers);
		return true;
    }
}
