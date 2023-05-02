<template>
  <div>
    <div style="background-color: #fff;;position: fixed; top: 0;display: flex;flex-direction: row; width: 500px;">
        <div>
          <i class="el-icon-arrow-left" @click="goOff()"></i>
        </div>
        <div style=" width: 50%;font-size: medium;font-weight: bolder;justify-content: center;display: flex;margin-left: 30px;margin-top: 5px;">{{ header }}</div>
    </div>

    <div class="chatAppBody">
        <div class="chatTitle">标题</div>
        <div class="chatBox">
            <div class="chatRow">
                <el-avatar class="chatAvatar" :size="30" src="../assets/chat.png"></el-avatar>
                <div class="chatMsgContent">
                    <div class="chatUsername">匿名</div>
                    <div class="chatContent">有什么可以帮您?</div>
                </div>
            </div>
            <div class="chatRow chatRowMe">
                <div class="chatContent">你好，这个客服系统多少钱？</div>
                
            </div>
        </div>
        <div class="chatBottom">输入框区域</div>
    </div>

  </div>

</template>

<script>

import { HttpGet } from '@/api'
import { HttpPost } from '@/api'

export default {
  name: 'ChatRoom',
  data () {
    return {
      header:'吹水站',
    }
  },

  created () {
  },

  methods: {

    goOff() {
      this.$router.go(-1);
    },

  }

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.chatAppBody{
        display: flex;
        flex-direction: column;
        height: 100vh;
        background-color: #f1f5f8;
    }
    .chatTitle{
        background: #fff;
    }
    .chatBox{
        flex: 1;
        padding: 0 5px;
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
