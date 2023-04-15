<template>
  <n-card title="用户信息">
    <n-space>
      <n-space vertical :size="20">
        <div class="flex">
          <icon-local-avatar class="text-90px  mr-20px" />
          <div class="flex-col justify-center [&>div]:mb-20px">
            <div v-for="item in data1" :key="item.label" class="flex flex-y-center w-60">
              <span class="w-10 mr-12px">{{ item.label }}</span>
              <n-skeleton v-if="ready" text class="w-40" />
              <span v-else>
                {{ item.value }}
              </span>
            </div>
          </div>
        </div>
        <div v-for="item in data2" :key="item.label" class="flex flex-y-center w-60">
          <span class="w-10 mr-12px">{{ item.label }}</span>
          <n-skeleton v-if="ready" text class="w-40" />
          <span v-else>
            {{ item.value }}
          </span>
        </div>
      </n-space>
      <n-space vertical>
        <div v-for="item in data3" :key="item.label" class="flex flex-y-center w-60">
          <span class="w-15 mr-12px">{{ item.label }}</span>
          <n-skeleton v-if="ready" text class="w-40" />
          <span v-else>
            {{ item.value }}
          </span>
        </div>
      </n-space>
    </n-space>
  </n-card>
</template>

<script setup lang="ts">
import { onMounted, ref, computed } from "vue"
const props = defineProps(['userinfo','number'])
const ready = ref(true)
const data1 = computed(() => [
  { label: "账户", value: props.userinfo?.account },
  { label: "昵称", value: props.userinfo?.name }
]);
const data2 = computed(() => [
  { label: "生日", value: props.userinfo?.date },
  { label: "邮箱", value: props.userinfo?.email },
  { label: "余额", value: props.userinfo?.money+"  元" }
]);
const data3 = computed(() => [
  { label: "文章数量", value: props.number+"  篇" }
])
onMounted(() => {
  setTimeout(() => {
    ready.value = false
  }, 500)
})
</script>

<style scoped></style>