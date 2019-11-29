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
          <span>资料管理</span>
        </li>
      </ul>
    </header>
    <section class="main-section">
      <div class="surplus">
        <div class="main-section-top">
          <div class="main-section-top-top">
            <form>
              <label>
                资料名称:
                <Input v-model="form.title" placeholder="请输入资料名称" style="width: 300px" />
              </label>
              <label>
                科目:
                <Select v-model="form.kemu" style="width:200px">
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
                <button class="btn" @click="addAd">新建资料</button>
                <Select style="width:100px" placeholder="排序方式">
                  <Option value="1">{{ 1 }}</Option>
                </Select>
              </div>
            </div>
            <Table border :columns="columns2" :data="data" @on-selection-change="selectionChange"></Table>
            <Page
              @on-change="pageChange"
              :total="total"
              :current="currentPage"
              :page-size="pageSize"
              show-total
              show-elevator
              class="ive-page"
            />
          </div>
        </div>
      </div>
    </section>
    <DataMessage v-if="isDataMessage" ref="datamessage" :item="item"/>
  </div>
</template>

<script>
import DataMessage from "../databank/DataMessage";
import { mapActions, mapState, mapMutations } from "vuex";
export default {
  components: {
    DataMessage
  },
  mounted() {
    this.getDatabankList();
  },
  data() {
    return {
      item:{},
      isUpdata: false,
      cityList: [],
      title: "",
      checkAll: [],
      isDataMessage: false,
      form: {},
      height: "height",
      columns2: [
        {
          type: "selection",
          width: 60,
          align: "center"
        },
        {
          title: "资料名称",
          key: "materials_name",
          align: "center"
        },
        {
          title: "科目",
          key: "subject",
          align: "center"
        },
        {
          title: "年级",
          key: "grade",
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
                value: params.row.is_hot == 1 ? true : false //设置它的值比如：true或false
              },
              on: {
                //操作事件
                input: function(event) {
                  //这里会起到监听的作用
                  if (event) {
                    params.row.is_hot = true;
                  } else {
                    params.row.is_hot = false;
                  }
                },
                "on-change": function(val) {
                  //值发生了改变调用方法
                  _this.functionFun(val, params.row); // 方法自定义
                }
              },
              scopedSlots: {
                open: () => h("span", "ON"),
                close: () => h("span", "OFF")
              }
            });
          }
        },
        {
          title: "操作",
          key: "action",
          align: "center",
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
                      this.getBtnClick2(params.row);
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
      data: state => state.databank.databanklList,
      currentPage: state => state.databank.currentPage,
      pageSize: state => state.databank.pageSize,
      total: state => state.databank.total
    })
  },
  methods: {
    ...mapActions(["getDatabankList", "deleDataList", "setDaSwitch"]),
    ...mapMutations(["setCurrerntPage"]),
    //分页
    pageChange(num){
      this.setCurrerntPage(num)
      this.getDatabankList({page:num})
      console.log(num)
      console.log(this.currentPage)
    },
    //是否首页展示
    functionFun(val, params) {
      this.setDaSwitch(params);
    },
    //批量删除
    isDele() {
      if (this.checkAll.length > 0) {
        this.$Modal.confirm({
          title: "温馨提示",
          content: "<p>确定要进行批量删除操作吗?</p>",
          onOk: () => {
            this.deleDataList(this.checkAll).then(res => {
              if (res.data.code == 200) {
                this.$Message.success("删除成功！");
              }
            });
          }
        });
      }
      return;
    },
    //编辑
    getBtnClick1(item) {
      this.isUpdata = true;
      this.isDataMessage = true;
      this.item = {...item}
    },
    //删除
    getBtnClick2(item) {
      this.$Modal.confirm({
        title: "温馨提示",
        content: "<p>确定要删除该条记录吗?</p>",
        onOk: () => {
          this.deleDataList([item.id]).then(res => {
            if (res.data.code == 200) {
              this.$Message.success("删除成功！");
            }
          });
        }
      });
    },
    //新建广告
    addAd() {
      this.item = {is_hot: '1'}
      this.isUpdata = false;
      this.isDataMessage = true;
    },
    clear() {
      this.title = "";
    },
    seekKuhu() {
      this.getDatabankList(this.title).then(res => {
        this.setCurrerntPage(1);
      });
    },
    selectionChange(item) {
      var arr = [];
      for (var i = 0; i < item.length; i++) {
        arr.push(item[i].id);
      }
      this.checkAll = arr;
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
form label {
  margin-right: 30px;
}
.ivu-input-wrapper {
  width: 150px !important;
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