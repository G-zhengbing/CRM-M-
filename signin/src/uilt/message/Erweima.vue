<template>
  <div class="box">
    <div class="message">
      <img src="../../assets/e1.png" alt />
      <img src="../../assets/colse.png" alt @click="colse" class="colse" />
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  methods: {
    colse() {
      this.$parent.erweima = false;
    }
  }
};
</script>

<style scoped>
.message > img.colse {
  position: absolute;
  width: 30px;
  left: 50%;
  bottom: -50px;
  margin-left: -15px;
}
.message > img {
  width: 200px;
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