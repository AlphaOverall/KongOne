//=require ../holodeckScript.js

class KongOneAlerts extends HolodeckScript {

    constructor() {
        // Call super
        super('this', /^\/games/, true);
    }

    run() {
        // Constants
        const BOTNAME = "KOneBot";
        holodeck.sendKongOneMessage = function(type, data, userAgent) {
            // Quick hacky wait for sendPrivateMessage function
            function checkPM() {
                if (!holodeck._active_dialogue || 
                    !holodeck._active_dialogue._user_manager || 
                    !holodeck._active_dialogue._user_manager.sendPrivateMessage) {
                    setTimeout(checkPM, 500);
                } else {
                    // Send event
                    holodeck._active_dialogue._user_manager.sendPrivateMessage(BOTNAME, JSON.stringify(
                        {
                            type: type,
                            data: data,
                            userAgent: userAgent || navigator.userAgent
                        }
                    ));
                }
            } checkPM();
        }
        

        // Assign
        let CDialogue = this.dom.ChatDialogue;
        
        // Start event
        holodeck.sendKongOneMessage("event", "enter");
        // Register leave event
        window.addEventListener("unload", function() {
            holodeck.sendKongOneMessage("event", "exit");
        });

        // Save receivedPrivateMessage
        CDialogue.prototype.__koc_receivedPrivateMessage = CDialogue.prototype.receivedPrivateMessage;
        // Override receivedPrivateMessage to display special messages from bot
        CDialogue.prototype.receivedPrivateMessage = function(a) {
            let username = a.data.from,
                message = a.data.message;
            
            // Skip handling if not from bot
            if (username !== BOTNAME) {
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
                }
            }
            catch(e) {
                
            }
        };

        // Register error event handling (sent to bot and then to devs)
        window.onerror = function(message, file, line, col, error) {
            holodeck.sendKongOneMessage("error", message);
        }

        // Add chat commands
        holodeck.addChatCommand("k1online", function(l, msg) {
            holodeck.sendKongOneMessage("event", "usercount");
            return false;
        });
        holodeck.addChatCommand("k1message", function(l, msg) {
            holodeck.sendKongOneMessage("message", msg.match(/\/k1message\s(.*)/)[1], 1)
            return false;
        })
    }
}