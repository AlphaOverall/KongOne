//=require ../holodeckScript.js

class WhisperCatch extends HolodeckScript {

    constructor() {
        super.constructor('Whisper Catch', 'games', true);
    }

    run() {
        let dom = this.dom;
        let CDialogue = dom.ChatDialogue;

        holodeck.__wc_whisperCount = 0;
        CDialogue.prototype.__wc_receivedPrivateMessage = CDialogue.prototype.receivedPrivateMessage;
        CDialogue.prototype.receivedPrivateMessage = function(a) {
            this.__wc_receivedPrivateMessage(a);

            a.id = holodeck.__wc_whisperCount;

            let whispers = JSON.parse(localStorage.getItem(WhisperCatch.WHISPERS_SAVED_KEY)) || [];
            whispers.push(a);
            localStorage.setItem(WhisperCatch.WHISPERS_SAVED_KEY, JSON.stringify(whispers));
            setTimeout(this.removeWhisper, WhisperCatch.WHISPER_WAIT_TIME, a);
        };

        this.__wc_interval = setInterval(restoreWhispers, WhisperCatch.CHAT_DIALOGUE_RETRY);

        holodeck.addChatCommand('wctime', function(holodeck, str) {
            let args = str.split(' ').slice(1),
                time = parseInt(args[0]);

            if (!isNaN(time)) {
                localStorage.setItem(WhisperCatch.WHISPER_WAIT_TIME_KEY, time);
                holodeck.activeDialogue().displayUnsanitizedMessage("Kong Bot", "Whisper save time set to " + time + " seconds.", {
                    "class": "whisper received_whisper"
                }, {
                    non_user: true
                });
            }

            return false;
        });
    }

    restoreWhispers() {
        let chatDialogue = holodeck.activeDialogue(),
            whispers = JSON.parse(localStorage.getItem(WhisperCatch.WHISPERS_SAVED_KEY)) || [];

        if (!chatDialogue)
            return;

        while (whispers.length > 0) {
            let w = whispers.shift();
            chatDialogue.receivedPrivateMessage(w);
        }

        clearInterval(this.__wc_interval);
    }

    removeWhisper(w) {
        let whispers = (JSON.parse(localStorage.getItem(WhisperCatch.WHISPERS_SAVED_KEY)) || []).filter(function(o) {
            return o.id != w.id;
        });

        localStorage.setItem(WhisperCatch.WHISPERS_SAVED_KEY, JSON.stringify(whispers));
    }
}

WhisperCatch.WHISPERS_SAVED_KEY = "wc-whispers_saved";
WhisperCatch.WHISPER_WAIT_TIME_KEY = "wc-whisper_wait_time_key";
WhisperCatch.WHISPER_WAIT_TIME = 1000 * (parseInt(localStorage.getItem(WhisperCatch.WHISPER_WAIT_TIME_KEY) || 15));
WhisperCatch.CHAT_DIALOGUE_RETRY = 100;
