/* global createCanvas, keyIsDown, random, clear, fill, strokeWeight, stroke, rect, frameRate, resizeCanvas  */
/* global SHIFT, UP_ARROW, DOWN_ARROW, LEFT_ARROW, RIGHT_ARROW, width, height */

let position = { x: (window.innerWidth / 2) - 25, y: (window.innerHeight / 2) - 25 }
let modifiers = { x: 10, y: -10, color: [3, 3, 3] }
let frictions = { x: -0.8, y: -0.8 }
let gravity = 0.5
let pristine = true
let color = [255, 0, 0]
let debug = false

function setup () {
  createCanvas(window.innerWidth, window.innerHeight - 20)
}

function draw () {
  if (keyIsDown(67)) clear() // c
  if (keyIsDown(68)) debug = true // d
  if (keyIsDown(SHIFT) && keyIsDown(68)) debug = false

  // accelerate on keyboard input
  if (keyIsDown(LEFT_ARROW)) modifiers.x -= 1
  if (keyIsDown(RIGHT_ARROW)) modifiers.x += 1
  if (keyIsDown(UP_ARROW)) modifiers.y -= 1
  if (keyIsDown(DOWN_ARROW)) modifiers.y += 1

  // remove pristine status if arrow key is pressed.
  // if (pristine) before the rest makes the statement
  // use less processor cycles when pristine is false
  if (pristine &&
    (keyIsDown(UP_ARROW) ||
    keyIsDown(DOWN_ARROW) ||
    keyIsDown(LEFT_ARROW) ||
    keyIsDown(RIGHT_ARROW))) {
    pristine = false
  }

  // add gravity down if the box is in the air
  // keep adding gravity when the box touches the floor
  // to make sure it bounce. but not if the velocity is so
  // small that it'd stay still
  if (modifiers.y >= gravity * -frictions.y ||
    modifiers.y <= gravity * frictions.y ||
    position.y < height - 50) {
    modifiers.y += gravity
  }

  // update position of box based on velocities
  position.x += modifiers.x
  position.y += modifiers.y

  // stop box from going out of bounds and bounce it against walls,
  // except if the arrow key towards the wall is pressed
  if (position.x <= 0) {
    position.x = 0
    if (keyIsDown(LEFT_ARROW)) modifiers.x = 0
    modifiers.x *= frictions.x
  }
  if (position.x >= width - 50) {
    position.x = width - 50
    if (keyIsDown(RIGHT_ARROW)) modifiers.x = 0
    modifiers.x *= frictions.x
  }
  // slowly stopp the ball if it slides on the floor
  if (position.y >= height - 50) modifiers.x *= -frictions.x
  // stop moving entirely if the velocity is really small
  if (modifiers.x < gravity * -frictions.x &&
    modifiers.x > gravity * frictions.x) modifiers.x = 0

  // uncomment to allow box to fly high
  /* if (position.y <= 0) {
    position.y = 0
    modifiers.y = 0
  } */
  // bounce box if it touches the floor
  if (position.y >= height - 50) {
    position.y = height - 50
    if (keyIsDown(DOWN_ARROW)) modifiers.y *= -frictions.y
    modifiers.y *= frictions.y
  }
  // stop bounce if small
  if (modifiers.y < gravity * -frictions.y &&
    modifiers.y > gravity * frictions.y) modifiers.y = 0

  // change colour of the box
  let rand = random([0, 1, 2])
  color[rand] += modifiers.color[rand]
  if (color[rand] > 255) color[rand] = 255
  if (color[rand] < 0) color[rand] = 0
  if (color[rand] >= 255 || color[rand] <= 0) modifiers.color[rand] *= -1

  // draw the box
  // rect(position.x - 1, position.y - 1, 52, 52) // white
  fill(color[0], color[1], color[2])
  strokeWeight(1)
  stroke(255, 255, 255)
  rect(position.x, position.y, 50, 50) // `rgb(${color.join(', ')})`

  // status
  if (debug) {
    document.getElementById('status').innerHTML =
      `x: ${position.x}, y: ${position.y}<br/>
       vx: ${modifiers.x}, vy: ${modifiers.y}<br/>
       color: [${color.join(', ')}]<br/>
       color modifiers: [${modifiers.color.join(', ')}]<br/>
       fps: ${frameRate()}<br/>`
  }
  document.getElementById('status').innerHTML =
    `${debug ? document.getElementById('status').innerHTML : ''}
       ${pristine ? 'Use the arrow keys to control the square' : ''}<br/>
       ${pristine ? 'press c to clear the screen' : ''}<br/>
       ${pristine ? 'press d to display debug' : ''}<br/>
       ${pristine ? 'press shift+d to hide debug' : ''}`
}

function windowResized () {
  resizeCanvas(window.innerWidth, window.innerHeight - 20)
}