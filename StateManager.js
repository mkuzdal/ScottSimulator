class StateManager {
	constructor(_state) {
		this.currentState = _state;
		this.states = {};
		this.states[_state.name] = _state;
	}

	addState(stateName) {
		this.states[stateName] = new State(stateName);
	}

	getState(stateName) {
		return this.states[stateName];
	}

	apply(event) {
		event.run();
		this.currentState = this.currentState[event.name];
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

	run() {
		this.activity.run();
	}
}

class Activity {
	constructor(_audio, _function, _event) {
		this.audio = _audio;
		this.func = _function;
		if(this.audio) this.audio.addEventListener("ended", this.func);
	}

	run() {
		if(this.audio) this.audio.play();
		else this.func;
	}
}


var SM = new StateManager(new State("root"));
SM.addState(new State("second"));
SM.getState("root").addChild("test", SM.getState("second"));

var event1 = new Event("test", new Activity(document.getElementById('AUDIOWOOHOO'), function(){console.log('testing activity');}));
var event2 = new Event("test2", new Activity(document.getElementById('AUDIORICH'), function(){console.log('testing null audio activity');}))

SM.apply(event1);