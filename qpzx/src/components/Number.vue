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
          <span>成单数</span>
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
              :data="numberData"
              :currentPage="currentPage"
              :total="total"
              :pageSize="pageSize"
              @selection-change="selectionChange"
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
export default {
  components: {
    Table,
    Loading
  },
  mounted() {
    this.setCurrentPage(1);
    this.isLoading = true;
    this.getMoneyNumberList().then(res => {
      this.isLoading = false;
    });
  },
  computed: {
    ...mapGetters(["numberData"]),
    ...mapState({
      data: state => state.number.moneynumber,
      refer: state => state.number.refer,
      currentPage: state => state.number.currentPage,
      total: state => state.number.total,
      pageSize: state => state.number.pageSize
    })
  },
  data() {
    return {
      form: {},
      isLoading: false,
      columns: [
        { type: "订单号", key: "order_sn" },
        { type: "学员姓名", key: "student_name" },
        { type: "渠道", key: "refer" },
        { type: "学员电话", key: "mobile" },
        { type: "在读学校", key: "school" },
        { type: "年级", key: "grade" },
        { type: "科目", key: "subject" },
        { type: "销售", key: "sale_name" },
        { type: "下单金额", key: "pay_amount" },
        { type: "创建时间", key: "create_time" }
      ]
    };
  },
  methods: {
    ...mapActions(["getMoneyNumberList"]),
    ...mapMutations(["setCurrentPage"]),
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
      this.getMoneyNumberList({ ...this.form, page }).then(res => {
        this.isLoading = false;
        this.setCurrentPage(page);
      });
    },
    selectionChange() {},
    //分页
    pageChange(num) {
      this.isLoading = true;
      this.setCurrentPage(num);
      this.getMoneyNumberList({...this.form}).then(res => {
        this.isLoading = false;
        this.setCurrentPage(num);
      });
    }
  }
};
</script>
