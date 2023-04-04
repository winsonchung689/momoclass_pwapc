<template>
  <div class="welcome">
    <meta http-equiv="refresh" content="3; URL=/home">
    <img style="width: 100%; height: 100%; left: 0;" src="@/assets/welcome.png" alt="welcome!">
  </div>
</template>

<script>
export default {
  name: 'Welcome',
  data () {
    return {
      msg: 'welcome!'
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.welcome{
  position: fixed;
  height: 100%;
  width: 100%;
  /* background: url("@/assets/welcome.png") no-repeat; */
  background-size: 100%  100%;
}

.welcome img{
  position: fixed;
  width: 100%; 
  height: 100%; 
  left: 0;
  top: 0;
  right: 0;
  height: 3rem;
  z-index: 10;
}

</style>
