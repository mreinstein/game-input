
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
    
    let actionMap = { }
    const _down = { }
    const _held = { }
    const _up = { }

    const down = function (action) {
        if (_down[action]) {
            _held[action] = true
            _down[action] = false
            _up[action] = false
            return true
        }
        return false
    }

    const up = function (action) {
        if (_up[action]) {
            _held[action] = false
            _down[action] = false
            _up[action] = false
            return true
        }
        return false
    }

    const held = function (action) {
        return _held[action] || false
    }

    const setBindings = function (b = []) {
        b = JSON.parse(JSON.stringify(b))
        actionMap = { }
        b.forEach(function (binding) {
            actionMap[binding.name] = {
                event: binding.event,
                value: binding.value,
            }
        })
    }

    // convert an action to human readable name (e.g., 'MOUSE RIGHT')
    const humanActionName = function (binding, val) {
        if (binding.event === 'mousewheel') return 'MOUSEWHEEL'

        if (binding.event === 'key') {
            if (String.fromCharCode(binding.value) === ' ') return 'SPACEBAR'

            return String.fromCharCode(binding.value)
        }

        const buttons = ['NA', 'LEFT', 'MIDDLE', 'RIGHT']
        return 'MOUSE ' + buttons[binding.value]
    }

    const _fireMouseWheel = function (ev) {
        Object.keys(actionMap).forEach(function (action) {
            if (actionMap[action].event === 'mousewheel') _down[action] = true
        })
    }

    const _fireMouseDown = function (ev) {
        // ev.which:  1 = left, 2 = middle, 3 = right
        Object.keys(actionMap).forEach(function (action) {
            if (actionMap[action].event === 'mousebutton' && actionMap[action].value === ev.which)
                _handleDown(action)
        })
    }

    const _fireMouseUp = function (ev) {
        // ev.which:  1 = left, 2 = middle, 3 = right
        Object.keys(actionMap).forEach(function (action) {
            if (actionMap[action].event === 'mousebutton' && actionMap[action].value === ev.which)
                _handleUp(action)
        })
    }

    const _fireKeyDown = function (ev) {
        Object.keys(actionMap).forEach(function (action) {
            if (actionMap[action].event === 'key' && actionMap[action].value === ev.code) _handleDown(action)
        })
    }

    const _fireKeyUp = function (ev) {
        Object.keys(actionMap).forEach(function (action) {
            if (actionMap[action].event === 'key' && actionMap[action].value === ev.code) _handleUp(action)
        })
    }

    const _handleDown = function (action) {
        if (!_held[action]) {
            if (!_down[action]) _down[action] = true
            else _down[action] = false
            _held[action] = true
        }
        _up[action] = false
    }

    const _handleUp = function (action) {
        _down[action] = false
        _held[action] = false
        _up[action] = true
    }

    const _start = function () {
        mouseEventElement.addEventListener('mousedown', _fireMouseDown, { passive: true })
        mouseEventElement.addEventListener('mouseup', _fireMouseUp, { passive: true })
        mouseEventElement.addEventListener('mousewheel', _fireMouseWheel, {
            passive: true,
        })
        document.addEventListener('keydown', _fireKeyDown, { passive: true })
        document.addEventListener('keyup', _fireKeyUp, { passive: true })
    }

    setBindings(bindings)
    _start()

    return {
        down,
        up,
        held,
        actionMap,
        setBindings,
        humanActionName
    }
}
