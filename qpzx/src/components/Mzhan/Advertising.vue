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
          <span>广告管理</span>
        </li>
      </ul>
    </header>
    <section class="main-section">
      <div class="surplus">
        <div class="main-section-top">
          <div class="main-section-top-top">
            <form>
              <label>
                广告名称:
                <input type="text" v-model="title" />
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
                <button class="btn" @click="addAd">新建广告</button>
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
    <AdMessage v-if="isAdMessage" />
  </div>
</template>

<script>
import AdMessage from "../Advertising/AdMessage";
import { mapActions, mapState, mapMutations } from "vuex";
export default {
  components: {
    AdMessage
  },
  mounted() {
    this.getAdverList();
    setTimeout(() => {
      let arr = this.$store.state.advertising.adverList;
      for (var i = 0; i < arr.length; i++) {
        if (arr[i].status == 1) {
          arr[i].status = true;
        } else {
          arr[i].status = false;
        }
      }
    }, 1000);
  },
  data() {
    return {
      columns2: [
        {
          type: "selection",
          width: 60,
          align: "center"
        },
        {
          title: "广告名称",
          key: "title",
          align: "center"
        },
        {
          title: "缩略图",
          key: "banner_pic",
          align: "center",
          render: (h, params) => {
            return h("img", {
              style: {
                //设置样式
                width: "100px",
                height: "80px",
                "margin-top": "5px",
                "border-radius": "5%"
              },
              attrs: {
                //设置属性
                src: "../../assets/logo.png"
              }
            });
          }
        },
        {
          title: "跳转链接",
          key: "link_url",
          align: "center"
        },
        {
          title: "创建时间",
          key: "create_time",
          align: "center"
        },
        {
          title: "排序",
          key: "sort",
          align: "center"
        },
        {
          title: "启用/隐藏",
          align: "center",
          render: (h, params) => {
            // 重点
            let _this = this;
            return h("i-switch", {
              //按钮的话是：button自行替换
              props: {
                type: "启用/隐藏",
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
      ],
      title: "",
      checkAll: [],
      isAdMessage: false,
      form: {}
    };
  },
  computed: {
    ...mapState({
      data: state => state.advertising.adverList,
      currentPage: state => state.advertising.currentPage,
      pageSize: state => state.advertising.pageSize,
      total: state => state.advertising.total
    })
  },
  methods: {
    ...mapActions(["getAdverList", "deleAdverList", "setSwitch"]),
    ...mapMutations(["setCurrerntPage"]),
    functionFun(val, params) {
      this.setSwitch(params);
    },
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
    //编辑
    getBtnClick1(item) {
      this.isAdMessage = true;
      console.log(item);
    },
    //删除
    getBtnClick2(item) {
      this.$Modal.confirm({
        title: "温馨提示",
        content: "<p>确定要删除该条记录吗?</p>",
        onOk: () => {
          this.deleAdverList([item.id]).then(res => {
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
      this.isAdMessage = true;
    },
    clear() {
      this.title = "";
    },
    seekKuhu() {
      this.getAdverList(this.title).then(res => {
        this.setCurrerntPage(1);
      });
    },
    selectionChange(item) {
      console.log(item);
      var arr = [];
      for (var i = 0; i < item.length; i++) {
        arr.push(item[i].id);
      }
      this.checkAll = arr;
    },
    pageChange() {}
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