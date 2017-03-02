class StateManager {
	constructor() {
		this.states = {};
	}

	addState(stateName) {
		this.states[stateName] = new State(stateName);
	}

	getState(stateName) {
		return this.states[stateName];
	}
}

class State {
	constructor(_name) {
		this.name = _name;
		this.children = {};
	}

	addChild(eventName, state) {
		this.children[eventName] = state;
	}

	getChild(eventName) {
		return this.children[eventName];
	}
}

class Event {
	constructor(_name, _activity) {
		this.name = _name;
		this.activity = _activity;
	}

	activate() {
		this.activity();
	}
}

var event = new Event("test", function() {
	console.log("testing event activity");
});
event.activate();