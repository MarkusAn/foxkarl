var PAGER_ID = 0
var PAGER_SOURCE = {}



browser.menus.create({
    id: "pb_prev-page",
    title: "<-",
    contexts: ["all"]
}, onCreated);

browser.menus.create({
    id: "pb_next-page",
    title: "->",
    contexts: ["all"]
}, onCreated);

browser.menus.create({
    id: "pb_prev-page-10",
    title: "(10)<-",
    contexts: ["all"]
}, onCreated);

browser.menus.create({
    id: "pb_next-page-10",
    title: "->(10)",
    contexts: ["all"]
}, onCreated);

function onCreated() {
    if (browser.runtime.lastError) {
        console.log(`Error: ${browser.runtime.lastError}`);
    }
}

function pagerboyRun(next_prev) {
    browser.tabs.query({
        currentWindow: true,
        active: true
    }).then(function (tabs) {
        pagerboyInspect(tabs[0], next_prev)
    }, onError);
}

function onError(err) {
    console.error(err);
}

function setTabUrl(tab, url) {
    browser.tabs.update({
        url: url
    }).then(onUpdated, onError);
}

function onUpdated(tab) {
    console.log(`Updated tab: ${tab.id}`);
}

function onError(error) {
    console.log(`Error: ${error}`);
}


function updateIndex(old, modifier) {
    return Math.max(old + modifier, 0);
}

function ispageparam(name) {
    switch (name.toLowerCase()) {
        case "page":
            return true;
        case "seite":
            return true;
        case "idx":
            return true;
        case "index":
            return true;
    }
    return false;
}

function pagerboyInspect(tab, next_prev) {
    try {
        var url = new URL(tab.url)
        params = url.search.replace("?", "").split("&");
        for (pkey in params) {
            param = params[pkey]
            elems = param.split("=", 2)
            name = elems[0];
            num = Number.parseInt(elems[1]);
            if (ispageparam(name) && !Number.isNaN(num)) {
                rep = "page=" + updateIndex(num, next_prev);
                setTabUrl(tab, tab.url.replace(param, rep));
                return;
            }
        }
    } catch (uex) {
        console.error("url not parsable: " + tab.url + "\r\n ex: " + uex);
    }
}

// check menu clicks
browser.menus.onClicked.addListener((info, tab) => {
    switch (info.menuItemId) {
        case "pb_next-page":
            pagerboyRun(1);
            break;
        case "pb_prev-page":
            pagerboyRun(-1);
            break;
        case "pb_next-page-10":
            pagerboyRun(10);
            break;
        case "pb_prev-page-10":
            pagerboyRun(-10);
            break;
    }
});


browser.commands.onCommand.addListener(command => {
    switch (command) {
        case 'next-page':
            pagerboyRun(1);
            break;
        case 'previous-page':
            pagerboyRun(-1);
            break;
        case 'next-page-10':
            pagerboyRun(10);
            break;
        case 'previous-page-10':
            pagerboyRun(-10);
            break;
    }
});