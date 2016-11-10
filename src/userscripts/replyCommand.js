//=require ../holodeckScript.js

class ReplyCommand extends HolodeckScript {
    constructor() {
        super('Chat Reply-command', 'games', true);
    }

    run() {
        var dom = this.dom,
            CDialogue = dom.ChatDialogue;

        if (CDialogue) {

            CDialogue.prototype = dom.CDprototype || dom.ChatDialogue.prototype;
            if (!CDialogue.prototype.oldKeyPressReply) {

                CDialogue.prototype.oldKeyPressReply = CDialogue.prototype.onKeyPress;

                if (CDialogue.prototype.reply) {
                    CDialogue.prototype.oldreply = CDialogue.prototype.reply;
                } else {
                    CDialogue.prototype.oldreply = function(a) {};
                }
                CDialogue.prototype.reply = function(a) {
                    this._holodeck._reply = a;
                    this.oldreply(a);
                };

                if (!CDialogue.prototype.showReceivedPM) {
                    CDialogue.prototype.showReceivedPM = CDialogue.prototype.receivedPrivateMessage;
                    CDialogue.prototype.receivedPrivateMessage = function(a) {
                        if (a.data.success) {
                            this.reply(a.data.from);
                        }
                        this.showReceivedPM(a);
                    };
                }

                CDialogue.prototype.onKeyPress = function(a) {
                    var z, node = (this._input_node.wrappedJSObject || this._input_node);
                    if (a.which == 32 &&
                        ((a.currentTarget.selectionStart == 2 && (z = node.getValue().match(/^\/r(.*)/i))) ||
                            (z = node.getValue().match(/^\/r\b(.*)/i)))) {
                        var x = z[1] || "";
                        if (this._holodeck._reply) {
                            this.setInput("/w " + this._holodeck._reply + " " + x);
                        } else {
                            this.setInput("/w ");
                        }
                        if (a.stop) a.stop();
                        if (a.preventDefault) a.preventDefault();
                    }

                    this.oldKeyPressReply(a);
                };
            }
        }
    }

}
