<template>
    <div class="wrap" id="wrap">
        <div class="logGet">
            <!-- 头部提示信息 -->
            <div class="logD logDtip">
                <img style="justify-content;: center" src="@/assets/logo.png" alt="">
            </div>
            <!-- 输入框 -->
            
            <div class="lgD">
                <el-autocomplete
                style="width: 100%;"
                v-model="state"
                :fetch-suggestions="querySearchAsync"
                placeholder="输入用户名"
                @select="handleSelect"
                ></el-autocomplete>
            </div>
            <div class="lgD">
                <el-input
                placeholder="输入工作室名"
                v-model="ruleForm.studio"
                clearable>
                </el-input>
            </div>
            <div class="lgD">
                <el-input
                placeholder="输入学生名(老师免填)"
                v-model="ruleForm.student_name"
                clearable>
                </el-input>
            </div>
            <div class="lgD">
                <el-input
                placeholder="输入校区名(无分校区免填)"
                v-model="ruleForm.campus"
                clearable>
                </el-input>
            </div>
            <div class="logC">
                <a><button @click="login">登 录</button></a>
            </div>
            <div class="logE">
                <a><button @click="signup">注 册</button></a>
            </div>
        </div>
    </div>
</template>

<script>
import { HttpPost } from '@/api'

export default {
  name:'Login',
  data () {
    return {
        ruleForm: {
            studio: '',
            student_name: '',
            nick_name: '',
            campus:''
        },
        openid: '',
        restaurants: [],
        state:''
    };
  }, 
  
  watch:{
    state: function() {
      let that = this
      that.restaurants = []
      console.log( 'state:' + that.state)
      that.getUserByNickName(that.state)
    },
  },


  methods: {
    async getUserByNickName (nickName) {
        var that = this;
        that.restaurants = []
        let loginParams = {
            nickName: nickName,
        };
        let res = HttpPost("/getUserByNickName",loginParams);
        res.then(res => {
            console.log(res.data)
            for(var i in res.data){
                let studio = res.data[i].studio
                let nick_name = res.data[i].nick_name
                let student_name = res.data[i].student_name
                let campus = res.data[i].campus
                let json = {
                    value:nick_name+"("+ studio +")",
                    nick_name:nick_name,
                    studio :studio,
                    student_name:student_name,
                    campus:campus

                }
                that.restaurants.push(json)
            }
            console.log(that.restaurants)
        })
    },

    login () {
        var that = this;
        let studio = that.ruleForm.studio;
        let nick_name = that.ruleForm.nick_name;

        let loginParams = {
            studio: studio,
            nick_name: nick_name,
        };
        // console.log(loginParams)

        if (studio == '') {
            this.$message({
                message: '工作室为空！',
                type: 'warning'
            });
            return;
        }

        if (nick_name == '') {
            this.$message({
                message: '用户名为空！',
                type: 'warning'
            });
            return;
        }

        let res = HttpPost("/getUserByNickStudioEq", loginParams);
        res.then(res => {
            console.log(res.data)
            try {
                that.openid = res.data[0].openid
            } catch (error) {
                console.log(error)
            }

            if (that.openid !== '') {
                that.$router.push({ path: '/Home', query: { openid: that.openid } })
            } else {
                this.$message({
                    message: '用户不存在,请注册！',
                    type: 'warning'
                });
            }
            that.setCookie(that.openid, 7)
        })
    },

    signup () {
        var that = this
        let studio = that.ruleForm.studio
        let student_name = that.ruleForm.student_name
        let nick_name = that.ruleForm.nick_name
        let campus = that.ruleForm.campus

        if (studio == '') {
            this.$message({
                message: '工作室为空！',
                type: 'warning'
            });
            return;
        }

        if (student_name == '') {
            student_name = 'no_name'
        }

        if (campus == '') {
            campus = studio
        }

        if (nick_name == '') {
            this.$message({
                message: '用户名为空！',
                type: 'warning'
            });
            return;
        }

        let loginParams = {
            studio: studio,
            nick_name: nick_name,
            student_name:student_name,
            openid:that.openid,
            campus:campus
        }

        HttpPost("/insertUser", loginParams);
        let res = HttpPost("/getUserByNickStudioEq", loginParams);
        res.then(res => {
            // console.log(res.data)
            try {
                that.openid = res.data[0].openid
            } catch (error) {
                console.log(error)
            }

            setTimeout(function () {
                that.$router.push({ path: '/Home', query: { openid: res.data[0].openid } })
            },1000)

            that.setCookie(that.openid, 7)
        })
    },

    querySearchAsync(queryString, cb) {
        let that = this
        var restaurants = that.restaurants;
        var results = queryString ? restaurants.filter(that.createStateFilter(queryString)) : restaurants;
        clearTimeout(that.timeout);
        that.timeout = setTimeout(() => {
          cb(results);
        }, 3000 * Math.random());
    },

    createStateFilter(queryString) {
    return (state) => {
        return (state.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
    };
    },

    handleSelect(item) {
        let that = this
        console.log(item);
        that.ruleForm.studio = item.studio;
        that.ruleForm.nick_name = item.nick_name;
        that.ruleForm.student_name = item.student_name;
        that.ruleForm.campus = item.campus;
        that.state = item.nick_name;
    },

    setCookie (openid, days) {
        let that = this
        // that.clearCookie()
        let date = new Date()
        date.setTime(date.getTime() + 24 * 60 * 60 * 1000 * days)
        window.document.cookie = 'openid=' + openid + ';path=/;expires=' + date.toGMTString()
    },

    clearCookie () {
        let openid = ''
        let date = -1
        window.document.cookie = 'openid=' + openid + ';path=/;expires=' + date.toGMTString()

    }
  }
}
</script>

<style scoped>
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
    /* width: 100%; */
    /* background-position: center center; */
    /* position: relative; */
    /* justify-content: center; */
    display: flex;
    margin-top: 2%;
    margin-left:35%;

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
    right: 20%;
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

.logE a button {
    width: 100%;
    height: 45px;
    background-color: #7cbeea;
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
    width: 88%;
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

#wrap .logGet .logE {
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
