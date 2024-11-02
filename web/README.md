# game-input

Provides an efficient, pollable interface for checking the state of keyboard keys, mouse buttons, and gamepad buttons in a web browser.


## Web Example

```javascript
import webInput from '@footgun/input-web'


const LEFT_MOUSE_BUTTON = 1
const MIDDLE_MOUSE_BUTTON = 2
const RIGHT_MOUSE_BUTTON = 3

const Input = webInput({
    // whichever canvas element you want mouse events relative to
    canvas: document.querySelector('canvas'),

    bindings: [
        // define all of the mouse and keyboard events you wish to listen for here
        {
            name: 'walk_left',
            event: 'key',
            value: 'KeyS',
        },
        {
            name: 'walk_right',
            event: 'key',
            value: 'KeyF',
        },
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
