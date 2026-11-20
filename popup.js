function sleep(ms) {
    return new Promise(function(resolve){ setTimeout(resolve, ms) })
}

const input = document.getElementById("input")
input.addEventListener("keydown", async function (event) 
{
  if (event.key === "Enter") {

    const linkToBeAdded = input.value.trim()

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
        input.value = "";
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
        item.id = origin[i]
        const rmvButton = document.createElement("button")
        rmvButton.textContent = "/ᐠ - ˕ -マ ᶻ 𝗓 𐰁"
        rmvButton.addEventListener("click", async function(){
            try{
                await chrome.scripting.unregisterContentScripts({ ids: [origin[i]] })
            }
            catch(error){
                console.log(error)
            }
            await chrome.permissions.remove({ origins: [origin[i]] })
            // remove the deleted link...
            await deleteLink(item)
            item.remove()
        })
        rmvButton.id = "rmvButton"
        rmvButton.className = "rmvButton"
        item.append(rmvButton)
        list.appendChild(item)
    }
}


showSites()
framesSleepy =[
    "/ᐠ - ˕ -マ",
    "/ᐠ - ˕ -マ ᶻ",
    "/ᐠ - ˕ -マ ᶻ 𝗓",
    "/ᐠ - ˕ -マ ᶻ 𝗓 𐰁"
]

framesHungy = [
    "/ᐠ-ⱉ-ᐟ\\ﾉ ",
    "/ᐠ-ⱉ-ᐟ\\ﾉ ᶠ",
    "/ᐠ-ⱉ-ᐟ\\ﾉ ᶠe",
    "/ᐠ-ⱉ-ᐟ\\ﾉ ᶠeᵉ",
    "/ᐠ-ⱉ-ᐟ\\ﾉ ᶠeᵉd",
    "/ᐠ-ⱉ-ᐟ\\ﾉ ᶠeᵉd ᵐ",
    "/ᐠ-ⱉ-ᐟ\\ﾉ ᶠeᵉd ᵐe",
]
let countSleepy =0;
let countHungy =0;
/* Loop animation for rmvButton */
snooze = setInterval(function(){
    const buttons = document.querySelectorAll(".rmvButton")

    let hovering = false
    buttons.forEach(function (tmp) {
        if (tmp.dataset.paused) return
        if(tmp.matches(":hover"))
        {
            hovering = true
            tmp.textContent = framesHungy[countHungy]

            /*start jittering when spelled out "feed me"*/
            if(countHungy === framesHungy.length -1){

                jiggle(tmp, framesHungy[countHungy],8)
            }
        }
        else{
            tmp.style.transform = ""
            tmp.textContent = framesSleepy[countSleepy]
        }
    })
    if(hovering){
        // countSleepy =0;
        if(countHungy < framesHungy.length -1){

            countHungy = (countHungy+1)
        }
    }
    else {
        countHungy = 0
    }


    countSleepy = (countSleepy+1)%framesSleepy.length


    }, 250)

/* Create a jiggle effect for rmvButton */
function jiggle(btn, text, jiggleStart){

    const chars=[...text]
    btn.textContent = ""
    chars.forEach(function(ch,i){
        if(i<jiggleStart){
            btn.append(ch)
        }
        else{
            const span = document.createElement("span")
            span.style.whiteSpace = "pre"
            span.textContent = ch
            span.style.display = "inline-block"
            span.style.transform = `translateY(${Math.random()}px)`
            btn.append(span)
        }
    })
}

async function deleteLink(listItem){
    // draw it being deleted...
    const btn = listItem.querySelector(".rmvButton")
    btn.disabled = true
    btn.dataset.paused = "true"         // make sure animation pauses...
    
    btn.textContent = "(•˕ •マ.ᐟ"
    await sleep(1000)

    btn.textContent = "/ᐠ-ⱉ-ᐟ\\ﾉ "
    const text = listItem.firstChild.textContent
    let result;
    for (let i = 0; i < text.length; i++){
        result = "\u00A0".repeat(i) + ">-;;⁠;⁠;€ᐷ" + text.slice(i + 1) 
        await sleep(250)
        listItem.firstChild.textContent = result
    }
    // cat starts eating
    await sleep(250)
    listItem.firstChild.textContent ="\u00A0".repeat(text.length)
    btn.textContent = "/ᐠ•⤙•ᐟ\\"
    await sleep(2000)
    btn.textContent = "/ᐠっ˘ڡ˘ςᐟ\\"
    await sleep(2000)
    btn.textContent = "ദ്ദി/ᐠ｡‸｡ᐟ\\"
    await sleep(2000)


}
