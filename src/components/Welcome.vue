<template>
  <div class='welcome'>
    <img src='@/assets/welcome.png' alt=''>
  </div>
</template>

<script>
export default {
  name: 'Welcome',

  data () {
    return {
      openid: '',
    }
  },

  created () {
    this.getCookie()
  },

  methods: {
    getCookie () {
      if (document.cookie.length > 0) {
        var arr = document.cookie.split('; ')
        console.log(arr)
        for (var i = 0; i < arr.length; i++) {
          var arr2 = arr[i].split('=')
          if (arr2[0] === 'openid') {
            this.openid = arr2[1]
            if (this.openid !== '') {
              // console.log('cookie_openid:' + this.openid)
              setTimeout(() => {
                this.$router.replace({ path: '/Home', query: { openid: this.openid } })
              }, 3000)
            } else {
              console.log('cookie_openid 为空!')
              setTimeout(() => {
                // this.$router.replace('/Login')
                this.$router.replace({ path: '/Home', query: { openid: this.openid } })
              }, 3000)
            }
          }
        }
      } else {
        console.log('cookie_openid 为空!')
        setTimeout(() => {
          this.$router.replace('/Home')
        }, 3000)
      }
    }
  }
}
</script>

<!-- Add 'scoped' attribute to limit CSS to this component only -->
<style scoped>
.welcome {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;

}

.welcome img {
  width: 25%;
  height: 25%;
  margin-top: 10%;
}
</style>
