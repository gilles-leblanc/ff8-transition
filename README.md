# ff8-transition

## Project description

This is a recreation of the visual effect for the normal battle screen transition in Final Fantasy 8. Also called the swoosh effect for the sound that is typically made on these screen transition effects. 

Here is a YouTube link of what I was striving for: https://www.youtube.com/watch?v=9RoHMNXE6YM&t=31s

The boss battle screen transition used a different effect. 

This doesn’t strive to be a pixel perfect reproduction but something in the same spirit. The effect is customizable using the UI on the page.

As in the case with the game, the initial direction of the effect is chosen at random between left to right or right to left.

## See it in action

https://gilles-leblanc.github.io/ff8-transition/

## Running the project

Because of CORS issues from opening the image file from disk, simply opening the html locally will result in security errors.

Because of this, run a simple web server to test this locally.

I personnally use the npm http server package:
`npm install -g http-server`

Then
`http-server`

And finally navigate to the the file /index.html.
