export const en = [
  {
    title: "Add some text to screen, set the background, and log to the console.",
    text: `First of all, we're going to <b>add some text</b> to the screen.
      You instruct the computer to do stuff by using <b>functions</b>.
      We can put our instructions in the <b>create</b> function,
      and it will be run when the game is created. Let's try it out!
      <br><br>
      You can use the addText function like this: <code>addText(50, 50, "Hello World", "60px", "white")</code>
      This will add a huge white text at the upper-left corner (x is 50 and y is 50).
      <br><br>
      You can <b>set the background</b> with <code>setBackground(color)</code>,
      with color names such as "teal", or color codes like "#2ecc71" as the parameter.
      <br><br>
      What if you wanted to know what is going on in your program?
      You could always use the <b>friendly log viewer</b> on the bottom right.
      You can view the errors, and also <b>print out the value</b> of a
      variable with the log function, like this: <code>log("Hi!")</code>
    `
  },
  {
    title: "Add a Brick",
    text: `You're doing a pretty good job! Next, we're going to be creating a brick.
    <br><br>
    First, we've created a blank function for you, and it's called <b>addBricks</b>.
    You'll want to put the code responsible for adding a brick in this function,
    so it'll be easier to reuse.
    <br><br>
    We're going to create a brick variable, and assign it to the result of the
    <b>bricks.create</b> function, which takes the x and y coordinates, the
    image set, and then the image.
    <br><br>
    Note that the image is 36 in height and 52 in width, so we have to add that
    to our coordinates, in addition to the 10px spacing to give it more room to breathe.
    You could use something like <code>spacing + (x * 36)</code> or <code>spacing + (y * 52)</code>
    <br><br>
    Also, we have 5 variations of brick image files, from "brick_1_1.png" to "brick_5_1.png".
    Feel free to play with all the different images!

    <code>
      <pre>
// You create a variable by using the "const" keyword, then set it to something.
// Create a brick in the specified coordinates, then use the brick image.

// Replace the variables to your likings.
// width and height is a number, and the image is the file name.
// const brick = bricks.create(width, height, "breakout", image)

// This makes the brick bouncy and not movable.
brick.body.bounce.set(1)
brick.body.immovable = true</pre></code>

    After that, <b>don't forget</b> to use the <b>addBricks()</b> function you've just made!
    You can simply put <code>addBricks()</code> in the end of the <code>create</code> function.

    `
  },
  {
    title: "Add Walls of Bricks",
    text: `Here comes the interesting part. We're going to place a wall with many bricks!
    <br>
    However, it's super tedious to copy and paste all the rows and columns and change
    the placements, so we're gonna make the computer go through that for us.
    <br><br>
    You can continue working in the addBricks() function.
    Since the wall is composed of rows and columns of bricks, we can use a loop
    to go through those and place the bricks for us. Here's how a loop works:

    <code>
      <pre>
for (let i = 0; i <= 100; i++) {
console.log("Hey! I am Number", i)
}</pre></code>

    This will log the number from 0 to 100. All you need to do is to create a
    variable for the starting number (<code>let i = 0;</code>),
    see when it should end (<code>i <= 100;</code>),
    and add the variable by one everytime.
    <br><br>
    However, the wall can be too close to others. We can add a little more padding
    by positioning them a bit further away. Here's how you might do it:

    <code>
      <pre>
x = padding + (row * imageSize)
y = padding + (col * imageSize)</pre></code>

    Hint Hint: You can place two loops together! If you're not sure, you can use
    the logger to log the positions. Just use the <code>console.log()</code> function.
    `
  },
  {title: "Randomize the Brick's Colors"},
  {title: "Add a Paddle and Make it Move!"},
  {title: "Add Stationary Ball"},
  {title: "Release the Ball (& Input Bind)"},
  {title: "Ball Hit Paddle and Bounce (Collision)"},
  {title: "Ball Hit Brick (& Destroy Bricks)"}
]

export const th = [
  {
    title: "Add some text to screen, set the background, and log to the console.",
    text: `เรามาเริ่ม Coding กันครับ ก่อนจะเริ่มสร้างเกม เรามาทบทวนกันก่อน

ขอให้น้อง ๆ เขียน addText function โดยที่มี พารามีเตอร์ ตัวแรกบอกส่วนสูง  ตัวสองบอกความกว้าง ตัวสามบอกข้อความที่จะให้พิมพ์ ตัวที่สี่บอกขนาด และตัวที่ห้าบอกสี เช่น addText(50, 50, "Hello World", "60px", "white")

และขอให้น้องเปลี่ยนสีของหน้าจอเป็นสี เขียวอมน้ำเงิน “teal” โดยใช้ setBackground(_).
    `
  },
  {
    title: "Add Walls of Bricks",
    text: `เก่งมากน้อง ขอให้ทำต่อไป

มาเริ่มสร้างกันเลย ทีมงานเรามีสร้าง Function ให้น้อง ๆ ใช้ คือ addBricks(_)

เราต้องการให้น้องสร้างตัวแปลชื่อว่า brick ก่อน โดยใช้ bricks.create(width, height, "breakout", image)

ทีมงานแนะนำให้ส่วนสูง 36 px และความยาว 52 px และเติมความยาวของ brick 10 px และใช่ รูปภาพห้าแบบ “brick_1_1.png” โดยเปลี่ยนตัวเลข “1_1” to “5_1”.

หลังจากนั้นให้คิดหาวิธีเติม Brick โดยใช้ loop
นี้คือตัวอย่างของการใช้

<code>
  <pre>
for (let i = 0; i <= 100; i++) {
console.log("Hey! I am Number", i)
}</pre></code>

คำสั่งข้างบนนี้จะพิมพ์ 0 ถึง 100.

ถ้าเราจะเติม Brick หลายแถว ให้น้องคิดถึงระยะของ Bricks ด้วยเช่น

<code>
  <pre>
x = padding + (row * imageSize)
y = padding + (col * imageSize)</pre></code>

Hint: น้องสามารถใส่ for loop ในอีก for loop ได้!`
  },
  {title: "Randomize the Brick's Colors"},
  {title: "Add a Paddle and Make it Move!"},
  {title: "Add Stationary Ball"},
  {title: "Release the Ball (& Input Bind)"},
  {title: "Ball Hit Paddle and Bounce (Collision)"},
  {title: "Ball Hit Brick (& Destroy Bricks)"}
]
