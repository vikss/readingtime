//let's deal with promises as a start
function getCurrentTab(queryOptions) {

    return chrome.tabs.query(queryOptions).then(res => {

        let [tab] = res;
        return tab;
    });
}

chrome.tabs.onActivated.addListener((activeInfo) => {

    //find out if the tabs parentId matches the chosen bookmarks folder
    let tab = isTabBookmarked().then(res => {
        if (res){
            console.log("The current tab is bookmarked")
        let queryOptions = { active: true, lastFocusedWindow: true };
        getCurrentTab(queryOptions).then(tab => {
            chrome.bookmarks.search({ url: tab.url }).then(res => {
                let bInfo = res[0]
                console.log(`Bookmarked node info ${bInfo}`)
                let parentFolderId = bInfo.parentId
                console.log(`Parent folder id is ${parentFolderId}`)
                chrome.bookmarks.get(parentFolderId).then((result) => {

                    let bookmarkObj = result[0];
                    console.log('Bookmark folder info is ', bookmarkObj)
                    console.log("Current tab's tab id is ", activeInfo.tabId)

                    chrome.scripting.executeScript({ target: { tabId: activeInfo.tabId }, files: ["content-script.js"] })
                })
            })
        })
    }
    });
})

function isTabBookmarked() {

    let queryOptions = { active: true, lastFocusedWindow: true };

    return getCurrentTab(queryOptions).then(tab => {


        let url = tab.url
        let isBookmark;
        console.log(`Tab url is ${url}`)
        isBookmark = chrome.bookmarks.search(({ url: url })).then(doc => {
            let document = doc[0];

            return document?.url ? true : false;

        })
        return isBookmark;
    });
}