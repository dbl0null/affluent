<template>
  <div id="app">
    <Data endpoint="users" title="Users"/>
    <Data endpoint="dates" title="Dates"/>
  </div>
</template>

<script>
import Data from './components/Data.vue'

export default {
  name: 'app',
  components: {
    Data
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
