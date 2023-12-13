class ExcelUtil {
    static getSheet(sheetName, allSheets) {
        const _sheetName = allSheets.SheetNames.find((sheet) =>
            sheet.includes(sheetName)
        );
        return allSheets.Sheets[_sheetName];
    }

    static getFirstSheet(allSheets) {
        const sheetsArray = Object.values(allSheets.Sheets);
        const sheet = sheetsArray.shift();
        return sheet;
    }

    static getHeader(sheet) {
        try {
            return XLSX.utils.sheet_to_json(sheet, {header: 1})[0]
        } catch (e) {
            alert(
                `Wrong format in excel file, please check your excel file, or not found sheet ${sheet}`
            );
            return null;
        }
    }

    static getContent(sheet, header) {
        const content = XLSX.utils.sheet_to_json(sheet, {header: header});
        // remove first row (header)
        let noHeaderContent = content.slice(1);
        // process key in row
        const newContentWithBeautifulKey = noHeaderContent.map((row) => {
            const newRow = {};
            for (const key in row) {
                // remove space in key
                newRow[Utility.beautifullyHeader(key).trim()] = row[key];
                delete row[key];
            }
            return {...newRow};
        });

        newContentWithBeautifulKey.forEach((row) => {
            for (const key in row) {
                if (row[key] instanceof String)
                    row[key] = Utility.removeExtraSpace(row[key]);
            }
        });

        const newContent = newContentWithBeautifulKey.map((row) => {
            const newRow = {};
            for (const key in row) {
                if (row[key] instanceof String)
                    newRow[key] = Utility.removeExtraSpace(row[key]).trim();
                else newRow[key] = row[key];
            }
            return {...newRow};
        });

        return this.beautifyContent(newContent);
    }

    static beautifyContent(content) {
        content = this.replaceStarInWord(content);
        content = this.replaceAnswerChoice(content);
        return content;
    }

    static replaceStarInWord(content) {
        const key = "Word";
        const method = (value) => value.replaceAll("*", "");
        return this.replaceWithMethod(content, method, key);
    }

    static replaceAnswerChoice(content) {
        const key = "Answer Choice";
        const method = (value) => value.replaceAll(/[,:|] [abcd](\.|) /g, ";");
        return this.replaceWithMethod(content, method, key);
    }

    static replaceWithMethod(content, method, key) {
        content.forEach((row) => {
            if (row[key]) row[key] = method(row[key]);
        });
        return content;
    }
}
