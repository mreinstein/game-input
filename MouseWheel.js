
let mouseEventElm = mouseEventElement || window.document
let _eventsBound = false 

export const pressed = { }

_bindEvents()


export function setEventElement (mouseEventElement=window.document) {
    if (mouseEventElm === mouseEventElement)
        return
    _unbindEvents()
    mouseEventElm = mouseEventElement
    _bindEvents()
}


const _fireMouseWheel = function (ev) {
    pressed[0] = true
}


// TODO: use wheel event instead. see if there's button press info available
// https://developer.mozilla.org/en-US/docs/Web/API/WheelEvent

const _bindEvents = function () {
    _unbindEvents()
    _eventsBound = true
    mouseEventElm.addEventListener('mousewheel', _fireMouseWheel, { passive: true })
}


const _unbindEvents = function () {
    if (!_eventsBound)
        return

    _eventsBound = false
    mouseEventElm.removeEventListener('mousewheel', _fireMouseWheel, { passive: true })
}
