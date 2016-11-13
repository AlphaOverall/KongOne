
class Script {
  constructor(name, path, defaultEnabled) {
    this.name = name;
    this.path = path;
    this.dom  = null;
    this.defaultEnabled = defaultEnabled;
  }

  checkPath() {
    let documentPath = document.location.pathname;
    return this.path.test(documentPath);
  }

  initialize() {
    this.dom = (typeof unsafeWindow === "undefined" ? window : unsafeWindow);

    if (!this.defaultEnabled && GM_getValue("onescript-" + this.name, "null") == "null") //never been touched before
        GM_setValue("onescript-" + this.name, "false");

    if (this.checkPath() && GM_getValue("onescript-" + this.name, "true") == "true") {
        console.log("[KongOne] Adding Script: " + this.name);
        this.run();
        this.added = true;
    }
  }

  run() {
    throw `run() not implemented for #{this.name} script`;
  }
}
