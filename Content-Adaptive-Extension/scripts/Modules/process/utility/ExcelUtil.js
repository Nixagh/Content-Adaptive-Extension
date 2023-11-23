class ExcelUtil {
    static getSheet(sheetName, allSheets) {
        const _sheetName = allSheets.SheetNames.find(sheet => sheet.includes(sheetName));
        return allSheets.Sheets[_sheetName];
    }

    static getHeader(sheet) {
        try {
            return XLSX.utils.sheet_to_json(sheet, {header: 1})[0].map(header => header.trim());
        } catch (e) {
            alert(`Wrong format in excel file, please check your excel file, or not found sheet ${sheet}`);
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
                if (row[key] instanceof String) row[key] = Utility.removeExtraSpace(row[key]);
            }
        });

        return newContentWithBeautifulKey.map(row => {
            const newRow = {};
            for (const key in row) {
                if (row[key] instanceof String) newRow[key] = Utility.removeExtraSpace(row[key]).trim();
                else newRow[key] = row[key];
            }
            return {...newRow};
        });
    }
}