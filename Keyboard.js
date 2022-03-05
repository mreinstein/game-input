

export const pressed = { }


function _fireKeyDown (ev) {
    pressed[ev.code] = true
}


function _fireKeyUp (ev) {
    pressed[ev.code] = false
}

document.addEventListener('keydown', _fireKeyDown, { passive: true })
document.addEventListener('keyup', _fireKeyUp, { passive: true })
