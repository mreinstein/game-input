
const defaultBindings = [
    // for mousebutton, value 1 === left, 2 === middle, 3 === right
    /*
  {
    name: 'aim',
    event: 'mousebutton',
    value: 3
  },
  */
    {
        name: 'down',
        event: 'key',
        value: 'KeyD',
    },
    {
        name: 'left',
        event: 'key',
        value: 'KeyS',
    },
    {
        name: 'right',
        event: 'key',
        value: 'KeyF',
    },
    {
        name: 'up',
        event: 'key',
        value: 'KeyE',
    },
    {
        name: 'jump',
        event: 'key',
        value: 'Space',
    },
    {
        name: 'fire',
        event: 'key',
        value: 'Period',
    }
]


// usage:
// const Input = inputSystem({ mouseEventElement: window.document, bindings: [ ... ] })

export default function inputManager ({ mouseEventElement, bindings }) {
    mouseEventElement = mouseEventElement || window.document
    bindings = bindings || defaultBindings
    
    const actionMap = {
        key: { },
        mouse: { },
        wheel: { }
    }

    const _down = { }
    const _held = { }
    const _up = { }

    let _eventsBound = false


    const down = function (action) {
        return _down[action]
    }

    const up = function (action) {
        return _up[action]
    }

    const held = function (action) {
        return _held[action]
    }

    const setBindings = function (b = []) {
        _bindEvents()

        actionMap.key = { }
        actionMap.mouse = { }
        actionMap.wheel = { }

        b.forEach(function (binding) {
            if (binding.event === 'key')
                actionMap.key[binding.value] = binding.name

            else if (binding.event === 'mousebutton')
                actionMap.mouse[binding.value] = binding.name

            else if (binding.event === 'mousewheel')
                actionMap.wheel[binding.name] = true
        })
    }

    // convert an action to human readable name (e.g., 'MOUSE RIGHT')
    const humanActionName = function (binding, val) {
        if (binding.event === 'mousewheel')
            return 'MOUSEWHEEL'

        if (binding.event === 'key') {
            if (String.fromCharCode(binding.value) === ' ')
                return 'SPACEBAR'

            return String.fromCharCode(binding.value)
        }

        const buttons = ['NA', 'LEFT', 'MIDDLE', 'RIGHT']
        return 'MOUSE ' + buttons[binding.value]
    }

    const _fireMouseWheel = function (ev) {
        for (const actionName of actionMap.wheel)
            _down[actionName] = true
    }

    const _fireMouseDown = function (ev) {
        // ev.which:  1 = left, 2 = middle, 3 = right
        const actionName = actionMap.mouse[ev.which]

        if (actionName)
            _handleDown(actionName)
    }

    const _fireMouseUp = function (ev) {
        // ev.which:  1 = left, 2 = middle, 3 = right
        const actionName = actionMap.mouse[ev.which]

        if (actionName)
            _handleUp(actionName)
    }

    const _fireKeyDown = function (ev) {
        // holding down a key can repeat the keydown event multiple times. Ignore repeated events
        if (ev.repeat)
            return

        const actionName = actionMap.key[ev.code]
        if (actionName)
            _handleDown(actionName)
    }

    const _fireKeyUp = function (ev) {
        const actionName = actionMap.key[ev.code]
        if (actionName)
            _handleUp(actionName)
    }

    const _handleDown = function (action) {
        _up[action] = false
        _down[action] = true
        _held[action] = true
    }

    const _handleUp = function (action) {
        _up[action] = true
        _down[action] = false
        _held[action] = false
    }

    const _bindEvents = function () {
        unbind()
        _eventsBound = true

        mouseEventElement.addEventListener('mousedown', _fireMouseDown, { passive: true })
        mouseEventElement.addEventListener('mouseup', _fireMouseUp, { passive: true })
        mouseEventElement.addEventListener('mousewheel', _fireMouseWheel, { passive: true, })
        document.addEventListener('keydown', _fireKeyDown, { passive: true })
        document.addEventListener('keyup', _fireKeyUp, { passive: true })
    }

    const unbind = function () {
        if (!_eventsBound)
            return

        mouseEventElement.removeEventListener('mousedown', _fireMouseDown)
        mouseEventElement.removeEventListener('mouseup', _fireMouseUp)
        mouseEventElement.removeEventListener('mousewheel', _fireMouseWheel)
        document.removeEventListener('keydown', _fireKeyDown)
        document.removeEventListener('keyup', _fireKeyUp)
    }

    const endFrame = function () {
        // reset the per-frame flags
        for (const k in actionMap.key) {
            const actionName = actionMap.key[k]
            _down[actionName] = false
            _up[actionName] = false
        }

        for (const k in actionMap.mouse) {
            const actionName = actionMap.mouse[k]
            _down[actionName] = false
            _up[actionName] = false
        }

        for (const k in actionMap.wheel) {
            const actionName = actionMap.wheel[k]
            _down[actionName] = false
            _up[actionName] = false
        }
    }

    setBindings(bindings)

    return {
        down,
        up,
        held,
        actionMap,
        endFrame,
        setBindings,
        unbind,
        humanActionName
    }
}
