<template lang="pug">
  .hello
    h1 {{msg}}
</template>

<script>
export default {
  name: "hello",
  data: () => ({
    msg: "Welcome to Your Vue.js PWA"
  })
}
</script>

<style lang="sass" scoped>
  h1, h2
    font-weight: normal

  ul
    list-style-type: none
    padding: 0

  li
    display: inline-block
    margin: 0 10px

  a
    color: #42b983
</style>
