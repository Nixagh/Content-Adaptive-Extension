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

	static GetAllStorageSyncData(top_key) {
		// Immediately return a promise and start asynchronous work
		return new Promise((resolve, reject) => {
			// Asynchronously fetch all data from storage.sync.
			chrome.storage.local.get(top_key, (items) => {
				// Pass any observed errors down the promise chain.
				if (chrome.runtime.lastError) {
					return reject(chrome.runtime.lastError);
				}
				// Pass the data retrieved from storage down the promise chain.
				resolve(items);
			});
		});
	}
}
