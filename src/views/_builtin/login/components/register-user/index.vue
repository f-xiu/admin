<template>
  <n-form ref="formRef" :model="model" :rules="rules" size="large" :show-label="false">
    <n-form-item path="account">
      <n-input v-model:value="model.account" placeholder="账户" />
    </n-form-item>
    <n-form-item path="name">
      <n-input v-model:value="model.name" type="text" placeholder="昵称" />
    </n-form-item>
    <n-form-item path="email">
      <n-input v-model:value="model.email" placeholder="邮箱" />
    </n-form-item>
    <n-form-item class="item_date">
      <div class="date-tag">出生日期:</div>
      <n-date-picker v-model:value="model.date" type="date" />
    </n-form-item>
    <n-form-item path="password">
      <n-input v-model:value="model.password" type="password" show-password-on="click" placeholder="密码" />
    </n-form-item>

    <n-space :vertical="true" :size="18">
      <login-agreement v-model:value="agreement" />
      <n-button type="primary" size="large" :block="true" :round="true" @click="handleSubmit">确定</n-button>
      <n-button size="large" :block="true" :round="true" @click="toLoginModule('pwd-login')">返回</n-button>
    </n-space>
  </n-form>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue';
import type { FormInst, FormRules } from 'naive-ui';
import { useRouterPush } from '@/composables';
import { formRules } from '@/utils';
import { registerAPI } from '@/service/simple/user'
import { router } from '~/src/router';
const { toLoginModule } = useRouterPush();

const formRef = ref<HTMLElement & FormInst>();

const model = reactive({
  account: '',
  password: '',
  email: '',
  name: '',
  date: null
});

const rules: FormRules = {
  account: formRules.account,
  password: formRules.password,
  name: formRules.name,
  email: formRules.email
};

const agreement = ref(false);

async function handleSubmit() {
  await formRef.value?.validate();
  if (agreement.value == false) {
    window.$message?.warning('请勾选用户协议及隐私权策略！');
    return;
  }
  //调用注册接口
  console.log(model)
  registerAPI(model).then(res => {
    let { code, message } = res.data
    if (code == 200) {
      //注册成功,跳转到登录页
      window.$message?.success("注册成功")
      router.push('/login')
    }
    else {
      window.$message?.error("注册失败" + message)
    }
  })
}
</script>

<style>
.item_date {
  display: flex;
  margin-bottom: 26px;
  width: 100%;
}

.n-form-item .n-form-item-blank {
  width: 100%;
}

.n-form-item .n-form-item-blank>div {
  flex: 4;
}

.date-tag {
  color: grey;
  height: 40px;
  line-height: 40px;
  margin-right: 10px;
  flex: 1 !important;
}
</style>
