<template>
  <div>
    <div style="background-color: #fff;;position: fixed; top: 0;display: flex;flex-direction: row; width: 500px;">
        <div>
          <i class="el-icon-arrow-left" @click="goOff()"></i>
        </div>
        <div style=" width: 50%;font-size: medium;font-weight: bolder;justify-content: center;display: flex;margin-left: 30px;margin-top: 5px;">{{ header }}</div>
    </div>


    <div class="chatAppBody">
        <div class="chatTitle">通风报信,哩度讲哩度散~~xu</div>
        <div v-for="item in message_list">
            <div v-if="item.direction === 1" class="chatRow">
              <el-avatar class="chatAvatar" :size="30" src="../assets/chat.png"></el-avatar>
              <div class="chatMsgContent">
                  <div class="chatUsername">匿名</div>
                  <div class="chatContent">{{ item.msg }}</div>
              </div>
            </div>
            <div v-if="item.direction === 2" class="chatRow chatRowMe">
                <div class="chatContent">{{ item.msg }}</div>
            </div>
        </div>
    </div>

    <div style="position: fixed;width: 100%;margin-top: 20px;">
      <el-input
        type="textarea"
        :rows="4"
        placeholder="请输入内容"
        v-model="textarea">
      </el-input>
      <el-button @click="sendMessage" type="primary">发送</el-button>
    </div>
    

  </div>

</template>

<script>

import { HttpGet } from '@/api'
import { HttpPost } from '@/api'
import WebSocket from '@/components/WebSocket'


export default {
    name: "ChatRoom",
    data() {
        return {
            header: "吹水站",
            subject: this.$route.query.subject,
            studio: this.$route.query.studio,
            role: this.$route.query.role,
            openid: this.$route.query.openid,
            textarea: "",
            message_list: [
                { msg: "aaa", direction: 1 },
                { msg: "aaa", direction: 1 },
                { msg: "aaa", direction: 1 },
                { msg: "bbbb", direction: 2 },
                { msg: "bbbb", direction: 2 },
                { msg: "aaa", direction: 1 },
            ]
        };
    },

    created() {

    },

    methods: {
      goOff() {
          this.$router.go(-1);
      },

      async sendMessage(){
        let that = this
        let textarea = that.textarea
        let openid = that.openid

        let param = {
          message: textarea,
          openid: openid
        }
        await HttpPost('/sendNotification', param)
      }
    },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.chatAppBody{
    display: flex;
    flex-direction: column;
    height: 70vh;
    background-color: #f1f5f8;
    margin-top: 40px;
    overflow: scroll;
}
.chatTitle{
    background: #fff;
    font-size: small;
    color: rgb(151, 160, 163);
    font-weight: bolder;
}
.chatBox{
    flex: 1;
    padding: 0 5px;
    overflow: auto;
}
.chatBottom{
    background: #fff;
}
.chatRow{
    display: flex;
    align-items: flex-end;
    margin: 5px 0px;
}
.chatAvatar{
    margin-right: 5px;
    flex-shrink: 0;
}
.chatUsername {
    font-size: 12px;
    white-space: nowrap;
    color: #999;
    margin-bottom: 2px;
}
.chatContent{
    border-radius: 10px 10px 10px 0px;
    padding: 10px;
    background-color: rgb(255,255,255);
    box-shadow: 0 5px 30px rgb(50 50 93 / 8%), 0 1px 3px rgb(0 0 0 / 5%);
    font-size: 14px;
    word-break: break-all;
    line-height: 21px;
}
.chatRowMe{
    justify-content: flex-end;
}
.chatRowMe .chatContent{
    border-radius: 10px 10px 0px 10px;
}

</style>
