var StateManager = function() {
	if(StateManager._instance) {
		return StateManager._instance;
	}
	this.currentState = new State("root");
	this.states = {};
	this.states["root"] = this.currentState;
	this.eventQueue = [];
	this.currentEvent = null;

	StateManager._instance = this;
	return StateManager._instance;
};

StateManager.getInstance = function() {
	return StateManager()._instance || new StateManager();
}

StateManager.addState = function(stateName) {
	states[stateName] = new State(stateName);
}

StateManager.getState = function(stateName) {
	return states[stateName];
}

StateManager.apply = function(event) {
	if(!currentEvent) {
		if(currentState.getChild(event.name)) {
			currentEvent = event;
			event.run();
			currentState = currentState.getChild(event.name);
		} else {
			console.log('This event is not a branch of the current state');
			console.log(currentState);
			console.log(event);
			StateManager.finishedEvent();
		}
	} else {
		eventQueue.push(event);
	}
}

StateManager.stop = function() {
	if(currentEvent) currentEvent.stop();
	currentEvent = null;
}

StateManager.pause = function() {
	if(currentEvent) currentEvent.pause();
}
StateManager.play = function() {
	if(currentEvent) currentEvent.play();
}

StateManager.finishedEvent = function() {
	currentEvent = null;
	if(eventQueue.length > 0) StateManager.apply(eventQueue.shift());
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

	stop() {
		this.activity.stop();
	}
	pause() {
		this.activity.pause();
	}
	play() {
		this.activity.play();
	}
}

class Activity {
	constructor(_audio, _initfunc, _endfunc) {
		this.audio = _audio;
		this.initfunc = _initfunc;
		this.endfunc = function() {
				_endfunc();
				StateManager.finishedEvent();
			}
		if(this.audio) this.audio.addEventListener("ended", this.endfunc);
	}

	run() {
		this.audio.currentTime = 0;
		this.initfunc();
		if(this.audio) this.audio.play();
		else this.endfunc();
	}

	stop() {
		if(this.audio) this.audio.pause();
		this.endfunc();
	}
	pause() {
		if(this.audio) this.audio.pause();
	}
	play() {
		if(this.audio) this.audio.play();
	}
}

function xxx(text) {
	console.log(text);
}

StateManager.getInstance();
StateManager.addState("second");
StateManager.getState("root").addChild("test", StateManager.getState("second"));
StateManager.getState("second").addChild("test2", StateManager.getState("root"));

var event1 = new Event("test", new Activity(document.getElementById('AUDIOWOOHOO'), function(){xxx('init activity')}, function(){xxx('testing activity1')}));
var event2 = new Event("test2", new Activity(document.getElementById('AUDIORICH'), function(){xxx('init null audio activity')}, function(){xxx('testing activity2')}));

StateManager.apply(event1);
StateManager.apply(event2);
setTimeout(function(){StateManager.pause();}, 600);
setTimeout(function(){StateManager.play();}, 800);
setTimeout(function(){StateManager.stop();}, 900);


//// IMPORTANT NOTE: Make sure the init function disables all buttons or we could have two events running that conflict with each other == bad race condition stuff.