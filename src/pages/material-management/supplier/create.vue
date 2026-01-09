<template>
    <div class="d-flex h-full w-full">
      <div class="right flex-1 flex-column h-full fill-bg">
        <el-form class="m-l-20 d-flex flex-1 create-content" ref="formRef" :model="form" label-width="120px" label-position="top" :rules="rules">
          <div class="create-left">
            <el-form-item class="from_item" :label="i18nM('material.label.name')" prop="name" required>
              <el-input v-model="form.name" maxlength="32" :placeholder="i18nM('material.placeholder.name')"></el-input>
            </el-form-item> 
            <el-form-item class="from_item" :label="i18nM('material.label.abbreviation')" prop="abbreviation" required>
              <el-input v-model="form.abbreviation" maxlength="32" :placeholder="i18nM('material.placeholder.abbreviation')"></el-input>
            </el-form-item>
            <el-form-item class="from_item" :label="i18nM('material.label.code')" prop="code" required>
              <el-input v-model="form.code" :placeholder="i18nM('material.placeholder.code')"></el-input>
            </el-form-item>
            <el-form-item class="from_item desc-wrap" :label="i18nM('material.table.contacts')" prop="contacts" required>
              <el-input v-model="form.contacts" :placeholder="i18nM('material.placeholder.contacts')" maxlength="16"></el-input>
            </el-form-item>
            <el-form-item class="from_item desc-wrap" :label="i18nM('material.table.phone')" prop="phone" required>
              <el-input v-model="form.phone" type="number" :placeholder="i18nM('material.placeholder.phone')"></el-input>
            </el-form-item>
             <el-form-item class="from_item desc-wrap" :label="i18nM('material.table.email')" prop="email" required>
              <el-input v-model="form.email" :placeholder="i18nM('material.placeholder.email')"> </el-input>
            </el-form-item>
            <el-form-item class="from_item" :label="i18nM('material.label.fax')" prop="fax">
              <el-input required v-model="form.fax" :placeholder="i18nM('material.placeholder.fax')"></el-input>
            </el-form-item>
          </div>
          <div class="m-l-40 create-right">
            <el-form-item class="from_item" :label="i18nM('material.label.mainBusiness')" prop="mainBusiness">
              <el-input maxlength="32" v-model="form.mainBusiness" :placeholder="i18nM('material.placeholder.mainBusiness')"></el-input>
            </el-form-item>
            <el-form-item class="from_item" :label="i18nM('material.label.address')" prop="address">
              <el-input maxlength="32" v-model="form.address" :placeholder="i18nM('material.placeholder.address')"></el-input>
            </el-form-item>
            <div class="level-status from_item">
                <el-form-item class="flex-1" :label="i18nM('material.table.status')" prop="status" required>
                    <el-select v-model="form.status" :placeholder="i18nM('material.placeholder.status')">
                        <el-option v-for="item of [
                            { id:1,name: i18nM('material.enumValue.normal')},
                            { id:0,name: i18nM('material.enumValue.deactivate')}
                        ]" :value="item.id" :key="item.id" :label="item.name"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item class="flex-1" :label="i18nM('material.label.level')" prop="level" required>
                    <el-select v-model="form.level" :placeholder="i18nM('material.placeholder.level')">
                        <el-option v-for="item of [
                            { id:1,name:'A'},
                            { id:2,name:'B'},
                            { id:3,name:'C'},
                            { id:4,name:'D'}
                        ]" :value="item.id" :key="item.id" :label="item.name"></el-option>
                    </el-select>
                </el-form-item>
            </div>
            <el-form-item class="from_item" :label="i18nM('material.label.notes')" prop="notes" required>
                <el-input v-model="form.notes" maxlength="64" :placeholder="i18nM('material.placeholder.notes')"></el-input>
            </el-form-item>
          </div>
        </el-form>
        
        <div class="zc-footer p-r-20 p-l-20 d-flex align-items-center justify-content-end create-footer">
          <div>
            <el-button :type="'primary'" class="m-r-16 w-80" @click="saveFn()">{{ i18nM('material.button.save') }}</el-button>
            <el-button class="w-80" plain @click="back()">{{ i18nM('material.button.back') }}</el-button>
          </div>
        </div>
      </div>      
    </div>
</template>
<script setup lang="ts">
import { ElMessage } from "element-plus";
import { ref, reactive, onMounted, computed } from "vue";
import { supplierInformationSave } from "@functions/serviceCenter/material-management/api/supplierInformation";
const i18nM = window.$i18nM;

const formRef = ref();
const props = defineProps<{
  info: any;
  saveFn: () => void;
  back: () => void;
}>();
interface Form{
  name: string;
  abbreviation:string;
  code:string;
  contacts: string;
  phone: string;
  email: string;
  fax: string;
  mainBusiness: string;
  address: string;
  status: number;
  level: number;
  notes: string;
}
const form = reactive<Form>({
    name:"",
    abbreviation:"",
    code:"",
    contacts: "",
    phone: "",
    email: "",
    fax: "",
    mainBusiness: "",
    address: "",
    status: 1,
    level: 1,
    notes: ""
});
const rules = computed(() => {
  return {
    name: [{ required: true, message: i18nM('material.placeholder.name') }],
    code: [
      { required: true, message: i18nM('material.placeholder.code') },
      { 
        pattern:/^[a-zA-Z0-9]*$/,
        message: i18nM('material.message.englishAndNumber'),
        trigger: ['blur', 'change']
      }
    ],
    abbreviation: [{ required: true, message: i18nM('material.placeholder.abbreviation') }],
    contacts: [{ required: true, message: i18nM('material.placeholder.contacts') }],
    phone: [
      { required: true, message: i18nM('material.placeholder.phone'), trigger: 'blur' },
      { 
        pattern: /^1(3[0-9]|4[01456879]|5[0-35-9]|6[2567]|7[0-8]|8[0-9]|9[0-35-9])\d{8}$/,
        message: i18nM('material.message.phoneFormat'),
        trigger: ['blur', 'change']
      }
    ],
    email: [
      { required: true, message: i18nM('material.placeholder.email'), trigger: 'blur' },
      { 
        pattern: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/,
        message: i18nM('material.message.emailFormat'),
        trigger: 'blur'
      }
    ],
    notes: [{ required: true, message: i18nM('material.placeholder.notes') }]
  }
})
onMounted(() => {
  if(props.info.id){
    form.name = props.info.name;
    form.abbreviation = props.info.simpleNo;
    form.code = props.info.supplierNo;
    form.contacts = props.info.linkMan;
    form.phone = props.info.phone;
    form.email = props.info.email;
    form.fax = props.info.fax;
    form.mainBusiness = props.info.mainBusiness;
    form.address = props.info.address;
    form.status = props.info.status;
    form.level = props.info.level;
    form.notes = props.info.description;
  }
});

const save = (cb: Function) => {
  formRef.value.validate((valid: boolean) => {
    if (valid) {
        const obj = {
            projectId: props.info.projectId,
            supplierNo: form.code,
            simpleNo: form.abbreviation,
            name: form.name,
            address: form.address,
            mainBusiness: form.mainBusiness,
            level: form.level,
            linkMan: form.contacts,
            phone: form.phone,
            fax: form.fax,
            email: form.email,
            status: form.status,
            description: form.notes
        }
        if(props.info.id){
            Object.assign(obj,{id:props.info.id});
        }
        supplierInformationSave(obj,()=>{
            cb();
        })
    }
    else{
      ElMessage({type:"error",message:i18nM('material.message.complete')});
    }
  })
  
};

defineExpose({
  save,
});
</script>
<style scoped lang="scss">
@use "@static/css/common/size.scss" as *;
  .from_item {
    width: zrem(400);
  }
  .level-status{
    display:flex;
    justify-content: space-between;
    gap:zrem(30);
  }
.create-content{
  display:flex;
  height:93%;
  .create-left{
    width:zrem(400);
    .option-large-list {
      border: zrem(1) solid var(--el-border-color-lighter);
      padding: zrem(20) zrem(10);
      border-radius: zrem(8);
      box-sizing: border-box;
      width: zrem(900);
      height: zrem(450);
      position: relative;
      .option-large-disabled {
        position: absolute;
        width: 100%;
        height: 100%;
        left: 0;
        top: 0;
        opacity: 0.2;
        z-index: 2;
        background: var(--el-mask-color);
      }
      .option-large-item {
        display: inline-block;
        width: 50%;
        margin-bottom: zrem(6);
      }
      .option-large-item-active {
        .option-large-name {
          color: var(--el-color-primary);
        }
      }
    }
  }
  .create-right{
    flex:1;
    .themeImgShow{
      width: 100%;
      height: 60%;
      img{
        width:auto;
        height:100%;
      }
    }
  }
}
</style>