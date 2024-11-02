# game-input

Provides an efficient, pollable interface for checking the state of keyboard keys, mouse buttons, and gamepad buttons.

Has backends for Web browser and SDL: check the sub-directories for details on these.


## Design philosophy

The 2 backends are published as independent npm modules, `@footgun/input-web` and `@footgun/input-sdl` because they are referencing very different underlying APIs to query for input.

Basic effort has been put into making these 2 packages provide a similar public API for keyboard events, though there are some differences in other areas, namely mouse position and gamepad polling.
