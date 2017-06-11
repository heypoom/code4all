<template lang="pug">
  .pane
    .titlebar Code Editor
      .buttons
    editor(ref="editor" v-model="code" @init="init()" lang="javascript" theme="tomorrow" width="100%" height="100%")
    button.exec(@click="run")
      svg(viewBox="0 0 32 32")
        path(d="M8 6l-4-4h-2v2l4 4zM10 0h2v4h-2zM18 10h4v2h-4zM20 4v-2h-2l-4 4 2 2zM0 10h4v2h-4zM10 18h2v4h-2zM2 18v2h2l4-4-2-2zM31.563 27.563l-19.879-19.879c-0.583-0.583-1.538-0.583-2.121 0l-1.879 1.879c-0.583 0.583-0.583 1.538 0 2.121l19.879 19.879c0.583 0.583 1.538 0.583 2.121 0l1.879-1.879c0.583-0.583 0.583-1.538 0-2.121zM15 17l-6-6 2-2 6 6-2 2z")
      span Run Code
    //- img.mascot(src="/static/satania.png")
    .console-wrapper
      svg.clear(viewBox="0 0 32 32" @click="logs = [{text: '> Log Cleared.'}]")
        path(d="M0 28h18v4h-18zM28 4h-9.455l-5.743 22h-4.134l5.743-22h-8.411v-4h22zM29.055 32l-4.055-4.055-4.055 4.055-1.945-1.945 4.055-4.055-4.055-4.055 1.945-1.945 4.055 4.055 4.055-4.055 1.945 1.945-4.055 4.055 4.055 4.055z")
      .console
        .log(:class="{'err': log.type === 'err'}" v-for="log in logs") {{log.text}}
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

function addBricks() {

}

function create() {
  init()
}

function update() {

}

// This will start the game.
start()
`

  const completedCode = `/*
  Welcome to Code4Fun!
*/

// Could you add in some bricks?
// It feels kinda lonely here.

function addBricks() {
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

function releaseBall() {
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

window.movePaddle = function() {
  paddle.x = game.input.x

  if (paddle.x < 24) {
    paddle.x = 25
  } else if (paddle.x > game.width - 24) {
    paddle.x = game.width - 24
  }
}

function create() {
  init()

  addBricks()
  addPaddle()
  addBall()

  addIntroText()

  // Trigger releaseBall on Input
  game.input.onDown.add(releaseBall, this)
}

function update() {
  movePaddle()
  handleBallOnPaddleCollision()
}

// This will start the game.
start()

`

  /* eslint no-eval: 0 */

  export default {
    data: () => ({
      code: initialCode,
      logs: [{
        text: "$ Hey! Here is where your friendly logs and errors live~!"
      }]
    }),
    mounted() {
      window.log = this.log
    },
    components: {
      editor: AceEditor
    },
    methods: {
      init() {
        const editor = this.$refs.editor.editor

        editor.setOptions({fontSize: "1em"})
      },
      appendLog(text, type) {
        console.info("APPEND_LOG", {text, type})
        this.logs = [...this.logs, {text, type}]
      },
      log(...args) {
        this.appendLog(args.join(" "))
      },
      run() {
        try {
          let code = this.code
          code = code.replace("console.log", "window.log")
          code = code.replace(/function (.*)\(\) {/g, "window.$1 = function() {")
          eval(code)
        } catch (err) {
          this.appendLog(`> ${err.toString()}`, "err")
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

  .ace_editor
    height: 66% !important
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

  .console-wrapper
    position: absolute
    bottom: 0
    width: 100%
    height: 28.6%
    overflow-y: scroll
    background: #2d2d30
    z-index: 4
    font-family: "Roboto"
    color: white

  .clear
    position: absolute
    top: 1em
    right: 1em
    width: 1.3em
    height: 1.3em
    fill: #e74c3c
    cursor: pointer

  .console
    padding: 1em

    .log
      line-height: 1.6em

    .log.err
      color: #e74c3c

  .mascot
    position: absolute
    left: -8em
    bottom: 0
    width: 11em
    height: auto
    opacity: 0.93
    z-index: 5

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

    display: flex
    align-items: center
    justify-content: center

    cursor: pointer
    border-radius: 8px
    font-family: "Roboto"
    font-size: 1em
    outline: none
    border: none
    padding: 0.6em 1.2em
    color: white
    background: #e74c3c
    box-shadow: 0 4px #c0392b

    svg
      fill: white
      width: 1.4em
      height: 1.4em
      margin-right: 0.5em

    &:hover
      bottom: 2.03em
      box-shadow: 0 2px #c0392b

    &:active
      background: #c0392b
</style>
