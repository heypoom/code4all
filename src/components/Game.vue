<template lang="pug">
  .root
    code-editor
    svg.viewTask(@click="task = !task" viewBox="0 0 32 32")
      path(d="M12.42 28.678l-12.433-12.238 6.168-6.071 6.265 6.167 13.426-13.214 6.168 6.071-19.594 19.285zM3.372 16.441l9.048 8.905 16.208-15.953-2.782-2.739-13.426 13.214-6.265-6.167-2.782 2.739z")
    .tasks(v-show="task")
      .task-overlay(@click="task = !task")
      .card
        h1 Our Task
    .game(ref="gameview")
      .blank(v-if="!game")
        .card
          h1 Let's Get Started!
          h2 Just hit that <b>Run Code</b> Button on the Right.
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
    const whiteFont = {font: "20px Arial", fill: "#ffffff", align: "left"}

    scoreText = game.add.text(32, 550, "score: 0", whiteFont)
    livesText = game.add.text(680, 550, `lives: ${lives}`, whiteFont)
    introText = game.add.text(game.world.centerX, 400, "- click to start -", {font: "40px Arial", fill: "#ffffff", align: "center"})
    introText.anchor.setTo(0.5, 0.5)
  }

  window.handleBallOnPaddleCollision = function() {
    if (ballOnPaddle) {
      ball.body.x = paddle.x
    } else {
      game.physics.arcade.collide(ball, paddle, ballHitPaddle, null, this)
      game.physics.arcade.collide(ball, bricks, ballHitBrick, null, this)
    }
  }

  window.movePaddle = function() {
    paddle.x = game.input.x

    if (paddle.x < 24) {
      paddle.x = 25
    } else if (paddle.x > game.width - 24) {
      paddle.x = game.width - 24
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
      task: false
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
    padding: 0.7em

    cursor: pointer
    background: white
    border-radius: 50%
    box-shadow: 0 38px 43px rgba(0, 0, 0, 0.09)

  .tasks
    position: fixed
    top: 0
    left: 0
    z-index: 1

    display: flex
    justify-content: center
    align-items: center

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
      font-size: 2.2em

  .task-overlay
    position: fixed
    top: 0
    left: 0
    z-index: 1

    width: 100%
    height: 100%
    background: rgba(0, 0, 0, 0.8)

  .card
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

    h1, h2
      margin: 0
      color: #2d2d30
      text-align: center
      font-family: "Roboto"
      font-weight: 300

    h1
      color: #2d2d30
      font-size: 2.3em

    h2
      color: #2d2d30
      margin-top: 0.5em

    b
      color: #e74c3c
      font-weight: 400
</style>
