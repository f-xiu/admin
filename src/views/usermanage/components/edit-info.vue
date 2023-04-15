<template>
  <n-form ref="formRef" :model="model" :rules="rules" size="large" label-placement="left" label-width="auto"
    :show-require-mark="false">
    <div class="flex-y mb-5">
      <span class="mr-3">
        账户:
      </span>
      {{ model.account }}
    </div>
    <n-form-item path="name" label="昵称">
      <n-input v-model:value="model.name" type="text" />
    </n-form-item>
    <n-form-item path="email" label="邮箱">
      <n-input v-model:value="model.email" />
    </n-form-item>
    <n-form-item label="出生日期">
      <n-date-picker value-format="yyyy-MM-dd" v-model:formatted-value="model.date" type="date" />
    </n-form-item>
    <n-form-item path="password" label="密码">
      <n-input v-model:value="model.password" type="password" show-password-on="click" placeholder="密码" />
    </n-form-item>
    <n-form-item label="余额:" path="money">
      <n-input-number v-model:value="model.money" :precision="2" :min="0">
        <template #suffix>¥(元)</template>
      </n-input-number>
    </n-form-item>
    <n-space :size="18">
      <n-button type="primary" size="large" :block="true" :round="true" @click="handleSubmit">确定修改</n-button>
      <n-button size="large" :block="true" :round="true" @click="useReset">重置</n-button>
    </n-space>
  </n-form>
</template>
<script lang="ts" setup>
import { reactive, ref, onMounted } from 'vue';
import { FormInst, FormRules, NButton } from 'naive-ui';
import { formRules } from '@/utils';
import { changeUserInfoById } from '@/service/simple/user'
defineOptions({ name: 'editIfno' })
const props = defineProps({
  theRow: Object
})
const emits = defineEmits(['closeModal'])
const formRef = ref<HTMLElement & FormInst>();

const model = reactive({
  account: '',
  password: '',
  email: '',
  name: '',
  date: null,
  money: 0
});

const rules: FormRules = {
  account: formRules.account,
  password: formRules.password,
  name: formRules.name,
  email: formRules.email,
  money: formRules.money,
};
async function handleSubmit() {
  console.log(model)
  changeUserInfoById(model, props.theRow?.id).then(res => {
    let { code, message } = res.data
    if (code == 200) {
      window.$message?.success("修改成功")
      //关闭窗口
      //并重新加载
      emits('closeModal');
    }
    else {
      window.$message?.error("修改失败" + message + ",请重试")
    }

  })
}
const reset = () => {
  model.account = props.theRow?.account;
  model.password = props.theRow?.password;
  model.date = props.theRow?.date;
  model.name = props.theRow?.name;
  model.email = props.theRow?.email;
  model.money = props.theRow?.money;
}
const useReset = () => {
  reset();
  window.$message?.success("重置成功")
}
onMounted(() => {
  reset()
})
</script>