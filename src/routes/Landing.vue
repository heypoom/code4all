<template lang="pug">
  .root
    header.main
      .header-overlay
      h1 Code4Fun
      //- .buttons
      //-   .button Play
      //-   .button Play
    main
      .row.center-xs(v-for="j in [1, 2, 3]")
        .col-xs-12.col-sm-6.col-md-3.cardholder(v-for="i in [1, 2, 3, 4]")
          router-link(to="/game")
            .card
              header
                svg(viewBox="0 0 32 32")
                  path(d="M13.757 19.868c-0.416 0-0.832-0.159-1.149-0.476-2.973-2.973-2.973-7.81 0-10.783l6-6c1.44-1.44 3.355-2.233 5.392-2.233s3.951 0.793 5.392 2.233c2.973 2.973 2.973 7.81 0 10.783l-2.743 2.743c-0.635 0.635-1.663 0.635-2.298 0s-0.635-1.663 0-2.298l2.743-2.743c1.706-1.706 1.706-4.481 0-6.187-0.826-0.826-1.925-1.281-3.094-1.281s-2.267 0.455-3.094 1.281l-6 6c-1.706 1.706-1.706 4.481 0 6.187 0.635 0.635 0.635 1.663 0 2.298-0.317 0.317-0.733 0.476-1.149 0.476z")
                  path(d="M8 31.625c-2.037 0-3.952-0.793-5.392-2.233-2.973-2.973-2.973-7.81 0-10.783l2.743-2.743c0.635-0.635 1.664-0.635 2.298 0s0.635 1.663 0 2.298l-2.743 2.743c-1.706 1.706-1.706 4.481 0 6.187 0.826 0.826 1.925 1.281 3.094 1.281s2.267-0.455 3.094-1.281l6-6c1.706-1.706 1.706-4.481 0-6.187-0.635-0.635-0.635-1.663 0-2.298s1.663-0.635 2.298 0c2.973 2.973 2.973 7.81 0 10.783l-6 6c-1.44 1.44-3.355 2.233-5.392 2.233z")
              .info
                b The Breakout Game
                p Create your very own breakout game from scratch!
</template>

<script>
  export default {
    name: "x-landing"
  }
</script>

<style lang="sass" scoped>
  $primary: #2ecc71
  $overlay-image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?crop=fit"

  header.main
    position: relative
    display: flex
    justify-content: center
    align-items: center
    background-color: $primary
    color: white
    padding: 4.5em 2em
    text-align: center
    box-shadow: 0 2px 5px 0 rgba(0,0,0,0.16), 0 2px 10px 0 rgba(0,0,0,0.12)
    height: 8em

    h1
      margin: 0
      font-family: "Roboto"
      font-weight: 600
      font-size: 3.6em

  .header-overlay
    position: absolute
    width: 100%
    height: 100%
    top: 0
    left: 0
    opacity: 0.05
    background-image: url($overlay-image)
    background-size: cover
    background-position: center center

  main
    margin: 0 auto
    padding: 1em 1em
    max-width: 1000px

  .cardholder
    display: flex
    box-sizing: border-box

  .card
    font-family: "Roboto"
    background-color: #fff
    border-radius: 4px
    box-shadow: 0 1px 2px 0 rgba(168,182,191,0.6)
    flex: 1
    margin: 1em 0
    position: relative
    text-align: center

    &:after
      bottom: 0
      box-shadow: 0 10px 20px 0 rgba(168,182,191,0.6)
      content: ''
      left: 0
      opacity: 0
      position: absolute
      right: 0
      top: 0
      transition: opacity .25s ease-out
      will-change: opacity
      z-index: -1

    &:hover:after
      opacity: 1

    header
      align-self: flex-start
      padding-top: 2em
      padding-bottom: .85em
      background-color: $primary
      min-height: 5em
      color: white

      svg
        width: 5em
        height: 5em
        fill: #efefef
        padding-bottom: 1em

    .info
      padding: 1.5em
      word-break: break-all
      color: #999

  .button
    margin: .25em 0
    margin-top: 1.5em
    font-family: "Roboto"
    background-color: #ff5a79
    color: #fff
    box-shadow: 0 4px #f3002e
    display: inline-block
    cursor: pointer
    border-radius: 4px
    font-weight: 600
    padding: .75em 1em
    transition: none
    position: relative

    &:not(:first-child)
      margin-left: 1em

    &:active
      box-shadow: 0 0 #ff5a79
      top: 4px
</style>
