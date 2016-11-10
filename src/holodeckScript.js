//=require script.js

class HolodeckScript extends Script {
  constructor(name, path, defaultEnabled) {
    super.constructor(name, path, defaultEnabled)
    this.holodeckCheckCounter = 0;
  }

  initialize() {
    this.holodeckCheckCounter++;
    
    if (typeof holodeck !== 'undefined' && holodeck.ready) {
      super.initialize();
      return;
    }

    if (this.holodeckCheckCounter > HolodeckScript.COUNTER_LIMIT) {
      console.log(`[KongOne] ${this.name} failed to load holodeck`);
      return;
    }

    setTimeout(() => this.initialize(), 100);
  }
}

HolodeckScript.COUNTER_LIMIT = 100;
