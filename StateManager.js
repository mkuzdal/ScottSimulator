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
		if(this.currentState.getChild(event.name)) {
			event.run();
			this.currentState = this.currentState.getChild(event.name);
		} else {
			console.log('This event is not a branch of the current state', event);
		}
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
	constructor(_audio, _initfunc, _endfunc) {
		this.audio = _audio;
		this.initfunc = _initfunc;
		this.endfunc = _endfunc;
		if(this.audio) this.audio.addEventListener("ended", this.endfunc);
	}

	run() {
		this.audio.currentTime = 0;
		this.initfunc();
		if(this.audio) this.audio.play();
		else this.endfunc();
	}
}

function xxx(text) {
	console.log(text);
}

var SM = new StateManager(new State("root"));
SM.addState("second");
SM.getState("root").addChild("test", SM.getState("second"));
SM.getState("second").addChild("test2", SM.getState("root"));

var event1 = new Event("test", new Activity(document.getElementById('AUDIOWOOHOO'), function(){xxx('init activity')}, function(){xxx('testing activity1')}));
var event2 = new Event("test2", new Activity(document.getElementById('AUDIORICH'), function(){xxx('init null audio activity')}, function(){xxx('testing activity2')}));

SM.apply(event1);
SM.apply(event2);


//// IMPORTANT NOTE: Make sure the init function disables all buttons or we could have two events running that conflict with each other == bad race condition stuff.