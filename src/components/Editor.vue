<template lang="pug">
  .pane
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
          next()
        }

        editor.keyBinding.addKeyboardHandler({
          handleKeyboard: (data, hash, keyString, keyCode, event) => {
            if (hash === -1 || (keyCode <= 40 && keyCode >= 37))
              return false
            if (intersects(range))
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
