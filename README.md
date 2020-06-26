# KongOneβ

### Version 3.0.1

A major rework of the original KongOne. Documentation might be out of date. Please let us know if there is missing documentation or new bugs since this release.

This userscript is an edit of <a href="http://www.kongregate.com/accounts/UnknownGuardian">UnknownGuardian</a>'s script called <A href="http://userscripts-mirror.org/scripts/show/164732">Kongregate One</a>.

First, to turn off and on certain aspects of the script, find the KongOne link in the settings cog:

![](https://i.imgur.com/Abp2iNu.png)

Once selected, it should bring up a dialog with all the different options.

![](https://i.imgur.com/EDWpAae.png)

Then choose what functions you want.

Here are its basic functions:

## Chat Timestamp
**/timeformat** sets timestamp format to 12 or 24 hour

**/tscolor** sets the color of timestamps. Format is /tscolor ###### (# = hex character)

**/toggleseconds** shows or hids seconds in timestamps

## Chat PM Notifier

**/pmchime** turns Private Message chime on and off

## Chat Line Highlighting

**/hl** (or /highlight) followed by a list of words (separated by spaces) makes the script highlight every message that contains one of those words. Note that you don’t have to retype the list after refreshing – it gets saved!

**/hluser** followed by a list of usernames highlights all messages by those users – including whispers.

**/hlcolor** followed by a valid hex-color (without the leading #, so an example would be /hlcolor 00FF00) changes the color which the script uses to highlight messages to that color (Gets saved, too)

**/hlfriends** toggles highlighting messages sent by your friends. If activated, your friend’s names will show up highlighted (by default green) in chat messages.

**/hlmods** toggles highlighting the names of mods in chat. When activated, mods names appear orange by default, the color can be changed with /modcolor.

**/hlpriority** toggles the priority of /hlmods and /hlfriends. By default, users who are both mods and your friends will be highlighted in the friend-color when activating /hlmods and /hlfriends. Use /hlpriority to make them appear in the mod-color instead.

**/hlchime** toggles the chime on/off.

**/whispercolor** works similar to /hlcolor, but changes the color of whispers you send/receive.

**/friendcolor** changes the color of friends’ names in chat.

**/modcolor** changes the color of mod-names in chat.

**/hllist** lists the current settings.

**/hlreset** resets all preferences to their default values.

## Chat Reply-Command

**/r** – Chat Reply-command – After receiving a whisper, you can type /r and it replaces it with /w {user who last whispered you}

## Chat Mouseover Timestamp

**Note:** When this option is checked, the other timestamp doesn't work.

**/timeformat** sets timestamp format to 12 or 24 hour

## Chat Afk Commands

**/autoafk** sets auto away status for 15 minutes. Followed by a number, it sets autoafk for that amount of minutes

**/afktoggle** toggles whether to send an automatic message to whispers when your status is away

**/afkmessage** displays the saved AFK-message

**/afkmessage message** sets message to show to users when afktoggle is on

## Chat Resizer

**/size x y** sets chat size, for instance  /size 500 500 sets chat to 500 by 500 px.

**/defaultsize** - This didn't work well for me in Chrome. I'll look at it later.

**/centergame** either centers the game or aligns the game to chat bottom

*Every now and then, script doesn't load for some reason...*

**/test** makes sure the script is active and if it's not it doesn't make you look as stupid as it might... (Talking from experience)

## From Kongregate Get

**/avglvl** gets the average level of all users in chat (also /avg, /alvl)

**/mp** gets the most played games in the chat room. If followed by a number, shows that many games (e.g. /mp 5; also /mostplayed, /getmp)

## Kongquer

**/hlvl** gets the highest user level in chat (also /highlevel, /highlvl, /hlevel)

**/llvl** gets the lowest user level in chat (also /lowlevel, /lowlvl, /llevel)

**/levels #** gets all users of specified level, or if no level is specified, all levels in the room (also /levels # # #)

**/levels #-#** gets all Users levels including end points between two specified numbers.

**/devs** gets a list of all developers in chat (also /dev, /developer, /developers)

**/admins** gets a list of all admins in chat (also /admin, /administrator, /administrators)

**/mods** gets a list of all mods in chat (also /mod, /moderator, /moderators)

**/username** gets... your username! Really useful one.

**/id** gets your Kongregate Id

**/kreds** gets your current Kreds balance

**/level** gets your Kongregate level (also /lvl)

**/age** gets your age

**/email** gets your email address associated with your Kongregate account

**/user username** gets info about username. If left blank, gets info about yourself, including the bunch of previous commands(also /u, /me)

**/info** gets information about current chat (also /roominfo)

**/botd** gets the current Badge of the Day

**/friends** gets a list of all your friends

**/online** shows friends online

**/signout** signs you out of your account

**/signup** open the Register lightbox

**/login** opens the Login lightbox allowing you to switch accounts easily (without signing out).

**/close** closes window (also /exit)

**/reload** reloads the current page

**/reloadgame** reloads the game without reloading the whole page.

**/removegame** removes the game on the current page. Useful if you only want to chat. (Might be buggy with resizing, please share any issues)

**/open** opens specified.

e.g.
**/open accounts AlphaOverall** opens account of user AlphaOverall

**/open games JavelinOU tdp4-team-battle** opens game TDP4

**/open asdf** opens a Kongregate search of asdf

**/open** opens your account page

**/khelp** opens Kongregate help page (also /konghelp, /kongregatehelp)

**/help** will open a help page...

**/kong** opens Kongregate home (also /kongregate)

**/available username** checks if a username is already registered in the Kongregate database (Kind of ugly output as of now, trying to fix it)

**/google words to search** opens a google search of words. If no specified search terms, opens google homepage.

**/bing words to search** opens a bing search of words. If no specified search terms, opens bing homepage.

**/yahoo words to search** opens a yahoo search of words. If no specified search terms, opens yahoo homepage.

**/wiki words to seach** opens a wikipedia search or article of words. (also /wikipedia)

**/youtube words to search** opens a YouTube search of words. If no specified search terms, opens YouTube homepage.

<b>/youtube embed youtube.com/watch?v=RaNd_omStrInG</b> embeds specified video url into the Kongregate chat (default 16:9 aspect ratio)

<b>/url http://www.somesite.com</b> opens specified site. (also /goto, /http, /www)

<b>/mp3 http://www.somesite.com/linkedrandomaudio.mp3</b> embeds specified mp3 in Kongregate chat.

**/img http://www.somesite.com/randomimage.png** embeds specified image in Kongregate chat.

**/calc 4+3\*8/9-2\*Math.sqrt(7)** calculates the given expression. For a list of Math commands, type /calc help (also /math, /calculator)

**/time** gets the current day and time (also /now, /date, /datetime)

**/clear** clears the chat

**/list keyword** shows a list of users with keyword in their name (case insensitive, also /userlist, /username)

Note that this is my (AlphaOverall's) edited version of this script and I hope to be adding more features in the future. For now, enjoy!

<p>This script can be downloaded on <a href="https://greasyfork.org/en/scripts/9905-kongregate-one">Greasy Fork</a> or <a href="https://github.com/AlphaOverall/KongOne">GitHub</a>.</p>

## More Info

<p>This extra description is taken from <a href="http://www.kongregate.com/forums/1/topics/614435">Nomuit's masterthread</a>.

<h2>All About KongOneβ</h2>
<p>So, you just downloaded that beautiful KongOneβ, hmm? But now, you&#8217;re asking me &#8220;but Nomuit, what do I do in it?&#8221;; I perfectly understand where you&#8217;re coming from. While a lot of this is already on the script page, I&#8217;m going to give you a breakdown of the features in this post anyway: let&#8217;s get to it!</p>
<h3>Main Features</h3>
<p>So, KongOneβ is a chat-based script, and has quite a few features in it &#8211; due to being a masterscript of previous chat scripts, but some are <em>far</em> more useful than others. It can:</p>
<ul>
	<li><strong>highlight words <em>(nicknames, for instance)</em></strong></li>
	<li>highlight whispers (in a different colour)</li>
	<li><strong>make links clickable</strong></li>
	<li>give a chime when whispered/highlighted and you&#8217;re out of tab</li>
	<li><strong>show <em>good</em> timestamps</strong></li>
	<li>give a larger chat window</li>
	<li><strong>auto-fill in names when replying to whispers</strong></li>
</ul>
<p>And most everything in the script is easily customisable!</p>
<p>Wanna see? Here:<br />
<img src="http://i.imgur.com/rzHMGAv.png?1" alt="" /></p>
<p>So, where to start? Hmm&#8230;Well, first, how about how to do the things I said above?</p>
<h4><em>Setting Highlighted Words</em></h4>
<p>So, most people use this as a way to set nicknames. That way, if someone says your name, it highlights and you can easily see messages meant for you!</p>
<p>In order to set these, type (<strong>without the quotes</strong>):</p>
<p>&#8220;<code>/hl [nickname] [nickname]</code>&#8221; &#8211; meaning &#8220;highlight [nickname] [nickname]&#8221;.</p>
<p>To see it in action, imagine I was wanting to set multiple nicknames, yeah? I would type this into chat:</p>
<p>&#8220;<code>/hl Nomuit Nom Noms Nommy Jargon Jar JarJar Jargonaut</code>&#8221; &#8211; again, <strong>with no quotes</strong>.</p>
<p>Now, every time the words &#8220;Nomuit&#8221;, &#8220;Nom&#8221;, &#8220;Noms&#8221;, &#8220;Nommy&#8221;, ect. are said in chat, they&#8217;ll be highlighted for me, so I know someone was talking to me! To know how to change the colour of timestamps, scroll down to the Customising Colour section.</p>
<p><em>Of course, be careful what you set; every time someone &#8220;noms&#8221; food in chat I get highlighted :P</em></p>
<h4>Customise Timestamps</h4>
<p>So, a lot of people ended up switching over to KongOne because they hated the default, always-on timestamps that Kong has nowadays. Well, guess what? Ours are better, with plenty of options! (still, I&#8217;m happy the programmers are trying &lt;3)</p>
<p>By default, timestamps have a format of:</p>
<p>[12:00]</p>
<p>with &#8220;12&#8221; being the hour and &#8220;00&#8221; being the minute. C&#8217;mon, you guys know this stuff. :P Well, you can change that format, if you like. Here are the options with timestamps:</p>
<p><strong>World Format/24-hour Format</strong> &#8212;&gt; [23:00]</p>
<p><strong>Add Seconds</strong> &#8212;&gt; [12:00:00]</p>
<p><strong>Change The Timestamp Colour</strong> [note: this appears to be broken as of the moment, but I&#8217;ll see about getting it fixed; more on this in the Customising Colour part of this post anyway]</p>
<p><strong>Mouseover Or In-Chat Timestamps</strong> &#8212;&gt; [12:00] OR hover timestamps, as in this picture: <img src="http://i.imgur.com/SIsWbOP.png?2" alt="" /> Mouseover timestamps come with the added bonus of having a &#8220;Private message&#8221; link added to them, making it quicker to whisper people!</p>
<p>So, now you&#8217;re wondering <em>how</em> to do all these amazing temporal features, yeah? Well, here are the commands:</p>
<p><strong>To set World Format/24-hour timestamps</strong>:</p>
<p>&#8220;<code>/timeformat</code>&#8221; &lt;- just like that, <em>no quotes</em>. Simple, right? To switch back, simply type it out again.</p>
<p><strong>To set seconds</strong>:</p>
<p>&#8220;<code>/toggleseconds</code>&#8221; &lt;- again, just like that <em>without quotes</em>. Switching back is the same.</p>
<p><strong>To set mouseover timestamps</strong></p>
<p>This is a bit more unpleasant to change. In order to do this, go to your profile, and scroll down, until you see a box on the right that looks like this:</p>
<p><img src="http://i.imgur.com/EGHIh1e.png?1" alt="" /></p>
<p>Now, see that unchecked box for &#8220;Chat Mouseover Timestamp&#8221;? Check it, and uncheck the &#8220;Chat Timestamp&#8221; at the top. Then, refresh your game page, and you&#8217;ll have the mouseover timestamps!</p>
<p><em>Note: you can&#8217;t have both timestamp options active at the same time. It&#8217;s a shame, but ah well.</em><br />
<hr />

<h3>3. Customising Colours!</h3>
<p>So, want everything to look fabulous like how it does in my example way up above? No worries, I&#8217;ve got you covered. First, you need the hex codes of the colours you want. I recommend either <a href="http://www.color-hex.com/color-wheel/" rel="nofollow">Colour-Hex</a> or <a href="http://www.w3schools.com/colors/colors_picker.asp" rel="nofollow">W3&#8217;s Colour Picker</a>.</p>
<p>Once you have the colours you want, for <strong>highlighted words</strong> type:</p>
<p>&#8220;<code>/hlcolor ######</code>&#8221; &#8594; so, if we wanted all highlighted nicknames to show up in blue &#8211; with blue&#8217;s hex code being &#8220;0000ff&#8221; &#8211; for instance, we&#8217;d type:</p>
<p>&#8220;<code>/hlcolor 0000ff</code>&#8221; &#8211; <em>no quotes, remember!</em></p>
<p>For <strong>whisper colours</strong> type:</p>
<p>&#8220;<code>/pmcolor ######</code>&#8221; &#8594; so, if we wanted all whispers to show up in red &#8211; with red&#8217;s hex code being &#8220;ff0000&#8221; &#8211; for instance, we&#8217;d type:</p>
<p>&#8220;<code>/pmcolor ff0000</code>&#8221; &#8594; <em>golden rule: no quotes</em></p>
<p>For changing <strong>Moderator and Friend colours</strong>, type:</p>
<p>&#8220;<code>/modcolor ######</code>&#8221; and<br />
&#8220;<code>/friendcolor ######</code>&#8221;</p>
<p>Now, I&#8217;ve been going easy on you with colours, but let&#8217;s try different hexes. How about, for mods, I choose &#8220;ff1ac6&#8221; &#8211; I don&#8217;t know what it&#8217;s called, but it&#8217;s a pretty pink! And for friends, how about&#8230;this hideous, burnt-orange colour, with &#8220;ff8c1a&#8221;? So, I&#8217;d type:</p>
<p>&#8220;<code>/modcolor ff1ac6</code>&#8221;, and<br />
&#8220;<code>/friendcolor ff8c1a</code>&#8221; &#8594; boom, my mod buddies look fab and my friends are hideous, as always.</p>
<p>Finally, <strong>timestamp colour</strong>. Now, it seems to be broken, <em>but</em> if you wanna try anyway, type:</p>
<p>&#8220;<code>/tscolor ######</code>&#8221;</p>
<p>so if I wanted them a bit darker to contract better with the brighter colours I&#8217;ve chosen we could choose&#8230;hmm, how about black? That seems good, yeah? Black is easy &#8211; it&#8217;s &#8220;000000&#8221;, so I&#8217;d type:</p>
<p>&#8220;<code>/tscolor 000000</code>&#8221; &#8211; &gt; and boom, my timestamps are as dark as Batman <del>and soon Aquaman</del>.</p>
<p><strong>Important note on colour selection</strong>: Any colour under the sun flies, <em>provided you enter it correctly</em>. Hex codes for colours start with a pound sign (#), and then have six characters after them &#8211; a mix of letters and numbers. <em>Make sure to only enter the six characters and <strong>not</strong> the pound sign when typing them out</em>.</p>
<h3>Auto-reply</h3>
<p>Fairly simple, Auto-reply allows you to type</p>
<p>&#8220;<code>/r</code>&#8221;, instead of <br />
&#8220;<code>/w [username]</code>&#8221;</p>
<p>in order to whisper someone. Once you type &#8220;/r&#8221;, it&#8217;ll automatically change it to &#8220;/w&#8221; and the name of the user to last message you, <strong>not</strong> the last person <em>you</em> messaged.</p>
<h3>New Chat Size</h3>
<p>So, chat&#8217;s <span>MASSIVE</span> now, isn&#8217;t it? Got plenty of room for normal messages. But, what if you don&#8217;t like the new length, and want it smaller? Or, perhaps you want it <em>larger</em>? Well, aside from chat being a larger size by default, you can also customise it yourself!</p>
<p>But&#8230;it&#8217;s not a pretty thing to do, I&#8217;ll be honest. If you want it back to how it was, type:</p>
<p>&#8220;<code>/defaultsize</code>&#8221; &#8594; (this <em>may</em> not work, I haven&#8217;t confirmed),</p>
<p>OR check the next section on how to turn off scripts. Otherwise, it&#8217;s probably best to leave it as-is. :P</p>
<p><strong>However</strong>, if you insist on changing the size of chat, here&#8217;s the laydown: you need to change the length, height, and the chat member&#8217;s list (up at the top, if you really want; at least I think this is an option) &#8211; in pixels. Yeah, that&#8217;s right, I said it. <em>Pixels</em>: I hope you&#8217;re good with counting.</p>
<p>Here&#8217;s the command:</p>
<p>&#8220;<code>/size X Y</code>&#8221;,</p>
<p>where X and Y are the length and height respectively. So, if you wanted to make chat 300 pixels by 600 pixels (please don&#8217;t, I&#8217;m just throwing numbers out there and have no idea what that comes out as), you&#8217;d type:</p>
<p>&#8220;<code>/size 300 600</code>&#8221;</p>
<p>And boom, it&#8217;s changed to&#8230;whatever that is.</p>
<p>Now, one last section to go!</p>
<h3>I Want To Turn Off A Script!</h3>
<p>Mm, fair request, some aren&#8217;t used by everyone. You can always leave them on, but if you want to turn one off, here&#8217;s how.</p>
<p>You remember that image I linked earlier? Here it is again:</p>
<p><img src="http://i.imgur.com/EGHIh1e.png?1" alt="" /></p>
<p>So, just uncheck any you&#8217;re not interested in, and refresh!</p>

<p>Taken from <a href="http://www.kongregate.com/forums/1/topics/614435">Nomuit's masterthread</a>.

### Do you want to help?

Do you want to add another script? Tell the devs that mantain this repo so they can include it.

If you know how to issue a pull request, go ahead! We will check that everything works when your script is integrated with KongOne and fix it if necessary!

If you want to mantain KongOne, there are some things you need to do before. Don't worry! It's super easy!

1. Install Node.JS and npm:

  * Windows: http://blog.teamtreehouse.com/install-node-js-npm-windows
  * Mac: http://blog.teamtreehouse.com/install-node-js-npm-mac

2. Install Gulp globally using npm. Open the console and run:
  ```
  npm install -g gulp
  ```

And that's it! If you want to build the script, run `gulp` and the KongOne userscript will be automatically generated inside `bin/` with your scripts.
