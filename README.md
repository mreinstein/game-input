# game-input

Provides an efficient, pollable interface for checking the state of keyboard keys, mouse buttons, and gamepad buttons.


## usage

```javascript
import inputSystem from './input.js'


const LEFT_MOUSE_BUTTON = 1
const MIDDLE_MOUSE_BUTTON = 2
const RIGHT_MOUSE_BUTTON = 3

const Input = inputSystem({

    // whichever canvas element you want mouse events relative to
    canvas: document.querySelector('canvas'),

    bindings: [
        // define all of the mouse and keyboard events you wish to listen for here
        
        // walk left when pressing the S keyboard key down.
        {
            name: 'walk_left',
            event: 'key',
            value: 'KeyS',
        },

        // walk right when pressing the F keyboard key down
        {
            name: 'walk_right',
            event: 'key',
            value: 'KeyF',
        },

        // charge an arrow when the middle mouse button is pressed down
        {
            name: 'charge_arrow',
            event: 'mouse',
            value: MIDDLE_MOUSE_BUTTON
        },

        /*
        {
            name: 'fire',
            event: 'gamepad',
            gamepadIndex: 0,
            buttonIndex: 4
        },
        */
    ]
})


// runs every frame
function gameLoop () {

    // should be called at the beginning of every frame
    Input.pollState()

    // query the input state here, perform game logic and rendering:
    console.log(Input.down('walk_left')) // true when the key is first pushed down
    console.log(Input.held('walk_left')) // true while the key is pushed and held down
    console.log(Input.up('walk_left'))   // true when the key is released

    console.log('mouse position:', Input.Mouse.position[0], Input.Mouse.position[1])
    
    requestAnimationFrame(gameLoop)
}


requestAnimationFrame(gameLoop) // start the game

```

All values for keyboard keys are from https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key/Key_Values


## fixed timestep loops

If you're running physics or just generallly running your game in fixed time steps, you'll want to ensure that you run `Input.endFrame()` _after_ each step:

```javascript

const FIXED_STEP_MS = 16 // run a fixed step every 16 millseconds

const globals = {
    lastFrameTime: performance.now(),
    accumulator: 0
}


function fixedUpdate () {
    // check player input, move units, etc. in here
    //const left = Input.held('walk_left')
}


function gameLoop () {
    const newTime = performance.now()
    const frameTime = newTime - globals.lastFrameTime
    globals.lastFrameTime = newTime

    globals.accumulator += frameTime

    while (globals.accumulator >= FIXED_STEP_MS) {
        globals.accumulator -= FIXED_STEP_MS
        Input.pollState()
        fixedUpdate()
    }

    requestAnimationFrame(gameLoop)
}

gameLoop()
```
