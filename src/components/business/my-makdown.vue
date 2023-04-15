<template>
  <div class="h-full">
    <n-card class="shadow-sm rounded-16px w-full h-full">
      <template #header>
        <n-icon-wrapper class="absolute right-50px" :border-radius="50">
          <n-icon size="20" class="flex-center" @click="emits('colse')">
            <icon-ant-design-close-outlined />
          </n-icon>
        </n-icon-wrapper>
        <div>
          <div style="font-size:20px">
            编辑内容
          </div>
          <n-form inline ref="formRef" :label-width="80" :model="fileInfo" size="small">
            <n-space>
              <n-form-item label="标题" path="title" :rule="{ required: true }">
                <n-input v-model:value="fileInfo.title" placeholder="输入标题" />
              </n-form-item>
              <n-form-item label="描述" :rule="{ required: true }" path="description">
                <n-input v-model:value="fileInfo.description" placeholder="输入描述" />
              </n-form-item>
            </n-space>
          </n-form>
        </div>
        <!-- <slot name="header"></slot> -->
        <!-- class="absolute top-100px right-40px" -->
        <n-button :loading="uploadLoading" @click="handleUploadMd" type="warning" size="small">上传</n-button>
      </template>
      <div :style="{ overflow: 'auto', height: '420px' }" class="md">
        <div v-if="loading" class="flex-center w-full h-full">
          <n-spin size="large">
          </n-spin>
        </div>
        <div v-show="!loading" ref="domRef"></div>
      </div>
    </n-card>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch, reactive } from 'vue';
import Vditor from 'vditor';
import 'vditor/dist/index.css';
import { useThemeStore } from '@/store';
import { getMd, uploadMd, updateMd } from "@/service/simple/file"
import { time } from 'console';
import { file } from '@babel/types';
const loading = ref(false);
const uploadLoading = ref(false)
const props = defineProps(['userId', 'fileId', 'newFile', 'title', 'description'])
const emits = defineEmits(['colse', 'search'])
const fileInfo = reactive({
  title: props.title,
  description: props.description
})
const theme = useThemeStore();
const formRef = ref();
const vditor = ref<Vditor>();
const domRef = ref<HTMLElement>();
async function renderVditor(newFile: Boolean) {
  if (!domRef.value) return;
  //这里写在对应的value选项中初始化成功
  loading.value = true;
  let markdown = ''
  if (!newFile) {
    let res = await getMd(props.fileId);
    markdown = res.data;
  }

  vditor.value = new Vditor(domRef.value, {
    minHeight: 400,
    theme: theme.darkMode ? 'dark' : 'classic',
    icon: 'material',
    //设置缓存,如果不一样则清除缓存
    // cache: {
    //   enable: true,
    //   id:"f1231ffdl"
    // },
    cache: {
      enable: false
    },
    value: markdown,
    // input: (value) => {
    //   // 这个选项监听输入的内容
    //   content = value
    //   console.log(value)
    // },
    // after: () => {
    //   //这个选项中vditor以及实例化后调用
    //   // vditor.value is a instance of Vditor now and thus can be safely used here
    //   vditor.value?.setValue(content);
    //   //可以通过value选项直接设置默认内容
    // },
    after: () => {
      loading.value = false
    }
  });
}

const stopHandle = watch(
  () => theme.darkMode,
  newValue => {
    const themeMode = newValue ? 'dark' : 'classic';
    vditor.value?.setTheme(themeMode);
  }
);

onMounted(() => {
  renderVditor(props.newFile);
  if (props.newFile) {
    fileInfo.title = '';
    fileInfo.description = ''
  }
});

onUnmounted(() => {
  stopHandle();
});
const handleUploadMd = async () => {
  await formRef.value.validate()
  uploadLoading.value = true;
  let markdown = vditor.value?.getValue();
  const blob = new Blob([markdown], { type: 'text/markdown;charset=utf-8' });
  const formData = new FormData();
  formData.append('uploadFile', blob, 'upload.md');
  formData.append('title', fileInfo.title);
  formData.append('description', fileInfo.description);
  formData.append('userId', props.userId);
  let res;
  if (!props.newFile) {
    formData.append('fileId', props.fileId);
    res = await updateMd(formData)
  }
  else {
    res = await uploadMd(formData)
  }
  uploadLoading.value = false
  console.log(res)
  let { code, message } = res.data;
  if (code == 200) {
    window.$message?.success(props.newFile ? "新建成功" : "更新成功" + message);
  }
  else {
    window.$message?.error(props.newFile ? "新建失败" : "更新失败" + message)
  }
  //关闭窗口
  setTimeout(()=>{
    emits('colse')

    //刷新数据
    emits('search')
  },300)

}

</script>

<style scoped>
.md {
  border: 1px solid gainsboro;
}
</style>
