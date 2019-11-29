<template>
  <div id="wangeditor">
    <div ref="editorElem" style="text-align:left;"></div>
  </div>
</template>
<script>
import E from "wangeditor";
export default {
  data() {
    return {
      editor: null,
      editorContent: ""
    };
  },
  // catchData是一个类似回调函数，来自父组件，当然也可以自己写一个函数，主要是用来获取富文本编辑器中的html内容用来传递给服务端
  props: ["catchData"], // 接收父组件的方法
  mounted() {
    this.editor = new E(this.$refs.editorElem);
    this.editor.customConfig.uploadImgShowBase64 = true
    // 编辑器的事件，每次改变会获取其html内容
    this.editor.customConfig.onchange = html => {
      this.editorContent = html;
      this.catchData(this.editorContent); // 把这个html通过catchData的方法传入父组件
      console.log(this.editorContent)
      console.log(this.editor.txt.text());
    };
    this.editor.customConfig.menus = [
      // 菜单配置
      "head", // 标题
      "bold", // 粗体
      "italic", // 斜体
      "underline", // 下划线
      "strikeThrough", // 删除线
      "link", // 插入链接
      "list", // 列表
      "justify", // 对齐方式
      "image", // 插入图片
      "table", // 表格
      "undo", // 撤销
      "redo" // 重复
    ];
    // this.editor.customConfig.uploadImgMaxLength = 5; // 限制一次最多上传 5 张图片
    // this.editor.customConfig.uploadImgMaxSize = 3 * 1024 * 1024; // 将图片大小限制为 3M 默认为5M
    // this.editor.customConfig.customUploadImg = async (files, insert) => {
    //   /* files 是 input 中选中的文件列表 */

    //   let formData = new FormData();
    //   formData.append("file", files[0]);
    //   console.log(formData)
    //   let data = await this.upload(formData);
    //   /* upload方法是后台提供的上传图片的接口 */
    //   /* insert 是编辑器自带的 获取图片 url 后，插入到编辑器的方法 上传代码返回结果之后，将图片插入到编辑器中*/

    //   insert(data.imgUrl);
    // };
    this.editor.create(); // 创建富文本实例
    // var json = editor.txt.getJSON(); // 获取 JSON 格式的内容
    // var jsonStr = JSON.stringify(json);
    // console.log(json);
    // console.log(jsonStr);
  }
};
</script>