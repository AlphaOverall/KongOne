//=require ../holodeckScript.js

class KongOneMessenger extends HolodeckScript {
    constructor() {
        // Call super
        super('this', /^\/games/, true);
        this.CHAT_BOT = "KOneBot";
        this.CHAT_LIMIT = 60000 / 8;
        this.messageList = [];
        this.interval = null;
        this.sending = false;
    }

    run() {
        holodeck._last_message = new Date(Date.now() - this.CHAT_LIMIT);
        holodeck.addOutgoingMessageFilter(function(msg, nextFunction) {
            holodeck._last_message = new Date();
            nextFunction(msg, nextFunction);
        });
    }

    queueMessage(type, data, dontforce) {
        this.messageList.push({ type: type, data: data, userAgent: navigator.userAgent });
        this.sending || this.sendMessage();
    }

    stackMessage(type, data, dontforce) {
        this.messageList.unshift({ type: type, data: data, userAgent: navigator.userAgent });
        this.sending || this.sendMessage();
    }

    sendMessage() {
        if (!holodeck._active_dialogue ||
            !holodeck._active_dialogue._user_manager ||
            !holodeck._active_dialogue._user_manager.sendPrivateMessage) {
            setTimeout(function() {
                this.sendMessage();
            }.bind(this), 500);
        }
        else if (this.messageList.length && new Date() - holodeck._last_message > this.CHAT_LIMIT) {
            var message = this.messageList.shift();
            holodeck._active_dialogue._user_manager.sendPrivateMessage(this.CHAT_BOT, JSON.stringify(
                {
                    type: message.type,
                    data: message.data,
                    userAgent: message.userAgent || navigator.userAgent
                }
            ));
            holodeck._last_message = new Date();
            this.sending = !!this.messageList.length;
            if (this.messageList.length) {
                this.timeout = setTimeout(function() {
                    this.sendMessage();
                }.bind(this), (holodeck._last_message - new Date()) + this.CHAT_LIMIT);
            }
        }
    }
}