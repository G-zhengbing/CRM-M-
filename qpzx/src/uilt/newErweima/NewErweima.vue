<template>
  <div class="boxs">
    <div class="shade" v-if="type.classify == 'erweima'">
      <div class="contaner" v-show="shade">
        <div class="shade-top">
          <span>新建渠道</span>
        </div>
        <div class="shade-bottom">
          <form>
            <label>
              标题:
              <input type="text" v-model="form.title" />
            </label>
            <label>
              需求类型:
              <select class="select" v-model="form.demand_type">
                <option :value="i" v-for="(list,i) in cityRefre" :key="i">{{list}}</option>
              </select>
            </label>
            <label class="left">
              城&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;市:
              <input
                @keyup.enter="getCity"
                type="text"
                style="width: 195px;"
                v-model="city"
                placeholder="回车搜索城市/例如:北京"
              />
            </label>
            <label class="cityList" v-if="isCityList">
              <ul>
                <li v-for="(list,i) in cityList" :key="i" @click="getCityList(i)">{{list.Name}}</li>
              </ul>
            </label>
            <label>
              学&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;校:
              <select
                class="select"
                v-model="form.school"
              >
                <option :value="list.id" v-for="(list,i) in cityShool" :key="i">{{list.school_name}}</option>
              </select>
            </label>
            <label class="left">
              使&nbsp;&nbsp;用&nbsp;&nbsp;&nbsp;人:
              <input
                type="text"
                style="width: 195px;"
                v-model="form.user_name"
              />
            </label>
            <label>
              年&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;级:
              <select
                class="select"
                v-model="form.grade"
              >
                <option :value="list" v-for="(list,i) in 9" :key="i">{{list + "年级"}}</option>
              </select>
            </label>
            <div>
              <button class="confirm" type="button" @click="save">确定生成</button>
              <button class="colse" type="button" style="margin-left:52px;" @click="colse">取消</button>
            </div>
            <i @click="colse">×</i>
          </form>
        </div>
      </div>
    </div>
    <div class="shadetow" v-if="type.classify == 'fenxiang'">
      <div class="contanertow">
        <div class="shadetow-top">
          <button>分享</button>
        </div>
        <div class="shadetow-bottom">
          <div class="shadetow-bottom-top">
            <input type="text" v-model="loginUrl" id="imgUrl" />
            <button @click="copyImgUrl">复制地址</button>
          </div>
          <div class="shadetow-bottom-bottom">
            <a :href="location" download="erweima.png" ref="a">
              <img :src="imgUrl" alt="erweima.png" />
            </a>
            <i></i>
            <button @click="downLoad">保存二维码</button>
          </div>
        </div>
      </div>
      <i class="colse" @click="colse">×</i>
    </div>
    <div v-else-if="type.classify == 'chehui'">
      <div v-if="chehui" class="chehui">
        <div class="chehui-header">
          <span>提示</span>
          <i @click="colse">×</i>
        </div>
        <div class="chehui-bottom">
          <span>确定要撤销此二维码吗?</span>
          <div>
            <span class="yes" @click="yes">是</span>
            <span class="no" @click="$parent.show = false">否</span>
          </div>
        </div>
      </div>
    </div>
    <div v-else-if="type.classify == 'chakan'" class="shade chakan ischakan">
      <div class="contaner">
        <div class="shade-top">
          <span>详情</span>
        </div>
        <div class="shade-bottom chakan-bottom">
          <form enctype="multipart/form-data">
            <label>
              标&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;题:
              <input
                type="text"
                v-model="type.data.channel_title"
                readonly="readonly"
              />
            </label>
            <label>
              需求类型:
              <input type="text" v-model="type.data.channel_type" readonly="readonly" />
            </label>
            <label>
              城&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;市:
              <input
                @keyup.enter="getCity"
                type="text"
                style="width: 195px;"
                v-model="type.data.city"
                readonly="readonly"
              />
            </label>
            <label>
              学&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;校:
              <input
                type="text"
                v-model="type.data.school"
                readonly="readonly"
              />
            </label>
            <label>
              使&nbsp;&nbsp;用&nbsp;&nbsp;&nbsp;人:
              <input
                type="text"
                style="width: 195px;"
                v-model="type.data.channel_user"
                readonly="readonly"
              />
            </label>
            <label>
              年&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;级:
              <input
                type="text"
                v-model="type.data.grade"
                readonly="readonly"
              />
            </label>
            <label style="margin-right: 67px;">
              状&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;态:
              <input
                type="text"
                v-model="type.data.status"
                readonly="readonly"
              />
            </label>
            <label>
              创 建 时间:
              <input
                type="text"
                style="width: 195px;"
                v-model="type.data.create_time"
                readonly="readonly"
              />
            </label>
            <div class="erInp">
              <label class="erweima" style="width: 650px;">
                <span>二 维 码:</span>
                <img :src="type.data.qcode_pic" alt />
              </label>
              <label class="dizhi">
                <span>推广地址:&nbsp;&nbsp;&nbsp;&nbsp;</span>
                <input id="dizhi" type="text" v-model="type.data.request_url" />
                <button type="button" @click="dizhi">复制</button>
              </label>
              <label class="file">
                <span>导入用户</span>
                <input type="file" ref="file" @click="daoruClick" />
              </label>
              <label class="file">
                <button type="button" @click="saveDaoru">确定导入</button>
              </label>
            </div>
            <p class="tuiguangjilu">推广记录</p>
            <div>
              <TablePlus
                :columns="columns"
                :data="qudaoList"
                :total="total"
                :currentPage="currentPage"
                :pageSize="pageSize"
                @page-change="pageChange"
              />
            </div>
            <i @click="colse">×</i>
          </form>
        </div>
      </div>
    </div>
    <div class="message" v-show="message">
      <span>二维码已失效!</span>
    </div>
    <Loading v-show="isLoading" />
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from "vuex";
import Loading from "../loading/loading";
import TablePlus from "../table/TablePlus";
import storage from "../storage";
import axios from "axios";
import QS from "qs"
import XLSX from "xlsx";
export default {
  props: ["type"],
  components: {
    Loading,
    TablePlus
  },
  computed: {
    ...mapState({
      newForm: state => state.erweima.newForm,
      cityList: state => state.erweima.cityList,
      cityRefre: state => state.erweima.cityRefre,
      cityShool: state => state.erweima.cityShool,
      qudaoList: state => state.erweima.qudaoList,
      currentPage: state => state.erweima.tuiCurrent,
      total: state => state.erweima.tuiTotal,
      pageSize: state => state.erweima.tuiPageSize
    })
  },
  mounted() {
    this.location = window.location.href;
    console.log(window.location.href);
    if (this.type.classify == "chakan") {
      this.getQudao(this.type.data);
    }
    if (this.type.classify == "erweima") {
      this.getTypeShool();
    }
  },
  data() {
    return {
      columns: [
        { type: "ID", key: "student_id" },
        { type: "学生姓名", key: "student_name" },
        { type: "学校", key: "school" },
        { type: "手机号", key: "mobile" },
        { type: "跟进人", key: "school" },
        { type: "创建时间", key: "create_time" }
      ],
      imgUrl: "",
      loginUrl: "",
      city: "",
      isCityList: false,
      chehui: true,
      message: false,
      form: {},
      isLoading: false,
      cityId: "",
      outputs: [],
      shade: true,
      location: ""
    };
  },
  methods: {
    ...mapMutations(["setTuiCurrent"]),
    ...mapActions([
      "NewErweimaList",
      "deleErweima",
      "getErweimaList",
      "getErwemaCity",
      "getTypeShool",
      "getQudao",
      "setDaoru"
    ]),
    dizhi() {
      let link = document.getElementById("dizhi");
      link.select();
      document.execCommand("Copy");
    },
    daoruClick() {
      this.$refs.file.addEventListener("change", e => {
        //绑定监听表格导入事件
        this.daoru(e);
      });
    },
    saveDaoru() {
      axios({
        method: "post",
        url: "http://liveapi.canpoint.net/api/export",
        headers: {
          "content-type": "application/json",
          Authorization: "bearer " + storage.get()
        },
        data : {
          qcode_id: this.type.data.qcode_id,
          data: this.outputs
        },
      }).then(res => {
        if (res.data.error) {
          alert(res.data.error);
        } else if (res.data.data.name) {
          alert(res.data.data.name);
        }
        this.$parent.show = false;
      });
    },
    //导入
    daoru(e) {
      var that = this;
      const files = e.target.files;
      const fileReader = new FileReader();
      fileReader.onload = ev => {
        try {
          const data = ev.target.result;
          const workbook = XLSX.read(data, {
            type: "binary"
          });
          const wsname = workbook.SheetNames[0]; //取第一张表
          const ws = XLSX.utils.sheet_to_json(workbook.Sheets[wsname]); //生成json表格内容
          that.outputs = [];
          that.outputs.push(ws);
        } catch (e) {
          return false;
        }
      };
      fileReader.readAsBinaryString(files[0]);
    },
    pageChange(page) {
      this.setTuiCurrent(page);
      this.isLoading = true;
      this.getQudao(this.type.data).then(res => {
        this.isLoading = false;
      });
    },
    downLoad() {
      window.open(this.imgUrl);
    },
    //复制按钮
    copyImgUrl() {
      let link = document.getElementById("imgUrl");
      link.select();
      document.execCommand("Copy");
    },
    //获取城市的值
    getCityList(index) {
      this.city = "";
      this.isCityList = false;
      this.city += this.cityList[index].Name;
      this.cityId = this.cityList[index].Id;
    },
    //城市
    getCity() {
      this.getErwemaCity(this.city).then(res => {
        this.isCityList = true;
      });
    },
    //撤回/删除
    yes() {
      this.chehui = false;
      this.message = true;
      this.deleErweima(this.type.data).then(res => {
        this.getErweimaList().then(res => {
          this.message = false;
          this.$parent.show = false;
        });
      });
    },
    save() {
      var han = /^[\u4e00-\u9fa5]+$/;
      var channels_id = "";
      let { title, demand_type, school, user_name, grade, city } = this.form;
      if (!han.test(title)) {
        alert("标题必须以汉字开头");
        return false;
      }
      if (!title) {
        alert("标题不能为空");
        return;
      } else if (!demand_type) {
        alert("需求类型不能为空");
        return;
      } else if (!school) {
        alert("学校不能为空");
        return;
      } else if (!user_name) {
        alert("使用人不能为空");
        return;
      } else if (!grade) {
        alert("年级不能空");
        return;
      }
      if (this.type.status) {
        channels_id = this.type.data.id;
      } else {
        channels_id = "";
      }
      this.NewErweimaList({
        form: this.form,
        cityId: this.cityId,
        channels_id: channels_id
      }).then(res => {
        if (res.data.error) {
          alert(res.data.error);
          this.isLoading = false;
          this.form = {};
          return;
        }
        if (res.data.data) {
          this.type.classify = "fenxiang";
          this.shade = false;
          this.imgUrl = res.data.data.qcode_pic;
          this.loginUrl = res.data.data.request_url;
          return;
        }
        this.form = {};
        this.getErweimaList();
      });
    },
    colse() {
      this.$parent.show = false;
    }
  }
};
</script>
<style scoped>
.dizhi {
  width: 100%;
}
#dizhi {
  width: 400px;
}
.tuiguangjilu {
  width: 100px;
  height: 35px;
  text-align: center;
  line-height: 35px;
  color: #fff;
  background: #1b73b0;
  border-radius: 5px;
  margin-top: 25px;
}
.shade-bottom form div.erInp form {
  width: 100%;
  display: flex;
  align-items: center;
}
.shade-bottom form div.erInp .file input {
  position: absolute;
  width: 100px;
  top: -39px;
  left: -14px;
  opacity: 0;
}
.shade-bottom form div.erInp .file span {
  display: inline-block;
  width: 100px;
  height: 35px;
  border: 1px solid;
  text-align: center;
  line-height: 35px;
  border-radius: 3px;
}
.shade-bottom form div.erInp .file {
  position: relative;
  cursor: pointer;
  top: 20px;
}
.shade-bottom form div.erInp {
  display: flex;
  align-items: center;
}
.qudao li {
  margin-right: 30px;
}
.shade-bottom.chakan-bottom .qudao li input {
  width: 150px;
}
.qudao {
  display: flex;
}
.shade.chakan label {
  margin-right: 80px;
}
.erweima img {
  width: 100px;
  height: 100px;
  margin-left: 33px;
}
.erweima {
  height: 100px;
  display: flex;
  align-items: center;
  margin-top: 40px;
  width: 285px;
}
.shade.chakan {
  height: 800px;
  width: 1600px;
}
.shade-bottom.chakan-bottom input {
  width: 200px;
}
.cityList ul {
  background: #fff;
}
.cityList ul li:hover {
  background: #ececec;
  color: #333;
}
.cityList ul li {
  width: 195px;
  height: 20px;
  border: 1px solid #a0a0a0;
  margin-top: -1px;
  box-sizing: border-box;
  text-indent: 5px;
  color: #979797;
}
.cityList {
  position: absolute;
  top: 220px;
  right: 19px;
}
.message span {
  background: #fff;
  color: #1b73b0;
}
.message {
  width: 200px;
  background: #fff;
  height: 80px;
  border-radius: 5px;
  justify-content: center;
  align-items: center;
  display: flex;
}
.chehui-bottom div span.no {
  border: 2px solid #1b73b0;
  background: #fff;
  color: #1b73b0;
  box-sizing: border-box;
}
.chehui-bottom div span.yes {
  background: #1b73b0;
  color: #fff;
  margin-right: 20px;
}
.chehui-bottom div span {
  width: 50px;
  display: inline-block;
  height: 25px;
  line-height: 25px;
  border-radius: 5px;
  cursor: pointer;
}
.chehui-bottom div {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: -15px;
}
.chehui .chehui-header i {
  display: inline-block;
  position: absolute;
  right: 8px;
  top: 3px;
  font-size: 20px;
  cursor: pointer;
}
.chehui .chehui-bottom {
  font-size: 14px;
  color: #333;
  height: 80px;
  line-height: 80px;
  text-align: center;
}
.chehui .chehui-header {
  position: relative;
  text-align: center;
  height: 30px;
  font-size: 14px;
  color: #fff;
  background: #1b73b0;
  line-height: 30px;
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
}
.chehui {
  width: 340px;
  height: 140px;
  background: #fff;
  border-radius: 5px;
}
.shadetow .colse {
  font-size: 30px;
  display: inline-block;
  position: absolute;
  top: 0;
  right: 14px;
  cursor: pointer;
}
.shadetow-bottom-bottom {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 48px;
}
.shadetow-bottom-bottom button {
  width: 151px;
  height: 35px;
  background: #1b73b0;
}
.shadetow-bottom-bottom i {
  display: inline-block;
  border-left: 2px solid #5e9cc7;
  height: 170px;
  margin: 0 30px;
}
.shadetow-bottom-bottom img {
  width: 201px;
  height: 201px;
}
.shadetow-bottom-top {
  margin-top: 10px;
}
.shadetow-bottom-top button {
  width: 151px;
  height: 35px;
  background: #1b73b0;
}
.shadetow-bottom-top input {
  width: 496px;
  height: 35px;
  margin-right: 12px;
}
.shadetow-top {
  border-bottom: 1px solid #aaa;
  padding: 0 12px 10px 12px;
}
.shadetow-top button {
  width: 92px;
  height: 35px;
  background: #1b73b0;
  margin-top: 22px;
}
.contanertow {
  margin: 0 26px;
}
.shadetow {
  width: 745px;
  height: 417px;
  background: #fff;
  position: relative;
  border-radius: 10px;
}
.shade-bottom form i {
  position: absolute;
  top: 7px;
  right: -38px;
  font-size: 30px;
  color: #2e2e2e;
  display: inline-block;
  cursor: pointer;
}
.shade-bottom form div .colse {
  background: #fff;
  border: 2px solid #1b73b0;
  color: #1b73b0;
  box-sizing: border-box;
}
.shade-bottom form div .confirm {
  background: #1b73b0;
}
.shade-bottom form div {
  display: flex;
  justify-content: center;
  margin-top: 25px;
}
button {
  border: none;
  outline: none;
  border-radius: 10px;
  font-size: 14px;
  color: #fff;
  cursor: pointer;
  box-sizing: border-box;
}
.shade-bottom form button {
  width: 111px;
  height: 35px;
}
.shade-bottom label.left {
  margin-left: 107px;
}
.select {
  width: 167px;
  height: 35px;
  outline: none;
  border-color: #c0c0c0;
  border-radius: 5px;
  appearance: none;
  background: url("../../assets/img/xiala/png24.png") no-repeat scroll right
    center transparent;
  padding-right: 28px;
  background-size: 10px 5px;
  font-size: 14px;
  background-position-x: 163px;
  margin-left: 26px;
  margin-top: 30px;
  text-indent: 5px;
}

/*  */
input {
  border: none;
  border: 1px solid #a0a0a0;
  outline: none;
  border-radius: 5px;
  text-indent: 5px;
  box-sizing: border-box;
}
.shade-bottom input {
  width: 625px;
  height: 35px;
  margin-top: 40px;
  margin-left: 20px;
}
.shade-bottom {
  font-size: 14px;
  color: #333;
}
.shade-top {
  padding-bottom: 10px;
  border-bottom: 1px solid #333;
}
.contaner {
  margin: 0 52px;
  position: relative;
}
.shade-top span {
  display: inline-block;
  width: 170px;
  height: 35px;
  background: #1b73b0;
  color: #fff;
  font-size: 14px;
  border-radius: 5px;
  text-align: center;
  line-height: 35px;
  margin-top: 24px;
  cursor: pointer;
}
.boxs {
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.3);
  position: absolute;
  top: 0;
  left: 0;
  z-index: 999;
  display: flex;
  justify-content: center;
  align-items: center;
}
.shade {
  width: 800px;
  height: 460px;
  background: #fff;
  border-radius: 10px;
  margin: 0 52px;
  position: relative;
}
</style>
