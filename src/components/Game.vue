<template lang="pug">
  .root
    code-editor
    svg.viewTask(@click="task = !task" viewBox="0 0 32 32")
      path(d="M12.42 28.678l-12.433-12.238 6.168-6.071 6.265 6.167 13.426-13.214 6.168 6.071-19.594 19.285zM3.372 16.441l9.048 8.905 16.208-15.953-2.782-2.739-13.426 13.214-6.265-6.167-2.782 2.739z")
    .tasks(v-show="task")
      .task-overlay(@click="task = !task")
      .card
        .task(:class="{'active': taskId === i}" v-for="(t, i) in tasks" @click="taskId = i")
          .task-title
            svg(viewBox="0 0 32 32")
              path(d="M30.5 24h-0.5v-6.5c0-1.93-1.57-3.5-3.5-3.5h-8.5v-4h0.5c0.825 0 1.5-0.675 1.5-1.5v-5c0-0.825-0.675-1.5-1.5-1.5h-5c-0.825 0-1.5 0.675-1.5 1.5v5c0 0.825 0.675 1.5 1.5 1.5h0.5v4h-8.5c-1.93 0-3.5 1.57-3.5 3.5v6.5h-0.5c-0.825 0-1.5 0.675-1.5 1.5v5c0 0.825 0.675 1.5 1.5 1.5h5c0.825 0 1.5-0.675 1.5-1.5v-5c0-0.825-0.675-1.5-1.5-1.5h-0.5v-6h8v6h-0.5c-0.825 0-1.5 0.675-1.5 1.5v5c0 0.825 0.675 1.5 1.5 1.5h5c0.825 0 1.5-0.675 1.5-1.5v-5c0-0.825-0.675-1.5-1.5-1.5h-0.5v-6h8v6h-0.5c-0.825 0-1.5 0.675-1.5 1.5v5c0 0.825 0.675 1.5 1.5 1.5h5c0.825 0 1.5-0.675 1.5-1.5v-5c0-0.825-0.675-1.5-1.5-1.5zM6 30h-4v-4h4v4zM18 30h-4v-4h4v4zM14 8v-4h4v4h-4zM30 30h-4v-4h4v4z")
            b Task {{i + 1}} - {{t.title}}
          p(v-html="t.text" v-if="i === taskId")
    .game(ref="gameview")
      .blank(v-if="!game")
        .card
          h1 Let's Get Started!
          p
            | You just have to <b>write the code</b>! <br>
            | Feel free to experiment as your project goes.
          p
            | Begin by completing tasks, which can be accessed <br>
            | using the <b>Task</b> button on the lower left.
          p
            | If you want to try out your masterpiece, <br>
            | just hit that <b>Run Code</b> button on the right.
</template>

<script>
  import "pixi.js"
  import "p2"
  import Phaser from "phaser"

  import CodeEditor from "../components/Editor.vue"

  /* eslint-disable */

  window.game = null
  window.ball = null
  window.paddle = null
  window.brick = null
  window.bricks = null

  window.ballOnPaddle = true

  window.lives = 19
  window.score = 0

  window.scoreText = null
  window.livesText = null
  window.introText = null

  // Predefined: Phaser Game Initialization
  window.init = function() {
    game.physics.startSystem(Phaser.Physics.ARCADE)
    game.physics.arcade.checkCollision.down = false

    bricks = game.add.group()
    bricks.enableBody = true
    bricks.physicsBodyType = Phaser.Physics.ARCADE
  }

  // Predefined setVelocity(x, y)
  window.setVelocity = function(x, y) {
    ball.body.velocity.y = -y
    ball.body.velocity.x = -x
  }

  // Predefined: Move Ball
  window.moveBall = function(x, y) {
    ball.x = x
    ball.y = y
  }

  // Predefined: Randomize
  window.random = (min, max) => Math.floor(Math.random() * (max - min) + min)

  // Predefined: Set Background
  window.setBackground = param => document.querySelector(".game").style.background = param

  // Self Implement: If the ball is lost
  window.ballLost = function() {
    // Decrease Lives
    lives -= 1
    livesText.text = `Lives: ${lives}`

    // If no more lives, game over. Else, reset the game.
    if (lives === 0) {
      gameOver()
    } else {
      ballOnPaddle = true
      ball.reset(paddle.body.x + 16, paddle.y - 16)
      ball.animations.stop()
    }
  }

  // Self Implement: Game Over Screen
  window.gameOver = function() {
    ball.body.velocity.setTo(0, 0)
    introText.text = "Game Over!"
    introText.visible = true
  }

  window.addPaddle = function() {
    paddle = game.add.sprite(game.world.centerX, 500, "paddle")
    paddle.anchor.setTo(0.5, 0.5)

    game.physics.enable(paddle, Phaser.Physics.ARCADE)

    paddle.body.collideWorldBounds = true
    paddle.body.bounce.set(1)
    paddle.body.immovable = true
  }

  window.addBall = function() {
    ball = game.add.sprite(game.world.centerX, paddle.y - 16, "breakout", "ball_1.png")
    ball.anchor.set(0.5)
    ball.checkWorldBounds = true

    game.physics.enable(ball, Phaser.Physics.ARCADE)

    ball.body.collideWorldBounds = true
    ball.body.bounce.set(1)

    ball.animations.add("spin", [
      "ball_1.png", "ball_2.png", "ball_3.png", "ball_4.png", "ball_5.png"
    ], 50, true, false)

    ball.events.onOutOfBounds.add(ballLost, this)
  }

  window.addIntroText = function() {
    const whiteFont = {font: "20px Roboto", fill: "#ffffff", align: "left"}

    scoreText = game.add.text(32, 550, "score: 0", whiteFont)
    livesText = game.add.text(680, 550, `lives: ${lives}`, whiteFont)
    introText = game.add.text(game.world.centerX, 400, "- click to start -", {font: "40px Arial", fill: "#ffffff", align: "center"})
    introText.anchor.setTo(0.5, 0.5)
  }

  window.addText = function(x, y, text, size = "2.8em", fill = "#ffffff", align = "left", font = "Roboto") {
    return game.add.text(x, y, text, {font: `${size} ${font}`, fill, align})
  }

  window.handleBallOnPaddleCollision = function() {
    if (ballOnPaddle) {
      ball.body.x = paddle.x
    } else {
      game.physics.arcade.collide(ball, paddle, ballHitPaddle, null, this)
      game.physics.arcade.collide(ball, bricks, ballHitBrick, null, this)
    }
  }

  window.preload = function() {
    game.load.atlas("breakout", "static/games/breakout.png", "static/games/breakout.json")
    game.load.image("paddle", "static/games/paddle.png")
  }

  export default {
    name: "phaser",
    data: () => ({
      game: false,
      task: false,
      taskId: 0,
      tasks: [
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
    }),
    components: {
      "code-editor": CodeEditor
    },
    mounted() {
      window.start = this.start
    },
    methods: {
      start() {
        if (window.game)
          this.reset()

        window.game = new Phaser.Game("85%", "100%", Phaser.AUTO, this.$refs.gameview, {
          preload,
          create,
          update
        }, true)

        this.game = true
      },
      reset() {
        window.game.destroy()
        window.game = null

        window.ball = null
        window.paddle = null
        window.brick = null
        window.bricks = null

        window.ballOnPaddle = true

        window.lives = 19
        window.score = 0

        window.scoreText = null
        window.livesText = null
        window.introText = null
      }
    },
    destroyed() {
      if (window.game)
        window.game.destroy()
        this.game = false
    },
    watch() {
      this.$nextTick(() => {
        window.game.update()
      })
    }
  }
</script>

<style lang="sass" scoped>
  @keyframes rotatehue
    from
      filter: hue-rotate(0deg)
    to
      filter: hue-rotate(360deg)

  .game
    position: fixed
    left: 0
    top: 0
    width: 60%
    height: 100%
    background: url(http://kazzkiq.github.io/CodeFlask.js/img/bg-main_2x.png) #48466d
    background-size: 188px auto
    overflow: hidden

  .viewTask
    position: fixed
    left: 1.5em
    bottom: 1.5em
    z-index: 1

    width: 1.9em
    height: 1.9em
    padding: 0.6em

    cursor: pointer
    background: white
    fill: #333
    border-top: 3px solid #2ecc71
    border-left: 3px solid #e74c3c
    border-bottom: 3px solid #2ecc71
    border-right: 3px solid #e74c3c
    border-radius: 50%
    box-shadow: 0 38px 43px rgba(0, 0, 0, 0.09)

    &:hover
      border-top: 3px solid #e74c3c
      border-left: 3px solid #2ecc71
      border-bottom: 3px solid #e74c3c
      border-right: 3px solid #2ecc71

  .tasks
    position: absolute
    top: 0
    left: 0
    z-index: 1

    display: flex
    justify-content: center
    align-items: center

    padding: 17em 0
    width: 100%
    height: 100%
    background: rgba(0, 0, 0, 0.8)

    .card
      width: 40em
      min-height: 15em

    h1
      margin: 0
      color: #2d2d30
      text-align: center
      font-weight: 300
      font-size: 2em

  .task-overlay
    position: fixed
    top: 0
    left: 0
    z-index: 1

    width: 100%
    height: 100%
    background: rgba(0, 0, 0, 0.8)

  .task
    display: flex
    // align-items: center
    flex-direction: column

    cursor: pointer
    font-family: "Roboto"
    font-weight: 300
    line-height: 1.5em
    margin-top: 0.8em
    padding: 0.8em 1em
    border-bottom: 2px solid #999
    color: #333
    border-radius: 4px
    box-shadow: 0 1px 1.5px 1px rgba(0,0,0,.12)

    &.active
      border-bottom: 2px solid #2ecc71

    b
      font-weight: 400

    p
      margin: 0
      margin-top: 0.3em
      margin-left: 2.5em
      font-size: 0.95em
      color: #444

    p > b
      font-weight: 400

    svg
      margin-right: 1em
      width: 1.3em
      height: 1.3em
      fill: #555

  .task-title
    display: flex
    align-items: center

  .card
    position: relative
    z-index: 1
    background: white
    border-radius: 8px
    padding: 1.5em 2.3em
    font-family: "Roboto"
    border-bottom: 3px solid #e74c3c
    box-shadow: 0 38px 43px rgba(0,0,0,.09)

  .blank
    display: flex
    justify-content: center
    align-items: center
    height: 100%

    h1, h2, h3, p
      margin: 0
      color: #2d2d30
      line-height: 1.5em
      text-align: center
      font-family: "Roboto"
      font-weight: 300

    h1
      font-size: 2em

    h2, h3
      margin-top: 0.5em

    p
      font-size: 1.2em
      margin-top: 0.8em

    b
      color: #e74c3c
      font-weight: 400
</style>
