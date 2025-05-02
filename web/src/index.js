import * as Keyboard from './Keyboard.js'
import * as Mouse    from './Mouse.js'


// example bindings
/*
[
    {
        name: 'aim',
        event: 'mousebutton',
        value: 3  // for mousebutton, value 1 === left, 2 === middle, 3 === right
    },
    {
        name: 'down',
        event: 'gamepad',
        gamepadIndex: 0,
        buttonIndex: 4
    },
    {
        name: 'down',
        event: 'key',
        value: 'KeyD',
    },
    {
        name: 'down',
        event: 'gamepad',
        gamepadIndex: 0,

        isAnalog: true,

        // 0, 1  <-- left analog stick x, y
        // 2, 3  <-- right analog stick x, y
        analogAxisId: 0,

        // -1 for left or up, 1 for right or down
        analogAxisDirection: -1,

        // how much dead zone to allow before converting from analog to digital.
        // defaults to 0.1
        analogAxisDeadZone: 0.2,
    }
]
*/


// usage:
// const Input = webInput({ canvas: document.querySelector('canvas'), bindings: [ ... ] })

export default function webInput ({ canvas, bindings }) {
    Mouse.setEventElement(canvas)

    /*
    // a map where key is the event name, and value is all control bindings for it
    _bindings: {
        fire: [
            {
                name: 'down',
                event: 'gamepad',
                gamepadIndex: controlsGamepad?.index,
                buttonIndex: 13,
            },
            {
                name: 'down',
                event: 'gamepad',
                gamepadIndex: 0,

                isAnalog: true,

                // 0, 1  <-- left analog stick x, y
                // 2, 3  <-- right analog stick x, y
                analogAxisId: 0,

                // -1 for left or up, 1 for right or down
                analogAxisDirection: -1,

                // how much dead zone to allow before converting from analog to digital.
                // defaults to 0.1
                analogAxisDeadZone: 0.2,
            }
        ]
    }
    */

    let _bindings = { }

    // key is action name, value is up/down/held states this frame
    // 'jump'   { up: false, down: false, held: false }
    const state = new Map()
        

    const down = function (action) {
        return state.get(action)?.down
    }

    const up = function (action) {
        return state.get(action)?.up
    }

    const held = function (action) {
        return state.get(action)?.held
    }

    // @parram Boolean reset when true, clears all previous bindings
    const setBindings = function (b = [], reset=true) {

        _bindings = { }
        for (const next of b) {
            if (!_bindings[next.name])
                _bindings[next.name] = [ ]

            _bindings[next.name].push(structuredClone(next))
        }
        
        if (!reset)
            return

        state.clear()
        for (const next of b)
            state.set(next.name, { up: false, down: false, held: false })
    }

    const hasBindings = function () {
        return state.size > 0
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


    // should run before each fixedUpdate frame
    const pollState = function () {

        for (const eventName in _bindings) {
            let pressed = false

            for (const b of _bindings[eventName]) {
                let _pressed = false

                if (b.event === 'key') {
                    _pressed = Keyboard.pressed[b.value]
                }
                else if (b.event === 'mousebutton') {
                    _pressed = Mouse.pressed[b.value]
                }
                else if (b.event === 'gamepad') {
                    const gp = navigator.getGamepads()[b.gamepadIndex]

                    // TODO: handle gamepad disconnect event. if a controller is removed and a different one is
                    //       added, the gamepad.index value may be re-used.

                    if (b.isAnalog) {
                        if (gp) {
                            // convert analog stick value to digital state
                            const DEAD_ZONE = b.analogAxisDeadZone ?? 0.5
                            _pressed = (gp.axes[b.analogAxisId] / b.analogAxisDirection) > DEAD_ZONE
                        }

                    } else {
                        // must be a gamepad button
                        pressed = gp?.buttons[b.buttonIndex].pressed
                    }   
                }

                pressed = pressed || _pressed
            }

            const action = state.get(eventName)

            if (pressed) {
                action.up = false
                action.down = !action.held
                action.held = true

            } else {
                if (action.down)
                    action.up = true

                action.held = false
                action.down = false
            }
        }
    }

    // examine all connected gamepads and return any that have a button press this frame
    // this is useful when a game/sim decides to assign controllers to different players based on order
    // e.g., 1st controller with input is player 1, 2nd controller with input is player 2, etc.
    const getGamepadsWithButtonInput = function () {
        return navigator.getGamepads().filter(function (gp) {
            if (!gp)
                return
            for (let i=0; i < gp.buttons.length; i++)
                if (gp.buttons[i].pressed)
                    return true
        })
    }


    setBindings(bindings)

    return {
        down,
        up,
        held,
        pollState,
        getGamepadsWithButtonInput,
        setBindings,
        hasBindings,
        humanActionName,
        Mouse,
    }
}
