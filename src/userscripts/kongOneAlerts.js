//=require ../holodeckScript.js
//=require kongOneMessenger.js

class KongOneAlerts extends HolodeckScript {

    constructor() {
        // Call super
        super('this', /^\/games/, true);
    }

    run() {
        // Messenger to talk to bot. This makes sure we don't spam.
        let messenger = new KongOneMessenger();
        messenger.initialize();

        // Assign
        let CDialogue = this.dom.ChatDialogue;
        
        // Start event
        messenger.stackMessage("event", "enter");

        // Register leave event
        window.onbeforeunload = function() {
            messenger.stackMessage("event", "exit");
            return null;
        }

        // Save receivedPrivateMessage
        CDialogue.prototype.__koc_receivedPrivateMessage = CDialogue.prototype.receivedPrivateMessage;
        // Override receivedPrivateMessage to display special messages from bot
        CDialogue.prototype.receivedPrivateMessage = function(a) {
            let username = a.data.from,
                message = a.data.message;
            
            // Skip handling if not from bot
            if (username !== messenger.CHAT_BOT) {
                this.__koc_receivedPrivateMessage(a);
                return;
            }

            // Otherwise look for data from "server"
            try {
                let data = JSON.parse(message);
                if (data.type === "usercount") {
                    holodeck._active_dialogue.displayUnsanitizedMessage(
                        "Kong Bot", 
                        "There are " + data.data + " Kong One users online", 
                        { class:"whisper received_whisper" }, 
                        { non_user: true }
                    );
                } else if (data.type === "message") {
                    holodeck._active_dialogue.displayUnsanitizedMessage("Kong Bot", data.data, {}, {
                        non_user: true,
                        template: ChatDialogue.MOTD_MESSAGE_TEMPLATE
                    });
                } else if (data.type === "ping") {
                    // Ignore the message. This is the bot checking if we're online
                }
            }
            catch(e) {
                
            }
        };

        // Register error event handling (sent to bot and then to devs)
        window.onerror = function(message, file, line, col, error) {
            if (file) {
                messenger.queueMessage("error", message);
            }
        }

        // Add chat commands
        holodeck.addChatCommand("k1online", function(l, msg) {
            messenger.stackMessage("event", "usercount");
            return false;
        });
        holodeck.addChatCommand("k1message", function(l, msg) {
            messenger.stackMessage("message", msg.match(/\/k1message\s(.*)/)[1]);
            return false;
        })
        holodeck.addChatCommand("k1setmod", function(l, msg) {
            messenger.stackMessage("mod", msg.match(/\/k1setmod\s(.*)/)[1]);
            return false;
        });
        holodeck.addChatCommand("k1setadmin", function(l, msg) {
            messenger.stackMessage("admin", msg.match(/\/k1setadmin\s(.*)/)[1]);
            return false;
        });
        holodeck.addChatCommand("k1reload", function(l, msg) {
            messenger.stackMessage("reload", null);
            return false;
        });
    }
}