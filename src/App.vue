<template>
  <div id="app">
    <img src="./assets/144.png">
    <router-view/>
    <bottom-navigation></bottom-navigation>
  </div>
</template>

<script>
import BottomNavigation from '@/components/BottomNavigation'

export default {
  name: 'app',
  components: {
    BottomNavigation
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #cbdae9;
  margin-top: 60px;
}
</style>
