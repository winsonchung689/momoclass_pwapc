<template>
  <div id="app">
    <router-view/>
    <bottom-navigation v-if="$route.meta.showTabBar"/>
  </div>
</template>

<script>
import BottomNavigation from '@/components/BottomNavigation'

export default {
  name: 'App',
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
  color: white;
  margin-top: 60px;
  height: 100%;
  padding: 0;
}
body {
  margin: 0;
  padding-top: 0px;
}

</style>
