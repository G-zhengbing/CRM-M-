<template>
  <div class="box">
    <div v-if="type.classify == 'message'" class="message">
      <div class="messageOne">
        <div class="message-top">提示</div>
        <div class="message-content">{{type.text}}</div>
        <div class="message-bottom" @click="colse">
          <span>确定</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["type"],
  data() {
    return {};
  },
  methods: {
    colse() {
      this.$parent.show = false;
    }
  }
};
</script>

<style scoped>
.messageOne {
  width: 200px;
  height: 90px;
}
.message-content {
  text-align: center;
  color: #333;
  font-size: 12px;
}
.message-bottom {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  border-bottom-left-radius: 5px;
  border-bottom-right-radius: 5px;
  text-align: center;
  border-top: 1px solid #ccc;
  font-size: 15px;
  color: #42b4fc;
  height: 30px;
  line-height: 30px;
}
.message-top {
  margin-top: 15px;
  text-align: center;
  font-size: 14px;
  color: #000;
}
.message {
  background: #fff;
  border-radius: 5px;
  display: flex;
  flex-direction: column;
  position: relative;
  margin-bottom: 40px;
}
.box {
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.3);
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>