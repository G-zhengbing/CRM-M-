<template>
  <div class="box">
    <DaibanMessage v-if="show" :type="type" ref="message" />
    <header class="main-header">
      <ul>
        <li>
          <i></i>
          <span>首页</span>
        </li>
        <li>
          <i></i>
          <span>资源池</span>
        </li>
      </ul>
    </header>
    <section class="main-section">
      <div class="surplus">
        <div class="main-section-top">
          <div class="main-section-top-top">
            <form>
              <label>
                渠道:
                <select class="daiban-selected" v-model="form.refer">
                  <option v-for="(list,i) in refer" :key="i" :value="i">{{list}}</option>
                </select>
              </label>
              <label>
                学员姓名:
                <input type="text" v-model="form.name" />
              </label>
              <label>
                是否约课:
                <select class="daiban-selected" v-model="form.is_course">
                  <option value="1">未约课</option>
                  <option value="2">已约课</option>
                </select>
              </label>
              <label>
                学员电话:
                <input type="text" v-model="form.mobile" />
              </label>
              <button type="button" class="daiban-button" @click="seekKuhu">查询</button>
              <button type="button" class="daiban-button" @click="clear">清空</button>
            </form>
            <div class="handel">
              <div class="daiban-button fBtn" @click="allot" v-if="$store.state.cId == 1">
                <img style="width: 15px;" src="../../assets/img/fenpei/png24.png" alt />
                <i>|</i>
                <span>分配</span>
              </div>
              <!-- <button style="margin-left: 5px;" class="daiban-button dBtn">新建数据</button> -->
            </div>
          </div>
        </div>
        <div class="main-section-bottom">
          <div class="contaner">
            <div style="height:1px;"></div>
            <ul class="ul">
              <li @click="tab(1)" :class="[num == 1? 'active':'']">
                <span>待分配</span>
              </li>
              <li @click="tab(2)" :class="[num == 2? 'active':'']">
                <span>已分配</span>
              </li>
            </ul>
            <Table
              ref="table"
              :isChecked="isChecked"
              :columns="columns"
              :data="dataArr"
              :currentPage="currentPage"
              :total="total"
              :pageSize="pageSize"
              @selection-change="selectionChange"
              @childer1="getBtnClick1"
              @childer2="getBtnClick2"
              @childer3="getBtnClick3"
              @childer5="getBtnClick5"
              @childer4="getBtnClick4"
              @page-change="pageChange"
            />
          </div>
        </div>
      </div>
    </section>
    <Loading v-show="isLoading" />
  </div>
</template>

<script>
import Table from "../../uilt/table/TablePlus";
import { mapState, mapActions, mapMutations, mapGetters } from "vuex";
import DaibanMessage from "../../uilt/newErweima/DaibanMessage";
import storage from "../../uilt/storage";
import Loading from "../../uilt/loading/loading";
export default {
  mounted() {
    this.setCurrentPage(1);
    this.setStatus();
    this.isLoading = true;
    if (storage.getTabStatus() == null) {
      this.num = 1;
      this.setStatusNum(1);
    } else {
      this.num = storage.getTabStatus();
      this.setStatusNum(storage.getTabStatus());
    }
    this.getKehuList({ status: this.num }).then(res => {
      this.isLoading = false;
    });
  },
  components: {
    Table,
    DaibanMessage,
    Loading
  },
  data() {
    return {
      TableCheckedAll:'',
      isChecked: true, //控制表格组件的全选
      isLoading: false,
      num: storage.getTabStatus(),
      columns: [
        { type: "selection" },
        { type: "学员电话", key: "mobile" },
        { type: "在读学校", key: "school" },
        { type: "年级", key: "grade" },
        { type: "科目", key: "subject" },
        { type: "跟进状态", key: "follow_status" },
        { type: "跟进人", key: "follow_sale_name" },
        { type: "约课状态", key: "is_course" },
        { type: "意向度", key: "intention_option" },
        { type: "创建时间", key: "create_time" },
        {
          type: "action",
          title: "操作",
          buttons: [{ text: "查看", type: "info" }]
        }
      ],
      show: false,
      checkall: [],
      cid: [],
      type: {
        page: 1,
        text: ""
      },
      form: {}
    };
  },
  methods: {
    ...mapMutations([
      "setCurrentPage",
      "setXiansuoId",
      "setGenjinType",
      "setStatusNum"
    ]),
    ...mapActions(["getKehuList", "getFenpeiList", "RingUp"]),
    clear() {
      this.form = {};
    },
    seekKuhu() {
      let page = 1;
      this.isLoading = true;
      this.getKehuList({ status: this.num, form: this.form, page }).then(
        res => {
          this.isLoading = false;
          this.setCurrentPage(page);
        }
      );
    },
    allot() {
      this.type.classify = "shade";
      if (this.checkall.length > 0) {
        this.show = true;
      }
    },
    pageChange(num) {
      this.isLoading = true;
      this.setCurrentPage(num);
      this.getKehuList({ status: this.num, form: this.form }).then(res => {
        this.isLoading = false;
      });
    },
    getBtnClick1(item) {
      this.show = true;
      this.type.classify = "datalis";
      this.type.data = { ...item };
    },
    getBtnClick2(item) {
      this.show = true;
      this.type.classify = "shiftOut";
      this.type.data = { ...item };
    },
    getBtnClick3(item) {
      this.setGenjinType(item);
      this.show = true;
      this.type.classify = "followUp";
      this.type.data = { ...this.Types };
    },
    getBtnClick4(item) {
      this.isLoading = true;
      this.show = true;
      this.type.classify = "huchu";
      this.RingUp(item)
        .then(res => {
          if (res.data.code == 200) {
            this.type.text = "呼出成功";
            this.type.ringup = true;
          }
          if (res.data.code == 1000) {
            this.type.ringup = false;
            this.type.text = res.data.error;
          }
          this.isLoading = false;
        })
        .catch(e => {
          if (e) {
            this.isLoading = false;
          }
        });
    },
    getBtnClick5(item) {
      this.show = true;
      this.type.classify = "dingdan";
      this.type.data = { ...item };
    },
    selectionChange(item) {
      console.log(item)
      this.TableCheckedAll = this.$refs.table.checkedAll
      this.cid.length = 0
      let arr = [];
      this.checkall = item;
      for (var i = 0; i < item.length; i++) {
        arr.push(item[i].id);
      }
      this.setXiansuoId(arr);
    },
    tab(num) {
      this.isLoading = true;
      storage.saveTabStatus(num);
      this.num = num;
      this.setStatusNum(num);
      this.setCurrentPage(1);
      this.setStatus();
      this.getKehuList({ status: this.num }).then(res => {
        this.isLoading = false;
      });
      this.TableCheckedAll.length = 0
    },
    setStatus() {
      for (var i = 0; i < this.columns.length; i++) {
        if (this.num == 1 || this.num == null) {
          this.columns[i].buttons = [{ text: "查看", type: "info" }];
        } else if (this.$store.state.cId == 1) {
          this.columns[i].buttons = [
            { text: "订单", type: "primary" },
            { text: "移出", type: "danger" },
            { text: "跟进", type: "warning" },
            { text: "查看", type: "info" },
            { text: "呼出", type: "link" }
          ];
        } else {
          this.columns[i].buttons = [
            { text: "订单", type: "primary" },
            { text: "跟进", type: "warning" },
            { text: "查看", type: "info" },
            { text: "呼出", type: "link" }
          ];
        }
      }
    }
  },
  computed: {
    ...mapState({
      data: state => state.daiban.data,
      refer: state => state.daiban.refer,
      currentPage: state => state.daiban.currentPage,
      total: state => state.daiban.total,
      pageSize: state => state.daiban.pageSize,
      status: state => state.daiban.status
    }),
    ...mapGetters(["dataArr", "Types"])
  }
};
</script>
<style scoped>
.handel {
  display: flex;
  margin-top: 10px;
}
.daiban-button.fBtn i {
  display: inline-block;
  margin: 0 5px;
}
.daiban-button.fBtn {
  display: flex;
  justify-content: center;
  align-items: center;
}
.main-section-bottom ul.ul li {
  width: 100px;
  height: 30px;
  box-sizing: border-box;
  text-align: center;
  line-height: 30px;
  font-size: 14px;
  cursor: pointer;
  flex: 1;
}
.main-section-bottom ul.ul {
  display: flex;
  border: 1px solid #1b73b0;
  width: 200px;
  border-radius: 5px;
  margin: 10px 0;
}
.main-section-bottom ul.ul li span {
  color: #1b73b0;
}
ul.ul li.active {
  background-color: #1b73b0;
  color: #fff;
}
ul.ul li.active span {
  color: #fff;
}
</style>