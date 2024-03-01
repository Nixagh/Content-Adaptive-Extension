class ProgramTocProcess {
    fileName;
    type;
    allSheets;
    data;
    errors;
    _errors = [];

    constructor(type) {
        this.type = type;
        this.allSheets = {};
        this.data = [];
        this.errors = [];
        this.productCode = "";
        this.grade = "";
        this.unit = "";
    }

    getLengthData() {
        return this.data.length;
    }

    process() {
        this.data = this.getFullContent();
        Storage.Set("GProcess", JSON.stringify(this));

    }

    getFullContent() {
        const getGearAvatar = this.getGearAvatarSheet();


        const beautifyGearAvatar = this.beautifyData(getGearAvatar);

        return {
            gearAvatar: beautifyGearAvatar
        };
    }

    getValueOfKey(_key, data) {
        for(let key in data) {
            if (key.toUpperCase().includes(_key.toUpperCase())) {
                return data[key];
            }
        }
        return "";
    }

    beautifyData(data) {
        const newData = {};

        data.forEach((item) => {
            const grade = this.getValueOfKey("Grade", item);
            const units = [];
            // unit
            for (let i = 1; i < 15; i++) {
                const unit = this.getValueOfKey(`Unit${i}`, item);
                if (unit) {
                    try {
                        units.push(JSON.parse(unit));

                    } catch (e) {
                        console.log(e);
                        console.log("grade: ", grade, "unit: ", unit);
                    }
                }
            }
            newData[grade] = units;
        })

        return newData;
    }

    getGearAvatarSheet() {
        const gearAvatarSheetName = 'GearAvatar';
        const gearAvatarSheet = this.getSheet(gearAvatarSheetName);
        const header = this.getHeader(gearAvatarSheet);
        return this.getContent(gearAvatarSheet, header);
    }

    getSheet(sheetName) {
        return ExcelUtil.getSheet(sheetName, this.allSheets);
    }

    getHeader(sheet) {
        return ExcelUtil.getHeader(sheet);
    }

    getContent(sheet, header) {
        return ExcelUtil.getContent(sheet, header);
    }
}