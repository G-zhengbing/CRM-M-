<template>
  <button @click="doClick" class="button" :class="clType">
    <slot></slot>
  </button>
</template>

<script scoped>
export default {
  props: {
    type: {
      type: String,
      default: "button"
    }
  },
  data() {
    return {};
  },
  methods: {
    doClick() {
      if (this.$listeners.click) {
        this.$listeners.click();
      }
    }
  },
  computed: {
    clType() {
      var btntype;
      switch (this.type) {
        case "success":
        case "warning":
        case "danger":
        case "info":
        case "link":
        case "primary":
        case "small":
          btntype = "is-" + this.type;
          break;
        default:
          btntype = "";
      }
      return btntype;
    }
  }
};
</script>

<style scoped>
.button {
  border: none;
  outline: none;
  background: #fff;
  margin-left: 10px;
  cursor: pointer;
  line-height: normal;
}
.is-primary {
  color: #ff0000;
  border-bottom: 1px solid #ff0000;
}
.is-info {
  color: #1b73b0;
  border-bottom: 1px solid #1b73b0;
}
.is-danger {
  color: #1b73b0;
  border-bottom: 1px solid #1b73b0;
}
.is-warning {
  color: #ff0000;
  border-bottom: 1px solid #ff0000;
}
.is-link {
  color: #ff0000;
  border-bottom: 1px solid #ff0000;
}
</style>
