const button = document.getElementById("enter")

button.addEventListener("click", async function(){
    const linkToBeAdded = document.getElementById("input").value.trim()

    try{
        const hostname = new URL(linkToBeAdded).hostname
        const pattern = `*://${hostname}/*`
        const granted = await chrome.permissions.request({ origins: [pattern] })
        if(granted){
            // inject content.js into this site iff it doesn't exist alrdy
            const existing = await chrome.scripting.getRegisteredContentScripts({ ids: [pattern] })
            if (existing.length === 0) {
                await chrome.scripting.registerContentScripts([{
                    id: pattern,
                    matches: [pattern],
                    js: ["content.js"]
                }])
            }
            else{
                console.log("Link already exists")
            }
        }
        showSites()
        document.getElementById("error").style.display = "none"
    } catch (error){
        console.log(error)
        document.getElementById("error").style.display = "block"
    }

})

async function showSites(){
    const list = document.getElementById("list")
    list.textContent = ""
    // print list of links it will work on
    const permissions = await chrome.permissions.getAll()
    const origin = permissions.origins || []
    for (let i =0; i<origin.length;i++){
        const item = document.createElement("li") 
        item.textContent = origin[i]
        const rmvButton = document.createElement("button")
        rmvButton.textContent = "X"
        rmvButton.addEventListener("click", async function(){
            try{
                await chrome.scripting.unregisterContentScripts({ ids: [origin[i]] })
            }
            catch(error){
                console.log(error)
            }
            await chrome.permissions.remove({ origins: [origin[i]] })
            showSites()
        })
        item.append(rmvButton)
        list.appendChild(item)
    }
}


showSites()