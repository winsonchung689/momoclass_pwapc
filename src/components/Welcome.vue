<template>
  <div class="welcome">
    <meta http-equiv="refresh" content="3; URL=/Login">
    <img src="@/assets/welcome.png" alt="">
  </div>
</template>

<script>
// export default {
//   name: 'Welcome',
//   data () {
//     return {
//       msg: ''
//     }
//   }
// }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.welcome{
  position: fixed;
  height: 100%;
  width: 100%;
  /* background: url("@/assets/welcome.png") no-repeat; */
  background-size: 100%  100%;
  background-color: white;
}

.welcome img{
  position: fixed;
  width: 100%; 
  height: 100%; 
  left: 0;
  top: 0;
}

</style>
