/*
 * Storage class
 */
class Storage extends Utility {
	constructor() {
		super();
		Storage.Load();
	}

	//Load mod from storage
	static Load() {
		let a = $.parseJSON(localStorage.getItem(MemKeys.Storage));
		null !== a && a.hasOwnProperty("mod") ? Gstate = this.Gstate = a : (Gstate = Temp, Storage.Save());
		Storage.Update();
	}

	static Get(key){
		return localStorage.getItem(key);
	}

	//Update mod
	static Update() {
		if (Gstate.mod.version !== _Version) {
			for (var a in Gstate.mod.chars) {
				Gstate.mod.chars[a].settings = {};
			}
			Gstate.mod.version = _Version;
			Storage.Save();
		}
	}

	static Set(key, value){
		localStorage.setItem(key, value);
	}

	//Save mod to storage
	static Save() {
		localStorage.setItem(MemKeys.Storage, JSON.stringify(Gstate));
	}

	//Reload Gstate from storage
	static Reload() {
		Gstate = this.Gstate = $.parseJSON(Storage.Get(MemKeys.Storage));
	}

	//Do a reset of Gstate
	static Reset() {
		Gstate.mod = Temp.mod;
		this.Gstate = Gstate;
		Storage.Save();
	}
}
