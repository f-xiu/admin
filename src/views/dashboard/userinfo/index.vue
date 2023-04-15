<template>
  <n-card :bordered="false" class="rounded-16px shadow-sm" :class="{ 'bg-white': !theme.darkMode }">
    <n-form :model="userinfo" ref="userFormRef" :rules="rules" size="small" label-placement="left"
      :show-require-mark="false">
      <n-space vertical :size="10">
        <div class="flex-y-center mb-6">
          <icon-local-avatar class="text-90px" />
          <div class="pl-12px">
            <n-form-item path="name" label="昵称:">
              <n-input v-model:value="userinfo.name" type="text" size="tiny" />
            </n-form-item>
            <div>
              <n-space class="flex-y-center">
                <span>账号:</span>
                {{ userinfo.account }} <n-button type="tertiary" @click="openModal = true">密码修改</n-button>
              </n-space>
            </div>
          </div>
        </div>
        <div class="flex-y-center line">
          <n-form-item path="email" label="邮箱:">
            <n-input v-model:value="userinfo.email" type="text" size="tiny" />
          </n-form-item>
        </div>
        <div class="flex-y-center line">
          <n-form-item label="生日:">
            <n-date-picker value-format="yyyy-MM-dd" v-model:formatted-value="userinfo.date" type="date" />
          </n-form-item>
        </div>
        <div class="flex-y-center line">
          <n-form-item label="余额:">
            <n-input-number v-model:value="userinfo.money" :precision="2" :min="0">
              <template #suffix>¥(元)</template>
            </n-input-number>
          </n-form-item>
        </div>
        <n-space :size="20">
          <n-button type="warning" @click="setDefaultUserInfo">
            重置
          </n-button>
          <n-button type="info" @click="handleChangeInfo">
            提交修改
          </n-button>
        </n-space>
      </n-space>
    </n-form>
    <n-modal v-model:show="openModal">
      <n-card style="width: 400px" title="修改密码" :bordered="false" size="huge" role="dialog" aria-modal="true">
        <n-form :model="passwords" ref="pwdFormRef" :rules="rules" size="small" label-placement="left"
          :show-require-mark="false" label-width="auto">
          <n-form-item path="oldPasswd" rule-path="password" label="旧密码:">
            <n-input v-model:value="passwords.oldPasswd" type="password" show-password-on="click" size="tiny" />
          </n-form-item>
          <n-form-item path="newPasswd" rule-path="password" label="新密码:">
            <n-input v-model:value="passwords.newPasswd" type="password" show-password-on="click" size="tiny" />
          </n-form-item>
          <n-form-item path="againPasswd" rule-path="confirmPsw" label="再次输入:">
            <n-input v-model:value="passwords.againPasswd" type="password" show-password-on="click" size="tiny" />
          </n-form-item>
          <n-button type="primary" size="medium" :block="true" :round="true" @click="handleSubmit">
            确定
          </n-button>
        </n-form>
      </n-card>
    </n-modal>
  </n-card>
</template>
<script lang="ts" setup>
import { onMounted, ref, reactive, toRefs } from 'vue'
import { getUserInfo, changeUserInfo, changePasswd } from "@/service/simple/user"
import type { FormInst, FormRules } from 'naive-ui';
import { formRules, getConfirmPwdRule } from '@/utils';
import { useAuthStore } from '~/src/store';
import { localStg } from '@/utils'
import { useThemeStore } from '@/store';
const theme = useThemeStore()
const auth = useAuthStore()
const openModal = ref(false)
const pwdFormRef = ref<HTMLElement & FormInst>()
const userFormRef = ref<HTMLElement & FormInst>()
const userinfo = ref({
  account: "",
  avatar: null,
  date: null,
  email: "",
  money: 0.00,
  name: ""
});
const passwords = reactive({
  oldPasswd: '',
  newPasswd: '',
  againPasswd: ''
})
const rules: FormRules = {
  name: formRules.name,
  email: formRules.email,
  money: formRules.money,
  password: formRules.password,
  confirmPsw: getConfirmPwdRule(toRefs(passwords).newPasswd)
};
onMounted(() => {
  //访问接口获取用户个人信息
  //通过sessionId直接得到对应数据
  getUserInfo(auth.userInfo.userId).then(res => {
    userinfo.value = res.data.data;
  });
});
const handleChangeInfo = async () => {
  await userFormRef.value?.validate()
  changeUserInfo(userinfo.value).then((res) => {
    auth.userInfo.userName = res.data.data.name
    let { name, id } = res.data.data;
    localStg.set('userInfo', {
      userId: id,
      userName: name,
      userRole: 'admin'
    })
    window.$message?.success("修改成功")
  }, (err) => {
    if (err) {
      window.$message?.error("请求错误")
    }
  })
}
const handleSubmit = async () => {
  await pwdFormRef.value?.validate();
  changePasswd({
    id: auth.userInfo.userId,
    oldPasswd: passwords.oldPasswd,
    newPasswd: passwords.newPasswd
  }).then((res) => {
    console.log(res)
    let { code, message } = res.data
    if (code == 200) {
      window.$message?.success("密码修改成功")
      openModal.value = false;
    }
    else {
      window.$message?.error("修改失败," + message)
    }
  })
}
const setDefaultUserInfo = () => {
  getUserInfo().then(res => {
    userinfo.value = res.data.data;
    window.$message?.success("重置成功")
  });

}
</script>
<style scoped>
.label-w {
  min-width: 40px;
}

.line {
  width: 40%;
  min-width: 200px;
}
</style>