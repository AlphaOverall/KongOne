//= require ../holodeckScript.js

class ChatResizer extends HolodeckScript {
    constructor() {
        super('Chat Resizer', 'games', true);
    }

    run() {
        let dom = this.dom;

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
            holodeck.addChatCommand("size", function(l, n) {
                var m = n.match(/^\/\S+\s+(\S+)/);
                var o = n.match(/^\/\S+\s+(\d+)\s+(\d+)(?:\s+(\d+))?/);

                if (m && m[1] == "reset") {
                    l.activeDialogue().kongBotMessage("Resetting size for this game to defaults.");
                    window.setTimeout(function() {
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

                window.setTimeout(function() {
                    GM_setValue("kong_resize_" + location.pathname, width + "/" + height + "/" + listHeight);
                }, 0);
                l.activeDialogue().kongBotMessage("Resizing chat to " + width + "px/" + height + "px/" + listHeight + "px");
                this.setWidth(width);
                this.setHeight(height, listHeight, window._currentGameCentered);

                return false;
            });

            holodeck.addChatCommand("defaultsize", function(l, n) {
                var m = n.match(/^\/\S+\s+(\S+)/);
                var o = n.match(/^\/\S+\s+(\d+)\s+(\d+)(?:\s+(\d+))?/);
                if (m && m[1] == "reset") {
                    l.activeDialogue().kongBotMessage("Resetting default size to 500/600/100");
                    window.setTimeout(function() {
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

                window.setTimeout(function() {
                    GM_setValue("kong_resize_default", width + "/" + height + "/" + listHeight);
                }, 0);
                l.activeDialogue().kongBotMessage("Set default values to width: " + width + "px, height: " + height + "px, userlist-height: " + listHeight + "px.");

                return false;
            });

            holodeck.addChatCommand("centergame", (l, n) => {
                var center = !window._currentGameCentered;
                if (center) {
                    l.activeDialogue().kongBotMessage("Now centering the game");
                } else {
                    l.activeDialogue().kongBotMessage("Now aligning the game to the chat's bottom");
                }
                window.setTimeout(function() {
                    GM_setValue("kong_resize_center", center ? 1 : 0);
                }, 0);

                this.centerGame(center);

                return false;
            });

            holodeck.addChatCommand("draggable", function(l, n) {
                var chatwindow = document.getElementById("chat_container");
                //chatwindow.style.overflow = "auto";
                chatwindow.style.resize = "both";
                chatwindow.onresize = function() {
                    var chatcontainer = document.getElementById("chat_window");
                    chatcontainer.style.width = chatwindow.style.width;
                    chatcontainer.style.height = chatwindow.style.height;
                    console.log(chatwindow.style.width);
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

        let splitArr;
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
            cg = (centerVal == 1);
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
            if (override || gameWidth + x < screen.width - dom.spaceLeft) { // enough place to resize to specified width
                this.setWidth(x);
            } else { // resize as far as possible
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

    centerGame(center) {
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

    setHeight(height, userListHeight, center) {
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
        $("chat_container").style.height = (height + maintabHeight) + "px";
        $("user_mini_profile_container").style.height = (height - 65) + "px";
        $("user_mini_profile").style.height = (height - 65) + "px";

        var messageWindows = $$(".chat_message_window");
        for (var i = 0; i < messageWindows.length; i++) {
            messageWindows[i].style.height = (tabPaneHeight - userListHeight - 93) + "px"; // 93 = roomname, users in room etc.
        }

        var usersInRoom = $$(".users_in_room");
        for (i = 0; i < usersInRoom.length; i++) {
            usersInRoom[i].style.height = userListHeight + "px";
        }

        var roomsList = $$(".rooms_list");
        for (i = 0; i < roomsList.length; i++) {
            roomsList[i].style.height = (height - 79) + "px";
        }

        let z = $("kong_game_ui").childNodes;
        for (i = 0; i < z.length; i++) {
            if (z[i].nodeName == "DIV") {
                z[i].style.height = tabPaneHeight + "px";
            }
        }
        if (center != -1 && center !== undefined)
            this.centerGame(center);
    }

    setWidth(width) {
        window._currentChatWidth = width;
        var gameWidth = parseInt($("game").style.width, 10);
        $("maingame").style.width = (gameWidth + 3 + width) + "px";
        $("maingamecontent").style.width = (gameWidth + 3 + width) + "px";
        $("flashframecontent").style.width = (gameWidth + 3 + width) + "px";
        $("chat_container").style.width = width + "px";
        $('chat_window_spinner').style.right = width / 2 - 38 + "px";
        if ($('high_scores_spinner'))
            $('high_scores_spinner').style.right = width / 2 - 38 + "px";
        var ui = $("kong_game_ui");
        let z = ui.childNodes;
        for (var i = 0; i < z.length; i++) {
            if (z[i].tagName == "DIV")
                z[i].style.width = (width - 17) + "px";
        }
        this.$A(ui.querySelectorAll("textarea.chat_input")).forEach(function(el) {
            el.style.width = (width - 21) + "px";
        });
    }

    $A(c) {
        return [].slice.call(c);
    }
}
