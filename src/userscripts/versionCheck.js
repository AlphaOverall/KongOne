//=require ../script.js

class VersionCheck extends Script {
    constructor() {
        super('this', /^\//, true, Script.CATEGORIES.HIDDEN);
        this.previousVersion = GM_getValue("KongOneVersion", "1.2.5");
        this.latestVersion = unsafeWindow.KongOneVersion;

        // Next load, previous and latest should match
        GM_setValue("KongOneVersion", this.latestVersion);
    }

    run() {
        var dContainer = new Element("div", {"style":"background-color:#00000080;position:fixed;top:0px;left:0px;width:100%;height:100%;z-index:10000;display:none;"});
        var div = new Element("div", {"style":"background-color:#FFF;font:normal 11px/15px 'Lucida Grande',Verdana,Arial,sans-serif;padding:15px;display:none;position:fixed;transform:translate(-50%, -50%);top:50%;left:50%;z-index:10000;padding-bottom:50px;"})
            .update("<h2>Kongregate One Update</h2>Version: " + this.latestVersion + "<p></p>" + unsafeWindow.KongOneUpdateText);
        dContainer.onclick = toggleVisibility;
        document.body.appendChild(dContainer);
        document.body.appendChild(div);
        
        var exitCon = new Element("div", {"style":"width:100%;height:50px;bottom:0px;position:absolute;"});
        var exit = new Element("button", {"class":"btn btn_wide btn_action","style":"display:block;margin:6px auto auto;"}).update("Close");
        exit.onclick = toggleVisibility;
        exitCon.insert(exit);
        div.insert(exitCon);
        var anchor = new Element("a", {"href": "https://www.kongregate.com/forums/1/topics/614435", "target":"_blank"}).update("Check out script thread.");
        exitCon.insert(anchor);

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
        if (this.previousVersion !== this.latestVersion)
            toggleVisibility();
    }
}
