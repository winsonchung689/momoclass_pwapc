<template>
    <div>
      <li v-for="item of items">
          <span>{{ item.studio }}</span><span>{{ item.subject }}</span>
      </li>
    </div>
</template>

<script>
import { HttpGet } from '@/api'
import { HttpPost } from '@/api'

export default {
  name: 'Students',
  data () {
    return {
      items:[],
      openid: this.$route.query.openid,
    }
  },

  created () {
    this.getUser()
  },

  methods: {
    async getUser () {
      let that = this
      const users = await HttpGet('/getUserByOpenid?openid=' + that.openid)
      const user_data = users.data
      for ( var i in user_data){
        const student_name = user_data[i].student_name
        const studio = user_data[i].studio

        let param ={
          student_name:student_name,
          studio:studio
        }

        const lessons = await HttpPost('/getLessonByName',param)
        const lessons_data = lessons.data
        for( var i in lessons_data){
          const total_amount = lessons_data[i].total_amount
          const left_amount = lessons_data[i].left_amount
          const subject = lessons_data[i].subject
          const points = lessons_data[i].points

          var json ={};
          json.studio = studio
          json.subject = subject
          json.student_name = student_name
          json.total_amount = total_amount
          json.left_amount = left_amount
          json.points = points
          that.items.push(json)

          console.log(that.items)

        }
      }

    }

  }

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
