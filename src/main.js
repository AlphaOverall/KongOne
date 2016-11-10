//=require userscripts/*.js

(function main() {
    console.log("KongOne Script running.");

    if (typeof GM_setValue === 'undefined') {
        window.GM_setValue = function(a, b) {
            localStorage.setItem(a, b);
        };
        window.GM_getValue = function(a, b) {
            var r = localStorage.getItem(a);
            return (r === null ? b : r);
        };
        window.GM_deleteValue = function(a) {
            localStorage.removeItem(a);
        };
    }

    let optionsScript = new ShowScriptOptions();
    let scripts = [
        optionsScript,
        new ChatTimestamp(),
        new PmNotifier(),
        new WhisperCatch()
    ];

    optionsScript.scripts = scripts;

    scripts.each((script) => script.initialize());

    // useScript("Chat Line Highlighting", "games", init_chatLineHighlighting, true, true);
    // useScript("Chat Reply-command", "games", init_replyCommand, true, true);
    // //useScript("Chat Reply-command (hotkey)", "games", init_replyHotkey, true, true);
    // useScript("Chat Username-completion", "games", init_usernameCompletion, true, true);
    // useScript("Chat Mouseover Timestamp", "games", init_chatMouseoverTimestamp, true, false);
    // useScript("Chat Afk Command", "games", init_afk, true, true);
    // useScript("Chat Character-limit", "games", init_chatCharacterLimit, true, true);
    // useScript("Chat KongreLink", "games", init_kongreLink, true, true);
    // //useScript("Chat Images", "games", init_chatImage, true, true);
    // useScript("Chat Resizer", "games", init_chatResizer, true, true);
    // useScript("Kongquer", "games", init_kongquer, true, true);
    // useScript("Whisper Catch", "games", init_whisperCatch, true, true);
})();
