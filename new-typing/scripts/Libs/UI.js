/*
 * UI Libs class
 */
class UI {
	constructor() {
		this.Setup();
	}

	Setup() {
		if (!GState.mod.chars[CharID].hasOwnProperty("ui")) {
			GState.mod.chars[CharID].ui = {};
			Storage.Save();
		}
	}

	//Hook
	static async Hook() {
		Mutator.Create("UI", Classes.uibase, {
			childList: true,
			subtree: false,
			attributes: false,
			characterData: true
		}, function (mutations) {
			for (let mutation of mutations) {
				for (let node of mutation.addedNodes) {
					let element = $(node).find("div[name]")[0];
					if (element) {
						let target = element.textContent.toLowerCase();

						if (Language != null) {
							for (let [index, entry] of Object.entries(Language.ui)) {
								if (entry.hasOwnProperty("name")) {
									if (typeof entry.name == "string" && entry.name.toLowerCase() == target) {
										target = index;
										break;
									}
								}
							}
						}

						for (let [index, entry] of Object.entries(GState.mod.chars[CharID].ui)) {
							if (index == target) {
								if (entry.hasOwnProperty("reff") && GState.mod.chars[CharID].ui.hasOwnProperty(entry.reff)) {
									if (GState.mod.chars[CharID].ui[entry.reff].hasOwnProperty("action")) {
										GState.mod.chars[CharID].ui[entry.reff].action();
									}
									Customizer.LoadModsFor(entry.reff, element);
								} else {
									if (entry.hasOwnProperty("action")) {
										UI.WindowOpened(target);
										entry.action();
									}
									Customizer.LoadModsFor(index, element);
								}
								break;
							}
						}
					} else {
						let fCH = $(node).find('div:first-child')[0];
						if ($(fCH).hasClass('disabled')) {
							let name = $(fCH).html();
							if (!Player.IsSelf(name)) {
								let html = Elements.Build('dropdownEntry', {
									cls: Classes.blockuserChat,
									action: `data-name="${name.toLowerCase()}"`,
									html: "Block"
								});
								UI.Append(node, html);
								Input.DelegateClick($(`.${Classes.blockuserChat}`), $(`.${Classes.blockuserChat}`), Social.BlockUserFromChat);
							}
						}
					}
				}
			}
		});
	}

	static WindowOpened(key) {
		if (!OpenWindows.includes(key)) {
			OpenWindows.push(key);
		}
	}

	// Add a window and it's data
	static async AddWindow(key, data) {
		if (!UI.HasWindow(key)) {
			GState.mod.chars[CharID].ui[key] = data;
			Storage.Save();
			UI.OnLoadWindow(key, data);
			return true;
		} else {
			if (data.hasOwnProperty("action") && !GState.mod.chars[CharID].ui[key].hasOwnProperty("action")) {
				GState.mod.chars[CharID].ui[key].action = data.action;
			}
			UI.OnLoadWindow(key, data);
			return false;
		}
	}

	//On window load and reload
	static async OnLoadWindow(key, data) {
		if (data.hasOwnProperty("storage") && UI.Exist(data.storage)) {
			let result = Storage.Get(data.storage);
			if (UI.Exist(result)) {
				if ((result === 'true')) {
					let element = $(`.container.${data.svelte}`).find("div[name]")[0];
					if (data.hasOwnProperty("action")) {
						data.action();
					}
					Customizer.LoadModsFor(key, element);
				}
			}
		}
	}

	static GetWindow(key) {
		if (GState.mod.chars[CharID].ui.hasOwnProperty(key)) {
			return GState.mod.chars[CharID].ui[key];
		} else {
			return null;
		}
	}

	// Remove a window and it's data
	static async RemoveWindow(key) {
		if (GState.mod.chars[CharID].ui.hasOwnProperty(key)) {
			delete GState.mod.chars[CharID].ui[key];
			Storage.Save();
		}
	}

	static async AppendAfter(element, html) {
		if (UI.Exist(element)) {
			$(element).after(html);
		}
	}

	static async Prepend(element, html) {
		if (UI.Exist(element)) {
			$(element).prepend(html);
		}
	}

	//Async append html to element
	static Append(element, html) {
		if (UI.Exist(element)) {
			$(element).append(html);
		}
	}

	//Async remove element
	static async Remove(element) {
		if (UI.Exist(element)) {
			$(element).remove();
		}
	}

	//Async Empty element
	static async Empty(element) {
		if (UI.Exist(element)) {
			$(element).empty();
		}
	}

	//async element position
	static async Position(element, position, top, left, inv = null) {
		if (inv === null) {
			$(element).css({position: position, top: `${top}px`, left: `${left}px`, height: 'fit-content'});
		} else {
			$(element).css({position: position, top: `${top}px`, left: `${left}px`});
		}
	}

	//Add version to the bottom of the screen
	static async DisplayVersion() {
		if (Character.Exist(CharID)) {
			let args = [];
			for (let entry in Dev) {
				args[entry] = Base64.Decode(Dev[entry]);
			}
			let port = {
				modname: "Ruin UI",
				version: GState.mod.version,
				by: args.join(" & ")
			};
			//let element = Elements.Build("versionblock", port);
			let element = await Elements.aBuild("versionblock", port);
			UI.Append(`.${Classes.layout}`, element);
		}
	}

	// Async add element to main menu
	static async AddToMenu(element) {
		$(`${Classes.mainmenu} div:first-child`).after(element);
	}

	// Async remove element from menu
	static async RemoveFromMenu(id) {
		let element = $(`"${id}`)[0];
		if (element) {
			UI.Remove(element);
		}
	}

	//Async Delegate click on element from parent
	static Delegate(parent, trigger, on, action, data = null) {
		$(parent).undelegate(on, trigger);
		$(parent).delegate(on, trigger, function (event) {
			if (typeof action === "string") {
				Actions.Call(action, event, data);
			} else if (typeof action === "function") {
				if (data !== null) {
					action(data, event);
				} else {
					action(event);
				}
			}
		});
	}

	//Main menu delegation
	static async DelegateMainMenu(id, target, name) {
		UI.Delegate(`${Classes.mainMenu}`, "click", `#${id}`, function () {
			const _target = $(`${target}`);
			if (_target.is(":visible")) {
				_target.hide();
			} else {
				UI.WindowOpened(name);
				_target.show();
			}
		});
	}

	//Close elements on screen
	static async CloseElementDelegation(element, rem = false) {
		let selector = $(element).attr("id");
		if (UI.Exist(selector)) {
			selector = `#${selector}`;
		} else {
			selector = element;
		}

		UI.Delegate(selector, "click", `.${Classes.closefeature}`, function () {
			if (typeof selector === "string") {
				element = $(selector)[0];
			}
			if (UI.Exist(element)) {
				$(element).is(":visible") && $(element).hide();
				if (rem) {
					$(element).remove();
				}
			}
		});
	}

	static async DeleteElementDelegation(element) {
		UI.Delegate(element, "click", `.${Classes.deletefeature}`, function () {
			UI.Remove(element);
		});
	}

	// Check if a window and it's data exist
	static HasWindow(key) {
		return GState.mod.chars[CharID].ui.hasOwnProperty(key);
	}

	static async Reload() {
		Storage.Set("settingsOpen", false);
		window.location.reload();
	}

	static async Kill() {
		window.close();
	}

	static Exist(element) {
		return element !== undefined && element !== null && element !== '';
	}
}
