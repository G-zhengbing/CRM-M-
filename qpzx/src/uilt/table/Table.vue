<template>
  <table>
    <thead>
      <tr>
        <th
          :style="clStyle(column.width,column.text)"
          v-for="(column,index) in columns"
          :key="index"
          class="po_re"
        >
          <template v-if="column.type=='selection'">
            <input v-model="selection" @click="selectAll($event)" type="checkbox">
          </template>
          <template v-else-if="column.type=='index'">#</template>
          <template v-else-if="column.type=='action'">action</template>
          <template v-else-if="column.sortable">
            {{column.title}}
            <p class="top" @click="sortClk(column.key)"></p>
            <p class="bottom" @click="sortClks(column.key)"></p>
          </template>
          <template v-else>{{column.title}}</template>
        </th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(item,i) in data" :key="i">
        <td v-for="(column,index) in columns" :key="index">
          <template v-if="column.type=='selection'">
            <input v-model="checkedAll" type="checkbox" :value="item">
          </template>
          <template v-else-if="column.type=='index'">{{i+1}}</template>
          <template v-else-if="column.type=='action'">
            <zx-btn
              v-for="(items,q) in column.buttons"
              :key="q"
              :type="items.type"
              @click="items.click(item)"
              class="is-small"
            >{{items.text}}</zx-btn>
          </template>
          <template v-else-if="column.type=='img'">
            <zx-btn v-if="item.picture" class="is-small" @click="model(item.picture)">查看</zx-btn>
            <div v-else>暂无图片</div>
          </template>
          <template v-else>{{item[column.key]}}</template>
          <div class="loading" v-if="boolean" @click="boolean=false">
            <img :src="boolean" alt>
          </div>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script>
import ZxBtn from "./ZxBtn.vue";
export default {
  props: ["columns", "data"],
  data() {
    return {
      checkedAll: [],
      selection: false,
      boolean: false
      // clicks: false,
      // clickss:false
    };
  },
  methods: {
    model(a) {
      this.boolean = a;
    },
    sortClks(a) {
      // this.clickss = true;
      // this.clicks = false;
      this.sortAges(this.data, a);
    },
    sortClk(a) {
      // console.log();
      // this.clicks = true;
      // this.clickss = false;
      this.sortAgess(this.data, a);
    },
    sortAgess(array, key) {
      return array.sort(function(a, b) {
        var x = a[key];
        var y = b[key];
        return x < y ? -1 : x > y ? 1 : 0;
      });
    },
    sortAges(array, key) {
      return array.sort(function(a, b) {
        var x = a[key];
        var y = b[key];
        return x > y ? -1 : x < y ? 1 : 0;
      });
    },
    clStyle(kuan, jvzhong) {
      var style = {};
      if (jvzhong) {
        style["text-align"] = jvzhong;
      }
      if (kuan) {
        style.width = kuan + "px";
      }
      return style;
    },
    selectAll(e) {
      if (e.target.checked) {
        this.checkedAll = [...this.data];
      } else {
        this.checkedAll.length = 0;
      }
    }
  },
  computed: {},
  watch: {
    checkedAll(newVle, oldVle) {
      // console.log(this.data);
      if (this.checkedAll.length == this.data.length) {
        this.selection = true;
      } else {
        this.selection = false;
      }
      this.$emit("selection-change", this.checkedAll);
    }
  },
  components: {
    "zx-btn": ZxBtn
  }
};
</script>

<style scoped>
table tr {
  border-bottom: 1px solid #a0a0a0;
}
table {
  border: 1px solid #a0a0a0;
  width: 100%;
}
.loading {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 999;
  background-color: rgb(0, 0, 0, 0.5);
  color: #fff;
  bottom: 0;
  right: 0;
  display: flex;
  justify-content: center;
  align-items: center;
}
.po_re {
  position: relative;
}
/* th .acts {
    border-color: blue transparent transparent transparent;
}
th .act {
    border-color: transparent transparent blue transparent;
} */
.top {
  padding: 0;
  margin: 0;
  height: 0;
  width: 0;
  border-width: 7px;
  border-style: solid;
  border-color: transparent transparent #000 transparent;
  position: absolute;
  right: 15%;
  top: 12%;
}
.bottom {
  padding: 0;
  margin: 0;
  height: 0;
  width: 0;
  border-width: 7px;
  border-style: solid;
  border-color: #000 transparent transparent transparent;
  position: absolute;
  top: 50%;
  right: 15%;
}
</style>
