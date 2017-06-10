<template lang="pug">
  .root
    code-editor
    .game(ref="gameview")
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
    paddle = game.add.sprite(game.world.centerX, 500, "breakout", "paddle_big.png")
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
      paddle.x = 24
    } else if (paddle.x > game.width - 24) {
      paddle.x = game.width - 24
    }
  }

  window.preload = function() {
    game.load.image("sky", "static/img/icons/android-chrome-512x512.png")
    game.load.atlas("breakout", "static/games/breakout.png", "static/games/breakout.json")
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
    components: {
      "code-editor": CodeEditor
    },
    mounted() {
      // if (!game)
      //   this.start()
      window.start = this.start
    },
    methods: {
      start() {
        if (window.game)
          window.game.destroy()
        window.game = new Phaser.Game("85%", "100%", Phaser.AUTO, this.$refs.gameview, {
          preload,
          create,
          update
        }, true)
      }
    },
    destroyed() {
      if (window.game)
        window.game.destroy()
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
    // background: linear-gradient(to left, rgb(71, 118, 230), rgb(142, 84, 233))
    background: #2d2d30
    // animation: rotatehue 1s ease-in-out none infinite
    overflow: hidden
</style>
