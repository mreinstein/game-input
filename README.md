# game-input
a barebones input singleton for web games


## usage

```javascript
const Input = inputSystem({
	// the element you wish to listen for mouse events on (defaults to window.document)
	mouseEventElement: window.document,

	// the event bindings you wish to listen for
	bindings: [
		// define all of the mouse and keyboard events you wish to listen for here
		{
	        name: 'left',
	        event: 'key',
	        value: 'KeyS',
	    },
	    {
	        name: 'right',
	        event: 'key',
	        value: 'KeyF',
	    }
	]
})


// now you can query for the state of various keys:
console.log(Input.down('left')) // true when the key is first pushed down
console.log(Input.held('left')) // true while the key is held down
console.log(Input.up('left'))   // true when the key is released

```
