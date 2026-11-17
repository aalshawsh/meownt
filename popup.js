const button = document.getElementById("enter")

button.addEventListener("click", async function(){
    const linkToBeAdded = document.getElementById("input").value.trim()

    try{
        const hostname = new URL(linkToBeAdded).hostname
        const pattern = `*://${hostname}/*`
        console.log(pattern)
        const granted = await chrome.permissions.request({ origins: [pattern] })
        console.log(granted)
        showSites()
        document.getElementById("error").style.display = "none"
    } catch (error){
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
           await chrome.permissions.remove({ origins: [origin[i]] })
           showSites()
        })
        item.append(rmvButton)
        list.appendChild(item)
    }
}


showSites()