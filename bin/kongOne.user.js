// ==UserScript==
// @name             Kongregate One Developer
// @namespace        profusiongames.com
// @author           UnknownGuardian, AlphaOverall, Ruudiluca, Resterman
// @version          2.0.2
// @date             04/19/2013
// @include          *://www.kongregate.com/*
// @description      Kongregate One - One script to rule them all. Everything here.
// @grant            GM_addStyle
// ==/UserScript==

"use strict";

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Script = function () {
    function Script(name, path, defaultEnabled) {
        _classCallCheck(this, Script);

        this.name = name;
        this.path = path;
        this.dom = null;
        this.defaultEnabled = defaultEnabled;
    }

    _createClass(Script, [{
        key: "checkPath",
        value: function checkPath() {
            var documentPath = document.location.pathname;
            return this.path.test(documentPath);
        }
    }, {
        key: "initialize",
        value: function initialize() {
            this.dom = typeof unsafeWindow === "undefined" ? window : unsafeWindow;

            if (!this.defaultEnabled && GM_getValue("onescript-" + this.name, "null") == "null") //never been touched before
                GM_setValue("onescript-" + this.name, "false");

            if (this.checkPath() && GM_getValue("onescript-" + this.name, "true") == "true") {
                console.log("[KongOne] Adding Script: " + this.name);
                this.run();
                this.added = true;
            }
        }
    }, {
        key: "run",
        value: function run() {
            throw "run() not implemented for #{this.name} script";
        }
    }]);

    return Script;
}();

var HolodeckScript = function (_Script) {
    _inherits(HolodeckScript, _Script);

    function HolodeckScript(name, path, defaultEnabled) {
        _classCallCheck(this, HolodeckScript);

        var _this = _possibleConstructorReturn(this, (HolodeckScript.__proto__ || Object.getPrototypeOf(HolodeckScript)).call(this, name, path, defaultEnabled));

        _this.holodeckCheckCounter = 0;
        return _this;
    }

    _createClass(HolodeckScript, [{
        key: "initialize",
        value: function initialize() {
            var _this2 = this;

            // Don't load script if incorrect path
            if (!this.checkPath()) return;

            // Load script
            this.holodeckCheckCounter++;

            if (typeof holodeck !== 'undefined' && holodeck.ready) {
                _get(HolodeckScript.prototype.__proto__ || Object.getPrototypeOf(HolodeckScript.prototype), "initialize", this).call(this);
                return;
            }

            if (this.holodeckCheckCounter > HolodeckScript.COUNTER_LIMIT) {
                console.log("[KongOne] " + this.name + " failed to load holodeck");
                return;
            }

            setTimeout(function () {
                return _this2.initialize();
            }, 100);
        }
    }]);

    return HolodeckScript;
}(Script);

HolodeckScript.COUNTER_LIMIT = 100;

var AfkCommand = function (_HolodeckScript) {
    _inherits(AfkCommand, _HolodeckScript);

    function AfkCommand() {
        _classCallCheck(this, AfkCommand);

        return _possibleConstructorReturn(this, (AfkCommand.__proto__ || Object.getPrototypeOf(AfkCommand)).call(this, 'Chat Afk Command', /^\/games/, true));
    }

    _createClass(AfkCommand, [{
        key: "run",
        value: function run() {
            var AUTOAFK = "kongregate_autoAFKTimeout";
            var AUTOAFK_MSG = "kongregate_autoAFKMessage";

            var dom = this.dom,
                holodeck = dom.holodeck,
                CDialogue = dom.ChatDialogue,
                CRoom = dom.ChatRoom,
                CWindow = dom.ChatWindow,
                Base64 = dom.Base64;

            if (holodeck && CDialogue) {
                CDialogue.prototype = dom.CDprototype || dom.ChatDialogue.prototype;
                CRoom.prototype = dom.CRprototype || dom.ChatRoom.prototype;
                CWindow.prototype = dom.CWprototype || dom.ChatWindow.prototype;

                if (!holodeck.__afk) {
                    holodeck.__afk = true;
                    if (!holodeck.setPresenceAwayOld) {
                        holodeck.setPresenceAwayOld = holodeck.setPresenceAway;
                        holodeck.setPresenceAway = function () {
                            this._afk = 1;
                            this.setPresenceAwayOld();
                        };
                    }
                    if (!holodeck.setPresenceChatOld) {
                        holodeck.setPresenceChatOld = holodeck.setPresenceChat;
                        holodeck.setPresenceChat = function () {
                            this._afk = 0;
                            this.setPresenceChatOld();
                        };
                    }

                    if (!CRoom.prototype.updateUserOld_AFK) {
                        CRoom.prototype.updateUserOld_AFK = CRoom.prototype.updateUser;
                        CRoom.prototype.updateUser = function (user) {
                            this.updateUserOld_AFK.apply(this, arguments);
                            if (user.username == this._chat_window.username()) {
                                if (this._presence != user.variables.presence) {
                                    switch (user.variables.presence) {
                                        case "chat":
                                            if (!this._chat_window._holodeck._afktoggle) this._chat_window._holodeck._afk = 0;
                                            break;
                                        case "away":
                                            this._chat_window._holodeck._afk = 1;
                                            break;
                                    }
                                }
                            }
                        };
                    }

                    holodeck._chat_commands.afk[0] = function (l, n) {
                        if (l._afk === 0) {
                            l.setPresenceAway();
                        } else {
                            l.setPresenceChat();
                        }
                        return false;
                    };
                    holodeck._chat_commands.back[0] = function (l, n) {
                        l.setPresenceChat();
                        return false;
                    };

                    holodeck.addChatCommand("afkmessage", function (l, n) {
                        var a = void 0;
                        var z = n.match(/^\/\S+\s+(.+)/);
                        if (z) {
                            a = z[1];
                            GM_setValue(AUTOAFK_MSG, a);
                            l._afkmessage = a;
                            l.activeDialogue().kongBotMessage("AFK-message set to: " + a);
                        } else {
                            l.activeDialogue().kongBotMessage("Current AFK-message: " + l._afkmessage);
                        }
                        return false;
                    });

                    holodeck.addChatCommand("afktoggle", function (l, n) {
                        if (l._afktoggle === 0) {
                            l._afktoggle = 1;
                            l.activeDialogue().kongBotMessage("Your AFK-flag won't get removed automatically");
                        } else {
                            l._afktoggle = 0;
                            l.activeDialogue().kongBotMessage("Your AFK-flag will be removed automatically");
                        }
                        return false;
                    });

                    holodeck.addChatCommand("autoafk", function (l, n) {
                        var match = n.match(/^\/autoafk\s+(\d+)/),
                            timeout = 15;

                        if (match && match[1]) {
                            timeout = parseInt(match[1], 10);
                        }

                        l._autoAFK = timeout * 60 * 1000;
                        window.setTimeout(function () {
                            GM_setValue(AUTOAFK, timeout);
                        }, 0);

                        if (l._autoAFKTimeout) {
                            clearTimeout(l._autoAFKTimeout);
                        }

                        if (timeout) {
                            l.activeDialogue().kongBotMessage("Set auto-AFK timeout to " + timeout + " minute" + (timeout > 1 ? "s" : ""));
                            l._autoAFKTimeout = setTimeout(function (a) {
                                a.setPresenceAway();
                            }, l._autoAFK, l);
                        } else {
                            l.activeDialogue().kongBotMessage("Disabled auto-AFK");
                        }

                        return false;
                    });

                    holodeck.checkAFK = function () {
                        if (!this._afktoggle) {
                            this._afk = 0;
                        }
                        if (this._autoAFKTimeout) {
                            clearTimeout(this._autoAFKTimeout);
                        }
                        if (this._autoAFK) {
                            this._autoAFKTimeout = setTimeout(function (a) {
                                a.setPresenceAway();
                            }, this._autoAFK, this);
                        }
                    };

                    holodeck.addOutgoingMessageFilter(function (message, nextFunction) {
                        holodeck.checkAFK();
                        nextFunction(message, nextFunction);
                    });

                    // Outgoing whispers aren't filtered (yet), so check them manually...
                    if (!CWindow.prototype.oldSendPrivateMessageAFK) {
                        CWindow.prototype.oldSendPrivateMessageAFK = CWindow.prototype.sendPrivateMessage;
                        CWindow.prototype.sendPrivateMessage = function (user, msg) {
                            if (msg.indexOf(this._holodeck._afkprefix) !== 0) {
                                this._holodeck.checkAFK();
                            }
                            this.oldSendPrivateMessageAFK(user, msg);
                        };
                    }

                    // Create setTimeout on session reconnect
                    if (!CWindow.prototype.onLoginOldAFK) {
                        CWindow.prototype.onLoginOldAFK = CWindow.prototype.onLogin;
                        CWindow.prototype.onLogin = function () {
                            this.onLoginOldAFK();
                            if (this._holodeck._afk) {
                                this._holodeck.setPresenceAway();
                            } else {
                                this._holodeck.setPresenceChat();
                                this._holodeck.checkAFK();
                            }
                        };
                    }

                    if (!CDialogue.prototype.reply) {
                        CDialogue.prototype.reply = function (a) {};
                    }

                    if (!CDialogue.prototype.showReceivedPM) {
                        CDialogue.prototype.showReceivedPM = CDialogue.prototype.receivedPrivateMessage;
                    }

                    CDialogue.prototype.receivedPrivateMessage = function (a) {
                        this.showReceivedPM(a);
                        if (a.data.success) {
                            this.reply(a.data.from);
                            if (this._holodeck._afk && Base64.decode(a.data.message).indexOf(this._holodeck._afkprefix) !== 0) {
                                this.sendPrivateMessage(a.data.from, this._holodeck._afkprefix + this._holodeck._afkmessage);
                            }
                        }
                    };

                    holodeck._afk = 0;

                    holodeck._afktoggle = 0;

                    holodeck._afkmessage = GM_getValue(AUTOAFK_MSG, "I am currently AFK");

                    holodeck._afkprefix = "[AFK] ";

                    var autoAFK = 15;

                    try {
                        if (GM_setValue) {
                            autoAFK = GM_getValue(AUTOAFK, 15);
                        } else {
                            GM_setValue = function GM_setValue(a, b) {};
                        }
                    } catch (e) {
                        GM_setValue = function GM_setValue(a, b) {};
                    }

                    holodeck._autoAFK = autoAFK * 60 * 1000;
                    if (holodeck._autoAFK > 0) {
                        holodeck._autoAFKTimeout = setTimeout(function (a) {
                            a.setPresenceAway();
                        }, holodeck._autoAFK, holodeck);
                    }
                }
            }
        }
    }]);

    return AfkCommand;
}(HolodeckScript);

//=require ../script.js

var BetterQuotes = function (_Script2) {
    _inherits(BetterQuotes, _Script2);

    function BetterQuotes() {
        _classCallCheck(this, BetterQuotes);

        return _possibleConstructorReturn(this, (BetterQuotes.__proto__ || Object.getPrototypeOf(BetterQuotes)).call(this, 'Better Quotes', /\/(topics|posts)/, true));
    }

    _createClass(BetterQuotes, [{
        key: "run",
        value: function run() {
            // Make sure $ is jQuery. Kongregate should load jQuery by default
            // But has weird $ assignment
            var $ = jQuery;

            //Add styles
            GM_addStyle("\n      .expandQuote {\n        text-align: center;\n        background-color: #9A7;\n        color: #EFC;\n        font-style: italic;\n        margin-top: -1px;\n        -webkit-border-bottom-right-radius: 5px;\n        -webkit-border-bottom-left-radius: 5px;\n        -moz-border-radius-bottomright: 5px;\n        -moz-border-radius-bottomleft: 5px;\n        border-bottom-right-radius: 5px;\n        border-bottom-left-radius: 5px;\n        -webkit-touch-callout: none;\n        -webkit-user-select: none;\n        -khtml-user-select: none;\n        -moz-user-select: none;\n        -ms-user-select: none;\n        user-select: none;\n        cursor:pointer;\n      }");

            GM_addStyle("\n    .posts .post .body blockquote {\n      overflow:hidden;\n      display: block;\n    }\n    ");

            GM_addStyle(".forum--entry blockquote { margin: 0px; }"); //Fixes Kongregate's dodgy quote padding.

            //Begin script
            var quoteTotal = 0;

            function addBetterQuotes() {
                var quotes = document.querySelectorAll(".rendered_post > blockquote");

                var _iteratorNormalCompletion = true;
                var _didIteratorError = false;
                var _iteratorError = undefined;

                try {
                    for (var _iterator = quotes[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                        var quote = _step.value;

                        //Create the button
                        if ($(quote).height() > 205) {
                            quoteTotal++;
                            var qB = document.createElement("div");
                            qB.innerHTML = "Read more...";
                            qB.className = "expandQuote";
                            $(qB).prop = ("disabled", true);
                            var sB = document.createElement("span"); //stops 'closest' from getting confused
                            $(quote).after(sB);
                            $(quote).after(qB);

                            $(quote).find("blockquote").find("blockquote").remove();

                            //Insert fake quote
                            var fQ = document.createElement("blockquote");
                            fQ.className = "fakeQuote";
                            fQ.innerHTML = "[quote]";
                            $(fQ).css("margin", "5px 0px 5px 0px");

                            var hQ = $(quote).find("blockquote");
                            $(hQ).attr("class", "hiddenQuote");
                            $(hQ).css("display", "none");
                            $(hQ).before(fQ);

                            //Remove read more button if necessary
                            if ($(quote).height() <= 195) {
                                $(quote).closest(".expandQuote").remove();
                            } else {
                                $(quote).height(200);
                            }
                        }
                    }

                    //When the user clicks the expand button
                } catch (err) {
                    _didIteratorError = true;
                    _iteratorError = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion && _iterator.return) {
                            _iterator.return();
                        }
                    } finally {
                        if (_didIteratorError) {
                            throw _iteratorError;
                        }
                    }
                }

                $(".expandQuote").click(function () {
                    var state = $(this).data('state');
                    var dQ = $(this).prev();
                    if (!state) {
                        $(this).html("Read less...");
                        $(this).data('state', true);

                        //toggle quotes
                        dQ.find(".fakeQuote").css("display", "none");
                        dQ.find(".hiddenQuote").css("display", "inherit");

                        //toggle size
                        $(dQ).css("height", "auto");
                    } else {
                        $(this).html("Read more...");
                        $(this).data('state', false);

                        //toggle quotes
                        dQ.find(".fakeQuote").css("display", "inherit");
                        dQ.find(".hiddenQuote").css("display", "none");

                        //toggle size
                        $(dQ).css("height", dQ[0].scrollHeight + "px");
                        if ($(dQ).height() > 200) {
                            $(dQ).css("height", "200px");
                        }
                    }
                });
            }

            var loadCheck = setInterval(function () {
                if (document.getElementsByClassName('rendered_post').length > 0) {
                    addBetterQuotes();
                }
                if (quoteTotal > 0) {
                    clearInterval(loadCheck);
                }
            }, 100);
        }
    }]);

    return BetterQuotes;
}(Script);

//=require ../holodeckScript.js

var ChatCharacterLimit = function (_HolodeckScript2) {
    _inherits(ChatCharacterLimit, _HolodeckScript2);

    function ChatCharacterLimit() {
        _classCallCheck(this, ChatCharacterLimit);

        return _possibleConstructorReturn(this, (ChatCharacterLimit.__proto__ || Object.getPrototypeOf(ChatCharacterLimit)).call(this, 'Chat Character-limit', /^\/games/, true));
    }

    _createClass(ChatCharacterLimit, [{
        key: "run",
        value: function run() {
            var dom = this.dom,
                CDialogue = dom.ChatDialogue;

            if (CDialogue) {
                CDialogue.prototype = dom.CDprototype || dom.ChatDialogue.prototype;

                if (!CDialogue.prototype.oldKeyPressLimit) {
                    CDialogue.prototype.oldKeyPressLimit = CDialogue.prototype.onKeyPress;
                    CDialogue.prototype.onKeyPress = function (a) {
                        var node = this._input_node.wrappedJSObject || this._input_node;
                        this.oldKeyPressLimit(a);
                        if (node.getValue().length > 249) {
                            z = node.getValue();
                            var y = "";
                            var n = z.match(/^(\/\S+\s+\S*\s*)(.*)/);
                            if (n) {
                                y = n[2];
                                if (y.length > 249) {
                                    node.setValue(n[1] + y.substr(0, 249));
                                }
                            } else {
                                node.setValue(node.getValue().substr(0, 249));
                            }
                        }
                    };
                }
            }
        }
    }]);

    return ChatCharacterLimit;
}(HolodeckScript);

//=require ../holodeckScript.js

var ChatLineHighlight = function (_HolodeckScript3) {
    _inherits(ChatLineHighlight, _HolodeckScript3);

    function ChatLineHighlight() {
        _classCallCheck(this, ChatLineHighlight);

        return _possibleConstructorReturn(this, (ChatLineHighlight.__proto__ || Object.getPrototypeOf(ChatLineHighlight)).call(this, 'Chat Line Highlight', /^\/games/, true));
    }

    _createClass(ChatLineHighlight, [{
        key: "run",
        value: function run() {
            var dom = this.dom,
                holodeck = dom.holodeck,
                CDialogue = dom.ChatDialogue,
                CRoom = dom.ChatRoom,
                CWindow = dom.ChatWindow;

            if (CRoom && CDialogue) {
                CDialogue.prototype = dom.CDprototype || dom.ChatDialogue.prototype;
                CRoom.prototype = dom.CRprototype || dom.ChatRoom.prototype;
                CWindow.prototype = dom.CWprototype || dom.ChatWindow.prototype;

                if (!CDialogue.prototype.searchWord) {
                    if (!String.prototype.trim) {
                        String.prototype.trim = function () {
                            return this.replace(/^\s+/, "").replace(/\s+$/, "");
                        };
                    }

                    CDialogue.prototype.searchWord = function (a, b) {
                        for (var i = 0; i < b.length; i++) {
                            var r = b[i].replace(/(\/|\.|\*|\+|\?|\||\(|\)|\[|\]|\{|\}|\\)/g, '\\$1'),
                                reg = new RegExp("\\b" + r + "\\b");
                            if (reg.test(a)) return true;
                        }
                        return false;
                    };

                    CDialogue.prototype.searchUser = function (a) {
                        return this.searchWord(a, this._holodeck._hluser);
                    };

                    CDialogue.prototype.searchText = function (a) {
                        var l = this._holodeck,
                            z = l._highlighting.concat([l._username.toLowerCase()]);
                        return this.searchWord(a, z);
                    };

                    CWindow.prototype.hlFriend = function (a) {
                        return this._holodeck._hl_friends && this.isFriend(a);
                    };

                    CWindow.prototype.hlMod = function (a) {
                        if (!this._holodeck._hl_mods) return;

                        return this._rooms.any(function (roomArr) {
                            var room = roomArr[1];
                            var user = room.user(a);
                            return user && room.canUserModerate(user);
                        });
                    };

                    CWindow.prototype.friendOrMod = function (a) {
                        if (a.toLowerCase() == this._holodeck._username.toLowerCase()) return "";

                        var colors = [];
                        if (this.hlMod(a)) colors.push(" hlmod");
                        if (this.hlFriend(a)) colors.push(" hlfriend");
                        if (colors.length > 1) return colors[this._holodeck._hl_priority];

                        return colors[0] || "";
                    };

                    CDialogue.prototype.displayUnsanitizedMessageOldHighlight = CDialogue.prototype.displayUnsanitizedMessage;

                    CDialogue.prototype.displayUnsanitizedMessage = function (user, msg, attributes, options) {
                        if (!attributes) attributes = {};
                        var classes = attributes["class"] || "";
                        var isWhisper = classes.indexOf("whisper") >= 0;

                        if (!(options && options["private"])) classes += this._user_manager.friendOrMod(user.toLowerCase());

                        if (!isWhisper && !this._user_manager.isMuted(user.toLowerCase()) && (this.searchUser(user.toLowerCase()) || this.searchText(msg.toLowerCase()))) {
                            classes += " highlight";
                            if (typeof this.new_private_message === "function") {
                                var oldChime = holodeck._pm_chime;
                                holodeck._pm_chime = holodeck._hl_chime;
                                this.new_private_message();
                                holodeck._pm_chime = oldChime;
                            }
                        }

                        attributes["class"] = classes;

                        this.displayUnsanitizedMessageOldHighlight(user, msg, attributes, options);
                    };

                    holodeck.addChatCommand("highlight", function (l, n) {
                        var k = n.match(/^\/\S+\s+(.+)/),
                            z = "";
                        k && (z = k[1]);
                        if (z) {
                            z = z.replace(/\s+/g, ' ').trim();
                            window.setTimeout(function () {
                                GM_setValue("kong_highlighting", z.toLowerCase());
                            }, 0);
                            l.activeDialogue().kongBotMessage("Now highlighting: " + z + " " + l._username);
                            l._highlighting = z.toLowerCase().split(' ');
                        }
                        return false;
                    });

                    holodeck.addChatCommand("hluser", function (l, n) {
                        var k = n.match(/^\/\S+\s+(.+)/),
                            z = "";
                        k && (z = k[1]);
                        if (z) {
                            z = z.replace(/\s+/g, ' ').trim();
                            window.setTimeout(function () {
                                GM_setValue("kong_highlightuser", z.toLowerCase());
                            }, 0);
                            l.activeDialogue().kongBotMessage("Now highlighting user(s): " + z);
                            l._hluser = z.toLowerCase().split(' ');
                        }
                        return false;
                    });

                    var generateCallback = function generateCallback(name, stop, start) {
                        return function (l, n) {
                            if (l["_hl_" + name]) {
                                l["_hl_" + name] = 0;
                                l.activeDialogue().kongBotMessage(stop || "Stopped highlighting messages by " + name);
                            } else {
                                l["_hl_" + name] = 1;
                                l.activeDialogue().kongBotMessage(start || "Now highlighting messages by " + name);
                            }
                            window.setTimeout(function () {
                                GM_setValue("kong_highlight" + name, l["_hl_" + name]);
                            }, 0);
                            return false;
                        };
                    };

                    holodeck.addChatCommand("hlmods", generateCallback("mods"));
                    holodeck.addChatCommand("hlfriends", generateCallback("friends"));
                    holodeck.addChatCommand("hlchime", generateCallback("chime", "Stopped playing the chime for highlighted messages", "Now playing the chime for highlighted messages"));
                    holodeck.addChatCommand("hlpriority", generateCallback("priority", "Now prioritizing mods over friends", "Now prioritizing friends over mods"));

                    var generateColorCallback = function generateColorCallback(selector, rule, name, text, max) {
                        if (!max) max = 1;
                        return function (l, n) {
                            var k = n.match(/^\/\S+\s+#?([0-9a-f]{6})/i),
                                z = "",
                                count = 0;
                            if (k) z = "#" + k[1];
                            if (z) {
                                var f = function f() {
                                    return GM_setValue("kong_" + name, z);
                                };
                                for (var i = 0; i < sheet.cssRules.length; i++) {
                                    if (sheet.cssRules[i].selectorText.indexOf(selector) === 0) {
                                        sheet.cssRules[i].style.setProperty(rule, z, "important");
                                        if (++count == max) {
                                            window.setTimeout(f, 0);
                                            l.activeDialogue().kongBotMessage("New " + (text || name) + ": " + z);
                                            return false;
                                        }
                                    }
                                }
                            } else {
                                l.activeDialogue().kongBotMessage("No valid color! Format is /" + name + " XXXXXX (X = hex character)");
                            }
                            return false;
                        };
                    };

                    holodeck.addChatCommand("whispercolor", generateColorCallback("#kong_game_ui .chat_message_window .whisper", "background-color", "whispercolor"));

                    holodeck.addChatCommand("friendcolor", generateColorCallback("#kong_game_ui .chat_message_window .hlfriend span.chat_message_window_username", "color", "friendcolor"));

                    holodeck.addChatCommand("hlcolor", generateColorCallback("#kong_game_ui .chat_message_window .highlight", "background-color", "hlcolor", "highlighting-color", 2));

                    holodeck.addChatCommand("modcolor", generateColorCallback("#kong_game_ui .chat_message_window .hlmod span.chat_message_window_username", "color", "modcolor"));

                    holodeck.addChatCommand("hllist", function (l, n) {
                        var diag = l.activeDialogue();

                        function botMessage(msg) {
                            diag.displayUnsanitizedMessage("Kong Bot", msg, {
                                "class": "whisper received_whisper"
                            }, {
                                non_user: true
                            });
                        }

                        botMessage("Current highlighting settings:");

                        if (holodeck._hluser.length > 0) {
                            botMessage('Users:');
                            botMessage('Users: ' + holodeck._hluser.map(function (user) {
                                return ['<a href="#" onclick="holodeck.showMiniProfile(\'', user, '\'); return false;">', user, '</a>'].join("");
                            }).join(" "));
                        } else {
                            botMessage("No users highlighted");
                        }

                        if (holodeck._highlighting.length > 0) {
                            botMessage('Words: ' + holodeck._highlighting.join(" "));
                        } else {
                            botMessage("No words highlighted");
                        }

                        botMessage('Highlight color: <span style="color: ' + color + '">' + color + '</span>');
                        botMessage('Whisper color: <span style="color: ' + wcolor + '">' + wcolor + '</span>');

                        botMessage("Highlighting friends: " + (holodeck._hl_friends ? "Yes" : "No") + ' (color: <span style="color: ' + fcolor + '">' + fcolor + '</span>)');
                        botMessage("Highlighting mods: " + (holodeck._hl_mods ? "Yes" : "No") + ' (color: <span style="color: ' + mcolor + '">' + mcolor + '</span>)');

                        botMessage("Highlight priority: " + (holodeck._hl_priority ? "Friends over mods" : "Mods over friends"));
                        botMessage("Playing chime: " + (holodeck._hl_chime ? typeof holodeck._pm_chime !== "undefined" ? "Yes" : 'No, <a href="http://userscripts.org/scripts/show/65622">script</a> not installed' : "No"));
                        return false;
                    });

                    holodeck.addChatCommand("hlreset", function (l, n) {
                        var diag = l.activeDialogue();
                        diag.kongBotMessage("Resetting all highlighting preferences");

                        holodeck._chat_commands.hlcolor[0](holodeck, "/color #def6ea");
                        holodeck._chat_commands.whispercolor[0](holodeck, "/color #deeaf6");
                        holodeck._chat_commands.friendcolor[0](holodeck, "/color #006600");
                        holodeck._chat_commands.modcolor[0](holodeck, "/color #ba6328");
                        holodeck._hl_priority = 1;
                        holodeck._hl_friends = 1;
                        holodeck._hl_mods = 1;
                        holodeck._hl_chime = 1;
                        holodeck._highlighting = [];
                        holodeck._hluser = [];

                        ["highlighting", "highlightuser", "hlcolor", "whispercolor", "friendcolor", "modcolor", "highlightfriends", "highlightpriority", "highlightmods", "highlightchime"].forEach(function (pref) {
                            window.setTimeout(function () {
                                GM_deleteValue("kong_" + pref);
                            }, 0);
                        });

                        return false;
                    });

                    holodeck._chat_commands.hl = holodeck._chat_commands.highlight;
                    holodeck._chat_commands.hlfriend = holodeck._chat_commands.hlfriends;

                    holodeck._highlighting = [];
                    holodeck._hluser = [];

                    var color = "#def6ea",
                        wcolor = "#deeaf6",
                        fcolor = "#006600",
                        mcolor = "#ba6328",
                        priority = 1,
                        friends = 1,
                        mods = 1,
                        chime = 1;

                    if (typeof GM_setValue !== "function") {
                        GM_setValue = GM_getValue = function GM_getValue() {};
                    } else {
                        // migrate old value
                        var temp = GM_getValue("kong_highlightcolor", "");
                        if (temp) {
                            GM_setValue("kong_hlcolor", temp);
                            if (typeof GM_deleteValue === "undefined") {
                                GM_setValue("kong_highlightcolor", "");
                            } else {
                                GM_deleteValue("kong_highlightcolor");
                            }
                        }

                        var list = GM_getValue("kong_highlighting"),
                            user = GM_getValue("kong_highlightuser");
                        color = GM_getValue("kong_hlcolor", "#def6ea") || "#def6ea";
                        wcolor = GM_getValue("kong_whispercolor", "#deeaf6") || "#deeaf6";
                        fcolor = GM_getValue("kong_friendcolor", "#006600") || "#006600";
                        mcolor = GM_getValue("kong_modcolor", "#ba6328") || "#ba6328";
                        friends = GM_getValue("kong_highlightfriends", 1);
                        priority = GM_getValue("kong_highlightpriority", 1);
                        mods = GM_getValue("kong_highlightmods", 1);
                        chime = GM_getValue("kong_highlightchime", 1);
                        if (list) {
                            holodeck._highlighting = list.trim().split(' ');
                        }
                        if (user) {
                            holodeck._hluser = user.trim().split(' ');
                        }
                    }

                    holodeck._hl_friends = friends;
                    holodeck._hl_mods = mods;
                    holodeck._hl_chime = chime;
                    holodeck._hl_priority = priority;

                    // guarantee we have a non-crossdomain stylesheet
                    var style = document.createElement("style");
                    var head = document.getElementsByTagName("head")[0];
                    (head || document.body).appendChild(style);

                    // now find it...
                    var sheet = null;
                    for (var s = document.styleSheets.length - 1; s >= 0; --s) {
                        try {
                            if (document.styleSheets[s].cssRules && document.styleSheets[s].cssRules.length) {
                                sheet = document.styleSheets[s];
                                break;
                            }
                        } catch (e) {/* no-op */}
                    }

                    if (!sheet) {
                        alert("Kongregate Chat Line Highlighting could not find a style sheet!\nPlease send a message to Ventero about this problem.");
                        return;
                    }

                    sheet.insertRule('#kong_game_ui .chat_message_window .whisper { background-color: ' + wcolor + ' !important; }', sheet.cssRules.length);
                    sheet.insertRule('#kong_game_ui .chat_message_window .highlight.even { background-color: ' + color + ' !important; }', sheet.cssRules.length);
                    sheet.insertRule('#kong_game_ui .chat_message_window .highlight { background-color: ' + color + ' !important; }', sheet.cssRules.length);
                    sheet.insertRule('#kong_game_ui .chat_message_window .hlfriend span.chat_message_window_username { color: ' + fcolor + ' !important; }', sheet.cssRules.length);
                    sheet.insertRule('#kong_game_ui .chat_message_window .hlmod span.chat_message_window_username { color: ' + mcolor + ' !important; }', sheet.cssRules.length);
                }
            }
        }
    }]);

    return ChatLineHighlight;
}(HolodeckScript);

//=require ../holodeckScript.js

var ChatMouseoverTimestamp = function (_HolodeckScript4) {
    _inherits(ChatMouseoverTimestamp, _HolodeckScript4);

    function ChatMouseoverTimestamp() {
        _classCallCheck(this, ChatMouseoverTimestamp);

        return _possibleConstructorReturn(this, (ChatMouseoverTimestamp.__proto__ || Object.getPrototypeOf(ChatMouseoverTimestamp)).call(this, 'Chat Mouseover Timestamp', /^\/games/, false));
    }

    _createClass(ChatMouseoverTimestamp, [{
        key: "run",
        value: function run() {
            var dom = this.dom,
                holodeck = dom.holodeck,
                ChatDialogue = dom.ChatDialogue,
                $ = dom.$;

            function injectMouseover(dom, $, holodeck, ChatDialogue) {
                var message_rollover_template = new dom.Element("div", {
                    id: "message_rollover_template",
                    "class": "user_rollover_container spritesite",
                    style: "display: none"
                });
                var message_rollover = new dom.Element("div", {
                    "class": "user_rollover spritesite"
                });
                var message_rollover_inner = new dom.Element("div", {
                    "class": "user_rollover_inner"
                });
                var rollover_private_message_holder = new dom.Element("p", {
                    "class": "rollover_message_private_message_link_message_link_holder"
                });
                var rollover_private_message_link = new dom.Element("a", {
                    id: "rollover_message_private_message_link",
                    "class": "rollover_message_private_message_link",
                    href: "#"
                }).update("Private Message");
                rollover_private_message_holder.appendChild(rollover_private_message_link);
                var rollover_time_text = new dom.Element("p", {
                    id: "rollover_time_text"
                });
                message_rollover_inner.appendChild(rollover_time_text);
                message_rollover_inner.appendChild(rollover_private_message_holder);
                message_rollover.appendChild(message_rollover_inner);
                message_rollover_template.appendChild(message_rollover);
                $('chat_tab_pane').appendChild(message_rollover_template);

                var MessageRollover = dom.MessageRollover = function (chat_dialogue) {
                    this.initialize(chat_dialogue);
                    return this;
                };

                MessageRollover.prototype = {
                    initialize: function initialize(chat_dialogue) {
                        this._active_dialogue = chat_dialogue;
                        this._holodeck = chat_dialogue._holodeck;
                        this._rollover_template_node = $('message_rollover_template');
                        this._private_message_node = $('rollover_message_private_message_link');
                        this._time_node = $('rollover_time_text');

                        this._private_message_observer = function () {};

                        if (this._rollover_template_node) {
                            var rollover = this;
                            this._rollover_template_node.observe('mouseover', function (event) {
                                rollover.stopHide();
                                dom.Event.stop(event);
                            });
                            this._rollover_template_node.observe('mouseout', function (event) {
                                rollover.beginHide();
                                dom.Event.stop(event);
                            });
                        }
                    },
                    show: function show(time, user, event) {
                        if (this._hideTimer) clearTimeout(this._hideTimer);
                        this.updatePrivateMessageLink(user);
                        this.updateTimeText(time);
                        this.setRolloverPosition(event);
                        this._rollover_template_node.show();
                    },
                    setRolloverPosition: function setRolloverPosition(event) {
                        var messagenode = event.target;
                        var current_scroll_top = this._active_dialogue._message_window_node.scrollTop;
                        var current_message_top = messagenode.positionedOffset()[1];
                        // nudge the user rollover up a little
                        current_message_top = current_message_top - 9;

                        var new_top_val = current_message_top;
                        if (current_scroll_top < current_message_top) {
                            new_top_val = current_message_top - current_scroll_top;
                        }

                        var top_style_str = new_top_val + 'px';
                        this._rollover_template_node.setStyle({
                            top: top_style_str
                        });

                        // set left position based on username length
                        var username_width = messagenode.getWidth();
                        var new_left_val = 20 + username_width;

                        var left_style_str = new_left_val + 'px';
                        this._rollover_template_node.setStyle({
                            left: left_style_str
                        });
                    },

                    updatePrivateMessageLink: function updatePrivateMessageLink(username) {
                        var cw = this._holodeck.chatWindow();
                        // replace observer
                        this._private_message_node.stopObserving('click');
                        this._private_message_observer = dom.CapturesToInlineRegistration.decorate(function (event) {
                            // just put /w <username> in the chat input field
                            cw.insertPrivateMessagePrefixFor(username);
                            dom.Event.stop(event);
                            return false;
                        });
                        this._private_message_node.observe('click', this._private_message_observer);
                    },
                    updateTimeText: function updateTimeText(time) {
                        this._time_node.innerHTML = time;
                    },
                    beginHide: function beginHide() {
                        var rollover = this;
                        if (this._hideTimer) {
                            clearTimeout(this._hideTimer);
                        }
                        this._hideTimer = setTimeout(function () {
                            rollover.hide();
                        }, 500);
                    },
                    stopHide: function stopHide() {
                        clearTimeout(this._hideTimer);
                    },
                    hide: function hide() {
                        this._rollover_template_node.hide();
                    }
                };

                ChatDialogue.MESSAGE_TEMPLATE.template = '<p class="#{classNames}"><span username="#{username}" time="#{time}" class="username #{userClassNames}">#{prefix}#{username}</span><span class="separator">: </span><span class="message">#{message}</span><span class="clear"></span></p>';
                ChatDialogue.MESSAGE_TEMPLATE.old_evaluate = ChatDialogue.MESSAGE_TEMPLATE.evaluate;
                ChatDialogue.MESSAGE_TEMPLATE.evaluate = function (args) {
                    var date = new Date();
                    var hours = date.getHours();
                    var minutes = date.getMinutes();
                    var seconds = date.getSeconds();
                    var time;
                    if (holodeck._timeFormat == 12) {
                        time = (hours < 10 ? hours === 0 ? "12" : "0" + hours : hours > 12 ? hours > 21 ? hours - 12 : "0" + (hours - 12) : hours) + ":" + (minutes < 10 ? "0" : "") + minutes + ":" + (seconds < 10 ? "0" : "") + seconds + (hours > 11 ? " PM" : " AM"); // 12-hour clock
                    } else {
                        time = (hours < 10 ? "0" : "") + hours + ":" + (minutes < 10 ? "0" : "") + minutes + ":" + (seconds < 10 ? "0" : "") + seconds; //24-hour clock
                    }
                    args.time = time;
                    return this.old_evaluate(args);
                };

                ChatDialogue.prototype.initialize = ChatDialogue.prototype.initialize.wrap(function (old, parent_node, onInputFunction, holodeck, user_manager) {
                    old(parent_node, onInputFunction, holodeck, user_manager);
                    //var self = this;
                    //this._input_node.observe("keydown", function(event) {
                    //	if(event.keyCode != 9 || event.ctrlKey || event.altKey || event.metaKey) return;
                    //	self.onKeyPress(event);
                    //});
                    //})
                    //ChatDialogue.prototype.initialize = function(parent_node, onInputFunction, holodeck, user_manager) {
                    this._messages_until_next_collection = 0;
                    this._holodeck = holodeck;
                    this._user_manager = user_manager;
                    this._parent_node = parent_node;
                    this._messages_count = 0;
                    this._insertion_count = 0;
                    this._onInputFunction = onInputFunction;
                    this._message_rollover_manager = new MessageRollover(this);

                    // Establish references to re-used nodes
                    this._message_window_node = parent_node.down('.chat_message_window');
                    this._input_node = parent_node.down('.chat_input');

                    this._messages_to_retain = 200;

                    this._message_window_node.stopObserving();

                    this._message_window_node.observe('mouseover', function (event) {
                        var time = event.target.getAttribute("time"),
                            user = event.target.getAttribute("username");
                        if (time) {
                            holodeck.activeDialogue().showMessageRollover(time, user, event);
                            dom.Event.stop(event);
                        }
                    });

                    this._message_window_node.observe('mouseout', function (event) {
                        holodeck.activeDialogue().hideMessageRollover();
                        dom.Event.stop(event);
                    });

                    // Bind event listeners
                    var dialogue = this,
                        input_node = this._input_node;
                    this._input_node.observe('keypress', function (event) {
                        dialogue.onKeyPress(event);
                    });
                    this._input_node.observe('focus', function (event) {
                        dialogue.clearPrompt();
                    });

                    // Trigger mini-profile for clicks on usernames in chat.
                    this._message_window_node.observe('click', function (event) {
                        if (event.target) {
                            var username = event.target.getAttribute('username');
                            if (username) {
                                event.stop();
                                user_manager.showProfile(username);
                            }
                        }
                    });
                });

                ChatDialogue.prototype.showMessageRollover = function (time, user, event) {
                    this._message_rollover_manager.show(time, user, event);
                };

                ChatDialogue.prototype.hideMessageRollover = function () {
                    this._message_rollover_manager.beginHide();
                };
            }

            if (holodeck && ChatDialogue) {
                if (!ChatDialogue.prototype && dom.CDprototype) ChatDialogue.prototype = dom.CDprototype;

                if (!holodeck.__mouseover) {
                    holodeck.__mouseover = true;

                    var script = document.createElement("script");
                    script.type = "text/javascript";
                    script.textContent = "(" + injectMouseover.toString() + ")(window, $, holodeck, ChatDialogue);";
                    document.body.appendChild(script);
                    setTimeout(function () {
                        document.body.removeChild(script);
                    }, 100);

                    holodeck.addChatCommand("timeformat", function (l, n) {
                        var k = n.match(/^\/\S+\s+(\d+)/),
                            m = "",
                            q = l.activeDialogue();
                        k && (m = k[1]);
                        if (m == 12 || m == 24) {
                            l._timeFormat = m;
                            window.setTimeout(function () {
                                GM_setValue("kong_timeformat", m);
                            }, 0);
                            q.displayMessage("Timeformat", "Set to " + m + "-hour clock (hh:mm:ss" + (m == 12 ? " AM/PM)" : ")"), {
                                "class": "whisper received_whisper"
                            }, {
                                non_user: true
                            });
                        } else {
                            q.displayMessage("Timeformat", "Allowed values: 12 and 24", {
                                "class": "whisper received_whisper"
                            }, {
                                non_user: true
                            });
                        }
                        return false;
                    });

                    var timeformat = 12;

                    if (typeof GM_setValue !== "undefined") {
                        timeformat = GM_getValue("kong_timeformat", 12) || 12;
                    } else {
                        GM_setValue = function GM_setValue() {};
                    }

                    holodeck._timeFormat = timeformat;
                }
            }
        }
    }]);

    return ChatMouseoverTimestamp;
}(HolodeckScript);

//= require ../holodeckScript.js

var ChatResizer = function (_HolodeckScript5) {
    _inherits(ChatResizer, _HolodeckScript5);

    function ChatResizer() {
        _classCallCheck(this, ChatResizer);

        return _possibleConstructorReturn(this, (ChatResizer.__proto__ || Object.getPrototypeOf(ChatResizer)).call(this, 'Chat Resizer', /^\/games/, true));
    }

    _createClass(ChatResizer, [{
        key: "run",
        value: function run() {
            var _this9 = this;

            var dom = this.dom;

            dom.defaultWidth = 500;
            dom.defaultHeight = 600;
            dom.spaceLeft = 200;
            dom.center = true;
            dom.userListHeight = 100;

            if (!$('maingamecontent')) return;
            var initialOffsetTop = $('maingamecontent').offsetTop + $('chat_tab_pane').offsetTop;
            var initialOffsetLeft = $('maingamecontent').offsetLeft + $('chat_tab_pane').offsetLeft;
            var minimumHeight = parseInt($("game").style.height, 10) - parseInt($('main_tab_set').clientHeight, 10) - 16;
            var minimumWidth = 300;

            if (dom.holodeck) {
                var holodeck = dom.holodeck;
                holodeck.addChatCommand("size", function (l, n) {
                    var m = n.match(/^\/\S+\s+(\S+)/);
                    var o = n.match(/^\/\S+\s+(\d+)\s+(\d+)(?:\s+(\d+))?/);

                    if (m && m[1] == "reset") {
                        l.activeDialogue().kongBotMessage("Resetting size for this game to defaults.");
                        window.setTimeout(function () {
                            GM_deleteValue("kong_resize_" + location.pathname);
                        }, 0);
                        this.setWidth(window._defaultChatWidth);
                        this.setHeight(window._defaultChatHeight, window._defaultUserlistHeight, window._currentGameCentered);

                        return false;
                    } else if (m && m[1] == "show") {
                        l.activeDialogue().kongBotMessage("Current chat size: width: " + window._currentChatWidth + "px, height: " + window._currentChatHeight + "px, userlist-height: " + window._currentChatUserlistHeight + "px.");
                        return false;
                    } else if (!o) {
                        l.activeDialogue().kongBotMessage("Please specify a width and a height: /size width height. Example: /size 500 500");
                        return false;
                    }

                    var width = parseInt(o[1], 10);
                    var height = parseInt(o[2], 10);
                    var listHeight = parseInt(o[3] || 100, 10);
                    var gameHeight = parseInt($('game').style.height, 10);
                    if (width < 300) {
                        l.activeDialogue().kongBotMessage("Minimum width is 300. Setting width to 300px.");
                        width = 300;
                    }

                    if (height < gameHeight) {
                        l.activeDialogue().kongBotMessage("Minimum height is the game's height. Setting height to " + gameHeight + "px.");
                        height = gameHeight;
                    }

                    if (listHeight > height - 200) {
                        l.activeDialogue().kongBotMessage("Userlist height is too large. Setting it to 100px");
                        listHeight = 100;
                    }

                    window.setTimeout(function () {
                        GM_setValue("kong_resize_" + location.pathname, width + "/" + height + "/" + listHeight);
                    }, 0);
                    l.activeDialogue().kongBotMessage("Resizing chat to " + width + "px/" + height + "px/" + listHeight + "px");
                    this.setWidth(width);
                    this.setHeight(height, listHeight, window._currentGameCentered);

                    return false;
                });

                holodeck.addChatCommand("defaultsize", function (l, n) {
                    var m = n.match(/^\/\S+\s+(\S+)/);
                    var o = n.match(/^\/\S+\s+(\d+)\s+(\d+)(?:\s+(\d+))?/);
                    if (m && m[1] == "reset") {
                        l.activeDialogue().kongBotMessage("Resetting default size to 500/600/100");
                        window.setTimeout(function () {
                            GM_deleteValue("kong_resize_default");
                        }, 0);

                        return false;
                    } else if (m && m[1] == "show") {
                        l.activeDialogue().kongBotMessage("Current chat size: width: " + window._defaultChatWidth + "px, height: " + window._defaultChatHeight + "px, userlist-height: " + window._defaultUserlistHeight + "px.");
                        return false;
                    } else if (!o) {
                        l.activeDialogue().kongBotMessage("Syntax /defaultsize width height userlist-height. userlist-height is optional. Example: /defaultsize 500 500 100");
                    }

                    var width = parseInt(o[1], 10);
                    var height = parseInt(o[2], 10);
                    var listHeight = parseInt(o[3] || 100, 10);
                    if (width < 300) {
                        l.activeDialogue().kongBotMessage("Minimum width is 300. Setting width to 300px.");
                        width = 300;
                    }

                    if (listHeight > height) {
                        l.activeDialogue().kongBotMessage("Userlist height is too large. Setting it to 100px");
                        listHeight = 100;
                    }

                    window.setTimeout(function () {
                        GM_setValue("kong_resize_default", width + "/" + height + "/" + listHeight);
                    }, 0);
                    l.activeDialogue().kongBotMessage("Set default values to width: " + width + "px, height: " + height + "px, userlist-height: " + listHeight + "px.");

                    return false;
                });

                holodeck.addChatCommand("centergame", function (l, n) {
                    var center = !window._currentGameCentered;
                    if (center) {
                        l.activeDialogue().kongBotMessage("Now centering the game");
                    } else {
                        l.activeDialogue().kongBotMessage("Now aligning the game to the chat's bottom");
                    }
                    window.setTimeout(function () {
                        GM_setValue("kong_resize_center", center ? 1 : 0);
                    }, 0);

                    _this9.centerGame(center);

                    return false;
                });

                holodeck.addChatCommand("draggable", function (l, n) {
                    var chatwindow = document.getElementById("chat_container");
                    //chatwindow.style.overflow = "auto";
                    chatwindow.style.resize = "both";
                    chatwindow.onresize = function () {
                        var chatcontainer = document.getElementById("chat_window");
                        chatcontainer.style.width = chatwindow.style.width;
                        chatcontainer.style.height = chatwindow.style.height;
                        l.activeDialogue().kongBotMessage("Chat window is now resizeable");
                    };
                    return false;
                });
            }

            var getString = "",
                centerVal = -1,
                defaults = "";
            getString = GM_getValue("kong_resize_" + location.pathname, "");
            centerVal = GM_getValue("kong_resize_center", -1);
            defaults = GM_getValue("kong_resize_default", "");

            var splitArr = void 0;
            if (defaults) {
                splitArr = defaults.split("/");
                dom.defaultWidth = parseInt(splitArr[0], 10) || dom.defaultWidth;
                dom.defaultHeight = parseInt(splitArr[1], 10) || dom.defaultHeight;
                dom.userListHeight = parseInt(splitArr[2], 10) || dom.userListHeight;
            }

            window._defaultChatWidth = dom.defaultWidth;
            window._defaultChatHeight = dom.defaultHeight;
            window._defaultUserlistHeight = dom.userListHeight;

            var x = dom.defaultWidth,
                y = dom.defaultHeight,
                l = dom.userListHeight,
                cg = dom.center,
                override = false;

            if (centerVal != -1) {
                cg = centerVal == 1;
            }

            if (getString) {
                splitArr = getString.split("/");
                x = parseInt(splitArr[0], 10) || dom.defaultWidth;
                y = parseInt(splitArr[1], 10) || dom.defaultHeight;
                l = parseInt(splitArr[2], 10) || dom.userListHeight;
                override = true;
            }

            var gameWidth = parseInt($('game').style.width, 10);
            var gameHeight = parseInt($('game').style.height, 10);

            if (x > minimumWidth) {
                if (override || gameWidth + x < screen.width - dom.spaceLeft) {
                    // enough place to resize to specified width
                    this.setWidth(x);
                } else {
                    // resize as far as possible
                    var chatWidth = screen.width - gameWidth - dom.spaceLeft;
                    if (chatWidth > minimumWidth) this.setWidth(chatWidth);
                }
            }

            if (y > minimumHeight && y > gameHeight) {
                this.setHeight(y, l, cg);
            } else {
                this.setHeight(gameHeight, l, cg);
            }
        }
    }, {
        key: "centerGame",
        value: function centerGame(center) {
            window._currentGameCentered = center;
            if (center) {
                var gameHeight = parseInt($('game').style.height, 10);
                var mainHeight = parseInt($("maingame").style.height, 10);
                $('game').style.top = (mainHeight - gameHeight) / 2 + "px";
                $('game').style.position = "relative";
            } else {
                $('game').style.bottom = "0px";
                $('game').style.top = "";
                $('game').style.position = "absolute";
            }
        }
    }, {
        key: "setHeight",
        value: function setHeight(height, userListHeight, center) {
            if (!userListHeight) userListHeight = 100;

            window._currentChatHeight = height;
            window._currentChatUserlistHeight = userListHeight;

            var quicklinksHeight = $('quicklinks') ? $('quicklinks').parentNode.clientHeight : 26;
            var maintabHeight = $('main_tab_set').clientHeight;

            var tabPaneHeight = height - 16;
            var mainHeight = height + quicklinksHeight + maintabHeight;
            var gameHeight = parseInt($('game').style.height, 10);

            $("maingame").style.height = mainHeight + "px";
            $("maingamecontent").style.height = mainHeight + "px";
            $("flashframecontent").style.height = mainHeight + "px";
            $("chat_container").style.height = height + maintabHeight + "px";
            $("user_mini_profile_container").style.height = height - 65 + "px";
            $("user_mini_profile").style.height = height - 65 + "px";

            var messageWindows = $$(".chat_message_window");
            for (var i = 0; i < messageWindows.length; i++) {
                messageWindows[i].style.height = tabPaneHeight - userListHeight - 93 + "px"; // 93 = roomname, users in room etc.
            }

            var usersInRoom = $$(".users_in_room");
            for (i = 0; i < usersInRoom.length; i++) {
                usersInRoom[i].style.height = userListHeight + "px";
            }

            var roomsList = $$(".rooms_list");
            for (i = 0; i < roomsList.length; i++) {
                roomsList[i].style.height = height - 79 + "px";
            }

            var z = $("kong_game_ui").childNodes;
            for (i = 0; i < z.length; i++) {
                if (z[i].nodeName == "DIV") {
                    z[i].style.height = tabPaneHeight + "px";
                }
            }
            if (center != -1 && center !== undefined) this.centerGame(center);
        }
    }, {
        key: "setWidth",
        value: function setWidth(width) {
            window._currentChatWidth = width;
            var gameWidth = parseInt($("game").style.width, 10);
            $("maingame").style.width = gameWidth + 3 + width + "px";
            $("maingamecontent").style.width = gameWidth + 3 + width + "px";
            $("flashframecontent").style.width = gameWidth + 3 + width + "px";
            $("chat_container").style.width = width + "px";
            $('chat_window_spinner').style.right = width / 2 - 38 + "px";
            if ($('high_scores_spinner')) $('high_scores_spinner').style.right = width / 2 - 38 + "px";
            var ui = $("kong_game_ui");
            var z = ui.childNodes;
            for (var i = 0; i < z.length; i++) {
                if (z[i].tagName == "DIV") z[i].style.width = width - 17 + "px";
            }
            this.$A(ui.querySelectorAll("textarea.chat_input")).forEach(function (el) {
                el.style.width = width - 21 + "px";
            });
        }
    }, {
        key: "$A",
        value: function $A(c) {
            return [].slice.call(c);
        }
    }]);

    return ChatResizer;
}(HolodeckScript);

//=require ../holodeckScript.js

var ChatTimestamp = function (_HolodeckScript6) {
    _inherits(ChatTimestamp, _HolodeckScript6);

    function ChatTimestamp() {
        _classCallCheck(this, ChatTimestamp);

        return _possibleConstructorReturn(this, (ChatTimestamp.__proto__ || Object.getPrototypeOf(ChatTimestamp)).call(this, 'Chat Timestamp', /^\/games/, true));
    }

    _createClass(ChatTimestamp, [{
        key: "run",
        value: function run() {
            var dom = this.dom,
                holodeck = dom.holodeck,
                ChatDialogue = dom.ChatDialogue;

            if (holodeck && ChatDialogue) {
                ChatDialogue.prototype = dom.CDprototype || dom.ChatDialogue.prototype;

                if (!holodeck.__timestamp) {
                    holodeck.__timestamp = true;

                    holodeck.addChatCommand("timeformat", function (l, n) {
                        var k = n.match(/^\/\S+\s+(\d+)/),
                            m = "",
                            q = l.activeDialogue();
                        k && (m = k[1]);
                        if (m == 12 || m == 24) {
                            l._timeFormat = m;
                            window.setTimeout(function () {
                                GM_setValue("kong_timeformat", m);
                            }, 0);
                            q.displayMessage("Timeformat", "Set to " + m + "-hour clock (hh:mm:ss" + (m == 12 ? " AM/PM)" : ")"), {
                                "class": "whisper received_whisper"
                            }, {
                                non_user: true
                            });
                        } else {
                            q.displayMessage("Timeformat", "Allowed values: 12 and 24", {
                                "class": "whisper received_whisper"
                            }, {
                                non_user: true
                            });
                        }
                        return false;
                    });

                    holodeck.addChatCommand("tscolor", function (l, n) {
                        var k = n.match(/^\/\S+\s+([0-9a-f]{6})/i),
                            z = "";
                        k && (z = "#" + k[1]);
                        if (z) {
                            updateColor(z);
                            window.setTimeout(function () {
                                GM_setValue("kong_timestampcolor", z);
                            }, 0);
                            l.activeDialogue().displayMessage("Timestamp", "Set font-color to " + z, {
                                "class": "whisper received_whisper"
                            }, {
                                non_user: true
                            });
                        } else {
                            l.activeDialogue().displayMessage("Timestamp", "No valid color! Format is /tscolor ###### (# = hex character)", {
                                "class": "whisper received_whisper"
                            }, {
                                non_user: true
                            });
                        }
                        return false;
                    });

                    holodeck.addChatCommand("toggleseconds", function (l, n) {
                        if (l._showSeconds) {
                            l._showSeconds = 0;
                            l.activeDialogue().displayMessage("Timestamp", "Now hiding seconds", {
                                "class": "whisper received_whisper"
                            }, {
                                non_user: true
                            });
                        } else {
                            l._showSeconds = 1;
                            l.activeDialogue().displayMessage("Timestamp", "Now showing seconds", {
                                "class": "whisper received_whisper"
                            }, {
                                non_user: true
                            });
                        }
                        window.setTimeout(function () {
                            GM_setValue("kong_timeshowseconds", l._showSeconds);
                        }, 0);
                        return false;
                    });

                    var timeformat = 12,
                        fontcolor = "#999999",
                        seconds = 0;

                    timeformat = GM_getValue("kong_timeformat", 12) || 12;
                    fontcolor = GM_getValue("kong_timestampcolor", "#999999") || "#999999";
                    seconds = GM_getValue("kong_timeshowseconds", 0) || 0;

                    holodeck._timeFormat = timeformat;
                    holodeck._showSeconds = seconds;

                    var updateColor = function (c) {
                        var style = document.createElement("style");
                        style.setAttribute("type", "text/css");

                        function _updateColor(color) {
                            style.innerHTML = "span.inline_timestamp { color: " + color + " !important; }";
                        }

                        _updateColor(c);
                        document.body.appendChild(style);

                        return _updateColor;
                    }(fontcolor);
                    ChatDialogue.MESSAGE_TEMPLATE.template = '<p class="#{classNames}"><span style="float: left;" class="inline_timestamp">[#{time}]&nbsp;</span><span username="#{username}" class="username #{userClassNames}">#{prefix}#{username}</span><span class="separator">: </span><span class="message">#{message}</span><span class="clear"></span></p>';
                    ChatDialogue.MESSAGE_TEMPLATE.old_evaluate_inline = ChatDialogue.MESSAGE_TEMPLATE.evaluate;
                    ChatDialogue.MESSAGE_TEMPLATE.evaluate = function (args) {
                        var date = new Date();
                        var hours = date.getHours();
                        var minutes = date.getMinutes();
                        var seconds = date.getSeconds();
                        var time;
                        if (holodeck._timeFormat == 12) {
                            time = (hours < 10 ? hours === 0 ? "12" : "0" + hours : hours > 12 ? hours > 21 ? hours - 12 : "0" + (hours - 12) : hours) + ":" + (minutes < 10 ? "0" : "") + minutes + (holodeck._showSeconds ? ":" + (seconds < 10 ? "0" : "") + seconds : "") + (hours > 11 ? " PM" : " AM");
                        } else {
                            time = (hours < 10 ? "0" : "") + hours + ":" + (minutes < 10 ? "0" : "") + minutes + (holodeck._showSeconds ? ":" + (seconds < 10 ? "0" : "") + seconds : "");
                        }
                        args.time = time;
                        return this.old_evaluate_inline(args);
                    };
                }
            }
        }
    }]);

    return ChatTimestamp;
}(HolodeckScript);

//=require ../holodeckScript.js

var KongOneAlerts = function (_HolodeckScript7) {
    _inherits(KongOneAlerts, _HolodeckScript7);

    function KongOneAlerts() {
        _classCallCheck(this, KongOneAlerts);

        // Call super
        return _possibleConstructorReturn(this, (KongOneAlerts.__proto__ || Object.getPrototypeOf(KongOneAlerts)).call(this, 'this', /^\/games/, true));
    }

    _createClass(KongOneAlerts, [{
        key: "run",
        value: function run() {
            // Constants
            var BOTNAME = "KOneBot";
            holodeck.sendKongOneMessage = function (type, data, userAgent) {
                // Quick hacky wait for sendPrivateMessage function
                function checkPM() {
                    if (!holodeck._active_dialogue || !holodeck._active_dialogue._user_manager || !holodeck._active_dialogue._user_manager.sendPrivateMessage) {
                        setTimeout(checkPM, 500);
                    } else {
                        // Send event
                        holodeck._active_dialogue._user_manager.sendPrivateMessage(BOTNAME, JSON.stringify({
                            type: type,
                            data: data,
                            userAgent: userAgent || navigator.userAgent
                        }));
                    }
                }checkPM();
            };

            // Assign
            var CDialogue = this.dom.ChatDialogue;

            // Start event
            holodeck.sendKongOneMessage("event", "enter");
            // Register leave event
            window.addEventListener("unload", function () {
                holodeck.sendKongOneMessage("event", "exit");
            });

            // Save receivedPrivateMessage
            CDialogue.prototype.__koc_receivedPrivateMessage = CDialogue.prototype.receivedPrivateMessage;
            // Override receivedPrivateMessage to display special messages from bot
            CDialogue.prototype.receivedPrivateMessage = function (a) {
                var username = a.data.from,
                    message = a.data.message;

                // Skip handling if not from bot
                if (username !== BOTNAME) {
                    this.__koc_receivedPrivateMessage(a);
                    return;
                }

                // Otherwise look for data from "server"
                try {
                    var data = JSON.parse(message);
                    if (data.type === "usercount") {
                        holodeck._active_dialogue.displayUnsanitizedMessage("Kong Bot", "There are " + data.data + " Kong One users online", { class: "whisper received_whisper" }, { non_user: true });
                    } else if (data.type === "message") {
                        holodeck._active_dialogue.displayUnsanitizedMessage("Kong Bot", data.data, {}, {
                            non_user: true,
                            template: ChatDialogue.MOTD_MESSAGE_TEMPLATE
                        });
                    }
                } catch (e) {}
            };

            // Register error event handling (sent to bot and then to devs)
            window.onerror = function (e) {
                holodeck.sendKongOneMessage("error", JSON.stringify(e));
            };

            // Add chat commands
            holodeck.addChatCommand("k1online", function (l, msg) {
                holodeck.sendKongOneMessage("event", "usercount");
                return false;
            });
            holodeck.addChatCommand("k1message", function (l, msg) {
                holodeck.sendKongOneMessage("message", msg.match(/\/k1message\s(.*)/)[1], 1);
                return false;
            });
        }
    }]);

    return KongOneAlerts;
}(HolodeckScript);
//= require ../holodeckScript.js

var Kongquer = function (_HolodeckScript8) {
    _inherits(Kongquer, _HolodeckScript8);

    function Kongquer() {
        _classCallCheck(this, Kongquer);

        return _possibleConstructorReturn(this, (Kongquer.__proto__ || Object.getPrototypeOf(Kongquer)).call(this, 'Kongquer', /^\/games/, true));
    }

    _createClass(Kongquer, [{
        key: "run",
        value: function run() {
            if (typeof holodeck !== "undefined" && !holodeck.__urlregex) {
                holodeck.__urlregex = true;
            }
            function makeLink(user) {
                return '<a href="#" onclick="holodeck.showMiniProfile(\'' + user + '\'); return false;">' + user + '</a>';
            }
            var dom = this.dom,
                holodeck = dom.holodeck,
                ChatDialogue = dom.ChatDialogue;
            //
            //Test command so you don't look stupid if script doesn't load
            //
            holodeck.addChatCommand("test", function (l, n) {
                l.activeDialogue().displayUnsanitizedMessage("Kong Bot", "Script is active! Have fun...", { "class": "whisper received_whisper" }, { non_user: true });
                return false;
            });
            //
            //From original Kongregate Get script (http://userscripts-mirror.org/scripts/review/56432)
            //
            holodeck.addChatCommand("avg", function (l, n) {
                var roomDetails = l.chatWindow().activeRoom();
                var allUsers = roomDetails.users();
                var allLevels = 0;
                for (var i = 0; i < allUsers.length; i++) {
                    allLevels += allUsers[i]._level;
                }
                var avgLevel = Math.round(allLevels / allUsers.length * 10) / 10;
                l.activeDialogue().displayUnsanitizedMessage("Average Level in Room", avgLevel, { "class": "whisper received_whisper" }, { non_user: true });
                return false;
            });
            if (holodeck && ChatDialogue && !holodeck._chat_commands.mostplayed) {
                //Credit goes entirely to Ventero for this command. Thanks for fixing the command after the Kongregate update, Vent :)
                holodeck.addChatCommand("mostplayed", function (l, n) {
                    var matchArr = n.match(/\/\S+\s+(\d+)/),
                        dialog = l.activeDialogue(),
                        gamesCount = 5,
                        userList = dom.$A(l.chatWindow().activeRoom().users()),
                        usersCount = userList.length;
                    if (matchArr && matchArr[1]) gamesCount = matchArr[1];
                    function p(count) {
                        return count == 1 ? "" : "s";
                    }
                    var games = dom.$H();
                    userList.each(function (user) {
                        var o = user._game_url;
                        if (!games.get(o)) {
                            games.set(o, {
                                title: user._game_title,
                                count: 0,
                                user: "",
                                url: o
                            });
                        }
                        games.get(o).count++;
                        games.get(o).user = user.username;
                    });

                    var countArr = games.values().sort(function (a, b) {
                        return +b.count - +a.count;
                    }).slice(0, gamesCount);
                    var totalCount = games.size();

                    dialog.displayUnsanitizedMessage("Kong Bot", usersCount + " user" + p(usersCount) + " playing " + totalCount + " different game" + p(totalCount), { "class": "whisper received_whisper" }, { non_user: true });
                    dialog.displayUnsanitizedMessage("Kong Bot", gamesCount + " most played game" + p(gamesCount) + ":", { "class": "whisper received_whisper" }, { non_user: true });
                    countArr.each(function (obj) {
                        dialog.displayUnsanitizedMessage("Kong Bot", obj.count + " user" + p(obj.count) + " (" + (obj.count > 1 ? "" : makeLink(obj.user) + ", ") + (100 * obj.count / usersCount).toFixed(1) + "%) " + (obj.count > 1 ? "are" : "is") + ' playing <a href="' + obj.url + '">' + obj.title + "</a>", { "class": "whisper received_whisper" }, { non_user: true });
                    });
                    return false;
                });
                holodeck._chat_commands.mp = holodeck._chat_commands.getmp = holodeck._chat_commands.mostplayed;
            }
            //
            //Rest by AlphaOverall
            //
            holodeck.addChatCommand("highlvl", function (l, n) {
                var roomDetails = l.chatWindow().activeRoom();
                var allUsers = roomDetails.users();
                var highLevels = "";
                var highestLevel = 0;
                var count = 0;
                for (var i = 0; i < allUsers.length; i++) {
                    if (allUsers[i]._level > highestLevel) {
                        highestLevel = allUsers[i]._level;
                        highLevels = "<img src=\"" + allUsers[i]._chat_avatar_url + "\">" + makeLink(allUsers[i].username);
                        count = 1;
                    } else if (allUsers[i]._level == highestLevel) {
                        highLevels = highLevels + ", <img src=\"" + allUsers[i]._chat_avatar_url + "\">" + makeLink(allUsers[i].username);
                        count += 1;
                    }
                }
                l.activeDialogue().displayUnsanitizedMessage("Highest Level in Room", highestLevel + ", Usercount: " + count + ", Users: " + highLevels, { "class": "whisper received_whisper" }, { non_user: true });
                return false;
            });

            holodeck.addChatCommand("lowlvl", function (l, n) {
                var roomDetails = l.chatWindow().activeRoom();
                var allUsers = roomDetails.users();
                var lowLevels = "";
                var lowestLevel = Infinity; //Just to makes sure :P
                var count = 0;
                for (var i = 0; i < allUsers.length; i++) {
                    if (allUsers[i]._level < lowestLevel) {
                        lowestLevel = allUsers[i]._level;
                        lowLevels = "<img src=\"" + allUsers[i]._chat_avatar_url + "\">" + makeLink(allUsers[i].username);
                        count = 1;
                    } else if (allUsers[i]._level == lowestLevel) {
                        count += 1;
                        lowLevels = lowLevels + ", <img src=\"" + allUsers[i]._chat_avatar_url + "\">" + makeLink(allUsers[i].username);
                    }
                }
                l.activeDialogue().displayUnsanitizedMessage("Lowest Level in Room", lowestLevel + ", Usercount: " + count + ", Users: " + lowLevels, { "class": "whisper received_whisper" }, { non_user: true });
                return false;
            });

            holodeck.addChatCommand("list", function (l, n) {
                var roomDetails = l.chatWindow().activeRoom();
                var allUsers = roomDetails.users();
                var userList = "";
                var word = n.match(/^\/\S+\s+(.+)/);
                var count = 0;
                if (word) {
                    var toFind = word[1];
                    for (var i = 0; i < allUsers.length; i++) {
                        if (allUsers[i].username.toLowerCase().includes(toFind.toLowerCase())) {
                            if (userList === "") {
                                userList = "<img src=\"" + allUsers[i]._chat_avatar_url + "\">" + makeLink(allUsers[i].username);
                                count = 1;
                            } else {
                                count += 1;
                                userList = userList + ", <img src=\"" + allUsers[i]._chat_avatar_url + "\">" + makeLink(allUsers[i].username);
                            }
                        }
                    }
                    l.activeDialogue().displayUnsanitizedMessage("Usernames Containing " + word[1], "Usercount: " + count + ", Users: " + userList, { "class": "whisper received_whisper" }, { non_user: true });
                } else {
                    l.activeDialogue().displayUnsanitizedMessage("Kong Bot", "Please use this command like " + n + " cat", { "class": "whisper received_whisper" }, { non_user: true });
                }
                return false;
            });
            holodeck.addChatCommand("levels", function (l, n) {
                var z = n.match(/^\/\S+\s+(.+)/);
                var roomDetails = l.chatWindow().activeRoom();
                var allUsers = roomDetails.users();
                var levelCount = void 0,
                    a = void 0;
                if (z) {
                    var userLevels = "";
                    var displaymessage = "";
                    levelCount = [];
                    if (z[1].includes("-")) {
                        var inbetween = z[1].split("-");
                        if (inbetween[0] < inbetween[1]) {
                            for (a = inbetween[0]; a <= inbetween[1]; a++) {
                                levelCount.push(a);
                            }
                        } else {
                            for (a = inbetween[1]; a <= inbetween[0]; a++) {
                                levelCount.push(a);
                            }
                        }
                        displaymessage = z[1];
                    } else {
                        levelCount = z[1].split(" ");
                        displaymessage = levelCount.join(", ");
                    }
                    var count = 0;
                    for (var b = 0; b <= levelCount.length; b++) {
                        for (var i = 0; i < allUsers.length; i++) {
                            if (allUsers[i]._level == levelCount[b] && userLevels === "") {
                                userLevels = "<img src=\"" + allUsers[i]._chat_avatar_url + "\">" + makeLink(allUsers[i].username);
                                count = 1;
                            } else if (allUsers[i]._level == levelCount[b]) {
                                count += 1;
                                userLevels = userLevels + ", <img src=\"" + allUsers[i]._chat_avatar_url + "\">" + makeLink(allUsers[i].username);
                            }
                        }
                    }
                    l.activeDialogue().displayUnsanitizedMessage("Level " + displaymessage, "Usercount: " + count + ", Users: " + userLevels, { "class": "whisper received_whisper" }, { non_user: true });
                    return false;
                } else {
                    var levelsList = [l._active_user._attributes._object.level];
                    for (var j = 0; j < allUsers.length; j++) {
                        for (var k = 0; k <= allUsers[j]._level; k++) {
                            if (allUsers[j]._level == k) {
                                if (levelsList.indexOf(k) < 0) {
                                    levelsList.push(k);
                                }
                            }
                        }
                    }
                    levelsList.sort(function (a, b) {
                        return a - b;
                    });
                    l.activeDialogue().displayUnsanitizedMessage("Levels", levelsList.join(", "), { "class": "whisper received_whisper" }, { non_user: true });
                    return false;
                }
            });

            holodeck.addChatCommand("highfans", function (l, n) {
                var roomDetails = l.chatWindow().activeRoom();
                var allUsers = roomDetails.users();
                var highFans = "";
                var highestFans = 0;
                var count = 0;
                var content;

                var f = function f(evt) {
                    amount = evt.responseText;
                };
                for (var i = 0; i < allUsers.length; i++) {
                    var username = allUsers[i].username;
                    var url = "http://www.kongregate.com/accounts/" + username + "#user_followers";
                    var request = new XMLHttpRequest();
                    var amount;
                    request.addEventListener("load", f, false);

                    request.open("GET", url, true);
                    request.send();
                    var div = document.createElement("div");
                    div.innerHTML = amount;
                    var a = div.getElementsByTagName("li");
                }
                l.activeDialogue().displayUnsanitizedMessage("Highest Fans in Room", content, { "class": "whisper received_whisper" }, { non_user: true });
                return false;
            });

            holodeck.addChatCommand("developer", function (l, n) {
                var roomDetails = l.chatWindow().activeRoom();
                var allUsers = roomDetails.users();
                var devs = [];
                for (var i = 0; i < allUsers.length; i++) {
                    if (allUsers[i]._developer) {
                        devs.push(makeLink(allUsers[i].username));
                    }
                }
                l.activeDialogue().displayUnsanitizedMessage("Developers in room", devs.join(", "), { "class": "whisper received_whisper" }, { non_user: true });
                return false;
            });

            holodeck.addChatCommand("admin", function (l, n) {
                var roomDetails = l.chatWindow().activeRoom();
                var allUsers = roomDetails.users();
                var admins = [];
                for (var i = 0; i < allUsers.length; i++) {
                    if (allUsers[i]._admin) {
                        admins.push(makeLink(allUsers[i].username));
                    }
                }
                l.activeDialogue().displayUnsanitizedMessage("Admins in room", admins.join(", "), { "class": "whisper received_whisper" }, { non_user: true });
                return false;
            });

            holodeck.addChatCommand("moderator", function (l, n) {
                var roomDetails = l.chatWindow().activeRoom();
                var allUsers = roomDetails.users();
                var mods = [];
                for (var i = 0; i < allUsers.length; i++) {
                    if (allUsers[i]._moderator_room_ids.length > 0 || allUsers[i]._moderator_game_ids.length > 0) {
                        mods.push(allUsers[i].username);
                    }
                }
                l.activeDialogue().displayUnsanitizedMessage("Mods in room", mods.join(", "), { "class": "whisper received_whisper" }, { non_user: true });
                return false;
            });

            //Simple commands that will show up in user info also
            holodeck.addChatCommand("id", function (l, n) {
                var user = l._active_user._attributes._object;
                l.activeDialogue().displayUnsanitizedMessage("ID", user.id, { "class": "whisper received_whisper" }, { non_user: true });
                return false;
            });

            holodeck.addChatCommand("username", function (l, n) {
                var user = l._active_user._attributes._object;
                l.activeDialogue().displayUnsanitizedMessage("Username", makeLink(user.username), { "class": "whisper received_whisper" }, { non_user: true });
                return false;
            });

            holodeck.addChatCommand("kreds", function (l, n) {
                var user = l._active_user._attributes._object;
                l.activeDialogue().displayUnsanitizedMessage("Kreds", user.kreds_balance, { "class": "whisper received_whisper" }, { non_user: true });
                return false;
            });
            holodeck.addChatCommand("level", function (l, n) {
                var user = l._active_user._attributes._object;
                l.activeDialogue().displayUnsanitizedMessage("Level", user.level, { "class": "whisper received_whisper" }, { non_user: true });
                return false;
            });

            holodeck.addChatCommand("age", function (l, n) {
                var user = l._active_user._attributes._object;
                l.activeDialogue().displayUnsanitizedMessage("Age", user.age, { "class": "whisper received_whisper" }, { non_user: true });
                return false;
            });
            holodeck.addChatCommand("email", function (l, n) {
                var user = l._active_user._attributes._object;
                l.activeDialogue().displayUnsanitizedMessage("Name/Email", user.sender_name_or_email, { "class": "whisper received_whisper" }, { non_user: true });
                return false;
            });

            holodeck.addChatCommand("user", function (l, n) {
                var z = n.match(/^\/\S+\s+(.+)/);
                var user = void 0;
                if (z) {
                    var roomDetails = l.chatWindow().activeRoom();
                    var allUsers = roomDetails.users();
                    for (var i = 0; i < allUsers.length; i++) {
                        if (i == allUsers.length - 1 && allUsers[i].username != z[1]) {
                            l.activeDialogue().displayUnsanitizedMessage("Kong Bot", "User not in chat... Opening mini profile", { "class": "whisper received_whisper" }, { non_user: true });
                            holodeck.showMiniProfile(z[1]);
                            return false;
                        }
                        if (allUsers[i].username == z[1]) {
                            user = allUsers[i];
                            l.activeDialogue().displayUnsanitizedMessage("Username", "<img src=\"" + user._chat_avatar_url + "\"></img>" + makeLink(user.username), { "class": "whisper received_whisper" }, { non_user: true });
                            l.activeDialogue().displayUnsanitizedMessage("Level", user._level, { "class": "whisper received_whisper" }, { non_user: true });
                            if (user._moderator_room_ids.length === 0 && user._moderator_game_ids.length === 0) {
                                l.activeDialogue().displayUnsanitizedMessage("Admin/Moderator/Developer/Premium", user._admin + "/false/" + user._developer + "/" + user._premium, { "class": "whisper received_whisper" }, { non_user: true });
                            } else {
                                l.activeDialogue().displayUnsanitizedMessage("Admin/Moderator/Developer/Premium", user._admin + "/true/" + user._developer + "/" + user._premium, { "class": "whisper received_whisper" }, { non_user: true });
                                if (!user._admin) {
                                    l.activeDialogue().displayUnsanitizedMessage("Moderator Game Ids", user._moderator_game_ids.join(", "), { "class": "whisper received_whisper" }, { non_user: true });
                                    l.activeDialogue().displayUnsanitizedMessage("Moderator Room Ids", user._moderator_room_ids.join(", "), { "class": "whisper received_whisper" }, { non_user: true });
                                }
                            }
                            l.activeDialogue().displayUnsanitizedMessage("Playing", "<a href=\"http://www.kongregate.com" + user._game_url + "\" target=\"_blank\">" + user._game_title + "</a>", { "class": "whisper received_whisper" }, { non_user: true });
                            l.activeDialogue().displayUnsanitizedMessage("Presence", user._presence, { "class": "whisper received_whisper" }, { non_user: true });
                            l.activeDialogue().displayUnsanitizedMessage("Role", user._role, { "class": "whisper received_whisper" }, { non_user: true });
                            return false;
                        }
                    }
                } else {
                    user = l._active_user._attributes._object;
                    l.activeDialogue().displayUnsanitizedMessage("Username", "<img src=\"" + user.avatar_url + "\">" + makeLink(user.username), { "class": "whisper received_whisper" }, { non_user: true });
                    l.activeDialogue().displayUnsanitizedMessage("Age", user.age, { "class": "whisper received_whisper" }, { non_user: true });
                    l.activeDialogue().displayUnsanitizedMessage("Admin/Moderator/Developer/Premium", user.admin + "/" + user.moderator + "/" + user.developer + "/" + user.premium, { "class": "whisper received_whisper" }, { non_user: true });
                    l.activeDialogue().displayUnsanitizedMessage("ID", user.id, { "class": "whisper received_whisper" }, { non_user: true });
                    l.activeDialogue().displayUnsanitizedMessage("Level", user.level, { "class": "whisper received_whisper" }, { non_user: true });
                    l.activeDialogue().displayUnsanitizedMessage("Points for Next Level", user.points_away, { "class": "whisper received_whisper" }, { non_user: true });
                    l.activeDialogue().displayUnsanitizedMessage("Total Points", user.points, { "class": "whisper received_whisper" }, { non_user: true });
                    l.activeDialogue().displayUnsanitizedMessage("Last Level Up", user.last_levelup_at, { "class": "whisper received_whisper" }, { non_user: true });
                    l.activeDialogue().displayUnsanitizedMessage("Kreds", user.kreds_balance, { "class": "whisper received_whisper" }, { non_user: true });
                    l.activeDialogue().displayUnsanitizedMessage("Gameplays", user.gameplays_count, { "class": "whisper received_whisper" }, { non_user: true });
                    l.activeDialogue().displayUnsanitizedMessage("Game Ratings", user.ratings_count, { "class": "whisper received_whisper" }, { non_user: true });
                    l.activeDialogue().displayUnsanitizedMessage("BOTD Earned This Week", user.botds_this_week, { "class": "whisper received_whisper" }, { non_user: true });
                    l.activeDialogue().displayUnsanitizedMessage("Name/Email", user.sender_name_or_email, { "class": "whisper received_whisper" }, { non_user: true });
                    return false;
                }
            });

            holodeck.addChatCommand("available", function (l, n) {
                var z = n.match(/^\/\S+\s+(.+)/);
                if (z) {
                    l.activeDialogue().displayUnsanitizedMessage("Kong Bot", "Availability of " + z[1] + ":<iframe src=\"httP://www.kongregate.com/accounts/availability?username=" + z[1] + "\" width=\"100%\" height=\"30\"></iframe>", { "class": "whisper received_whisper" }, { non_user: true });
                }
                return false;
            });

            holodeck.addChatCommand("info", function (l, n) {
                var info = l._chat_window._active_room;
                var room = info._room;
                l.activeDialogue().displayUnsanitizedMessage("Room Name", room.name, { "class": "whisper received_whisper" }, { non_user: true });
                l.activeDialogue().displayUnsanitizedMessage("Room ID", room.id, { "class": "whisper received_whisper" }, { non_user: true });
                l.activeDialogue().displayUnsanitizedMessage("Room Owner", "<a href=\"http://www.kongregate.com/accounts/" + room.owner + "\" target=\"_blank\">" + room.owner + "</a>", { "class": "whisper received_whisper" }, { non_user: true });
                l.activeDialogue().displayUnsanitizedMessage("Room Type", room.type, { "class": "whisper received_whisper" }, { non_user: true });
                l.activeDialogue().displayUnsanitizedMessage("Favorite Room", info._favorite_room, { "class": "whisper received_whisper" }, { non_user: true });
                l.activeDialogue().displayUnsanitizedMessage("Users In Room", info._number_in_room_node.innerText, { "class": "whisper received_whisper" }, { non_user: true });
                l.activeDialogue().displayUnsanitizedMessage("Guests In Room", info._guests_in_room_node.innerText, { "class": "whisper received_whisper" }, { non_user: true });
                return false;
            });

            holodeck.addChatCommand("botd", function (l, n) {
                var kbotd = l._active_user._attributes._object;
                var typeOf = "(easy)";
                if (kbotd.botd_reward_points == 5) {//Do nothing
                } else if (kbotd.botd_reward_points == 15) {
                    typeOf = "(medium)";
                } else if (kbotd.botd_reward_points == 30) {
                    typeOf = "(hard)";
                } else if (kbotd.botd_reward_points == 60) {
                    typeOf = "(impossible)";
                } else {
                    typeOf = "Points: " + kbotd.botd_reward_points;
                } //Just in case
                l.activeDialogue().displayUnsanitizedMessage("BOTD", "<img src=\"" + kbotd.botd_icon_uri + "\"></img>" + "<a href=\"" + kbotd.botd_game_uri + "\" target=\"_blank\">" + kbotd.botd_game_name + " - " + kbotd.botd_description + "</a> " + typeOf, { "class": "whisper received_whisper" }, { non_user: true });
                return false;
            });

            holodeck.addChatCommand("friends", function (l, n) {
                var kongfriends = l._chat_window._friends;
                var final = [];
                for (var friend in kongfriends) {
                    final.push("<a href=\"http://www.kongregate.com/accounts/" + friend + "\" target=\"_blank\">" + friend + "</a>");
                }
                l.activeDialogue().displayUnsanitizedMessage("Friends", final.join(", "), { "class": "whisper received_whisper" }, { non_user: true });
                return false;
            });

            holodeck.addChatCommand("online", function (l, n) {
                holodeck._chat_window.showOnlineFriends();
                return false;
            });

            holodeck.addChatCommand("exit", function (l, n) {
                close();
                return false;
            });

            holodeck.addChatCommand("open", function (l, n) {
                var z = n.match(/^\/\S+\s+(.+)/);
                if (z[1]) {
                    m = z[1].split(" ");
                    if (m[0] == "accounts") {
                        if (m[1]) {
                            open("http://www.kongregate.com/accounts/" + m[1], "_blank");
                        } else {
                            open("http://www.kongregate.com/accounts/" + l._active_user._attributes._object.username);
                        }
                    } else if (m[0] == "games") {
                        if (m[1]) {
                            if (m[2]) {
                                open("http://www.kongregate.com/games/" + m[1] + "/" + m[2], "_blank");
                            } else {
                                l.activeDialogue().displayUnsanitizedMessage("Kong Bot", "No specified game", { "class": "whisper received_whisper" }, { non_user: true });
                            }
                        } else {
                            l.activeDialogue().displayUnsanitizedMessage("Kong Bot", "No specified game creator", { "class": "whisper received_whisper" }, { non_user: true });
                        }
                    } else {
                        open("http://www.kongregate.com/search?q=" + z[1], "_blank");
                    }
                } else {
                    open("http://www.kongregate.com/accounts/" + l._active_user._attributes._object.username);
                }
                return false;
            });

            holodeck.addChatCommand("khelp", function (l, n) {
                open("http://www.kongregate.com/pages/help", "_blank");
                return false;
            });

            holodeck.addChatCommand("kong", function (l, n) {
                open("http://www.kongregate.com", "_blank");
                return false;
            });
            holodeck.addChatCommand("help", function (l, n) {
                open("http://www.alphaoverall.com", "_blank");
                return false;
            });
            holodeck.addChatCommand("signup", function (l, n) {
                lightbox.prototype.initializeKongregateLightboxFromAjax('/accounts/new/behind_login?game_id=' + active_user.gameId(), { afterStaticContentLoad: lightbox.prototype.toggleRegistration });
                return false;
            });
            holodeck.addChatCommand("login", function (l, n) {
                active_user.activateInlineLogin();
                return false;
            });
            holodeck.addChatCommand("signout", function (l, n) {
                signoutFromSite();
                return false;
            });
            holodeck.addChatCommand("google", function (l, n) {
                var z = n.match(/^\/\S+\s+(.+)/);
                if (z) {
                    open("https://www.google.com/search?q=" + z[1], "_blank");
                } else {
                    open("https://www.google.com", "_blank");
                }
                return false;
            });
            holodeck.addChatCommand("bing", function (l, n) {
                var z = n.match(/^\/\S+\s+(.+)/);
                if (z) {
                    open("https://www.bing.com/search?q=" + z[1], "_blank");
                } else {
                    open("https://www.bing.com", "_blank");
                }
                return false;
            });
            holodeck.addChatCommand("yahoo", function (l, n) {
                var z = n.match(/^\/\S+\s+(.+)/);
                if (z) {
                    open("https://search.yahoo.com/search;_ylt=Aq7xBwaF.DQZx151DcVK87ybvZx4?p=" + z[1], "_blank");
                } else {
                    open("https://www.yahoo.com", "_blank");
                }
                return false;
            });
            holodeck.addChatCommand("wikipedia", function (l, n) {
                var z = n.match(/^\/\S+\s+(.+)/);
                if (z) {
                    open("https://en.wikipedia.org/wiki/" + z[1].replace(" ", "_"), "_blank");
                } else {
                    open("https://en.wikipedia.org/", "_blank");
                }
                return false;
            });
            holodeck.addChatCommand("url", function (l, n) {
                var z = n.match(/^\/\S+\s+(.+)/);
                if (z) {
                    if (!z[1].includes("http://") && !z[1].includes("https://")) {
                        open("http://" + z[1], "_blank");
                    } else {
                        open(z[1], "_blank");
                    }
                } else {
                    l.activeDialogue().displayUnsanitizedMessage("Kong Bot", "Please use command like " + n + " https://www.google.com", { "class": "whisper received_whisper" }, { non_user: true });
                }
                return false;
            });

            holodeck.addChatCommand("calculator", function (l, n) {
                var z = n.match(/^\/\S+\s+(.+)/);
                var output = "Nothing happened";
                if (z) {
                    /*jshint multistr: true */
                    if (z[1] == "help") {
                        l.activeDialogue().displayUnsanitizedMessage("Math Commands", "+,-,*,<br>Math.abs(a) = absolute value of a<br>Math.acos(a) = arc cosine of a<br>\
Math.asin(a) = arc sine of a<br>Math.atan(a) = arc tangent of a<br>Math.atan2(a,b) = arc tangent of a/b<br>Math.ceil(a) = integer closest to a and not less than a<br>\
Math.cos(a) = cosine of a<br>Math.exp(a) = exponent of a (Math.E to the power a)<br>Math.floor(a) = integer closest to a, not greater than a<br>Math.log(a) = log of a base e<br>\
Math.max(a,b) = the maximum of a and b<br>Math.min(a,b) = the minimum of a and b<br>Math.pow(a,b) = a to the power b<br>Math.random() = pseudorandom number 0 to 1<br>\
Math.round(a) =  integer closest to a <br> Math.sin(a) = sine of a<br>Math.sqrt(a) = square root of a<br>Math.tan(a) = tangent of a", { "class": "whisper received_whisper" }, { non_user: true });
                    } else {
                        try {
                            output = eval(z[1]); //I know, I know, eval is evil
                            l.activeDialogue().displayUnsanitizedMessage("Calculation", z[1] + " = " + output, { "class": "whisper received_whisper" }, { non_user: true });
                        } catch (err) {
                            l.activeDialogue().displayUnsanitizedMessage("Kong Bot", err, { "class": "whisper received_whisper" }, { non_user: true });
                        }
                    }
                } else {
                    l.activeDialogue().displayUnsanitizedMessage("Kong Bot", "Please use command like " + n + " 4+3-8*9/3^.5", { "class": "whisper received_whisper" }, { non_user: true });
                }
                return false;
            });
            holodeck.addChatCommand("youtube", function (l, n) {
                var z = n.match(/^\/\S+\s+(.+)/);
                if (z) {
                    var m = z[1].split(" ");
                    if (m[0] == "embed") {
                        var chatWindow = document.getElementsByClassName("chat_message_window");
                        var chatWin;
                        if (chatWindow[2] !== undefined && chatWindow[2].offsetHeight > chatWindow[1].offsetHeight) {
                            chatWin = chatWindow[2];
                        } else {
                            chatWin = chatWindow[1];
                        }
                        var h = chatWin.offsetHeight;
                        if (chatWin.offsetWidth > chatWin.offsetHeight) {
                            h = chatWin.offsetHeight;
                        } else {
                            h = chatWin.offsetWidth * 9 / 16; //YouTube 16:9 aspect ratio
                        }
                        if (m[1].includes("youtu.be/")) {
                            l.activeDialogue().displayUnsanitizedMessage("YouTube", "<iframe src=\"https://www.youtube.com/embed/" + m[1].split("youtu.be/")[1] + "\" width=\"100%\" height=\"" + h + "\"></iframe>", { "class": "whisper received_whisper" }, { non_user: true });
                        } else if (m[1].includes("youtube.com/watch?v=")) {
                            l.activeDialogue().displayUnsanitizedMessage("YouTube", "<iframe src=\"https://www.youtube.com/embed/" + m[1].split("youtube.com/watch?v=")[1] + "\" width=\"100%\" height=\"" + h + "\"></iframe>", { "class": "whisper received_whisper" }, { non_user: true });
                        } else {
                            l.activeDialogue().displayUnsanitizedMessage("YouTube", "Invalid YouTube video url", { "class": "whisper received_whisper" }, { non_user: true });
                        }
                    } else {
                        open("https://www.youtube.com/results?search_query=" + z[1], "_blank");
                    }
                } else {
                    open("https://www.youtube.com", "_blank");
                }
                return false;
            });
            holodeck.addChatCommand("mp3", function (l, n) {
                var z = n.match(/^\/\S+\s+(.+)/);
                if (z[1].includes(".mp3")) {
                    l.activeDialogue().displayUnsanitizedMessage("MP3 Container", "<audio src=\"" + z[1] + "\" controls><embed src=\"" + z[1] + "\"	width=\"100%\" height=\"90\" loop=\"false\" autostart=\"true\"/>" + "</audio>", { "class": "whisper received_whisper" }, { non_user: true });
                } else {
                    l.activeDialogue().displayUnsanitizedMessage("MP3 Container", "Invalid mp3 url", { "class": "whisper received_whisper" }, { non_user: true });
                }
                return false;
            });
            holodeck.addChatCommand("img", function (l, n) {
                var z = n.match(/^\/\S+\s+(.+)/);
                if (z[1].includes(".jpg") || z[1].includes(".jpeg") || z[1].includes(".png") || z[1].includes(".gif") || z[1].includes(".bmp")) {
                    l.activeDialogue().displayUnsanitizedMessage("IMG Container", "<img src=\"" + z[1] + "\" style=\"max-width:100%; max-height:100%;\"/>", { "class": "whisper received_whisper" }, { non_user: true });
                } else {
                    l.activeDialogue().displayUnsanitizedMessage("IMG Container", "Invalid img url", { "class": "whisper received_whisper" }, { non_user: true });
                }
                return false;
            });
            holodeck.addChatCommand("time", function (l, n) {
                var today = new Date();
                var format = today.getDate() + "/" + (today.getMonth() + 1) + "/" + today.getFullYear() + ", " + today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
                l.activeDialogue().displayUnsanitizedMessage("Date/Time", format, { "class": "whisper received_whisper" }, { non_user: true });
                return false;
            });
            holodeck.addChatCommand("reload", function (l, n) {
                location.reload();
                return false;
            });
            holodeck.addChatCommand("reloadgame", function (l, n) {
                activateGame(); // Default function on Kongregate to reload/activate game
                return false;
            });
            holodeck.addChatCommand("removegame", function (l, n) {
                try {
                    var gametd = document.getElementById("gameholder");
                    gametd.parentNode.removeChild(gametd);
                    var width = document.getElementById("chat_container").offsetWidth;
                    width = (width > 550 ? width + 5 : 570) + "px";
                    document.getElementById("flashframecontent").style.width = width;
                    document.getElementById("maingamecontent").style.width = width;
                    var maingame = document.getElementById("maingame");
                    maingame.style.width = width;
                    maingame.style.height = parseInt(maingame.style.height) + 5 + "px";
                } catch (e) {
                    l.activeDialogue().displayUnsanitizedMessage("Kong Bot", "No Game Found / Could not resize", { "class": "whisper received_whisper" }, { non_user: true });
                }
                return false;
            });
            holodeck.addChatCommand("clear", function (l, n) {
                holodeck._active_dialogue.clear();
                return false;
            });
            // holodeck.addChatCommand("report", function(l,n){
            //     var z = n.match(/^\/\S+\s+(.+)/);
            //     if (z) {
            //         m = z[1].split(" ");
            //         if (m[0] == "help"){
            //             l.activeDialogue().displayUnsanitizedMessage("Report Help", "To report someone, type /report username message, or just /report username. Both cases will bring up the report box in chat.", {"class":"whisper received_whisper"}, {non_user: true});
            //         }
            //         else if (m[0] == null){
            //             l.activeDialogue().displayUnsanitizedMessage("Report", "Invalid report format", {"class":"whisper received_whisper"}, {non_user: true});
            //         }
            //         else {
            //             var message;
            //             if (m[1] != undefined) {
            //                 var m2 = m.join(" ");
            //                 message = m2.substr(m2.indexOf(' ')+1);
            //             }
            //             else { message = "";}
            //             active_room.showChatNag(' ' +
            //                                                          '<div id="new_abuse_report" class="mvm mrl"><div id="abuse_form_internal" class="cntrBasic pam">' +
            //                                                          '<form accept-charset="UTF-8" action="http://www.kongregate.com/accounts/' + m[0] + '/abuse_reports" method="post" onsubmit="new Ajax.Request(\'http://www.kongregate.com/accounts/aidansos132231/abuse_reports\', {asynchronous:true, evalScripts:true, method:\'post\', parameters:Form.serialize(this)}); return false;"><div style="margin:0;padding:0;display:inline"><input name="utf8" type="hidden" value="✓"><input name="authenticity_token" type="hidden" value="ub9xDEoiIi+lRAPWsUL2yApjKAbA2XKTjRO/taF1zwE="></div>' +
            //                                                          '<dl>' +
            //                                                          '<dd class="report_options"><select id="select_type" label="Abuse Type" name="type" onchange="subjectChanged(\'' + m[0] + '\')">' +
            //                                                          '<option value="InappropriateUsernameReport">Inappropriate Username</option>' +
            //                                                          '<option value="InappropriateAvatarReport">Inappropriate Avatar</option>' +
            //                                                          '<option value="InappropriateProfileReport">Offensive Profile Content</option>' +
            //                                                          '<option selected="selected" value="InappropriateChatReport">Chat Behavior</option>' +
            //                                                          '<option value="OtherAbuseReport">Other</option></select></dd>' +
            //                                                          '<div id="description_field">' +
            //                                                          '<dd class="form_block" id="abuse_report_description_block">' +
            //                                                          '<dl>' +
            //                                                          '<span class="error_block error" id="abuse_report_description_error_block">' +
            //
            //                                                          '</span>' +
            //                                                          '<dd class="label_block" id="abuse_report_description_label_block">' +
            //                                                          '<label for="abuse_report_description" id="abuse_report_description_label">Please describe your reason for reporting ' + m[0] + ' using as much detail as possible. We don\'t need chat logs:</label>' +
            //                                                          '</dd>' +
            //                                                          '<dd id="abuse_report_description_control_block" class="input_block"><textarea cols="55" id="abuse_report_description" name="abuse_report[description]" rows="4">' + message + '</textarea></dd>' +
            //                                                          '</dl>' +
            //                                                          '</dd>' +
            //
            //                                                          '</div>' +
            //                                                          '</dl>' +
            //
            //                                                          '<p class="report_submission">' +
            //                                                          '<input class="submission_button" id="abuse_form_submit" onclick="try{}catch(e){};if(!this.elem_abuse_form_submit){this.elem_abuse_form_submit=$(\'abuse_form_submit\');this.spin_abuse_form_submit=$(\'abuse_form_submit_spinner\');this.restore=function(t){return function(){t.elem_abuse_form_submit.show();t.spin_abuse_form_submit.hide();Event.stopObserving(window, \'unload\', t.restore);}}(this);}this.elem_abuse_form_submit.hide();this.spin_abuse_form_submit.show();Event.observe(window, \'unload\', this.restore);" type="submit" value="submit"><span class="spinner" id="abuse_form_submit_spinner" style="display:none" title="loading…">​</span>' +
            //                                                          '<a href="#" onclick="$(\'abuse_form_internal\').remove(); return false;">cancel</a>' +
            //                                                          '</p>' +
            //                                                          '</form></div>' +
            //                                                          '</div>', {"class":"whisper received_whisper"}, {non_user: true});
            //
            //         }
            //     }
            //     return false;
            // });
            holodeck.addChatCommand("cry", function (l, n) {
                l.activeDialogue().displayUnsanitizedMessage("You're sad!", "(　-̥̥̥̥̥̥̥̥̥̥̥̥̥̥̥̥̥̥̥̥̥̥̥̥̥᷄◞ω◟-̥̥̥̥̥̥̥̥̥̥̥̥̥̥̥̥̥̥̥̥̥̥̥̥̥᷅ )", { "class": "whisper received_whisper" }, { non_user: true });
                return false;
            });
            holodeck._chat_commands.wiki = holodeck._chat_commands.wikipedia;
            holodeck._chat_commands.weep = holodeck._chat_commands.krie = holodeck._chat_commands.cry;
            holodeck._chat_commands.lol = holodeck._chat_commands.hi = holodeck._chat_commands.hmm = holodeck._chat_commands.test;
            holodeck._chat_commands.userlist = holodeck._chat_commands.username = holodeck._chat_commands.list;
            holodeck._chat_commands.date = holodeck._chat_commands.datetime = holodeck._chat_commands.now = holodeck._chat_commands.time;
            holodeck._chat_commands.math = holodeck._chat_commands.calc = holodeck._chat_commands.calculator;
            holodeck._chat_commands.goto = holodeck._chat_commands.http = holodeck._chat_commands.www = holodeck._chat_commands.url;
            holodeck._chat_commands.lvl = holodeck._chat_commands.level;
            holodeck._chat_commands.konghelp = holodeck._chat_commands.kongregatehelp = holodeck._chat_commands.khelp;
            holodeck._chat_commands.kongregate = holodeck._chat_commands.kong;
            holodeck._chat_commands.avglvl = holodeck._chat_commands.alvl = holodeck._chat_commands.avg;
            holodeck._chat_commands.close = holodeck._chat_commands.exit;
            holodeck._chat_commands.roominfo = holodeck._chat_commands.info;
            holodeck._chat_commands.friendsonline = holodeck._chat_commands.online;
            holodeck._chat_commands.u = holodeck._chat_commands.user;
            holodeck._chat_commands.admins = holodeck._chat_commands.administrator = holodeck._chat_commands.administrators = holodeck._chat_commands.admin;
            holodeck._chat_commands.dev = holodeck._chat_commands.devs = holodeck._chat_commands.developers = holodeck._chat_commands.developer;
            holodeck._chat_commands.mod = holodeck._chat_commands.mods = holodeck._chat_commands.moderators = holodeck._chat_commands.moderator;
            holodeck._chat_commands.hlvl = holodeck._chat_commands.highlevel = holodeck._chat_commands.hlevel = holodeck._chat_commands.highlvl;
            holodeck._chat_commands.llvl = holodeck._chat_commands.lowlevel = holodeck._chat_commands.llevel = holodeck._chat_commands.lowlvl;
            holodeck._chat_commands.mp = holodeck._chat_commands.getmp = holodeck._chat_commands.mostplayed;
        }
    }]);

    return Kongquer;
}(HolodeckScript);

//=require ../holodeckScript.js

var KongreLink = function (_HolodeckScript9) {
    _inherits(KongreLink, _HolodeckScript9);

    function KongreLink() {
        _classCallCheck(this, KongreLink);

        return _possibleConstructorReturn(this, (KongreLink.__proto__ || Object.getPrototypeOf(KongreLink)).call(this, 'Chat KongreLink', /^\/games/, true));
    }

    _createClass(KongreLink, [{
        key: "run",
        value: function run() {
            window.location.assign("javascript:void(holodeck.addIncomingMessageFilter(function(m,n){var REGEX=/((?:<\\S[^>]+?)?(?:>)?)?(\\b(?:(?:(ht|f)tp)s?:\\/\\/)?(((?:\\w+[.])?(?:[a-z0-9][a-z0-9\\-]{0,61}[a-z0-9]|[a-z0-9]{1,2})[.])*(a(?:c|d|e(?:ro)?|f|g|i|l|m|n|o|q|r(?:pa)?|s(?:ia)?|t|u|w|x|z)|b(?:a|b|d|e|f|g|h|i|iz|j|l|m|n|o|r|s|t|v|w|y|z)|c(?:at?|c|d|f|g|h|i|k|l|m|n|o(?:m|op)?|r|u|v|x|y|z)|d[ejkmoz]|e(?:c|du|e|g|h|r|s|t|u)|f[ijkmor]|g(?:a|b|d|e|f|g|h|i|l|m|n|ov|p|q|r|s|t|u|w|y)|h[kmnrtu]|i(?:d|e|l|m|n(?:fo|t)|o|q|r|s|t)|je|jm|jo|jobs|jp|k[eghimnprwyz]|l[abcikrstuvy]|m(?:a|c|d|e|f|g|h|i?l|k|m|n|o(?:bi)?|p|q|r|s|t|u(?:seum)?|v|w|x|y|z)|n(?:a(?:me)?|c|et?|f|g|i|l|o|p|r|u|z)|om|org|p(?:a|e|f|g|h|k|l|m|n|ro?|s|t|w|y)|qa|r[eosuw]|s(?:a|b|c|d|e|g|h|i|j|k|l|m|n|o|r|t|u|v|y|z)|t(?:c|d|e?l|f|g|th|j|k|m|n|o|p|r(?:avel)?|t|v|w|z)|u[agkmsyz]|v[aceginu]|w[fs]|y[etu]|z[amw])\\b([.]\\B)?|\\d+[.]\\d+[.]\\d+[.]\\d+)(?::\\d+)?)(\\/+\\??(?:\\S+))?/ig,lF=/(?:<(\\S)[^>]+?href=[\"'])(?:\\b((?:(ht|f)tp)s?:\\/\\/)?(((?:\\S+[.])?(?:[a-z0-9][a-z0-9\\-]{0,61}[a-z0-9]|[a-z0-9]{1,2})[.])*(a(?:c|d|e(?:ro)?|f|g|i|l|m|n|o|q|r(?:pa)?|s(?:ia)?|t|u|w|x|z)|b(?:a|b|d|e|f|g|h|i|iz|j|l|m|n|o|r|s|t|v|w|y|z)|c(?:at?|c|d|f|g|h|i|k|l|m|n|o(?:m|op)?|r|u|v|x|y|z)|d[ejkmoz]|e(?:c|du|e|g|h|r|s|t|u)|f[ijkmor]|g(?:a|b|d|e|f|g|h|i|l|m|n|ov|p|q|r|s|t|u|w|y)|h[kmnrtu]|i(?:d|e|l|m|n(?:fo|t)|o|q|r|s|t)|je|jm|jo|jobs|jp|k[eghimnprwyz]|l[abcikrstuvy]|m(?:a|c|d|e|f|g|h|i?l|k|m|n|o(?:bi)?|p|q|r|s|t|u(?:seum)?|v|w|x|y|z)|n(?:a(?:me)?|c|et?|f|g|i|l|o|p|r|u|z)|om|org|p(?:a|e|f|g|h|k|l|m|n|ro?|s|t|w|y)|qa|r[eosuw]|s(?:a|b|c|d|e|g|h|i|j|k|l|m|n|o|r|t|u|v|y|z)|t(?:c|d|e?l|f|g|th|j|k|m|n|o|p|r(?:avel)?|t|v|w|z)|u[agkmsyz]|v[aceginu]|w[fs]|y[etu]|z[amw])\\b([.]\\B)?|\\d+[.]\\d+[.]\\d+[.]\\d+)(?::\\d+)?)?(\\/+(?:\\S+))??(?:[\"'][^>]*?>([\\s\\S]+?)<\\/\\1>)/gi,q=function(w,c,r,l){var t,a,d;w=w.substring(0,(t=r.lastIndex)-(a=c[0]).length)+(a=(\"<a \"+(l?l[1]:'')+\" href='\"+(((d=c[3])==\"ht\"||d==\"f\")?\"\":\"http://\")+(d=a).replace(/<a[^>]+?href=([\"'])([\\s\\S]+?)\\1[^>]*?>[\\s\\S]+<\\/a>/, \"$2\")+\"' target='_blank'>\"+(c[9]||d)+\"</a>\"))+w.substring(t,w.length);REGEX.lastIndex+=a.length-d.length;return w},Q=function(b){var w=b,t=REGEX.lastIndex=0,a,c,d;while(c=REGEX.exec(w)){if(c[1]||(!c[5]&&!c[7])||(c[7]&&!(c[3]||c[8])))continue;w=q(w,c,REGEX)};while(c=lF.exec(w)){c[3]='ht';w=q(w,c,lF,c[0].match(/(class=(['\"])[^>]+?\\2)[\\s\\S]*?>/i))};return w};return n(Q(m),n)}))");
        }
    }]);

    return KongreLink;
}(HolodeckScript);

//=require ../script.js

var LargerAvatars = function (_Script3) {
    _inherits(LargerAvatars, _Script3);

    function LargerAvatars() {
        _classCallCheck(this, LargerAvatars);

        return _possibleConstructorReturn(this, (LargerAvatars.__proto__ || Object.getPrototypeOf(LargerAvatars)).call(this, 'Larger Forum Avatars', /\/(topics|posts|messages|private_messages)/, true));
    }

    _createClass(LargerAvatars, [{
        key: "run",
        value: function run() {
            var aStyle = document.createElement("style");
            aStyle.innerHTML = ".post .user_avatar, .messages_table .user_avatar {width: 80px; height: 80px;} .sender_info {width: auto !important;}"; //Change px values for different sizes
            var head = document.getElementsByTagName("head")[0];
            head.appendChild(aStyle);

            //Replace avatar image with non-pixelated version
            var aImgs = document.getElementsByClassName("hover_profile");
            for (var i = 0; i < aImgs.length; i++) {
                aImgs[i].innerHTML = aImgs[i].innerHTML.replace("width:40", "width:140");
            }

            // This and its grant tag mess things up... :/
            // GM_addStyle(".post .author {width: 260px; #feature {width: 952px;}}");
        }
    }]);

    return LargerAvatars;
}(Script);
//=require ../script.js

var LevelExtension = function (_Script4) {
    _inherits(LevelExtension, _Script4);

    function LevelExtension() {
        _classCallCheck(this, LevelExtension);

        var _this15 = _possibleConstructorReturn(this, (LevelExtension.__proto__ || Object.getPrototypeOf(LevelExtension)).call(this, 'Level Extension', /^\//, true));

        var lethis = _this15;
        _this15.UserStorage = {
            levelPoints: [],
            REAL_MAX_LVL: 75,
            FAKE_MAX_LVL: 100,
            USER_INFO: 'https://www.kongregate.com/api/user_info.json?username='
        };

        _this15.UserStorage.levelPoints[75] = 57885;
        _this15.UserStorage.levelPoints[76] = 60485;
        _this15.UserStorage.levelPoints[77] = 63180;
        _this15.UserStorage.levelPoints[78] = 65970;
        _this15.UserStorage.levelPoints[79] = 68855;
        _this15.UserStorage.levelPoints[80] = 71835;
        _this15.UserStorage.levelPoints[81] = 74920;
        _this15.UserStorage.levelPoints[82] = 78110;
        _this15.UserStorage.levelPoints[83] = 81405;
        _this15.UserStorage.levelPoints[84] = 84805;
        _this15.UserStorage.levelPoints[85] = 88310;
        _this15.UserStorage.levelPoints[86] = 91930;
        _this15.UserStorage.levelPoints[87] = 95665;
        _this15.UserStorage.levelPoints[88] = 99515;
        _this15.UserStorage.levelPoints[89] = 103480;
        _this15.UserStorage.levelPoints[90] = 107560;
        _this15.UserStorage.levelPoints[91] = 111765;
        _this15.UserStorage.levelPoints[92] = 116095;
        _this15.UserStorage.levelPoints[92] = 116095;
        _this15.UserStorage.levelPoints[93] = 120550;
        _this15.UserStorage.levelPoints[94] = 125130;
        _this15.UserStorage.levelPoints[95] = 129835;
        _this15.UserStorage.levelPoints[96] = 134675;
        _this15.UserStorage.levelPoints[97] = 139650;
        _this15.UserStorage.levelPoints[98] = 144760;
        _this15.UserStorage.levelPoints[99] = 150005;
        _this15.UserStorage.levelPoints[100] = 155385;

        _this15.Actions = {
            HEADER: function HEADER(le) {
                le.createCapChanger();

                var ks = new le.KongScript();
                ks.waitFor('active_user', le, null, 50).then(function (active_user) {
                    var user = new le.LevelCapUser(active_user.username());
                    user.points = active_user.points();
                    user.getLevel().then(function (level) {
                        if (level < le.UserStorage.REAL_MAX_LVL) return;

                        // Update nav_welcome_box levelbug
                        var levelbug = document.getElementById('mini-profile-level');
                        le.updateLevelbug(levelbug, level);

                        // Update my kong hover profile
                        le.updateMyKongProfile(user);
                    }).catch(function (err) {
                        console.log(err);
                    });
                });
            },

            CHAT: function CHAT(le) {
                var ks = new le.KongScript();
                ks.waitFor('ChatRoom', le).then(function (cr) {
                    ks.waitFor('MiniProfile', le);
                }).then(function (mp) {
                    ks.waitFor('holodeck', le);
                }).then(function (h) {
                    le.injectChatRoomCode();
                    le.injectMiniProfileCode();
                });
            },

            PROFILE: function PROFILE(le) {
                var user = new le.ProfileUser();
                user.getPoints().then(function (points) {
                    if (points < le.UserStorage.levelPoints[le.UserStorage.REAL_MAX_LVL]) return Promise.reject('No need to update.');

                    return user.getLevel(le);
                }).then(function (level) {
                    // Update level number
                    var htmlLevel = document.getElementById('user_level').getElementsByTagName('a')[1].getElementsByTagName('span')[0];
                    htmlLevel.innerHTML = '' + level;

                    // Update levelbug
                    var levelbug = document.getElementById('profile_hgroup').getElementsByClassName('levelbug')[0];
                    le.updateLevelbug(levelbug, level);

                    le.updateProfileProgressBar(user.points, user.level);
                }).catch(function (err) {
                    console.log(err);
                });
            },

            LEVELBUG: function LEVELBUG(le) {
                Array.from(document.getElementsByClassName("levelbug")).filter(function (a) {
                    return a.innerText;
                }).forEach(function (levelbug) {
                    var user = new le.LevelCapUser(levelbug.innerText);
                    user.getPoints().then(function (points) {
                        if (points < le.UserStorage.levelPoints[le.UserStorage.REAL_MAX_LVL]) return Promise.reject('No need to update.');

                        return user.getLevel(le);
                    }).then(function (level) {
                        le.updateLevelbug(levelbug, level);
                    }).catch(function (err) {
                        console.log(err);
                    });
                });
            },

            HOVER_BOX: function HOVER_BOX(le) {
                var ks = new le.KongScript();

                ks.waitFor('UserProfileHoverbox', le).then(function (u) {
                    le.injectUserProfileHoverbox();
                });
            }

        };

        _this15.UpdateActions = [{
            pattern: new RegExp('https?://www.kongregate.com', 'i'),
            actions: [_this15.Actions.HEADER, _this15.Actions.HOVER_BOX, _this15.Actions.LEVELBUG]
        }, {
            pattern: new RegExp('https?://www.kongregate.com/accounts/', 'i'),
            actions: [_this15.Actions.PROFILE]
        }, {
            pattern: new RegExp('https?://www.kongregate.com/games/', 'i'),
            actions: [_this15.Actions.CHAT]
        }];

        _this15.KongScript = function () {};
        _this15.KongScript.prototype = {

            CHECK_TIMEOUT: 10, // seconds before reaching timeout
            CHECK_INTERVAL: 100, // milliseconds between class existance check

            /**
             *	Waits for a class to be defined.
             *
             *	@param	{String}	className The class name to wait for.
             *	@param	{Number}	[timeout=CHECK_TIMEOUT] Seconds before timeout
             *	@param	{Number}	[interval=CHECK_INTERVAL] Milliseconds between
             *		each check.
             *
             *	@return a promise that is fulfilled whenever the class is defined
             *		and is rejected when the timeout is reached.
             */
            waitFor: function waitFor(className, ctx, timeout, interval) {
                if (!className || !ctx) return Promise.reject('Class name must be specified with context.');

                timeout = timeout !== undefined ? timeout : this.CHECK_TIMEOUT;
                interval = interval !== undefined ? interval : this.CHECK_INTERVAL;

                return new Promise(function (resolve, reject) {
                    var checkTimes = timeout * 1000 / interval;
                    var timeInterval = setInterval(function () {
                        if (ctx.dom.window[className]) {
                            console.log(className + ' loaded.');

                            resolve(ctx.dom.window[className]);
                            clearInterval(timeInterval);
                        } else if (checkTimes-- <= 0) {
                            console.log('Timeout.');

                            reject(className + ' couldn\'t be loaded.');
                            clearInterval(timeInterval);
                        }
                    }, interval);
                });
            }
        };

        _this15.ProfileUser = function () {
            this.points = null;
            this.level = null;
        };
        _this15.ProfileUser.prototype = {

            /**
             *	Return points based on the points in the loaded profile page.
             */
            getPoints: function getPoints() {
                var promise,
                    user = this;

                if (user.points === null) {
                    promise = new Promise(function (resolve, reject) {
                        var reps = 0;
                        var interval = setInterval(function () {
                            var user_points = document.getElementById('user_points');
                            var navPoints = user_points ? user_points.getElementsByClassName('user_metric_stat')[0].getElementsByTagName('span')[0] : null;

                            if (navPoints) {
                                var points = parseInt(navPoints.textContent);
                                user.points = points;
                                resolve(points);

                                clearInterval(interval);
                            }

                            if (reps++ > 10000) {
                                reject();

                                clearInterval(interval);
                            }
                        }, 100);
                    });
                } else {
                    promise = Promise.resolve(user.points);
                }

                return promise;
            },

            getLevel: function getLevel(le) {
                var user = this;

                if (user.level === null) {
                    var promise = user.getPoints().then(function (points) {
                        var level = le.UserStorage.REAL_MAX_LVL;
                        while (level <= le.UserStorage.FAKE_MAX_LVL && points >= le.UserStorage.levelPoints[level]) {
                            level++;
                        }return user.level = level - 1;
                    });

                    return promise;
                } else {
                    return Promise.resolve(user.level);
                }
            }

        };

        _this15.LevelCapUser = function (username) {
            this.username = username;
            this.points = null;
            this.level = null;
        };
        _this15.LevelCapUser.prototype = {

            /**
             *	Return the user points. If points weren't loaded, it will load them
             *	with an http request.
             *
             *	@return a promise resolved with user points.
             */
            getPoints: function getPoints() {
                var user = this;

                if (user.points === null) {
                    var promise = lethis.HttpGetPromise(lethis.UserStorage.USER_INFO + user.username).then(function (json) {
                        return JSON.parse(json).user_vars.points;
                    }).then(function (points) {
                        return user.points = points;
                    });

                    return promise;
                } else {
                    return Promise.resolve(user.points);
                }
            },

            /**
             *	Return the user level. If points weren't loaded, it will load them
             *	with an http request.
             *
             *	@return a promise resolverd with user level.
             */
            getLevel: function getLevel() {
                var user = this;

                if (user.level === null) {
                    var promise = user.getPoints().then(function (points) {
                        console.log(lethis.UserStorage, user.level);
                        var level = lethis.UserStorage.REAL_MAX_LVL;
                        while (level <= lethis.UserStorage.FAKE_MAX_LVL && points >= lethis.UserStorage.levelPoints[level]) {
                            level++;
                        }return user.level = level - 1;
                    });

                    return promise;
                } else {
                    return Promise.resolve(user.level);
                }
            }

        };

        _this15.ChatUserStorage = function () {
            this.users = {};
        };
        _this15.ChatUserStorage.prototype = {
            /**
             *	Return the level of the user.
             *
             *	@return user level.
             */
            getLevel: function getLevel(username) {
                username = username.toLowerCase();
                console.log(lethis.LevelCapUser);
                if (this.users[username] === undefined) this.users[username] = new lethis.LevelCapUser(username);

                return this.users[username].getLevel();
            }

        };
        return _this15;
    }

    _createClass(LevelExtension, [{
        key: "run",
        value: function run() {
            var _this16 = this;

            window.addEventListener('load', function () {
                _this16.createLevelbugCSS();
                _this16.getFakeMaxLevel();
                _this16.UpdateActions.forEach(function (uAction, i, arr) {
                    if (uAction.pattern.test(document.URL)) uAction.actions.forEach(function (f, i, arr) {
                        f(_this16);
                    });
                });
            });
        }

        // Update profile progress bar

    }, {
        key: "updateProfileProgressBar",
        value: function updateProfileProgressBar(points, level) {
            if (points >= this.UserStorage.levelPoints[this.UserStorage.FAKE_MAX_LVL]) return;

            var currLevelPoints = this.UserStorage.levelPoints[level],
                nextLevelPoints = this.UserStorage.levelPoints[level + 1],
                pointsLeft = nextLevelPoints - points,
                pointsBetween = nextLevelPoints - currLevelPoints,
                percentageRemaining = 100 * (1 - pointsLeft / pointsBetween);

            var pointsInfo = document.createElement('span');
            pointsInfo.className = 'points_bar_container';

            var pointsInfoP = document.createElement('p');
            pointsInfo.appendChild(pointsInfoP);

            var pointsBarContainer = document.createElement('points_bar_container');
            pointsBarContainer.className = 'points_info mlm';
            pointsBarContainer.innerHTML = 'Points needed for next level: <strong class="points_to_level_up">' + pointsLeft + '</strong></span>';
            pointsInfoP.appendChild(pointsBarContainer);

            var pointsBar = document.createElement('span');
            pointsBar.className = 'points_bar mhm';
            pointsInfoP.appendChild(pointsBar);

            var pointsProgress = document.createElement('span');
            pointsProgress.className = 'points_progress';
            pointsProgress.setAttribute('style', 'width:' + percentageRemaining + '%;');
            pointsBar.appendChild(pointsProgress);

            var pointsLevel = this.createLevelbug(level + 1);
            pointsInfoP.appendChild(pointsLevel);

            document.getElementById('profile_heading').appendChild(pointsInfo);
        }
    }, {
        key: "HttpGetPromise",
        value: function HttpGetPromise(url) {
            return new Promise(function (resolve, reject) {
                var xhr = new XMLHttpRequest();
                xhr.open('GET', url, true);
                xhr.send();

                xhr.addEventListener('load', function () {
                    if (this.status == 200) {
                        resolve(this.responseText);
                    } else {
                        reject(this.statusText);
                    }
                });

                xhr.addEventListener('error', function () {
                    reject(this.statusText);
                });
            });
        }
    }, {
        key: "updateMyKongProfile",


        // Update my kong hover profile
        value: function updateMyKongProfile(user) {
            var points = user.points,
                level = user.level;

            // Update levelbug
            var userP = document.getElementById('main_nav_mykong').getElementsByClassName('user')[0];
            this.updateLevelbug(userP.getElementsByClassName('levelbug')[0], level);

            if (level == this.UserStorage.FAKE_MAX_LVL) return;

            // Remove cake and draw points left message, level progress bar and
            // next level levelbug
            var pointsNeeded = this.UserStorage.levelPoints[level + 1] - points;
            var pointsPercent = 100 * (points - this.UserStorage.levelPoints[level]) / (this.UserStorage.levelPoints[level + 1] - this.UserStorage.levelPoints[level]);

            var pointsP = document.createElement('p');
            pointsP.className = 'points';
            pointsP.innerHTML = '<strong>' + pointsNeeded + ' points</strong> needed for the next level';

            var barP = document.createElement('p');
            barP.className = 'progress';

            var barSpan = document.createElement('span');
            barSpan.className = 'progress_bar';
            barP.appendChild(barSpan);

            var barPercentSpan = document.createElement('span');
            barPercentSpan.className = 'progress_percent';
            barPercentSpan.setAttribute('style', 'width:' + pointsPercent + '%;');
            barSpan.appendChild(barPercentSpan);

            var levelStrong = document.createElement('strong');
            levelStrong.className = 'level';
            levelStrong.innerHTML = 'Level';
            barP.appendChild(levelStrong);

            var levelbug = this.createLevelbug(level + 1);
            levelStrong.appendChild(levelbug);

            var cake = document.getElementsByClassName('points w_cake')[0];

            var parent = cake.parentNode;
            parent.removeChild(cake);
            parent.appendChild(pointsP);
            parent.appendChild(barP);
        }
    }, {
        key: "injectChatRoomCode",
        value: function injectChatRoomCode() {
            ChatRoom.prototype._updateUser = ChatRoom.prototype.updateUser;
            var lethis = this;
            ChatRoom.prototype.updateUser = function (a, b) {
                holodeck.uStorage = holodeck.uStorage || new lethis.ChatUserStorage();

                var u = a.variables,
                    chatRoom = this;
                if (u.level == lethis.UserStorage.REAL_MAX_LVL) {
                    holodeck.uStorage.getLevel(u.username).then(function (level) {
                        u.level = level;
                        chatRoom._updateUser(a, b);
                    });
                } else {
                    this._updateUser(a, b);
                }
            };
        }
    }, {
        key: "injectMiniProfileCode",
        value: function injectMiniProfileCode() {
            var lethis = this;
            MiniProfile.prototype.activate = function (a, b) {
                this._chat_window.setActiveTempPane(this);
                this._current_username = a;
                this._current_room = b;
                var c = this._container,
                    d = this._chat_window,
                    e = this;
                $("user_mini_profile").update("");
                c.down(".room_name").update(b.name());
                d.hideChatWindow();
                d._chat_tab_clicked = !1;
                c.ieHappyShow();
                d.showSpinner();
                new Ajax.Updater({
                    success: "user_mini_profile"
                }, "/accounts/" + a + ".chat", {
                    method: "get",
                    onComplete: function onComplete() {
                        // Change only if the user is max lvl
                        holodeck.uStorage.getLevel(a).then(function (level) {
                            var miniProfile = document.getElementById('user_mini_profile');
                            var levelRegExp = /level_([0-9]*)/i;

                            if (level >= lethis.UserStorage.REAL_MAX_LVL) miniProfile.innerHTML = miniProfile.innerHTML.replace(levelRegExp, 'level_' + level);

                            !1 === d._chat_tab_clicked && (d.hideSpinner(), e.setupBanAndSilencingControls(a), active_user.addCapturedSelector("#add_friend"), active_user.addCapturedSelector("#mute_user"));
                        });
                    }
                });
            };
        }
    }, {
        key: "injectUserProfileHoverbox",
        value: function injectUserProfileHoverbox() {
            UserProfileHoverbox.prototype._openHoverbox = UserProfileHoverbox.prototype.openHoverbox;
            var p = UserProfileHoverbox.prototype.openHoverbox.__proto__;
            var lethis = this;

            UserProfileHoverbox.prototype.openHoverbox = function () {
                var hoverbox = this;
                var user = this._currentUserAnchor.href.match(/accounts\/(.*)/i)[1];

                if (this._hoverboxCache[this._currentUserAnchor.href]) {
                    hoverbox._openHoverbox();
                } else {
                    var u = new lethis.LevelCapUser(user);
                    u.getLevel().then(function (level) {
                        hoverbox._openHoverbox();

                        if (level < lethis.UserStorage.REAL_MAX_LVL) return;

                        hoverbox._hoverbox.observe('afterOpen', function () {
                            var l = hoverbox._hoverbox.container.getElementsByClassName('mini_profile_level')[0];
                            l.getElementsByTagName('span')[0].textContent = '' + level;
                        });
                    }).catch(function (err) {
                        // Open it anyways, but the level may be capped at max
                        hoverbox._openHoverbox();
                        console.log(err);
                    });
                }
            };
            // Restoring __proto__ because firefox rips if not
            UserProfileHoverbox.prototype.openHoverbox.__proto__ = p;
        }
    }, {
        key: "createLevelbug",
        value: function createLevelbug(level) {
            var levelbug = document.createElement('span');
            levelbug.className = 'spritesite levelbug level_' + level;
            levelbug.alt = 'Levelbug ' + level;
            levelbug.title = 'Level ' + level;

            return levelbug;
        }
    }, {
        key: "updateLevelbug",
        value: function updateLevelbug(levelbug, level) {
            levelbug.className = levelbug.className.replace(/level_[0-9]*/, 'level_' + level);
            levelbug.title = 'Level ' + level;
        }
    }, {
        key: "getFakeMaxLevel",
        value: function getFakeMaxLevel() {
            var l = localStorage.getItem('fake_max_level');

            if (l !== null) this.UserStorage.FAKE_MAX_LVL = l;
        }
    }, {
        key: "setFakeMaxLevel",
        value: function setFakeMaxLevel() {
            var level = window.prompt('Set the new level cap.', this.UserStorage.FAKE_MAX_LVL);
            level = parseInt(level);

            if (level > 75 && level <= 100) {
                this.UserStorage.FAKE_MAX_LVL = level;
                localStorage.setItem('fake_max_level', level);
            } else if (!isNaN(level)) alert('New level cap must be between 76 and 100');
        }

        // Creates the button to change the level cap

    }, {
        key: "createCapChanger",
        value: function createCapChanger() {
            var _this17 = this;

            var levelCapChanger = document.createElement('li');

            var levelCapStyle = document.createElement('style');
            levelCapStyle.innerHTML = "#level_cap_control::after {border-bottom:1px dotted #9b9a9a;bottom:0;content:'';display:block;left:11px;position:absolute;right:11px;}";
            levelCapChanger.appendChild(levelCapStyle);

            var linkCapChanger = document.createElement('a');
            linkCapChanger.id = 'level_cap_control';
            linkCapChanger.innerHTML = 'Level cap';
            linkCapChanger.href = '#';
            linkCapChanger.addEventListener('click', function () {
                _this17.setFakeMaxLevel();
            });
            levelCapChanger.appendChild(linkCapChanger);

            var signOut = document.getElementById('welcome_box_sign_out');
            var cogList = signOut.parentNode.parentNode;
            cogList.insertBefore(levelCapChanger, signOut.parentNode);
        }

        // Creates new levelbug css classes till level 100

    }, {
        key: "createLevelbugCSS",
        value: function createLevelbugCSS() {
            var levelStyle = document.createElement('style');

            for (var i = this.UserStorage.REAL_MAX_LVL; i <= this.UserStorage.FAKE_MAX_LVL; i++) {
                levelStyle.innerHTML += '.level_' + i + '{background-position: 100% ' + (-1755 - 20 * (i - this.UserStorage.REAL_MAX_LVL)) + 'px;}';
            }document.head.appendChild(levelStyle);
        }
    }]);

    return LevelExtension;
}(Script);

//=require ../holodeckScript.js

var PmNotifier = function (_HolodeckScript10) {
    _inherits(PmNotifier, _HolodeckScript10);

    function PmNotifier() {
        _classCallCheck(this, PmNotifier);

        return _possibleConstructorReturn(this, (PmNotifier.__proto__ || Object.getPrototypeOf(PmNotifier)).call(this, 'Chat PM Notifier', /^\/games/, true));
    }

    _createClass(PmNotifier, [{
        key: "run",
        value: function run() {
            var dom = this.dom,
                holodeck = dom.holodeck,
                CDialogue = dom.ChatDialogue;

            if (CDialogue) {
                CDialogue.prototype = dom.CDprototype || dom.ChatDialogue.prototype;
                if (!CDialogue.prototype.new_private_message) {
                    dom._animatedFav = false;
                    dom._pmCount = 0;
                    dom._baseTitle = document.title;
                    dom._blurred = false;
                    dom._chime = dom.document.createElement('audio');
                    dom._chime.setAttribute('src', 'data:audio/wav;base64,UklGRi4IAABXQVZFZm10IBAAAAABAAEAESsAABErAAABAAgAZGF0YakHAACAgIGBgYKEh4qLjIyNjY2LioqJh4aGio2QkZGRkI6Lh4B3cXJ0dnp/g4aHiImDdm1pZmVnbHR6fYGLlZuhpKOgnp2dnJGCdWldU0pEPjgyOktaaHR+homLjZWYjn9wYFJNSUZCPkNadYuitMXU2+Dn7uXRv7KnoaCkqKagpLO8wsfJyMG7uLetlYBzaF5ZVFNVVFFWYmt1fH58dm9pZl9NOy4hFQsEBAgKDRwyQ1NldICIi4+Xm5iVkId/eHR0dHN0gZWnuMna6fX6/P/979/Ova+knpybmJWZoaOlp6elopuVk4t7bF9SSUNAP0JGR0xZZXB8g4eLjod6aVdJPjEjHyUwPUlSXnKEiYF0aF1SQjIvOEdZa3iJnaqspp6WlZOLipSlus7d5vD17t/Qv7Oup5+cpbPCztHT1dTFrZN6ZVhLPjo/SVRcW1xiZFtKNiQYEAgAAg4fMkBIUV5mZV9ZVVpjZ218kanB0tzl7Ori2M/IyMrIydDd6vX49fHt4cy0nYd5cGVdXWJpb29pZmZhVEIuHRIMBQAEDhonMTY9RkxMSkVCRk9UWWV3ip6uusPLzcrFwLu7wMPFy9fj7/j6+PTs38y4o5OJgXhzdnuAhYR/endvYU87KiAaEw8SGyYxO0BGTlJQS0VAQEZKTllrf5WsvcHBwcC8s62xvcfT4+/z9vn359PEuayhm5iTi4J3alpQTkxFPjovIRYNBQIKHC0+UGFkXltbWFRXaX+UqsPZ4+fq6uHUzs7LyMvT19HGt5+Da19YVFJWW1ZNRTwvJis2QElVX1tRS05QUmF8mbHK5vn79e7j0b60rqqorLjCv7WnkHFVRDYtKzE2NDAvLysnLDlDTVpna2NdYmptdYqlu9Dn+v/68+zeyLavq6eor7i+vbeslnZcTkAzLS0uKiUmJiIdIzE6PkRMTUQ8P0ZLU2mJpLrT7Pv8+fXs28rEwr67v8vW1Mm/uLCllHdeVlJHNichIy5AXH2NjYuKhXpsaHJ6eHFoXFVWYHF2bWFVR0FETFdbV1piZ25/l7TM1tnZ0MfDwcPN1NTKtZ6Uj4iEgHRlU0I+RElSW1tZV1NTXGp/m662uLGloKCls8DCuaaMd2lgX2JeU0Y2KyszP0xSUFBQTlJfc4uisr/Hw7y8wMfS2NTHr5OAdGtpa2pmXlNNUFVaX15bWlhWW2RziJ2uvcbGwsC+wMXHw7ikjXpsY2JmZ2ZhV05LTE5RT0lFRUVKU2Fzhpajr7Owr66usrW0rqGNe25kXl9gX1xVTUtMT1RYWFdZXGFqdYSVpbG7wsK+vLm5vL26sqibj4d/enp5dW9mXFZTUFBQS0dGR0pSYHWGjY2RnK7Ayse3opOSmJaGbFFFSVRWTDwyPVd2iIh8cHWKqr++pouAh5idjGtLP0hdZ1xGOENkj6+2rKCmwOP589aznp+rq5RrQzI7UWBbSDU2T3eaqJ+NhpOwy9G/n4eDjpaIZDodGSk8PzMgGCdLdI+XkIuWstXq5syunaGtr5p0TTg6SlZTRTc3TnWarayhnarH5fPpzK6en6SehmJBMjVCRz4sHiE5X4CRj4WBjqnH1c62npOVmpV/YEU7QlBXTjwtLUJkhZeZk5GbscnVzrunnZ6jnolpSz1BUl9fUkRATmqKoKejnqCsvsnEspyNjJOWinFUPjhATVJMQDg8TmiAjZGSl6S5zNTMu6mhpKqpm4BjT0pPWFpTS0ZNXHGAh4aDhIydrbOsnIyGipSZkoFwYVZQUVRZYGdpa25sZWNpdoynur65rqKZlpaVl56ioJmLdV9SS09bZmZcTj4xMjtIU1xbVFJWWFdZXmp/ma24vbispaixvMza39rQwK6gl4yCgYOCfHBcRzs7QEpXW1ZOR0A9Q09gdo2eqK+xqZ+Zl5qltL/AuKaOeWxlYmVrbWpjWk5HRklOVl1fXVxbV1ZbZ3eMn6y0ubq1sK6vsLa9wsTAtqaViH52c3V1cWpgVU5MTk9RVFNQUVNUVVpganeIlZ6kpaGbl5eYm6Glp6ahmY2De3JtbG5vbmpiWlVWWV1jZmZjY2VnbHJ5gImSmqCmqaijn5ybnaKmqKahmZCKhYF9enh0cW5qZmRiYmJkZmdnaGhoaWtvdX2EiYyOkZKSkZGQj5CRkpOSkIqFgHt3dXNyc3R1dnl9gYOBfXh1c3Fta2xvcnV3e4CEhoaGhoiIhoSEhomNkJSan6GhnpuZlpGMiIaGhYOCg4WGhoOBfXp1cGtnZ2dnZ2hrbm9ubGtqaWdmZmltcHN2eXx9fHp6ent7e3x/g4iMj5KWmZqamZeWlJGOi4qJiYmJiouNjY2LioiFgn98e3p5eXl5ent7e3p6enp6enp6e3x8fH19fX19fn5+fn5+f39/f39/f3+AgICAgICAgICBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgABMSVNUWAAAAElORk9JQ09QHwAAAENvcHlyaWdodCCpIENpbmVtYXRyb25pY3MgMTk5NQAASVBSRCMAAABNaWNyb3NvZnQgUGx1cyEgriBmb3IgV2luZG93cyA5NSCuAAA=');
                    dom._chime.load();

                    //dom.document.addEventListener("blur", function() {
                    dom.window.onblur = function () {
                        dom._blurred = true;
                    }; //, false);
                    //dom.document.addEventListener("focus", function() {
                    dom.window.onfocus = function () {
                        dom._blurred = false;
                        dom.pmReset();
                    }; //, false);

                    dom.pmReset = function () {
                        if (dom._animatedFav) {
                            dom.toggleFavLink();
                        }
                        dom._pmCount = 0;
                        document.title = dom._baseTitle;
                    };

                    dom.createFavLink = function (attr) {
                        var link = document.createElement("link");
                        link.type = attr.type;
                        link.rel = attr.rel;
                        link.href = attr.href;
                        return link;
                    };

                    dom.toggleFavLink = function () {
                        var head = document.getElementsByTagName("head")[0];
                        var links = head.getElementsByTagName("link");
                        for (var i = 0; i < links.length; i++) {
                            var link = links[i];
                            if (link.rel == "shortcut icon") {
                                head.removeChild(link);
                            }
                        }
                        if (dom._animatedFav) {
                            head.appendChild(dom.createFavLink(dom._staticFavLinkAttr));
                        } else {
                            head.appendChild(dom.createFavLink(dom._animatedFavLinkAttr));
                        }
                        dom._animatedFav = !dom._animatedFav;
                    };

                    dom._staticFavLinkAttr = {
                        'rel': 'shortcut icon',
                        'href': '/favicon.ico',
                        'type': 'image/x-icon'
                    };
                    dom._animatedFavLinkAttr = {
                        'rel': 'shortcut icon',
                        'href': 'data:image/gif;base64,R0lGODlhIAAgAPceAGYAAJgAAJgBAZkCApoEBJkWGpkAM5krAJkpL5krM6EMDKQPEaARDaYkLassIpkrZplVM5lVZswrM8xVM8xVZsyAZsyAmcyqmcyqzP+qzMzVzP/VzP/V////zP///wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAhkAAAAIf8LTkVUU0NBUEUyLjADAQAAACwAAAAAIAAgAAAI/gATBBhIsKDBgwgTKlyI0ABBgRADRBQ40MCBiRIzUgxAYYPHjyA3ZDgw0ELIkyMHQvDAsqVLlhQvvJzpgSIFmi9j4nRJMcHOlhQt/GQpgSCFCxxmXqhAoeBRmhssVDhYYeYDhDdfbkgAAGHVlxMOynx5wSFCAF9dRjAolCzDti7DEtQwsynDtC3XSszwUoOErm9nhk2w4WWGjQyz8kxA12UHhgbxsrTQgaZeyAHgDoWJOYDkoRswo8W5VXFLDJg1nyYZoPDLqXdnZijocyaEwC9vF1TtgUPsl3YLNnapYeFnxAMl0LSAMEEC3heQJxhLFnHtnaEHOgAtgOBmBAMXIGzuHqDAZoIMxg8kcH5gA/WdDQqYT59+/Pv449MfoCAgACH5BAhkAAAALAAAAAAgACAAh5kAAJwICP38/P39/f7+/v///wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAifAAsIHEiwoMGDCBMqXMiw4UEAECNKhDhwokWKFS9KzKgxIsGOHgWCDClyJEeQBTs+VLlyI8KLCi22nLhQZkqYNWl+tMmQZwGcDXkCDapzKNGRGB3+REryKFMASlkaTajxZNOYPpfqzOlyZ9aZSb1ufTlWbFeDVdGmNTsUKVufbq22NSlwwMgAA+2OFMCQgF+Cfv8qHUx4YWC/Aw4TGBgQADs%3D',
                        'type': 'image/gif'
                    };

                    CDialogue.prototype.new_private_message = function () {
                        if (dom._blurred || document.hidden !== undefined && document.hidden || document.webkitHidden !== undefined && document.webkitHidden) {
                            dom._pmCount++;
                            if (!dom._animatedFav) {
                                dom.toggleFavLink();
                            }
                            document.title = "[" + dom._pmCount + "] " + dom._baseTitle;
                            if (holodeck._pm_chime) {
                                dom._chime.play();
                            }
                        }
                    };

                    if (!CDialogue.prototype.showReceivedPM_notifier) {
                        CDialogue.prototype.showReceivedPM_notifier = CDialogue.prototype.receivedPrivateMessage;
                        CDialogue.prototype.receivedPrivateMessage = function (a) {
                            if (a.data.success && !this._user_manager.isMuted(a.data.from)) {
                                this.new_private_message();
                            }
                            this.showReceivedPM_notifier(a);
                        };
                    }

                    holodeck.addChatCommand("pmchime", function (l, n) {
                        if (l._pm_chime) {
                            l._pm_chime = 0;
                            l.activeDialogue().kongBotMessage("PM chime is OFF");
                        } else {
                            l._pm_chime = 1;
                            l.activeDialogue().kongBotMessage("PM chime is ON");
                        }
                        window.setTimeout(function () {
                            GM_setValue("kong_pmchime", l._pm_chime);
                        }, 0);
                        return false;
                    });
                    var pm_chime = void 0;
                    try {
                        if (GM_setValue) {
                            pm_chime = GM_getValue("kong_pmchime", 1);
                        } else {
                            pm_chime = 1;
                        }
                    } catch (e) {
                        pm_chime = 1;
                    }
                    holodeck._pm_chime = pm_chime;
                }
            }
        }
    }]);

    return PmNotifier;
}(HolodeckScript);

//=require ../script.js

var PostCount = function (_Script5) {
    _inherits(PostCount, _Script5);

    function PostCount() {
        _classCallCheck(this, PostCount);

        return _possibleConstructorReturn(this, (PostCount.__proto__ || Object.getPrototypeOf(PostCount)).call(this, 'Forum Post Count', /\/topics\//, true));
    }

    _createClass(PostCount, [{
        key: "run",
        value: function run() {
            var a = document.getElementsByClassName("updated");
            for (var i = 1; i <= a.length; i++) {
                // Get post number
                var cP = document.getElementsByClassName("current");
                cP = cP.length > 0 ? cP[0].innerHTML : 1;
                var n = cP > 1 ? (cP - 1) * 25 + i : i;
                // Set number
                var abbr = a[i - 1];
                abbr.innerHTML = "#" + n + " - " + abbr.innerHTML;
            }
        }
    }]);

    return PostCount;
}(Script);

//=require ../holodeckScript.js

var ReplyCommand = function (_HolodeckScript11) {
    _inherits(ReplyCommand, _HolodeckScript11);

    function ReplyCommand() {
        _classCallCheck(this, ReplyCommand);

        return _possibleConstructorReturn(this, (ReplyCommand.__proto__ || Object.getPrototypeOf(ReplyCommand)).call(this, 'Chat Reply-command', /^\/games/, true));
    }

    _createClass(ReplyCommand, [{
        key: "run",
        value: function run() {
            var dom = this.dom,
                CDialogue = dom.ChatDialogue;

            if (CDialogue) {

                CDialogue.prototype = dom.CDprototype || dom.ChatDialogue.prototype;
                if (!CDialogue.prototype.oldKeyPressReply) {

                    CDialogue.prototype.oldKeyPressReply = CDialogue.prototype.onKeyPress;

                    if (CDialogue.prototype.reply) {
                        CDialogue.prototype.oldreply = CDialogue.prototype.reply;
                    } else {
                        CDialogue.prototype.oldreply = function (a) {};
                    }
                    CDialogue.prototype.reply = function (a) {
                        this._holodeck._reply = a;
                        this.oldreply(a);
                    };

                    if (!CDialogue.prototype.showReceivedPM) {
                        CDialogue.prototype.showReceivedPM = CDialogue.prototype.receivedPrivateMessage;
                        CDialogue.prototype.receivedPrivateMessage = function (a) {
                            if (a.data.success) {
                                this.reply(a.data.from);
                            }
                            this.showReceivedPM(a);
                        };
                    }

                    CDialogue.prototype.onKeyPress = function (a) {
                        var z,
                            node = this._input_node.wrappedJSObject || this._input_node;
                        if (a.which == 32 && (a.currentTarget.selectionStart == 2 && (z = node.getValue().match(/^\/r(.*)/i)) || (z = node.getValue().match(/^\/r\b(.*)/i)))) {
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
    }]);

    return ReplyCommand;
}(HolodeckScript);

//=require ../script.js

var ShowScriptOptions = function (_Script6) {
    _inherits(ShowScriptOptions, _Script6);

    function ShowScriptOptions() {
        _classCallCheck(this, ShowScriptOptions);

        var _this21 = _possibleConstructorReturn(this, (ShowScriptOptions.__proto__ || Object.getPrototypeOf(ShowScriptOptions)).call(this, 'this', /^\//, true));

        _this21.scripts = [];
        return _this21;
    }

    _createClass(ShowScriptOptions, [{
        key: "run",
        value: function run() {
            var dContainer = new Element("div", { "style": "background-color:#00000080;position:fixed;top:0px;left:0px;width:100%;height:100%;z-index:10000;display:none;" });
            var div = new Element("div", { "style": "background-color:#FFF;font:normal 11px/15px 'Lucida Grande',Verdana,Arial,sans-serif;padding:8px;display:none;position:fixed;transform:translate(-50%, -50%);top:50%;left:50%;z-index:10000;" }).update("<h2>Scripts</h2>Enable - Script Name<p></p>");
            dContainer.onclick = toggleVisibility;
            document.body.appendChild(dContainer);
            document.body.appendChild(div);

            this.scripts.map(function (item) {
                if (item.name == "this") return true; //aka, continue for each loops

                var span = new Element("span", { "style": "margin-top: 5px !important;display: block;" });
                div.insert(span);

                var checkbox = new Element("input", { "type": "checkbox", "id": "onescript-" + item.name, "style": "margin-top:2px;vertical-align:top;margin-right:8px;" });
                var label = new Element("label", { "class": "pls" });
                checkbox.checked = GM_getValue(checkbox.id, item.defaultEnabled ? "true" : "false") == "true";
                label.insert(checkbox);
                label.insert(item.name);

                span.insert(label);

                checkbox.onchange = toggleScript;

                function toggleScript() {
                    console.log("[KongOne] Toggled script");
                    GM_setValue(this.id, this.checked);
                }
            });

            var exitCon = new Element("div", { "style": "width:100%;" });
            var exit = new Element("button", { "class": "btn btn_wide btn_action", "style": "display:block;margin:6px auto auto;" }).update("Exit");
            exit.onclick = toggleVisibility;
            exitCon.insert(exit);
            div.insert(exitCon);
            var note = new Element("p").update("Refresh to apply your changes.");
            div.insert(note);
            var sOB = document.getElementById("welcome_box_sign_out");
            var sButton = document.createElement("li");
            sButton.innerHTML = "<a href='#' style='border-bottom: 1px dotted #9b9a9a;display: inline;padding: 0px 5px 10px 5px;'>KongOne</a>";
            sButton.onclick = toggleVisibility;
            sOB.parentNode.parentNode.insertBefore(sButton, sOB.parentNode);
            var gFrame = document.getElementById("game");
            function toggleVisibility() {
                if (dContainer.style.display != "none") {
                    dContainer.style.display = "none";
                    div.style.display = "none";
                    if (gFrame) gFrame.style.visibility = "visible";
                } else {
                    dContainer.style.display = "";
                    div.style.display = "";
                    if (gFrame) gFrame.style.visibility = "hidden";
                }
            }
        }
    }]);

    return ShowScriptOptions;
}(Script);

//=require ../holodeckScript.js

var SpamIstTot = function (_HolodeckScript12) {
    _inherits(SpamIstTot, _HolodeckScript12);

    function SpamIstTot() {
        _classCallCheck(this, SpamIstTot);

        return _possibleConstructorReturn(this, (SpamIstTot.__proto__ || Object.getPrototypeOf(SpamIstTot)).call(this, 'Spam Ist Tot', /^\/games/, true));
    }

    _createClass(SpamIstTot, [{
        key: "run",
        value: function run() {
            ChatDialogue.prototype.incrementMessageCount = function (a) {
                var hasCount = a.getElementsByClassName('spam-count').length > 0;

                if (hasCount) {
                    var count = a.getElementsByClassName('spam-count')[0],
                        amount = parseInt(count.getAttribute('amount'));
                    count.innerHTML = 'x' + (amount + 1);
                    count.setAttribute('amount', amount + 1);
                } else {
                    a.getElementsByTagName('p')[0].innerHTML += '<span amount="2" class="spam-count" style="float: right; color: #888">x2</span>';
                }
            };

            ChatDialogue.prototype.compareMessages = function (a, b) {
                if (!a || !b) return false;
                try {
                    var c = a.getElementsByClassName('username')[0].getAttribute('username'),
                        d = b.getElementsByClassName('username')[0].getAttribute('username'),
                        e = a.getElementsByClassName('message')[0].innerHTML,
                        f = b.getElementsByClassName('message')[0].innerHTML;

                    return c == d && e == f;
                } catch (ex) {
                    return false;
                }
            };

            ChatDialogue.prototype.insert = function (a, b, c) {
                var d = this,
                    e = this._message_window_node,
                    f = this._holodeck;
                f.scheduleRender(function () {
                    var g = e.getHeight(),
                        h = g + e.scrollTop + ChatDialogue.SCROLL_FUDGE >= e.scrollHeight,
                        r = 0 !== g && h;
                    f.scheduleRender(function () {
                        var messages = e.getElementsByClassName('chat-message');
                        var lastMsg = messages.length ? messages[messages.length - 1] : null;

                        if ("string" == typeof a || a instanceof String) a = $j("<div/>", {
                            html: a,
                            "class": "chat-message"
                        });

                        if (d.compareMessages(lastMsg, a[0])) {
                            d.incrementMessageCount(lastMsg);
                            return;
                        }

                        if (c && c.timestamp) {
                            var f = $j(e).children(".chat-message").filter(function () {
                                return $j(this).data("timestamp") > c.timestamp;
                            });
                            0 < f.length ? ($j(a).data(c).insertBefore(f.first()), r = !1) : $j(a).data(c).appendTo(e);
                        } else $j(a).appendTo(e);
                        r && d.scrollToBottom();
                        b && b();
                    });
                });
            };
        }
    }]);

    return SpamIstTot;
}(HolodeckScript);
//=require ../holodeckScript.js

var UsernameCompletion = function (_HolodeckScript13) {
    _inherits(UsernameCompletion, _HolodeckScript13);

    function UsernameCompletion() {
        _classCallCheck(this, UsernameCompletion);

        return _possibleConstructorReturn(this, (UsernameCompletion.__proto__ || Object.getPrototypeOf(UsernameCompletion)).call(this, 'Chat Username-completion', /^\/games/, true));
    }

    _createClass(UsernameCompletion, [{
        key: "run",
        value: function run() {
            if (typeof ChatDialogue === "undefined" || ChatDialogue.prototype.oldKeyPressTab) return;

            var isChrome = navigator.appVersion.indexOf("Chrome") >= 0;
            if (isChrome) {
                ChatDialogue.prototype.initialize = ChatDialogue.prototype.initialize.wrap(function (old, p, i, h, u) {
                    old(p, i, h, u);
                    var self = this;
                    this._input_node.observe("keydown", function (event) {
                        if (event.keyCode != 9 || event.ctrlKey || event.altKey || event.metaKey) return;
                        self.onKeyPress(event);
                    });
                });
            }

            ChatDialogue.prototype.oldKeyPressTab = ChatDialogue.prototype.onKeyPress;
            ChatDialogue.prototype.tabcnt = 0;
            ChatDialogue.prototype.done = 1;
            ChatDialogue.prototype.onKeyPress = function (a) {
                if (a.keyCode != 9 || a.ctrlKey) {
                    this.tabcnt = 0;
                    this.done = 1;
                    this.oldKeyPressTab(a);
                    return;
                }

                var node = this._input_node.wrappedJSObject || this._input_node;
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
    }]);

    return UsernameCompletion;
}(HolodeckScript);

//=require ../holodeckScript.js

var WhisperCatch = function (_HolodeckScript14) {
    _inherits(WhisperCatch, _HolodeckScript14);

    function WhisperCatch() {
        _classCallCheck(this, WhisperCatch);

        return _possibleConstructorReturn(this, (WhisperCatch.__proto__ || Object.getPrototypeOf(WhisperCatch)).call(this, 'Whisper Catch', /^\/games/, true));
    }

    _createClass(WhisperCatch, [{
        key: "run",
        value: function run() {
            var _this25 = this;

            var dom = this.dom;
            var CDialogue = dom.ChatDialogue;
            var removeWhisper = function removeWhisper(w) {
                _this25.removeWhisper(w);
            };

            holodeck.__wc_whisperCount = 0;
            CDialogue.prototype.__wc_receivedPrivateMessage = CDialogue.prototype.receivedPrivateMessage;
            CDialogue.prototype.receivedPrivateMessage = function (a) {
                this.__wc_receivedPrivateMessage(a);

                a.id = holodeck.__wc_whisperCount;

                var whispers = JSON.parse(localStorage.getItem(WhisperCatch.WHISPERS_SAVED_KEY)) || [];
                whispers.push(a);
                localStorage.setItem(WhisperCatch.WHISPERS_SAVED_KEY, JSON.stringify(whispers));
                setTimeout(removeWhisper, WhisperCatch.WHISPER_WAIT_TIME, a);
            };

            this.__wc_interval = setInterval(function () {
                _this25.restoreWhispers();
            }, WhisperCatch.CHAT_DIALOGUE_RETRY);

            holodeck.addChatCommand('wctime', function (holodeck, str) {
                var args = str.split(' ').slice(1),
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
    }, {
        key: "restoreWhispers",
        value: function restoreWhispers() {
            var chatDialogue = holodeck.activeDialogue(),
                whispers = JSON.parse(localStorage.getItem(WhisperCatch.WHISPERS_SAVED_KEY)) || [];

            if (!chatDialogue) return;

            while (whispers.length > 0) {
                var w = whispers.shift();
                chatDialogue.receivedPrivateMessage(w);
            }

            clearInterval(this.__wc_interval);
        }
    }, {
        key: "removeWhisper",
        value: function removeWhisper(w) {
            var whispers = (JSON.parse(localStorage.getItem(WhisperCatch.WHISPERS_SAVED_KEY)) || []).filter(function (o) {
                return o.id != w.id;
            });

            localStorage.setItem(WhisperCatch.WHISPERS_SAVED_KEY, JSON.stringify(whispers));
        }
    }]);

    return WhisperCatch;
}(HolodeckScript);

WhisperCatch.WHISPERS_SAVED_KEY = "wc-whispers_saved";
WhisperCatch.WHISPER_WAIT_TIME_KEY = "wc-whisper_wait_time_key";
WhisperCatch.WHISPER_WAIT_TIME = 1000 * parseInt(localStorage.getItem(WhisperCatch.WHISPER_WAIT_TIME_KEY) || 15);
WhisperCatch.CHAT_DIALOGUE_RETRY = 100;

(function main() {
    console.log("[KongOne] Initializing...");

    if (typeof GM_setValue === 'undefined') {
        window.GM_setValue = function (a, b) {
            localStorage.setItem(a, b);
        };
        window.GM_getValue = function (a, b) {
            var r = localStorage.getItem(a);
            return r === null ? b : r;
        };
        window.GM_deleteValue = function (a) {
            localStorage.removeItem(a);
        };
    }

    var optionsScript = new ShowScriptOptions();
    var scripts = [optionsScript, new ChatTimestamp(), new PmNotifier(), new ChatLineHighlight(), new ReplyCommand(), new UsernameCompletion(), new ChatMouseoverTimestamp(), new AfkCommand(), new ChatCharacterLimit(), new KongreLink(), new ChatResizer(), new Kongquer(), new WhisperCatch(), new LargerAvatars(), new BetterQuotes(), new PostCount(), new LevelExtension(), new SpamIstTot(), new KongOneAlerts()];

    optionsScript.scripts = scripts;

    scripts.map(function (script) {
        return script.initialize();
    });
})();