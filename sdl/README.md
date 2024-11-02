# game-input

Provides an efficient, pollable interface for checking the state of keyboard keys, mouse buttons, and gamepad buttons.

Has backends for Web browser and SDL: check the sub-directories for details on these.


## SDL Example


```javascript
import sdl      from '@kmamal/sdl'
import sdlInput from '@footgun/input-sdl'


const width = 480
const height = 270
const sdlWindow = sdl.video.createWindow({ webgpu: true, width, height })

const bindings = [
    {
        name: 'down',
        event: 'key',
        value: sdl.keyboard.SCANCODE.D,
    },
    {
        name: 'left',
        event: 'key',
        value: sdl.keyboard.SCANCODE.S,
    },
    {
        name: 'right',
        event: 'key',
        value: sdl.keyboard.SCANCODE.F,
    },
    {
        name: 'up',
        event: 'key',
        value: sdl.keyboard.SCANCODE.E,
    },
    {
        name: 'jump',
        event: 'key',
        value: sdl.keyboard.SCANCODE.SPACE,
    },
    {
        name: 'interact',
        event: 'mousebutton',
        value: sdl.mouse.BUTTON.LEFT,
    }
]
const Input = SdlInput(bindings)

// runs every frame
function gameLoop () {

    // should be called at the beginning of every frame
    Input.pollState()

    // query the input state here, perform game logic and rendering:
    console.log(Input.down('interact')) // true when the key is first pushed down
    console.log(Input.held('interact')) // true while the key is pushed and held down
    console.log(Input.up('interact'))   // true when the key is released

    const mousePos = [
        sdl.mouse.position.x - sdlWindow.x,
        sdl.mouse.position.y - sdlWindow.y
    ]

    console.log('mouse position:', mousePos)
    
    requestAnimationFrame(gameLoop)
}


requestAnimationFrame(gameLoop) // start the game
```
