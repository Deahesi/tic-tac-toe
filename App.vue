<template>
  <div id="app">
    <Header />
    <router-view/>
  </div>
</template>

<script>
  import Header from "./components/Header";
  import messages from "./utils/messages";

  export default {
    components: {
      Header
    },
    computed: {
      error() {
        return this.$store.getters.error
      }
    },
    watch: {
      error(fbError) {
        console.log(fbError)
        this.$error(messages[fbError.code] || 'Что-то пошло не так')
      }
    }
  }
</script>

<style lang="scss">
  @import "~materialize-css/dist/css/materialize.min.css";
  @import "assets/index.scss";
</style>
