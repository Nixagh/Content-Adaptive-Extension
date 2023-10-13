/*
 * Actions class Module
 * Premade functions to callback to
 */
class Actions {
	constructor() {

	}

	static Add(key, func) {
		if (!Actions.Has(key)) {
			FActions[key] = func;
			return true;
		}
		return false;
	}

	static async Remove(key){
		if (FActions.hasOwnProperty(key)){
			delete FActions[key];
		}
	}

	static Has(key){
		return key in FActions;
	}

	static Call(action, event, data){
		if(Actions.Has(action)){
			FActions[action](event, data);
		}
	}

}
