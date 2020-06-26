//=require ../holodeckScript.js

class UsernameCompletion extends HolodeckScript {
    constructor() {
        super('Chat Username-completion', /^\/games/, true, Script.CATEGORIES.CHAT);
    }

    run() {
        if (typeof ChatDialogue === "undefined" ||
            ChatDialogue.prototype.oldKeyPressTab) return;

        var isChrome = (navigator.appVersion.indexOf("Chrome") >= 0);
        if (isChrome) {
            ChatDialogue.prototype.initialize =
                ChatDialogue.prototype.initialize.wrap(function(old, p, i, h, u) {
                    old(p, i, h, u);
                    var self = this;
                    this._input_node.observe("keydown", function(event) {
                        if (event.keyCode != 9 || event.ctrlKey || event.altKey || event.metaKey) return;
                        self.onKeyPress(event);
                    });
                });
        }

        ChatDialogue.prototype.oldKeyPressTab = ChatDialogue.prototype.onKeyPress;
        ChatDialogue.prototype.tabcnt = 0;
        ChatDialogue.prototype.done = 1;
        ChatDialogue.prototype.onKeyPress = function(a) {
            if (a.keyCode != 9 || a.ctrlKey) {
                this.tabcnt = 0;
                this.done = 1;
                this.oldKeyPressTab(a);
                return;
            }

            var node = (this._input_node.wrappedJSObject || this._input_node);
            if (this.tabcnt === 0 && this.done == 1) {
                var inputText = node.getValue(),
                    spaceAtCaret = inputText.substr(0, node.selectionStart).lastIndexOf(' ');
                this._caretPos = node.selectionStart;
                this._start = inputText.substr(0, spaceAtCaret);
                if (this._start) this._start += " ";

                this._currentWord = inputText.substring(spaceAtCaret + 1, this._caretPos);
                this._rest = inputText.substr(this._caretPos);
            }
            this.done = 0;

            var userArray = this._holodeck.chatWindow().activeRoom()._users_list,
                possibleMatches = [],
                z = node.getValue();
            if (z.match(/\s+$/)) z = z.replace(/\s+$/, '');

            for (var i = 0; i < userArray.length; i++) {
                if (userArray[i].username.toLowerCase().indexOf(this._currentWord.toLowerCase()) === 0) {
                    possibleMatches.push(userArray[i].username);
                }
            }

            if (this.tabcnt < possibleMatches.length) {
                node.setValue(this._start + possibleMatches[this.tabcnt] + (this._start ? " " : ": ") + this._rest);
                node.selectionStart = this._caretPos + possibleMatches[this.tabcnt].length - this._currentWord.length + (this._start ? 1 : 2);
                node.selectionEnd = node.selectionStart;
                this.tabcnt += 1;
            } else {
                node.setValue(this._start + this._currentWord + this._rest);
                node.selectionStart = this._caretPos;
                node.selectionEnd = this._caretPos;
                this.tabcnt = 0;
            }
            if (a.stop) a.stop();
            if (a.preventDefault) a.preventDefault();
        };
    }
}
