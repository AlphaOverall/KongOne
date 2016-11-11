//=require ../script.js

class ShowScriptOptions extends Script {
    constructor() {
        super('this', /^\//, true);
        this.scripts = [];
    }

    run() {
        var dContainer = new Element("div", {"style":"background-color:#00000080;position:fixed;top:0px;left:0px;width:100%;height:100%;z-index:10000;display:none;"});
        var div = new Element("div", {"style":"background-color:#FFF;font:normal 11px/15px 'Lucida Grande',Verdana,Arial,sans-serif;padding:8px;display:none;position:fixed;transform:translate(-50%, -50%);top:50%;left:50%;z-index:10000;"}).update("<h2>Scripts</h2>Enable - Script Name<p></p>");
        dContainer.onclick = toggleVisibility;
        document.body.appendChild(dContainer);
        document.body.appendChild(div);

        this.scripts.map(function(item) {
            if (item.name == "this")
            return true; //aka, continue for each loops

            var span = new Element("span", {"style":"margin-top: 5px !important;display: block;"});
            div.insert(span);
            
            var checkbox = new Element("input", {"type":"checkbox", "id":"onescript-" + item.name, "style":"margin-top:2px;vertical-align:top;margin-right:8px;"});
            var label = new Element("label", {"class":"pls"})
            checkbox.checked = GM_getValue(checkbox.id,item.defaultEnabled?"true":"false") == "true";                              
            label.insert(checkbox);
            label.insert(item.name);

            span.insert(label);
            
            checkbox.onchange = toggleScript;
            
            function toggleScript()
            {
            console.log("[KongOne] Toggled script");
            GM_setValue(this.id,this.checked);
            }
            
        });
        
        var exitCon = new Element("div", {"style":"width:100%;"});
        var exit = new Element("button", {"class":"btn btn_wide btn_action","style":"display:block;margin:6px auto auto;"}).update("Exit");
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
        function toggleVisibility(){
            if(dContainer.style.display != "none") {
                dContainer.style.display = "none";
                div.style.display = "none";
                if(gFrame) gFrame.style.visibility = "visible";
                }
            else {
                dContainer.style.display = "";
                div.style.display = "";
                if(gFrame) gFrame.style.visibility = "hidden";
                }
        }
    }
}
