/*
 * Elements Lib
 */
class Elements {
	constructor() {

	}

	static async aBuild(element, data = null) {
		if (ELib.hasOwnProperty(element)) {
			let html = ELib[element];
			$.each(data, function (key, value) {
				html = html.replace(`%${key}%`, value);
			});
			return html;
		} else {
			return '';
		}
	}

	static Build(element, data = null) {
		let html = ``;
		if (ELib.hasOwnProperty(element)) {
			html = ELib[element];
			$.each(data, function (key, value) {
				html = html.replace(`%${key}%`, value);
			});
		}
		return html;
	}

	static Tick(key, data) {
		let html = Elements.Title(key, data);
		if (data.value) {
			html += Elements.Build("tickbox", {cls: `${data.type}_${key} active`});
		} else {
			html += Elements.Build("tickbox", {cls: `${data.type}_${key}`});

		}
		return html;
	}

	static sDropdown(key, data, selected, title = null, SettingDescriptions = null) {
		let html = "";
		$.each(data, function (hand, value) {
			if (selected === value) {
				html += Elements.Build("sDropdownOption", {value: value, selected: "selected", text: value});
			} else {
				html += Elements.Build("sDropdownOption", {value: value, selected: "", text: value});
			}
		});
		let element = "";
		if (title !== null) {
			let description = "";
			if (SettingDescriptions !== null) {
				description = Elements.Build("description", {cls: ``, text: SettingDescriptions});
			}
			element += Elements.Build("settingTitle", {cls: ``, text: `${title} ${description}`});
		}

		element += Elements.Build("sDropdown", {cls: `${data.type}_${key}`, action: "", html: html});
		return element;
	}

	static Dropdown(key, data) {
		let selected = Settings.Get(key);
		let html = "";
		$.each(data.multiselect, function (hand, value) {
			html += Elements.Build("sdropdownOption", {
				value: value,
				selected: selected === value ? "selected" : "",
				text: value
			});
		});

		return Elements.Title(key, data) + Elements.Build("sDropdown", {
			cls: `${data.type}_${key}`,
			action: "",
			html: html
		});
	}

	static ScriptDropdown(key, data) {
		let selected = Settings.Get(key);

		let html = Elements.Build("scriptDropdownOption", {
			id: "",
			value: "",
			selected: "",
			text: ""
		});
		$.each(PlayerScripts, function (hand, value) {
			html += Elements.Build("scriptDropdownOption", {
				id: value.id,
				value: value.id,
				selected: selected === value.id ? "selected" : "",
				text: value.name
			});
		});

		let element = Elements.Build("scriptDropdown", {cls: `${data.type}_${key}`, action: "", html: html});
		return element;
	}

	static Title(key, data) {
		let description = "";
		if (SettingDescriptions.hasOwnProperty(key)) {
			description = Elements.Build("description", {cls: ``, text: SettingDescriptions[key]});
		}
		let element = Elements.Build("settingTitle", {cls: ``, text: `${data.name} ${description}`});

		return element;
	}

	static EmptyDiv(key, data) {
		return Elements.Build("emptyDiv", {cls: `${data.type}_${key}`});
	}

	static CustomjsInput(key, data) {
		let info = data.value.split("_");
		let rows = info[0];
		let cols = info[1];
		let html = Elements.Build("customjsInput", {identifier: key, action: "", rows: rows, cols: cols, text: ""});
		return html;
	}

	static CustomcssInput(key, data) {
		let info = data.value.split("_");
		let rows = info[0];
		let cols = info[1];
		let html = Elements.Build("customcssInput", {identifier: key, action: "", rows: rows, cols: cols});
		return html;
	}

	static CustomJsLowerButtons(key, data) {
		let html = Elements.Build("customJsLowerButtons", {});
		return html;
	}

	static DoubleBuffDivText(key, data) {
		let element = Elements.Build("doubleBuffDivText", {cls: key, clsX: key});
		return element;
	}

	static DoubleBuffDiv(key, data) {
		let on = "";
		let off = "";
		let buffTarget = data.value.split("_")[0];
		let buffType = data.value.split("_")[1];
		if (BuffTrackerArgs !== undefined && BuffTrackerArgs !== null && BuffTrackerArgs !== '') {
			if (BuffTrackerArgs.hasOwnProperty(buffType) && BuffTrackerArgs[buffType].hasOwnProperty(buffTarget)) {
				for (let i = 0; i < BuffTrackerArgs[buffType][buffTarget].on.length; i++) {
					if (SkillsData[BuffTrackerArgs[buffType][buffTarget].on[i]] !== undefined) {
						let img = Elements.Build("doubleBuffDivImg", {
							src: 'https://hordes.io/assets/ui/skills/' + BuffTrackerArgs[buffType][buffTarget].on[i] + '.webp',
							cls: 'skill_icon_' + BuffTrackerArgs[buffType][buffTarget].on[i]
						});
						let name = SkillsData[BuffTrackerArgs[buffType][buffTarget].on[i]].name;
						on += Elements.Build("doubleBuffDivItem", {
							id: data.value + "_" + BuffTrackerArgs[buffType][buffTarget].on[i],
							cls: 'bufftracker_' + data.value + ' skill' + BuffTrackerArgs[buffType][buffTarget].on[i],
							text: img + name
						});
					}
				}
				for (let i = 0; i < BuffTrackerArgs[buffType][buffTarget].off.length; i++) {
					if (SkillsData[BuffTrackerArgs[buffType][buffTarget].off[i]] !== undefined) {
						let img = Elements.Build("doubleBuffDivImg", {
							src: 'https://hordes.io/assets/ui/skills/' + BuffTrackerArgs[buffType][buffTarget].off[i] + '.webp',
							cls: 'skill_icon_' + BuffTrackerArgs[buffType][buffTarget].off[i]
						});
						let name = SkillsData[BuffTrackerArgs[buffType][buffTarget].off[i]].name;
						off += Elements.Build("doubleBuffDivItem", {
							id: data.value + "_" + BuffTrackerArgs[buffType][buffTarget].off[i],
							cls: 'bufftracker_' + data.value + ' skill' + BuffTrackerArgs[buffType][buffTarget].off[i],
							text: img + name
						});
					}
				}
			}
		}
		let element = Elements.Build("doubleBuffDiv", {
			id: key + '1',
			cls: key + " on",
			array_location: "on",
			array_type: buffType,
			content: on
		});
		element += Elements.Build("doubleBuffDiv", {
			id: key + '2',
			cls: key + " off",
			array_location: "off",
			array_type: buffType,
			content: off
		});
		return element;
	}

	static Spacer(key, data) {
		return Elements.Build("spacer", {cls: key, text: data.name});
	}

	static SoloSpacer(key, data) {
		return Elements.Build("soloSpacer", {cls: key, text: data.name});
	}

	static ButtonLeft(key, data) {
		let element = Elements.Build("buttonL", {action: key, text: data.name});
		return element;
	}

	static ButtonRight(key, data) {
		let element = Elements.Build("buttonR", {action: key, text: data.name});
		return element;
	}

	static Add_script_button(key, data) {
		let element = Elements.Build("add_script_button", {action: key, text: data.name});
		return element;
	}

	static Textarea(key, data) {
		let html = Elements.Title(key, data);
		html += Elements.Build("textarea", {identifier: key, action: ""});
		return html;
	}

	static xTextarea(key, data) {
		let html = Elements.Build("textarea", {identifier: key, action: ""});
		return html;
	}

	static Input(key, data) {
		let html = Elements.Title(key, data);
		html += Elements.Build("textbox", {cls: `${data.type}_${key}`, value: data.value});
		return html;
	}

	static xInput(key, data) {
		let html = Elements.Build("textbox", {cls: `${data.type}_${key}`, value: data.value});
		return html;
	}

	//Number input
	static Ninput(key, data) {
		let html = Elements.Title(key, data);
		html += Elements.Build("ntextbox", {cls: `${data.type}_${key}`, value: data.value});
		return html;
	}

	//Number input
	static Decimalinput(key, data) {
		let html = Elements.Title(key, data);
		html += Elements.Build("decimaltextbox", {cls: `${data.type}_${key}`, value: data.value});
		return html;
	}

	//Number input
	static Dinput(key, data) {
		let html = Elements.Title(key, data);
		html += Elements.Build("dnumberbox", {cls: `${data.type}_${key}`, value: data.value});
		return html;
	}

	static Inputcolor(key, data) {
		let html = Elements.Title(key, data);
		html += Elements.Build("inputcolor", {cls: `${data.type}_${key}`, value: "#" + data.value});
		return html;
	}

	static Colorrangeslider(key, data) {
		let html = Elements.Title(key, data);
		html += Elements.Build("colorrangeslider", {cls: `${data.type}_${key}`, value: data.value});
		return html;
	}

	static optionsButton(key, data) {
		return Elements.Build("optionsButton", {cls: `${data.type}_${key}`, value: data.value});
	}

	static fileInput(key, data) {
		return Elements.Build("fileInput", {cls: `${data.type}_${key}`, value: data.value});
	}

	static button(key, data) {
		return Elements.Build("button", {cls: `${data.type}_${key}`, value: data.value});
	}

	static
}
