//=require ../script.js

class BetterQuotes extends Script {

  constructor() {
    super('Better Quotes', /\/(topics|posts)/, true, Script.CATEGORIES.FORUM);
  }

  run() {
    // Make sure $ is jQuery. Kongregate should load jQuery by default
    // But has weird $ assignment
    var $ = jQuery;

    //Add styles
    GM_addStyle(`
      .expandQuote {
        text-align: center;
        background-color: #9A7;
        color: #EFC;
        font-style: italic;
        margin-top: -1px;
        -webkit-border-bottom-right-radius: 5px;
        -webkit-border-bottom-left-radius: 5px;
        -moz-border-radius-bottomright: 5px;
        -moz-border-radius-bottomleft: 5px;
        border-bottom-right-radius: 5px;
        border-bottom-left-radius: 5px;
        -webkit-touch-callout: none;
        -webkit-user-select: none;
        -khtml-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
        cursor:pointer;
      }`
    );

    GM_addStyle(`
    .posts .post .body blockquote {
      overflow:hidden;
      display: block;
    }
    `);

    GM_addStyle(".forum--entry blockquote { margin: 0px; }"); //Fixes Kongregate's dodgy quote padding.

    //Begin script
    var quoteTotal = 0;

    function addBetterQuotes() {
      var quotes = document.querySelectorAll(".rendered_post > blockquote");

      for (let quote of quotes) {
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
      $(".expandQuote").click(function() {
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

    var loadCheck = setInterval(function() {
      if (document.getElementsByClassName('rendered_post').length > 0) {
        addBetterQuotes();
      }
      if (quoteTotal > 0) {
        clearInterval(loadCheck);
      }
    }, 100);

  }
}
