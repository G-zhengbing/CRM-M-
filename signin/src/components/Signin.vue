<template>
  <div class="box">
    <header>
      <span>注册</span>
    </header>
    <section>
      <div class="section-content contaner">
        <div class="section-content-header">
          <img src="../assets/xxhdpi.png" alt />
        </div>
        <div class="section-content-center">
          <ul>
            <li>
              <input
                type="text"
                placeholder="请输入姓名"
                v-model="form.student_name"
                @click="setColor(0)"
                :class="[num == 0? active:'']"
              />
            </li>
            <li>
              <input
                type="text"
                placeholder="请输入手机号"
                v-model="form.mobile"
                @click="setColor(1)"
                :class="[num == 1? active : '']"
              />
            </li>
            <li>
              <div>
                <input
                  type="text"
                  placeholder="请输入验证码"
                  v-model="code.text"
                  @click="setColor(2)"
                  :class="[num == 2? active : '']"
                />
                <span class="code">{{checkCode}}</span>
                <span class="change" @click="change">不清楚?换一张</span>
              </div>
            </li>
          </ul>
          <p class="btn" @click="login" @touchstart="isAn" @touchend="isLa" :class="{isan:isan}">
            <span>注册</span>
          </p>
        </div>
        <div class="section-content-bottom"></div>
      </div>
    </section>
    <Message v-if="show" :type="type" />
    <Erweima v-if="erweima" />
  </div>
</template>

<script>
import { ZHUCE } from "../uilt/url/index";
import Message from "../uilt/message/Message";
import Erweima from "../uilt/message/Erweima";
import axios from "axios";
export default {
  components: {
    Message,
    Erweima
  },
  mounted() {
    this.random();
  },
  data() {
    return {
      erweima: false,
      isan: true,
      active: "active",
      num: null,
      show: false,
      code: {
        text: undefined
      },
      checkCode: "",
      form: {},
      type: {
        classify: "message",
        text: ""
      }
    };
  },
  watch: {
    form(item) {},
    "code.text"(item) {
      if (item.student_name && item.mobile && this.code.text) {
        this.isan = false;
      }
    }
  },
  methods: {
    isLa() {
      this.isan = true;
    },
    isAn() {
      this.isan = false;
    },
    setColor(num) {
      this.num = num;
    },
    getUrlParam(name) {
      var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
      var r = window.location.search.substr(1).match(reg); //匹配目标参数
      if (r != null) return unescape(r[2]);
      return ""; //返回参数值
    },
    login() {
      var han = /^[\u4e00-\u9fa5]+$/;
      this.type.text = "";
      if (!this.form.student_name) {
        this.show = true;
        this.type.text = "用户名不能为空!";
        return;
      }
      if (!han.test(this.form.student_name)) {
        this.show = true;
        this.type.text = "用户名必须以全汉字命名";
        return;
      }
      if (!this.form.mobile) {
        this.show = true;
        this.type.text = "手机号不能为空!";
        return;
      }
      if (!this.code.text) {
        this.show = true;
        this.type.text = "验证码不能为空!";
        this.random();
        this.code.text = "";
        return;
      }
      if (this.code.text.toUpperCase().trim() != this.checkCode.trim()) {
        this.code.text = "";
        this.random();
        this.type.text = "验证码不正确!";
        return;
      }
      this.signin().then(res => {
        this.random();
        if (res.data.error && res.data.code == 1000 && res.data.ret == false) {
          this.show = true;
          this.type.text = res.data.error;
          this.form = {};
          this.code.text = "";
          return;
        } else if (
          res.data.error &&
          res.data.code == 100001 &&
          res.data.ret == false
        ) {
          this.show = true;
          this.type.text = res.data.error;
          this.form = {};
          this.code.text = "";
          return;
        } else {
          this.erweima = true;
          this.code.text = "";
          this.form = {};
        }
      });
    },
    signin() {
      return new Promise((resolve, reject) => {
        this.form.promoter_id = this.getUrlParam("promoter_id");
        axios({
          method: "post",
          url: ZHUCE,
          params: {
            ...this.form
          }
        })
          .then(res => {
            resolve(res);
          })
          .catch(e => {
            reject(e);
          });
      });
    },
    change() {
      this.random();
    },
    random() {
      var code = "";
      var codeLength = 4;
      var random = new Array(
        0,
        1,
        2,
        3,
        4,
        5,
        6,
        7,
        8,
        9,
        "A",
        "B",
        "C",
        "D",
        "E",
        "F",
        "G",
        "H",
        "I",
        "J",
        "K",
        "L",
        "M",
        "N",
        "O",
        "P",
        "Q",
        "R",
        "S",
        "T",
        "U",
        "V",
        "W",
        "X",
        "Y",
        "Z"
      );
      for (var i = 0; i < codeLength; i++) {
        //循环操作
        var index = Math.floor(Math.random() * 36);
        code += random[index];
      }
      this.checkCode = code;
    }
  }
};
</script>
<style scoped>
.section-content-center .btn.isan {
  background: #ffa27d;
}
input::-webkit-input-placeholder {
  color: #999;
}
input.active::-webkit-input-placeholder {
  color: #dedede;
}
.section-content-header {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 50px 0;
}
.section-content-header img {
  margin-right: 5px;
  height: 50px;
}
.section-content-header span {
  color: #fd6122;
  font-size: 25px;
}
.section-content-center .btn {
  width: 100%;
  height: 40px;
  background: #fd6122;
  color: #fff;
  display: inline-block;
  margin: 20px 0;
  border-radius: 20px;
  font-size: 14px;
  text-align: center;
  line-height: 40px;
}
.section-content-center ul li div .change {
  color: #238acb;
  font-size: 12px;
  width: 200px;
  margin-right: -22px;
  padding: 7px 0;
  margin-top: 10px;
}
.section-content-center ul li div .code {
  display: inline-block;
  background: #ccc;
  width: 120px;
  height: 30px;
  color: #fd6122;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 10px;
}
.section-content-center ul li div {
  display: flex;
  align-items: center;
}
input::-webkit-input-placeholder {
  color: #999;
}
.section-content-center ul li input {
  border: none;
  outline: none;
  padding: 5px 0;
  width: 100%;
  font-size: 16px;
  margin-top: 20px;
}
.section-content-center ul li {
  border-bottom: 1px solid #bfbfbf;
  height: 50px;
}
.contaner {
  margin: 0 50px;
}
header {
  height: 63px;
  background: #fd6122;
  color: #fff;
  font-size: 14px;
  text-align: center;
  line-height: 63px;
}
</style>
