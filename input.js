import * as Keyboard from './Keyboard.js'
import * as Mouse    from './Mouse.js'


const defaultBindings = [
    // for mousebutton, value 1 === left, 2 === middle, 3 === right
    /*
    {
        name: 'aim',
        event: 'mousebutton',
        value: 3
    },
    {
        name: 'down',
        event: 'gamepad',
        gamepadIndex: 0,
        buttonIndex: 4
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
// const Input = inputSystem({ canvas: document.querySelector('canvas'), bindings: [ ... ] })

export default function inputManager ({ canvas, bindings }) {
    Mouse.setEventElement(canvas)

    bindings = bindings || defaultBindings

    // key is action name, value is up/down/held states this frame
    let state = {
        /*
        jump: {
            up: false,
            down: false,
            held: false
        }
        */
    }

    const down = function (action) {
        return state[action]?.down
    }

    const up = function (action) {
        return state[action]?.up
    }

    const held = function (action) {
        return state[action]?.held
    }

    const setBindings = function (b = []) {
        state = { }
        bindings = b

        for (const b of bindings)
            state[b.name] = { up: false, down: false, held: false }
    }

    const hasBindings = function () {
        return bindings.length > 0
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

         for (const b of bindings) {
            let pressed = false

            if (b.event === 'key') {
                pressed = Keyboard.pressed[b.value]
            }
            else if (b.event === 'mousebutton') {
                pressed = Mouse.pressed[b.value]
            }
            else if (b.event === 'gamepad') {
                const gp = navigator.getGamepads()[b.gamepadIndex]

                // TODO: handle gamepad disconnect event. if a controller is removed and a different one is
                //       added, the gamepad.index value may be re-used.

                pressed = gp?.buttons[b.buttonIndex].pressed
            }

            const action = b.name

            if (pressed) {
                state[action].up = false
                state[action].down = !state[action].held
                state[action].held = true

            } else {
                if (state[action].down)
                    state[action].up = true

                state[action].held = false
                state[action].down = false
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
