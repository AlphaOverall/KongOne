//=require ../holodeckScript.js

// Helper class
class ChatRoomList {
    constructor() {
        this.loaded = false;
        this.list = null;
    }

    parseList(crlist) {
        let newlist = [], listids = [];
        for (let group of crlist) {
            for (let room of group.rooms) {
                if (listids.indexOf(room.id) < 0) {
                    newlist.push(room);
                    listids.push(room.id);
                }
            }
        }
        return newlist;
    }

    getRoom(match) {
        return this.getList().then(function(list) {
            for (let room of list) {
                if (room.id === match || RegExp(match, "i").test(room.name)) {
                    return room;
                }
            }
            return null;
        });
    }

    getList() {
        let rooms = this;
        // If list already exists, return it as a promise
        if (rooms.list) return new Promise(resolve => resolve(rooms.list.slice()));
        // Otherwise query for list
        return jQuery.getJSON(`${location.origin}/rooms.js`).always(result => {
            try {
                rooms.list = rooms.parseList(JSON.parse(result.responseText.slice(20, -3)));
                rooms.loaded = true;
                return new Promise(resolve => resolve(rooms.list.slice()));
            } catch (ex) {
                console.log("[KongOne]: Could not load room list for current chatroom change script");
                console.error(ex);
                return Promise.reject(Error(ex));
            }
        });
    }
}

// Script
class JoinChatRoom extends HolodeckScript {
    constructor() {
        super('Join Chat by ID/Name', /^\/games/, true, Script.CATEGORIES.CHAT);
        this._chatRoomList = new ChatRoomList();
    }
    
    run() {
        holodeck._chatRoomList = this._chatRoomList;
        holodeck.addChatCommand("join", (l, msg) => {
            msg = msg.match(/^\/\S+\s+(.+)/)[1];
            this._chatRoomList.getRoom(msg).then(function(data) {
                if (data) l.chatWindow().joinRoom(data);
                else l.activeDialogue().displayUnsanitizedMessage("Kong Bot", "Cannot find specified chat", {"class":"whisper received_whisper"}, {non_user: true});
            });
            return false;
        });
    }
}