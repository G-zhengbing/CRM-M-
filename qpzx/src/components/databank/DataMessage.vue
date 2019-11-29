<template>
  <div class="shade">
    <Card>
      <p slot="title">新建/编辑资料</p>
      <p slot="extra" class="extra" @click="close">×</p>
      <p class="contanner">
        <Form ref="form" :model="form" :rules="ruleValidate" :label-width="80">
        <FormItem label="资料名称" prop="materials_name">
          <Input v-model="form.materials_name" placeholder="请输入资料名称"></Input>
        </FormItem>
        <FormItem label="年级" prop="grade">
					<Select v-model="form.grade" placeholder="请选择">
						<Option :value="1">一年级</Option> 
						<Option :value="2">二年级</Option> 
						<Option :value="3">三年级</Option> 
						<Option :value="4">四年级</Option> 
						<Option :value="5">五年级</Option> 
						<Option :value="6">六年级</Option> 
						<Option :value="7">七年级</Option> 
						<Option :value="8">八年级</Option> 
						<Option :value="9">九年级</Option> 
					</Select>
        </FormItem>
				<FormItem label="科目" prop="subject">
					<Select v-model="form.subject" placeholder="请选择">
						<Option :value="1">数学</Option>
						<Option :value="2">英语</Option>
					</Select>
        </FormItem>
        <FormItem label="上传文件" prop="file_url">
          <input type="file" ref="file" @change="getFiles($event)" accept=".docx,.doc,.pdf" multiple="multiplt" name="file_url">
        </FormItem>
        <FormItem label="是否首页展示" prop="is_hot" class="label-left">
          <RadioGroup v-model="form.is_hot">
            <Radio label="1">是</Radio>
            <Radio label="0">否</Radio>
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
import { mapActions } from 'vuex'
import storage from '../../uilt/storage'
import axios from "axios"
export default {
  props:["item"],
  data() {
    return {
      addArr:[],
      form: {
        file_url:"",
        is_hot: '1'
      },
      ruleValidate: {
        materials_name: [
          { required: true, message: '资料名称不能为空', trigger: 'blur' }
        ],
        grade: [
          { required: true, message: '年级不能为空'}
        ],
        subject: [
          { required: true, message: '科目不能为空'}
        ]
      }
    };
  },
  methods: {
    ...mapActions(["addDataList","updataDataList","getDatabankList"]),
    getFiles(event){
      this.addArr.length = 0
      var file = event.target.files;
      for(var i = 0;i<file.length;i++){
        // 上传类型判断
        var imgName = file[i].name;
        var idx = imgName.lastIndexOf(".");  
        if (idx != -1){
          var ext = imgName.substr(idx+1).toUpperCase();   
          ext = ext.toLowerCase( ); 
            if (ext!='pdf' && ext!='doc' && ext!='docx'){
          }else{
            this.addArr.push(file[i]);
          }   
        }
      }
    },
    close() {
      this.$parent.isDataMessage = false;
    },
    handleSubmit (name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          if(this.$parent.isUpdata){
            this.updataDataList(this.form).then(res=>{
              this.$Message.success('修改成功');
              this.$parent.isDataMessage = false
            })
          }else{
            //新增课程
            var formData = new FormData();
            formData.append('materials_name', this.form.materials_name);
            formData.append('subject',this.form.subject);
            formData.append('grade',this.form.grade);
            formData.append('is_hot',this.form.is_hot);
            for(var i=0;i<this.addArr.length;i++){
              formData.append('file_url',this.addArr[i]);
            }
            let config = {
              headers: {
                'Content-Type': 'multipart/form-data',
                Authorization: "bearer " + storage.get()
              }
            };
            axios.post("http://192.168.1.101:3000/api/store_material",formData,config)
              .then((response) => {
                if(response.data.code == 100001 && response.data.error){
                  this.$Message.error(response.data.error);
                }
                if(response.data.code==200 && response.data.ret == true){
                  this.$Message.success("新增成功");
                  this.getDatabankList()
                  this.$parent.isDataMessage = false
                }
              })
            }
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
   this.form =  this.item
   console.log(this.form)
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
  height: 500px;
}
</style>