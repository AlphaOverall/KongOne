//=require ../script.js

class ThreadWatcher extends Script {
    constructor() {
        super('Thread Watcher',  /^\//, true);
    }
    
    run() {
        function Thread(threadId, threadTitle, lastPostId, lastPostAuthor, forumId) {
            this.threadId   = threadId;
            this.threadTitle    = threadTitle;
            this.lastPostId = lastPostId;
            this.lastPostAuthor = lastPostAuthor;
            this.forumId    = forumId;
        }

        Thread.prototype = {

            THREADS_KEY: "thread",

            save: function () {
                var threadsWatched = localStorage.getItem(this.THREADS_KEY);
                if (threadsWatched === null)
                    threadsWatched = {};
                else
                    threadsWatched = JSON.parse(threadsWatched);

                threadsWatched[this.threadId] = {
                    threadId: this.threadId,
                    forumId: this.forumId,
                    lastPostId: this.lastPostId,
                    threadTitle: this.threadTitle,
                    lastPostAuthor: this.lastPostAuthor
                };

                localStorage.setItem(this.THREADS_KEY, JSON.stringify(threadsWatched));
            },

            watch: function () {
                this.save();
            },

            unwatch: function () {
                var threadsWatched = JSON.parse(localStorage.getItem(this.THREADS_KEY));
                if (threadsWatched === null || !this.isWatched())
                    return;

                delete threadsWatched[this.threadId];
                localStorage.setItem(this.THREADS_KEY, JSON.stringify(threadsWatched));
            },

            wasUpdated: function () {
                if (!this.isWatched())
                    return false;

                var storedThread = Thread.get(this.threadId);
                return storedThread ? storedThread.lastPostId < this.lastPostId : false;
            },

            isOlder: function (aThread) {
                return this.lastPostId < aThread.lastPostId;
            },

            isWatched: function () {
                return !!Thread.get(this.threadId);
            },

            getUrl: function () {
                return '/forums/'+ this.forumId +'/topics/'+ this.threadId;
            },

            createWatchButton: function () {
                var link = new Element('a', {href: 'javascript:void(0);'})
                        .update(this.isWatched() ? Thread.UNWATCH : Thread.WATCH);
                link.setAttribute('class', this.isWatched() ? 'unwatch-btn' : 'watch-btn');

                var self = this;
                link.observe('click', function (e) {
                    e.stop();

                    if (self.isWatched()) {
                        self.unwatch();
                        link.update(Thread.WATCH)
                            .setAttribute('class', 'watch-btn');
                    } else {
                        self.watch();
                        link.update(Thread.UNWATCH)
                            .setAttribute('class', 'unwatch-btn');
                    }
                });

                return link;
            }

        };

        Thread.WATCH = 'watch';
        Thread.UNWATCH = 'unwatch';

        Thread.getPostIdFromUrl = function (url) {
            var matches = url.match(/posts-([0-9]+)-row/);
            return matches !== null ? parseInt(matches[1]) : null;
        };

        Thread.getThreadIdFromUrl = function (url) {
            var matches = url.match(/topics\/([0-9]+)/);
            return matches !== null ? parseInt(matches[1]) : null;
        };

        Thread.getForumIdFromUrl = function (url) {
            var matches = url.match(/forums\/([0-9]+)/);
            return matches !== null ? parseInt(matches[1]) : null;
        };

        Thread.create = function (threadId, threadTitle, lastPostId, lastPostAuthor, forumId) {
            return new Thread(threadId, threadTitle, lastPostId, lastPostAuthor, forumId);
        };

        Thread.createFromUrl = function (url) {
            return Thread.create(
                Thread.getThreadIdFromUrl(url),
                null,
                Thread.getPostIdFromUrl(url),
                null,
                Thread.getForumIdFromUrl(url)
            );
        };

        Thread.get = function (threadId) {
            var threadsWatched = Thread.getAllWatched();
            if (threadsWatched === null)
                return null;

            return threadsWatched[threadId];
        };

        Thread.getAllWatched = function () {
            var threadsWatched = localStorage.getItem(Thread.prototype.THREADS_KEY);
            if (threadsWatched === null)
                    return null;

            threadsWatched = JSON.parse(threadsWatched);
            for (var i in threadsWatched) {
                var obj = threadsWatched[i];
                threadsWatched[i] = Thread.create(
                    obj.threadId,
                    obj.threadTitle,
                    obj.lastPostId,
                    obj.lastPostAuthor,
                    obj.forumId
                );
            }

            return threadsWatched;
        };

        /* url: https://www.kongregate.com/forums/ */
        function threads(){
            var css = document.createElement('style');
            css.innerHTML = 'td.lp span a.unwatch-btn { color: #336699; } td.lp span a.unwatch-btn { color: #900; }';
            document.head.appendChild(css);

            var threads = $$('.hentry');
            threads.each(function (thread) {
                var links = thread.select('a');
                var url = links[links.length - 1].href;
                var t = Thread.createFromUrl(url);
                t.threadTitle = thread.select('.entry-title')[0].innerText;
                t.lastPostAuthor = thread.select('.author')[0].firstChild.innerText;

                var actionLink = t.createWatchButton();
                actionLink.setStyle({
                    'margin-left': '2px'
                });
                thread.select('.lp')[0]
                    .insert(new Element('span').insert(actionLink));

                if (t.isWatched() && t.wasUpdated()) {
                    thread.select('.icon')[0].setStyle({
                        transition: 'all ease 0.5s',
                        backgroundColor: 'deepskyblue'
                    });
                }
            });
        }

        // url: https://www.kongregate.com/forums/*/topics/*
        function thread() {
            var id = Thread.getThreadIdFromUrl(location.href),
                thread = Thread.get(id);
            
            var titleClone = $$('.forum_header h1')[0].clone(true);
            var threadTools = titleClone.select('#topic_mod')[0];
            if (threadTools)
                threadTools.remove();
            
            var threadTitle = titleClone.innerText.match(/(.*?)(\s+page\s+[0-9]+|$)/m)[1];
            
            if (!thread) {
                thread = Thread.createFromUrl(location.href);
                // Avoid fetching real last id, setting to negative id
                thread.lastPostId = -1;
                thread.lastPostAuthor = null; // Doesn't matter

                thread.threadTitle = threadTitle;
            }
            
            if (thread.isWatched() && thread.threadTitle !== threadTitle) {
                thread.threadTitle = threadTitle;
                thread.save();
            }

            var lastPost = $$('.post:last')[0];
            if (!lastPost)
                return;

            var lastId = lastPost.getAttribute('id').match(/posts-([0-9]+)-row/)[1];
            if (thread.isWatched() && lastId > thread.lastPostId) {
                thread.lastPostId = lastId;
                thread.save();
            }

            var watchButton = thread.createWatchButton().setStyle({ marginLeft: '10px' });
            $$('.media.mbs').each(function (i) {
                i.select('.utility').each(function (j) {
                    j.insert({
                        after: watchButton
                    });
                });
            });

            updateIfThreadIsRecent(id);
        }


        /* url: https://www.kongregate.com/community/ */
        function community() {
            var containerTitle = new Element('h3', {
                id: 'watched_threads_title',
                class: 'forum_group_title h2 mtl'
            }).update('Watched Threads');

            var threadsTable = new Element('table');
            $('forums_title').parentNode.insert({ bottom: containerTitle });
            $('forums_title').parentNode.insert({ bottom: threadsTable });

            var threadsTableBody = new Element('tbody');
            threadsTable.insert(threadsTableBody);

            var onUnwatchClick = function (thread, row) {
                return function(e) {
                    e.stop();
                    thread.unwatch();
                    row.remove();
                };
            };

            var threads = Thread.getAllWatched();
            for (var i in threads) {
                var t = threads[i];
                var row = new Element('tr');
                threadsTableBody.insert(row);

                var titleContainer = new Element('td', {
                    class: 'c2 pts'
                });
                row.insert(titleContainer);

                var title = new Element('a', {
                    class: 'title h3',
                    href: t.getUrl()
                }).update(t.threadTitle);
                titleContainer.insert(title);

                var unwatchButton = new Element('a', {
                    href: 'javascript:void(0);'
                }).update('unwatch')
                .setStyle({
                    'float': 'right'
                });

                unwatchButton.observe('click', onUnwatchClick(t, row));

                titleContainer.insert(unwatchButton);
            }

        }

        function buildWelcomeBarIcon() {
            //on new page load, we will strip the "is parsing right now";
            var isProcessing = JSON.parse(localStorage.getItem(THREADS_ARE_CURRENTLY_PROCESSING)) || false;
            if(isProcessing)
                localStorage.setItem(THREADS_ARE_CURRENTLY_PROCESSING, false);

            console.log("Building Welcome Bar");
            var welcomeBar = $("nav_welcome_box");
            var welcomeBarElementToInsertAfter = $$(".friends");
            var forumIcon = new Element('li', {
                class:'forum_profile_control messages profile_control'
            }).update("Forum")
            .setStyle({
                width:"80px",
                cursor: 'pointer',
                'font': "600 14px/27px 'Source Sans Pro', 'Helvetica', Arial, sans-serif",
                'padding-left': '7px'
            });

            
            var linkElement = new Element('a', {
                    class: 'my-messages',
                    href: '#'
                })
                .setStyle({
                    display:'inline-block',
                    'padding-left':'0px'
                });

            var iconElement = new Element('span', {
                    class: 'alert_messages',
                    id:'profile_bar_messages',
                    href: '#'
                });

            var alertIconElement = new Element('span', {
                    class: 'kong_ico',
                    href: '#'
                }).update("");

            var alertMessageElement = new Element('span', {
                    class: 'msg-count mls has_messages',
                    id:'forum_counter',
                    href: '#'
                }).update("1");
            var threadDisplayElement = new Element('ul', {
                id:'forum_activity_lister'
            });
            forumIcon.insert(linkElement);
            linkElement.insert(iconElement);
            linkElement.insert(threadDisplayElement);
            iconElement.insert(alertIconElement);
            iconElement.insert(alertMessageElement);

            welcomeBarElementToInsertAfter.first().insert({after:forumIcon});

            addSettings();

        /*li
        <a class="my-messages" href="/accounts/UnknownGuardian/private_messages" id="my-messages-link" title="0 shouts, 1 whispers">  
            <span id="profile_bar_messages" class="alert_messages">
                <span aria-hidden="true" class="kong_ico">m</span><span id="profile_control_unread_message_count" class="msg-count mls has_messages">1</span>
                </span>
        </a>
        li*/
            var css = document.createElement('style');
            css.innerHTML =  ".welcome-user .forum_profile_control.messages:hover{background-color:#423f3e;padding-bottom:1px}";
            css.innerHTML += ".welcome-user .forum_profile_control{cursor:pointer;width:49px}";
            css.innerHTML += ".welcome-user .forum_profile_control:hover ul{background-color:#423f3e;display:block}";
            css.innerHTML += ".welcome-user .forum_profile_control ul a{color:#fff;display:inline-block;font:600 14px/35px 'Source Sans Pro',Helvetica,Arial,sans-serif;padding:0 0px;position:relative;text-decoration:none;width:100%}";
            css.innerHTML += ".welcome-user .forum_profile_control ul li a:after{border-bottom:1px dotted #9b9a9a;bottom:0;content:'';display:block;left:0px;position:absolute;right:0px}";
            css.innerHTML += ".welcome-user .forum_profile_control ul{display:none;list-style:none;position:absolute;right:0;top:100%;width:480px;text-align: left;padding: 0 15px;}";
            css.innerHTML += ".welcome-user .forum_profile_control ul li .faded_in_menu{color:#bbb}";
            css.innerHTML += ".welcome-user .forum_profile_control ul li .thread_title_in_menu:hover{color:#ffe9ad !important}";
            css.innerHTML += ".welcome-user .forum_profile_control ul li .post_count_in_menu{color:#bbb; float:right}";
            css.innerHTML += ".welcome-user .forum_profile_control ul .setting_in_menu{color:#bbb; font-size:12px; padding-right:15px}";
            css.innerHTML += ".welcome-user .forum_profile_control ul .setting_in_menu:hover{color:#ffe9ad;}";
            document.head.appendChild(css);

        }
        var TIME_BETWEEN_PULLS = 1000 * 60 * 1; // 1000 milliseconds per 1 second * 60 seconds per 1 minute * 5 minutes (greater than 5 minutes have past)
        var MAX_RECENT_POSTS = 25;
        function startRecentPostsPull() {
            window._PULL_ID = "posts_ajax_last_request";
            
            var lastPullDate = Date.parse(localStorage.getItem(window._PULL_ID) || 0); //default to 0
            var currentDate = new Date();
            if(currentDate - lastPullDate > TIME_BETWEEN_PULLS) {
                pullWatchedThreadsAndRecentPosts();
            }
            else {
                var timeLeftToElapse = TIME_BETWEEN_PULLS - (currentDate - lastPullDate);
                setTimeout(pullWatchedThreadsAndRecentPosts,timeLeftToElapse);
                updateThreadIcon();
            }
        }

        function pullWatchedThreadsAndRecentPosts() {
            localStorage.setItem(window._PULL_ID, new Date());
            new Ajax.Request('https://www.kongregate.com/users/' + active_user.id() + '/posts.json', {
                method:'get',
                onSuccess: function(transport){ 
                    var json = transport.responseText.evalJSON();console.log("Found users", json.users.length);
                    var idsOfRecentThreads = [];
                    var idsOfRecentForums = [];
                    for(var j = 0; j < json.posts.length && j < MAX_RECENT_POSTS;j++) {
                        var threadID = json.posts[j].topic_id;
                        idsOfRecentThreads.push(threadID);
                        idsOfRecentForums.push(getForumIDFromThreadID(json,threadID));
                    }
                    console.log("[Thread Watcher] We'll want to pull recent threads with IDS", idsOfRecentThreads);
                    clearOldThreads(idsOfRecentThreads, idsOfRecentForums);
                    checkIfUpdateToListOfThreads(idsOfRecentThreads);
                },
                onFailure: function(t) {   
                    //silently fail 
                    console.log("[Thread Watcher] We could not find the latest posts");
                    }
                });
            console.log("[Thread Watcher] Setting check time again in " + TIME_BETWEEN_PULLS / 1000 + " seconds.");
            setTimeout(pullWatchedThreadsAndRecentPosts,TIME_BETWEEN_PULLS);
        }

        function getForumIDFromThreadID(json, id) {
            for(var i = 0; i < json.topics.length;i++) {
                if(json.topics[i].id == id) {
                    return json.topics[i].forum_id;
                }
            }
            return -1; //some might not have this?
        }

        /* array of new thread ids. Discard those that don't match up */
        var STORED_RECENT_THREADS = "stored_recent_threads";
        var STORED_RECENT_THREADS_PREFIX = "thread_";
        function clearOldThreads(arr, arrForums) {
            console.log("[Thread Watcher] Clearing old threads: ", STORED_RECENT_THREADS);
            var alreadyStored = JSON.parse(localStorage.getItem(STORED_RECENT_THREADS)) || {};
            var newToStore = {};
            for(var i = 0; i < arr.length;i++) {
                console.log("[Thread Watcher] Clearing old threads inner", i);
                if(alreadyStored[STORED_RECENT_THREADS_PREFIX + arr[i]] != undefined) { //only copy over the ones that exist in the new array. discard the other ones
                    newToStore[STORED_RECENT_THREADS_PREFIX + arr[i]] = alreadyStored[STORED_RECENT_THREADS_PREFIX + arr[i]]; //what is stored is the post count and forum ID
                }
                else {
                    newToStore[STORED_RECENT_THREADS_PREFIX + arr[i]] = {forumID:arrForums[i], threadID:arr[i], seenPostCount:0, livePostCount:0};
                }
            }
            console.log("[Thread Watcher] Clearing old threads saving");
            localStorage.setItem(STORED_RECENT_THREADS, JSON.stringify(newToStore)); //set the item to the ones we are interested in.
        }

        var THREADS_TO_PROCESS = "threads_to_process";
        var THREADS_ARE_CURRENTLY_PROCESSING = "threads_currently_processing";
        function checkIfUpdateToListOfThreads(arr) {
            console.log("[Thread Watcher] Checking if up to date with list of threads");
            var toProcess = JSON.parse(localStorage.getItem(THREADS_TO_PROCESS));
            if(toProcess == null)
                toProcess = [];
            toProcess = toProcess.concat(arr);
            localStorage.setItem(THREADS_TO_PROCESS, JSON.stringify(toProcess)); //save the newly concatenated process list
            var isProcessing = JSON.parse(localStorage.getItem(THREADS_ARE_CURRENTLY_PROCESSING)) || false; //default to false
            console.log("[Thread Watcher] Checking if up to date with list of threads finished. Is it currently running?", isProcessing);
            if(!isProcessing) {
                console.log("[Thread Watcher] Checking if up to date with list of threads finished. Before");
                processThreadsCheckingForUpdates();
                console.log("[Thread Watcher] Checking if up to date with list of threads finished. after");
            }
        }

        function processThreadsCheckingForUpdates() {
            console.log("[Thread Watcher] Processing threads checking for updates");
            localStorage.setItem(THREADS_ARE_CURRENTLY_PROCESSING, true);
            var currentListToProcess = JSON.parse(localStorage.getItem(THREADS_TO_PROCESS)) || [];
            if(currentListToProcess.length == 0) {
                //exit early. Not sure why it got here, perhaps recursion
                console.log("[Thread Watcher] Current list to process is length of 0, Halting.");
                localStorage.setItem(THREADS_ARE_CURRENTLY_PROCESSING, false);
                return;
            }

            var alreadyStored = JSON.parse(localStorage.getItem(STORED_RECENT_THREADS)) || {};
            var processThreadID = currentListToProcess.shift();
            var storedThread = alreadyStored[STORED_RECENT_THREADS_PREFIX + processThreadID];
            if(storedThread == undefined) {
                console.log("[Thread Watcher] Stored object was undefined:", processThreadID, " Halting.");
                localStorage.setItem(THREADS_ARE_CURRENTLY_PROCESSING, false);
                return;
            }
            var forumID = storedThread.forumID;
            var seenPostCount = storedThread.seenPostCount;
            console.log("[Thread Watcher] We are making a request to:", 'https://www.kongregate.com/forums/' + forumID + '/topics/' + processThreadID + '.json');
            new Ajax.Request('https://www.kongregate.com/forums/' + forumID + '/topics/' + processThreadID + '.json', {
                method:'get',
                onSuccess: function(transport){ 
                    console.log("[Thread Watcher] We got a response to:", 'https://www.kongregate.com/forums/' + forumID + '/topics/' + processThreadID + '.json');
                    var json = transport.responseText.evalJSON();
                    var livePostCount = json.topic.posts_count;
                    if(livePostCount != seenPostCount) {
                        console.log("[Thread Watcher] We've found a thread that has new activity:" , livePostCount - seenPostCount, "new posts. Thread ID:", processThreadID);
                        storedThread.differenceInPostCount = livePostCount - seenPostCount;
                        storedThread.livePostCount = livePostCount;
                        storedThread.title = json.topic.title;
                        storedThread.latestPostBy = json.topic.latest_post_by;
                        storedThread.lastPage = Math.ceil(json.topic.posts_count /25); // 25 posts per page, estimate last page data
                    }
                    localStorage.setItem(STORED_RECENT_THREADS, JSON.stringify(alreadyStored));
                    localStorage.setItem(THREADS_TO_PROCESS, JSON.stringify(currentListToProcess)); //save the shifted array
                    if(livePostCount != seenPostCount)
                    {
                        updateThreadIcon();
                    }
                    //recursive call:
                    console.log(processThreadsCheckingForUpdates);
                    processThreadsCheckingForUpdates();
                },
                onFailure: function(t) {   
                    //silently fail 
                    console.log("[Thread Watcher] We could not find the thread");
                    }
                });
        }

        function updateIfThreadIsRecent(id) {
            console.log("[Thread Watcher] Updating if thread is recent", id);
            var alreadyStored = JSON.parse(localStorage.getItem(STORED_RECENT_THREADS)) || {};
            console.log("We found", alreadyStored);
            if(alreadyStored[STORED_RECENT_THREADS_PREFIX + id] != undefined) {
                console.log("[Thread Watcher] Updating recent thread to live post count");
                var thread = alreadyStored[STORED_RECENT_THREADS_PREFIX + id];
                thread.seenPostCount = thread.livePostCount;
                localStorage.setItem(STORED_RECENT_THREADS, JSON.stringify(alreadyStored));
            }
        }

        function updateThreadIcon() {
            //{forumID:arrForums[i], lastPage:0, threadID:arr[i], latestPostBy:"asd", seenPostCount:0, livePostCount:0}
            while($('forum_activity_lister').firstDescendant()) { 
                $('forum_activity_lister').firstDescendant().remove();
            }


            var threadsWithUpdatesMetaData = [];
            var alreadyStored = JSON.parse(localStorage.getItem(STORED_RECENT_THREADS)) || {};
            for (var key in alreadyStored) {
            if (alreadyStored.hasOwnProperty(key)) {
                var thread = alreadyStored[key];
                if(thread.livePostCount > thread.seenPostCount) {
                    console.log("We are updating the thread icon");
                    threadsWithUpdatesMetaData.push(thread);
                    var threadContainer = new Element("li");
                    var threadDisplay = new Element('a', {
                        target: (/\.com\/games/.test(location.href)) ? "_blank" : "",
                        href: 'https://www.kongregate.com/forums/' + thread.forumID + '/topics/' + thread.threadID + (thread.lastPage > 0 ? '?page=' + thread.lastPage : '')
                    }).update(createStyledThreadUsername(thread.latestPostBy) + ' <i class="faded_in_menu">posted in</i> ' + createStyledThreadTitle(thread.title) + ' ' + createStyledThreadNewPostCount(thread.differenceInPostCount));

                    //var posterDisplay = new Element("span").update(thread.latestPostBy + ' | ');
                    //threadContainer.insert(posterDisplay);
                    threadContainer.insert(threadDisplay);
                    $('forum_activity_lister').insert(threadContainer);
                }
            }
            }
            console.log("[Thread Watcher] Updating count in welcome bar");
            $('forum_counter').update(threadsWithUpdatesMetaData.length);
            addSettings();
        }

        function addSettings() {
            var clear_cache_setting = new Element("span",{class:"setting_in_menu"}).update("Clear Cache");
            clear_cache_setting.on("click", function(e) {
                localStorage.removeItem(STORED_RECENT_THREADS);
                localStorage.removeItem(window._PULL_ID);
                localStorage.removeItem(THREADS_TO_PROCESS);
                localStorage.removeItem(THREADS_ARE_CURRENTLY_PROCESSING);
                localStorage.removeItem(STORED_RECENT_THREADS);
                e.target.textContent = "Cleared";
                $('forum_counter').update(0);
                //remove all
                while($('forum_activity_lister').firstDescendant()) { 
                    $('forum_activity_lister').firstDescendant().remove();
                }
                return false;
            });

            var mark_as_read_setting = new Element("span",{class:"setting_in_menu"}).update("Mark all as read");
            mark_as_read_setting.on("click", function(e) {
                var alreadyStored = JSON.parse(localStorage.getItem(STORED_RECENT_THREADS)) || {};
                for (var key in alreadyStored) {
                    if (alreadyStored.hasOwnProperty(key)) {
                        var thread = alreadyStored[key];
                        thread.seenPostCount = thread.livePostCount;
                        
                    }
                }
                localStorage.setItem(STORED_RECENT_THREADS, JSON.stringify(alreadyStored));
                $('forum_counter').update(0);
                return false;
            });

            $('forum_activity_lister').insert(clear_cache_setting);
            $('forum_activity_lister').insert(mark_as_read_setting);

        }
        function createStyledThreadUsername(u) {
            return "<span class='username_in_menu'>" + u + "</span>";
        }

        function createStyledThreadTitle(t) {
            if(t.length > 30) {
                t = t.substring(0,27) + '...';
            }
            return "<span class='thread_title_in_menu'>" + t + "</span>";
        }
        function createStyledThreadNewPostCount(p) {
            return "<span class='post_count_in_menu'>" + p + " new posts</span>";
        }

        (function() {
            'use strict';
            if (/\.com\/forums\/.*\/topics/.test(location.href))
                thread();
            else if (/\.com\/forums/.test(location.href))
                threads();
            else if (/\.com\/community/.test(location.href))
                community();
            
            buildWelcomeBarIcon();
            startRecentPostsPull();
        })();
    }
}