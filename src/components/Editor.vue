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

  /* eslint no-eval: 0 */

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
        // const session = editor.getSession()

        editor.setOptions({
          fontSize: "1.2em"
        })
      },
      run() {
        eval(this.code)
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
