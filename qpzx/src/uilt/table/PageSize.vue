<template>
  <nav class="pagination" v-if="total >10">
    <button :disabled="currPage==1" @click="getPage('prev')" class="pagination-previous button">上一页</button>
    <div>
      <ul class="pagination-list" v-if="pagetotal<10">
        <li
          :class="{'is-current':page==currPage}"
          v-for="page in pagetotal"
          :key="page"
          @click="getPage(page)"
        >
          <a class="pagination-link">{{page}}</a>
        </li>
      </ul>
      <ul class="pagination-list" v-else>
        <li :class="{'is-current':1==currPage}" @click="getPage(1)">
          <a class="pagination-link">1</a>
        </li>
        <li
          class="pagination-ellipsis"
          @click="getPage(currPage-5)"
          v-if="currPage>=5&&pagetotal>7"
          title="上5页"
        >
          <span>&hellip;</span>
        </li>
        <li
          :class="{'is-current':page==currPage}"
          v-for="page in pages"
          :key="page"
          @click="getPage(page)"
        >
          <a class="pagination-link">{{page}}</a>
        </li>
        <li
          class="pagination-ellipsis"
          @click="getPage(currPage+5)"
          v-if="currPage+4<=pagetotal&&pagetotal>7"
          title="下5页"
        >
          <span>&hellip;</span>
        </li>
        <li :class="{'is-current':pagetotal==currPage}" @click="getPage(pagetotal)">
          <a class="pagination-link">{{pagetotal}}</a>
        </li>
      </ul>
    </div>
    <button
      :disabled="currPage==pagetotal"
      @click="getPage('next')"
      class="pagination-next button"
    >下一页</button>
  </nav>
</template>

<script scoped>
export default {
  props: {
    total: {
      type: Number,
      required: true
    },
    pageSize: {
      type: Number,
      default: 2
    },
    currentPage: {
      type: Number,
      default: 1
    }
  },
  data() {
    return {
      currPage: this.currentPage
    };
  },
  watch: {
    currentPage(num) {
      this.currPage = this.currentPage;
    }
  },
  methods: {
    getPage(page) {
      if (page == "prev") {
        this.currPage--;
      } else if (page == "next") {
        this.currPage++;
        if (this.currPage >= this.pagetotal) {
          this.currPage = this.pagetotal;
        }
      } else {
        this.currPage = page;
      }
      if (page < 1) {
        this.currPage = 1;
      }
      if (page > this.pagetotal) {
        this.currPage = this.pagetotal;
      }
      this.$emit("on-change", this.currPage);
    }
  },
  computed: {
    pagetotal() {
      return Math.ceil(this.total / this.pageSize);
    },
    pages() {
      let start = this.currPage - 2;
      let end = this.currPage + 2;
      if (start < 2) {
        start = 2;
      }
      if (end > this.pagetotal - 1) {
        end = this.pagetotal - 1;
      }
      let arr = [];
      for (var i = start; i <= end; i++) {
        arr.push(i);
      }
      return arr;
    }
  }
};
</script>

<style scoped>
.pagination ul li.is-current,
.pagination ul li.is-current a {
  background: #1b73b0;
  color: #fff;
}
.pagination ul li.pagination-ellipsis {
  width: 28px;
  height: 28px;
  text-align: center;
  line-height: 28px;
  cursor: pointer;
}
.pagination.pagesize ul li:last-child {
  margin-right: 28px;
}
.pagination.pagesize ul li:first-child {
  margin-left: 28px;
}
.pagination ul li:not(.pagination-ellipsis) {
  width: 28px;
  height: 28px;
  border: 1px solid #a0a0a0;
  color: #1b73b0;
  text-align: center;
  line-height: 28px;
  margin-left: 5px;
  box-sizing: border-box;
  cursor: pointer;
}
.pagination button {
  width: 101px;
  height: 35px;
  background-color: #1b73b0;
  outline: none;
  border: none;
  border-radius: 3px;
  color: #fff;
  font-size: 14px;
  cursor: pointer;
}
.pagination .pagination-list {
  display: flex;
  align-items: center;
  height: 100%;
}
.pagination {
  display: flex;
  justify-content: center;
}
</style>
