//=require ../holodeckScript.js

class ChatTimestamp extends HolodeckScript {

    constructor() {
        super('Chat Timestamp', /^games/, true);
    }

    run() {
        var dom = this.dom,
            holodeck = dom.holodeck,
            ChatDialogue = dom.ChatDialogue;

        if (holodeck && ChatDialogue) {
            ChatDialogue.prototype = dom.CDprototype || dom.ChatDialogue.prototype;

            if (!holodeck.__timestamp) {
                holodeck.__timestamp = true;

                holodeck.addChatCommand("timeformat", function(l, n) {
                    var k = n.match(/^\/\S+\s+(\d+)/),
                        m = "",
                        q = l.activeDialogue();
                    k && (m = k[1]);
                    if (m == 12 || m == 24) {
                        l._timeFormat = m;
                        window.setTimeout(function() {
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

                holodeck.addChatCommand("tscolor", function(l, n) {
                    var k = n.match(/^\/\S+\s+([0-9a-f]{6})/i),
                        z = "";
                    k && (z = "#" + k[1]);
                    if (z) {
                        updateColor(z);
                        window.setTimeout(function() {
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

                holodeck.addChatCommand("toggleseconds", function(l, n) {
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
                    window.setTimeout(function() {
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

                var updateColor = (function(c) {
                    var style = document.createElement("style");
                    style.setAttribute("type", "text/css");

                    function _updateColor(color) {
                        style.innerHTML = "span.inline_timestamp { color: " + color + " !important; }";
                    }

                    _updateColor(c);
                    document.body.appendChild(style);

                    return _updateColor;
                })(fontcolor);
                ChatDialogue.MESSAGE_TEMPLATE.template = '<p class="#{classNames}"><span style="float: left;" class="inline_timestamp">[#{time}]&nbsp;</span><span username="#{username}" class="username #{userClassNames}">#{prefix}#{username}</span><span class="separator">: </span><span class="message">#{message}</span><span class="clear"></span></p>';
                ChatDialogue.MESSAGE_TEMPLATE.old_evaluate_inline = ChatDialogue.MESSAGE_TEMPLATE.evaluate;
                ChatDialogue.MESSAGE_TEMPLATE.evaluate = function(args) {
                    var date = new Date();
                    var hours = date.getHours();
                    var minutes = date.getMinutes();
                    var seconds = date.getSeconds();
                    var time;
                    if (holodeck._timeFormat == 12) {
                        time = (hours < 10 ? (hours === 0 ? "12" : "0" + hours) : (hours > 12 ? (hours > 21 ? hours - 12 : "0" + (hours - 12)) : hours)) + ":" + (minutes < 10 ? "0" : "") + minutes + (holodeck._showSeconds ? (":" + (seconds < 10 ? "0" : "") + seconds) : "") + (hours > 11 ? " PM" : " AM");
                    } else {
                        time = (hours < 10 ? "0" : "") + hours + ":" + (minutes < 10 ? "0" : "") + minutes + (holodeck._showSeconds ? (":" + (seconds < 10 ? "0" : "") + seconds) : "");
                    }
                    args.time = time;
                    return this.old_evaluate_inline(args);
                };
            }
        }
    }

}
