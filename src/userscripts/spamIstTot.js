//=require ../holodeckScript.js

class SpamIstTot extends HolodeckScript {

    constructor() {
        super('Spam Ist Tot', /^\/games/, true, Script.CATEGORIES.CHAT);
    }

    run() {
        ChatDialogue.prototype.incrementMessageCount = function (a) {
            var hasCount = a.getElementsByClassName('spam-count').length > 0;

            if (hasCount) {
                var count = a.getElementsByClassName('spam-count')[0],
                    amount = parseInt(count.getAttribute('amount'));
                count.innerHTML = 'x' + (amount + 1);
                count.setAttribute('amount', amount + 1)
            } else {
                a.getElementsByTagName('p')[0].innerHTML += '<span amount="2" class="spam-count" style="float: right; color: #888">x2</span>';
            }
        };

        ChatDialogue.prototype.compareMessages = function (a, b) {
            if (!a || !b)
                return false;
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
                            return $j(this).data("timestamp") > c.timestamp
                        });
                        0 < f.length ? ($j(a).data(c).insertBefore(f.first()),
                            r = !1) : $j(a).data(c).appendTo(e)
                    } else $j(a).appendTo(e);
                    r && d.scrollToBottom();
                    b && b()
                })
            })
        };

    }
}