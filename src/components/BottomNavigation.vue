<template>
  <div class="bottom-navigation">
    <button class="current">学生专区</button>
    <button>工作台</button>
    <button>个人中心</button>
  </div>
</template>

<style scoped>
.bottom-navigation {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 56px;
  box-shadow: 0 3px 14px 2px rgba(0, 0, 0, .12);
  display: flex;
  background-color: rgb(182, 225, 225);
}

button {
  flex: 1;
  font-size: 14px;
  color: #d6a7a7;
}

button.current {
  color: #328ce6;
  font-size: 15px;
}
</style>
