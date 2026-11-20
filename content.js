// add red border
const cat = document.createElement("div")
const scale = 5
const offset = 73
cat.style.imageRendering = "pixelated"
cat.style.transformOrigin = "bottom right"
cat.style.transform = `scale(${scale})`
cat.style.width = "200px"       // ONE frame's width
cat.style.height = "100px"      
cat.style.backgroundImage = `url(${chrome.runtime.getURL("images/walk.png")})`
cat.style.backgroundPosition = "0px 0px"   // 0px = first frame
cat.style.position = "fixed"
cat.style.right = `${-offset * scale - 400}px`
cat.style.bottom = "-2px"
cat.style.zIndex = "2147483647"
document.documentElement.appendChild(cat)

let frame = 0
const frameCount = 7
const frameWidth = 200

const walkTimer = setInterval(function(){
    cat.style.backgroundPosition = `${-frame * frameWidth}px 0px`
    frame = (frame + 1) % frameCount
}, 100)

cat.style.transition = "right 3s linear"

requestAnimationFrame(function(){
    requestAnimationFrame(function(){
        cat.style.right = `calc(50vw - ${frameWidth * scale / 2}px)`
    })
})

let cryTimer
let frame2 = 0
const frame2Count = 9
const frame2Width = 200
cat.addEventListener("transitionend", function(event){
    if (event.propertyName !== "right") return
    clearInterval(walkTimer)
    cat.style.backgroundImage = `url(${chrome.runtime.getURL("images/cry.png")})`
    cat.style.backgroundPosition = "0px 0px"
    cryTimer = setInterval(function(){
    cat.style.backgroundPosition = `${-frame2 * frame2Width}px 0px`
    frame2 = (frame2 + 1) % frame2Count
    }, 100)

    bar = document.createElement("div")
    bar.style.position = "fixed"
    bar.style.bottom = "0px"
    bar.style.left = "0px"
    bar.style.right = "0px"
    bar.style.height = "0px"
    bar.style.background = "royalblue"
    bar.style.zIndex = "2147483646"
    bar.style.transition = "height 5s linear"
    document.documentElement.appendChild(bar)
    requestAnimationFrame(function(){
        requestAnimationFrame(function(){
            bar.style.height = "100vh"
        })
    })

    bar.addEventListener("transitionend", function(){
        clearInterval(cryTimer)
        chrome.runtime.sendMessage("close me")
    })
})

//chrome.runtime.sendMessage("close me")
