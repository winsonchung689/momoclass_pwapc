<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <button @click="$router.push('/next')">工作台</button>
    <button @click="$router.push('/next')">学生专区</button>
    <button @click="$router.push('/next')">个人中心</button>
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  data () {
    return {
      msg: 'Welcome to Your MOMO ASSISTANT！'
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}
button {
  font-size: 16px;
  padding: 0.75em 2em;
  border-radius: 2em;
  display: inline-block;
  color: #fff;
  background-color: #4fc08d;
  transition: all 0.15s ease;
  box-sizing: border-box;
  border: 1px solid #4fc08d;
}
</style>
