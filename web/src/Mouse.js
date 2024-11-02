const mouseEventElm = window.document
let canvasElm = undefined
let _eventsBound = false 

// allow for scaling the mouse input by some arbitrary amount
// useful for high density screens, or when a canvas is scaled
let _scaleFactor = 1

export const pressed = { }
export const position = [ 0, 0 ] // mouse position in the canvas element's coordinate space


export function setEventElement (canvasElement) {
    if (canvasElm === canvasElement)
        return

    _unbindEvents()
    canvasElm = canvasElement
    _bindEvents()
}


export function setScaleFactor (scale) {
    _scaleFactor = scale
}


const _bindEvents = function () {
    _unbindEvents()
    _eventsBound = true

    mouseEventElm.addEventListener('mousedown', _fireMouseDown, { passive: true })
    mouseEventElm.addEventListener('mouseup', _fireMouseUp, { passive: true })
    mouseEventElm.addEventListener('pointermove', _firePointerMove, { passive: true })
}


const _unbindEvents = function () {
    if (!_eventsBound)
        return

    _eventsBound = false

    mouseEventElm.removeEventListener('mousedown', _fireMouseDown, { passive: true })
    mouseEventElm.removeEventListener('mouseup', _fireMouseUp, { passive: true })
    mouseEventElm.removeEventListener('pointermove', _firePointerMove, { passive: true })
}


const _fireMouseDown = function (ev) {
    // ev.which:  1 = left, 2 = middle, 3 = right
    pressed[ev.which] = true
}


const _fireMouseUp = function (ev) {
    // ev.which:  1 = left, 2 = middle, 3 = right
    pressed[ev.which] = false
}


const _firePointerMove = function (ev) {
    // gets the rectangle specifying the dimensions and position of the canvas relative to the viewport
    const rect = canvasElm.getBoundingClientRect()

    position[0] = Math.round((ev.pageX - rect.x) / _scaleFactor)
    position[1]  = Math.round((ev.pageY - rect.y) / _scaleFactor)
}


_bindEvents()
