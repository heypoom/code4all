<template lang="pug">
  .root
    code-editor
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

  // Self Implement: Release Ball on Input
  window.releaseBall = function() {
    if (ballOnPaddle) {
      ballOnPaddle = false
      setVelocity(-75, -300)
      ball.animations.play("spin")
      introText.visible = false
    }
  }

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

  // Self Implement: Collision Detection
  window.ballHitBrick = function(_ball, _brick) {
    _brick.kill()
    score += 10
    scoreText.text = `Score: ${score}`

    // Are they any bricks left?
    if (bricks.countLiving() === 0) {
      // New level starts
      score += 1000
      scoreText.text = `Score: ${score}`
      introText.text = "- Next Level -"

      // Let"s move the ball back to the paddle
      ballOnPaddle = true
      ball.body.velocity.set(0)
      moveBall(paddle.x + 16, paddle.y - 16)
      ball.animations.stop()

      //  And bring the bricks back from the dead :)
      bricks.callAll("revive")
    }
  }

  // Self Implement: Ball to Paddle Collision Detection
  window.ballHitPaddle = function(_ball, _paddle) {
    let diff = 0

    if (_ball.x < _paddle.x) {
      //  Ball is on the left-hand side of the paddle
      diff = _paddle.x - _ball.x
      _ball.body.velocity.x = (-10 * diff)
    } else if (_ball.x > _paddle.x) {
      //  Ball is on the right-hand side of the paddle
      diff = _ball.x - _paddle.x
      _ball.body.velocity.x = (10 * diff)
    } else {
      //  Ball is perfectly in the middle
      //  Add a little random X to stop it bouncing straight up!
      _ball.body.velocity.x = 2 + (Math.random() * 8)
    }
  }

  window.addBricks = function() {
    for (let y = 0; y < 4; y += 1) {
      for (let x = 0; x < 15; x += 1) {
        brick = bricks.create(120 + (x * 36), 100 + (y * 52), "breakout", `brick_${y+1}_1.png`)
        brick.body.bounce.set(1)
        brick.body.immovable = true
      }
    }
  }

  window.addPaddle = function() {
    paddle = game.add.sprite(game.world.centerX, 520, "paddle")
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
    livesText = game.add.text(680, 550, "lives: 3", whiteFont)
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

  window.create = function() {
    init()

    addBricks()
    addPaddle()
    addBall()

    addIntroText()

    // Trigger releaseBall on Input
    game.input.onDown.add(releaseBall, this)
  }

  window.update = function() {
    movePaddle()
    handleBallOnPaddleCollision()
  }

  export default {
    name: "phaser",
    data: () => ({game: false}),
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
    // background: linear-gradient(27deg, #151515 5px, transparent 5px) 0 5px, linear-gradient(207deg, #151515 5px, transparent 5px) 10px 0px, linear-gradient(27deg, #222 5px, transparent 5px) 0px 10px, linear-gradient(207deg, #222 5px, transparent 5px) 10px 5px, linear-gradient(90deg, #1b1b1b 10px, transparent 10px), linear-gradient(#1d1d1d 25%, #1a1a1a 25%, #1a1a1a 50%, transparent 50%, transparent 75%, #242424 75%, #242424)
    // background-color: #131313
    // background-size: 20px 20px
    background: url(http://kazzkiq.github.io/CodeFlask.js/img/bg-main_2x.png) #48466d
    background-size: 188px auto
    // animation: rotatehue 1s ease-in-out none infinite
    overflow: hidden

  .blank
    display: flex
    justify-content: center
    align-items: center
    height: 100%

    .card
      background: white
      border-radius: 8px
      padding: 1.5em 2.3em
      border-bottom: 3px solid #e74c3c
      box-shadow: 0 38px 43px rgba(0,0,0,.09)

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
