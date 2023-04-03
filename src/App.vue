<template>
  <div id="app">
    <router-view/>
    <!-- <bottom-navigation></bottom-navigation> -->
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
#App {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: hwb(210 9% 6%);
  margin-top: 60px;
}
body {
  margin: 0;
  padding-top: 60px;
}

</style>
