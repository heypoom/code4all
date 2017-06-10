<template lang="pug">
  .pane
    .titlebar Code Editor
      .buttons
    editor(ref="editor" v-model="code" @init="init()" lang="javascript" theme="tomorrow" width="100%" height="100%")
    button.exec(@click="run") Run Code
</template>

<script>
  import AceEditor from "vue2-ace-editor"

  import "brace/mode/javascript"
  import "brace/theme/tomorrow"

  const initialCode = `/*
  Welcome to Code4Fun!
*/

// "const" is how you define a variable.
const velocity = 0.0

// This will start the game.
start()
`

  /* eslint-disable */

  const Range = ace.acequire("ace/range").Range

  function before(obj, method, wrapper) {
    var orig = obj[method]
    obj[method] = function() {
        var args = Array.prototype.slice.call(arguments)
        return wrapper.call(this, function(){
          return orig.apply(obj, args)
        }, args)
    }

    return obj[method]
  }

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
        const session = editor.getSession()
        const range = new Range(1, 4, 1, 10)
        const markerId = session.addMarker(range, "readonly-highlight")

        function intersects(range) {
          return editor.getSelectionRange().intersects(range);
        }

        function preventReadonly(next, args) {
          if (intersects(range))
            console.log("READ ONLY!")
            return
          console.log("NOT REALLY!")
          next()
        }

        editor.keyBinding.addKeyboardHandler({
          handleKeyboard: (data, hash, keyString, keyCode, event) => {
            if (hash === -1 || (keyCode <= 40 && keyCode >= 37))
              console.log("Event False Lolz")
              return false
            if (intersects(range))
              console.log("Intersect = Disable")
              return {command: "null", passEvent: false}
          }
        })

        before(editor, "onPaste", preventReadonly)
        before(editor, "onCut", preventReadonly)

        range.start = session.doc.createAnchor(range.start)
        range.end = session.doc.createAnchor(range.end)
        range.end.$insertRight = true

        editor.setOptions({fontSize: "1.1em"})
      },
      run() {
        try {
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
