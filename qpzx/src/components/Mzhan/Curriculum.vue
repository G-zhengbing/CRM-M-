<template>
  <div class="box">
    <header class="main-header">
      <ul>
        <li>
          <i></i>
          <span>M站后台</span>
        </li>
        <li class="active">
          <i></i>
          <span>课程管理</span>
        </li>
      </ul>
    </header>
    <section class="main-section">
      <div class="surplus">
        <div class="main-section-top">
          <div class="main-section-top-top">
            <form>
              <label>
                课程名称:
                <input type="text" v-model="title" />
                 <label>
                课程类型:
                <Select v-model="form.kemu" style="width:200px">
                  <Option
                    v-for="item in cityList"
                    :value="item.value"
                    :key="item.value"
                  >{{ item.label }}</Option>
                </Select>
              </label>
              <label>
                科目:
                <Select v-model="form.nianji" style="width:200px">
                  <Option
                    v-for="item in cityList"
                    :value="item.value"
                    :key="item.value"
                  >{{ item.label }}</Option>
                </Select>
              </label>
              <label>
                年级:
                <Select v-model="form.nianji" style="width:200px">
                  <Option
                    v-for="item in cityList"
                    :value="item.value"
                    :key="item.value"
                  >{{ item.label }}</Option>
                </Select>
              </label>
              </label>
              <button type="button" class="daiban-button" @click="seekKuhu">查询</button>
              <button type="button" class="daiban-button" @click="clear">清空</button>
            </form>
          </div>
        </div>
        <div class="main-section-bottom">
          <div class="contaner">
            <div style="height:1px;"></div>
            <div class="batch">
              <div class="batch-let">
                <button class="btn" @click="isDele">批量删除</button>
              </div>
              <div class="batch-right">
                <button class="btn" @click="addAd">新建课程</button>
                <Select style="width:100px" placeholder="排序方式">
                  <Option value="1">{{ 1 }}</Option>
                </Select>
              </div>
            </div>
            <Table border :columns="columns2" :data="data" @on-selection-change="selectionChange"></Table>
            <Page
              :total="total"
              :current="currentPage"
              :page-size="pageSize"
              show-elevator
              class="ive-page"
            />
          </div>
        </div>
      </div>
    </section>
    <CurrMessage v-if="isCurrMessage" />
  </div>
</template>

<script>
import CurrMessage from "../curriculum/CurrMessage";
import { mapActions, mapState, mapMutations } from "vuex";
export default {
  components: {
    CurrMessage
  },
  mounted() {
    this.getCurrList();
  },
  data() {
    return {
      cityList:[],
      title: "",
      checkAll: [],
      isCurrMessage: false,
      form: {},
      height: "height",
      columns2: [
        {
          type: "selection",
          width: 60,
          align: "center"
        },
        {
          title: "课程名称",
          key: "title",
          align: "center"
        },
        {
          title: "类型",
          key: "link_url",
          align: "center"
        },
        {
          title: "科目",
          key: "create_time",
          align: "center"
        },
        {
          title: "年级",
          key: "sort",
          align: "center"
        },
        {
          title: "课节数",
          key: "sort",
          align: "center"
        },
        {
          title: "售价",
          key: "sort",
          align: "center"
        },
        {
          title: "活动价",
          key: "sort",
          align: "center"
        },
        {
          title: "是否首页展示",
          align: "center",
          render: (h, params) => {
            // 重点
            let _this = this;
            return h("i-switch", {
              //按钮的话是：button自行替换
              props: {
                type: "是否首页展示",
                //这里可以设置它的属性
                value: params.row.status == 1? true : false //设置它的值比如：true或false
              },
              on: {
                //操作事件
                input: function(event) {
                  //这里会起到监听的作用
                  if (event) {
                    params.row.status = true;
                  } else {
                    params.row.status = false;
                  }
                },
                "on-change": function(val) {
                  //值发生了改变调用方法
                  _this.functionFun(val, params.row); // 方法自定义
                }
              },
              scopedSlots: {
                open: () => h("span", "启用"),
                close: () => h("span", "隐藏")
              }
            });
          }
        },
        {
          title: "操作",
          key: "action",
          align: "center",
          width:200,
          render: (h, params) => {
            return h("div", [
              h(
                "Button",
                {
                  props: {
                    type: "text",
                    size: "small"
                  },
                  on: {
                    click: () => {
                      this.getBtnClick1(params.row);
                    }
                  }
                },
                "下架"
              ),
              h(
                "Button",
                {
                  props: {
                    type: "text",
                    size: "small"
                  },
                  on: {
                    click: () => {
                      this.getBtnClick2(params.row);
                    }
                  }
                },
                "编辑"
              ),
              h(
                "Button",
                {
                  props: {
                    type: "text",
                    size: "small"
                  },
                  on: {
                    click: () => {
                      this.getBtnClick3(params.row);
                    }
                  }
                },
                "删除"
              )
            ]);
          }
        }
      ]
    };
  },
  computed: {
    ...mapState({
      data: state => state.curriculum.currlList,
      currentPage: state => state.curriculum.currentPage,
      pageSize: state => state.curriculum.pageSize,
      total: state => state.curriculum.total
    })
  },
  methods: {
    ...mapActions(["getCurrList"]),
    ...mapMutations(["setCurrerntPage"]),
    //批量删除
    isDele() {
      if (this.checkAll.length > 0) {
        this.$Modal.confirm({
          title: "温馨提示",
          content: "<p>确定要进行批量删除操作吗?</p>",
          onOk: () => {
            this.deleAdverList(this.checkAll).then(res => {
              if (res.data.code == 200) {
                this.$Message.success("删除成功！");
              }
            });
          }
        });
      }
      return;
    },
    //下架
    getBtnClick1(item) {
      console.log(item)
    },
    //编辑
    getBtnClick2(item) {
      this.isCurrMessage = true;
      console.log(item);
    },
    //删除
    getBtnClick3(item){
      this.$Modal.confirm({
        title: "温馨提示",
        content: "<p>确定要删除该条记录吗?</p>",
        onOk: () => {
          this.deleAdverList(item.id).then(res => {
            if (res.data.code == 200) {
              this.$Message.success("删除成功！");
            }
          });
        }
      });
      console.log(item);
    },
    //新建广告
    addAd() {
      this.isCurrMessage = true;
    },
    clear() {
      this.title = "";
    },
    seekKuhu() {
      this.getCurrList(this.title).then(res => {
        this.setCurrerntPage(1);
      });
    },
    selectionChange(item) {
      var arr = [];
      for (var i = 0; i < item.length; i++) {
        arr.push(item[i].id);
      }
      this.checkAll = arr;
    },
    pageChange() {},
    setSwitch(status) {
      console.log(status);
    }
  }
};
</script>
<style scoped>
.ivu-page-options-elevator input {
  height: 22px;
}
.ive-page {
  float: right;
  margin: 30px 0;
}
form label{
  margin-right: 30px;
}
.ivu-input-wrapper{
  width: 150px!important;
}
.ivu-select.ivu-select-single.ivu-select-default {
  margin-left: 15px;
}
.batch-let {
  flex: 1;
}
.batch {
  display: flex;
  margin: 15px 0;
}
.btn {
  width: 100px;
  height: 30px;
  color: #fff;
  font-size: 14px;
  background: #1b73b0;
  outline: none;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}
</style>