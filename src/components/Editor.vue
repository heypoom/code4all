<template lang="pug">
  .pane
    .titlebar Code Editor
      .buttons
    editor(ref="editor" v-model="code" @init="init()" lang="javascript" theme="tomorrow" width="100%" height="100%")
    button.exec(@click="run") Run Code
    .console
</template>

<script>
  import AceEditor from "vue2-ace-editor"

  import "vue2-ace-editor/node_modules/brace/mode/javascript"
  import "vue2-ace-editor/node_modules/brace/theme/tomorrow"

  /* eslint no-unused-vars: 0 */

  const initialCode = `/*
  Welcome to Code4Fun!
  We're going to create our first game!
*/

// Could you add in some bricks?
// It feels kinda lonely here.

window.addBricks = function() {
  const rows = 4
  const columns = 16
}

window.create = function() {
  init()
}

window.update = function() {

}

// This will start the game.
start()
`

  const completedCode = `/*
  Welcome to Code4Fun!
*/

// Could you add in some bricks?
// It feels kinda lonely here.

window.addBricks = function() {
  const rows = 4
  const columns = 16

  for (let y = 0; y < rows; y += 1) {
    for (let x = 0; x < columns; x += 1) {
      const posX = 120 + (x * 36)
      const posY = 100 + (y * 52)
      const type = \`brick_\${y + 1}_1.png\`

      brick = bricks.create(posX, posY, "breakout", type)
      brick.body.bounce.set(1)
      brick.body.immovable = true
    }
  }
}

// What should happen if we launches the ball off the paddle?

window.releaseBall = function() {
  if (ballOnPaddle) {
    ballOnPaddle = false
    setVelocity(75, 300)
    ball.animations.play("spin")
    introText.visible = false
  }
}

// What should we do if the ball hit a brick?

window.ballHitBrick = function(ball, brick) {
  brick.kill()
  score += 10
  scoreText.text = \`Score: \${score}\`

  // Are they any bricks left?
  if (bricks.countLiving() === 0) {
    // New level starts
    score += 1000
    scoreText.text = \`Score: \${score}\`
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

// What should we do if the ball goes back and land on the paddle?

window.ballHitPaddle = function(ball, paddle) {
  let diff = 0

  if (ball.x < paddle.x) {
    //  Ball is on the left-hand side of the paddle
    diff = paddle.x - ball.x
    ball.body.velocity.x = (-10 * diff)
  } else if (ball.x > paddle.x) {
    //  Ball is on the right-hand side of the paddle
    diff = ball.x - paddle.x
    ball.body.velocity.x = (10 * diff)
  } else {
    //  Ball is perfectly in the middle
    //  Add a little random X to stop it bouncing straight up!
    ball.body.velocity.x = 2 + (Math.random() * 8)
  }
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

// This will start the game.
start()

`

  export default {
    data: () => ({
      code: initialCode
    }),
    components: {
      editor: AceEditor
    },
    methods: {
      init() {
        const editor = this.$refs.editor.editor

        editor.setOptions({fontSize: "1em"})
      },
      run() {
        try {
          /* eslint no-eval: 0 */
          eval(this.code)
        } catch (err) {
          console.error(err)
        }
      }
    }
  }
</script>

<style lang="sass">
  .readonly-highlight
    position: absolute
    background-color: red
    opacity: 0.2
</style>

<style lang="sass" scoped>
  .titlebar
    background: #ececec
    padding: 0.6rem 0
    font-family: "Roboto"
    line-height: 1rem
    font-size: 0.9rem
    position: relative
    color: #a5a5a5
    border-bottom: 1px solid #e0e0e0
    text-align: center

    .buttons
      position: absolute
      top: 0
      left: 0
      margin-top: 12px
      margin-left: 35px
      width: 11px
      height: 11px
      background: #f39c12
      border-radius: 50%
      box-shadow: -20px 0 0 #27ae60, 20px 0 0 #e74c3c

  .pane
    position: fixed
    right: 0
    top: 0
    width: 40%
    height: 100%
    z-index: 1
    box-shadow: 0 2px 5px 0 rgba(0,0,0,0.16), 0 2px 10px 0 rgba(0,0,0,0.12)

  .exec
    position: absolute
    z-index: 5
    right: 2em
    bottom: 2em
    cursor: pointer

    font-family: "Roboto"
    font-size: 1em
    outline: none
    border: none
    padding: 0.6em 1.2em
    color: white
    background: #e74c3c
    box-shadow: 0 2px 5px 0 rgba(0,0,0,0.16), 0 2px 10px 0 rgba(0,0,0,0.12)

    &:hover
      background: #c0392b
</style>
