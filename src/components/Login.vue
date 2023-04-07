<template>
    <div class="wrap" id="wrap">
        <div class="logGet">
            <!-- 头部提示信息 -->
            <div class="logD logDtip">
                <img style="justify-content;: center" src="@/assets/logo.png" alt="">
            </div>
            <!-- 输入框 -->
            <div class="lgD">
                <input type="text" placeholder="输入工作室名" />
            </div>
            <div class="lgD">
                <input type="text" placeholder="输入学生名" />
            </div>
            <div class="lgD">
                <input type="text" placeholder="输入用户名" />
            </div>
            <div class="logC">
                <a><button @click="login">登 录</button></a>
            </div>
        </div>
    </div>
</template>

<script>
import { HttpGet } from "@/api";

    export default {

        methods: {
            login() {
                this.$router.replace('/welcome');
            }
        }
    }
</script>

<style>
    body {
        background-size: 100%;
        background-repeat: no-repeat;
        background-position: center center;
    }

    * {
        margin: 0;
        padding: 0;
    }

    #wrap {
        height: 600px;
        width: 100%;
        background-position: center center;
        position: relative;
        justify-content: center;
        margin-top: 25%;
        
    }

    #head {
        height: 120px;
        width: 100;
        background-color: #66CCCC;
        text-align: center;
        position: relative;
    }

    #wrap .logGet {
        height: 408px;
        width: 368px;
        background-color: #FFFFFF;
        top: 100px;
        right: 15%;
        justify-content: center;
    }

    .logC a button {
        width: 100%;
        height: 45px;
        background-color: #e2a3cd;
        border: none;
        color: white;
        font-size: 18px;
    }

    .logGet .logD.logDtip .p1 {
        display: inline-block;
        font-size: 28px;
        margin-top: 30px;
        width: 86%;
        justify-content: center;
    }

    #wrap .logGet .logD.logDtip {
        width: 86%;
        border-bottom: 1px solid #e2a3cd;
        margin-bottom: 60px;
        margin-top: 0px;
        margin-right: auto;
        margin-left: auto;
        justify-content: center;
        display: flex;
    }

    .logGet .lgD img {
        position: absolute;
        top: 12px;
        left: 8px;
    }

    .logGet .lgD input {
        width: 100%;
        height: 42px;
        text-indent: 2.5rem;
    }

    #wrap .logGet .lgD {
        width: 86%;
        position: relative;
        margin-bottom: 30px;
        margin-top: 30px;
        margin-right: auto;
        margin-left: auto;
    }

    #wrap .logGet .logC {
        width: 86%;
        margin-top: 0px;
        margin-right: auto;
        margin-bottom: 0px;
        margin-left: auto;
    }


    .title {
        font-family: "宋体";
        color: #FFFFFF;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        /* 使用css3的transform来实现 */
        font-size: 36px;
        height: 40px;
        width: 30%;
    }

    .copyright {
        font-family: "宋体";
        color: #FFFFFF;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        /* 使用css3的transform来实现 */
        height: 60px;
        width: 40%;
        text-align: center;
    }
</style>