<template>
  <div class="box">
    <header class="main-header">
      <ul>
        <li @click="goHome">
          <i></i>
          <span>首页</span>
        </li>
        <li>
          <i></i>
          <span>逾期未回访</span>
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
                  <option :value="i" v-for="(list,i) in refer" :key="i">{{list}}</option>
                </select>
              </label>
              <label>
                学员姓名:
                <input type="text" v-model="form.name" />
              </label>
              <label>
                是否约课:
                <select class="daiban-selected" v-model="form.is_course">
                  <option value="已约课">已约课</option>
                  <option value="未约课">未约课</option>
                </select>
              </label>
              <label>
                学员电话:
                <input type="text" v-model="form.mobile" />
              </label>
              <button type="button" class="daiban-button" @click="seekClick">查询</button>
              <button type="button" class="daiban-button" @click="clear">清空</button>
            </form>
          </div>
        </div>
        <div class="main-section-bottom">
          <div class="contaner">
            <div style="height:1px;"></div>
            <Table
              :columns="columns"
              :data="notCallBackData"
              :currentPage="currentPage"
              :total="total"
              :pageSize="pageSize"
              @selection-change="selectionChange"
              @childer1="getBtnClick1"
              @childer3="getBtnClick3"
              @page-change="pageChange"
            />
          </div>
        </div>
      </div>
    </section>
    <Loading v-show="isLoading" />
    <DaibanMessage :type="type" v-if="show" />
  </div>
</template>

<script>
import { mapState, mapActions, mapGetters, mapMutations } from "vuex";
import Table from "../uilt/table/TablePlus";
import Loading from "../uilt/loading/loading";
import DaibanMessage from "../uilt/newErweima/DaibanMessage";
export default {
  components: {
    Table,
    Loading,
    DaibanMessage
  },
  mounted() {
    this.setCurrentPage(1);
    this.isLoading = true;
    this.getYuQiList().then(res => {
      this.isLoading = false;
    });
  },
  computed: {
    ...mapGetters(["notCallBackData", "notcallbackTypes"]),
    ...mapState({
      data: state => state.notcallback.yuqiList,
      refer: state => state.notcallback.refer,
      currentPage: state => state.notcallback.currentPage,
      total: state => state.notcallback.total,
      pageSize: state => state.notcallback.pageSize
    })
  },
  data() {
    return {
      show: false,
      type: {
        status: "notcallback"
      },
      isLoading: false,
      form: {},
      columns: [
        { type: "selection" },
        { type: "学员电话", key: "mobile" },
        { type: "在读学校", key: "school" },
        { type: "年级", key: "grade" },
        { type: "科目", key: "subject" },
        { type: "跟进人", key: "follow_sale_name" },
        { type: "约课状态", key: "is_course" },
        { type: "意向度", key: "intention_option" },
        { type: "创建时间", key: "create_time" },
        { type: "下次跟进时间", key: "next_follow_time" },
        {
          type: "action",
          title: "操作",
          buttons: [
            { text: "查看", type: "info" },
            { text: "跟进", type: "warning" }
          ]
        }
      ]
    };
  },
  methods: {
    ...mapMutations(["setNotCallBackTyps", "setCurrentPage"]),
    ...mapActions(["getYuQiList"]),
    goHome() {
      this.$router.push("/main/home");
    },
    clear() {
      this.form = {};
    },
    //查询
    seekClick() {
      let page = 1;
      let currentPage = this.currentPage;
      if (currentPage > 1) {
        this.setCurrentPage(page);
      }
      this.isLoading = true;
      this.getYuQiList({ ...this.form, page }).then(res => {
        this.isLoading = false;
        this.setCurrentPage(page);
      });
    },
    selectionChange() {},
    getBtnClick1(item) {
      this.show = true;
      this.type.classify = "datalis";
      this.type.data = { ...item };
    },
    getBtnClick3(item) {
      // this.$router.push("/main/daiban");
      this.setNotCallBackTyps(item);
      this.show = true;
      this.type.classify = "followUp";
      this.type.data = { ...this.notcallbackTypes };
    },
    pageChange(num) {
      this.isLoading = true;
      this.setCurrentPage(num);
      this.getYuQiList({ ...this.form }).then(res => {
        this.isLoading = false;
        this.setCurrentPage(num);
      });
    }
  }
};
</script>
