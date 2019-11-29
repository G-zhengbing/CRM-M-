<template>
  <div class="box">
    <DaibanMessage v-if="show" :type="type" />
    <header class="main-header">
      <ul>
        <li @click="goHome">
          <i></i>
          <span>首页</span>
        </li>
        <li>
          <i></i>
          <span>公共资源池</span>
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
          </div>
        </div>
        <div class="main-section-bottom">
          <div class="contaner">
            <div style="height:1px;"></div>
            <Table
              :columns="columns"
              :data="puliceData"
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
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations, mapGetters } from "vuex";
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
    this.columns.map(i => {
      if (this.$store.state.cId == 2) {
        return (i.buttons = [
          { text: "查看", type: "info" },
          { text: "移入", type: "warning" }
        ]);
      }
    });
    this.isLoading = true;
    this.getPublicList().then(res => {
      this.isLoading = false;
    });
  },
  data() {
    return {
      type: {
        page: 1
      },
      show: false,
      isLoading: false,
      form: {},
      columns: [
        { type: "selection" },
        { type: "学员电话", key: "mobile" },
        { type: "在读学校", key: "school" },
        { type: "年级", key: "grade" },
        { type: "科目", key: "subject" },
        { type: "渠道", key: "refer" },
        { type: "跟进人", key: "follow_sale_name" },
        { type: "意向度", key: "intention_option" },
        { type: "约课状态", key: "is_course" },
        { type: "约课时间", key: "class_date" },
        { type: "创建时间", key: "create_time" },
        {
          type: "action",
          title: "操作",
          buttons: [{ text: "查看", type: "info" }]
        }
      ]
    };
  },
  methods: {
    goHome() {
      this.$router.push("/main/home");
    },
    clear() {
      this.form = {};
    },
    seekKuhu() {
      let page = 1;
      let currentPage = this.currentPage;
      if (currentPage > 1) {
        this.setCurrentPage(1);
      }
      this.isLoading = true;
      this.getPublicList({ ...this.form, page }).then(res => {
        this.isLoading = false;
      });
      this.setCurrentPage(page);
    },
    ...mapActions(["getPublicList"]),
    ...mapMutations(["setCurrentPage"]),
    selectionChange() {},
    getBtnClick1(item) {
      this.show = true;
      this.type.classify = "datalis";
      this.type.data = { ...item };
    },
    getBtnClick3(item) {
      this.show = true;
      this.type.classify = "shiftTo";
      this.type.data = { ...item };
    },
    pageChange(num) {
      this.isLoading = true;
      this.setCurrentPage(num);
      this.getPublicList({ ...this.form }).then(res => {
        this.isLoading = false;
        // this.setCurrentPage(num);
      });
    }
  },
  computed: {
    ...mapGetters(["puliceData"]),
    ...mapState({
      data: state => state.publics.publicList,
      refer: state => state.publics.refer,
      currentPage: state => state.daiban.currentPage,
      total: state => state.daiban.total,
      pageSize: state => state.daiban.pageSize
    })
  }
};
</script>
