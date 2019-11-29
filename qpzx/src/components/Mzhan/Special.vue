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
          <span>专题管理</span>
        </li>
      </ul>
    </header>
    <section class="main-section">
      <div class="surplus">
        <div class="main-section-top">
          <div class="main-section-top-top">
            <form>
              <label>
                专题标题:
                <input type="text" v-model="form.title" />
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
                <button class="btn" @click="addAd">新建专题</button>
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
    <SpeMessage v-if="isSpeMessage" />
  </div>
</template>

<script>
import SpeMessage from "../Special/SpeMessage";
import { mapActions, mapState } from "vuex";
export default {
  components: {
    SpeMessage
  },
  mounted() {
    this.getSpecialList();
  },
  computed: {
    ...mapState({
      data: state => state.special.specialList,
      currentPage: state => state.special.currentPage,
      pageSize: state => state.special.pageSize,
      total: state => state.special.total
    })
  },
  data() {
    return {
      isUpdata:false,
      checkAll: [],
      isSpeMessage: false,
      form: {},
      height: "height",
      columns2: [
        {
          type: "selection",
          width: 60,
          align: "center"
        },
        {
          title: "标题",
          key: "title",
          align: "center"
        },
        {
          title: "副标题",
          key: "subtitle",
          align: "center"
        },
        {
          title: "缩略图",
          key: "event_pic",
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
          title: "点赞数",
          key: "thumbs_num",
          align: "center"
        },
        {
          title: "阅读数",
          key: "sort",
          align: "view_num"
        },
        {
          title: "上线/下线",
          align: "center",
          render: (h, params) => {
            // 重点
            let _this = this;
            return h("i-switch", {
              //按钮的话是：button自行替换
              props: {
                type: "启用/隐藏",
                //这里可以设置它的属性
                value: params.row.status == 1 ? true : false //设置它的值比如：true或false
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
      ]
    };
  },
  methods: {
    ...mapActions(["getSpecialList", "deleSpecialList","setSpSwitch"]),
    functionFun(val, params) {
      this.setSpSwitch(params);
    },
    //批量删除
    isDele() {
      if (this.checkAll.length > 0) {
        this.$Modal.confirm({
          title: "温馨提示",
          content: "<p>确定要进行批量删除操作吗?</p>",
          onOk: () => {
            this.deleSpecialList(this.checkAll).then(res => {
              console.log(res);
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
      this.isUpdata = true
      this.isSpeMessage = true;
      console.log(item);
    },
    //删除
    getBtnClick2(item) {
      this.$Modal.confirm({
        title: "温馨提示",
        content: "<p>确定要删除该条记录吗?</p>",
        onOk: () => {
          this.deleSpecialList([item.id]).then(res => {
            if (res.data.code == 200) {
              this.$Message.success("删除成功！");
            }
          });
        }
      });
    },
    //新建广告
    addAd() {
      this.isUpdata = false
      this.isSpeMessage = true;
    },
    clear() {
      this.form = {};
    },
    seekKuhu() {
      this.getSpecialList(this.form.title)
    },
    selectionChange(item) {
      var arr = [];
      for (var i = 0; i < item.length; i++) {
        arr.push(item[i].id);
      }
      this.checkAll = arr;
    },
    pageChange() {},
    setSwitch(num) {
      console.log(num);
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