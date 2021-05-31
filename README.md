# game-input

Provides an efficient, pollable interface for checking the state of keyboard keys and mouse buttons.


## usage

```javascript
import inputSystem from './input.js'


const LEFT_MOUSE_BUTTON = 1
const MIDDLE_MOUSE_BUTTON = 2
const RIGHT_MOUSE_BUTTON = 3

const Input = inputSystem({
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
	    }
	]
})


// runs every frame
function gameLoop () {

	// query the input state here, perform game logic and rendering:
	console.log(Input.down('left')) // true when the key is first pushed down
	console.log(Input.held('left')) // true while the key is pushed and held down
	console.log(Input.up('left'))   // true when the key is released


	// should be called at the end of every frame
	Input.endFrame()

	requestAnimationFrame(gameLoop)
}


requestAnimationFrame(gameLoop) // start the game

```

All values for keyboard keys are from https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key/Key_Values


## alternative mouse event source

By default, mouse events will be listened for on `window.document`. If you'd like to use a specific DOM element to listen for mouse events instead, you can pass the element when initializing the input library:

```javascript
const Input = inputSystem({
	// element you wish to listen for mouse events on (defaults to window.document)
	mouseEventElement: someDOMElement,

	bindings: [ ... ]
})
```