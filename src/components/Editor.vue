<template lang="pug">
  editor(v-model="code" @init="editorInit()" lang="javascript" theme="tomorrow" width="100%" height="100%")
</template>

<script>
  import AceEditor from "vue2-ace-editor"

  import "brace/mode/javascript"
  import "brace/theme/tomorrow"

  export default {
    components: {
      editor: AceEditor
    },
    methods: {
      editorInit: () => {

      }
    }
  }
</script>

<style lang="sass">

</style>
