class FileReader {
	processFile(arrayBuffer) {
		GProcess.allSheets = XLSX.read(arrayBuffer);
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

	async loadFileFromWWiA(files) {
		console.log(files)
		const arrayBuffers = [];
		for (let file of files) {
			arrayBuffers.push(await FileReader.getArrayBuffer(file));
		}

		console.log(arrayBuffers);
	}


	static async getFile(multiple = false) {
		const input = $(`#${Ids.fileInput}`);

		if (multiple) {
			// get path of file in input
			this.file = Array.from(input).map(input => input.files[0]);
			return this.file;
		}

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
}
