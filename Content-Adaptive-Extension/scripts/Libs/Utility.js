/*
 * Utility class for methods that has to be used everywhere
 * load with super() if needed
 */
class Utility {
    constructor() {

    }

    //Get current time
    static Time() {
        let a = new Date($.now()), b = a.getHours(), c = a.getMinutes();
        10 > b && (b = "0" + a.getHours());
        10 > c && (c = "0" + a.getMinutes());
        return `${b}:${c}`;
    }


    //Delegate on action
    static async FDelegation(element, action, data) {
        $(element).undelegate(`div[data-action='${action}']`, "click");
        $(element).delegate(`div[data-action='${action}']`, "click", function (event) {
            if (Actions.Has(action)) {
                FActions[action](event, data);
            }
        });
    }

    //Copy text to clipboard
    static Copy(b) {
        let a = document.createElement("input");
        a.setAttribute("value", b);
        document.body.appendChild(a);
        a.select();
        document.execCommand("copy");
        document.body.removeChild(a);
    }

    //First letter to uppercase
    static upFirst(word) {
        return "string" !== typeof word ? "" : word.charAt(0).toUpperCase() + word.slice(1);
    }

    //All words capitalized
    static ucWords(str) {
        str = str.split(" ");
        for (let i = 0; i < str.length; i++)
            "undefined" !== str[i][0] && "undefined" !== typeof str[i][0] && (str[i] = str[i][0].toUpperCase() + str[i].substr(1));
        return str.join(" ");
    }

    //Check if all properties of object are true
    static tableIsTrue(table) {
        for (let key in table)
            if (!table[key])
                return !1;
        return !0;
    }

    //Convert to milliseconds
    static toMilliseconds(hour, minute, seconds) {
        return ((hour * 60 * 60 + minute * 60 + seconds) * 1000);
    }

    //Convert milliseconds to minutes
    static toMinutes(ms) {
        return Math.floor(ms / 60000);
    }

    static clone(obj) {
        return JSON.parse(JSON.stringify(obj));
    }

    //property of object, Case insensitive
    static findPropertyCaseInsensitive(object, key) {
        return object[Object.keys(object).find(k => k.toLowerCase() === key.toLowerCase())];
    }

    static getTime() {
        return new Date(new Date().toLocaleString('en-US', {
            timeZone: 'Europe/Copenhagen'
        }));
    }

    static toLocalTime(stamp) {
        return new Date(stamp * 1000);
    }

    static getTimeRemaining(endtime) {
        let t = endtime - new Date().getTime();
        let seconds = Math.floor((t / 1000) % 60);
        let minutes = Math.floor((t / 1000 / 60) % 60);
        let hours = Math.floor((t / (1000 * 60 * 60)) % 24);
        let days = Math.floor(t / (1000 * 60 * 60 * 24));
        return {
            'total': t,
            'days': days,
            'hours': hours,
            'minutes': minutes,
            'seconds': seconds
        };
    }

    static GetKeyBinds() {
        if ($.parseJSON(localStorage.getItem(MemKeys.Skillbarsetting)).hasOwnProperty(CharName)) {
            return $.parseJSON(localStorage.getItem(MemKeys.Skillbarsetting))[CharName];
        } else {
            return null;
        }
    }

    static isEmpty(str) {
        return (!str || str.length === 0);
    }

    static objectSortByKey(obj) {
        return Object.keys(obj).sort().reduce(function (result, key) {
            result[key] = obj[key];
            return result;
        }, {});
    }

    static outputAllElements() {
        let out = "";
        $.each(ELib, function (key, value) {
            out += "| `" + key + "` | `string` | `" + value + "` |  \n";
        });
        console.log(out);
    }

    static outputAllClasses() {
        let out = "";
        $.each(Classes, function (key, value) {
            out += "| `" + key + "` | `string` | `" + value + "` |  \n";
        });
        console.log(out);
    }

    static genID(table, id = null) {
        if (id == null) {
            id = Math.random().toString(26);
        }

        $.each(table, (key, value) => {
            if (value.hasOwnProperty("id") && value.id === id) {
                return CustomJs.ScriptIDExist(table);
            }
        });

        return id;
    }

    static findIndexGreaterThan(arr, x) {
        for (let i = 0; i < arr.length; i++) {
            if (arr[i] > x) {
                return i;
            }
        }
        return -1;
    }

    static numberWithCommas(x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    static replaceLast(str, pattern, replacement) {
        const match =
            typeof pattern === 'string'
                ? pattern
                : (str.match(new RegExp(pattern.source, 'g')) || []).slice(-1)[0];
        if (!match) return str;
        const last = str.lastIndexOf(match);
        return last !== -1
            ? `${str.slice(0, last)}${replacement}${str.slice(last + match.length)}`
            : str;
    };

    static splitStringAt(str, index) {
        return [str.slice(0, index), str.slice(index)];
    }

    static isNotNull(value) {
        return value !== null && value !== undefined && value !== "" && value !== "N/A" && value !== "\n" && value !== "\r\n" && value !== "\r";
    }

    static beautifullyHeader(header) {
        const step1 = this.ucWords(header.replaceAll("_", " ").replaceAll("\r", " ").replaceAll("\n", " ").trim());
        return step1.split(" ").filter((value) => this.isNotNull(value)).join(" ");
    }

    static equals(a, b) {
        return a.trim().toLowerCase() === b.trim().toLowerCase();
    }

    static equalsWordId(a, b) {
        return a.trim().toLowerCase() === b.trim().toLowerCase();
    }

    static simplifyString(str) {
        return this.beautifullyHeader(str).replaceAll(" ", "");
    }

    static removeSpecialCharacter(string) {
        return string.replaceAll(/\r/g, "").replaceAll(/\t/g, "");
    }


    static removeExtraSpace(string) {
        // i want make function for template
        // template "  dsad a  sada dsad a " => "dsad a sada dsad a"
        return string.replaceAll(/\s+/g, ' ').trim();
    }

    static splitStringBySemi(string) {
        return this.splitStringBySpecialCharacter(string, ";");
    }

    static splitStringBySpecialCharacter(string, character) {
        const split = string.split(character);
        const removeExtraSpace = split.map((value) => this.removeExtraSpace(value));
        const removeSpecialCharacter = removeExtraSpace.map((value) => this.removeSpecialCharacter(value));
        return removeSpecialCharacter.filter((value) => this.isNotNull(value));
    }

    static getFieldOfRow(header, row) {
        const simplifyHeader = Utility.simplifyString(header);
        for (let key in row) {
            const simplifyKey = Utility.simplifyString(Utility.beautifullyHeader(key));
            if (simplifyKey.includes(simplifyHeader)) return row[key];
        }
        // this.addError("Field", `Can't find field ${header} in row ${row + 1} please check your data`);
        return "";
    }

    static getExactlyFieldOfRow(header, row) {
        const simplifyHeader = Utility.simplifyString(header);
        for (let key in row) {
            const simplifyKey = Utility.simplifyString(Utility.beautifullyHeader(key));
            if (simplifyHeader === simplifyKey) return row[key];
        }
        // this.addError("Field", `Can't find field ${header} in row ${row + 1} please check your data`);
        return "";
    }

    static getFieldIncludeOfRow(headers, row) {
        const simplifyHeaders = headers.map((value) => Utility.simplifyString(value));
        for (let key in row) {
            const simplifyKey = Utility.simplifyString(Utility.beautifullyHeader(key));
            if (simplifyHeaders.includes(simplifyKey)) return row[key];
        }
        return "";
    }

    static getSheetNames(sheetName, allSheets) {
        return allSheets["SheetNames"].filter((value) => value.includes(sheetName));
    }
}