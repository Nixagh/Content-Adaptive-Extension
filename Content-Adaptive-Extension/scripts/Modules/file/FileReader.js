class FileReader {
	processFile(arrayBuffer) {
		GProcess.allSheets = XLSX.read(arrayBuffer);
		GProcess.process();
	}

	async loadFile() {
		const file = await FileReader.getFile();
		if (!file) return "No file selected";
		if (!ExcelType[file.type]) return "Invalid file type";

		const desc = await FileReader.getDesc();
		if (!desc) return "No description selected";

		const arrayBuffer = await FileReader.getArrayBuffer(file);

		GProcess = VWAResource[desc].new();
		if (!GProcess) return "Invalid description";

		GProcess.fileName = file.name;
		this.processFile(arrayBuffer);
		return true;
	}

	static async getFile() {
		const input = $(`#${Ids.fileInput}`);
		// get path of file in input
		const filePath = input;

		this.file = input[0].files[0];
		return this.file;
	}

	static async getDesc() {
		return $(`#${Ids.description}`).val();
	}

	static async getArrayBuffer(file) {
		return file.arrayBuffer();
	}
}
