
let mouseEventElm = window.document
let _eventsBound = false 

export const pressed = { }


export function setEventElement (mouseEventElement=window.document) {
    if (mouseEventElm === mouseEventElement)
        return

    _unbindEvents()
    mouseEventElm = mouseEventElement
    _bindEvents()
}


const _fireMouseDown = function (ev) {
    // ev.which:  1 = left, 2 = middle, 3 = right
    pressed[ev.which] = true
}


const _fireMouseUp = function (ev) {
    // ev.which:  1 = left, 2 = middle, 3 = right
    pressed[ev.which] = false
}


const _bindEvents = function () {
    _unbindEvents()
    _eventsBound = true

    mouseEventElm.addEventListener('mousedown', _fireMouseDown, { passive: true })
    mouseEventElm.addEventListener('mouseup', _fireMouseUp, { passive: true })
}


const _unbindEvents = function () {
    if (!_eventsBound)
        return

    _eventsBound = false

    mouseEventElm.removeEventListener('mousedown', _fireMouseDown, { passive: true })
    mouseEventElm.removeEventListener('mouseup', _fireMouseUp, { passive: true })
}


_bindEvents()
