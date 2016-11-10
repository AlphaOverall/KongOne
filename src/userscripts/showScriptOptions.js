//=require ../script.js

class ShowScriptOptions extends Script {
    constructor() {
        super('this', /^accounts/, true);
        this.scripts = [];
    }

    run() {
        var dom = this.dom;
        var div = new Element("div", {
            "style": "background-color:#FFF;padding: 8px;"
        }).update("<h2>Scripts</h2>Enable - Script Name<p></p>");
        $("profile_aside").down().insert(div);

        this.scripts.each(function(item) {
            if (item.name == "this")
                return true; //aka, continue for each loops

            let span = new Element("span", {
                "style": "margin-top: 5px !important;display: block;"
            });
            div.insert(span);

            let checkbox = new Element("input", {
                "type": "checkbox",
                "id": "onescript-" + item.name,
                "style": "margin-top:2px;vertical-align:top;margin-right:8px;"
            });
            let label = new Element("label", {
                "class": "pls"
            });
            checkbox.checked = GM_getValue(checkbox.id, item.defaultEnabled ? "true" : "false") == "true";
            label.update(item.name);

            span.insert(checkbox);
            span.insert(label);

            checkbox.addEventListener('change', (e) => {
                console.log("[KongOne] Toggled script");
                GM_setValue(this.id, this.checked);
            });
        });
    }
}
