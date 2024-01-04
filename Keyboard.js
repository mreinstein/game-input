

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
