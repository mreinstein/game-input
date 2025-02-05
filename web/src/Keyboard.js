

export const pressed = { }


function _fireKeyDown (ev) {
    pressed[ev.code] = true
}


function _fireKeyUp (ev) {
    pressed[ev.code] = false
}


window.document.addEventListener('keydown', _fireKeyDown, { passive: true })
window.document.addEventListener('keyup', _fireKeyUp, { passive: true })


// when the window is blurred, release all keys
window.addEventListener('blur', function () {
    for (const i in pressed)
        pressed[i] = false
}, { passive: true })


// release all keys when the window is resized
// this is useful when using electron and the fullscreen is toggled,
// because electron doesn't propogate fullscreen events to the browser window,
// and the fullscreenchange event doesn't fire on the browser window but does
// fire a resize event
window.addEventListener('resize', function () {
    for (const i in pressed)
        pressed[i] = false
}, { passive: true })
