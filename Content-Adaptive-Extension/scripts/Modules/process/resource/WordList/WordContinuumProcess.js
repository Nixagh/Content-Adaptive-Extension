const wordContinuumIds = {
    wordId: "pojo.wordId",
    word: "pojo.word",
    directionLine: "cke_directionLine",
    leftAnchor: "pojo.leftAnchor",
    rightAnchor: "pojo.rightAnchor",
    tile: "tile",
    tileAnswer: "tilesAnswer"
}
class WordContinuumProcess {
    fileName;
    type = "WordContinuum";
    allSheets;
    data;
    rowMinus = 1;
    errors;

    process() {
        this.data = this.getData();
        Storage.Set("GProcess", JSON.stringify(this));
    }

    insert() {
        const rowNumber = this.getRow();
        const data = this.getDataObject(rowNumber);
        this.setHtml(data);
        console.log(`insert word continuum row ${rowNumber} success`);
    }

    getData() {
        return this.getContinuumData();
    }

    getLengthData() {
        return this.data.length;
    }

    getContinuumData() {
        const sheet = ExcelUtil.getSheet("Continuum", this.allSheets);
        const header = ExcelUtil.getHeader(sheet);
        return ExcelUtil.getContent(sheet, header);
    }

    getRow() {
        return parseInt(document.getElementById(Ids.questionNumber).value) - this.rowMinus;
    }

    getDataObject(rowNumber) {
        return {
            wordId: this.getWordId(this.data[rowNumber]),
            word: this.getWord(this.data[rowNumber]),
            directionLine: this.getDirectionLine(this.data[rowNumber]),
            leftAnchor: this.getLeftAnchor(this.data[rowNumber]),
            rightAnchor: this.getRightAnchor(this.data[rowNumber]),
            tile_1: this.getTile1(this.data[rowNumber]),
            tile_1_definition: this.getTile1Definition(this.data[rowNumber]),
            tile_2: this.getTile2(this.data[rowNumber]),
            tile_2_definition: this.getTile2Definition(this.data[rowNumber]),
            tile_3: this.getTile3(this.data[rowNumber]),
            tile_3_definition: this.getTile3Definition(this.data[rowNumber]),
            tile_4: this.getTile4(this.data[rowNumber]),
            tile_4_definition: this.getTile4Definition(this.data[rowNumber]),
            tile_5: this.getTile5(this.data[rowNumber]),
            tile_5_definition: this.getTile5Definition(this.data[rowNumber]),
            tile_6: this.getTile6(this.data[rowNumber]),
            tile_6_definition: this.getTile6Definition(this.data[rowNumber]),
            tileAnswer: this.getTileAnswer(this.data[rowNumber]),
            partOfSpeech: this.getPartOfSpeech(this.data[rowNumber])
        }
    }

    setHtml(wordContinuumObject) {
        const wordId = new BasicInput(wordContinuumIds.wordId);
        const word = new BasicInput(wordContinuumIds.word);
        const directionLine = new Cke(wordContinuumIds.directionLine);
        const leftAnchor = new BasicInput(wordContinuumIds.leftAnchor);
        const rightAnchor = new BasicInput(wordContinuumIds.rightAnchor);
        const tile = new BasicInput(wordContinuumIds.tile);
        const tileAnswer = new BasicInput(wordContinuumIds.tileAnswer);

        wordId.setValue(wordContinuumObject.wordId);
        word.setValue(wordContinuumObject.word);
        directionLine.setHtml(wordContinuumObject.directionLine);
        leftAnchor.setValue(wordContinuumObject.leftAnchor);
        rightAnchor.setValue(wordContinuumObject.rightAnchor);
        tile.setValue(this.convertTile(wordContinuumObject));
        tileAnswer.setValue(wordContinuumObject.tileAnswer);
    }

    getWordId(row) {
        return Utility.getFieldOfRow("WordID", row);
    }

    getWord(row){
        return Utility.getFieldOfRow("Word", row);
    }

    getDirectionLine(row){
        return Utility.getFieldOfRow("Direction Line ", row);
    }

    getLeftAnchor(row){
        return Utility.getFieldOfRow("Left Anchor", row);
    }

    getRightAnchor(row){
        return Utility.getFieldOfRow("Right Anchor", row);
    }

    getTile1(row){
        return Utility.getFieldOfRow("Tile 1 [set random order]", row);
    }

    getTile1Definition(row){
        return Utility.getFieldOfRow("Tile 1 popup definition", row);
    }

    getTile2(row){
        return Utility.getFieldOfRow("Tile 2 [set random order]", row);
    }

    getTile2Definition(row){
        return Utility.getFieldOfRow("Tile 2 popup definition", row);
    }

    getTile3(row){
        return Utility.getFieldOfRow("Tile 3 [set random order]", row);
    }

    getTile3Definition(row){
        return Utility.getFieldOfRow("Tile 3 popup definition", row);
    }

    getTile4(row){
        return Utility.getFieldOfRow("Tile 4 [set random order]", row);
    }

    getTile4Definition(row){
        return Utility.getFieldOfRow("Tile 4 popup definition", row);
    }

    getTile5(row){
        return Utility.getFieldOfRow("Tile 5 [set random order]", row);
    }

    getTile5Definition(row){
        return Utility.getFieldOfRow("Tile 5 popup definition", row);
    }

    getTile6(row){
        return Utility.getFieldOfRow("Tile 6 [set random order]", row);
    }

    getTile6Definition(row){
        return Utility.getFieldOfRow("Tile 6 popup definition", row);
    }

    getTileAnswer(row){
        return Utility.getFieldOfRow("Tiles (correct order)", row).replaceAll(",", ";");
    }

    getPartOfSpeech(row){
        return Utility.getFieldOfRow("Part of Speech", row);
    }

    generatePartOfJson(tile, partOfSpeech, color, definition) {
        if (definition.includes("\"")) {
            definition = definition.replace("\"", "\\\"");
        }
        const obj = {
            tile: tile,
            partOfSpeech: partOfSpeech,
            color: color,
            definition: definition
        };
        return JSON.stringify(obj);
    }

    convertTile(wordContinuumObject){
        const list = [];
        const color = "#F1F2FD";
        const partOfSpeech = wordContinuumObject.partOfSpeech;

        for(let i = 1; i <= 6; i++) {
            const title = wordContinuumObject[`tile_${i}`];
            const definition = wordContinuumObject[`tile_${i}_definition`]
            if (title && definition) list.push({
                title: title,
                partOfSpeech: partOfSpeech,
                color: color,
                definition: document
            })
        }

        return JSON.stringify(list);
    }

}