<template>
  <n-form ref="formRef" :model="model" :rules="rules" size="large" :show-label="false">
    <n-form-item path="account">
      <n-input v-model:value="model.account" placeholder="请输入用户名" />
    </n-form-item>
    <n-form-item path="password">
      <n-input v-model:value="model.password" type="password" show-password-on="click" placeholder="请输入密码" />
    </n-form-item>
    <n-space :vertical="true" :size="24">
      <div class="flex-y-center justify-between">
        <n-checkbox v-model:checked="rememberMe">记住我</n-checkbox>
        <!-- <n-button :text="true" @click="toLoginModule('reset-pwd')">忘记密码？</n-button> -->
      </div>
      <n-button type="primary" size="large" :block="true" :round="true" :loading="auth.loginLoading"
        @click="handleSubmit">
        确定
      </n-button>
      <div class="flex-y-center justify-between">
        <div class="w-12px"></div>
        <n-button class="flex-1" :block="true" @click="toLoginModule('register')">
          {{ loginModuleLabels.register }}
        </n-button>
      </div>
    </n-space>
    <!-- <other-account @login="handleLoginOtherAccount" /> -->
  </n-form>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue';
import type { FormInst, FormRules } from 'naive-ui';
import { loginModuleLabels } from '@/constants';
import { useAuthStore } from '@/store';
import { useRouterPush } from '@/composables';
import { formRules } from '@/utils';
const auth = useAuthStore();
const { toLoginModule } = useRouterPush();
const formRef = ref<HTMLElement & FormInst>();
const { login } = auth;
const model = reactive({
  account: '13663995841',
  password: '123456'
});

const rules: FormRules = {
  account: formRules.account,
  password: formRules.password
};

const rememberMe = ref(false);

async function handleSubmit() {
  await formRef.value?.validate();
  const { account, password } = model;
  login(account, password);
}
</script>

<style scoped></style>
