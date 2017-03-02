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
	constructor(_name) {
		this.name = _name;
		this.activityQueue = [];
	}

	addActivity(activity) {
		this.activityQueue.push(activity);
	}

	run() {
		for(var i=0; i<this.activityQueue.length; i++) this.activityQueue[i].run();
	}
}

class Activity {
	constructor(_audio, _function) {
		this.audio = _audio;
		this.func = _function;
		this.audio.addEventListener("ended", this.func);
	}

	run() {
		this.audio.play();
	}
}

var event = new Event("test");
event.addActivity(new Activity(document.getElementById('AUDIOWOOHOO'), function(){console.log('testing activity')}));
event.run();