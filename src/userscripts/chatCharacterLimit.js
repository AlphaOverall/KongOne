//=require ../holodeckScript.js

class ChatCharacterLimit extends HolodeckScript {
  constructor() {
    super('Chat Character-limit', /^games/, true);
  }

  run() {
    var dom = this.dom,
        CDialogue = dom.ChatDialogue;

    if(CDialogue){
        CDialogue.prototype = dom.CDprototype||dom.ChatDialogue.prototype;

        if(!CDialogue.prototype.oldKeyPressLimit){
            CDialogue.prototype.oldKeyPressLimit = CDialogue.prototype.onKeyPress;
            CDialogue.prototype.onKeyPress = function (a) {
                var node = (this._input_node.wrappedJSObject || this._input_node);
                this.oldKeyPressLimit(a);
                if (node.getValue().length > 249) {
                    z = node.getValue();
                    var y = "";
                    let n = z.match(/^(\/\S+\s+\S*\s*)(.*)/);
                    if (n){
                        y=n[2];
                        if (y.length>249){
                            node.setValue(n[1]+y.substr(0, 249));
                        }
                    } else {
                        node.setValue(node.getValue().substr(0, 249));
                    }
                }
            };
        }
    }
  }
}
