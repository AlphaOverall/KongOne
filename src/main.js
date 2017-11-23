//=require userscripts/*.js

(function main() {
    console.log("[KongOne] Initializing...");

    if (typeof GM_setValue === 'undefined') {
        window.GM_setValue = function(a, b) {
            localStorage.setItem(a, b);
        };
        window.GM_getValue = function(a, b) {
            let r = localStorage.getItem(a);
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
        new ChatLineHighlight(),
        new ReplyCommand(),
        new UsernameCompletion(),
        new ChatMouseoverTimestamp(),
        new AfkCommand(),
        new ChatCharacterLimit(),
        new KongreLink(),
        new ChatResizer(),
        new Kongquer(),
        new WhisperCatch(),
        new LargerAvatars(),
        new BetterQuotes(),
        new PostCount(),
        new LevelExtension(),
        new SpamIstTot(),
        new ImagePreview()
    ];

    optionsScript.scripts = scripts;

    scripts.map((script) => script.initialize());
})();
