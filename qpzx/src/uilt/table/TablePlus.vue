<template>
  <div class="box">
    <table :class="{important:height == 'height'}">
      <thead>
        <tr>
          <th v-for="(column,i) in columns" :key="i" :class="{link:column.key == 'link_url'|| column.class == 'special'}">
            <template v-if="column.type == 'selection'">
              <input type="checkbox" v-model="checkbox" @click="selectAll($event)" />
            </template>
            <template v-else-if="column.type == 'index'">{{column.key}}</template>
            <template v-else>
              <div class="handel" v-if="column.title">{{column.title}}</div>
              <div v-else>{{column.type}}</div>
            </template>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr style="width:100%;" v-if="data.length ==0">
          <td>
            <template>暂无数据</template>
          </td>
        </tr>
        <tr v-for="(item,i) in data" :key="i" v-else>
          <td
            v-for="(column,s) in columns"
            :key="s"
            :class="{handel:column.title,link:column.key == 'link_url' || column.class == 'special',image:column.key == 'banner_pic'}"
          >
            <template v-if="column.type == 'selection'">
              <input type="checkbox" :value="item" v-model="checkedAll" />
            </template>
            <template v-else-if="column.type == 'index'">{{i+1}}</template>
            <template v-else-if="column.key == 'img'">
              <img :src="item.img" alt />
            </template>
            <template v-else-if="column.style == 'switch'">
              <i-switch size="large" @on-change="setSwitch">
                <span slot="open">启用</span>
                <span slot="close">隐藏</span>
              </i-switch>
            </template>
            <template v-else-if="column.type == 'action'">
              <template>
                <Btn
                  v-for="(items,q) in column.buttons"
                  :key="q"
                  :type="items.type"
                  @click="childer(item,items.type)"
                >{{items.text}}</Btn>
              </template>
            </template>
            <template v-else>{{item[column.key]}}</template>
          </td>
        </tr>
      </tbody>
    </table>
    <PageSize
      v-if="total != 0"
      style="margin-left: -195px;"
      class="pagesize"
      :total="total"
      :currentPage="currentPage"
      :pageSize="pageSize"
      @on-change="getPage"
    />
  </div>
</template>

<script>
import Btn from "./ZxBtn";
import PageSize from "./PageSize";
export default {
  components: {
    PageSize,
    Btn
  },
  props: [
    "columns",
    "data",
    "currentPage",
    "total",
    "pageSize",
    "isChecked",
    "height"
  ],
  data() {
    return {
      switch:1,
      checkbox: false,
      checkedAll: []
    };
  },
  methods: {
    selectAll(e) {
      if (e.target.checked) {
        this.checkedAll = [...this.data];
      } else {
        this.checkedAll.length = 0;
      }
    },
    getPage(num) {
      this.$emit("page-change", num);
    },
    childer(item, type) {
      if (type == "info") {
        this.childer1(item);
      } else if (type == "danger") {
        this.childer2(item);
      } else if (type == "link") {
        this.childer4(item);
      } else if (type == "primary") {
        this.childer5(item);
      } else {
        this.childer3(item);
      }
    },
    childer1(item) {
      this.$emit("childer1", item);
    },
    childer2(item) {
      this.$emit("childer2", item);
    },
    childer3(item) {
      this.$emit("childer3", item);
    },
    childer4(item) {
      this.$emit("childer4", item);
    },
    childer5(item) {
      this.$emit("childer5", item);
    },
    setSwitch(num){
      this.$emit("setSwitch",num)
    }
  },
  watch: {
    checkedAll() {
      if (this.checkedAll.length == this.data.length) {
        this.checkbox = true;
      } else {
        this.checkbox = false;
      }
      this.$emit("selection-change", this.checkedAll);
    },
    isChecked() {
      if (!this.isChecked) this.checkbox = false;
    }
  }
};
</script>

<style scoped>
.image{
  overflow: hidden;
}
.ivu-switch{
  box-sizing: border-box;
  line-height: 22px;
}
.important tbody tr td{
  max-width: 176px;
}
.important tbody tr {
  height: 75px;
  line-height: 75px;
  justify-content: center;
}
table tbody tr td img {
  width: 70px;
}
table tr .link {
  min-width: 346px;
}
label .box table tbody tr {
  width: 100% !important;
}
label .box table thead tr {
  width: 100% !important;
}
::-webkit-scrollbar {
  width: 100px;
  height: 15px;
  background-color: #eeeeee;
}
::-webkit-scrollbar-thumb {
  border-radius: 15px;
  background: #bfbfbf;
  background-color: rgba(0, 0, 0, 0.1);
}
/*  */
.handel {
  position: absolute;
  right: 0;
  border-bottom: 1px solid #ccc;
  padding: 1px;
  background: #fff;
  z-index: 99;
  min-width: 176px;
}
.box {
  position: relative;
}
.pagesize {
  position: absolute;
  bottom: 17px;
  left: 50%;
  margin-left: -195px;
}
table input[type="checkbox"] {
  width: 15px;
  height: 15px;
  display: inline-block;
  text-align: center;
  vertical-align: middle;
  line-height: 15px;
  position: relative;
  outline: none;
}
table input[type="checkbox"]::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  background: #fff;
  width: 100%;
  height: 100%;
  border: 1px solid #cacdcf;
}
table input[type="checkbox"]:checked::before {
  content: "\2713";
  background-color: #fff;
  color: #000;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  border: 1px solid #2196f3;
  font-size: 12px;
  font-weight: bold;
  outline: none;
}
table {
  width: 100%;
  overflow-x: auto;
  display: flex;
  flex-direction: column;
}
table tr {
  border-bottom: 1px solid #ccc;
  padding: 2px;
  margin-left: -2px;
  height: 45px;
  line-height: 45px;
  display: flex;
  font-size: 14px;
  color: #333;
  width: fit-content;
}
table tbody tr:last-child {
  margin-bottom: 55px;
}
table tr th,
td {
  flex: 1;
  text-align: center;
  min-width: 176px;
}
</style>
