chrome.runtime.onMessage.addListener(function(message, sender){
    if( message === "close me"){
    chrome.tabs.remove(sender.tab.id)
    }

})
