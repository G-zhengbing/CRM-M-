<template>
  <div class="shade">
    <Card>
      <p slot="title">新建/编辑广告</p>
      <p slot="extra" class="extra" @click="close">×</p>
      <p class="contanner">
        <Form ref="form" :model="form" :rules="ruleValidate" :label-width="80">
        <FormItem label="专题标题" prop="name">
          <Input v-model="form.name" placeholder="请输入专题标题"></Input>
        </FormItem>
        <FormItem label="副标题" prop="name">
          <Input v-model="form.name" placeholder="请输入副标题"></Input>
        </FormItem>
        <FormItem label="缩略图" prop="img">
          <div class="demo-upload-list" v-for="item in uploadList">
            <template v-if="item.status === 'finished'">
              <img src="https://sponsor-static.segmentfault.com/d1d105c21266790a27e85dd47f309ed4.jpeg" />
              <div class="demo-upload-list-cover">
                <Icon type="ios-eye-outline" @click.native="handleView(item.name)"></Icon>
                <Icon type="ios-trash-outline" @click.native="handleRemove(item)"></Icon>
              </div>
            </template>
            <template v-else>
              <Progress v-if="item.showProgress" :percent="item.percentage" hide-info></Progress>
            </template>
          </div>
          <Upload
            name="fileImg"
            ref="upload"
            :show-upload-list="false"
            :on-success="handleSuccess"
            :format="['jpg','png']"
            :max-size="2048"
            :on-format-error="handleFormatError"
            :on-exceeded-size="handleMaxSize"
            :before-upload="handleBeforeUpload"
            :on-progress="handleProgress"
            multiple
            type="drag"
            action="//jsonplaceholder.typicode.com/posts/"
            style="display: inline-block;width:58px;">
            <div style="width: 58px;height:58px;line-height: 58px;">
              <Icon type="ios-camera" size="20"></Icon>
            </div>
          </Upload>
          <p>只能上传jpg/png格式文件，文件不能超过2M，图片尺寸：180px * 180px</p>
          <Modal title="查看图片" v-model="visible">
            <img src="https://sponsor-static.segmentfault.com/d1d105c21266790a27e85dd47f309ed4.jpeg" v-if="visible" style="width: 100%">
          </Modal>
        </FormItem>
				<Wangeditor  :catchData="catchData"/>
        <FormItem label="状态" prop="status" class="label-left">
          <RadioGroup v-model="form.status">
            <Radio label="上线">上线</Radio>
            <Radio label="下线">下线</Radio>
          </RadioGroup>
        </FormItem>
        <FormItem>
          <Button type="primary" @click="handleSubmit('form')">确定</Button>
          <Button @click="handleReset('form')" style="margin-left: 8px">重置</Button>
        </FormItem>
    </Form>
      </p>
    </Card>
  </div>
</template>

<script>
import Wangeditor from '../../uilt/wangeditor/Wangeditor'
export default {
	components:{
		Wangeditor
	},
  data() {
    return {
      imgUrl:"",
        imgName: '',
        visible: false,
        uploadList: [],
      form: {
        name: '',
        status: '上线',
        sort: ''
      },
      ruleValidate: {
        name: [
          { required: true, message: '广告名称不能为空', trigger: 'blur' }
        ],
        sort: [
          { required: true, message: '排序规则不能为空', trigger: 'blur' }
        ]
      }
    };
  },
  methods: {
		catchData(val){
			console.log(val)
		},
    handleProgress (event, file, fileList) {
  console.log('上传中', event); // 继承了原生函数的 event 事件
  console.log('上传中 file', file); // 上传的文件
  console.log('上传中 fileList', fileList); // 上传文件列表包含file
      
  // uploadList 就是 原文档中的那个渲染的 uplist 是个数组，所以要把filelist 赋值给他
  this.uploadList = fileList
	 
  // 调用监听 上传进度 的事件
  event.target.onprogress = (event) => {
    let uploadPercent = parseFloat(((event.loaded / event.total) * 100).toFixed(2))	// 保留两位小数，具体根据自己需求做更改

    // 手动设置显示上传进度条 以及上传百分比
    file.showProgress = true
    file.percentage = uploadPercent
  }
},
    handleView (name) {
      this.imgName = name;
      this.visible = true;
    },
    handleRemove (file) {
      const fileList = this.$refs.upload.fileList;
      this.$refs.upload.fileList.splice(fileList.indexOf(file), 1);
    },
    handleSuccess (res, file) {
      console.log(res,file)
      // console.log(this.$refs)
      file.url = 'https://sponsor-static.segmentfault.com/d1d105c21266790a27e85dd47f309ed4.jpeg';
    },
    handleFormatError (file) {
      this.$Notice.warning({
        title: '文件格式不正确',
        desc: '文件' + file.name + '格式不正确，请选择jpg或png。'
      });
    },
    handleMaxSize (file) {
      // console.log(file)
      this.$Notice.warning({
        title: '超过档案大小限制',
        desc: '文件 ' + file.name + '太大了，不超过2M。'
      });
    },
    handleBeforeUpload (file) {
      var fileData = new FormData();
      fileData.append('file', file);
      console.log(fileData.has("file"));//true
			console.log(fileData.get("file"));
      console.log(fileData)
      const check = this.uploadList.length < 3;
      if (!check) {
        this.$Message.error('最多只能上传三张图片');
      }
      return check;
    },
    close() {
      this.$parent.isSpeMessage = false;
    },
    handleSubmit (name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          this.$Message.success('Success!');
        } else {
          this.$Message.error('请完整填写正确信息');
        }
      })
    },
    handleReset (name) {
      this.$refs[name].resetFields();
    }
  },
  mounted () {
    this.uploadList = this.$refs.upload.fileList;
    console.log(this.$refs.upload)
  }
};
</script>

<style scoped>
.demo-upload-list{
  display: inline-block;
  width: 60px;
  height: 60px;
  text-align: center;
  line-height: 60px;
  border: 1px solid transparent;
  border-radius: 4px;
  overflow: hidden;
  background: #fff;
  position: relative;
  box-shadow: 0 1px 1px rgba(0,0,0,.2);
  margin-right: 4px;
}
.demo-upload-list img{
  width: 100%;
  height: 100%;
}
.demo-upload-list-cover{
  display: none;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0,0,0,.6);
}
.demo-upload-list:hover .demo-upload-list-cover{
  display: block;
}
.demo-upload-list-cover i{
  color: #fff;
  font-size: 20px;
  cursor: pointer;
  margin: 0 2px;
}
/*  */
.ivu-radio.ivu-radio-checked span{
  box-sizing: border-box;
}
.label-left{
  margin-left: -25px;
}
.contanner{
  margin: 20px 20px 20px 0;
}
.extra {
  font-size: 25px;
  cursor: pointer;
}
.shade {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
  background: rgba(0, 0, 0, 0.3);
}
.ivu-card.ivu-card-bordered {
  width: 1200px;
  height: 800px;
}
</style>