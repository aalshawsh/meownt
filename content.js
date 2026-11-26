const meownt_text = document.createElement("pre")
const meownt_glare = document.createElement("div")
const meownt_interlaced = document.createElement("div")
meownt_text.id = "meownt_text"
meownt_glare.id = "meownt_glare"
meownt_interlaced.id = "meownt_interlaced"
meownt_text.textContent = `
▐██████ ▐██ ▐██      ▐██████ ▐██████      ▐██ ▐██ ▐██████ ▐██ ▐██
▐██ ▐██ ▐██ ▐██      ▐██ ▐██ ▐██ ▐██      ▐██ ▐██ ▐██ ▐██ ▐██ ▐██
▐██ ▐██ ▐██████      ▐██ ▐██ ▐██ ▐██      ▐██████ ▐██ ▐██ ▐██ ▐██
▐██ ▐██ ▐██ ▐██      ▐██ ▐██ ▐██ ▐██        ▐██   ▐██ ▐██ ▐██ ▐██
▐██████ ▐██ ▐██      ▐██ ▐██ ▐██████        ▐██   ▐██████ ▐██████

      ▐██  ▐██ ▐██████ ▐██████ ▐██  ▐██ ▐██████ ▐██ ▐██████
      ▐███▐███ ▐██     ▐██ ▐██ ▐██  ▐██ ▐██ ▐██  ▐█   ▐██
      ▐██▐█▐██ ▐████   ▐██ ▐██ ▐██  ▐██ ▐██ ▐██       ▐██
      ▐██  ▐██ ▐██     ▐██ ▐██ ▐██▐█▐██ ▐██ ▐██       ▐██
      ▐██  ▐██ ▐██████ ▐██████  ▐█████  ▐██ ▐██       ▐██

                       @%             .,@/
                     ,&&@#,           %@(/
                     /@((@@ (        /@((**
                    ,@&%@@@@@/%@,@,@@@@@@@#
                  (%@@@@@@@@@@@@@&%@@@@@@@@(
                 /@@ /@@..%@@@@@@@*.@@@@@@@        ,
              .   %        @@@@@@@, ,@@@@/   /@@@@@
             /&&#/, ,&&..(@@@@@@@@*...#&#  &#    .
                 /@,@@@@@@@@&*/,@@@@@@@@/&%%*
                 *##@@@@@@@@@@@@@@@@@@@@@@(,
                  *//%@@@@@@@@@@@@@@@@@@@#..
                  %@@@@@@@@@@@@@@@@@@@@@@@#
                 /@@@@@@@@@@@@@@@@@@@@@@@@@(
                ,@@@@@@@@@@@@@@@@@@@@@@@@@@@/
               ,,@@@@@@@@@@@@@@@@@@@@@@@@@@@/
                @@@@%/@@@@@@@@@@@@@@%/@@@@@@/
                @@@@%/,(@@@@@@@@@@@@%/,(@@@&*
                @@@@&,#@@@@@@@@@@@@@@%@@@@@(
                @@@@@@@@@@@@@@@@@@@@@@@@@@@
                (@@@@@@@@@@@@@@@@@@@@@@@&*
                    @@, *..% ,,,.  @@/
                    @(             @%`
meownt_text.style.zIndex = "2147483646"

function sleep(ms) {
    return new Promise(function(resolve){ setTimeout(resolve, ms) })
}


async function ending() {
    const oldCover = await turnOff()
    await sleep(1000)
    await turnOn()
    document.documentElement.appendChild(meownt_text)
    document.documentElement.append(meownt_glare, meownt_interlaced)
    oldCover.remove()
    await sleep(10000)
    await turnOff()
    chrome.runtime.sendMessage("close me")
}
ending()


async function turnOff() {
    const cover = document.createElement("div")
    cover.style.cssText = "position:fixed;inset:0;background:black;z-index:2147483646"

    const flash = document.createElement("div")
    flash.style.cssText = "position:fixed;inset:0;background:white;pointer-events:none;z-index:2147483647;will-change:transform,opacity;opacity:0"

    document.documentElement.append(flash)

    // white fades in over the live page
    await flash.animate(
        [{ opacity: 0 }, { opacity: 1 }],
        { duration: 100, easing: "ease-in", fill: "forwards" }
    ).finished

    // black goes in behind the white
    document.documentElement.insertBefore(cover, flash)

    // squash vertically into a line
    await flash.animate(
        [{ transform: "scale(1, 1)" }, { transform: "scale(1, 0.004)" }],
        { duration: 200, easing: "ease-out", fill: "forwards" }
    ).finished

    // line shrinks sideways into a dot
    await flash.animate(
        [{ transform: "scale(1, 0.004)" }, { transform: "scale(0, 0.004)" }],
        { duration: 250, easing: "cubic-bezier(.8,.2,.8,.2)", fill: "forwards" }
    ).finished

    flash.remove()
    return cover
}
async function turnOn() {
    const cover = document.createElement("div")

    const flash = document.createElement("div")

    cover.style.cssText = "position:fixed;inset:0;background:black;z-index:2147483646"
    flash.style.cssText = "position:fixed;inset:0;background:white;pointer-events:none;z-index:2147483647;will-change:transform,opacity;transform:scale(0,0.004)"
    document.documentElement.append(cover, flash)
    await sleep(500)

    // line grows sideways, then fills vertically
    await flash.animate(
        [{ transform: "scale(0, 0.004)" }, { transform: "scale(1, 0.004)" }],
        { duration: 250, easing: "cubic-bezier(.2,.8,.2,1)", fill: "forwards" }
    ).finished

    await flash.animate(
        [{ transform: "scale(1, 0.004)" }, { transform: "scale(1, 1)" }],
        { duration: 200, easing: "ease-in", fill: "forwards" }
    ).finished

    // remove the black behind it, then fade the white away smoothly
    cover.remove()
    await flash.animate(
        [{ opacity: 1 }, { opacity: 0 }],
        { duration: 100, easing: "ease-out", fill: "forwards" }
    ).finished

    flash.remove()
}
