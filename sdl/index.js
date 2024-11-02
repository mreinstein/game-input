import sdl from '@kmamal/sdl'


// usage:
// const Input = sdlInput({ bindings... })

export default function sdlInput (bindings) {

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

    // key is action name, value is boolean
    const _down = { }
    const _held = { }
    const _up = { }

    const Mouse = {
        pressed: { },
        setEventElement: function () { }
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
        const keyStates = sdl.keyboard.getState()

        for (const b of bindings) {
            let pressed = false

            if (b.event === 'key') {
                //pressed = Keyboard.pressed[b.value]
                pressed = keyStates[b.value]
            }
            else if (b.event === 'mousebutton') {
                pressed = sdl.mouse.getButton(b.value)
                //pressed = Mouse.pressed[b.value]
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

    setBindings(bindings)

    return {
        down,
        up,
        held,
        pollState,
        //getGamepadsWithButtonInput, // TODO: explore how to expose this like the Web backend does
        setBindings,
        hasBindings,
        humanActionName,
        //Mouse,                      // TODO: explore how to expose this like the Web backend does
    }
}
