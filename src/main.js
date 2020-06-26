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

    if (window.ChatDialogue) {
        ChatDialogue.prototype.initialize = ChatDialogue.prototype.initialize.wrap(
            function(old, parent_node, onInputFunction, holodeck, user_manager) {
            old(parent_node, onInputFunction, holodeck, user_manager);
            this._messages_until_next_collection = 0;
            this._holodeck = holodeck;
            this._user_manager = user_manager;
            this._parent_node = parent_node;
            this._messages_count = 0;
            this._insertion_count = 0;
            this._onInputFunction = onInputFunction;
        });
    }

    
    let optionsScript = new ShowScriptOptions();
    let scripts = [
        optionsScript,
        new VersionCheck(),
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
        new ThreadWatcher(),
        new SpamIstTot(),
        new ImagePreview(),
        new ChatLog(),
        new JoinChatRoom()
    ];

    optionsScript.scripts = scripts;

    scripts.map((script) => script.initialize());
})();
